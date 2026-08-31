// ==========================================================================
// 2D Графік Функцій
// ==========================================================================
function plotFunction(funcName) {
    state.activeGraphFunc = funcName;
    audio.playAction();
    const canvas = document.getElementById('function-canvas');
    const label = document.getElementById('graph-current-func');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const names = {
        sin: 'y = sin(x)',
        cos: 'y = cos(x)',
        tan: 'y = tan(x)',
        sqr: 'y = x²',
        cube: 'y = x³',
        sqrt: 'y = √x',
        ln: 'y = ln(x)',
        inv: 'y = 1/x'
    };
    if (label) label.innerHTML = `Функція: <strong>${names[funcName] || funcName}</strong>`;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const cx = w / 2;
    const cy = h / 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;

    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-operator') || '#8b1538';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const scaleX = 25;
    const scaleY = 25;
    let isDrawing = false;

    for (let px = 0; px < w; px++) {
        const x = (px - cx) / scaleX;
        let y;

        switch (funcName) {
            case 'sin': y = Math.sin(x); break;
            case 'cos': y = Math.cos(x); break;
            case 'tan': y = Math.tan(x); if (Math.abs(y) > 8) { isDrawing = false; continue; } break;
            case 'sqr': y = Math.pow(x, 2); break;
            case 'cube': y = Math.pow(x, 3); break;
            case 'sqrt': if (x < 0) { isDrawing = false; continue; } y = Math.sqrt(x); break;
            case 'ln': if (x <= 0) { isDrawing = false; continue; } y = Math.log(x); break;
            case 'inv': if (Math.abs(x) < 0.08) { isDrawing = false; continue; } y = 1 / x; break;
        }

        const py = cy - y * scaleY;
        if (py < 0 || py > h) {
            isDrawing = false;
            continue;
        }

        if (!isDrawing) {
            ctx.moveTo(px, py);
            isDrawing = true;
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.stroke();
}

function resetGraphZoom() {
    plotFunction(state.activeGraphFunc);
}

