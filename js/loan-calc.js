// ==========================================================================
// Іпотечний та Кредитний Калькулятор
// ==========================================================================
function calculateLoanAmortization() {
    const P = parseFloat(document.getElementById('loan-amount').value) || 0;
    const annualRate = parseFloat(document.getElementById('loan-rate').value) || 0;
    const n = parseInt(document.getElementById('loan-term').value, 10) || 1;
    const type = document.getElementById('loan-type').value;

    const monthlyEl = document.getElementById('loan-monthly-val');
    const interestEl = document.getElementById('loan-interest-val');
    const totalEl = document.getElementById('loan-total-val');
    const pctEl = document.getElementById('loan-pct-val');
    const tbody = document.getElementById('loan-table-tbody');

    if (P <= 0 || n <= 0) return;

    const r = annualRate / 100 / 12;
    let monthlyPay = 0;
    let totalPaid = 0;
    let totalInterest = 0;

    if (tbody) tbody.innerHTML = '';

    if (type === 'annuity') {
        if (r > 0) {
            monthlyPay = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        } else {
            monthlyPay = P / n;
        }
        totalPaid = monthlyPay * n;
        totalInterest = totalPaid - P;

        let balance = P;
        const previewLimit = Math.min(n, 24);
        for (let m = 1; m <= previewLimit; m++) {
            const interest = balance * r;
            const principal = monthlyPay - interest;
            balance = Math.max(0, balance - principal);

            if (tbody) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="text-align:center;">${m}</td>
                    <td>${monthlyPay.toFixed(2)}</td>
                    <td>${principal.toFixed(2)}</td>
                    <td>${interest.toFixed(2)}</td>
                    <td>${balance.toFixed(2)}</td>
                `;
                tbody.appendChild(tr);
            }
        }
    } else {
        const principalFixed = P / n;
        let balance = P;
        let firstMonthPay = 0;

        for (let m = 1; m <= n; m++) {
            const interest = balance * r;
            const pay = principalFixed + interest;
            if (m === 1) firstMonthPay = pay;
            totalPaid += pay;
            balance = Math.max(0, balance - principalFixed);

            if (tbody && m <= 24) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="text-align:center;">${m}</td>
                    <td>${pay.toFixed(2)}</td>
                    <td>${principalFixed.toFixed(2)}</td>
                    <td>${interest.toFixed(2)}</td>
                    <td>${balance.toFixed(2)}</td>
                `;
                tbody.appendChild(tr);
            }
        }
        totalInterest = totalPaid - P;
        monthlyPay = firstMonthPay;
    }

    state.loanResults.monthly = monthlyPay.toFixed(2);
    state.loanResults.total = totalPaid.toFixed(2);

    if (monthlyEl) monthlyEl.innerText = `${monthlyPay.toFixed(2)} ₴${type === 'diff' ? ' (1-й міс.)' : ''}`;
    if (interestEl) interestEl.innerText = `${totalInterest.toFixed(2)} ₴`;
    if (totalEl) totalEl.innerText = `${totalPaid.toFixed(2)} ₴`;
    if (pctEl) pctEl.innerText = `+${((totalInterest / P) * 100).toFixed(2)}%`;
}

function insertLoanMonthlyToCalc() {
    audio.playAction();
    state.currentInput = state.loanResults.monthly;
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('loan-calc-modal');
    showToast(`Платіж ${state.loanResults.monthly} ₴ вставлено`, '🏦');
}

function insertLoanTotalToCalc() {
    audio.playAction();
    state.currentInput = state.loanResults.total;
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('loan-calc-modal');
    showToast(`Загальну вартість ${state.loanResults.total} ₴ вставлено`, '🏦');
}

