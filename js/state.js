/**
 * ==========================================================================
 * Calculator Pro v1.8.6 (Build 204) Redstone 4.0 Bordeaux Titanium Ultra
 * Author: MaxNT Official, 2026
 * ==========================================================================
 */

// Екранування HTML-спецсимволів (захист від XSS при рендерингу
// користувацьких даних: історія, стрічка, закладки, тоости тощо)
function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Стан застосунку (Application State)
const state = {
    currentInput: '0',
    previousInput: '',
    operator: undefined,
    shouldResetDisplay: false,
    memoryValue: 0,
    memorySlots: JSON.parse(localStorage.getItem('calc_mem_slots') || '[0, 0, 0, 0]'),
    angleMode: localStorage.getItem('calc_angle_mode') || 'DEG', // 'DEG', 'RAD', 'GRAD'
    soundProfile: localStorage.getItem('calc_sound_profile') || 'classic', // 'classic', 'tactile', 'retro', 'scifi', 'off'
    soundVolume: parseFloat(localStorage.getItem('calc_sound_vol') || '0.8'),
    isSecondMode: false, // 2nd (Shift) шар функцій
    currentTheme: localStorage.getItem('calc_theme') || 'bordeaux_luxury',
    currentFont: localStorage.getItem('calc_font') || 'font-inter',
    fontScale: parseInt(localStorage.getItem('calc_font_scale') || '100'), // 85..150 (%)
    currentWallpaper: localStorage.getItem('calc_wallpaper') || 'burgundy',
    wallpaperBlur: parseInt(localStorage.getItem('calc_wp_blur') || '12'),
    wallpaperOverlay: parseInt(localStorage.getItem('calc_wp_overlay') || '60'),
    customWallpaperUrl: localStorage.getItem('calc_custom_wp') || '',
    particlesEnabled: localStorage.getItem('calc_particles') !== 'off',
    particleSpeedMode: localStorage.getItem('calc_part_mode') || 'standard', // 'standard', 'aurora', 'starlight', 'warp'
    history: JSON.parse(localStorage.getItem('calc_history') || '[]'),
    tapeEntries: JSON.parse(localStorage.getItem('calc_tape') || '[]'),
    bookmarks: JSON.parse(localStorage.getItem('calc_bookmarks') || '[{"id":1,"title":"Швидкість світла c","val":"299792458","tag":"Фізика"},{"id":2,"title":"Золотий перетин φ","val":"1.618033988","tag":"Геометрія"}]'),
    operationsCount: 0,
    sessionSeconds: 0,
    bracketDepth: 0,
    precisionMode: localStorage.getItem('calc_precision') || 'auto', // 'auto', '0', '2', '4', '6', '8', '10', '12'
    thousandSeparator: localStorage.getItem('calc_separator') || 'space', // 'space', 'comma', 'none'
    glassIntensity: localStorage.getItem('calc_glass') || 'heavy',
    perfMode: localStorage.getItem('calc_perf_mode') || 'auto', // 'auto' | 'lite' | 'full'
    keyboardMode: localStorage.getItem('calc_kbd_mode') || 'basic', // 'basic' | 'scientific' | 'programmer'
    activeGraphFunc: 'sin',
    activeDateTab: 'diff',
    activeTriangleMode: 'sss', // 'sss', 'sas', 'asa'
    activeConstantsCat: 'all',
    activeMathRefTab: 'trig',
    trigAngleDeg: 45,
    vectorResults: { dot: '26.00', cross: '(-18, 2, 5)', lenU: '7.000', lenV: '4.583', angle: '35.8° (0.62 rad)', dist: '4.243' },
    complexResults: { add: '4 + 6i', sub: '2 + 2i', mul: '-5 + 10i', div: '2.2 - 0.4i', mod1: '5.000', arg1: '53.13° (0.93 rad)' },
    triangleResults: { area: '14.697', perim: '18.00' },
    loanResults: { monthly: '17205.12', total: '619384.32' },
    matrixSize: 2,
    matrixDetVal: '10',
    bitmaskValue: 42,
    quadRoots: { x1: '3', x2: '2' },
    statMeanVal: '0',
    gcdVal: '12',
    lcmVal: '720',
    funcSingleRes: '16',
    currencyRates: {
        UAH: 1.0,
        USD: 41.5,
        EUR: 44.8,
        GBP: 52.4,
        PLN: 10.4,
        BTC: 3942500.0,
        ETH: 132800.0,
        SOL: 7885.0
    }
};

// База 40+ фундаментальних наукових та математичних констант
const EXTENDED_CONSTANTS = [
    // 1. Фундаментальні
    { sym: 'c', name: 'Швидкість світла у вакуумі', val: '299792458', unit: 'м/с', cat: 'fundamental' },
    { sym: 'G', name: 'Гравітаційна стала Ньютона', val: '6.67430e-11', unit: 'м³/(кг·с²)', cat: 'fundamental' },
    { sym: 'h', name: 'Стала Планка', val: '6.62607015e-34', unit: 'Дж·с', cat: 'fundamental' },
    { sym: 'ħ', name: 'Зведена стала Планка (h/2π)', val: '1.054571817e-34', unit: 'Дж·с', cat: 'fundamental' },
    { sym: 'k_B', name: 'Стала Больцмана', val: '1.380649e-23', unit: 'Дж/К', cat: 'fundamental' },
    { sym: 'N_A', name: 'Число Авогадро', val: '6.02214076e23', unit: 'моль⁻¹', cat: 'fundamental' },
    { sym: 'R', name: 'Універсальна газова стала', val: '8.314462618', unit: 'Дж/(моль·К)', cat: 'fundamental' },
    { sym: 'σ', name: 'Стала Стефана-Больцмана', val: '5.670374419e-8', unit: 'Вт/(м²·К⁴)', cat: 'fundamental' },

    // 2. Електромагнетизм
    { sym: 'e', name: 'Елементарний електричний заряд', val: '1.602176634e-19', unit: 'Кл', cat: 'em' },
    { sym: 'ε₀', name: 'Електрична стала (діелектрична)', val: '8.8541878128e-12', unit: 'Ф/м', cat: 'em' },
    { sym: 'μ₀', name: 'Магнітна стала (проникність)', val: '1.25663706212e-6', unit: 'Гн/м', cat: 'em' },
    { sym: 'α', name: 'Стала тонкої структури', val: '0.0072973525693', unit: '—', cat: 'em' },
    { sym: 'F', name: 'Стала Фарадея', val: '96485.33212', unit: 'Кл/моль', cat: 'em' },
    { sym: 'Z₀', name: 'Хвильовий опір вакууму', val: '376.730313668', unit: 'Ом', cat: 'em' },

    // 3. Атом & Кванти
    { sym: 'm_e', name: 'Маса спокою електрона', val: '9.1093837015e-31', unit: 'кг', cat: 'atomic' },
    { sym: 'm_p', name: 'Маса спокою протона', val: '1.67262192369e-27', unit: 'кг', cat: 'atomic' },
    { sym: 'm_n', name: 'Маса спокою нейтрона', val: '1.67492749804e-27', unit: 'кг', cat: 'atomic' },
    { sym: 'u', name: 'Атомна одиниця маси (а.о.м.)', val: '1.66053906660e-27', unit: 'кг', cat: 'atomic' },
    { sym: 'R_∞', name: 'Стала Рідберга', val: '10973731.568160', unit: 'м⁻¹', cat: 'atomic' },
    { sym: 'a₀', name: 'Боровський радіус', val: '5.29177210903e-11', unit: 'м', cat: 'atomic' },
    { sym: 'μ_B', name: 'Магнетон Бора', val: '9.2740100783e-24', unit: 'Дж/Тл', cat: 'atomic' },
    { sym: 'μ_N', name: 'Ядерний магнетон', val: '5.0507837461e-27', unit: 'Дж/Тл', cat: 'atomic' },

    // 4. Астрофізика & Гео
    { sym: 'g', name: 'Стандартне прискорення вільного падіння', val: '9.80665', unit: 'м/с²', cat: 'astro' },
    { sym: 'M_⊕', name: 'Маса планети Земля', val: '5.9722e24', unit: 'кг', cat: 'astro' },
    { sym: 'R_⊕', name: 'Середній радіус Землі', val: '6371000', unit: 'м', cat: 'astro' },
    { sym: 'M_☉', name: 'Маса Сонця', val: '1.98847e30', unit: 'кг', cat: 'astro' },
    { sym: 'R_☉', name: 'Радіус Сонця', val: '6.957e8', unit: 'м', cat: 'astro' },
    { sym: 'AU', name: 'Астрономічна одиниця', val: '149597870700', unit: 'м', cat: 'astro' },
    { sym: 'ly', name: 'Світловий рік', val: '9.4607304725808e15', unit: 'м', cat: 'astro' },
    { sym: 'pc', name: 'Парсек', val: '3.08567758149137e16', unit: 'м', cat: 'astro' },
    { sym: 'atm', name: 'Стандартний атмосферний тиск', val: '101325', unit: 'Па', cat: 'astro' },

    // 5. Математичні
    { sym: 'π', name: 'Число Пі (Архімеда)', val: '3.141592653589793', unit: '—', cat: 'math' },
    { sym: 'e', name: 'Число Ейлера (основа ln)', val: '2.718281828459045', unit: '—', cat: 'math' },
    { sym: 'φ', name: 'Золотий перетин (Фібоначчі)', val: '1.618033988749895', unit: '—', cat: 'math' },
    { sym: '√2', name: 'Головна діагональ (Піфагор)', val: '1.414213562373095', unit: '—', cat: 'math' },
    { sym: '√3', name: 'Кубічна просторова діагональ', val: '1.732050807568877', unit: '—', cat: 'math' },
    { sym: 'ln(2)', name: 'Натуральний логарифм двійки', val: '0.693147180559945', unit: '—', cat: 'math' },
    { sym: 'ln(10)', name: 'Модуль десяткового переходу', val: '2.302585092994046', unit: '—', cat: 'math' },
    { sym: 'γ', name: 'Стала Ейлера-Маскероні', val: '0.577215664901532', unit: '—', cat: 'math' }
];

// Інтерактивна база формул математичного довідника
const MATH_REFERENCE_DATA = {
    trig: [
        { title: 'Основна тригонометрична тотожність', formula: 'sin²(x) + cos²(x) = 1' },
        { title: 'Означення тангенса', formula: 'tan(x) = sin(x) / cos(x)' },
        { title: 'Означення котангенса', formula: 'cot(x) = cos(x) / sin(x) = 1 / tan(x)' },
        { title: 'Зв\'язок тангенса та косинуса', formula: '1 + tan²(x) = 1 / cos²(x)' },
        { title: 'Синус подвійного кута', formula: 'sin(2x) = 2 · sin(x) · cos(x)' },
        { title: 'Косинус подвійного кута', formula: 'cos(2x) = cos²(x) - sin²(x) = 2cos²(x) - 1' },
        { title: 'Тангенс подвійного кута', formula: 'tan(2x) = 2tan(x) / (1 - tan²(x))' },
        { title: 'Синус суми кутів', formula: 'sin(α ± β) = sin(α)cos(β) ± cos(α)sin(β)' },
        { title: 'Косинус суми кутів', formula: 'cos(α ± β) = cos(α)cos(β) ∓ sin(α)sin(β)' },
        { title: 'Формула Ейлера', formula: 'e^(i·x) = cos(x) + i · sin(x)' }
    ],
    algebra: [
        { title: 'Квадрат суми', formula: '(a + b)² = a² + 2ab + b²' },
        { title: 'Квадрат різниці', formula: '(a - b)² = a² - 2ab + b²' },
        { title: 'Різниця квадратів', formula: 'a² - b² = (a - b)(a + b)' },
        { title: 'Куб суми', formula: '(a + b)³ = a³ + 3a²b + 3ab² + b³' },
        { title: 'Сума кубів', formula: 'a³ + b³ = (a + b)(a² - ab + b²)' },
        { title: 'Різниця кубів', formula: 'a³ - b³ = (a - b)(a² + ab + b²)' },
        { title: 'Добуток степенів', formula: 'aⁿ · aᵐ = a^(n + m)' },
        { title: 'Частка степенів', formula: 'aⁿ / aᵐ = a^(n - m)' },
        { title: 'Логарифм добутку', formula: 'log_a(x · y) = log_a(x) + log_a(y)' },
        { title: 'Логарифм степеня', formula: 'log_a(x^k) = k · log_a(x)' }
    ],
    calculus: [
        { title: 'Похідна степеневої функції', formula: '(xⁿ)\' = n · x^(n - 1)' },
        { title: 'Похідна синуса', formula: '(sin x)\' = cos x' },
        { title: 'Похідна косинуса', formula: '(cos x)\' = -sin x' },
        { title: 'Похідна тангенса', formula: '(tan x)\' = 1 / cos²(x)' },
        { title: 'Похідна експоненти eˣ', formula: '(eˣ)\' = eˣ' },
        { title: 'Похідна ln(x)', formula: '(ln x)\' = 1 / x' },
        { title: 'Похідна добутку (u · v)', formula: '(u · v)\' = u\'v + uv\'' },
        { title: 'Похідна частки (u / v)', formula: '(u / v)\' = (u\'v - uv\') / v²' },
        { title: 'Перша чудова границя', formula: 'lim(x→0) [sin(x) / x] = 1' },
        { title: 'Друга чудова границя (e)', formula: 'lim(n→∞) (1 + 1/n)ⁿ = e ≈ 2.71828' }
    ],
    geometry: [
        { title: 'Теорема Піфагора', formula: 'c² = a² + b² (c = √(a² + b²))' },
        { title: 'Площа круга', formula: 'S = π · r²' },
        { title: 'Довжина кола', formula: 'C = 2 · π · r = π · d' },
        { title: 'Площа трикутника (Герон)', formula: 'S = √(p(p - a)(p - b)(p - c)), p = P/2' },
        { title: 'Теорема косинусів', formula: 'c² = a² + b² - 2ab · cos(γ)' },
        { title: 'Теорема синусів', formula: 'a / sin(α) = b / sin(β) = c / sin(γ) = 2R' },
        { title: 'Об\'єм кулі (сфери)', formula: 'V = (4/3) · π · r³' },
        { title: 'Площа поверхні сфери', formula: 'S = 4 · π · r²' },
        { title: 'Об\'єм циліндра', formula: 'V = π · r² · h' },
        { title: 'Об\'єм конуса', formula: 'V = (1/3) · π · r² · h' }
    ]
};

// Елементи інтерфейсу (DOM Elements)
const dom = {
    display: document.getElementById('display'),
    historyLine: document.getElementById('history-line'),
    precisionTag: document.getElementById('precision-tag'),
    separatorTag: document.getElementById('separator-tag'),
    historyList: document.getElementById('history-list'),
    historySearch: document.getElementById('history-search'),
    modeBadge: document.getElementById('mode-badge'),
    secondaryBadge: document.getElementById('secondary-badge'),
    memoryBadge: document.getElementById('memory-badge'),
    speechBadge: document.getElementById('speech-badge'),
    audioBadge: document.getElementById('audio-badge'),
    sidebarSoundStatus: document.getElementById('sidebar-sound-status'),
    currentFontChip: document.getElementById('current-font-chip'),
    opsCounter: document.getElementById('ops-counter'),
    timerVal: document.getElementById('timer-val'),
    toastContainer: document.getElementById('toast-container'),
    bgWallpaper: document.getElementById('bg-wallpaper'),
    bgParticlesCanvas: document.getElementById('bg-particles-canvas'),
    bgOverlay: document.getElementById('bg-overlay'),
    btn2nd: document.getElementById('btn-2nd'),
    // Динамічні кнопки 2nd
    btnSin: document.getElementById('btn-sin'),
    btnCos: document.getElementById('btn-cos'),
    btnTan: document.getElementById('btn-tan'),
    btnSinh: document.getElementById('btn-sinh'),
    btnLn: document.getElementById('btn-ln'),
    btnLog: document.getElementById('btn-log'),
    btnSqr: document.getElementById('btn-sqr'),
    btnSqrt: document.getElementById('btn-sqrt'),
    btnPow: document.getElementById('btn-pow')
};
