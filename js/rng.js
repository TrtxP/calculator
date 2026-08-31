// ==========================================================================
// RNG & Кубики
// ==========================================================================
function generateRandomNumber() {
    audio.playAction();
    const min = parseInt(document.getElementById('rng-min').value) || 1;
    const max = parseInt(document.getElementById('rng-max').value) || 100;
    if (min >= max) {
        showToast('Min має бути меншим за Max', '⚠️');
        return;
    }
    const res = Math.floor(Math.random() * (max - min + 1)) + min;
    const el = document.getElementById('rng-result');
    if (el) el.innerText = res;
    showToast(`Згенеровано: ${res}`, '🎲');
}

function rollDice(sides) {
    audio.playAction();
    const res = Math.floor(Math.random() * sides) + 1;
    const el = document.getElementById('rng-result');
    if (el) el.innerText = `d${sides}: ${res}`;
    showToast(`Кидок d${sides}: ${res}`, '🎲');
}

function flipCoin() {
    audio.playAction();
    const res = Math.random() < 0.5 ? '🪙 Орел' : '🪙 Решка';
    const el = document.getElementById('rng-result');
    if (el) el.innerText = res;
    showToast(`Результат: ${res}`, '🪙');
}

function insertRngToCalc() {
    audio.playAction();
    const el = document.getElementById('rng-result');
    if (el) {
        const num = el.innerText.replace(/[^\d]/g, '');
        if (num) {
            state.currentInput = num;
            state.shouldResetDisplay = true;
            updateDisplay();
            closeModal('rng-modal');
            showToast(`Значення ${num} вставлено`, '📥');
        }
    }
}

