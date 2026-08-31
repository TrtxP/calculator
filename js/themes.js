// ==========================================================================
// Теми та Кольори (28 Themes)
// ==========================================================================
function setTheme(themeName) {
    audio.playAction();
    document.body.setAttribute('data-theme', themeName);
    state.currentTheme = themeName;
    localStorage.setItem('calc_theme', themeName);

    resetCustomColors();

    document.querySelectorAll('.theme-card').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-theme') === themeName);
    });

    closeModal('theme-modal');
    showToast(`Тема: ${getThemeNameUA(themeName)}`, '🎨');
}

function setCustomAccent(colorHex, name) {
    audio.playAction();
    applyRealtimeColor('accent', colorHex);
    showToast(`Акцентний колір: ${name}`, '✨');
}

function getThemeNameUA(theme) {
    const names = {
        titanium_ruby: 'Titanium Ruby Master',
        crimson_supernova: 'Crimson Supernova Cosmic',
        cyberpunk_neon: 'Cyberpunk Neon Bordeaux',
        emerald_platinum: 'Emerald Platinum',
        amethyst_crimson: 'Amethyst Crimson Royal',
        cyber_ruby: 'Cyber Ruby Neon',
        golden_bordeaux: 'Golden Bordeaux Imperial',
        midnight_sapphire: 'Midnight Sapphire Velvet',
        bordeaux_luxury: 'Bordeaux Imperial Wine',
        velvet_burgundy: 'Velvet Burgundy Noir',
        autumn_crimson: 'Autumn Crimson',
        volcanic_magma: 'Volcanic Magma',
        redstone2: 'Redstone 2 Quantum Pulse',
        deep_space: 'Deep Space Nebula',
        cyber_lime: 'Cyber Lime Acid',
        royal_amethyst: 'Royal Amethyst',
        redstone: 'Redstone 1 Flux',
        cyber_amber: 'Amber Cyber',
        nordic_frost: 'Nordic Glacier',
        vintage_retro: '80s Synthwave',
        matrix_terminal: 'Matrix Terminal',
        obsidian_gold: 'Obsidian Royal Gold',
        light: 'Clean Porcelain',
        neon: 'Cyberpunk Glow',
        purple: 'Midnight Purple',
        emerald: 'Emerald Forest',
        sunset: 'Sunset Aura',
        ocean: 'Nordic Ocean',
        coffee: 'Mocha Latte',
        sakura: 'Sakura Bloom',
        glass: 'Frost Glassmorphism',
        dark: 'Dark Charcoal'
    };
    return names[theme] || 'Bordeaux Imperial';
}

