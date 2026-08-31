// ==========================================================================
// Розрахункова Стрічка (Paper Tape Roll)
// ==========================================================================
function addTapeEntry(equation, result, note = '') {
    const entry = {
        id: Date.now() + Math.random(),
        equation,
        result,
        note,
        time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
    };
    state.tapeEntries.unshift(entry);
    if (state.tapeEntries.length > 50) state.tapeEntries.pop();
    localStorage.setItem('calc_tape', JSON.stringify(state.tapeEntries));
    renderTapeRoll();
}

function renderTapeRoll() {
    const container = document.getElementById('tape-lines-list');
    const totalEl = document.getElementById('tape-grand-total');
    if (!container) return;

    if (state.tapeEntries.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:#9ca3af; padding:16px;">Стрічка чиста. Виконайте розрахунки.</div>';
        if (totalEl) totalEl.innerText = '0.00';
        return;
    }

    container.innerHTML = '';
    let grandSum = 0;

    state.tapeEntries.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'tape-line-item';
        const parsed = parseFloat(item.result) || 0;
        grandSum += parsed;

        row.innerHTML = `
            <div style="flex-grow:1;">
                <div class="tape-line-eq">${escapeHtml(item.equation)} = <strong>${escapeHtml(item.result)}</strong></div>
                <small style="color:#6b7280; font-size:0.72rem;">[${escapeHtml(item.time)}]</small>
            </div>
            <input type="text" class="tape-line-note-input" placeholder="Додати нотатку..." onchange="updateTapeNote(${idx}, this.value)">
            <button class="btn-secondary" style="padding:2px 6px; font-size:0.75rem;" title="Вставити в калькулятор">📥</button>
        `;
        // Нотатку та обробник кнопки встановлюємо без HTML-інтерполяції
        // (захист від ін'єкції в атрибут value та onclick)
        row.querySelector('.tape-line-note-input').value = item.note || '';
        row.querySelector('.btn-secondary').onclick = () => insertTapeValToCalc(item.result);
        container.appendChild(row);
    });

    if (totalEl) totalEl.innerText = grandSum.toFixed(2);
}

function updateTapeNote(idx, val) {
    if (state.tapeEntries[idx]) {
        state.tapeEntries[idx].note = val;
        localStorage.setItem('calc_tape', JSON.stringify(state.tapeEntries));
    }
}

function insertTapeValToCalc(val) {
    audio.playAction();
    state.currentInput = val.toString();
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('tape-modal');
    showToast(`Значення ${val} вставлено`, '📥');
}

function addCustomTapeEntry() {
    audio.playAction();
    const val = state.currentInput || '0';
    addTapeEntry(`Введення`, val, 'Ручний запис');
    showToast('Рядок додано до стрічки', '📜');
}

function printTapeRoll() {
    audio.playAction();
    window.print();
}

function copyTapeAsText() {
    audio.playAction();
    let text = `=== РОЗРАХУНКОВИЙ ЧЕК PRO v1.8.4 ===\nДата: ${new Date().toLocaleString('uk-UA')}\n------------------------------------\n`;
    let sum = 0;
    state.tapeEntries.forEach((it, i) => {
        text += `${i + 1}. ${it.equation} = ${it.result} ${it.note ? '(' + it.note + ')' : ''}\n`;
        sum += parseFloat(it.result) || 0;
    });
    text += `------------------------------------\nЗАГАЛЬНИЙ ПІДСУМОК: ${sum.toFixed(2)}\n`;
    navigator.clipboard.writeText(text);
    showToast('Розрахунковий чек скопійовано', '📋');
}

function clearTapeRoll() {
    audio.playAction();
    state.tapeEntries = [];
    localStorage.removeItem('calc_tape');
    renderTapeRoll();
    showToast('Розрахункову стрічку очищено', '🗑️');
}

