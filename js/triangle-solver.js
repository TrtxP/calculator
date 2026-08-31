// ==========================================================================
// Геометричний Розв'язувач Трикутників
// ==========================================================================
function switchTriangleMode(mode) {
    state.activeTriangleMode = mode;
    document.querySelectorAll('[data-ttab]').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-ttab') === mode);
    });

    const l1 = document.getElementById('tri-lbl-1');
    const l2 = document.getElementById('tri-lbl-2');
    const l3 = document.getElementById('tri-lbl-3');
    const i1 = document.getElementById('tri-val-1');
    const i2 = document.getElementById('tri-val-2');
    const i3 = document.getElementById('tri-val-3');

    if (mode === 'sss') {
        if (l1) l1.innerText = 'Сторона a:';
        if (l2) l2.innerText = 'Сторона b:';
        if (l3) l3.innerText = 'Сторона c:';
        if (i1) i1.value = '5';
        if (i2) i2.value = '6';
        if (i3) i3.value = '7';
    } else if (mode === 'sas') {
        if (l1) l1.innerText = 'Сторона a:';
        if (l2) l2.innerText = 'Сторона b:';
        if (l3) l3.innerText = 'Кут γ між ними (градуси):';
        if (i1) i1.value = '5';
        if (i2) i2.value = '6';
        if (i3) i3.value = '60';
    } else if (mode === 'asa') {
        if (l1) l1.innerText = 'Сторона a:';
        if (l2) l2.innerText = 'Кут β (градуси):';
        if (l3) l3.innerText = 'Кут γ (градуси):';
        if (i1) i1.value = '6';
        if (i2) i2.value = '50';
        if (i3) i3.value = '70';
    }
    solveTriangleGeometry();
}

function solveTriangleGeometry() {
    let v1 = parseFloat(document.getElementById('tri-val-1').value) || 0;
    let v2 = parseFloat(document.getElementById('tri-val-2').value) || 0;
    let v3 = parseFloat(document.getElementById('tri-val-3').value) || 0;

    let a = 0, b = 0, c = 0;
    let alpha = 0, beta = 0, gamma = 0;

    const areaEl = document.getElementById('tri-res-area');
    const perimEl = document.getElementById('tri-res-perim');
    const anglesEl = document.getElementById('tri-res-angles');
    const radiiEl = document.getElementById('tri-res-radii');
    const badgeEl = document.getElementById('tri-type-badge');

    if (state.activeTriangleMode === 'sss') {
        a = v1; b = v2; c = v3;
        if (a + b <= c || a + c <= b || b + c <= a || a <= 0 || b <= 0 || c <= 0) {
            if (badgeEl) badgeEl.innerText = 'Трикутник з такими сторонами не існує!';
            if (areaEl) areaEl.innerText = '—';
            if (perimEl) perimEl.innerText = '—';
            return;
        }
        const cosA = (b * b + c * c - a * a) / (2 * b * c);
        const cosB = (a * a + c * c - b * b) / (2 * a * c);
        const cosC = (a * a + b * b - c * c) / (2 * a * b);
        alpha = Math.acos(Math.max(-1, Math.min(1, cosA))) * (180 / Math.PI);
        beta = Math.acos(Math.max(-1, Math.min(1, cosB))) * (180 / Math.PI);
        gamma = Math.acos(Math.max(-1, Math.min(1, cosC))) * (180 / Math.PI);
    } else if (state.activeTriangleMode === 'sas') {
        a = v1; b = v2; gamma = v3;
        if (gamma <= 0 || gamma >= 180 || a <= 0 || b <= 0) {
            if (badgeEl) badgeEl.innerText = 'Некоректний кут або сторони';
            return;
        }
        const radG = gamma * (Math.PI / 180);
        c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(radG));
        const cosA = (b * b + c * c - a * a) / (2 * b * c);
        alpha = Math.acos(Math.max(-1, Math.min(1, cosA))) * (180 / Math.PI);
        beta = 180 - alpha - gamma;
    } else if (state.activeTriangleMode === 'asa') {
        a = v1; beta = v2; gamma = v3;
        alpha = 180 - beta - gamma;
        if (alpha <= 0 || beta <= 0 || gamma <= 0 || a <= 0) {
            if (badgeEl) badgeEl.innerText = 'Сума кутів перевищує 180°';
            return;
        }
        const radA = alpha * (Math.PI / 180);
        const radB = beta * (Math.PI / 180);
        const radG = gamma * (Math.PI / 180);
        b = a * (Math.sin(radB) / Math.sin(radA));
        c = a * (Math.sin(radG) / Math.sin(radA));
    }

    const perim = a + b + c;
    const s = perim / 2;
    const area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));
    const rIn = area > 0 ? area / s : 0;
    const rOut = area > 0 ? (a * b * c) / (4 * area) : 0;

    state.triangleResults.area = formatResult(area);
    state.triangleResults.perim = formatResult(perim);

    if (areaEl) areaEl.innerText = state.triangleResults.area;
    if (perimEl) perimEl.innerText = state.triangleResults.perim;
    if (anglesEl) anglesEl.innerText = `${alpha.toFixed(1)}° / ${beta.toFixed(1)}° / ${gamma.toFixed(1)}°`;
    if (radiiEl) radiiEl.innerText = `r = ${rIn.toFixed(2)} | R = ${rOut.toFixed(2)}`;

    let typeStr = '';
    if (Math.abs(a - b) < 0.01 && Math.abs(b - c) < 0.01) typeStr = 'Рівносторонній';
    else if (Math.abs(a - b) < 0.01 || Math.abs(b - c) < 0.01 || Math.abs(a - c) < 0.01) typeStr = 'Рівнобедрений';
    else typeStr = 'Різносторонній';

    const maxAngle = Math.max(alpha, beta, gamma);
    if (Math.abs(maxAngle - 90) < 0.1) typeStr += ', Прямокутний';
    else if (maxAngle > 90) typeStr += ', Тупокутний';
    else typeStr += ', Гострокутний';

    if (badgeEl) badgeEl.innerText = typeStr;
}

function insertTriangleAreaToCalc() {
    audio.playAction();
    state.currentInput = state.triangleResults.area;
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('triangle-solver-modal');
    showToast(`Площу S = ${state.triangleResults.area} вставлено`, '📐');
}

function insertTrianglePerimToCalc() {
    audio.playAction();
    state.currentInput = state.triangleResults.perim;
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('triangle-solver-modal');
    showToast(`Периметр P = ${state.triangleResults.perim} вставлено`, '📐');
}

