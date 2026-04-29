const axios = require('axios');

/**
 * Fetches current weather data from Open-Meteo API (free, no key needed)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Object} Weather data object
 */
async function getWeather(lat, lng) {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast';
    const response = await axios.get(url, {
      params: {
        latitude: lat,
        longitude: lng,
        current_weather: true,
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum',
        hourly: 'relative_humidity_2m',
        timezone: 'Asia/Kolkata',
        forecast_days: 7
      }
    });

    const data = response.data;
    const current = data.current_weather;

    // Get average humidity from today's hourly data (first 24 entries)
    const todayHumidity = data.hourly.relative_humidity_2m.slice(0, 24);
    const avgHumidity = Math.round(
      todayHumidity.reduce((sum, h) => sum + h, 0) / todayHumidity.length
    );

    // Get 7-day totals
    const totalRainfall = data.daily.precipitation_sum.reduce((sum, r) => sum + r, 0);
    const avgMaxTemp = Math.round(
      data.daily.temperature_2m_max.reduce((s, t) => s + t, 0) / data.daily.temperature_2m_max.length
    );
    const avgMinTemp = Math.round(
      data.daily.temperature_2m_min.reduce((s, t) => s + t, 0) / data.daily.temperature_2m_min.length
    );

    return {
      current_temp: current.temperature,
      windspeed: current.windspeed,
      humidity: avgHumidity,
      avg_max_temp: avgMaxTemp,
      avg_min_temp: avgMinTemp,
      weekly_rainfall_mm: Math.round(totalRainfall * 10) / 10,
      description: getWeatherDescription(current.weathercode),
      weathercode: current.weathercode
    };
  } catch (error) {
    console.error('Weather API error:', error.message);
    // Return fallback data so the app still works
    return {
      current_temp: 28,
      windspeed: 10,
      humidity: 75,
      avg_max_temp: 32,
      avg_min_temp: 22,
      weekly_rainfall_mm: 50,
      description: 'Weather data unavailable',
      weathercode: -1
    };
  }
}

/**
 * Convert WMO weather code to human-readable description
 */
function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };
  return descriptions[code] || 'Unknown';
}

module.exports = { getWeather };
