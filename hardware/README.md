# KrishiMitra 🌾 v2.0

**AI-Powered Crop Recommendation & Advisory System for Assam Farmers**

🔗 **Live Demo:** [https://krishimitra-p62s.onrender.com](https://krishimitra-p62s.onrender.com)

---

KrishiMitra helps small and marginal farmers in Assam get personalized crop recommendations based on their soil type, season, water availability, budget, and live weather data. **Version 2.0** introduces hardware-based soil analysis using an ESP32-CAM and a portable OLED advisory display — bringing AI to the field.

---

## 🆕 What's New in v2.0

### 🔩 Hardware — ESP32 IoT Module

| Component | Role |
|-----------|------|
| **ESP32-CAM (AI Thinker)** | Captures soil images and uploads them to the server for AI-powered soil analysis |
| **ESP32 + SSD1306 OLED (128×64)** | Displays structured advisory in 3 auto-cycling pages — Soil Type, Weather Outlook, and Crop Suggestion |

**How it works:**

```
┌─────────────┐    WiFi/HTTP POST    ┌──────────────┐    OpenRouter API    ┌─────────┐
│  ESP32-CAM   │ ──────────────────► │  Node.js     │ ──────────────────► │  Gemini  │
│  (Soil Photo)│                     │  Server      │ ◄────────────────── │  Vision  │
└─────────────┘                     └──────┬───────┘                     └─────────┘
                                           │
                                    JSON response
                                           │
                                    ┌──────▼───────┐
                                    │  ESP32 OLED   │
                                    │  ┌──────────┐ │
                                    │  │SOIL TYPE │ │  ← Page 1
                                    │  │Red loam  │ │
                                    │  │  ● ○ ○   │ │
                                    │  └──────────┘ │
                                    └──────────────┘
```

The OLED cycles through **3 pages** every 3 seconds:

| Page | Header | Example Content |
|------|--------|-----------------|
| 1 | **SOIL TYPE** | Red laterite, moist |
| 2 | **WEATHER** | Warm, light rain expected |
| 3 | **BEST CROP** | Rice — ideal monsoon crop |

### 🏛️ Software — Government Schemes Portal

A dedicated section that displays **central and state government schemes** available and beneficial for farmers in Assam, including:

- **PM-KISAN** — ₹6,000/year direct income support
- **PM Fasal Bima Yojana** — Crop insurance scheme
- **Kisan Credit Card (KCC)** — Low-interest agricultural loans
- **Soil Health Card Scheme** — Free soil testing and nutrient recommendations
- **CMSGUY (Chief Minister's Samagra Gramya Unnayan Yojana)** — Assam-specific rural development
- **National Mission for Sustainable Agriculture (NMSA)** — Climate-resilient farming support

Farmers can browse relevant schemes, check eligibility, and access direct links to official portals — all in one place.

---

## ✨ Features

| | Feature | Description |
|--|---------|-------------|
| 📷 | **Soil Image Analysis** | ESP32-CAM captures soil photos; Gemini Vision AI identifies soil type automatically |
| 🖥️ | **OLED Field Display** | Portable 128×64 OLED shows Soil → Weather → Crop advisory on auto-cycling pages |
| 🤖 | **AI-Powered Recommendations** | Uses Gemini via OpenRouter to generate crop suggestions with sowing window, fertilizer, yield, and cost estimates |
| 🌦️ | **Live Weather Integration** | Fetches real-time weather + 7-day precipitation forecast from Open-Meteo API |
| 🏛️ | **Government Schemes** | Curated list of central & state schemes with eligibility and official links |
| 🗣️ | **Trilingual Support** | Full UI and AI responses in English, অসমীয়া (Assamese), and हिन्दी (Hindi) |
| 📱 | **Mobile-First Design** | Clean, minimalist UI optimized for farmers using phones |
| 🌍 | **33 Assam Districts** | Covers all districts with precise lat/lng for weather lookups |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5 + CSS3 + Vanilla JS |
| **Backend** | Node.js + Express.js |
| **AI** | OpenRouter API → Google Gemini 2.0 Flash (Vision) |
| **Weather** | Open-Meteo API (free, no key needed) |
| **IoT — Camera** | ESP32-CAM (AI Thinker) — Arduino/C++ |
| **IoT — Display** | ESP32 + SSD1306 OLED — Adafruit GFX + ArduinoJson |
| **Upload Handling** | Multer (multipart/form-data) |

---

## 📁 Project Structure

```
KrishiMitra/
├── server.js                    # Express server — image upload, AI processing, advisory API
├── .env                         # Environment variables (API keys)
├── package.json
│
├── espcam/
│   └── espcam.ino               # ESP32-CAM sketch — captures & uploads soil images
│
├── sketch_apr30b/
│   └── sketch_apr30b.ino        # ESP32 OLED sketch — fetches & displays advisory
│
└── public/                      # Frontend (web app)
    ├── index.html
    ├── style.css
    └── script.js
```

---

## 🚀 Setup

### 1. Server

```bash
# Clone the repo
git clone https://github.com/bitopan09/KrishiMitra.git
cd KrishiMitra

# Install dependencies
npm install

# Add your API key
cp .env.example .env
# Edit .env and add your OpenRouter API key from https://openrouter.ai

# Run the server
node server.js
# → Server running on port 3000
```

### 2. ESP32-CAM (Soil Camera)

1. Open `espcam/espcam.ino` in Arduino IDE
2. Install board: **ESP32** by Espressif (Board Manager)
3. Update these values in the sketch:
   ```cpp
   const char* ssid = "YOUR_WIFI";
   const char* password = "YOUR_PASSWORD";
   String serverName = "http://YOUR_PC_IP:3000/api/upload-soil";
   ```
4. Configure capture settings (optional):
   ```cpp
   #define NUM_PHOTOS      5    // Number of photos per session
   #define INTERVAL_SEC    3    // Seconds between each photo
   ```
5. Select board: **AI Thinker ESP32-CAM** → Upload
6. Press **RESET** to start capturing

### 3. ESP32 OLED Display

1. Open `sketch_apr30b/sketch_apr30b.ino` in Arduino IDE
2. Install libraries (Library Manager):
   - `Adafruit SSD1306`
   - `Adafruit GFX`
   - `ArduinoJson`
3. Update WiFi and server IP in the sketch
4. Wire the SSD1306 OLED:
   | OLED Pin | ESP32 Pin |
   |----------|-----------|
   | VCC | 3.3V |
   | GND | GND |
   | SDA | GPIO 21 |
   | SCL | GPIO 22 |
5. Upload and the display will start cycling through pages once data is available

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload-soil` | Upload a soil image (multipart, field: `imageFile`) |
| `GET` | `/api/latest-advisory` | Get the latest structured advisory JSON |

**`GET /api/latest-advisory` response:**
```json
{
  "soil": "Red laterite, moist",
  "weather": "Warm, light rain expected",
  "crop": "Rice - ideal monsoon crop",
  "ready": true
}
```

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENROUTER_API_KEY` | Your free API key from [openrouter.ai](https://openrouter.ai) |
| `PORT` | Server port (default: `3000`) |

---

## 📸 Hardware Photos

> _Add photos of your ESP32-CAM and OLED setup here_

---

## 🤝 Team

Built with ❤️ for Assam's farming community.

---

## 📄 License

MIT
