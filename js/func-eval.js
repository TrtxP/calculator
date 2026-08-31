// ==========================================================================
// Обчислювач Функцій f(x)
// ==========================================================================
function parseAndEvalFormula(expr, xVal) {
    try {
        let clean = expr.toLowerCase()
            .replace(/\s+/g, '')
            .replace(/\^/g, '**')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/abs/g, 'Math.abs')
            .replace(/ln/g, 'Math.log')
            .replace(/pi/g, 'Math.PI')
            .replace(/e/g, 'Math.E');

        clean = clean.replace(/\bx\b/g, `(${xVal})`);
        clean = clean.replace(/(\d)\(/g, '$1*(');

        // Білий список: після підстановок функцій дозволені лише числа,
        // x, оператори, дужки та згенеровані Math.* токени. Будь-які інші
        // ідентифікатори/символи -> відмова (захист від виконання довільного
        // коду через new Function)
        const masked = clean.replace(/Math\.(?:sin|cos|tan|sqrt|abs|log|PI|E)/g, '\u0001');
        if (!/^[\d x+\-*/%().,\u0001]+$/.test(masked)) {
            return 'Помилка';
        }

        const res = Function(`'use strict'; return (${clean})`)();
        return isNaN(res) || !isFinite(res) ? 'Помилка' : res;
    } catch (e) {
        return 'Помилка';
    }
}

function evaluateCustomFunc() {
    const expr = document.getElementById('func-expr-input').value;
    const xVal = parseFloat(document.getElementById('func-single-x').value) || 0;
    const resEl = document.getElementById('func-single-res');

    const res = parseAndEvalFormula(expr, xVal);
    state.funcSingleRes = typeof res === 'number' ? formatResult(res) : 'Помилка';
    if (resEl) resEl.innerText = state.funcSingleRes;

    buildFuncTable();
}

function buildFuncTable() {
    const expr = document.getElementById('func-expr-input').value;
    const start = parseFloat(document.getElementById('func-range-start').value) || -3;
    const end = parseFloat(document.getElementById('func-range-end').value) || 3;
    const step = parseFloat(document.getElementById('func-range-step').value) || 1;
    const tbody = document.getElementById('func-table-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const safeStep = Math.max(0.01, Math.abs(step));
    const safeEnd = Math.min(start + (safeStep * 50), end);

    for (let x = start; x <= safeEnd + 0.0001; x += safeStep) {
        const val = parseAndEvalFormula(expr, x);
        const tr = document.createElement('tr');
        const formattedVal = typeof val === 'number' ? formatResult(val) : val;
        tr.innerHTML = `
            <td><strong>${parseFloat(x.toFixed(4))}</strong></td>
            <td style="color:var(--accent-operator); font-weight:700;">${formattedVal}</td>
            <td><button class="btn-secondary" style="padding:2px 6px; font-size:0.75rem;" onclick="insertTableValToCalc('${formattedVal}')">Вставити</button></td>
        `;
        tbody.appendChild(tr);
    }
}

function insertFuncResToCalc() {
    audio.playAction();
    state.currentInput = state.funcSingleRes;
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('func-eval-modal');
    showToast(`Значення f(x) = ${state.funcSingleRes} вставлено`, '📈');
}

function insertTableValToCalc(val) {
    if (val !== 'Помилка') {
        audio.playAction();
        state.currentInput = val.toString();
        state.shouldResetDisplay = true;
        updateDisplay();
        closeModal('func-eval-modal');
        showToast(`Значення ${val} вставлено`, '📥');
    }
}

