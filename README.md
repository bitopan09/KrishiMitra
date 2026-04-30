# KrishiMitra 

**AI-Powered Crop Recommendation & Advisory System for Assam Farmers**

🔗 **Live Demo:** [https://krishimitra-p62s.onrender.com](https://krishimitra-p62s.onrender.com)

KrishiMitra helps small and marginal farmers in Assam get personalized crop recommendations based on their soil type, season, water availability, budget, and live weather data.

## Features

-  **AI-Powered Recommendations** — Uses free LLM models via OpenRouter to generate 3 crop suggestions with sowing window, fertilizer, yield, and cost estimates
-  **Live Weather Integration** — Fetches real-time weather from Open-Meteo API to make recommendations weather-aware
-  **Trilingual Support** — Full UI and AI responses in **English**, **অসমীয়া (Assamese)**, and **हिन्दी (Hindi)**
-  **Mobile-First Design** — Clean, minimalist UI optimized for farmers using phones
-  **33 Assam Districts** — Covers all districts with precise lat/lng for weather lookups

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5 + CSS3 + Vanilla JS |
| Backend | Node.js + Express.js |
| AI | OpenRouter API (free models) |
| Weather | Open-Meteo API (free, no key) |

## Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/bitopan09/KrishiMitra.git
   cd KrishiMitra
   ```

2. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Add your API key**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenRouter API key from https://openrouter.ai
   ```

4. **Run the server**
   ```bash
   node server.js
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENROUTER_API_KEY` | Your free API key from [openrouter.ai](https://openrouter.ai) |
| `PORT` | Server port (default: 3000) |

## Architecture

```
Farmer → Form Input → POST /api/recommend → Fetch Weather (Open-Meteo) → Build AI Prompt → OpenRouter API → Parse JSON → Render Crop Cards
```

---

Built with ❤️ for Assam's Farmers | Hackathon Project 2026
