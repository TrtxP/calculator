// ==========================================================================
// Ініціалізація (DOM Ready)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    applyMobilePerfOptimizations();

    // Тема
    if (state.currentTheme) {
        document.body.setAttribute('data-theme', state.currentTheme);
        document.querySelectorAll('.theme-card').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-theme') === state.currentTheme);
        });
    }

    // Шрифт
    if (state.currentFont) {
        document.body.className = document.body.className.replace(/\bfont-\w+\b/g, '');
        document.body.classList.add(state.currentFont);
        document.querySelectorAll('.font-card').forEach(c => {
            c.classList.toggle('active', c.getAttribute('data-font') === state.currentFont);
        });
        const fontNames = {
            'font-inter': 'Inter',
            'font-jetbrains': 'JetBrains Mono',
            'font-orbitron': 'Orbitron Digital',
            'font-rajdhani': 'Rajdhani Mecha',
            'font-spacegrotesk': 'Space Grotesk',
            'font-silkscreen': 'Silkscreen 8-Bit',
            'font-outfit': 'Outfit Geometric',
            'font-firacode': 'Fira Code'
        };
        if (dom.currentFontChip) dom.currentFontChip.innerText = fontNames[state.currentFont] || 'Inter';
    }

    // Масштаб шрифту (Font Scale)
    setFontScale(state.fontScale, true);

    // Застосування шпалер
    applyWallpaperToDom();
    applyGlassIntensity(state.glassIntensity);

    // Слайдери
    const bSlider = document.getElementById('wp-blur-slider');
    const oSlider = document.getElementById('wp-opacity-slider');
    const bLabel = document.getElementById('wp-blur-val');
    const oLabel = document.getElementById('wp-opacity-val');
    if (bSlider) bSlider.value = state.wallpaperBlur;
    if (oSlider) oSlider.value = state.wallpaperOverlay;
    if (bLabel) bLabel.innerText = `${state.wallpaperBlur}px`;
    if (oLabel) oLabel.innerText = `${state.wallpaperOverlay}%`;

    // Оновлення дисплею
    updateDisplay();
    renderHistory();
    renderTapeRoll();
    renderBookmarks();
    updateMemorySlotsUI();

    // Запуск фонових частинок Canvas
    if (state.particlesEnabled) {
        initParticlesCanvas();
    }

    // Безпечне розблокування AudioContext при першому натисканні
    window.addEventListener('pointerdown', () => {
        if (audio && audio.ctx && audio.ctx.state === 'suspended') {
            audio.ctx.resume().catch(() => { });
        } else if (audio && !audio.ctx) {
            audio.init();
        }
    }, { once: true });

    console.log('%c 🛡️ Calculator Pro v1.8.6 (Build 204) Redstone 4.0 Bordeaux Titanium Ultra Loaded %c',
        'background: linear-gradient(90deg, #e11d48, #8b1538, #f43f5e); color: #fff; font-weight: bold; font-size: 13px; padding: 6px 14px; border-radius: 8px;',
        '');
});
