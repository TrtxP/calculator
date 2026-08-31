// ==========================================================================
// Розширений Калькулятор Відсотків Pro
// ==========================================================================
function calcPercent1() {
    const p = parseFloat(document.getElementById('p1-percent').value) || 0;
    const base = parseFloat(document.getElementById('p1-base').value) || 0;
    const res = (p / 100) * base;
    const el = document.getElementById('p1-res');
    if (el) el.innerText = formatResult(res);
}

function calcPercent2() {
    const v1 = parseFloat(document.getElementById('p2-val1').value) || 0;
    const v2 = parseFloat(document.getElementById('p2-val2').value) || 0;
    const el = document.getElementById('p2-res');
    if (v1 === 0) {
        if (el) el.innerText = 'Неможливо (база 0)';
        return;
    }
    const delta = ((v2 - v1) / v1) * 100;
    if (el) el.innerText = `${delta >= 0 ? '+' : ''}${delta.toFixed(2)}%`;
}

function calcPercent3() {
    const base = parseFloat(document.getElementById('p3-base').value) || 0;
    const op = document.getElementById('p3-op').value;
    const p = parseFloat(document.getElementById('p3-percent').value) || 0;
    const el = document.getElementById('p3-res');
    let res = op === 'add' ? base + (base * (p / 100)) : base - (base * (p / 100));
    if (el) el.innerText = formatResult(res);
}

