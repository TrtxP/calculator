// ==========================================================================
// Інтерактивний Бітовий Інспектор
// ==========================================================================
function renderBitmaskGrid() {
    const grid = document.getElementById('bits-interactive-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (let i = 31; i >= 0; i--) {
        const isSet = ((state.bitmaskValue >>> i) & 1) === 1;
        const btn = document.createElement('button');
        btn.className = `bit-btn ${isSet ? 'active' : ''}`;
        btn.innerText = isSet ? '1' : '0';
        btn.title = `Біт ${i} (вага: 2^${i} = ${Math.pow(2, i)})`;
        btn.onclick = () => {
            audio.playClick(800);
            state.bitmaskValue = (state.bitmaskValue ^ (1 << i)) >>> 0;
            updateBitmaskOutputs();
        };
        grid.appendChild(btn);
    }
}

function updateBitmaskOutputs() {
    const decEl = document.getElementById('bit-dec-input');
    const hexEl = document.getElementById('bit-hex-input');
    if (decEl) decEl.value = state.bitmaskValue;
    if (hexEl) hexEl.value = '0x' + (state.bitmaskValue >>> 0).toString(16).toUpperCase();
    renderBitmaskGrid();
}

function syncFromDecInput(val) {
    const num = parseInt(val, 10) || 0;
    state.bitmaskValue = num >>> 0;
    updateBitmaskOutputs();
}

function syncFromHexInput(val) {
    const clean = val.replace(/^0x/i, '');
    const num = parseInt(clean, 16) || 0;
    state.bitmaskValue = num >>> 0;
    updateBitmaskOutputs();
}

function bitwiseMaskOp(op) {
    audio.playAction();
    if (op === 'invert') state.bitmaskValue = (~state.bitmaskValue) >>> 0;
    else if (op === 'shl') state.bitmaskValue = (state.bitmaskValue << 1) >>> 0;
    else if (op === 'shr') state.bitmaskValue = (state.bitmaskValue >>> 1);
    else if (op === 'clear') state.bitmaskValue = 0;
    else if (op === 'fill') state.bitmaskValue = 0xFFFFFFFF;
    updateBitmaskOutputs();
}

function insertBitmaskToCalc() {
    audio.playAction();
    state.currentInput = state.bitmaskValue.toString();
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('bitmask-modal');
    showToast(`Значення ${state.bitmaskValue} вставлено`, '👾');
}

