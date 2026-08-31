// ==========================================================================
// Перемикачі та системні функції
// ==========================================================================
function toggleAngleMode() {
    const modes = ['DEG', 'RAD', 'GRAD'];
    const curIdx = modes.indexOf(state.angleMode);
    state.angleMode = modes[(curIdx + 1) % modes.length];
    localStorage.setItem('calc_angle_mode', state.angleMode);
    audio.playAction();
    updateDisplay();
    const names = { DEG: 'Градуси (DEG)', RAD: 'Радіани (RAD)', GRAD: 'Градіани / Гради (GRAD)' };
    showToast(`Кутовий режим: ${names[state.angleMode]}`, '📐');
}

function toggleSecondMode() {
    state.isSecondMode = !state.isSecondMode;
    audio.playAction();
    updateDisplay();
    showToast(state.isSecondMode ? 'Режим 2nd (Shift) увімкнено' : 'Стандартні функції', '⚡');
}

function cyclePrecision() {
    audio.playAction();
    const modes = ['auto', '0', '2', '4', '6', '8', '10', '12'];
    const curIdx = modes.indexOf(state.precisionMode);
    state.precisionMode = modes[(curIdx + 1) % modes.length];
    localStorage.setItem('calc_precision', state.precisionMode);
    updateDisplay();
    showToast(`Точність: ${state.precisionMode === 'auto' ? 'Автоматична' : state.precisionMode + ' знаків'}`, '🎯');
}

function cycleSoundProfile() {
    const profiles = ['classic', 'tactile', 'retro', 'scifi', 'off'];
    const currentIdx = profiles.indexOf(state.soundProfile);
    state.soundProfile = profiles[(currentIdx + 1) % profiles.length];
    localStorage.setItem('calc_sound_profile', state.soundProfile);
    audio.playAction();
    updateAudioUI();
    const profileNamesUA = {
        classic: 'Класичний Poly Sine',
        tactile: 'Тактильний перемикач',
        retro: '8-біт Аркада',
        scifi: 'Футуристичний кристал',
        off: 'Звук вимкнено'
    };
    showToast(`Звуковий профіль: ${profileNamesUA[state.soundProfile]}`, state.soundProfile === 'off' ? '🔇' : '🔊');
}

function goHome() {
    audio.playAction();
    clearDisplay();
    state.memoryValue = 0;
    state.isSecondMode = false;
    updateDisplay();
    openModal('home-modal');
}

function clearDisplay() {
    audio.playAction();
    state.currentInput = '0';
    state.previousInput = '';
    state.operator = undefined;
    state.shouldResetDisplay = false;
    updateDisplay();
}

function backspace() {
    audio.playClick(500);
    if (state.shouldResetDisplay) return;

    // Перевірка на багатосимвольні математичні токени
    const mathTokens = [
        'asin(', 'acos(', 'atan(', 'asinh(', 'acosh(', 'atanh(',
        'sinh(', 'cosh(', 'tanh(', 'sin(', 'cos(', 'tan(',
        'log10(', 'log2(', 'log(', 'ln(', 'sqrt(', 'cbrt(',
        '10^(', 'e^(', 'abs('
    ];
    for (const token of mathTokens) {
        if (state.currentInput.endsWith(token)) {
            state.currentInput = state.currentInput.slice(0, -token.length);
            if (state.currentInput === '') state.currentInput = '0';
            updateDisplay();
            return;
        }
    }

    if (
        state.currentInput.length === 1 ||
        (state.currentInput.length === 2 && state.currentInput.startsWith('-')) ||
        isNaN(parseFloat(state.currentInput))
    ) {
        state.currentInput = '0';
    } else {
        state.currentInput = state.currentInput.slice(0, -1);
    }
    updateDisplay();
}

function appendNumber(number) {
    audio.playClick(650);
    if (isNaN(parseFloat(state.currentInput)) && state.currentInput !== '.') {
        clearDisplay();
    }
    if (state.shouldResetDisplay) {
        state.currentInput = '';
        state.shouldResetDisplay = false;
    }
    if (state.currentInput === '0' && number !== '.') {
        state.currentInput = number;
    } else {
        if (number === '.' && state.currentInput.includes('.')) return;
        state.currentInput += number;
    }
    updateDisplay();
}

function appendBracket(bracket) {
    audio.playAction();
    if (bracket === '(') {
        if (state.currentInput === '0' || state.shouldResetDisplay) {
            state.currentInput = '(';
            state.shouldResetDisplay = false;
        } else {
            state.currentInput += '(';
        }
        state.bracketDepth++;
    } else if (bracket === ')') {
        if (state.bracketDepth > 0) {
            state.currentInput += ')';
            state.bracketDepth--;
        }
    }
    updateDisplay();
}

function appendOperator(op) {
    audio.playAction();
    if (isNaN(parseFloat(state.currentInput)) && !state.currentInput.includes(')')) return;
    if (state.operator !== undefined && !state.shouldResetDisplay) {
        calculate(false);
    }
    state.operator = op;
    state.previousInput = state.currentInput;
    state.shouldResetDisplay = true;
    updateDisplay();
}

// ==========================================================================
// Тригонометрія з підтримкою DEG, RAD та GRAD
// ==========================================================================
function angleToRadians(val) {
    if (state.angleMode === 'DEG') return val * (Math.PI / 180);
    if (state.angleMode === 'GRAD') return val * (Math.PI / 200);
    return val;
}

function radiansToAngle(rad) {
    if (state.angleMode === 'DEG') return rad * (180 / Math.PI);
    if (state.angleMode === 'GRAD') return rad * (200 / Math.PI);
    return rad;
}

function handleTrigOrSecondary(func) {
    audio.playAction();
    const current = parseFloat(state.currentInput);
    if (isNaN(current)) return;

    let result;
    const unitMap = { DEG: '°', RAD: ' rad', GRAD: ' grad' };
    const unit = unitMap[state.angleMode];

    if (!state.isSecondMode) {
        let radians = angleToRadians(current);
        if (func === 'sin') result = Math.sin(radians);
        else if (func === 'cos') result = Math.cos(radians);
        else if (func === 'tan') {
            if ((state.angleMode === 'DEG' && Math.abs(current % 180) === 90) ||
                (state.angleMode === 'GRAD' && Math.abs(current % 200) === 100)) {
                triggerMathAdvisor('tan_90', { val: current });
                state.currentInput = 'Помилка (tan 90°)';
                updateDisplay();
                return;
            }
            result = Math.tan(radians);
        }
        result = Math.round(result * 1000000000) / 1000000000;
        let formatted = formatResult(result);
        addToHistory(`${func}(${current}${unit})`, formatted);
        addTapeEntry(`${func}(${current}${unit})`, formatted, 'Тригонометрія');
        state.currentInput = formatted;
    } else {
        if (func === 'sin') {
            if (current < -1 || current > 1) {
                triggerMathAdvisor('invalid_asin_acos', { val: current });
                state.currentInput = 'Помилка (|x| > 1)';
                updateDisplay();
                return;
            }
            let rad = Math.asin(current);
            result = radiansToAngle(rad);
            let formatted = formatResult(result);
            addToHistory(`asin(${current})`, `${formatted}${unit}`);
            addTapeEntry(`asin(${current})`, `${formatted}${unit}`, 'Арксинус');
            state.currentInput = formatted;
        } else if (func === 'cos') {
            if (current < -1 || current > 1) {
                triggerMathAdvisor('invalid_asin_acos', { val: current });
                state.currentInput = 'Помилка (|x| > 1)';
                updateDisplay();
                return;
            }
            let rad = Math.acos(current);
            result = radiansToAngle(rad);
            let formatted = formatResult(result);
            addToHistory(`acos(${current})`, `${formatted}${unit}`);
            addTapeEntry(`acos(${current})`, `${formatted}${unit}`, 'Арккосинус');
            state.currentInput = formatted;
        } else if (func === 'tan') {
            let rad = Math.atan(current);
            result = radiansToAngle(rad);
            let formatted = formatResult(result);
            addToHistory(`atan(${current})`, `${formatted}${unit}`);
            addTapeEntry(`atan(${current})`, `${formatted}${unit}`, 'Арктангенс');
            state.currentInput = formatted;
        }
    }

    state.shouldResetDisplay = true;
    updateDisplay();
}

function handleHyperbolicOrSecondary(func) {
    audio.playAction();
    const current = parseFloat(state.currentInput);
    if (isNaN(current)) return;

    let result;
    if (!state.isSecondMode) {
        result = Math.sinh(current);
        let formatted = formatResult(result);
        addToHistory(`sinh(${current})`, formatted);
        state.currentInput = formatted;
    } else {
        result = Math.cosh(current);
        let formatted = formatResult(result);
        addToHistory(`cosh(${current})`, formatted);
        state.currentInput = formatted;
    }
    state.shouldResetDisplay = true;
    updateDisplay();
}

function handleLnOrLog2() {
    audio.playAction();
    const current = parseFloat(state.currentInput);
    if (current <= 0 || isNaN(current)) {
        triggerMathAdvisor('invalid_log', { val: current });
        state.currentInput = 'Помилка (x <= 0)';
    } else {
        let result = !state.isSecondMode ? Math.log(current) : Math.log2(current);
        let formatted = formatResult(result);
        addToHistory(!state.isSecondMode ? `ln(${current})` : `log2(${current})`, formatted);
        state.currentInput = formatted;
    }
    state.shouldResetDisplay = true;
    updateDisplay();
}

function handleLogOr10x() {
    audio.playAction();
    const current = parseFloat(state.currentInput);
    if (!state.isSecondMode) {
        if (current <= 0 || isNaN(current)) {
            triggerMathAdvisor('invalid_log', { val: current });
            state.currentInput = 'Помилка (log <= 0)';
        } else {
            let result = Math.log10(current);
            let formatted = formatResult(result);
            addToHistory(`log10(${current})`, formatted);
            state.currentInput = formatted;
        }
    } else {
        if (isNaN(current)) return;
        let result = Math.pow(10, current);
        let formatted = formatResult(result);
        addToHistory(`10^(${current})`, formatted);
        state.currentInput = formatted;
    }
    state.shouldResetDisplay = true;
    updateDisplay();
}

function handleSquareOrCube() {
    audio.playAction();
    const current = parseFloat(state.currentInput);
    if (isNaN(current)) return;
    let result = !state.isSecondMode ? Math.pow(current, 2) : Math.pow(current, 3);
    let formatted = formatResult(result);
    addToHistory(!state.isSecondMode ? `sqr(${current})` : `cube(${current})`, formatted);
    state.currentInput = formatted;
    state.shouldResetDisplay = true;
    updateDisplay();
}

function handleSqrtOrCbrt() {
    audio.playAction();
    const current = parseFloat(state.currentInput);
    if (!state.isSecondMode) {
        if (current < 0 || isNaN(current)) {
            triggerMathAdvisor('negative_sqrt', { val: current });
            state.currentInput = 'Помилка (√ < 0)';
        } else {
            let result = Math.sqrt(current);
            let formatted = formatResult(result);
            addToHistory(`√(${current})`, formatted);
            state.currentInput = formatted;
        }
    } else {
        if (isNaN(current)) return;
        let result = Math.cbrt(current);
        let formatted = formatResult(result);
        addToHistory(`∛(${current})`, formatted);
        state.currentInput = formatted;
    }
    state.shouldResetDisplay = true;
    updateDisplay();
}

function handlePowerOrExp() {
    if (!state.isSecondMode) {
        appendOperator('^');
    } else {
        audio.playAction();
        const current = parseFloat(state.currentInput);
        if (isNaN(current)) return;
        let result = Math.exp(current);
        let formatted = formatResult(result);
        addToHistory(`e^(${current})`, formatted);
        state.currentInput = formatted;
        state.shouldResetDisplay = true;
        updateDisplay();
    }
}

function calculateAbs() {
    audio.playAction();
    const current = parseFloat(state.currentInput);
    if (isNaN(current)) return;
    let result = Math.abs(current);
    let formatted = formatResult(result);
    addToHistory(`|${current}|`, formatted);
    state.currentInput = formatted;
    state.shouldResetDisplay = true;
    updateDisplay();
}

function calculateInverse() {
    audio.playAction();
    const current = parseFloat(state.currentInput);
    if (current === 0) {
        triggerMathAdvisor('zero_division');
        state.currentInput = '0';
    } else if (!isNaN(current)) {
        let result = 1 / current;
        let formatted = formatResult(result);
        addToHistory(`1/(${current})`, formatted);
        state.currentInput = formatted;
    }
    state.shouldResetDisplay = true;
    updateDisplay();
}

function calculateFactorial() {
    audio.playAction();
    let num = parseFloat(state.currentInput);
    if (num < 0 || isNaN(num) || state.currentInput.includes('.')) {
        triggerMathAdvisor('invalid_factorial', { val: num });
        state.currentInput = 'Помилка';
    } else if (num === 0 || num === 1) {
        addToHistory(`${num}!`, '1');
        state.currentInput = '1';
    } else if (num > 170) {
        audio.playError();
        state.currentInput = 'Помилка (Дуже велике)';
    } else {
        let res = 1;
        for (let i = 1; i <= num; i++) {
            res *= i;
        }
        let formatted = res.toString();
        addToHistory(`${num}!`, formatted);
        state.currentInput = formatted;
    }
    state.shouldResetDisplay = true;
    updateDisplay();
}

function toggleSign() {
    audio.playClick(550);
    if (state.currentInput === '0' || isNaN(parseFloat(state.currentInput))) return;
    state.currentInput = (parseFloat(state.currentInput) * -1).toString();
    updateDisplay();
}

function insertPi() {
    audio.playAction();
    if (state.shouldResetDisplay) { state.currentInput = ''; state.shouldResetDisplay = false; }
    state.currentInput = Math.PI.toFixed(12).replace(/\.?0+$/, '');
    updateDisplay();
}

function insertEuler() {
    audio.playAction();
    if (state.shouldResetDisplay) { state.currentInput = ''; state.shouldResetDisplay = false; }
    state.currentInput = Math.E.toFixed(12).replace(/\.?0+$/, '');
    updateDisplay();
}

function insertConstantVal(val, name) {
    audio.playAction();
    state.currentInput = val;
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('constants-modal');
    showToast(`Константу ${name} вставлено`, '⚛️');
}

// Пам'ять
function memoryClear() {
    audio.playAction();
    state.memoryValue = 0;
    updateDisplay();
    showToast("Пам'ять очищено", '🧹');
}

function memoryRecall() {
    audio.playAction();
    state.currentInput = formatResult(state.memoryValue);
    state.shouldResetDisplay = true;
    updateDisplay();
    showToast(`Викликано з пам'яті: ${state.currentInput}`, '📥');
}

function memoryAdd() {
    audio.playAction();
    state.memoryValue += parseFloat(state.currentInput) || 0;
    state.shouldResetDisplay = true;
    updateDisplay();
    showToast(`Додано до пам'яті (M = ${formatResult(state.memoryValue)})`, '➕');
}

function memorySubtract() {
    audio.playAction();
    state.memoryValue -= parseFloat(state.currentInput) || 0;
    state.shouldResetDisplay = true;
    updateDisplay();
    showToast(`Віднято від пам'яті (M = ${formatResult(state.memoryValue)})`, '➖');
}

// Матриця Пам'яті M1-M4
function updateMemorySlotsUI() {
    for (let i = 0; i < 4; i++) {
        const el = document.getElementById(`mem-slot-val-${i}`);
        if (el) el.innerText = formatResult(state.memorySlots[i]);
    }
}

function memorySlotStore(idx) {
    audio.playAction();
    const val = parseFloat(state.currentInput) || 0;
    state.memorySlots[idx] = val;
    localStorage.setItem('calc_mem_slots', JSON.stringify(state.memorySlots));
    updateMemorySlotsUI();
    updateDisplay();
    showToast(`Збережено в M${idx + 1}: ${val}`, '💾');
}

function memorySlotRecall(idx) {
    audio.playAction();
    const val = state.memorySlots[idx] || 0;
    state.currentInput = formatResult(val);
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('memory-modal');
    showToast(`Викликано з M${idx + 1}: ${state.currentInput}`, '📥');
}

function memorySlotClear(idx) {
    audio.playAction();
    state.memorySlots[idx] = 0;
    localStorage.setItem('calc_mem_slots', JSON.stringify(state.memorySlots));
    updateMemorySlotsUI();
    updateDisplay();
    showToast(`Слот M${idx + 1} очищено`, '🧹');
}

function clearAllMemorySlots() {
    audio.playAction();
    state.memorySlots = [0, 0, 0, 0];
    localStorage.setItem('calc_mem_slots', JSON.stringify(state.memorySlots));
    updateMemorySlotsUI();
    updateDisplay();
    showToast('Всі слоти M1-M4 очищено', '🧹');
}

