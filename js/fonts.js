// ==========================================================================
// Шрифти & Масштабування (Typography & Font Scale Controller)
// ==========================================================================
function setFontFamily(fontClass) {
    audio.playAction();
    document.body.className = document.body.className.replace(/\bfont-\w+\b/g, '');
    document.body.classList.add(fontClass);
    state.currentFont = fontClass;
    localStorage.setItem('calc_font', fontClass);

    document.querySelectorAll('.font-card').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-font') === fontClass);
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

    if (dom.currentFontChip) {
        dom.currentFontChip.innerText = fontNames[fontClass] || 'Inter';
    }

    showToast(`Встановлено шрифт: ${fontNames[fontClass]}`, '🔤');
}

function setFontScale(scale, isSilent = false) {
    const s = parseInt(scale, 10) || 100;
    state.fontScale = s;
    localStorage.setItem('calc_font_scale', s);

    // Встановлення глобальної CSS змінної масштабу
    document.documentElement.style.setProperty('--font-scale', (s / 100).toString());

    // Оновлення елементів інтерфейсу Студії Шрифтів
    const slider = document.getElementById('font-scale-slider');
    const displayVal = document.getElementById('font-scale-display-val');
    const previewText = document.getElementById('font-scale-preview-text');
    if (slider) slider.value = s;
    if (displayVal) displayVal.innerText = `${s}%`;
    if (previewText) previewText.style.fontSize = `calc(1rem * ${s / 100})`;

    // Оновлення активного стану кнопок-пресетів
    document.querySelectorAll('.font-scale-preset-btn').forEach(btn => {
        const btnScale = parseInt(btn.getAttribute('data-scale'), 10);
        btn.classList.toggle('active', btnScale === s);
    });

    // Оновлення бейджа на дисплеї калькулятора
    const scaleBadge = document.getElementById('font-scale-badge');
    if (scaleBadge) {
        scaleBadge.innerText = `🔠 ${s}%`;
        scaleBadge.title = `Масштаб шрифтів: ${s}% (клік для циклічної зміни: 90% → 100% → 115% → 130% → 145%)`;
    }

    // Оновлення селектора у Центрі Налаштувань
    const settingSelect = document.getElementById('setting-font-scale');
    if (settingSelect) settingSelect.value = s.toString();

    if (!isSilent) {
        audio.playClick(620);
        showToast(`Масштаб шрифту встановлено: ${s}%`, '🔠');
    }
}

function cycleFontScale() {
    const presets = [90, 100, 115, 130, 145];
    let currentIndex = presets.indexOf(state.fontScale);
    let nextIndex = 0;
    if (currentIndex !== -1 && currentIndex < presets.length - 1) {
        nextIndex = currentIndex + 1;
    } else if (currentIndex === -1) {
        nextIndex = 1;
    } else {
        nextIndex = 0;
    }
    setFontScale(presets[nextIndex]);
}

