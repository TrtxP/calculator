// ==========================================================================
// Центр Налаштувань
// ==========================================================================
let volumeSaveTimer = null;
let lastVolumeClickTime = 0;

function syncSettingsControls() {
    const vSlider = document.getElementById('setting-volume');
    const vVal = document.getElementById('setting-vol-val');
    const sProf = document.getElementById('setting-sound-profile');
    const sSep = document.getElementById('setting-separator');
    const sPrec = document.getElementById('setting-precision');
    const sAng = document.getElementById('setting-angle');
    const sGlass = document.getElementById('setting-glass');
    const sPart = document.getElementById('setting-particles');
    const sFScale = document.getElementById('setting-font-scale');
    const sPerf = document.getElementById('setting-perf-mode');
    if (sPerf) sPerf.value = state.perfMode;
    if (vSlider) vSlider.value = Math.round(state.soundVolume * 100);
    if (vVal) vVal.innerText = `${Math.round(state.soundVolume * 100)}%`;
    if (sProf) sProf.value = state.soundProfile;
    if (sSep) sSep.value = state.thousandSeparator;
    if (sPrec) sPrec.value = state.precisionMode;
    if (sAng) sAng.value = state.angleMode;
    if (sGlass) sGlass.value = state.glassIntensity;
    if (sPart) sPart.value = state.particlesEnabled ? 'on' : 'off';
    if (sFScale) sFScale.value = state.fontScale.toString();
}

function updateSettingsVolume(val) {
    state.soundVolume = parseFloat(val) / 100;
    const label = document.getElementById('setting-vol-val');
    if (label) label.innerText = `${val}%`;

    // oninput спрацьовує ~60 разів/сек під час перетягування на мобільних:
    // обмежуємо частоту звуку і відкладаємо запис у localStorage,
    // щоб не блокувати головний потік на кожен крок слайдера
    const now = performance.now();
    if (now - lastVolumeClickTime > 180) {
        lastVolumeClickTime = now;
        audio.playClick(750);
    }

    updateAudioUI();

    clearTimeout(volumeSaveTimer);
    volumeSaveTimer = setTimeout(() => {
        localStorage.setItem('calc_sound_vol', state.soundVolume.toString());
    }, 300);
}

function setSettingsSoundProfile(val) {
    state.soundProfile = val;
    localStorage.setItem('calc_sound_profile', val);
    audio.playAction();
    updateAudioUI();
}

function setSettingsSeparator(val) {
    state.thousandSeparator = val;
    localStorage.setItem('calc_separator', val);
    audio.playAction();
    updateDisplay();
}

function setSettingsPrecision(val) {
    state.precisionMode = val;
    localStorage.setItem('calc_precision', val);
    audio.playAction();
    updateDisplay();
}

function setSettingsDefaultAngle(val) {
    state.angleMode = val;
    localStorage.setItem('calc_angle_mode', val);
    audio.playAction();
    updateDisplay();
}

// Прозорість панелей керується атрибутом data-glass (див. mobile-perf.css 22.9):
// лише колір фону, без backdrop-filter
function applyGlassIntensity(val = state.glassIntensity) {
    document.documentElement.setAttribute('data-glass', val);
}

function setSettingsGlassIntensity(val) {
    state.glassIntensity = val;
    localStorage.setItem('calc_glass', val);
    applyGlassIntensity(val);
    audio.playAction();
}

function resetAllSettings() {
    audio.playAction();
    localStorage.clear();
    state.soundVolume = 0.8;
    state.soundProfile = 'classic';
    state.precisionMode = 'auto';
    state.thousandSeparator = 'space';
    state.angleMode = 'DEG';
    state.currentTheme = 'bordeaux_luxury';
    state.currentFont = 'font-inter';
    state.fontScale = 100;
    state.currentWallpaper = 'burgundy';
    state.memoryValue = 0;
    state.memorySlots = [0, 0, 0, 0];

    document.getElementById('setting-volume').value = 80;
    document.getElementById('setting-vol-val').innerText = '80%';
    document.getElementById('setting-sound-profile').value = 'classic';
    document.getElementById('setting-separator').value = 'space';
    document.getElementById('setting-precision').value = 'auto';
    document.getElementById('setting-angle').value = 'DEG';
    document.getElementById('setting-glass').value = 'heavy';
    const setFontScaleEl = document.getElementById('setting-font-scale');
    if (setFontScaleEl) setFontScaleEl.value = '100';

    setFontScale(100, true);
    setFontFamily('font-inter');
    setTheme('bordeaux_luxury');
    setWallpaper('burgundy');

    state.perfMode = 'auto';
    applyMobilePerfOptimizations();
    applyGlassIntensity(state.glassIntensity);
    applyWallpaperToDom();
    if (state.particlesEnabled) {
        initParticlesCanvas();
    } else {
        stopParticlesCanvas();
    }
    syncSettingsControls();

    updateDisplay();
    closeModal('settings-modal');
    showToast('Всі налаштування скинуто до заводських', '🔁');
}

