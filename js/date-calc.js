// ==========================================================================
// Калькулятор Дат
// ==========================================================================
function switchDateTab(tab) {
    state.activeDateTab = tab;
    document.querySelectorAll('.date-tabs button').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-dtab') === tab);
    });
    document.getElementById('date-section-diff').style.display = tab === 'diff' ? 'flex' : 'none';
    document.getElementById('date-section-add').style.display = tab === 'add' ? 'flex' : 'none';
}

function calculateDateDiff() {
    const d1 = new Date(document.getElementById('date-start').value);
    const d2 = new Date(document.getElementById('date-end').value);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return;

    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = (diffDays / 7).toFixed(1);
    const months = (diffDays / 30.44).toFixed(1);

    const resBox = document.getElementById('date-diff-result');
    if (resBox) {
        resBox.innerHTML = `<span>Різниця:</span> <strong>${diffDays} днів (~${weeks} тижнів / ~${months} міс.)</strong>`;
    }
}

function calculateDateAdd() {
    const base = new Date(document.getElementById('date-base').value);
    const days = parseInt(document.getElementById('date-days-count').value) || 0;
    if (isNaN(base.getTime())) return;

    const resultDate = new Date(base);
    resultDate.setDate(resultDate.getDate() + days);

    const formatted = resultDate.toLocaleDateString('uk-UA', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
    const resBox = document.getElementById('date-add-result');
    if (resBox) {
        resBox.innerHTML = `<span>Отримана дата:</span> <strong>${formatted}</strong>`;
    }
}

