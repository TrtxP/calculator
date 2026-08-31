// ==========================================================================
// Розумний Математичний Порадник
// ==========================================================================
function triggerMathAdvisor(errorType, contextVal = {}) {
    audio.playError();

    const diagIcon = document.getElementById('error-diag-icon');
    const diagTitle = document.getElementById('error-diag-title');
    const diagRule = document.getElementById('error-diag-rule');
    const diagExpl = document.getElementById('error-diag-explanation');
    const diagRemedy = document.getElementById('error-diag-remedy');
    const actionsContainer = document.getElementById('error-actions-container');

    if (!actionsContainer) return;
    actionsContainer.innerHTML = '';

    let title = 'Заборонена математична дія!';
    let icon = '⚠️';
    let rule = '';
    let explanation = '';
    let remedy = '';
    let quickActions = [];

    switch (errorType) {
        case 'zero_division':
            icon = '🚫';
            title = 'Ділення на нуль неможливе!';
            rule = 'Ділення на 0 (або mod 0) є забороненою операцією в арифметиці.';
            explanation = 'Ділення a ÷ b = c означає пошук c, для якого c × b = a. При b = 0 результат c × 0 завжди 0, тому для ненульового a результату не існує.';
            remedy = 'Замініть дільник на будь-яке ненульове число або візьміть наближення 0.0001.';
            quickActions = [
                {
                    text: '🔧 Замінити знаменник на 1',
                    handler: () => {
                        state.currentInput = '1';
                        state.shouldResetDisplay = false;
                        updateDisplay();
                        closeModal('error-advisor-modal');
                        calculate();
                        showToast('Знаменник замінено на 1', '✅');
                    }
                },
                {
                    text: '🔬 Наближення (0.0001)',
                    handler: () => {
                        state.currentInput = '0.0001';
                        state.shouldResetDisplay = false;
                        updateDisplay();
                        closeModal('error-advisor-modal');
                        calculate();
                        showToast('Застосовано наближення (0.0001)', '🔬');
                    }
                }
            ];
            break;

        case 'negative_sqrt':
            icon = '📐';
            title = 'Корінь з від\'ємного числа!';
            rule = 'Корінь парного степеня з від\'ємного числа (√-x) не існує в ℝ.';
            explanation = `Число ${contextVal.val || 'x'} < 0. Квадрат будь-якого дійсного числа невід'ємний.`;
            remedy = 'Візьміть модуль |x| або перейдіть до комплексних чисел.';
            quickActions = [
                {
                    text: '⚡ Застосувати модуль |x| та обчислити √|x|',
                    handler: () => {
                        const num = Math.abs(parseFloat(state.currentInput) || 0);
                        const res = Math.sqrt(num);
                        const formatted = formatResult(res);
                        addToHistory(`√|${state.currentInput}|`, formatted);
                        state.currentInput = formatted;
                        state.shouldResetDisplay = true;
                        updateDisplay();
                        closeModal('error-advisor-modal');
                        showToast(`Обчислено: √${num} = ${formatted}`, '✅');
                    }
                }
            ];
            break;

        case 'invalid_log':
            icon = '📉';
            title = 'Логарифм недопустимого аргументу!';
            rule = 'Логарифми ln(x) та log(x) визначені виключно для x > 0.';
            explanation = 'Основа степеня додатна, тому результат піднесення до степеня ніколи не може бути ≤ 0.';
            remedy = 'Застосуйте модуль |x| або зробіть аргумент строго додатним.';
            quickActions = [
                {
                    text: '⚡ Взяти модуль |x| для логарифма',
                    handler: () => {
                        const num = Math.abs(parseFloat(state.currentInput) || 1);
                        const safeNum = num === 0 ? 1 : num;
                        const res = Math.log(safeNum);
                        const formatted = formatResult(res);
                        addToHistory(`ln(|${state.currentInput}|)`, formatted);
                        state.currentInput = formatted;
                        state.shouldResetDisplay = true;
                        updateDisplay();
                        closeModal('error-advisor-modal');
                        showToast(`Обчислено ln(|${safeNum}|) = ${formatted}`, '✅');
                    }
                }
            ];
            break;

        case 'invalid_asin_acos':
            icon = '⭕';
            title = 'Аргумент поза діапазоном [-1, 1]!';
            rule = 'Функції asin та acos визначені лише для чисел у проміжку від -1 до 1.';
            explanation = `Значення ${contextVal.val || 'x'} виходить за межі одиничного кола.`;
            remedy = 'Обмежте число до максимуму 1.0 або -1.0.';
            quickActions = [
                {
                    text: '🔧 Обмежити до 1.0',
                    handler: () => {
                        state.currentInput = '1';
                        state.shouldResetDisplay = false;
                        updateDisplay();
                        closeModal('error-advisor-modal');
                        handleTrigOrSecondary('sin');
                    }
                }
            ];
            break;

        case 'tan_90':
            icon = '📐';
            title = 'Тангенс 90° (асимптота)!';
            rule = 'Тангенс 90° та 270° прямує до нескінченності.';
            explanation = 'cos(90°) = 0, тому tan(90°) = sin/0 (розрив).';
            remedy = 'Використовуйте апроксимацію 89.999°.';
            quickActions = [
                {
                    text: '🔬 Змінити на 89.999°',
                    handler: () => {
                        state.currentInput = '89.999';
                        state.shouldResetDisplay = false;
                        updateDisplay();
                        closeModal('error-advisor-modal');
                        handleTrigOrSecondary('tan');
                    }
                }
            ];
            break;

        case 'invalid_factorial':
            icon = '❗';
            title = 'Факторіал від\'ємного чи дробу!';
            rule = 'Факторіал n! визначений лише для цілих невід\'ємних чисел.';
            explanation = 'Факторіал — дискретний добуток послідовних цілих чисел 1 × 2 × ... × n.';
            remedy = 'Округліть число до цілого додатного.';
            quickActions = [
                {
                    text: '⚡ Округлити до цілого',
                    handler: () => {
                        const num = Math.abs(Math.round(parseFloat(state.currentInput) || 0));
                        state.currentInput = num.toString();
                        state.shouldResetDisplay = false;
                        updateDisplay();
                        closeModal('error-advisor-modal');
                        calculateFactorial();
                    }
                }
            ];
            break;
    }

    if (diagIcon) diagIcon.innerText = icon;
    if (diagTitle) diagTitle.innerText = title;
    if (diagRule) diagRule.innerText = rule;
    if (diagExpl) diagExpl.innerText = explanation;
    if (diagRemedy) diagRemedy.innerText = remedy;

    quickActions.forEach(act => {
        const btn = document.createElement('button');
        btn.innerText = act.text;
        btn.onclick = act.handler;
        actionsContainer.appendChild(btn);
    });

    openModal('error-advisor-modal');
}

function toggleAccordion(headerEl) {
    const item = headerEl.parentElement;
    item.classList.toggle('active');
}

