/**
 * KrishiMitra — Internationalization (i18n)
 * English ↔ Assamese ↔ Hindi translation dictionary
 */

const translations = {
  // ─── App UI ──────────────────────
  'app_name': { en: 'KrishiMitra', as: 'কৃষিমিত্ৰ', hi: 'कृषिमित्र' },
  'app_tagline': { en: 'AI-Powered Crop Advisory for Assam Farmers', as: 'অসমৰ কৃষকৰ বাবে AI চালিত শস্য পৰামৰ্শ', hi: 'असम के किसानों के लिए AI आधारित फसल सलाह' },
  'app_subtitle': { en: 'Get personalized crop recommendations based on your soil, season, weather & budget', as: 'আপোনাৰ মাটি, ঋতু, বতৰ আৰু বাজেটৰ ওপৰত ভিত্তি কৰি ব্যক্তিগত শস্য পৰামৰ্শ লাভ কৰক', hi: 'अपनी मिट्टी, मौसम, जलवायु और बजट के आधार पर व्यक्तिगत फसल सिफारिश प्राप्त करें' },

  // ─── Form Labels ─────────────────
  'label_district': { en: 'District', as: 'জিলা', hi: 'जिला' },
  'label_soil': { en: 'Soil Type', as: 'মাটিৰ প্ৰকাৰ', hi: 'मिट्टी का प्रकार' },
  'label_season': { en: 'Season', as: 'ঋতু', hi: 'मौसम' },
  'label_water': { en: 'Water Availability', as: 'পানীৰ উপলব্ধতা', hi: 'पानी की उपलब्धता' },
  'label_budget': { en: 'Budget', as: 'বাজেট', hi: 'बजट' },
  'select_placeholder': { en: '-- Select --', as: '-- বাছক --', hi: '-- चुनें --' },
  'select_district_placeholder': { en: '-- Select District --', as: '-- জিলা বাছক --', hi: '-- जिला चुनें --' },

  // ─── Soil Types ──────────────────
  'soil_clay': { en: 'Clay', as: 'মাটিয়া', hi: 'चिकनी मिट्टी' },
  'soil_loam': { en: 'Loam', as: 'দোমোজা', hi: 'दोमट' },
  'soil_sandy': { en: 'Sandy', as: 'বালিচহীয়া', hi: 'बलुई' },
  'soil_alluvial': { en: 'Alluvial', as: 'পলসুৱা', hi: 'जलोढ़' },
  'soil_laterite': { en: 'Laterite', as: 'লেটেৰাইট', hi: 'लैटेराइट' },

  // ─── Seasons ─────────────────────
  'season_kharif': { en: 'Kharif (Jun–Oct)', as: 'খাৰিফ (জুন–অক্টোবৰ)', hi: 'खरीफ (जून–अक्टूबर)' },
  'season_rabi': { en: 'Rabi (Nov–Mar)', as: 'ৰবি (নৱেম্বৰ–মাৰ্চ)', hi: 'रबी (नवंबर–मार्च)' },
  'season_zaid': { en: 'Zaid (Mar–Jun)', as: 'জাইদ (মাৰ্চ–জুন)', hi: 'जायद (मार्च–जून)' },

  // ─── Water Availability ──────────
  'water_rainfed': { en: 'Rain-fed', as: 'বৰষুণ-নিৰ্ভৰ', hi: 'वर्षा आधारित' },
  'water_irrigated': { en: 'Irrigated', as: 'জলসিঞ্চিত', hi: 'सिंचित' },
  'water_partial': { en: 'Partially Irrigated', as: 'আংশিক জলসিঞ্চিত', hi: 'आंशिक सिंचित' },

  // ─── Budget ──────────────────────
  'budget_low': { en: 'Low (Under ₹3,000/bigha)', as: 'কম (₹৩,০০০/বিঘাৰ তলত)', hi: 'कम (₹3,000/बीघा से कम)' },
  'budget_medium': { en: 'Medium (₹3,000–8,000/bigha)', as: 'মধ্যমীয়া (₹৩,০০০–৮,০০০/বিঘা)', hi: 'मध्यम (₹3,000–8,000/बीघा)' },
  'budget_high': { en: 'High (Above ₹8,000/bigha)', as: 'বেছি (₹৮,০০০/বিঘাৰ ওপৰত)', hi: 'अधिक (₹8,000/बीघा से ऊपर)' },

  // ─── Button ──────────────────────
  'btn_submit': { en: 'Get Recommendations', as: 'পৰামৰ্শ লাভ কৰক', hi: 'सिफारिश प्राप्त करें' },
  'btn_loading': { en: 'Analyzing your conditions...', as: 'আপোনাৰ পৰিস্থিতি বিশ্লেষণ কৰি আছে...', hi: 'आपकी स्थिति का विश्लेषण हो रहा है...' },

  // ─── Results ─────────────────────
  'results_title': { en: 'Recommended Crops', as: 'পৰামৰ্শিত শস্য', hi: 'अनुशंसित फसलें' },
  'label_sowing': { en: 'Sowing Window', as: 'সিঁচাৰ সময়', hi: 'बुवाई का समय' },
  'label_harvest': { en: 'Harvest Time', as: 'চপোৱাৰ সময়', hi: 'कटाई का समय' },
  'label_fertilizer': { en: 'Fertilizer', as: 'সাৰ', hi: 'उर्वरक' },
  'label_yield': { en: 'Expected Yield', as: 'আশা কৰা উৎপাদন', hi: 'अपेक्षित उपज' },
  'label_water_needs': { en: 'Water Needs', as: 'পানীৰ প্ৰয়োজন', hi: 'पानी की आवश्यकता' },
  'label_cost': { en: 'Estimated Cost', as: 'আনুমানিক খৰচ', hi: 'अनुमानित लागत' },
  'label_tips': { en: 'Tips', as: 'পৰামৰ্শ', hi: 'सुझाव' },
  'label_general_advice': { en: 'General Advice', as: 'সাধাৰণ পৰামৰ্শ', hi: 'सामान्य सलाह' },

  // ─── Weather Widget ──────────────
  'weather_title': { en: 'Current Weather', as: 'বৰ্তমান বতৰ', hi: 'वर्तमान मौसम' },
  'weather_temp': { en: 'Temperature', as: 'তাপমাত্ৰা', hi: 'तापमान' },
  'weather_humidity': { en: 'Humidity', as: 'আৰ্দ্ৰতা', hi: 'आर्द्रता' },
  'weather_rainfall': { en: '7-Day Rainfall', as: '৭ দিনৰ বৰষুণ', hi: '7 दिन की बारिश' },
  'weather_wind': { en: 'Wind Speed', as: 'বতাহৰ গতি', hi: 'हवा की गति' },
  'weather_max_temp': { en: 'Max Temp', as: 'সৰ্বোচ্চ তাপ', hi: 'अधिकतम तापमान' },
  'weather_min_temp': { en: 'Min Temp', as: 'সৰ্বনিম্ন তাপ', hi: 'न्यूनतम तापमान' },

  // ─── Hero ─────────────────────────
  'hero_badge': { en: '🤖 AI-Powered Advisory', as: '🤖 AI চালিত পৰামৰ্শ', hi: '🤖 AI आधारित सलाह' },

  // ─── Government Schemes ──────────
  'schemes_title': { en: '🏛️ Government Schemes For You', as: '🏛️ আপোনাৰ বাবে চৰকাৰী আঁচনি', hi: '🏛️ आपके लिए सरकारी योजनाएं' },
  'schemes_subtitle': { en: 'These schemes can help you with funding, insurance, and support. Follow the simple steps to apply.', as: 'এই আঁচনিসমূহে আপোনাক পুঁজি, বীমা আৰু সহায়তাত সহায় কৰিব পাৰে। আবেদন কৰিবলৈ সৰল পদক্ষেপসমূহ অনুসৰণ কৰক।', hi: 'ये योजनाएं आपको धन, बीमा और सहायता में मदद कर सकती हैं। आवेदन करने के लिए सरल चरणों का पालन करें।' },
  'scheme_eligibility': { en: 'Who can apply', as: 'কোনে আবেদন কৰিব পাৰে', hi: 'कौन आवेदन कर सकता है' },
  'scheme_benefits': { en: 'Benefits', as: 'সুবিধা', hi: 'लाभ' },
  'scheme_how_to_apply': { en: 'How to Apply (Simple Steps)', as: 'কেনেকৈ আবেদন কৰিব (সৰল পদক্ষেপ)', hi: 'आवेदन कैसे करें (आसान चरण)' },
  'scheme_documents': { en: 'Documents Needed', as: 'প্ৰয়োজনীয় নথি-পত্ৰ', hi: 'आवश्यक दस्तावेज' },
  'scheme_helpline': { en: 'Helpline', as: 'হেল্পলাইন', hi: 'हेल्पलाइन' },


  // ─── Tabs ─────────────────────────
  'tab_software': { en: '💻 Software', as: '💻 চফ্টৱেৰ', hi: '💻 सॉफ्टवेयर' },
  'tab_hardware': { en: '🔩 Hardware', as: '🔩 হাৰ্ডৱেৰ', hi: '🔩 हार्डवेयर' },

  // ─── Hardware Tab ─────────────────
  'hw_waiting': { en: 'Waiting for ESP32-CAM device...', as: 'ESP32-CAM ডিভাইচৰ বাবে অপেক্ষা কৰি আছে...', hi: 'ESP32-CAM डिवाइस की प्रतीक्षा में...' },
  'hw_connected': { en: '🟢 ESP32-CAM connected — data received!', as: '🟢 ESP32-CAM সংযুক্ত — তথ্য পোৱা গৈছে!', hi: '🟢 ESP32-CAM जुड़ा — डेटा प्राप्त!' },
  'hw_description': { en: '📷 Connect your ESP32-CAM to capture soil images. The AI will analyze the soil and display results here in real time.', as: '📷 মাটিৰ ছবি ল\'বলৈ আপোনাৰ ESP32-CAM সংযোগ কৰক। AI-য়ে মাটি বিশ্লেষণ কৰি ইয়াত ফলাফল দেখুৱাব।', hi: '📷 मिट्टी की तस्वीर लेने के लिए ESP32-CAM कनेक्ट करें। AI मिट्टी का विश्लेषण करेगा और यहाँ परिणाम दिखाएगा।' },
  'hw_soil_type': { en: 'Soil Type', as: 'মাটিৰ প্ৰকাৰ', hi: 'मिट्टी का प्रकार' },
  'hw_weather_outlook': { en: 'Weather Outlook', as: 'বতৰৰ আভাস', hi: 'मौसम का अनुमान' },
  'hw_best_crop': { en: 'Best Crop', as: 'শ্ৰেষ্ঠ শস্য', hi: 'सर्वश्रेष्ठ फसल' },
  'hw_waiting_short': { en: 'Waiting...', as: 'অপেক্ষা কৰক...', hi: 'प्रतीक्षा करें...' },
  'hw_images_received': { en: 'Images received', as: 'ছবি পোৱা গৈছে', hi: 'तस्वीरें प्राप्त' },
  'hw_last_updated': { en: 'Last updated', as: 'শেষ আপডেট', hi: 'अंतिम अपडेट' },
  'hw_auto_refresh': { en: 'Auto-refreshing every 5 seconds', as: 'প্ৰতি ৫ ছেকেণ্ডত স্বয়ংক্ৰিয়ভাৱে আপডেট হৈ আছে', hi: 'हर 5 सेकंड में स्वतः रिफ्रेश हो रहा है' },
  // ─── Footer ──────────────────────
  'footer_text': { en: 'Built with ❤️ for Assam\'s Farmers', as: 'অসমৰ কৃষকৰ বাবে ❤️ ৰে নিৰ্মিত', hi: 'असम के किसानों के लिए ❤️ से बनाया गया' },
  'footer_hackathon': { en: 'Hackathon Project 2026', as: 'হেকাথন প্ৰকল্প ২০২৬', hi: 'हैकाथॉन प्रोजेक्ट 2026' },

  // ─── Errors ──────────────────────
  'error_generic': { en: 'Something went wrong. Please try again.', as: 'কিবা ভুল হ\'ল। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।', hi: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।' },
  'error_fields': { en: 'Please fill in all fields.', as: 'অনুগ্ৰহ কৰি সকলো ক্ষেত্ৰ পূৰণ কৰক।', hi: 'कृपया सभी फ़ील्ड भरें।' }
};

// Language cycle order
const LANGUAGES = ['en', 'as', 'hi'];
const LANG_LABELS = { en: 'English', as: 'অসমীয়া', hi: 'हिन्दी' };

// Current language state
let currentLang = 'en';

/**
 * Cycle through languages: EN → অসমীয়া → हिन्दी → EN
 */
function toggleLanguage() {
  const currentIndex = LANGUAGES.indexOf(currentLang);
  const nextIndex = (currentIndex + 1) % LANGUAGES.length;
  currentLang = LANGUAGES[nextIndex];
  applyTranslations();
  localStorage.setItem('krishimitra_lang', currentLang);
  updateToggleButton();

  // If results are currently visible, re-fetch everything in the new language
  const resultsSection = document.getElementById('resultsSection');
  if (resultsSection && !resultsSection.classList.contains('hidden')) {
    if (typeof refetchInLanguage === 'function') {
      refetchInLanguage();
    }
  }
}

/**
 * Update the toggle button text to show the NEXT language
 */
function updateToggleButton() {
  const btn = document.getElementById('langToggle');
  if (btn) {
    // Show the next language name as the button label
    const currentIndex = LANGUAGES.indexOf(currentLang);
    const nextIndex = (currentIndex + 1) % LANGUAGES.length;
    btn.textContent = LANG_LABELS[LANGUAGES[nextIndex]];
  }
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key] && translations[key][currentLang]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[key][currentLang];
      } else if (el.tagName === 'OPTION') {
        el.textContent = translations[key][currentLang];
      } else {
        el.textContent = translations[key][currentLang];
      }
    }
  });
}

/**
 * Get translation for a key
 */
function t(key) {
  if (translations[key] && translations[key][currentLang]) {
    return translations[key][currentLang];
  }
  return key;
}

/**
 * Initialize language from localStorage
 */
function initLanguage() {
  const saved = localStorage.getItem('krishimitra_lang');
  if (saved && LANGUAGES.includes(saved)) {
    currentLang = saved;
  }
  applyTranslations();
  updateToggleButton();
}
