// ==========================================================================
// 20. Command Palette Engine (Ctrl+K / ⌘K)
// ==========================================================================
let commandPaletteItems = [
    // Інструменти
    { id: 'vector', title: '3D Векторний калькулятор', desc: 'Скалярний, векторний добуток, кут, модулі', icon: '📐', cat: 'Інструменти', action: () => openModal('vector-calc-modal') },
    { id: 'complex', title: 'Комплексні числа ℂ', desc: 'Дії з комплексними числами a + bi, модуль, аргумент', icon: '⚛️', cat: 'Інструменти', action: () => openModal('complex-calc-modal') },
    { id: 'math-ref', title: 'Математичний довідник', desc: 'Формули тригонометрії, алгебри, похідних', icon: '📖', cat: 'Довідка', action: () => openModal('math-ref-modal') },
    { id: 'trig-circle', title: 'Тригонометричне коло', desc: 'Одиничне коло, sin, cos, tan, радіани', icon: '⭕', cat: 'Інструменти', action: () => openModal('trig-circle-modal') },
    { id: 'constants', title: 'База констант 40+', desc: 'Фундаментальні фізичні та математичні константи', icon: '⚛️', cat: 'База даних', action: () => openModal('constants-search-modal') },
    { id: 'formulas', title: 'Фізичний формулатор', desc: 'Закон Ома, кінетична енергія, гравітація, гази', icon: '⚡', cat: 'Інструменти', action: () => openModal('formula-solver-modal') },
    { id: 'triangles', title: 'Розв\'язувач трикутників 2D', desc: 'Сторони, кути, площа, периметр (SSS, SAS, ASA)', icon: '📐', cat: 'Геометрія', action: () => openModal('triangle-solver-modal') },
    { id: 'quad', title: 'Квадратні рівняння', desc: 'ax² + bx + c = 0, дискримінант D, корені x₁, x₂', icon: '📐', cat: 'Алгебра', action: () => openModal('quadratic-modal') },
    { id: 'matrix', title: 'Матриці 2x2 та 3x3', desc: 'Детермінант, додавання, множення, транспонування', icon: '🧮', cat: 'Алгебра', action: () => openModal('matrix-modal') },
    { id: 'prime-gcd', title: 'НСД / НСК / Прості множники', desc: 'Розклад на множники та дільники чисел', icon: '🔢', cat: 'Алгебра', action: () => openModal('prime-gcd-modal') },
    { id: 'func-eval', title: 'Обчислювач функцій f(x)', desc: 'Таблиця значень функції на діапазоні', icon: '📈', cat: 'Алгебра', action: () => openModal('func-eval-modal') },
    { id: 'graph', title: '2D Графік функцій', desc: 'Візуалізація sin(x), cos(x), x², x³', icon: '📈', cat: 'Графіка', action: () => openModal('graph-modal') },
    { id: 'stats', title: 'Статистичний аналіз', desc: 'Середнє, медіана, дисперсія, розмах', icon: '📊', cat: 'Статистика', action: () => openModal('stats-modal') },
    { id: 'percent', title: 'Відсотки Pro & Маржа', desc: 'Знижки, націнки, ПДВ, приріст', icon: '📊', cat: 'Фінанси', action: () => openModal('percent-modal') },
    { id: 'loan', title: 'Кредит & Іпотека', desc: 'Ануїтетний графік виплат та переплата', icon: '🏦', cat: 'Фінанси', action: () => openModal('loan-calc-modal') },
    { id: 'currency', title: 'Конвертер валют & Крипта', desc: 'UAH, USD, EUR, GBP, BTC, ETH, SOL', icon: '💱', cat: 'Фінанси', action: () => openModal('currency-modal') },
    { id: 'deal', title: 'Порівняння вигідності цін', desc: 'Ціна за 1 кг / 1 л для розумних покупок', icon: '⚖️', cat: 'Фінанси', action: () => openModal('deal-calc-modal') },
    { id: 'finance', title: 'Чайові, податки, знижки', desc: 'Розрахунок чеку на компанію', icon: '💰', cat: 'Фінанси', action: () => openModal('finance-modal') },
    { id: 'converter', title: 'Конвертер величин', desc: 'Довжина, маса, температура, швидкість, час', icon: '🔄', cat: 'Конвертери', action: () => openModal('converter-modal') },
    { id: 'programmer', title: 'Програмістський режим', desc: 'HEX, DEC, OCT, BIN конвертер та бітові операції', icon: '💻', cat: 'Програмування', action: () => openModal('programmer-modal') },
    { id: 'bitmask', title: 'Бітовий інспектор 64-bit', desc: 'Візуальні прапорці бітів та маски', icon: '👾', cat: 'Програмування', action: () => openModal('bitmask-modal') },
    { id: 'memory', title: 'Матриця пам\'яті M1–M4', desc: 'Слоти збереження та відновлення чисел', icon: '🗄️', cat: 'Пам\'ять', action: () => openModal('memory-modal') },
    { id: 'bookmarks', title: 'Блокнот виразів', desc: 'Збереження важливих формул та результатів', icon: '🔖', cat: 'Пам\'ять', action: () => openModal('bookmarks-modal') },
    { id: 'tape', title: 'Стрічка розрахунків (Чек)', desc: 'Історія дій з можливістю додавання нотаток', icon: '📜', cat: 'Пам\'ять', action: () => openModal('tape-modal') },
    { id: 'date', title: 'Калькулятор дат & часу', desc: 'Різниця між датами, додавання днів', icon: '📅', cat: 'Утиліти', action: () => openModal('date-modal') },
    { id: 'rng', title: 'Генератор чисел & Кубики', desc: 'Випадкові числа, кидок d6/d20, монета', icon: '🎲', cat: 'Утиліти', action: () => openModal('rng-modal') },
    { id: 'history', title: 'Історія розрахунків', desc: 'Перегляд та експорт журналу операцій', icon: '🕒', cat: 'Історія', action: () => openModal('history-modal') },
    { id: 'settings', title: 'Центр налаштувань', desc: 'Точність, звук, розділювачі, скло', icon: '⚙️', cat: 'Система', action: () => openModal('settings-modal') },
    { id: 'advisor', title: 'Математичний порадник', desc: 'Довідка щодо заборонених математичних дій', icon: '🧠', cat: 'Довідка', action: () => openModal('advisor-modal') },
    { id: 'shortcuts', title: 'Гарячі клавіші (F1 / ?)', desc: 'Список всіх клавіатурних скорочень', icon: '⌨️', cat: 'Довідка', action: () => openModal('shortcuts-modal') },
    { id: 'about', title: 'Про Calculator Pro', desc: 'Інформація про реліз v1.8.6 та автора', icon: 'ℹ️', cat: 'Система', action: () => openModal('about-modal') },

    // Стилі та дизайн
    { id: 'theme-bordeaux', title: 'Тема: Bordeaux Luxury', desc: 'Флагманська бордова палітра Redstone 4.0', icon: '🍷', cat: 'Теми', action: () => setTheme('bordeaux_luxury') },
    { id: 'theme-titanium-ruby', title: 'Тема: Titanium Ruby Master', desc: 'Темний титан з рубіновим неоном', icon: '💎', cat: 'Теми', action: () => setTheme('titanium_ruby_master') },
    { id: 'theme-crimson', title: 'Тема: Crimson Supernova', desc: 'Яскравий малиново-червоний градієнт', icon: '✨', cat: 'Теми', action: () => setTheme('crimson_supernova') },
    { id: 'theme-cyberpunk', title: 'Тема: Cyberpunk Neon Bordeaux', desc: 'Неоновий кіберпанк бордо', icon: '🌆', cat: 'Теми', action: () => setTheme('cyberpunk_neon') },
    { id: 'theme-emerald', title: 'Тема: Emerald Platinum', desc: 'Смарагдовий з платиновими акцентами', icon: '❇️', cat: 'Теми', action: () => setTheme('emerald_platinum') },
    { id: 'theme-midnight', title: 'Тема: Midnight OLED', desc: 'Глибокий чорний OLED для заощадження енергії', icon: '🌑', cat: 'Теми', action: () => setTheme('midnight_oled') },
    { id: 'theme-matrix', title: 'Тема: Cyber Matrix', desc: 'Зелений кібер-стиль Matrix', icon: '🟩', cat: 'Теми', action: () => setTheme('matrix_cyber') },

    // Шпалери
    { id: 'wp-titanium-ruby', title: 'Шпалери: Titanium Ruby', desc: 'HD Титаново-рубіновий кристал', icon: '🖼️', cat: 'Шпалери', action: () => setWallpaper('titanium_ruby') },
    { id: 'wp-crimson', title: 'Шпалери: Crimson Supernova', desc: 'HD Космічна малинова наднова', icon: '🖼️', cat: 'Шпалери', action: () => setWallpaper('crimson_supernova') },
    { id: 'wp-cyberpunk', title: 'Шпалери: Cyberpunk Bordeaux', desc: 'HD Неонове нічне місто бордо', icon: '🖼️', cat: 'Шпалери', action: () => setWallpaper('cyberpunk_bordeaux') },
    { id: 'wp-burgundy', title: 'Шпалери: Burgundy Velvet', desc: 'HD Бордовий шовковий оксамит', icon: '🖼️', cat: 'Шпалери', action: () => setWallpaper('burgundy') },
    { id: 'wp-particles', title: 'Шпалери: Неоновий пил', desc: 'Динамічні частинки Aurora', icon: '✨', cat: 'Шпалери', action: () => setWallpaper('particles') },

    // Дії
    { id: 'act-voice', title: 'Озвучити результат голосом', desc: 'Синтез мови для поточного числа', icon: '🗣️', cat: 'Дії', action: () => speakCurrentResult() },
    { id: 'act-copy', title: 'Скопіювати число в буфер', desc: 'Ctrl + C', icon: '📋', cat: 'Дії', action: () => copyToClipboard() },
    { id: 'act-fullscreen', title: 'Повноекранний режим', desc: 'F11 / Focus Mode', icon: '⛶', cat: 'Дії', action: () => toggleFullScreen() },
    { id: 'act-clear', title: 'Очистити все', desc: 'Скинути дисплей калькулятора (C)', icon: '🗑️', cat: 'Дії', action: () => clearDisplay() }
];

let selectedCommandIndex = 0;
let filteredCommandItems = [];

function openCommandPalette() {
    audio.playAction();
    openModal('command-palette-modal');
    const input = document.getElementById('command-search-input');
    if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 80);
    }
    filterCommandPalette('');
}

function filterCommandPalette(query) {
    const listEl = document.getElementById('command-results-list');
    if (!listEl) return;

    const q = (query || '').toLowerCase().trim();
    filteredCommandItems = commandPaletteItems.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.cat.toLowerCase().includes(q)
    );

    selectedCommandIndex = 0;
    renderCommandPaletteList();
}

function renderCommandPaletteList() {
    const listEl = document.getElementById('command-results-list');
    if (!listEl) return;

    if (filteredCommandItems.length === 0) {
        listEl.innerHTML = `
            <div style="text-align:center; padding:20px; color:var(--text-muted); font-size:0.88rem;">
                🔍 Нічого не знайдено за вашим запитом.<br>
                <small style="opacity:0.7;">Спробуйте: "вектор", "тема", "графік", "шрифт"</small>
            </div>
        `;
        return;
    }

    listEl.innerHTML = filteredCommandItems.map((item, idx) => `
        <div class="command-item ${idx === selectedCommandIndex ? 'selected' : ''}" onclick="executeCommandPaletteItem(${idx})" onmouseenter="selectCommandIndex(${idx})">
            <span class="command-item-icon">${item.icon}</span>
            <div class="command-item-info">
                <div class="command-item-title">${item.title}</div>
                <div class="command-item-desc">${item.desc}</div>
            </div>
            <span class="command-item-category">${item.cat}</span>
        </div>
    `).join('');
}

function selectCommandIndex(idx) {
    selectedCommandIndex = idx;
    const items = document.querySelectorAll('.command-item');
    items.forEach((el, i) => {
        el.classList.toggle('selected', i === idx);
    });
}

function scrollSelectedCommandIntoView() {
    const items = document.querySelectorAll('.command-item');
    if (items[selectedCommandIndex]) {
        items[selectedCommandIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
}

function executeCommandPaletteItem(idx) {
    const item = filteredCommandItems[idx];
    if (item && item.action) {
        closeModal('command-palette-modal');
        setTimeout(() => item.action(), 120);
    }
}

