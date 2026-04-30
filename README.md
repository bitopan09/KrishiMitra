# KrishiMitra 🌾

**AI-Powered Crop Recommendation & Advisory System for Assam Farmers**

🔗 **Live Demo:** [https://krishimitra-p62s.onrender.com](https://krishimitra-p62s.onrender.com)

KrishiMitra helps small and marginal farmers in Assam get personalized crop recommendations and relevant government scheme suggestions based on their soil type, season, water availability, budget, and live weather data.

---

## ✨ Features

### 🤖 AI-Powered Crop Recommendations
Uses free LLM models via OpenRouter to generate 3 crop suggestions with sowing window, fertilizer, yield, and cost estimates tailored to the farmer's conditions.

### 🏛️ Government Scheme Suggestions *(New in v1.1)*
After crop recommendations, the AI suggests 2–3 relevant Central & Assam state government schemes (PM-KISAN, PMFBY, KCC, etc.) with:
- ✅ **Eligibility** — Who can apply
- 🎁 **Benefits** — What the farmer gets
- 📋 **Step-by-step instructions** — Simple steps any farmer can follow
- 📄 **Documents needed** — Aadhaar, land papers, bank passbook, etc.
- 📞 **Helpline numbers** — Toll-free numbers and websites

### 🗣️ Full Trilingual Support *(Enhanced in v1.1)*
Complete UI and AI responses in **English**, **অসমীয়া (Assamese)**, and **हिन्दी (Hindi)**:
- Every single UI element switches language on toggle
- **AI-generated content auto re-fetches** in the new language — crop names, scheme details, application steps, advice — everything translates
- Language preference saved to localStorage

### 🌦️ Live Weather Integration
Fetches real-time weather from Open-Meteo API (free, no key needed) to make recommendations weather-aware. Displays temperature, humidity, rainfall, wind speed, max/min temp.

### 📱 Mobile-First Design
Clean, minimalist UI with Inter font, optimized for farmers using phones.

### 🌍 33 Assam Districts
Covers all districts with precise lat/lng coordinates for accurate weather lookups.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5 + CSS3 + Vanilla JS |
| Backend | Node.js + Express.js |
| AI | OpenRouter API (free models with 5-model fallback) |
| Weather | Open-Meteo API (free, no key needed) |
| i18n | Custom trilingual system (EN / অসমীয়া / हिन्दी) |

---

## 📐 Architecture

```
Farmer → Form Input → POST /api/recommend
  → Fetch Weather (Open-Meteo)
  → Build AI Prompt (crops + schemes + language)
  → OpenRouter API (5-model fallback chain)
  → Parse JSON Response
  → Render: Weather Widget + Crop Cards + Govt Schemes + General Advice
```

### Project Structure

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

## 🚀 Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/bitopan09/KrishiMitra.git
   cd KrishiMitra
   ```

2. **Switch to v1.1 branch** *(for latest features)*
   ```bash
   git checkout v1.1
   ```

3. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Add your API key**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenRouter API key from https://openrouter.ai
   ```

5. **Run the server**
   ```bash
   node server.js
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENROUTER_API_KEY` | Your free API key from [openrouter.ai](https://openrouter.ai) |
| `PORT` | Server port (default: 3000) |

---

## 📋 Version History

### v1.1 (Current)
- ✅ Government scheme suggestions with step-by-step application instructions
- ✅ Full multilingual support — ALL content (including AI-generated) switches on language toggle
- ✅ Auto re-fetch results when language changes
- ✅ Added Max Temp / Min Temp weather labels with translations
- ✅ Hero badge trilingual support
- ✅ Increased AI token limit for richer responses
- ✅ Fallback scheme data (PM-KISAN, PMFBY, KCC) for offline resilience

### v1.0
- Initial release with AI crop recommendations
- Weather integration via Open-Meteo
- Basic trilingual UI (static labels only)
- Mobile-first responsive design
- 33 Assam district coverage

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ for Assam's Farmers | Hackathon Project 2026
