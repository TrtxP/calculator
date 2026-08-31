// ==========================================================================
// Керування модальними вікнами
// ==========================================================================
function openModal(modalId) {
    audio.playClick(700);
    const modal = document.getElementById(modalId);
    if (modal) {
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
        if (modalId === 'settings-modal') {
            const vSlider = document.getElementById('setting-volume');
            const vVal = document.getElementById('setting-vol-val');
            const sProf = document.getElementById('setting-sound-profile');
            const sSep = document.getElementById('setting-separator');
            const sPrec = document.getElementById('setting-precision');
            const sAng = document.getElementById('setting-angle');
            const sGlass = document.getElementById('setting-glass');
            const sPart = document.getElementById('setting-particles');
            const sFScale = document.getElementById('setting-font-scale');
            if (vSlider) vSlider.value = Math.round(state.soundVolume * 100);
            if (vVal) vVal.innerText = `${Math.round(state.soundVolume * 100)}%`;
            if (sProf) sProf.value = state.soundProfile;
            if (sSep) sSep.value = state.thousandSeparator;
            if (sPrec) sPrec.value = state.precisionMode;
            if (sAng) sAng.value = state.angleMode;
            if (sGlass) sGlass.value = state.glassIntensity;
            if (sPart) sPart.value = state.particlesEnabled ? 'on' : 'off';
            if (sFScale) sFScale.value = state.fontScale.toString();
        }
    }
}

function closeModal(modalId) {
    audio.playClick(450);
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

window.onclick = function (event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('active');
    }
};

