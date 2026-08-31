// ==========================================================================
// Мобільна навігація та профіль продуктивності
// ==========================================================================
const mobilePerf = {
    isMobile: false,
    isTouch: false,
    prefersReducedMotion: false,
    saveData: false,
    liteMode: false
};

function detectMobilePerfProfile() {
    mobilePerf.isMobile = window.matchMedia('(max-width: 768px)').matches;
    mobilePerf.isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    mobilePerf.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    mobilePerf.saveData = navigator.connection?.saveData === true;
    mobilePerf.liteMode = mobilePerf.isMobile || mobilePerf.prefersReducedMotion || mobilePerf.saveData;
    return mobilePerf;
}

function applyMobilePerfOptimizations() {
    const profile = detectMobilePerfProfile();
    const root = document.documentElement;

    root.classList.toggle('is-mobile', profile.isMobile);
    root.classList.toggle('is-touch', profile.isTouch);
    root.classList.toggle('reduced-motion', profile.prefersReducedMotion);
    root.classList.toggle('perf-lite', profile.liteMode);

    if (!profile.liteMode) return;

    const particlesPref = localStorage.getItem('calc_particles');
    if (particlesPref !== 'on') {
        state.particlesEnabled = false;
    }

    if (profile.isMobile) {
        if (!localStorage.getItem('calc_glass')) {
            state.glassIntensity = 'solid';
        }
    }

    if (profile.prefersReducedMotion && particlesPref !== 'on') {
        state.particlesEnabled = false;
    }
}

function shouldDrawParticleConnections() {
    return !document.documentElement.classList.contains('perf-lite');
}

function getParticleCountLimit() {
    if (document.documentElement.classList.contains('perf-lite')) {
        return mobilePerf.isMobile ? 12 : 20;
    }
    return 60;
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
