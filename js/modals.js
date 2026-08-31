// ==========================================================================
// Керування модальними вікнами
// ==========================================================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Синхронізуємо контроли налаштувань ДО показу модалки: один layout
        // з фінальними значеннями замість повторного layout посеред анімації
        // (помітно на мобільних при відкритті «Опцій»)
        if (modalId === 'settings-modal') {
            syncSettingsControls();
        }

        modal.classList.add('active');
        if (modalId === 'vector-calc-modal') {
            solveVectorMath();
        }
        if (modalId === 'complex-calc-modal') {
            solveComplexMath();
        }
        if (modalId === 'math-ref-modal') {
            renderMathRefList();
        }
        if (modalId === 'trig-circle-modal') {
            setTimeout(() => updateTrigCircle(state.trigAngleDeg), 50);
        }
        if (modalId === 'constants-search-modal') {
            renderExtendedConstants();
        }
        if (modalId === 'formula-solver-modal') {
            solvePhysicsFormula('ek');
            solvePhysicsFormula('ohm');
            solvePhysicsFormula('fall');
            solvePhysicsFormula('rho');
            solvePhysicsFormula('grav');
            solvePhysicsFormula('gas');
        }
        if (modalId === 'triangle-solver-modal') {
            solveTriangleGeometry();
        }
        if (modalId === 'loan-calc-modal') {
            calculateLoanAmortization();
        }
        if (modalId === 'bookmarks-modal') {
            renderBookmarks();
        }
        if (modalId === 'history-modal') {
            if (dom.historySearch) dom.historySearch.value = '';
            renderHistory();
        }
        if (modalId === 'tape-modal') {
            renderTapeRoll();
        }
        if (modalId === 'prime-gcd-modal') {
            solvePrimeFactorization();
            solveGcdLcm();
        }
        if (modalId === 'deal-calc-modal') {
            calculateUnitDeal();
        }
        if (modalId === 'func-eval-modal') {
            evaluateCustomFunc();
        }
        if (modalId === 'converter-modal') {
            switchConverterCategory(currentConvCat);
        }
        if (modalId === 'programmer-modal') {
            const currentNum = parseInt(state.currentInput, 10) || 0;
            const decEl = document.getElementById('prog-dec');
            if (decEl) {
                decEl.value = currentNum.toString(10);
                syncProgrammerBase('DEC', decEl.value);
            }
        }
        if (modalId === 'graph-modal') {
            setTimeout(() => plotFunction(state.activeGraphFunc), 50);
        }
        if (modalId === 'finance-modal') {
            calculateFinance();
        }
        if (modalId === 'quadratic-modal') {
            solveQuadraticEquation();
        }
        if (modalId === 'stats-modal') {
            calculateStatistics();
        }
        if (modalId === 'date-modal') {
            const today = new Date().toISOString().slice(0, 10);
            const dStart = document.getElementById('date-start');
            const dEnd = document.getElementById('date-end');
            const dBase = document.getElementById('date-base');
            if (dStart && !dStart.value) dStart.value = today;
            if (dEnd && !dEnd.value) dEnd.value = today;
            if (dBase && !dBase.value) dBase.value = today;
            calculateDateDiff();
            calculateDateAdd();
        }
        if (modalId === 'memory-modal') {
            updateMemorySlotsUI();
        }
        if (modalId === 'matrix-modal') {
            solveMatrixMath();
        }
        if (modalId === 'bitmask-modal') {
            renderBitmaskGrid();
        }
        if (modalId === 'percent-modal') {
            calcPercent1();
            calcPercent2();
            calcPercent3();
        }
        if (modalId === 'currency-modal') {
            runCurrencyConversion('from');
        }
        if (modalId === 'font-modal') {
            setFontScale(state.fontScale, true);
        }
    }

    // Клік відкладаємо на наступний кадр: ініціалізація AudioContext та
    // осцилятора не конкурує з першим layout/animated кадром відкриття
    // (мікролеги на мобільних пристроях)
    requestAnimationFrame(() => audio.playClick(700));
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
    requestAnimationFrame(() => audio.playClick(450));
}

window.onclick = function (event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('active');
    }
};

