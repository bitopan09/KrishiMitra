const axios = require('axios');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Free models to try in order of preference
const FREE_MODELS = [
  'inclusionai/ling-2.6-1t:free',
  'google/gemma-4-26b-a4b-it:free',
  'google/gemma-4-31b-it:free',
  'tencent/hy3-preview:free',
  'poolside/laguna-m.1:free'
];

/**
 * Generates crop recommendations using OpenRouter AI (free models with fallback)
 * @param {Object} params - Input parameters
 * @param {Object} weather - Weather data from Open-Meteo
 * @returns {Object} Structured crop recommendations
 */
async function getCropRecommendation({ district, soil, season, water, budget, lang }, weather) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    throw new Error('OpenRouter API key not configured. Please set OPENROUTER_API_KEY in .env');
  }

  const prompt = buildPrompt({ district, soil, season, water, budget, lang }, weather);
  const baseSysMsg = `You are an expert agricultural scientist and agronomist specializing in the agriculture of Assam and Northeast India. You provide practical, actionable crop recommendations to small and marginal farmers. Always respond in valid JSON format only, with no extra text before or after the JSON.`;
  const systemMsg = lang === 'as'
    ? baseSysMsg + ` You MUST write ALL text values in Assamese (অসমীয়া) script. Keep JSON keys in English but ALL values must be in Assamese.`
    : lang === 'hi'
    ? baseSysMsg + ` You MUST write ALL text values in Hindi (हिन्दी) script. Keep JSON keys in English but ALL values must be in Hindi.`
    : baseSysMsg;

  // Try each free model until one works
  let lastError = null;
  for (const model of FREE_MODELS) {
    try {
      console.log(`   🔄 Trying model: ${model}`);
      const response = await axios.post(
        OPENROUTER_URL,
        {
          model,
          messages: [
            { role: 'system', content: systemMsg },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1500
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://krishimitra.vercel.app',
            'X-Title': 'KrishiMitra - Crop Advisory System'
          },
          timeout: 30000
        }
      );

      const content = response.data.choices[0].message.content;
      console.log(`   ✅ Model ${model} responded successfully`);
      return parseAIResponse(content);
    } catch (error) {
      console.error(`   ⚠️ Model ${model} failed:`, error.response?.data?.error?.message || error.message);
      lastError = error;
    }
  }

  // All models failed
  console.error('All AI models failed. Last error:', lastError?.response?.data || lastError?.message);
  throw new Error('AI service is temporarily busy. Please try again in a moment.');
}

/**
 * Builds a detailed prompt for the AI model
 */
function buildPrompt({ district, soil, season, water, budget, lang }, weather) {
  let langInstruction = '';
  if (lang === 'as') {
    langInstruction = `\n\nIMPORTANT: Write ALL JSON string values in Assamese (অসমীয়া) script. The JSON keys must remain in English, but every value — crop names, sowing times, fertilizer info, tips, advice — must be written in Assamese script. Use standard numerals for quantities.`;
  } else if (lang === 'hi') {
    langInstruction = `\n\nIMPORTANT: Write ALL JSON string values in Hindi (हिन्दी) script. The JSON keys must remain in English, but every value — crop names, sowing times, fertilizer info, tips, advice — must be written in Hindi script. Use standard numerals for quantities.`;
  }

  return `A small farmer in ${district} district, Assam, India needs crop recommendations.

FARMER'S CONDITIONS:
- Soil type: ${soil}
- Season: ${season} (${getSeasonMonths(season)})
- Water availability: ${water}
- Budget level: ${budget}

CURRENT WEATHER IN ${district.toUpperCase()}:
- Current temperature: ${weather.current_temp}°C
- Average max temperature (7-day): ${weather.avg_max_temp}°C
- Average min temperature (7-day): ${weather.avg_min_temp}°C
- Humidity: ${weather.humidity}%
- Total rainfall in next 7 days: ${weather.weekly_rainfall_mm} mm
- Current conditions: ${weather.description}

Based on these specific conditions, recommend exactly 3 crops that this farmer should grow. Consider the local agro-climatic conditions of Assam's Brahmaputra valley.${langInstruction}

Respond ONLY with valid JSON in this exact format, no other text:
{
  "recommendations": [
    {
      "crop_name": "Name of the crop",
      "crop_name_assamese": "Name in Assamese script",
      "sowing_window": "When to sow (e.g., June first week to June third week)",
      "harvest_time": "Expected harvest period",
      "fertilizer": "Specific fertilizer recommendation with quantity per bigha",
      "expected_yield": "Expected yield per bigha",
      "water_needs": "Water requirement description",
      "estimated_cost": "Approximate input cost per bigha in INR",
      "tips": "2-3 practical tips for this crop in this region"
    }
  ],
  "general_advice": "One paragraph of general seasonal advice for this farmer"
};`;
}

/**
 * Maps season code to month range
 */
function getSeasonMonths(season) {
  const seasons = {
    'kharif': 'June to October — monsoon season',
    'rabi': 'November to March — winter season',
    'zaid': 'March to June — summer season'
  };
  return seasons[season.toLowerCase()] || season;
}

/**
 * Parses and validates the AI response
 */
function parseAIResponse(content) {
  try {
    // Try to extract JSON from the response (model might add extra text)
    let jsonStr = content;

    // If the response has markdown code blocks, extract the JSON
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    // Try to find JSON object directly
    const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      jsonStr = objectMatch[0];
    }

    const parsed = JSON.parse(jsonStr);

    // Validate structure
    if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
      throw new Error('Invalid response structure');
    }

    // Normalize tips: if AI returns an array, join into a string
    parsed.recommendations.forEach(rec => {
      if (Array.isArray(rec.tips)) {
        rec.tips = rec.tips.join(' ');
      }
    });

    return parsed;
  } catch (parseError) {
    console.error('Failed to parse AI response:', content);
    // Return a fallback structure
    return {
      recommendations: [
        {
          crop_name: 'Rice (Sali)',
          crop_name_assamese: 'শালি ধান',
          sowing_window: 'June to July',
          harvest_time: 'November to December',
          fertilizer: 'Urea 8kg + DAP 5kg per bigha',
          expected_yield: '6-8 quintals per bigha',
          water_needs: 'High — requires standing water',
          estimated_cost: '₹3,000-4,000 per bigha',
          tips: 'Use SRI method for better yield. Maintain 2-3 cm water level during tillering stage.'
        },
        {
          crop_name: 'Mustard',
          crop_name_assamese: 'সৰিয়হ',
          sowing_window: 'October to November',
          harvest_time: 'February to March',
          fertilizer: 'Urea 5kg + MOP 3kg per bigha',
          expected_yield: '2-3 quintals per bigha',
          water_needs: 'Low — rain-fed suitable',
          estimated_cost: '₹1,500-2,000 per bigha',
          tips: 'Good rotation crop after rice. Requires well-drained soil.'
        },
        {
          crop_name: 'Potato',
          crop_name_assamese: 'আলু',
          sowing_window: 'November to December',
          harvest_time: 'February to March',
          fertilizer: 'FYM 200kg + Urea 6kg + MOP 5kg per bigha',
          expected_yield: '30-40 quintals per bigha',
          water_needs: 'Medium — irrigated preferred',
          estimated_cost: '₹5,000-7,000 per bigha',
          tips: 'Use Kufri Jyoti variety. Earth up at 30 and 45 days after planting.'
        }
      ],
      general_advice: 'Based on current conditions, focus on proper land preparation and timely sowing. Monitor weather updates regularly and ensure adequate drainage during heavy rainfall periods.'
    };
  }
}

module.exports = { getCropRecommendation };
