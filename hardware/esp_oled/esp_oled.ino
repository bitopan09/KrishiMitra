#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

const char* ssid = "qwerty12";
const char* password = "pps20004";

// The endpoint on your Node.js server
const char* serverName     = "https://krishimitra-1-o0dj.onrender.com/api/latest-advisory";
const char* heartbeatUrl   = "https://krishimitra-1-o0dj.onrender.com/api/heartbeat";

// ---- DISPLAY SETTINGS ----
#define PAGE_DURATION_MS   3000   // Show each page for 3 seconds
#define FETCH_INTERVAL_MS  10000  // Fetch new data every 10 seconds
#define HEARTBEAT_INTERVAL 8000   // Send heartbeat every 8 seconds
// ---------------------------

// Stored advisory data
String soilText   = "Waiting...";
String weatherText = "Waiting...";
String cropText   = "Waiting...";
bool dataReady = false;

int currentPage = 0;            // 0=Soil, 1=Weather, 2=Crop
unsigned long lastPageSwitch = 0;
unsigned long lastFetch = 0;
unsigned long lastHeartbeatSent = 0;

void setup() {
  Serial.begin(115200);

  // Initialize OLED
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  display.clearDisplay();
  display.setTextColor(WHITE);

  // Show startup screen
  showCentered("KrishiMitra", "Connecting WiFi...");

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nWiFi Connected");

  showCentered("WiFi Connected!", "Waiting for data...");
  delay(1000);

  // Fetch immediately on boot
  fetchAdvisory();
  lastFetch = millis();
  lastPageSwitch = millis();
}

void loop() {
  unsigned long now = millis();

  // Send heartbeat periodically so the server knows we are alive
  if (now - lastHeartbeatSent >= HEARTBEAT_INTERVAL) {
    sendHeartbeat();
    lastHeartbeatSent = now;
  }

  // Fetch new data periodically
  if (now - lastFetch >= FETCH_INTERVAL_MS) {
    fetchAdvisory();
    lastFetch = now;
  }

  // Cycle through pages
  if (now - lastPageSwitch >= PAGE_DURATION_MS) {
    currentPage = (currentPage + 1) % 3;
    lastPageSwitch = now;
    showCurrentPage();
  }
}

void sendHeartbeat() {
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  http.begin(heartbeatUrl);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(3000);
  http.POST("{\"device\":\"esp_oled\"}");
  http.end();
  Serial.println("Heartbeat sent");
}

void fetchAdvisory() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(serverName);
  http.setTimeout(5000);
  int httpCode = http.GET();
  
  if (httpCode == 200) {
    String payload = http.getString();
    Serial.println("Got: " + payload);
    
    JsonDocument doc;
    DeserializationError err = deserializeJson(doc, payload);
    
    if (!err) {
      soilText    = doc["soil"].as<String>();
      weatherText = doc["weather"].as<String>();
      cropText    = doc["crop"].as<String>();
      dataReady   = doc["ready"] | false;
      
      Serial.println("Soil: " + soilText);
      Serial.println("Weather: " + weatherText);
      Serial.println("Crop: " + cropText);
    }
  } else {
    Serial.printf("HTTP error: %d\n", httpCode);
  }
  http.end();

  showCurrentPage();
}

void showCurrentPage() {
  if (!dataReady) {
    showCentered("KrishiMitra", "Analyzing soil...");
    return;
  }

  switch (currentPage) {
    case 0: showPage("SOIL TYPE", soilText); break;
    case 1: showPage("WEATHER", weatherText); break;
    case 2: showPage("BEST CROP", cropText); break;
  }
}

// Display a page with a header and content
void showPage(const char* header, String content) {
  display.clearDisplay();

  // Draw header bar
  display.fillRect(0, 0, SCREEN_WIDTH, 14, WHITE);
  display.setTextColor(BLACK);
  display.setTextSize(1);
  
  // Center the header text
  int16_t x1, y1;
  uint16_t w, h;
  display.getTextBounds(header, 0, 0, &x1, &y1, &w, &h);
  display.setCursor((SCREEN_WIDTH - w) / 2, 3);
  display.print(header);

  // Draw content below
  display.setTextColor(WHITE);
  display.setTextSize(1);
  display.setCursor(4, 20);
  display.println(content);

  // Draw page dots at bottom (o o o)
  int dotY = SCREEN_HEIGHT - 6;
  for (int i = 0; i < 3; i++) {
    int dotX = (SCREEN_WIDTH / 2) - 10 + (i * 10);
    if (i == currentPage) {
      display.fillCircle(dotX, dotY, 2, WHITE);
    } else {
      display.drawCircle(dotX, dotY, 2, WHITE);
    }
  }

  display.display();
}

// Centered text helper for startup screens
void showCentered(const char* line1, const char* line2) {
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setTextSize(1);
  
  int16_t x1, y1;
  uint16_t w, h;
  
  display.getTextBounds(line1, 0, 0, &x1, &y1, &w, &h);
  display.setCursor((SCREEN_WIDTH - w) / 2, 20);
  display.println(line1);
  
  display.getTextBounds(line2, 0, 0, &x1, &y1, &w, &h);
  display.setCursor((SCREEN_WIDTH - w) / 2, 38);
  display.println(line2);
  
  display.display();
}