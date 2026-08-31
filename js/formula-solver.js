// ==========================================================================
// Фізико-Математичний Формулатор
// ==========================================================================
function solvePhysicsFormula(type) {
    if (type === 'ek') {
        const m = parseFloat(document.getElementById('f-ek-m').value) || 0;
        const v = parseFloat(document.getElementById('f-ek-v').value) || 0;
        const ek = 0.5 * m * (v * v);
        const el = document.getElementById('f-ek-res');
        if (el) el.innerText = `${formatResult(ek)} Дж`;
    } else if (type === 'ohm') {
        const u = parseFloat(document.getElementById('f-ohm-u').value) || 0;
        const r = parseFloat(document.getElementById('f-ohm-r').value) || 1;
        const i = r !== 0 ? u / r : 0;
        const p = u * i;
        const el = document.getElementById('f-ohm-res');
        if (el) el.innerText = `${formatResult(i)} А (${formatResult(p)} Вт)`;
    } else if (type === 'fall') {
        const t = parseFloat(document.getElementById('f-fall-t').value) || 0;
        const g = parseFloat(document.getElementById('f-fall-g').value) || 9.806;
        const h = 0.5 * g * (t * t);
        const v = g * t;
        const el = document.getElementById('f-fall-res');
        if (el) el.innerText = `${formatResult(h)} м (${formatResult(v)} м/с)`;
    } else if (type === 'rho') {
        const m = parseFloat(document.getElementById('f-rho-m').value) || 0;
        const v = parseFloat(document.getElementById('f-rho-v').value) || 1;
        const rho = v !== 0 ? m / v : 0;
        const el = document.getElementById('f-rho-res');
        if (el) el.innerText = `${formatResult(rho)} кг/м³`;
    } else if (type === 'grav') {
        const m1 = parseFloat(document.getElementById('f-grav-m1').value) || 0;
        const m2 = parseFloat(document.getElementById('f-grav-m2').value) || 0;
        const G = 6.6743e-11;
        const r = 6371000;
        const f = (G * m1 * m2) / (r * r);
        const el = document.getElementById('f-grav-res');
        if (el) el.innerText = `${formatResult(f)} Н`;
    } else if (type === 'gas') {
        const n = parseFloat(document.getElementById('f-gas-n').value) || 1;
        const t = parseFloat(document.getElementById('f-gas-t').value) || 293.15;
        const R = 8.314;
        const V = 0.0224;
        const p = (n * R * t) / V;
        const el = document.getElementById('f-gas-res');
        if (el) el.innerText = `${formatResult(p)} Па`;
    }
}

function insertFormulaValToCalc(resId) {
    audio.playAction();
    const el = document.getElementById(resId);
    if (el) {
        const raw = el.innerText.split(' ')[0].replace(/[^\d.-]/g, '');
        if (raw) {
            state.currentInput = raw;
            state.shouldResetDisplay = true;
            updateDisplay();
            closeModal('formula-solver-modal');
            showToast(`Значення ${raw} вставлено`, '⚡');
        }
    }
}

