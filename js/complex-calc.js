// ==========================================================================
// НОВЕ v1.8.5: Комплексні Числа ℂ (Complex Numbers)
// ==========================================================================
function solveComplexMath() {
    const a = parseFloat(document.getElementById('cplx-a')?.value) || 0;
    const b = parseFloat(document.getElementById('cplx-b')?.value) || 0;
    const c = parseFloat(document.getElementById('cplx-c')?.value) || 0;
    const d = parseFloat(document.getElementById('cplx-d')?.value) || 0;

    // Сума (a+c) + (b+d)i
    const sumR = a + c;
    const sumI = b + d;

    // Різниця (a-c) + (b-d)i
    const diffR = a - c;
    const diffI = b - d;

    // Добуток (ac - bd) + (ad + bc)i
    const mulR = (a * c) - (b * d);
    const mulI = (a * d) + (b * c);

    // Частка
    const denom = (c * c) + (d * d);
    let divR = 0, divI = 0;
    if (denom !== 0) {
        divR = ((a * c) + (b * d)) / denom;
        divI = ((b * c) - (a * d)) / denom;
    }

    // Модуль |z1|
    const mod1 = Math.sqrt(a * a + b * b);

    // Аргумент arg(z1)
    const arg1Rad = Math.atan2(b, a);
    const arg1Deg = arg1Rad * (180 / Math.PI);

    const fmtCplx = (r, i) => {
        const sign = i >= 0 ? '+' : '-';
        return `${r.toFixed(2)} ${sign} ${Math.abs(i).toFixed(2)}i`;
    };

    state.complexResults = {
        add: fmtCplx(sumR, sumI),
        sub: fmtCplx(diffR, diffI),
        mul: fmtCplx(mulR, mulI),
        div: denom !== 0 ? fmtCplx(divR, divI) : 'Ділення на 0',
        mod1: mod1.toFixed(3),
        arg1: `${arg1Deg.toFixed(1)}° (${arg1Rad.toFixed(2)} rad)`
    };

    const addEl = document.getElementById('cplx-res-add');
    const subEl = document.getElementById('cplx-res-sub');
    const mulEl = document.getElementById('cplx-res-mul');
    const divEl = document.getElementById('cplx-res-div');
    const modEl = document.getElementById('cplx-res-mod1');
    const argEl = document.getElementById('cplx-res-arg1');

    if (addEl) addEl.innerText = state.complexResults.add;
    if (subEl) subEl.innerText = state.complexResults.sub;
    if (mulEl) mulEl.innerText = state.complexResults.mul;
    if (divEl) divEl.innerText = state.complexResults.div;
    if (modEl) modEl.innerText = state.complexResults.mod1;
    if (argEl) argEl.innerText = state.complexResults.arg1;
}

function insertComplexModToCalc() {
    audio.playAction();
    state.currentInput = state.complexResults.mod1;
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('complex-calc-modal');
    showToast(`Модуль |z₁| = ${state.complexResults.mod1} вставлено`, '⚛️');
}

