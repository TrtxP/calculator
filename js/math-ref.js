// ==========================================================================
// НОВЕ v1.8.5: Інтерактивний Математичний Довідник Формул
// ==========================================================================
function switchMathRefTab(tabKey) {
    audio.playClick(600);
    state.activeMathRefTab = tabKey;
    document.querySelectorAll('[data-rtab]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-rtab') === tabKey);
    });
    renderMathRefList();
}

function renderMathRefList() {
    const container = document.getElementById('math-ref-container');
    if (!container) return;

    const list = MATH_REFERENCE_DATA[state.activeMathRefTab] || [];
    container.innerHTML = '';

    list.forEach(item => {
        const card = document.createElement('div');
        card.className = 'math-ref-item';
        card.innerHTML = `
            <div>
                <div class="math-ref-title">${item.title}</div>
                <div class="math-ref-formula">${item.formula}</div>
            </div>
            <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="copyFormulaText('${item.formula.replace(/'/g, "\\'")}')">📋 Копіювати</button>
        `;
        container.appendChild(card);
    });
}

function copyFormulaText(formula) {
    audio.playAction();
    navigator.clipboard.writeText(formula).then(() => {
        showToast(`Формулу скопійовано: ${formula}`, '📋');
    });
}

