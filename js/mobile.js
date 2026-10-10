// ==========================================================================
// Мобільна навігація та профіль продуктивності
// ==========================================================================
const mobilePerf = {
    isMobile: false,
    isTouch: false,
    isCoarse: false,
    prefersReducedMotion: false,
    saveData: false,
    weakDevice: false,
    // Фактичний режим після розв'язання 'auto': 'lite' | 'balanced' | 'full'
    mode: 'balanced',
    liteMode: false
};

function detectMobilePerfProfile() {
    mobilePerf.isMobile = window.matchMedia('(max-width: 768px)').matches;
    mobilePerf.isCoarse = window.matchMedia('(pointer: coarse)').matches;
    mobilePerf.isTouch = mobilePerf.isCoarse || 'ontouchstart' in window;
    mobilePerf.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    mobilePerf.saveData = navigator.connection?.saveData === true;
    mobilePerf.weakDevice = (navigator.hardwareConcurrency || 8) <= 2 || (navigator.deviceMemory || 8) <= 2;

    const pref = state.perfMode;
    if (pref === 'lite' || pref === 'full') {
        mobilePerf.mode = pref;
    } else {
        const needsLite = mobilePerf.isMobile || mobilePerf.isCoarse ||
            mobilePerf.prefersReducedMotion || mobilePerf.saveData || mobilePerf.weakDevice;
        mobilePerf.mode = needsLite ? 'lite' : 'balanced';
    }
    mobilePerf.liteMode = mobilePerf.mode === 'lite';
    return mobilePerf;
}

function applyMobilePerfOptimizations() {
    const profile = detectMobilePerfProfile();
    const root = document.documentElement;

    root.classList.toggle('is-mobile', profile.isMobile);
    root.classList.toggle('is-touch', profile.isTouch);
    root.classList.toggle('reduced-motion', profile.prefersReducedMotion);
    root.classList.toggle('perf-lite', profile.mode === 'lite');
    root.classList.toggle('perf-full', profile.mode === 'full');

    // Частинки: у легкому режимі вимкнені, інакше — за вибором користувача
    state.particlesEnabled = profile.mode !== 'lite' && localStorage.getItem('calc_particles') !== 'off';

    // Прозорість панелей: у легкому режимі за замовчуванням суцільний колір
    state.glassIntensity = localStorage.getItem('calc_glass') || (profile.mode === 'lite' ? 'solid' : 'heavy');
}

function setPerfMode(val) {
    if (val !== 'auto' && val !== 'lite' && val !== 'full') val = 'auto';
    state.perfMode = val;
    localStorage.setItem('calc_perf_mode', val);

    applyMobilePerfOptimizations();
    applyGlassIntensity(state.glassIntensity);
    applyWallpaperToDom();
    if (state.particlesEnabled) {
        initParticlesCanvas();
    } else {
        stopParticlesCanvas();
    }
    syncSettingsControls();
    audio.playAction();

    const names = {
        auto: mobilePerf.mode === 'lite' ? 'Авто (зараз: Легкий)' : 'Авто (зараз: Збалансований)',
        lite: 'Легкий',
        full: 'Повний'
    };
    showToast(`Режим продуктивності: ${names[val]}`, '⚡');
}

function shouldDrawParticleConnections() {
    return mobilePerf.mode === 'full';
}

function getParticleCountLimit() {
    if (mobilePerf.mode === 'full') return 60;
    return 20;
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) {
        sidebar.classList.toggle('mobile-open');
    }
    if (backdrop) {
        backdrop.classList.toggle('active');
    }
    requestAnimationFrame(() => {
        audio.playClick(650);
    });
}

function adjustWallpaperBlur(val) {
    state.wallpaperBlur = parseInt(val, 10);
    localStorage.setItem('calc_wp_blur', String(state.wallpaperBlur));
    const label = document.getElementById('wp-blur-val');
    if (label) label.innerText = `${state.wallpaperBlur}px`;
    applyWallpaperToDom();
}

function adjustWallpaperOverlay(val) {
    state.wallpaperOverlay = parseInt(val);
    localStorage.setItem('calc_wp_overlay', val);
    const label = document.getElementById('wp-opacity-val');
    if (label) label.innerText = `${val}%`;
    applyWallpaperToDom();
}

function handleWallpaperUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        state.customWallpaperUrl = e.target.result;
        state.currentWallpaper = 'custom';
        localStorage.setItem('calc_custom_wp', state.customWallpaperUrl);
        localStorage.setItem('calc_wallpaper', 'custom');
        applyWallpaperToDom();
        showToast('Власне зображення встановлено', '🖼️');
    };
    reader.readAsDataURL(file);
}

function applyWallpaperUrl() {
    const input = document.getElementById('wallpaper-url-input');
    if (!input || !input.value.trim()) return;
    state.customWallpaperUrl = input.value.trim();
    state.currentWallpaper = 'custom';
    localStorage.setItem('calc_custom_wp', state.customWallpaperUrl);
    localStorage.setItem('calc_wallpaper', 'custom');
    applyWallpaperToDom();
    showToast('Шпалери за URL встановлено', '🌐');
}

function resetWallpaper() {
    setWallpaper('burgundy');
    adjustWallpaperBlur(12);
    adjustWallpaperOverlay(60);
    const bSlider = document.getElementById('wp-blur-slider');
    const oSlider = document.getElementById('wp-opacity-slider');
    if (bSlider) bSlider.value = 12;
    if (oSlider) oSlider.value = 60;
    showToast('Фон скинуто до початкового', '🧹');
}
