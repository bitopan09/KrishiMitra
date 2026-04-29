const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const { getWeather } = require('./services/weather');
const { getCropRecommendation } = require('./services/ai');
const districts = require('./data/districts.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
const clientPath = path.join(__dirname, '..', 'client');
console.log('📁 Serving static files from:', clientPath);
app.use(express.static(clientPath));

// ─── API Routes ────────────────────────────────────────────

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

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KrishiMitra API',
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
  console.log(`   API: http://localhost:${PORT}/api/recommend`);
  console.log(`   Health: http://localhost:${PORT}/health\n`);
});
