/**
 * Master Build Script для Calculator Pro v1.8.6
 * Redstone 4.0 Titanium Ultra Edition
 * 
 * Збирає:
 *  1. index.html - з views/partials/ та views/modals/
 *  2. style.css  - з 17 CSS модулів у папці css/
 *  3. app.js     - з 46 JS модулів у папці js/
 * 
 * Використання: node build.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const VIEWS_DIR = path.join(ROOT_DIR, 'views');
const CSS_DIR = path.join(ROOT_DIR, 'css');
const JS_DIR = path.join(ROOT_DIR, 'js');

const OUTPUT_HTML = path.join(ROOT_DIR, 'index.html');
const OUTPUT_CSS = path.join(ROOT_DIR, 'style.css');
const OUTPUT_JS = path.join(ROOT_DIR, 'app.js');

function readFileClean(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  Файл не знайдено: ${filePath}`);
        return '';
    }
    return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').trimEnd();
}

function readView(relativePath) {
    const fullPath = path.join(VIEWS_DIR, relativePath);
    return readFileClean(fullPath);
}

// 17 CSS модулів у порядку каскаду
const CSS_MODULES = [
    { file: 'variables', desc: 'Змінні дизайну та 32 теми оформлення' },
    { file: 'base', desc: 'Базові стилі та шрифтові гарнітури' },
    { file: 'layout', desc: 'Головний макет та сітка додатку' },
    { file: 'sidebar', desc: 'Бічне меню (Sidebar) та навігація' },
    { file: 'display', desc: 'Інтерактивний дисплей та рядок історії' },
    { file: 'keyboard', desc: 'Клавіатура та інженерні кнопки' },
    { file: 'footer', desc: 'Фірмовий футер та статусний рядок' },
    { file: 'modals', desc: 'Базовий фреймворк модальних вікон' },
    { file: 'modal-tools', desc: 'Інструменти та панелі модалок' },
    { file: 'converter', desc: 'Конвертер величин та валют' },
    { file: 'themes-gallery', desc: 'Галерея вибору колірних тем' },
    { file: 'fonts-studio', desc: 'Студія шрифтів та типографіки' },
    { file: 'wallpaper', desc: 'Шпалери та атмосферні шари' },
    { file: 'animations', desc: 'Анімації, пульсації та ripple-ефекти' },
    { file: 'color-studio', desc: 'Студія кастомних RGB тем' },
    { file: 'responsive', desc: 'Адаптивність та мобільні стилі' },
    { file: 'mobile-perf', desc: 'Мобільна продуктивність: композитор, paint-контейнери, touch-лаг' }
];

// 46 JS модулів у строгому порядку залежностей
const JS_MODULES = [
    { file: 'state', desc: 'Глобальний стан та робота з LocalStorage' },
    { file: 'audio', desc: 'Звуковий рушій Web Audio API' },
    { file: 'particles', desc: 'Анімовані частинки Canvas фону' },
    { file: 'animations', desc: 'Анімації інтерфейсу та ефекти кліків' },
    { file: 'trig-circle', desc: 'Інтерактивне тригонометричне коло' },
    { file: 'constants', desc: 'Математичні та фізичні константи' },
    { file: 'display', desc: 'Керування відображенням дисплею' },
    { file: 'math-advisor', desc: 'Математичний радник та підказки' },
    { file: 'speech', desc: 'Голосове озвучення (SpeechSynthesis)' },
    { file: 'trig-functions', desc: 'Тригонометричні та інженерні функції' },
    { file: 'formula-solver', desc: 'Розв\'язувач фізичних формул' },
    { file: 'triangle-solver', desc: 'Геометрія та розв\'язання трикутників' },
    { file: 'loan-calc', desc: 'Кредитний та іпотечний калькулятор' },
    { file: 'bookmarks', desc: 'Закладки та обрані вирази' },
    { file: 'color-studio', desc: 'Кастомізація власної колірної теми' },
    { file: 'tape', desc: 'Аудиторська розрахункова стрічка' },
    { file: 'prime-gcd', desc: 'Прості числа, НСД та НСК' },
    { file: 'deal-calc', desc: 'Калькулятор вигідної покупки' },
    { file: 'func-eval', desc: 'Обчислення значень функцій f(x)' },
    { file: 'matrix', desc: 'Лінійна алгебра та операції з матрицями' },
    { file: 'bitmask', desc: 'Візуалізатор бітових масок' },
    { file: 'percent', desc: 'Розрахунок відсотків та націнок' },
    { file: 'currency', desc: 'Курси валют та конвертація' },
    { file: 'calculator', desc: 'Базова арифметика та обчислювальний рушій' },
    { file: 'quadratic', desc: 'Квадратні рівняння та дискримінант' },
    { file: 'statistics', desc: 'Статистичний аналіз даних' },
    { file: 'date-calc', desc: 'Операції з датами та часом' },
    { file: 'settings', desc: 'Налаштування користувача' },
    { file: 'color-customizer', desc: 'Кастомізація акцентних кольорів' },
    { file: 'fonts', desc: 'Керування шрифтами та масштабом' },
    { file: 'themes', desc: 'Перемикання 32 авторських тем' },
    { file: 'wallpaper', desc: 'Керування шпалерами та розмиттям' },
    { file: 'vector-calc', desc: '3D вектори, скалярний та векторний добутки' },
    { file: 'complex-calc', desc: 'Комплексні числа ℂ та тригонометрична форма' },
    { file: 'math-ref', desc: 'Математичний довідник та шпаргалка' },
    { file: 'mobile', desc: 'Мобільні жести та адаптивна поведінка' },
    { file: 'graph', desc: 'Побудова 2D графіків функцій на Canvas' },
    { file: 'finance', desc: 'Фінансові розрахунки та складні відсотки' },
    { file: 'rng', desc: 'Генератор випадкових чисел та кубик' },
    { file: 'converter', desc: 'Універсальний конвертер одиниць вимірювання' },
    { file: 'programmer', desc: 'Програмістський режим (HEX/DEC/OCT/BIN)' },
    { file: 'history', desc: 'Журнал історії розрахунків та експорт' },
    { file: 'modals', desc: 'Керування відкриттям/закриттям модалок' },
    { file: 'keyboard', desc: 'Обробка гарячих клавіш клавіатури' },
    { file: 'command-palette', desc: 'Палітра команд Command Palette (Ctrl+K)' },
    { file: 'init', desc: 'Ініціалізація застосунку та запуск при завантаженні' }
];

// 41 модальне вікно
const MODALS = [
    'vector-calc', 'complex-calc', 'math-ref', 'trig-circle',
    'constants-search', 'formula-solver', 'triangle-solver', 'loan-calc',
    'bookmarks', 'tape', 'prime-gcd', 'deal-calc',
    'func-eval', 'matrix', 'bitmask', 'percent',
    'currency', 'settings', 'color-studio', 'quadratic',
    'stats', 'date', 'memory', 'font',
    'error-advisor', 'advisor', 'graph', 'wallpaper',
    'finance', 'rng', 'theme', 'converter',
    'programmer', 'history', 'export', 'hotkeys',
    'command-palette', 'shortcuts', 'home', 'about', 'help'
];

console.log('🚀 Початок процесу збирання Calculator Pro v1.8.6...\n');

// ============================================================================
// 1. Збирання style.css з css/
// ============================================================================
let combinedCss = `/* ==========================================================================
   Calculator Pro v1.8.6 (Build 204) Redstone 4.0 Titanium Ultra Edition
   Master Stylesheet (Згенеровано автоматично з 17 модулів у папці css/)
   Author: MaxNT Official, 2026
   ========================================================================== */\n\n`;

CSS_MODULES.forEach((mod, idx) => {
    const filePath = path.join(CSS_DIR, `${mod.file}.css`);
    const content = readFileClean(filePath);
    combinedCss += `/* --------------------------------------------------------------------------\n`;
    combinedCss += `   Секція ${String(idx + 1).padStart(2, '0')}: ${mod.file}.css — ${mod.desc}\n`;
    combinedCss += `   -------------------------------------------------------------------------- */\n`;
    combinedCss += content + '\n\n';
});

fs.writeFileSync(OUTPUT_CSS, combinedCss, 'utf8');
const cssSize = (fs.statSync(OUTPUT_CSS).size / 1024).toFixed(1);
console.log(`🎨 [1/3] style.css згенеровано: ${cssSize} KB (${CSS_MODULES.length} модулів)`);

// ============================================================================
// 2. Збирання app.js з js/
// ============================================================================
let combinedJs = `/**
 * ==========================================================================
 * Calculator Pro v1.8.6 (Build 204) Redstone 4.0 Titanium Ultra Edition
 * Master Application Script (Згенеровано автоматично з 46 модулів у папці js/)
 * Author: MaxNT Official, 2026
 * ==========================================================================
 */\n\n`;

JS_MODULES.forEach((mod, idx) => {
    const filePath = path.join(JS_DIR, `${mod.file}.js`);
    const content = readFileClean(filePath);
    combinedJs += `// --------------------------------------------------------------------------\n`;
    combinedJs += `// Модуль ${String(idx + 1).padStart(2, '0')}: ${mod.file}.js — ${mod.desc}\n`;
    combinedJs += `// --------------------------------------------------------------------------\n`;
    combinedJs += content + '\n\n';
});

fs.writeFileSync(OUTPUT_JS, combinedJs, 'utf8');
const jsSize = (fs.statSync(OUTPUT_JS).size / 1024).toFixed(1);
console.log(`⚡ [2/3] app.js згенеровано: ${jsSize} KB (${JS_MODULES.length} модулів)`);

// ============================================================================
// 3. Збирання index.html з views/
// ============================================================================
const modalsHtml = MODALS.map(m => {
    return `    <!-- Modal: ${m} -->\n    ${readView(`modals/${m}.html`)}`;
}).join('\n\n');

const html = `<!DOCTYPE html>
<html lang="uk">
<head>
${readView('partials/head.html')}
    <!-- Головна таблиця стилів (Master Stylesheet) -->
    <link rel="stylesheet" href="style.css">
</head>
<body data-theme="bordeaux_luxury" class="font-inter">

${readView('partials/backgrounds.html')}

    <div class="main-wrapper">
${readView('partials/mobile-header.html')}

        <div class="app-container">
            <!-- Декоративні кути Titanium Laser Chamfer -->
            <div class="app-corner app-corner-tl"></div>
            <div class="app-corner app-corner-tr"></div>
            <div class="app-corner app-corner-bl"></div>
            <div class="app-corner app-corner-br"></div>

            <!-- Бічне меню керування (Sidebar) -->
${readView('partials/sidebar.html')}

            <!-- Основний блок калькулятора -->
            <main class="calculator">
                <!-- Інтерактивний дисплей -->
${readView('partials/display.html')}

                <!-- Клавіатура калькулятора -->
${readView('partials/keyboard.html')}
            </main>
        </div>

        <!-- Преміальний фірмовий футер -->
${readView('partials/footer.html')}
    </div>

    <!-- Контейнер для спливаючих сповіщень (Toasts) -->
${readView('partials/toast.html')}

    <!-- ==========================================================================
         Модальні вікна (Modals)
         ========================================================================== -->
    
${modalsHtml}

    <!-- Головний скрипт застосунку (Master Application Script) -->
    <script src="app.js"></script>
</body>
</html>
`;

fs.writeFileSync(OUTPUT_HTML, html, 'utf8');
const htmlSize = (fs.statSync(OUTPUT_HTML).size / 1024).toFixed(1);
console.log(`📄 [3/3] index.html згенеровано: ${htmlSize} KB (${MODALS.length} модалок, 8 partial-ів)`);

console.log('\n✅ Переструктурування та збирання успішно завершено!');
console.log(`📊 Загальна статистика проекту:`);
console.log(`   - index.html: ${htmlSize} KB`);
console.log(`   - style.css:  ${cssSize} KB`);
console.log(`   - app.js:     ${jsSize} KB`);
console.log(`   - Всього модулів: ${CSS_MODULES.length} CSS + ${JS_MODULES.length} JS + ${MODALS.length} Modals + 8 Partials = ${CSS_MODULES.length + JS_MODULES.length + MODALS.length + 8} файлів.`);
