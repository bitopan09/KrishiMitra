# KrishiMitra 

**AI-Powered Crop Recommendation & Advisory System for Assam Farmers**

**Live Demo:** [https://krishimitra-p62s.onrender.com](https://krishimitra-p62s.onrender.com)

KrishiMitra helps small and marginal farmers in Assam get personalized crop recommendations and relevant government scheme suggestions based on their soil type, season, water availability, budget, and live weather data.

> **Looking for hardware integration?** See the [`v1.2`](https://github.com/bitopan09/KrishiMitra/tree/v1.2) branch which adds ESP32-CAM soil analysis and a two-tab UI.

---

##  Features

###  AI-Powered Crop Recommendations
Uses free LLM models via OpenRouter to generate 3 crop suggestions with sowing window, fertilizer, yield, and cost estimates tailored to the farmer's conditions.

### 🏛️ Government Scheme Suggestions
After crop recommendations, the AI suggests 2–3 relevant Central & Assam state government schemes (PM-KISAN, PMFBY, KCC, etc.) with:
- ✅ **Eligibility** — Who can apply
- 🎁 **Benefits** — What the farmer gets
- 📋 **Step-by-step instructions** — Simple steps any farmer can follow
- 📄 **Documents needed** — Aadhaar, land papers, bank passbook, etc.
- 📞 **Helpline numbers** — Toll-free numbers and websites

###  Full Trilingual Support
Complete UI and AI responses in **English**, **অসমীয়া (Assamese)**, and **हिन्दी (Hindi)**:
- Every single UI element switches language on toggle
- AI-generated content auto re-fetches in the new language
- Language preference saved to localStorage

###  Live Weather Integration
Fetches real-time weather from Open-Meteo API (free, no key needed). Displays temperature, humidity, rainfall, wind speed, max/min temp.

###  Mobile-First Design
Clean, minimalist UI with Inter font, optimized for farmers using phones.

###  33 Assam Districts
Covers all districts with precise lat/lng coordinates for accurate weather lookups.

---

##  Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5 + CSS3 + Vanilla JS |
| Backend | Node.js + Express.js |
| AI | OpenRouter API (free models with 5-model fallback) |
| Weather | Open-Meteo API (free, no key needed) |
| i18n | Custom trilingual system (EN / অসমীয়া / हिन्दी) |

---

##  Project Structure

```
KrishiMitra/
├── client/
│   ├── index.html              # Main UI (fully i18n-tagged)
│   ├── css/style.css           # Minimalist design system
│   └── js/
│       ├── app.js              # Form handling, rendering, language re-fetch
│       └── i18n.js             # 45+ trilingual translation keys
├── server/
│   ├── server.js               # Express server + API routes
│   ├── services/
│   │   ├── ai.js               # OpenRouter integration + prompt engineering
│   │   └── weather.js          # Open-Meteo weather fetcher
│   └── data/
│       └── districts.json      # 33 Assam districts with coordinates
├── package.json
└── README.md
```

---

##  Setup

```bash
# Clone the repo
git clone https://github.com/bitopan09/KrishiMitra.git
cd KrishiMitra
git checkout v1.1

# Install dependencies
cd server && npm install

# Add your API key
echo "OPENROUTER_API_KEY=your_key_here" > .env

# Run
node server.js
# → Open http://localhost:3000
```

---

##  Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENROUTER_API_KEY` | Free key from [openrouter.ai](https://openrouter.ai) |
| `PORT` | Server port (default: 3000) |

---

##  Version History

### v1.1 (This branch)
- ✅ Government scheme suggestions with step-by-step application instructions
- ✅ Full multilingual support — ALL content switches language on toggle
- ✅ Auto re-fetch AI results when language changes
- ✅ Max/Min Temp weather labels with translations
- ✅ Hero badge multilingual support

### v1.0
- ✅ Initial release — AI crop recommendations
- ✅ Live weather via Open-Meteo
- ✅ Basic trilingual UI
- ✅ Mobile-first design
- ✅ 33 Assam district coverage

### v1.2 → [Hardware Integration Branch](https://github.com/bitopan09/KrishiMitra/tree/v1.2)
- ESP32-CAM soil image analysis
- Two-tab UI (Software + Hardware)
- Live hardware dashboard with auto-refresh

---

Built with ❤️ for Assam's Farmers | Hackathon Project 2026
