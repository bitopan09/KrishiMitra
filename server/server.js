const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');

const { getWeather } = require('./services/weather');
const { getCropRecommendation } = require('./services/ai');
const districts = require('./data/districts.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Multer for ESP32-CAM image uploads (in-memory)
const upload = multer({ storage: multer.memoryStorage() });

// ─── Hardware State (in-memory) ────────────────────────────
let latestAdvisory = {
  soil: "Waiting...",
  weather: "Waiting...",
  crop: "Waiting...",
  ready: false,
  timestamp: null,
  imageCount: 0
};

// Heartbeat tracking — keyed by device name
const HEARTBEAT_TIMEOUT_MS = 15000; // 15 seconds
let lastHeartbeat = {}; // e.g. { esp_oled: <Date>, esp_cam: <Date> }

function isDeviceConnected(deviceName) {
  const ts = lastHeartbeat[deviceName];
  if (!ts) return false;
  return (Date.now() - ts) < HEARTBEAT_TIMEOUT_MS;
}

function anyDeviceConnected() {
  return Object.keys(lastHeartbeat).some(name => isDeviceConnected(name));
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
const clientPath = path.join(__dirname, '..', 'client');
console.log('📁 Serving static files from:', clientPath);
app.use(express.static(clientPath));

// ─── Software API Routes ───────────────────────────────────

/**
 * GET /api/districts
 * Returns list of all Assam districts for the dropdown
 */
app.get('/api/districts', (req, res) => {
  const districtList = Object.entries(districts).map(([key, val]) => ({
    id: key,
    name: val.name
  }));
  districtList.sort((a, b) => a.name.localeCompare(b.name));
  res.json({ districts: districtList });
});

/**
 * POST /api/recommend
 * Main endpoint — takes farmer input, fetches weather, calls AI, returns recommendations
 */
app.post('/api/recommend', async (req, res) => {
  try {
    const { district, soil, season, water, budget, lang } = req.body;

    // Validate required fields
    if (!district || !soil || !season || !water || !budget) {
      return res.status(400).json({
        error: 'All fields are required: district, soil, season, water, budget'
      });
    }

    // Look up district coordinates
    const districtData = districts[district];
    if (!districtData) {
      return res.status(400).json({
        error: `District "${district}" not found. Use /api/districts for valid options.`
      });
    }

    console.log(`\n🌾 New recommendation request:`);
    console.log(`   District: ${districtData.name}`);
    console.log(`   Soil: ${soil}, Season: ${season}, Water: ${water}, Budget: ${budget}`);

    // Step 1: Fetch live weather data
    console.log('   ⛅ Fetching weather data...');
    const weather = await getWeather(districtData.lat, districtData.lng);
    console.log(`   ✅ Weather: ${weather.current_temp}°C, ${weather.description}, ${weather.weekly_rainfall_mm}mm rain`);

    // Step 2: Get AI crop recommendation
    console.log('   🤖 Getting AI recommendation...');
    const recommendation = await getCropRecommendation(
      { district: districtData.name, soil, season, water, budget, lang: lang || 'en' },
      weather
    );
    console.log(`   ✅ Got ${recommendation.recommendations.length} crop recommendations`);

    // Return combined response
    res.json({
      success: true,
      district: districtData.name,
      weather,
      ...recommendation
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      error: error.message || 'Something went wrong. Please try again.'
    });
  }
});

// ─── Hardware API Routes ───────────────────────────────────

/**
 * POST /api/heartbeat
 * ESP devices call this endpoint periodically to signal they are alive.
 * Body: { "device": "esp_oled" } or { "device": "esp_cam" }
 */
app.post('/api/heartbeat', (req, res) => {
  const device = (req.body && req.body.device) ? req.body.device : 'unknown';
  lastHeartbeat[device] = Date.now();
  console.log(`💓 Heartbeat from ${device}`);
  res.status(200).json({ ok: true });
});

/**
 * POST /api/upload-soil
 * ESP32-CAM uploads a soil image here. We process it with Gemini Vision AI in the background.
 * Also counts as a heartbeat for esp_cam.
 */
app.post('/api/upload-soil', upload.single('imageFile'), (req, res) => {
  if (!req.file) return res.status(400).send('No image uploaded');

  // Treat an upload as a heartbeat for the CAM
  lastHeartbeat['esp_cam'] = Date.now();

  latestAdvisory.imageCount++;
  console.log(`\n📷 Image #${latestAdvisory.imageCount} received from ESP32-CAM! (${(req.file.size / 1024).toFixed(1)} KB)`);

  // Respond immediately so the ESP-CAM doesn't time out
  res.status(200).send("Image received");

  // Process AI in the background (fire-and-forget)
  const base64Image = req.file.buffer.toString('base64');
  processImageWithAI(base64Image, req.file.mimetype);
});

/**
 * GET /api/latest-advisory
 * Returns the latest structured advisory plus live connection status.
 */
app.get('/api/latest-advisory', (req, res) => {
  res.json({
    ...latestAdvisory,
    espConnected: anyDeviceConnected(),
    devices: {
      esp_oled: isDeviceConnected('esp_oled'),
      esp_cam:  isDeviceConnected('esp_cam')
    }
  });
});

/**
 * Process soil image with Gemini Vision AI (runs in background)
 */
async function processImageWithAI(base64Image, mimetype) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
      console.error('OpenRouter API key not configured');
      return;
    }

    const dataURI = `data:${mimetype};base64,${base64Image}`;

    // Fetch Weather Data (Guwahati coords as default)
    const lat = 26.1445, lon = 91.7362;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=precipitation_sum&timezone=Asia/Kolkata`;
    const weatherRes = await axios.get(weatherUrl);
    const current = weatherRes.data.current_weather;

    // Build weather summary
    const daily = weatherRes.data.daily;
    let rainyDays = 0;
    if (daily && daily.precipitation_sum) {
      rainyDays = daily.precipitation_sum.filter(p => p > 0.5).length;
    }

    console.log('   🤖 Analyzing soil image with Gemini Vision...');

    // Call OpenRouter Vision API
    const aiResponse = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are KrishiMitra, an expert agronomist in Assam.
Look at this soil image. Current weather: ${current.temperature}°C, wind ${current.windspeed}km/h, ${rainyDays} rainy days in the next week.

Reply ONLY with this exact JSON format, nothing else:
{"soil":"<soil type in 3-5 words>","weather":"<weather outlook in 5-8 words>","crop":"<one best crop + 3-5 word reason>"}`
            },
            { type: 'image_url', image_url: { url: dataURI } }
          ]
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://krishimitra.vercel.app',
        'X-Title': 'KrishiMitra - Soil Analysis'
      },
      timeout: 30000
    });

    const rawText = aiResponse.data.choices[0].message.content.trim();
    console.log('   📝 AI raw:', rawText);

    // Parse JSON from AI response (handle markdown code blocks)
    let cleaned = rawText;
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    }
    const objectMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objectMatch) cleaned = objectMatch[0];

    const parsed = JSON.parse(cleaned);
    latestAdvisory = {
      soil: parsed.soil || "Unknown",
      weather: parsed.weather || `${current.temperature}°C, ${rainyDays} rainy days`,
      crop: parsed.crop || "No suggestion",
      ready: true,
      timestamp: new Date().toISOString(),
      imageCount: latestAdvisory.imageCount
    };
    console.log('   ✅ Advisory updated:', latestAdvisory);

  } catch (error) {
    console.error('   ❌ AI processing error:', error.response ? error.response.data : error.message);
  }
}

// ─── Common Routes ─────────────────────────────────────────

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KrishiMitra API',
    hardware_ready: latestAdvisory.ready,
    timestamp: new Date().toISOString()
  });
});

// Fallback — serve frontend for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// ─── Start Server ──────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🌾 KrishiMitra Server running on http://localhost:${PORT}`);
  console.log(`   Software API: http://localhost:${PORT}/api/recommend`);
  console.log(`   Hardware API: http://localhost:${PORT}/api/upload-soil`);
  console.log(`   Advisory:     http://localhost:${PORT}/api/latest-advisory`);
  console.log(`   Health:       http://localhost:${PORT}/health\n`);
});
