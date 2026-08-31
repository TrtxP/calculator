// ==========================================================================
// Порівняння Цін за Одиницю
// ==========================================================================
function calculateUnitDeal() {
    const pA = parseFloat(document.getElementById('deal-a-price').value) || 0;
    const qA = parseFloat(document.getElementById('deal-a-qty').value) || 1;
    const uA = document.getElementById('deal-a-unit').value;

    const pB = parseFloat(document.getElementById('deal-b-price').value) || 0;
    const qB = parseFloat(document.getElementById('deal-b-qty').value) || 1;
    const uB = document.getElementById('deal-b-unit').value;

    const factorMap = { g: 0.001, kg: 1.0, ml: 0.001, l: 1.0, pcs: 1.0 };
    const normA = qA * (factorMap[uA] || 1.0);
    const normB = qB * (factorMap[uB] || 1.0);

    const unitPriceA = normA > 0 ? (pA / normA) : 0;
    const unitPriceB = normB > 0 ? (pB / normB) : 0;

    const resAEl = document.getElementById('deal-a-unit-price');
    const resBEl = document.getElementById('deal-b-unit-price');
    const cardA = document.getElementById('deal-card-a');
    const cardB = document.getElementById('deal-card-b');
    const winText = document.getElementById('deal-winner-text');
    const saveDetail = document.getElementById('deal-savings-detail');

    if (resAEl) resAEl.innerText = `${unitPriceA.toFixed(2)} ₴`;
    if (resBEl) resBEl.innerText = `${unitPriceB.toFixed(2)} ₴`;

    if (cardA) cardA.classList.remove('winner');
    if (cardB) cardB.classList.remove('winner');

    if (unitPriceA <= 0 || unitPriceB <= 0) {
        if (winText) winText.innerText = 'Введіть коректні ціни та об\'єми';
        return;
    }

    if (Math.abs(unitPriceA - unitPriceB) < 0.01) {
        if (winText) winText.innerText = 'Обидва варіанти однаково вигідні!';
        if (saveDetail) saveDetail.innerText = 'Ціна за 1 одиницю повністю ідентична.';
    } else if (unitPriceA < unitPriceB) {
        if (cardA) cardA.classList.add('winner');
        const diff = unitPriceB - unitPriceA;
        const pct = ((unitPriceB - unitPriceA) / unitPriceB) * 100;
        if (winText) winText.innerText = `Товар А вигідніший на ${pct.toFixed(2)}%!`;
        if (saveDetail) saveDetail.innerText = `Економія становить ${diff.toFixed(2)} ₴ на кожній базовій одиниці (1 кг/л/од).`;
    } else {
        if (cardB) cardB.classList.add('winner');
        const diff = unitPriceA - unitPriceB;
        const pct = ((unitPriceA - unitPriceB) / unitPriceA) * 100;
        if (winText) winText.innerText = `Товар B вигідніший на ${pct.toFixed(2)}%!`;
        if (saveDetail) saveDetail.innerText = `Економія становить ${diff.toFixed(2)} ₴ на кожній базовій одиниці (1 кг/л/од).`;
    }
}

