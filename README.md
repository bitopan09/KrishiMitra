# KrishiMitra 

**AI-Powered Crop Recommendation & Advisory System for Assam Farmers**

**Live Demo:** [https://krishimitra-p62s.onrender.com](https://krishimitra-p62s.onrender.com)

KrishiMitra helps small and marginal farmers in Assam get personalized crop recommendations, relevant government scheme suggestions, and now — real-time soil analysis via an ESP32-CAM hardware module.

---

##  What's New in v1.2 — Hardware Integration

###  Two-Tab Interface
The website now has a **Software** tab and a **Hardware** tab:

| Tab | Description |
|-----|-------------|
| 💻 **Software** | Fill in your district, soil, season, water & budget → get AI crop recommendations + government schemes |
| 🔩 **Hardware** | Connect your ESP32-CAM → it captures a soil photo → AI analyzes it → live results shown in real time |

### 📷 ESP32-CAM Soil Analysis
- ESP32-CAM takes a soil photo and uploads it to `POST /api/upload-soil`
- Server uses **Gemini 2.0 Flash Vision** to identify soil type, weather outlook, and best crop
- Website hardware tab auto-refreshes every **5 seconds** and shows the latest advisory
- 🟡 Orange dot = Waiting for device | 🟢 Green dot = Data received!

### 🖥️ ESP32 OLED Display
- Fetches `GET /api/latest-advisory` every 10 seconds
- Cycles through 3 pages (Soil Type → Weather → Best Crop) every 3 seconds

```
┌─────────────┐    WiFi/HTTP POST    ┌──────────────┐    Gemini Vision AI
│  ESP32-CAM   │ ──────────────────► │  Node.js     │ ──────────────────►
│  (Soil Photo)│                     │  Server      │
└─────────────┘                     └──────┬───────┘
                                           │ /api/latest-advisory
                         ┌─────────────────┴──────────────────┐
                         │                                    │
                  ┌──────▼──────┐                    ┌────────▼───────┐
                  │  Website     │                    │  ESP32 OLED    │
                  │  Hardware Tab│                    │  (Field Display)│
                  └─────────────┘                    └────────────────┘
```

---

## All Features

| | Feature | Description |
|--|---------|-------------|
| 📷 | **Soil Image Analysis** | ESP32-CAM captures soil photos; Gemini Vision AI identifies soil type |
| 🖥️ | **OLED Field Display** | Portable 128×64 OLED cycles Soil → Weather → Crop advisory |
| 🤖 | **AI Crop Recommendations** | 3 crop suggestions with sowing window, fertilizer, yield, and cost |
| 🏛️ | **Government Schemes** | 2–3 relevant Central/State schemes with step-by-step application instructions |
| 🌦️ | **Live Weather Integration** | Real-time weather + 7-day forecast from Open-Meteo API |
| 🗣️ | **Full Trilingual Support** | Every single word switches between English, অসমীয়া, and हिन्दी |
| 📱 | **Mobile-First Design** | Clean, minimalist UI optimized for farmers using phones |
| 🌍 | **33 Assam Districts** | All districts with precise lat/lng for accurate weather lookups |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5 + CSS3 + Vanilla JS |
| Backend | Node.js + Express.js |
| AI (Text) | OpenRouter API — free LLM models with 5-model fallback |
| AI (Vision) | Google Gemini 2.0 Flash via OpenRouter |
| Weather | Open-Meteo API (free, no key needed) |
| Image Upload | Multer (multipart/form-data) |
| IoT — Camera | ESP32-CAM (AI Thinker) — Arduino/C++ |
| IoT — Display | ESP32 + SSD1306 OLED — Adafruit GFX + ArduinoJson |

---

## Project Structure

```
KrishiMitra/
├── client/
│   ├── index.html              # Two-tab UI (Software + Hardware)
│   ├── css/style.css           # Design system + tab + hardware card styles
│   └── js/
│       ├── app.js              # Tab switching, hardware polling, AI rendering
│       └── i18n.js             # 50+ trilingual translation keys
├── server/
│   ├── server.js               # Express server — software + hardware API routes
│   ├── services/
│   │   ├── ai.js               # OpenRouter text AI + prompt engineering
│   │   └── weather.js          # Open-Meteo weather fetcher
│   └── data/
│       └── districts.json      # 33 Assam districts with coordinates
├── hardware/
│   ├── espcam/espcam.ino       # ESP32-CAM sketch — captures & uploads soil images
│   ├── esp_oled/esp_oled.ino   # ESP32 OLED sketch — fetches & displays advisory
│   └── README.md               # Hardware setup guide
├── package.json
└── README.md
```

---

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/districts` | List of all 33 Assam districts |
| `POST` | `/api/recommend` | AI crop recommendation (software tab) |
| `POST` | `/api/upload-soil` | ESP32-CAM uploads soil image here |
| `GET` | `/api/latest-advisory` | Latest soil analysis for website + OLED |
| `GET` | `/health` | Health check with hardware status |

---

## Setup

### 1. Server + Website

```bash
# Clone the repo
git clone https://github.com/bitopan09/KrishiMitra.git
cd KrishiMitra

# Use v1.2 branch for hardware integration
git checkout v1.2

# Install dependencies
cd server && npm install

# Add your API key
echo "OPENROUTER_API_KEY=your_key_here" > .env

# Run
node server.js
# → Open http://localhost:3000
```

### 2. ESP32-CAM (Soil Camera)

1. Open `hardware/espcam/espcam.ino` in Arduino IDE
2. Install board: **ESP32 by Espressif** (Board Manager)
3. Update credentials:
   ```cpp
   const char* ssid = "YOUR_WIFI";
   const char* password = "YOUR_PASSWORD";
   String serverName = "http://YOUR_SERVER_IP:3000/api/upload-soil";
   ```
4. Select board: **AI Thinker ESP32-CAM** → Upload → RESET

### 3. ESP32 OLED Display

1. Open `hardware/esp_oled/esp_oled.ino` in Arduino IDE
2. Install libraries: `Adafruit SSD1306`, `Adafruit GFX`, `ArduinoJson`
3. Wire the SSD1306: VCC→3.3V, GND→GND, SDA→GPIO21, SCL→GPIO22
4. Update WiFi + server IP → Upload

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENROUTER_API_KEY` | Free key from [openrouter.ai](https://openrouter.ai) |
| `PORT` | Server port (default: 3000) |

---

## Version History

### v1.2 (Current — Hardware Integration)
- ✅ Two-tab UI: Software tab + Hardware tab
- ✅ ESP32-CAM soil image upload → Gemini Vision AI analysis
- ✅ Live hardware dashboard (auto-refresh every 5 seconds)
- ✅ Connection status indicator (pulsing dot)
- ✅ Unified server — one port serves both website and ESP devices
- ✅ Hardware translation keys (13 new trilingual strings)
- ✅ Fixed i18n.js syntax error from escaped characters

### v1.1
- ✅ Government scheme suggestions (PM-KISAN, PMFBY, KCC, Assam state schemes)
- ✅ Step-by-step application instructions per scheme
- ✅ Full multilingual support — ALL content switches language on toggle
- ✅ Auto re-fetch AI results when language changes
- ✅ Added Max/Min Temp, hero badge translations

### v1.0
- ✅ Initial release — AI crop recommendations
- ✅ Live weather via Open-Meteo
- ✅ Basic trilingual UI
- ✅ Mobile-first design
- ✅ 33 Assam district coverage

---

Built with ❤️ for Assam's Farmers | Hackathon Project 2026
