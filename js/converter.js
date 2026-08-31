// ==========================================================================
// Універсальний Конвертер Величин
// ==========================================================================
const convUnits = {
    length: {
        units: ['m', 'km', 'cm', 'mm', 'mi', 'yd', 'ft', 'in'],
        names: { m: 'Метри (m)', km: 'Кілометри (km)', cm: 'Сантиметри (cm)', mm: 'Міліметри (mm)', mi: 'Милі (mi)', yd: 'Ярди (yd)', ft: 'Фути (ft)', in: 'Дюйми (in)' },
        toBase: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 }
    },
    weight: {
        units: ['kg', 'g', 'mg', 'lb', 'oz', 'ton'],
        names: { kg: 'Кілограми (kg)', g: 'Грами (g)', mg: 'Міліграми (mg)', lb: 'Фунти (lb)', oz: 'Унції (oz)', ton: 'Метричні тонни' },
        toBase: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.0283495, ton: 1000 }
    },
    temp: {
        units: ['C', 'F', 'K'],
        names: { C: 'Цельсій (°C)', F: 'Фаренгейт (°F)', K: 'Кельвін (K)' }
    },
    data: {
        units: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
        names: { B: 'Байти (B)', KB: 'Кілобайти (KB)', MB: 'Мегабайти (MB)', GB: 'Гігабайти (GB)', TB: 'Терабайти (TB)', PB: 'Петабайти (PB)' },
        toBase: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776, PB: 1125899906842624 }
    },
    speed: {
        units: ['kmh', 'ms', 'mph', 'knot'],
        names: { kmh: 'км/год (km/h)', ms: 'м/с (m/s)', mph: 'миль/год (mph)', knot: 'Вузли (knot)' },
        toBase: { kmh: 1, ms: 3.6, mph: 1.609344, knot: 1.852 }
    },
    time: {
        units: ['s', 'min', 'hr', 'day', 'week', 'yr'],
        names: { s: 'Секунди (s)', min: 'Хвилини (min)', hr: 'Години (hr)', day: 'Дні (day)', week: 'Тижні (week)', yr: 'Роки (yr)' },
        toBase: { s: 1, min: 60, hr: 3600, day: 86400, week: 604800, yr: 31536000 }
    }
};

let currentConvCat = 'length';

function switchConverterCategory(cat) {
    currentConvCat = cat;
    document.querySelectorAll('.conv-tab').forEach(t => {
        t.classList.toggle('active', t.getAttribute('data-cat') === cat);
    });

    const fromSel = document.getElementById('conv-from-unit');
    const toSel = document.getElementById('conv-to-unit');
    if (!fromSel || !toSel) return;

    fromSel.innerHTML = '';
    toSel.innerHTML = '';

    const catData = convUnits[cat];
    catData.units.forEach((u) => {
        const o1 = document.createElement('option');
        o1.value = u;
        o1.innerText = catData.names[u];
        fromSel.appendChild(o1);

        const o2 = document.createElement('option');
        o2.value = u;
        o2.innerText = catData.names[u];
        toSel.appendChild(o2);
    });

    if (catData.units.length > 1) toSel.selectedIndex = 1;
    runConversion('from');
}

function runConversion(direction = 'from') {
    const fromSel = document.getElementById('conv-from-unit');
    const toSel = document.getElementById('conv-to-unit');
    const fromInput = document.getElementById('conv-from-val');
    const toInput = document.getElementById('conv-to-val');
    if (!fromSel || !toSel || !fromInput || !toInput) return;

    const uFrom = fromSel.value;
    const uTo = toSel.value;
    const catData = convUnits[currentConvCat];

    if (currentConvCat === 'temp') {
        if (direction === 'from') {
            const val = parseFloat(fromInput.value) || 0;
            let c;
            if (uFrom === 'C') c = val;
            else if (uFrom === 'F') c = (val - 32) * (5 / 9);
            else if (uFrom === 'K') c = val - 273.15;

            let res;
            if (uTo === 'C') res = c;
            else if (uTo === 'F') res = (c * (9 / 5)) + 32;
            else if (uTo === 'K') res = c + 273.15;
            toInput.value = parseFloat(res.toFixed(6)).toString();
        } else {
            const val = parseFloat(toInput.value) || 0;
            let c;
            if (uTo === 'C') c = val;
            else if (uTo === 'F') c = (val - 32) * (5 / 9);
            else if (uTo === 'K') c = val - 273.15;

            let res;
            if (uFrom === 'C') res = c;
            else if (uFrom === 'F') res = (c * (9 / 5)) + 32;
            else if (uFrom === 'K') res = c + 273.15;
            fromInput.value = parseFloat(res.toFixed(6)).toString();
        }
    } else {
        const toBase = catData.toBase;
        if (direction === 'from') {
            const val = parseFloat(fromInput.value) || 0;
            const inBase = val * toBase[uFrom];
            const result = inBase / toBase[uTo];
            toInput.value = parseFloat(result.toFixed(8)).toString();
        } else {
            const val = parseFloat(toInput.value) || 0;
            const inBase = val * toBase[uTo];
            const result = inBase / toBase[uFrom];
            fromInput.value = parseFloat(result.toFixed(8)).toString();
        }
    }
}

function swapConverterUnits() {
    audio.playAction();
    const fromSel = document.getElementById('conv-from-unit');
    const toSel = document.getElementById('conv-to-unit');
    if (!fromSel || !toSel) return;
    const temp = fromSel.value;
    fromSel.value = toSel.value;
    toSel.value = temp;
    runConversion('from');
}

function insertConvertedToCalc() {
    audio.playAction();
    const toInput = document.getElementById('conv-to-val');
    if (toInput && toInput.value) {
        state.currentInput = toInput.value;
        state.shouldResetDisplay = true;
        updateDisplay();
        closeModal('converter-modal');
        showToast(`Значення ${toInput.value} вставлено`, '📥');
    }
}

function copyConvertedVal() {
    const toInput = document.getElementById('conv-to-val');
    if (toInput && toInput.value) {
        audio.playAction();
        navigator.clipboard.writeText(toInput.value);
        showToast(`Скопійовано: ${toInput.value}`, '📋');
    }
}

