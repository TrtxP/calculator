// ==========================================================================
// Центр Налаштувань
// ==========================================================================
function updateSettingsVolume(val) {
    state.soundVolume = parseFloat(val) / 100;
    localStorage.setItem('calc_sound_vol', state.soundVolume.toString());
    const label = document.getElementById('setting-vol-val');
    if (label) label.innerText = `${val}%`;
    audio.playClick(750);
    updateAudioUI();
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

function setSettingsGlassIntensity(val) {
    state.glassIntensity = val;
    localStorage.setItem('calc_glass', val);
    const card = document.querySelector('.app-container');
    if (card) {
        if (val === 'ultra') card.style.backdropFilter = 'blur(40px)';
        else if (val === 'subtle') card.style.backdropFilter = 'blur(10px)';
        else if (val === 'solid') card.style.backdropFilter = 'none';
        else card.style.backdropFilter = 'blur(24px)';
    }
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
    updateDisplay();
    closeModal('settings-modal');
    showToast('Всі налаштування скинуто до заводських', '🔁');
}

