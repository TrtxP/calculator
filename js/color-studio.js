// ==========================================================================
// 3-Канальний Живий HSL Мікшер
// ==========================================================================
let mixerHue = 340;
let mixerSat = 80;
let mixerDark = 8;

function updateLiveHueMixer(val) {
    mixerHue = parseInt(val);
    const label = document.getElementById('hue-accent-val');
    if (label) label.innerText = `${val}°`;
    applyLiveHslMixer();
}

function updateLiveSatMixer(val) {
    mixerSat = parseInt(val);
    const label = document.getElementById('sat-accent-val');
    if (label) label.innerText = `${val}%`;
    applyLiveHslMixer();
}

function updateLiveDarkMixer(val) {
    mixerDark = parseInt(val);
    const label = document.getElementById('dark-bg-val');
    if (label) label.innerText = `${val}%`;
    applyLiveHslMixer();
}

function applyLiveHslMixer() {
    const accent = `hsl(${mixerHue}, ${mixerSat}%, 45%)`;
    const glow = `hsl(${mixerHue}, ${mixerSat}%, 60%)`;
    const bg = `hsl(${mixerHue}, ${Math.max(10, mixerSat - 40)}%, ${mixerDark}%)`;

    document.documentElement.style.setProperty('--accent-operator', accent);
    document.documentElement.style.setProperty('--accent-equals', glow);
    document.documentElement.style.setProperty('--bg-body', bg);
    document.documentElement.style.setProperty('--badge-bg', `hsla(${mixerHue}, ${mixerSat}%, 50%, 0.18)`);
    document.documentElement.style.setProperty('--badge-border', `hsla(${mixerHue}, ${mixerSat}%, 50%, 0.45)`);
}

function applyColorHarmony(preset) {
    audio.playAction();
    const hSlider = document.getElementById('slider-accent-hue');
    const sSlider = document.getElementById('slider-accent-sat');
    const dSlider = document.getElementById('slider-bg-dark');

    if (preset === 'wine_gold') {
        mixerHue = 345; mixerSat = 85; mixerDark = 6;
        document.documentElement.style.setProperty('--accent-operator', '#8b1538');
        document.documentElement.style.setProperty('--accent-equals', '#f59e0b');
        document.documentElement.style.setProperty('--bg-body', '#0d0205');
    } else if (preset === 'ruby_cyber') {
        mixerHue = 350; mixerSat = 100; mixerDark = 4;
        document.documentElement.style.setProperty('--accent-operator', '#ff0055');
        document.documentElement.style.setProperty('--accent-equals', '#ff00a0');
        document.documentElement.style.setProperty('--bg-body', '#060003');
    } else if (preset === 'blood_moon') {
        mixerHue = 0; mixerSat = 90; mixerDark = 5;
        document.documentElement.style.setProperty('--accent-operator', '#dc2626');
        document.documentElement.style.setProperty('--accent-equals', '#ea580c');
        document.documentElement.style.setProperty('--bg-body', '#0c0203');
    } else if (preset === 'cosmic_amethyst') {
        mixerHue = 290; mixerSat = 85; mixerDark = 6;
        document.documentElement.style.setProperty('--accent-operator', '#c026d3');
        document.documentElement.style.setProperty('--accent-equals', '#e11d48');
        document.documentElement.style.setProperty('--bg-body', '#0e010e');
    } else if (preset === 'emerald_wine') {
        mixerHue = 160; mixerSat = 80; mixerDark = 5;
        document.documentElement.style.setProperty('--accent-operator', '#10b981');
        document.documentElement.style.setProperty('--accent-equals', '#8b1538');
        document.documentElement.style.setProperty('--bg-body', '#02120e');
    }

    if (hSlider) hSlider.value = mixerHue;
    if (sSlider) sSlider.value = mixerSat;
    if (dSlider) dSlider.value = mixerDark;
    const hL = document.getElementById('hue-accent-val');
    const sL = document.getElementById('sat-accent-val');
    const dL = document.getElementById('dark-bg-val');
    if (hL) hL.innerText = `${mixerHue}°`;
    if (sL) sL.innerText = `${mixerSat}%`;
    if (dL) dL.innerText = `${mixerDark}%`;

    showToast(`Гармонію ${preset} застосовано`, '🎨');
}

