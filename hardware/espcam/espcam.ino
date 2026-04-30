#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>

// Replace with your WiFi credentials
const char* ssid = "qwerty12";
const char* password = "pps20004";

// Replace with your computer's local IP address running the Node.js server
// e.g., "http://192.168.1.5:3000/api/upload-soil"
String serverName = "http://10.209.39.42:3000/api/upload-soil"; 

// ---- CAPTURE SETTINGS ----
#define NUM_PHOTOS      5       // Number of photos to take
#define INTERVAL_SEC    3       // Seconds between each photo
// ---------------------------

// CAMERA_MODEL_AI_THINKER Pins
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

bool cameraReady = false;

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  // Configure Camera
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM; config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM; config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM; config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM; config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM; config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM; config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM; config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM; config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_VGA; // 640x480 is good for AI
  config.jpeg_quality = 12;
  config.fb_count = 1;

  if(esp_camera_init(&config) != ESP_OK) {
    Serial.println("Camera init failed!");
    return;
  }
  
  cameraReady = true;
  Serial.println("Camera ready!");

  // Allow camera to stabilize
  delay(2000); 

  // Take and upload multiple photos
  int successCount = 0;
  for (int i = 1; i <= NUM_PHOTOS; i++) {
    Serial.printf("\n--- Photo %d/%d ---\n", i, NUM_PHOTOS);
    
    if (captureAndUpload()) {
      successCount++;
    }
    
    // Wait between captures (skip wait after last photo)
    if (i < NUM_PHOTOS) {
      Serial.printf("Waiting %d seconds...\n", INTERVAL_SEC);
      delay(INTERVAL_SEC * 1000);
    }
  }

  Serial.printf("\nDone! %d/%d photos uploaded successfully.\n", successCount, NUM_PHOTOS);
  Serial.println("Press RESET to capture again.");
}

bool captureAndUpload() {
  // Take Picture
  camera_fb_t * fb = esp_camera_fb_get();
  if(!fb) {
    Serial.println("Camera capture failed");
    return false;
  }
  Serial.printf("Captured: %u bytes\n", fb->len);

  // Build multipart body
  String head = "--Boundary\r\nContent-Disposition: form-data; name=\"imageFile\"; filename=\"soil.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n";
  String tail = "\r\n--Boundary--\r\n";
  
  uint32_t totalLen = head.length() + fb->len + tail.length();
  
  uint8_t *body = (uint8_t *)malloc(totalLen);
  if (!body) {
    Serial.println("malloc failed");
    esp_camera_fb_return(fb);
    return false;
  }
  
  memcpy(body, head.c_str(), head.length());
  memcpy(body + head.length(), fb->buf, fb->len);
  memcpy(body + head.length() + fb->len, tail.c_str(), tail.length());
  
  // Release camera buffer early to free memory
  esp_camera_fb_return(fb);

  // Send HTTP POST
  HTTPClient http;
  http.begin(serverName);
  http.addHeader("Content-Type", "multipart/form-data; boundary=Boundary");
  http.setTimeout(10000); // 10 second timeout
  
  int httpCode = http.POST(body, totalLen);
  free(body);
  
  if (httpCode == 200) {
    Serial.println("Upload OK: " + http.getString());
    http.end();
    return true;
  } else {
    Serial.printf("Upload FAILED (HTTP %d): %s\n", httpCode, http.errorToString(httpCode).c_str());
    http.end();
    return false;
  }
}

void loop() {
  // Nothing here — press RESET to capture again
}