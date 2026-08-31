// ==========================================================================
// 2. НОВЕ v1.8.4: Розширена База Наукових Констант (40+)
// ==========================================================================
function renderExtendedConstants(filterText = '', category = state.activeConstantsCat) {
    const list = document.getElementById('constants-extended-list');
    if (!list) return;

    const q = filterText.trim().toLowerCase();
    const items = EXTENDED_CONSTANTS.filter(c => {
        const matchesCat = category === 'all' || c.cat === category;
        const matchesQ = !q || c.name.toLowerCase().includes(q) || c.sym.toLowerCase().includes(q) || c.val.includes(q);
        return matchesCat && matchesQ;
    });

    if (items.length === 0) {
        list.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:var(--text-muted); padding:20px;">Констант не знайдено за вашим запитом.</div>';
        return;
    }

    list.innerHTML = '';
    items.forEach(c => {
        const card = document.createElement('div');
        card.className = 'const-ext-card';
        card.innerHTML = `
            <div class="const-ext-sym">${c.sym}</div>
            <div class="const-ext-info">
                <strong>${c.name}</strong>
                <span>${c.val} ${c.unit !== '—' ? c.unit : ''}</span>
            </div>
            <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem;" title="Вставити в калькулятор">📥</button>
        `;
        card.onclick = () => {
            insertExtConstant(c.val, c.sym);
        };
        list.appendChild(card);
    });
}

function filterExtendedConstants(val) {
    renderExtendedConstants(val, state.activeConstantsCat);
}

function switchConstantsCategory(cat) {
    state.activeConstantsCat = cat;
    document.querySelectorAll('.constants-tabs-row .conv-tab').forEach(t => {
        t.classList.toggle('active', t.getAttribute('data-ccat') === cat);
    });
    const inp = document.getElementById('const-search-inp');
    renderExtendedConstants(inp ? inp.value : '', cat);
}

function insertExtConstant(val, sym) {
    audio.playAction();
    state.currentInput = val;
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('constants-search-modal');
    showToast(`Константу ${sym} (${val}) вставлено`, '⚛️');
}
