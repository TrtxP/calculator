// ==========================================================================
// Програмістські Системи Числення
// ==========================================================================
function syncProgrammerBase(sourceBase, value) {
    const val = value.trim();
    if (!val) {
        document.getElementById('prog-dec').value = '';
        document.getElementById('prog-hex').value = '';
        document.getElementById('prog-oct').value = '';
        document.getElementById('prog-bin').value = '';
        return;
    }

    let num = 0;
    try {
        if (sourceBase === 'DEC') num = parseInt(val, 10);
        else if (sourceBase === 'HEX') num = parseInt(val, 16);
        else if (sourceBase === 'OCT') num = parseInt(val, 8);
        else if (sourceBase === 'BIN') num = parseInt(val, 2);

        if (isNaN(num)) return;

        if (sourceBase !== 'DEC') document.getElementById('prog-dec').value = num.toString(10);
        if (sourceBase !== 'HEX') document.getElementById('prog-hex').value = num.toString(16).toUpperCase();
        if (sourceBase !== 'OCT') document.getElementById('prog-oct').value = num.toString(8);
        if (sourceBase !== 'BIN') document.getElementById('prog-bin').value = num.toString(2);
    } catch (e) { }
}

function progBitwise(op) {
    audio.playAction();
    const decInput = document.getElementById('prog-dec');
    let num = parseInt(decInput.value, 10) || 0;
    let res = num;

    if (op === 'NOT') res = ~num;
    else if (op === 'SHL') res = num << 1;
    else if (op === 'SHR') res = num >> 1;

    syncProgrammerBase('DEC', res.toString(10));
    decInput.value = res.toString(10);
    showToast(`Побітова дія ${op}: ${res}`, '💻');
}

function insertProgValToCalc() {
    audio.playAction();
    const decInput = document.getElementById('prog-dec');
    if (decInput && decInput.value) {
        state.currentInput = decInput.value;
        state.shouldResetDisplay = true;
        updateDisplay();
        closeModal('programmer-modal');
        showToast(`Значення ${decInput.value} вставлено`, '📥');
    }
}

