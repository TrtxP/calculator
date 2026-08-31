// ==========================================================================
// Статистичний Модуль
// ==========================================================================
function calculateStatistics() {
    const raw = document.getElementById('stats-data-input').value;
    const nums = raw.split(/[\s,;]+/).map(Number).filter(n => !isNaN(n) && isFinite(n));

    if (nums.length === 0) {
        document.getElementById('stat-mean').innerText = '0';
        document.getElementById('stat-median').innerText = '0';
        document.getElementById('stat-mode').innerText = '0';
        document.getElementById('stat-sum').innerText = '0';
        document.getElementById('stat-std').innerText = '0';
        document.getElementById('stat-var').innerText = '0';
        document.getElementById('stat-min').innerText = '0';
        document.getElementById('stat-max').innerText = '0';
        return;
    }

    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / nums.length;
    state.statMeanVal = mean.toFixed(4);

    const sorted = [...nums].sort((a, b) => a - b);
    let median;
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        median = (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
        median = sorted[mid];
    }

    const counts = {};
    nums.forEach(n => counts[n] = (counts[n] || 0) + 1);
    let maxFreq = 0;
    let mode = nums[0];
    for (let k in counts) {
        if (counts[k] > maxFreq) {
            maxFreq = counts[k];
            mode = k;
        }
    }

    const variance = nums.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / nums.length;
    const stdDev = Math.sqrt(variance);

    document.getElementById('stat-mean').innerText = mean.toFixed(4);
    document.getElementById('stat-median').innerText = median.toFixed(4);
    document.getElementById('stat-mode').innerText = `${mode} (x${maxFreq})`;
    document.getElementById('stat-sum').innerText = sum.toFixed(2);
    document.getElementById('stat-std').innerText = stdDev.toFixed(4);
    document.getElementById('stat-var').innerText = variance.toFixed(4);
    document.getElementById('stat-min').innerText = Math.min(...nums);
    document.getElementById('stat-max').innerText = Math.max(...nums);
}

function insertStatMeanToCalc() {
    audio.playAction();
    state.currentInput = state.statMeanVal;
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('stats-modal');
    showToast(`Середнє (${state.statMeanVal}) вставлено`, '📊');
}

function clearStatsInput() {
    audio.playAction();
    document.getElementById('stats-data-input').value = '';
    calculateStatistics();
}

