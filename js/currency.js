// ==========================================================================
// Конвертер Валют та Криптовалют
// ==========================================================================
function runCurrencyConversion(dir = 'from') {
    const fromUnit = document.getElementById('curr-from-unit').value;
    const toUnit = document.getElementById('curr-to-unit').value;
    const fromInp = document.getElementById('curr-from-val');
    const toInp = document.getElementById('curr-to-val');
    if (!fromInp || !toInp) return;

    const rates = state.currencyRates;
    if (dir === 'from') {
        const val = parseFloat(fromInp.value) || 0;
        const inUAH = val * (rates[fromUnit] || 1);
        const res = inUAH / (rates[toUnit] || 1);
        toInp.value = res < 0.01 ? res.toFixed(6) : res.toFixed(2);
    } else {
        const val = parseFloat(toInp.value) || 0;
        const inUAH = val * (rates[toUnit] || 1);
        const res = inUAH / (rates[fromUnit] || 1);
        fromInp.value = res < 0.01 ? res.toFixed(6) : res.toFixed(2);
    }
}

function swapCurrencyUnits() {
    audio.playAction();
    const u1 = document.getElementById('curr-from-unit');
    const u2 = document.getElementById('curr-to-unit');
    if (!u1 || !u2) return;
    const t = u1.value;
    u1.value = u2.value;
    u2.value = t;
    runCurrencyConversion('from');
}

function insertCurrencyToCalc() {
    audio.playAction();
    const val = document.getElementById('curr-to-val').value;
    if (val) {
        state.currentInput = val;
        state.shouldResetDisplay = true;
        updateDisplay();
        closeModal('currency-modal');
        showToast(`Суму ${val} вставлено`, '💱');
    }
}

function copyCurrencyVal() {
    const val = document.getElementById('curr-to-val').value;
    if (val) {
        audio.playAction();
        navigator.clipboard.writeText(val);
        showToast(`Скопійовано: ${val}`, '📋');
    }
}

