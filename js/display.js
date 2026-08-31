// ==========================================================================
// Форматування чисел з розділювачами розрядів
// ==========================================================================
function formatDisplayString(rawVal) {
    if (!rawVal || isNaN(parseFloat(rawVal)) || rawVal.includes('(') || rawVal.includes('Помилка')) {
        return rawVal;
    }
    if (state.thousandSeparator === 'none') {
        return rawVal;
    }

    const parts = rawVal.split('.');
    const isNegative = parts[0].startsWith('-');
    let integerPart = isNegative ? parts[0].slice(1) : parts[0];
    const sep = state.thousandSeparator === 'comma' ? ',' : ' ';

    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, sep);

    let res = (isNegative ? '-' : '') + integerPart;
    if (parts.length > 1) {
        res += '.' + parts[1];
    }
    return res;
}

function cycleSeparatorFormat() {
    audio.playAction();
    const formats = ['space', 'comma', 'none'];
    const idx = formats.indexOf(state.thousandSeparator);
    state.thousandSeparator = formats[(idx + 1) % formats.length];
    localStorage.setItem('calc_separator', state.thousandSeparator);
    updateDisplay();
    const names = { space: 'Пробіл (1 000 000)', comma: 'Кома (1,000,000)', none: 'Без розділювача' };
    showToast(`Формат тисяч: ${names[state.thousandSeparator]}`, '🔢');
}
// ==========================================================================
// Оновлення дисплея та індикаторів
// ==========================================================================
function updateDisplay() {
    if (dom.display) {
        const formatted = formatDisplayString(state.currentInput);
        const len = formatted.length;
        if (len > 16) {
            dom.display.style.fontSize = '1.35rem';
        } else if (len > 11) {
            dom.display.style.fontSize = '1.75rem';
        } else {
            dom.display.style.fontSize = '2.1rem';
        }
        dom.display.innerText = formatted;
    }

    if (dom.historyLine) {
        if (state.operator != null) {
            let opSymbol = state.operator;
            if (opSymbol === '*') opSymbol = '×';
            if (opSymbol === '/') opSymbol = '÷';
            if (opSymbol === '^') opSymbol = '^';
            if (opSymbol === 'mod') opSymbol = 'mod';
            dom.historyLine.innerText = `${formatDisplayString(state.previousInput)} ${opSymbol}`;
        } else {
            dom.historyLine.innerText = '';
        }
    }

    // Індикатор кутового режиму (DEG / RAD / GRAD)
    if (dom.modeBadge) {
        dom.modeBadge.innerText = state.angleMode;
        const angleNames = { DEG: 'Градуси (DEG)', RAD: 'Радіани (RAD)', GRAD: 'Градіани (GRAD)' };
        dom.modeBadge.title = `Кутовий режим: ${angleNames[state.angleMode]} (клікніть для зміни)`;
    }

    // Індикатор 2nd (Shift)
    if (dom.secondaryBadge) {
        dom.secondaryBadge.classList.toggle('active', state.isSecondMode);
    }
    if (dom.btn2nd) {
        dom.btn2nd.classList.toggle('active', state.isSecondMode);
    }

    // Індикатор пам'яті [M]
    if (dom.memoryBadge) {
        const hasMemory = state.memoryValue !== 0 || state.memorySlots.some(s => s !== 0);
        if (hasMemory) {
            dom.memoryBadge.classList.add('active');
            dom.memoryBadge.innerText = `M (${formatResult(state.memoryValue)})`;
        } else {
            dom.memoryBadge.classList.remove('active');
            dom.memoryBadge.innerText = 'M';
        }
    }

    // Індикатор розділювача розрядів
    if (dom.separatorTag) {
        const sepNames = { space: 'Розряди: Пробіл', comma: 'Розряди: Кома', none: 'Розряди: Без' };
        dom.separatorTag.innerText = sepNames[state.thousandSeparator] || 'Розряди';
    }

    // Індикатор точності
    if (dom.precisionTag) {
        dom.precisionTag.innerText = `Округлення: ${state.precisionMode === 'auto' ? 'Auto' : state.precisionMode + ' зн.'}`;
    }

    // Індикатор звуку
    updateAudioUI();

    // Лічильник операцій
    if (dom.opsCounter) {
        dom.opsCounter.innerText = state.operationsCount;
    }

    updateSecondaryButtonsUI();
}

function updateSecondaryButtonsUI() {
    if (state.isSecondMode) {
        if (dom.btnSin) { dom.btnSin.innerText = 'sin⁻¹'; dom.btnSin.title = 'Арксинус (asin)'; }
        if (dom.btnCos) { dom.btnCos.innerText = 'cos⁻¹'; dom.btnCos.title = 'Арккосинус (acos)'; }
        if (dom.btnTan) { dom.btnTan.innerText = 'tan⁻¹'; dom.btnTan.title = 'Арктангенс (atan)'; }
        if (dom.btnSinh) { dom.btnSinh.innerText = 'cosh'; dom.btnSinh.title = 'Гіперболічний косинус (cosh)'; }
        if (dom.btnLn) { dom.btnLn.innerText = 'log₂'; dom.btnLn.title = 'Двійковий логарифм (log2)'; }
        if (dom.btnLog) { dom.btnLog.innerText = '10ˣ'; dom.btnLog.title = '10 у степені x'; }
        if (dom.btnSqr) { dom.btnSqr.innerText = 'x³'; dom.btnSqr.title = 'Куб числа (x³)'; }
        if (dom.btnSqrt) { dom.btnSqrt.innerText = '∛x'; dom.btnSqrt.title = 'Кубічний корінь (∛x)'; }
        if (dom.btnPow) { dom.btnPow.innerText = 'eˣ'; dom.btnPow.title = 'Експонента eˣ'; }
    } else {
        if (dom.btnSin) { dom.btnSin.innerText = 'sin'; dom.btnSin.title = 'Синус'; }
        if (dom.btnCos) { dom.btnCos.innerText = 'cos'; dom.btnCos.title = 'Косинус'; }
        if (dom.btnTan) { dom.btnTan.innerText = 'tan'; dom.btnTan.title = 'Тангенс'; }
        if (dom.btnSinh) { dom.btnSinh.innerText = 'sinh'; dom.btnSinh.title = 'Гіперболічний синус'; }
        if (dom.btnLn) { dom.btnLn.innerText = 'ln'; dom.btnLn.title = 'Натуральний логарифм (ln)'; }
        if (dom.btnLog) { dom.btnLog.innerText = 'log'; dom.btnLog.title = 'Десятковий логарифм (log10)'; }
        if (dom.btnSqr) { dom.btnSqr.innerText = 'x²'; dom.btnSqr.title = 'Квадрат (x²)'; }
        if (dom.btnSqrt) { dom.btnSqrt.innerText = '√'; dom.btnSqrt.title = 'Квадратний корінь (√)'; }
        if (dom.btnPow) { dom.btnPow.innerText = 'xⁿ'; dom.btnPow.title = 'Степінь (xⁿ)'; }
    }
}

function updateAudioUI() {
    const isMuted = state.soundProfile === 'off' || state.soundVolume <= 0;
    const profileNames = {
        classic: 'Classic',
        tactile: 'Tactile',
        retro: '8-Bit',
        scifi: 'Sci-Fi',
        off: 'Вимк.'
    };
    const pName = profileNames[state.soundProfile] || 'Classic';

    if (dom.audioBadge) {
        dom.audioBadge.innerText = isMuted ? '🔇' : '🔊';
        dom.audioBadge.title = `Звук: ${pName} (${Math.round(state.soundVolume * 100)}%)`;
    }
    if (dom.sidebarSoundStatus) {
        dom.sidebarSoundStatus.innerText = `🔔 ${pName} (${Math.round(state.soundVolume * 100)}%)`;
    }
}

