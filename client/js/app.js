/**
 * KrishiMitra — Main Application Logic
 */

const API_BASE = window.location.origin;

// Store last form data to re-fetch when language changes
let lastFormData = null;
let isRefetching = false;

// ─── Hardware state ───────────────────────────────
let hwPollingInterval = null;
let hwLastData = null;
let activeTab = 'software';

// ─── DOM Elements ─────────────────────────────────
const cropForm = document.getElementById('cropForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnSpinner = document.getElementById('btnSpinner');
const resultsSection = document.getElementById('resultsSection');
const weatherGrid = document.getElementById('weatherGrid');
const cropCards = document.getElementById('cropCards');
const generalAdvice = document.getElementById('generalAdvice');
const schemesSection = document.getElementById('schemesSection');
const schemeCards = document.getElementById('schemeCards');
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

  // Store form data for language re-fetch
  lastFormData = { ...formData };

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
 * Re-fetch results in a new language (called when language toggles with results visible)
 */
async function refetchInLanguage() {
  if (!lastFormData || isRefetching) return;

  isRefetching = true;
  lastFormData.lang = currentLang;

  // Show a subtle loading indicator on the results
  resultsSection.style.opacity = '0.5';
  resultsSection.style.pointerEvents = 'none';

  try {
    const res = await fetch(`${API_BASE}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lastFormData)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || t('error_generic'));
    }

    renderResults(data, false); // false = don't scroll
  } catch (err) {
    console.error('Language re-fetch failed:', err);
    // Just re-render labels with current translations, keep old data
  } finally {
    resultsSection.style.opacity = '1';
    resultsSection.style.pointerEvents = 'auto';
    isRefetching = false;
  }
}

/**
 * Render the full results: weather + crop cards + advice
 * @param {boolean} shouldScroll - whether to auto-scroll to results (default true)
 */
function renderResults(data, shouldScroll = true) {
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

  // Render government schemes
  if (data.schemes && data.schemes.length > 0) {
    renderSchemeCards(data.schemes);
    schemesSection.classList.remove('hidden');
  } else {
    schemesSection.classList.add('hidden');
  }

  // Smooth scroll to results
  if (shouldScroll) {
    setTimeout(() => {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }

  // Re-apply translations for static labels
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
    { icon: '☀️', value: `${weather.avg_max_temp}°C`, label: t('weather_max_temp') },
    { icon: '🌙', value: `${weather.avg_min_temp}°C`, label: t('weather_min_temp') }
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
 * Render government scheme cards
 */
function renderSchemeCards(schemes) {
  schemeCards.innerHTML = schemes.map((scheme, i) => {
    const steps = Array.isArray(scheme.how_to_apply)
      ? scheme.how_to_apply
      : (scheme.how_to_apply || '').split(/\n|;/).filter(Boolean);

    const typeBadge = scheme.type === 'State' || scheme.type === 'ৰাজ্যিক' || scheme.type === 'राज्य'
      ? `<span class="scheme-badge scheme-badge-state">🏛️ ${scheme.type}</span>`
      : `<span class="scheme-badge scheme-badge-central">🇮🇳 ${scheme.type}</span>`;

    return `
      <div class="scheme-card" style="animation-delay: ${i * 0.08}s">
        <div class="scheme-card-header">
          <div class="scheme-card-title">
            <h4>${scheme.scheme_name}</h4>
            ${typeBadge}
          </div>
        </div>
        <p class="scheme-description">${scheme.description}</p>

        <div class="scheme-info-grid">
          <div class="scheme-info-item">
            <span class="scheme-info-icon">👤</span>
            <div>
              <span class="scheme-info-label">${t('scheme_eligibility')}</span>
              <span class="scheme-info-value">${scheme.eligibility}</span>
            </div>
          </div>
          <div class="scheme-info-item">
            <span class="scheme-info-icon">🎁</span>
            <div>
              <span class="scheme-info-label">${t('scheme_benefits')}</span>
              <span class="scheme-info-value">${scheme.benefits}</span>
            </div>
          </div>
        </div>

        <div class="scheme-steps">
          <h5>📋 ${t('scheme_how_to_apply')}</h5>
          <ol class="steps-list">
            ${steps.map(step => {
              const cleanStep = step.replace(/^Step\s*\d+[:.\-]\s*/i, '');
              return `<li>${cleanStep}</li>`;
            }).join('')}
          </ol>
        </div>

        <div class="scheme-footer">
          ${scheme.documents_needed ? `
            <div class="scheme-docs">
              <span class="scheme-info-icon">📄</span>
              <span><strong>${t('scheme_documents')}:</strong> ${scheme.documents_needed}</span>
            </div>
          ` : ''}
          ${scheme.helpline ? `
            <div class="scheme-helpline">
              <span class="scheme-info-icon">📞</span>
              <span><strong>${t('scheme_helpline')}:</strong> ${scheme.helpline}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
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

// ═══════════════════════════════════════════════════
// ─── TAB SWITCHING ────────────────────────────────
// ═══════════════════════════════════════════════════

function switchTab(tab) {
  activeTab = tab;

  // Toggle tab buttons
  document.getElementById('tabSoftware').classList.toggle('active', tab === 'software');
  document.getElementById('tabHardware').classList.toggle('active', tab === 'hardware');

  // Toggle tab content
  document.getElementById('softwareTab').classList.toggle('active', tab === 'software');
  document.getElementById('hardwareTab').classList.toggle('active', tab === 'hardware');

  // Start/stop hardware polling
  if (tab === 'hardware') {
    startHardwarePolling();
  } else {
    stopHardwarePolling();
  }
}

// ═══════════════════════════════════════════════════
// ─── HARDWARE TAB ─────────────────────────────────
// ═══════════════════════════════════════════════════

function startHardwarePolling() {
  // Fetch immediately
  fetchHardwareData();
  // Then poll every 5 seconds
  if (hwPollingInterval) clearInterval(hwPollingInterval);
  hwPollingInterval = setInterval(fetchHardwareData, 5000);
}

function stopHardwarePolling() {
  if (hwPollingInterval) {
    clearInterval(hwPollingInterval);
    hwPollingInterval = null;
  }
}

async function fetchHardwareData() {
  try {
    const res = await fetch(`${API_BASE}/api/latest-advisory`);
    const data = await res.json();
    updateHardwareUI(data);
  } catch (err) {
    console.error('Hardware fetch error:', err);
  }
}

function updateHardwareUI(data) {
  const dot = document.getElementById('hwStatusDot');
  const statusText = document.getElementById('hwStatusText');
  const soilVal = document.getElementById('hwSoilValue');
  const weatherVal = document.getElementById('hwWeatherValue');
  const cropVal = document.getElementById('hwCropValue');
  const soilCard = document.getElementById('hwSoilCard');
  const weatherCard = document.getElementById('hwWeatherCard');
  const cropCard = document.getElementById('hwCropCard');
  const countVal = document.getElementById('hwImageCountVal');
  const timestampEl = document.getElementById('hwTimestamp');

  // Update image count
  countVal.textContent = data.imageCount || 0;

  if (data.ready) {
    // Connected state
    dot.className = 'hw-status-dot connected';
    statusText.textContent = t('hw_connected');

    // Check if data actually changed
    const dataChanged = !hwLastData ||
      hwLastData.soil !== data.soil ||
      hwLastData.weather !== data.weather ||
      hwLastData.crop !== data.crop;

    // Update card values
    soilVal.textContent = data.soil;
    soilVal.classList.remove('waiting');
    weatherVal.textContent = data.weather;
    weatherVal.classList.remove('waiting');
    cropVal.textContent = data.crop;
    cropVal.classList.remove('waiting');

    // Add ready class for colored top borders
    soilCard.classList.add('ready');
    weatherCard.classList.add('ready');
    cropCard.classList.add('ready');

    // Animate cards if data changed
    if (dataChanged) {
      [soilCard, weatherCard, cropCard].forEach(card => {
        card.classList.remove('updated');
        void card.offsetWidth; // force reflow
        card.classList.add('updated');
      });
    }

    // Update timestamp
    if (data.timestamp) {
      const date = new Date(data.timestamp);
      timestampEl.textContent = date.toLocaleTimeString();
    }

    hwLastData = { ...data };
  } else {
    // Waiting state
    dot.className = 'hw-status-dot waiting';
    statusText.textContent = t('hw_waiting');

    soilVal.textContent = t('hw_waiting_short');
    soilVal.classList.add('waiting');
    weatherVal.textContent = t('hw_waiting_short');
    weatherVal.classList.add('waiting');
    cropVal.textContent = t('hw_waiting_short');
    cropVal.classList.add('waiting');

    soilCard.classList.remove('ready');
    weatherCard.classList.remove('ready');
    cropCard.classList.remove('ready');

    timestampEl.textContent = '--';
  }
}
