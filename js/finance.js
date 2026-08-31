// ==========================================================================
// Фінансовий Калькулятор
// ==========================================================================
function calculateFinance() {
    const amount = parseFloat(document.getElementById('fin-amount').value) || 0;
    const discount = parseFloat(document.getElementById('fin-discount').value) || 0;
    const tax = parseFloat(document.getElementById('fin-tax').value) || 0;
    const tip = parseFloat(document.getElementById('fin-tip').value) || 0;

    const discounted = amount - (amount * (discount / 100));
    const taxVal = discounted * (tax / 100);
    const tipVal = discounted * (tip / 100);
    const total = discounted + taxVal + tipVal;

    document.getElementById('fin-discounted-val').innerText = `${discounted.toFixed(2)} ₴`;
    document.getElementById('fin-tax-val').innerText = `+ ${taxVal.toFixed(2)} ₴`;
    document.getElementById('fin-tip-val').innerText = `+ ${tipVal.toFixed(2)} ₴`;
    document.getElementById('fin-total-val').innerText = `${total.toFixed(2)} ₴`;
}

function insertFinanceToCalc() {
    audio.playAction();
    const amount = parseFloat(document.getElementById('fin-amount').value) || 0;
    const discount = parseFloat(document.getElementById('fin-discount').value) || 0;
    const tax = parseFloat(document.getElementById('fin-tax').value) || 0;
    const tip = parseFloat(document.getElementById('fin-tip').value) || 0;
    const discounted = amount - (amount * (discount / 100));
    const total = (discounted + discounted * (tax / 100) + discounted * (tip / 100)).toFixed(2);

    state.currentInput = total.toString();
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('finance-modal');
    showToast(`Суму ${total} ₴ вставлено`, '💰');
}

function copyFinanceTotal() {
    const totalEl = document.getElementById('fin-total-val');
    if (totalEl) {
        audio.playAction();
        navigator.clipboard.writeText(totalEl.innerText);
        showToast(`Скопійовано: ${totalEl.innerText}`, '📋');
    }
}

