require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Configure Multer to store uploaded images in memory
const upload = multer({ storage: multer.memoryStorage() });

// Structured advisory for the OLED (3 pages)
let latestAdvisory = {
    soil: "Waiting...",
    weather: "Waiting...",
    crop: "Waiting...",
    ready: false
};
let imageCount = 0;

// Background function to process the image with AI (non-blocking)
async function processImageWithAI(base64Image, mimetype) {
    try {
        const dataURI = `data:${mimetype};base64,${base64Image}`;

        // Fetch Weather Data (Guwahati coords)
        const lat = 26.1445, lon = 91.7362;
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=precipitation_sum&timezone=Asia/Kolkata`;
        const weatherRes = await axios.get(weatherUrl);
        const current = weatherRes.data.current_weather;

        // Build a short weather summary from forecast data
        const daily = weatherRes.data.daily;
        let rainyDays = 0;
        if (daily && daily.precipitation_sum) {
            rainyDays = daily.precipitation_sum.filter(p => p > 0.5).length;
        }
        const weatherSummary = `${current.temperature}C, Wind ${current.windspeed}km/h, ${rainyDays}/7 rainy days`;

        // Call OpenRouter Vision API — ask for structured JSON
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
{"soil":"<soil type in 3-5 words>","weather":"<weather outlook in 5-8 words>","crop":"<one best crop + 3-5 word reason>"}

Example: {"soil":"Red laterite, moist","weather":"Warm, light rain expected","crop":"Rice - ideal monsoon crop"}`
                        },
                        { type: 'image_url', image_url: { url: dataURI } }
                    ]
                }
            ]
        }, {
            headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` }
        });

        const rawText = aiResponse.data.choices[0].message.content.trim();
        console.log("AI raw:", rawText);

        // Parse JSON from AI response (handle markdown code blocks)
        let cleaned = rawText;
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
        }

        const parsed = JSON.parse(cleaned);
        latestAdvisory = {
            soil: parsed.soil || "Unknown",
            weather: parsed.weather || weatherSummary,
            crop: parsed.crop || "No suggestion",
            ready: true
        };
        console.log("Parsed advisory:", latestAdvisory);

    } catch (error) {
        console.error("AI processing error:", error.response ? error.response.data : error.message);
        // On parse error, still try to provide something useful
        if (error instanceof SyntaxError) {
            console.error("JSON parse failed, raw response was logged above");
        }
    }
}

// 1. Endpoint for ESP32-CAM to upload the image
app.post('/api/upload-soil', upload.single('imageFile'), (req, res) => {
    if (!req.file) return res.status(400).send('No image uploaded');

    imageCount++;
    console.log(`Image #${imageCount} rcvd from ESP32-CAM! (${(req.file.size / 1024).toFixed(1)} KB)`);

    // Respond immediately so the ESP-CAM doesn't time out
    res.status(200).send("Image received");

    // Process AI in the background (fire-and-forget)
    const base64Image = req.file.buffer.toString('base64');
    processImageWithAI(base64Image, req.file.mimetype);
});

// 2. Endpoint for the ESP32 OLED to fetch the latest advisory (structured)
app.get('/api/latest-advisory', (req, res) => {
    res.json(latestAdvisory);
});

app.listen(port, () => console.log(`Server running on port ${port}`));