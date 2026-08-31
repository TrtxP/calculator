// ==========================================================================
// НОВЕ v1.8.5: 3D Векторний Калькулятор (3D Vector Math)
// ==========================================================================
function solveVectorMath() {
    const ux = parseFloat(document.getElementById('vec-u-x')?.value) || 0;
    const uy = parseFloat(document.getElementById('vec-u-y')?.value) || 0;
    const uz = parseFloat(document.getElementById('vec-u-z')?.value) || 0;

    const vx = parseFloat(document.getElementById('vec-v-x')?.value) || 0;
    const vy = parseFloat(document.getElementById('vec-v-y')?.value) || 0;
    const vz = parseFloat(document.getElementById('vec-v-z')?.value) || 0;

    // 1. Скалярний добуток (Dot product)
    const dot = (ux * vx) + (uy * vy) + (uz * vz);

    // 2. Векторний добуток (Cross product)
    const cx = (uy * vz) - (uz * vy);
    const cy = (uz * vx) - (ux * vz);
    const cz = (ux * vy) - (uy * vx);

    // 3. Модулі (Довжини)
    const lenU = Math.sqrt(ux * ux + uy * uy + uz * uz);
    const lenV = Math.sqrt(vx * vx + vy * vy + vz * vz);

    // 4. Кут між векторами
    let angleDeg = 0;
    let angleRad = 0;
    if (lenU > 0 && lenV > 0) {
        const cosTheta = Math.max(-1, Math.min(1, dot / (lenU * lenV)));
        angleRad = Math.acos(cosTheta);
        angleDeg = angleRad * (180 / Math.PI);
    }

    // 5. Евклідова відстань
    const dist = Math.sqrt((vx - ux) ** 2 + (vy - uy) ** 2 + (vz - uz) ** 2);

    state.vectorResults = {
        dot: dot.toFixed(2),
        cross: `(${cx.toFixed(1)}, ${cy.toFixed(1)}, ${cz.toFixed(1)})`,
        lenU: lenU.toFixed(3),
        lenV: lenV.toFixed(3),
        angle: `${angleDeg.toFixed(1)}° (${angleRad.toFixed(2)} rad)`,
        dist: dist.toFixed(3)
    };

    const dEl = document.getElementById('vec-res-dot');
    const cEl = document.getElementById('vec-res-cross');
    const uEl = document.getElementById('vec-res-len-u');
    const vEl = document.getElementById('vec-res-len-v');
    const aEl = document.getElementById('vec-res-angle');
    const distEl = document.getElementById('vec-res-dist');

    if (dEl) dEl.innerText = state.vectorResults.dot;
    if (cEl) cEl.innerText = state.vectorResults.cross;
    if (uEl) uEl.innerText = state.vectorResults.lenU;
    if (vEl) vEl.innerText = state.vectorResults.lenV;
    if (aEl) aEl.innerText = state.vectorResults.angle;
    if (distEl) distEl.innerText = state.vectorResults.dist;
}

function insertVectorDotToCalc() {
    audio.playAction();
    state.currentInput = state.vectorResults.dot;
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('vector-calc-modal');
    showToast(`Скалярний добуток u·v = ${state.vectorResults.dot} вставлено`, '📐');
}

function insertVectorMagUToCalc() {
    audio.playAction();
    state.currentInput = state.vectorResults.lenU;
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('vector-calc-modal');
    showToast(`Модуль |u| = ${state.vectorResults.lenU} вставлено`, '📐');
}

