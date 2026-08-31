// ==========================================================================
// Головний розрахунок (Calculate) + Результатне Світіння
// ==========================================================================
function calculate(saveToHistory = true) {
    // Авто-балансування відкритих дужок перед обчисленням
    if (state.bracketDepth > 0) {
        state.currentInput += ')'.repeat(state.bracketDepth);
        state.bracketDepth = 0;
    }

    let computation;
    const prev = parseFloat(state.previousInput);
    const current = parseFloat(state.currentInput);

    if (isNaN(prev) || isNaN(current) || state.operator === undefined) return;

    switch (state.operator) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            if (current === 0) {
                triggerMathAdvisor('zero_division');
                state.currentInput = '0';
                state.operator = undefined;
                state.shouldResetDisplay = true;
                updateDisplay();
                return;
            }
            computation = prev / current;
            break;
        case '^':
            if (prev === 0 && current <= 0) {
                triggerMathAdvisor('zero_division');
                return;
            }
            computation = Math.pow(prev, current);
            break;
        case 'mod':
            if (current === 0) {
                triggerMathAdvisor('zero_division');
                return;
            }
            computation = prev % current;
            break;
        default:
            return;
    }

    audio.playEquals();
    let resultStr = formatResult(computation);

    if (saveToHistory) {
        let opSymbol = state.operator;
        if (opSymbol === '*') opSymbol = '×';
        if (opSymbol === '/') opSymbol = '÷';
        const eqStr = `${prev} ${opSymbol} ${current}`;
        addToHistory(eqStr, resultStr);
        addTapeEntry(eqStr, resultStr, 'Розрахунок');
    }

    state.operationsCount++;
    state.currentInput = resultStr;
    state.operator = undefined;
    state.shouldResetDisplay = true;
    updateDisplay();

    // Ефект неонового підсвічування дисплея
    if (dom.display) {
        dom.display.classList.add('display-result-glow');
        setTimeout(() => dom.display.classList.remove('display-result-glow'), 600);
    }
}

function formatResult(num) {
    if (isNaN(num) || !isFinite(num)) return 'Помилка';
    if (state.precisionMode !== 'auto') {
        const decimals = parseInt(state.precisionMode);
        return parseFloat(num.toFixed(decimals)).toString();
    }
    return parseFloat(num.toFixed(12)).toString();
}

