// ==========================================================================
// Розв'язувач Квадратних Рівнянь
// ==========================================================================
function solveQuadraticEquation() {
    const a = parseFloat(document.getElementById('quad-a').value) || 0;
    const b = parseFloat(document.getElementById('quad-b').value) || 0;
    const c = parseFloat(document.getElementById('quad-c').value) || 0;

    const discEl = document.getElementById('quad-disc-val');
    const x1El = document.getElementById('quad-x1-val');
    const x2El = document.getElementById('quad-x2-val');
    const vertEl = document.getElementById('quad-vertex-info');

    if (a === 0) {
        if (discEl) discEl.innerText = 'a = 0 (Лінійне рівняння bx + c = 0)';
        if (b !== 0) {
            const root = (-c / b).toFixed(4);
            state.quadRoots.x1 = root;
            state.quadRoots.x2 = root;
            if (x1El) x1El.innerText = root;
            if (x2El) x2El.innerText = '—';
        } else {
            if (x1El) x1El.innerText = c === 0 ? 'Безліч коренів' : 'Немає розв\'язків';
            if (x2El) x2El.innerText = '—';
        }
        if (vertEl) vertEl.innerText = 'Вершина: не існує (пряма)';
        return;
    }

    const D = (b * b) - (4 * a * c);
    if (discEl) discEl.innerText = `D = ${D >= 0 ? D.toFixed(4) : D.toFixed(4) + ' (D < 0)'}`;

    const vx = -b / (2 * a);
    const vy = c - (b * b) / (4 * a);
    if (vertEl) vertEl.innerHTML = `Вершина параболи: <code>(${vx.toFixed(3)}; ${vy.toFixed(3)})</code>`;

    if (D > 0) {
        const sqrtD = Math.sqrt(D);
        const x1 = (-b + sqrtD) / (2 * a);
        const x2 = (-b - sqrtD) / (2 * a);
        state.quadRoots.x1 = x1.toFixed(4);
        state.quadRoots.x2 = x2.toFixed(4);
        if (x1El) x1El.innerText = state.quadRoots.x1;
        if (x2El) x2El.innerText = state.quadRoots.x2;
    } else if (D === 0) {
        const x = -b / (2 * a);
        state.quadRoots.x1 = x.toFixed(4);
        state.quadRoots.x2 = x.toFixed(4);
        if (x1El) x1El.innerText = state.quadRoots.x1;
        if (x2El) x2El.innerText = `${state.quadRoots.x2} (один корінь)`;
    } else {
        const real = (-b / (2 * a)).toFixed(3);
        const imag = (Math.sqrt(-D) / (2 * a)).toFixed(3);
        state.quadRoots.x1 = `${real} + ${imag}i`;
        state.quadRoots.x2 = `${real} - ${imag}i`;
        if (x1El) x1El.innerText = state.quadRoots.x1;
        if (x2El) x2El.innerText = state.quadRoots.x2;
    }
}

function insertQuadRootToCalc(idx) {
    audio.playAction();
    const val = idx === 1 ? state.quadRoots.x1 : state.quadRoots.x2;
    if (val && !val.includes('i')) {
        state.currentInput = val.toString();
        state.shouldResetDisplay = true;
        updateDisplay();
        closeModal('quadratic-modal');
        showToast(`Корінь x${idx} = ${val} вставлено`, '📐');
    } else {
        showToast('Комплексне число не підтримується у дійсній панелі', '⚠️');
    }
}

