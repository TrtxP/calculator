// ==========================================================================
// Історія та Експорт
// ==========================================================================
function addToHistory(equation, result) {
    const item = {
        equation,
        result,
        time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    state.history.unshift(item);
    if (state.history.length > 100) state.history.pop();
    localStorage.setItem('calc_history', JSON.stringify(state.history));
    renderHistory();
}

function renderHistory(items = state.history) {
    if (!dom.historyList) return;
    if (items.length === 0) {
        dom.historyList.innerHTML = '<li style="text-align:center; color: var(--text-muted); padding: 20px;">Історія порожня</li>';
        return;
    }

    dom.historyList.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.title = 'Натисніть, щоб підставити результат у калькулятор';
        li.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="calc-eq">${item.equation} =</span>
                <span style="font-size:0.75rem; color:var(--text-muted);">${item.time || ''}</span>
            </div>
            <div class="calc-res">${formatDisplayString(item.result)}</div>
        `;
        li.onclick = () => {
            audio.playClick();
            state.currentInput = item.result;
            state.shouldResetDisplay = true;
            updateDisplay();
            closeModal('history-modal');
            showToast(`Значення ${item.result} підставлено`, '📋');
        };
        dom.historyList.appendChild(li);
    });
}

function filterHistory(query) {
    const q = query.trim().toLowerCase();
    if (!q) { renderHistory(); return; }
    const filtered = state.history.filter(item =>
        item.equation.toLowerCase().includes(q) ||
        item.result.toLowerCase().includes(q)
    );
    renderHistory(filtered);
}

function clearHistory() {
    audio.playAction();
    state.history = [];
    localStorage.removeItem('calc_history');
    renderHistory();
    showToast('Історію очищено', '🗑️');
}

function exportHistoryFormat(format) {
    audio.playAction();
    if (state.history.length === 0) {
        showToast('Історія порожня для експорту', '⚠️');
        return;
    }

    let content = '';
    let mimeType = 'text/plain;charset=utf-8';
    let fileExt = 'txt';
    const dateStr = new Date().toISOString().slice(0, 10);

    if (format === 'csv') {
        mimeType = 'text/csv;charset=utf-8';
        fileExt = 'csv';
        content = "Час,Вираз,Результат\n";
        state.history.forEach(item => {
            content += `"${item.time || ''}","${item.equation}","${item.result}"\n`;
        });
    } else if (format === 'json') {
        mimeType = 'application/json;charset=utf-8';
        fileExt = 'json';
        content = JSON.stringify({
            application: "Calculator Pro v1.8.5 (Build 190) Redstone 3.5 Bordeaux Titanium Edition",
            exportedAt: new Date().toISOString(),
            author: "MaxNT Official, 2026",
            totalRecords: state.history.length,
            records: state.history
        }, null, 2);
    } else {
        content = `====================================================\n`;
        content += `  КАЛЬКУЛЯТОР PRO v1.8.5 (Build 190) Redstone 3.5 Bordeaux - ІСТОРІЯ\n`;
        content += `  Дата експорту: ${new Date().toLocaleString('uk-UA')}\n`;
        content += `  Автор: MaxNT Official, 2026\n`;
        content += `====================================================\n\n`;

        state.history.forEach((item, index) => {
            content += `[${item.time || '00:00'}] ${index + 1}. ${item.equation} = ${item.result}\n`;
        });
        content += `\nВсього операцій: ${state.history.length}\n`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Calculator_History_v1.8.5_${dateStr}.${fileExt}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    closeModal('export-modal');
    showToast(`Історію експортовано у формат .${fileExt}`, '📥');
}

function copyToClipboard() {
    if (isNaN(parseFloat(state.currentInput))) return;
    audio.playAction();
    navigator.clipboard.writeText(state.currentInput).then(() => {
        showToast(`Скопійовано: ${state.currentInput}`, '📋');
        if (dom.display) {
            const originalColor = dom.display.style.color;
            dom.display.style.color = "var(--accent-operator)";
            setTimeout(() => { dom.display.style.color = originalColor; }, 500);
        }
    }).catch(() => {
        showToast('Не вдалося скопіювати', '❌');
    });
}

function showToast(message, icon = 'ℹ️') {
    if (!dom.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    dom.toastContainer.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 2400);
}

