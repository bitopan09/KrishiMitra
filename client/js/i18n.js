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
