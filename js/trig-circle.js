// ==========================================================================
// 1. НОВЕ v1.8.4: Інтерактивне Тригонометричне Коло (Unit Circle Visualizer)
// ==========================================================================
function updateTrigCircle(angleVal) {
    state.trigAngleDeg = parseFloat(angleVal) || 0;
    const slider = document.getElementById('trig-angle-slider');
    if (slider) slider.value = state.trigAngleDeg;

    const rad = state.trigAngleDeg * (Math.PI / 180);
    const sinVal = Math.sin(rad);
    const cosVal = Math.cos(rad);
    const tanVal = Math.abs(cosVal) > 0.0001 ? sinVal / cosVal : (sinVal > 0 ? Infinity : -Infinity);

    // Оновлення текстових міток
    const angleLabel = document.getElementById('trig-angle-val');
    const sinEl = document.getElementById('trig-res-sin');
    const cosEl = document.getElementById('trig-res-cos');
    const tanEl = document.getElementById('trig-res-tan');
    const quadEl = document.getElementById('trig-res-quad');

    const piFraction = (state.trigAngleDeg / 180).toFixed(2);
    if (angleLabel) angleLabel.innerText = `${state.trigAngleDeg}° (${piFraction}π rad)`;
    if (sinEl) sinEl.innerText = sinVal.toFixed(4);
    if (cosEl) cosEl.innerText = cosVal.toFixed(4);
    if (tanEl) tanEl.innerText = isFinite(tanVal) ? tanVal.toFixed(4) : '±∞ (розрив)';

    let quadText = 'I Чверть (+, +)';
    if (state.trigAngleDeg > 90 && state.trigAngleDeg <= 180) quadText = 'II Чверть (−, +)';
    else if (state.trigAngleDeg > 180 && state.trigAngleDeg <= 270) quadText = 'III Чверть (−, −)';
    else if (state.trigAngleDeg > 270 && state.trigAngleDeg <= 360) quadText = 'IV Чверть (+, −)';
    if (quadEl) quadEl.innerText = quadText;

    drawTrigUnitCircleCanvas(state.trigAngleDeg, sinVal, cosVal);
}

function setTrigAngle(deg) {
    audio.playAction();
    updateTrigCircle(deg);
}

function drawTrigUnitCircleCanvas(deg, sinVal, cosVal) {
    const canvas = document.getElementById('trig-unit-circle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = 95; // Радіус кола

    ctx.clearRect(0, 0, w, h);

    // 1. Сітка та осі
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.stroke();

    // 2. Одиничне коло
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Точка на колі
    const px = cx + cosVal * r;
    const py = cy - sinVal * r; // Інверсія Y у Canvas

    // 4. Проекція Косинуса (на осі X)
    ctx.strokeStyle = '#f59e0b'; // Gold
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, cy);
    ctx.stroke();

    // 5. Проекція Синуса (вертикаль)
    ctx.strokeStyle = '#c026d3'; // Magenta
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px, cy);
    ctx.lineTo(px, py);
    ctx.stroke();

    // 6. Радіус-вектор гіпотенузи
    ctx.strokeStyle = '#38bdf8'; // Cyan
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();

    // 7. Сектор кута
    ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 26, 0, -deg * (Math.PI / 180), true);
    ctx.closePath();
    ctx.fill();

    // 8. Маркер точки на колі
    ctx.fillStyle = '#ff0055';
    ctx.beginPath();
    ctx.arc(px, py, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Підписи осей
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('1', cx + r + 2, cy - 4);
    ctx.fillText('-1', cx - r - 12, cy - 4);
    ctx.fillText('1 (sin)', cx + 4, cy - r - 4);
    ctx.fillText('(cos)', w - 28, cy - 4);
}

function insertTrigSinToCalc() {
    audio.playAction();
    const rad = state.trigAngleDeg * (Math.PI / 180);
    const val = formatResult(Math.sin(rad));
    state.currentInput = val;
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('trig-circle-modal');
    showToast(`sin(${state.trigAngleDeg}°) = ${val} вставлено`, '⭕');
}

function insertTrigCosToCalc() {
    audio.playAction();
    const rad = state.trigAngleDeg * (Math.PI / 180);
    const val = formatResult(Math.cos(rad));
    state.currentInput = val;
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('trig-circle-modal');
    showToast(`cos(${state.trigAngleDeg}°) = ${val} вставлено`, '⭕');
}
