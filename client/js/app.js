/**
 * KrishiMitra — Main Application Logic
 */

const API_BASE = window.location.origin;

// ─── DOM Elements ─────────────────────────────────
const cropForm = document.getElementById('cropForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnSpinner = document.getElementById('btnSpinner');
const resultsSection = document.getElementById('resultsSection');
const weatherGrid = document.getElementById('weatherGrid');
const cropCards = document.getElementById('cropCards');
const generalAdvice = document.getElementById('generalAdvice');
const errorToast = document.getElementById('errorToast');
const errorText = document.getElementById('errorText');

// ─── Initialize ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadDistricts();
  initLanguage();
});

/**
 * Load districts from API into the dropdown
 */
async function loadDistricts() {
  try {
    const res = await fetch(`${API_BASE}/api/districts`);
    const data = await res.json();
    const select = document.getElementById('district');

    data.districts.forEach(d => {
      const option = document.createElement('option');
      option.value = d.id;
      option.textContent = d.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error('Failed to load districts:', err);
  }
}

/**
 * Handle form submission
 */
cropForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    district: document.getElementById('district').value,
    soil: document.getElementById('soil').value,
    season: document.getElementById('season').value,
    water: document.getElementById('water').value,
    budget: document.getElementById('budget').value,
    lang: currentLang
  };

  // Validate all fields
  if (Object.values(formData).some(v => !v)) {
    showError(t('error_fields'));
    return;
  }

  // Show loading state
  setLoading(true);
  hideError();

  try {
    const res = await fetch(`${API_BASE}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || t('error_generic'));
    }

    renderResults(data);
  } catch (err) {
    showError(err.message || t('error_generic'));
  } finally {
    setLoading(false);
  }
});

/**
 * Render the full results: weather + crop cards + advice
 */
function renderResults(data) {
  // Show results section
  resultsSection.classList.remove('hidden');

  // Render weather widget
  renderWeather(data.weather);

  // Render crop cards
  renderCropCards(data.recommendations);

  // Render general advice
  if (data.general_advice) {
    generalAdvice.innerHTML = `
      <h4>💡 ${t('label_general_advice')}</h4>
      <p>${data.general_advice}</p>
    `;
  }

  // Smooth scroll to results
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);

  // Re-apply translations if in Assamese mode
  applyTranslations();
}

/**
 * Render weather widget
 */
function renderWeather(weather) {
  const items = [
    { icon: '🌡️', value: `${weather.current_temp}°C`, label: t('weather_temp') },
    { icon: '💧', value: `${weather.humidity}%`, label: t('weather_humidity') },
    { icon: '🌧️', value: `${weather.weekly_rainfall_mm}mm`, label: t('weather_rainfall') },
    { icon: '💨', value: `${weather.windspeed} km/h`, label: t('weather_wind') },
    { icon: '☀️', value: `${weather.avg_max_temp}°C`, label: 'Max Temp' },
    { icon: '🌙', value: `${weather.avg_min_temp}°C`, label: 'Min Temp' }
  ];

  weatherGrid.innerHTML = items.map(item => `
    <div class="weather-item">
      <div class="weather-icon">${item.icon}</div>
      <div class="weather-value">${item.value}</div>
      <div class="weather-label">${item.label}</div>
    </div>
  `).join('');
}

/**
 * Render crop recommendation cards
 */
function renderCropCards(recommendations) {
  cropCards.innerHTML = recommendations.map((crop, i) => `
    <div class="crop-card">
      <div class="crop-card-header">
        <div class="crop-number">${i + 1}</div>
        <div>
          <div class="crop-name">${crop.crop_name}</div>
          ${crop.crop_name_assamese ? `<div class="crop-name-assamese">${crop.crop_name_assamese}</div>` : ''}
        </div>
      </div>
      <div class="crop-details">
        ${renderDetail('📅', t('label_sowing'), crop.sowing_window)}
        ${renderDetail('🌾', t('label_harvest'), crop.harvest_time)}
        ${renderDetail('🧪', t('label_fertilizer'), crop.fertilizer)}
        ${renderDetail('📊', t('label_yield'), crop.expected_yield)}
        ${renderDetail('💧', t('label_water_needs'), crop.water_needs)}
        ${renderDetail('💰', t('label_cost'), crop.estimated_cost)}
      </div>
      ${crop.tips ? `
        <div class="crop-tips">
          <strong>💡 ${t('label_tips')}:</strong> ${crop.tips}
        </div>
      ` : ''}
    </div>
  `).join('');
}

/**
 * Render a single detail row
 */
function renderDetail(icon, label, value) {
  if (!value) return '';
  return `
    <div class="crop-detail">
      <span class="crop-detail-icon">${icon}</span>
      <span class="crop-detail-label">${label}</span>
      <span class="crop-detail-value">${value}</span>
    </div>
  `;
}

/**
 * Set loading state
 */
function setLoading(loading) {
  submitBtn.disabled = loading;
  if (loading) {
    btnText.textContent = t('btn_loading');
    btnSpinner.classList.remove('hidden');
  } else {
    btnText.textContent = t('btn_submit');
    btnSpinner.classList.add('hidden');
  }
}

/**
 * Show error toast
 */
function showError(message) {
  errorText.textContent = message;
  errorToast.classList.remove('hidden');
  // Auto-hide after 6 seconds
  setTimeout(hideError, 6000);
}

/**
 * Hide error toast
 */
function hideError() {
  errorToast.classList.add('hidden');
}
