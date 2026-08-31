// ==========================================================================
// Блокнот Обраних Виразів (Bookmarks)
// ==========================================================================
function renderBookmarks() {
    const container = document.getElementById('bookmarks-list-box');
    if (!container) return;

    if (state.bookmarks.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:20px;">Блокнот порожній. Додайте важливі числа або формули.</div>';
        return;
    }

    container.innerHTML = '';
    state.bookmarks.forEach((bm, idx) => {
        const card = document.createElement('div');
        card.className = 'bookmark-card';
        card.innerHTML = `
            <div class="bookmark-card-body">
                <span class="bookmark-tag-chip">${escapeHtml(bm.tag || 'Збережено')}</span>
                <div style="font-weight:700; color:var(--text-primary); font-size:0.9rem; line-height:1.35;">${escapeHtml(bm.title)}</div>
                <div class="bookmark-card-value">${escapeHtml(bm.val)}</div>
            </div>
            <div class="bookmark-actions">
                <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem;" title="Вставити в калькулятор">📥 Вставити</button>
                <button class="btn-secondary btn-danger" style="padding:4px 8px; font-size:0.75rem;">🗑️</button>
            </div>
        `;
        // Обробники через замикання замість inline onclick з інтерполяцією
        // значень користувача (захист від ін'єкції в HTML-атрибут)
        const insertBtn = card.querySelector('.bookmark-actions .btn-secondary:not(.btn-danger)');
        const deleteBtn = card.querySelector('.bookmark-actions .btn-danger');
        if (insertBtn) insertBtn.onclick = () => insertBookmarkVal(bm.val);
        if (deleteBtn) deleteBtn.onclick = () => deleteBookmark(bm.id);
        container.appendChild(card);
    });
}

function addCurrentAsBookmark() {
    const titleInp = document.getElementById('bm-title-input');
    const valInp = document.getElementById('bm-val-input');
    const title = titleInp ? titleInp.value.trim() || 'Користувацький запис' : 'Запис';
    const val = (valInp && valInp.value.trim()) ? valInp.value.trim() : state.currentInput;

    audio.playAction();
    state.bookmarks.unshift({
        id: Date.now(),
        title,
        val,
        tag: 'Мій запис'
    });
    localStorage.setItem('calc_bookmarks', JSON.stringify(state.bookmarks));
    if (titleInp) titleInp.value = '';
    if (valInp) valInp.value = '';
    renderBookmarks();
    showToast(`Запис "${title}" додано до блокнота`, '🔖');
}

function insertBookmarkVal(val) {
    audio.playAction();
    state.currentInput = val.toString();
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('bookmarks-modal');
    showToast(`Значення ${val} вставлено`, '📥');
}

function deleteBookmark(id) {
    audio.playAction();
    state.bookmarks = state.bookmarks.filter(b => b.id !== id);
    localStorage.setItem('calc_bookmarks', JSON.stringify(state.bookmarks));
    renderBookmarks();
    showToast('Запис видалено', '🗑️');
}

function clearAllBookmarks() {
    audio.playAction();
    state.bookmarks = [];
    localStorage.removeItem('calc_bookmarks');
    renderBookmarks();
    showToast('Блокнот очищено', '🧹');
}

