// ==========================================================================
// Wallpaper Studio (12 HD Шпалер)
// ==========================================================================
function setWallpaper(wpName) {
    audio.playAction();
    state.currentWallpaper = wpName;
    localStorage.setItem('calc_wallpaper', wpName);

    document.querySelectorAll('.wallpaper-card').forEach(card => {
        card.classList.toggle('active', card.getAttribute('data-wp') === wpName);
    });

    applyWallpaperToDom();
    showToast(`Шпалери: ${getWallpaperNameUA(wpName)}`, '🖼️');
}

function getWallpaperNameUA(wp) {
    const map = {
        titanium_ruby: 'Titanium Ruby Laser',
        crimson_supernova: 'Crimson Supernova Cosmic',
        cyberpunk_bordeaux: 'Cyberpunk Bordeaux City',
        amethyst_crystal: 'Аметистовий Кристал',
        cyber_matrix_red: 'Бордова Кібер-Сітка',
        aurora_ruby: 'Рубінове Полярне Сяйво',
        burgundy: 'Bordeaux Velvet',
        nebula_wine: 'Wine Nebula Space',
        cyber_redstone3: 'Redstone 3 Cybernet',
        cyber: 'Кіберсітка',
        sunset: 'Захід Сонця',
        emerald: 'Смарагдова Небула',
        stars: 'Космічні Зорі',
        grid: 'Blueprint Креслення',
        default: 'Динамічний градієнт'
    };
    return map[wp] || 'Кастомні шпалери';
}

function applyWallpaperToDom() {
    if (!dom.bgWallpaper || !dom.bgOverlay) return;

    dom.bgWallpaper.className = 'bg-wallpaper-layer';

    if (state.currentWallpaper === 'titanium_ruby') {
        dom.bgWallpaper.style.backgroundImage = "url('images/titanium_ruby.jpg')";
    } else if (state.currentWallpaper === 'crimson_supernova') {
        dom.bgWallpaper.style.backgroundImage = "url('images/crimson_supernova.jpg')";
    } else if (state.currentWallpaper === 'cyberpunk_bordeaux') {
        dom.bgWallpaper.style.backgroundImage = "url('images/cyberpunk_bordeaux.jpg')";
    } else if (state.currentWallpaper === 'amethyst_crystal') {
        dom.bgWallpaper.style.backgroundImage = "url('images/amethyst_crystal.jpg')";
    } else if (state.currentWallpaper === 'cyber_matrix_red') {
        dom.bgWallpaper.style.backgroundImage = "url('images/cyber_matrix_red.jpg')";
    } else if (state.currentWallpaper === 'aurora_ruby') {
        dom.bgWallpaper.style.backgroundImage = "url('images/aurora_ruby.jpg')";
    } else if (state.currentWallpaper === 'burgundy') {
        dom.bgWallpaper.style.backgroundImage = "url('images/burgundy.jpg')";
    } else if (state.currentWallpaper === 'nebula_wine') {
        dom.bgWallpaper.style.backgroundImage = "url('images/nebula_wine.jpg')";
    } else if (state.currentWallpaper === 'cyber_redstone3') {
        dom.bgWallpaper.style.backgroundImage = "url('images/cyber_redstone3.jpg')";
    } else if (state.currentWallpaper === 'cyber') {
        dom.bgWallpaper.style.backgroundImage = "url('images/cyber.jpg')";
    } else if (state.currentWallpaper === 'sunset') {
        dom.bgWallpaper.style.backgroundImage = "url('images/sunset.jpg')";
    } else if (state.currentWallpaper === 'emerald') {
        dom.bgWallpaper.style.backgroundImage = "url('images/emerald.jpg')";
    } else if (state.currentWallpaper === 'stars') {
        dom.bgWallpaper.style.backgroundImage = 'none';
        dom.bgWallpaper.classList.add('wp-stars');
    } else if (state.currentWallpaper === 'grid') {
        dom.bgWallpaper.style.backgroundImage = 'none';
        dom.bgWallpaper.classList.add('wp-grid');
    } else if (state.currentWallpaper === 'custom' && state.customWallpaperUrl) {
        // Екрануємо лапки та бекслеші: URL з ')" інакше розривав би url(...)
        // і дозволяв ін'єкцію довільних CSS-правил
        const safeWpUrl = state.customWallpaperUrl.replace(/["'\\]/g, '\\$&');
        dom.bgWallpaper.style.backgroundImage = `url("${safeWpUrl}")`;
    } else {
        dom.bgWallpaper.style.backgroundImage = 'none';
    }

    // Розмиття повноекранного шару — дорога операція GPU: у легкому режимі вимкнено
    const liteBg = document.documentElement.classList.contains('perf-lite');
    dom.bgWallpaper.style.filter = liteBg ? 'none' : `blur(${state.wallpaperBlur}px)`;
    dom.bgOverlay.style.backgroundColor = `rgba(0, 0, 0, ${state.wallpaperOverlay / 100})`;
}

