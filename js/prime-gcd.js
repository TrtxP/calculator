// ==========================================================================
// НСД, НСК та Прості Множники
// ==========================================================================
function solvePrimeFactorization() {
    const numInput = document.getElementById('prime-num-input');
    if (!numInput) return;
    let n = Math.abs(parseInt(numInput.value, 10)) || 0;

    const factorResEl = document.getElementById('prime-factor-res');
    const isPrimeBadge = document.getElementById('prime-is-prime-badge');
    const countEl = document.getElementById('divisors-count');
    const chipsList = document.getElementById('divisors-chips-list');

    if (n <= 0) {
        if (factorResEl) factorResEl.innerText = 'Введіть число > 0';
        return;
    }
    if (n === 1) {
        if (factorResEl) factorResEl.innerText = '1 (не є ні простим, ні складеним)';
        if (isPrimeBadge) isPrimeBadge.innerText = 'Одиничне число';
        if (countEl) countEl.innerText = '1';
        if (chipsList) chipsList.innerHTML = '<span class="div-chip">1</span>';
        return;
    }

    let temp = n;
    const factors = {};
    for (let d = 2; d * d <= temp; d++) {
        while (temp % d === 0) {
            factors[d] = (factors[d] || 0) + 1;
            temp /= d;
        }
    }
    if (temp > 1) {
        factors[temp] = (factors[temp] || 0) + 1;
    }

    const factorParts = [];
    const supMap = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    for (let prime in factors) {
        const pwr = factors[prime];
        if (pwr === 1) {
            factorParts.push(prime);
        } else {
            const pwrStr = pwr.toString().split('').map(c => supMap[c] || c).join('');
            factorParts.push(`${prime}${pwrStr}`);
        }
    }

    if (factorResEl) factorResEl.innerText = factorParts.join(' × ');

    const isPrime = Object.keys(factors).length === 1 && factors[Object.keys(factors)[0]] === 1;
    if (isPrimeBadge) {
        isPrimeBadge.innerText = isPrime ? '⭐ Просте число' : 'Складене число';
        isPrimeBadge.style.color = isPrime ? 'var(--accent-equals)' : 'var(--accent-operator)';
    }

    const divisors = [];
    for (let i = 1; i * i <= n; i++) {
        if (n % i === 0) {
            divisors.push(i);
            if (i * i !== n) divisors.push(n / i);
        }
    }
    divisors.sort((a, b) => a - b);

    if (countEl) countEl.innerText = divisors.length;
    if (chipsList) {
        chipsList.innerHTML = '';
        divisors.forEach(d => {
            const chip = document.createElement('span');
            chip.className = 'div-chip';
            chip.innerText = d;
            chip.title = 'Клікніть, щоб вставити в калькулятор';
            chip.onclick = () => {
                insertTapeValToCalc(d);
                closeModal('prime-gcd-modal');
            };
            chipsList.appendChild(chip);
        });
    }
}

function setPrimeFromCalc() {
    audio.playAction();
    const num = Math.abs(parseInt(state.currentInput, 10)) || 100;
    const inp = document.getElementById('prime-num-input');
    if (inp) {
        inp.value = num;
        solvePrimeFactorization();
    }
}

function solveGcdLcm() {
    let a = Math.abs(parseInt(document.getElementById('gcd-num-a').value, 10)) || 0;
    let b = Math.abs(parseInt(document.getElementById('gcd-num-b').value, 10)) || 0;

    const gcdEl = document.getElementById('gcd-val-res');
    const lcmEl = document.getElementById('lcm-val-res');
    const stepsEl = document.getElementById('euclid-steps-count');

    if (a === 0 || b === 0) {
        const gcd = a || b;
        state.gcdVal = gcd.toString();
        state.lcmVal = '0';
        if (gcdEl) gcdEl.innerText = gcd;
        if (lcmEl) lcmEl.innerText = '0';
        if (stepsEl) stepsEl.innerText = '1 крок';
        return;
    }

    let origA = a, origB = b;
    let steps = 0;
    while (b !== 0) {
        steps++;
        let t = b;
        b = a % b;
        a = t;
    }
    const gcd = a;
    const lcm = (origA * origB) / gcd;

    state.gcdVal = gcd.toString();
    state.lcmVal = lcm.toString();

    if (gcdEl) gcdEl.innerText = gcd;
    if (lcmEl) lcmEl.innerText = lcm;
    if (stepsEl) stepsEl.innerText = `${steps} кроки за алгоритмом Евкліда`;
}

function insertGcdToCalc() {
    audio.playAction();
    state.currentInput = state.gcdVal;
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('prime-gcd-modal');
    showToast(`НСД = ${state.gcdVal} вставлено`, '🔢');
}

function insertLcmToCalc() {
    audio.playAction();
    state.currentInput = state.lcmVal;
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('prime-gcd-modal');
    showToast(`НСК = ${state.lcmVal} вставлено`, '🔢');
}

