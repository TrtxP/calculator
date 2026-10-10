// ==========================================================================
// Керування модальними вікнами
// ==========================================================================
const RENDER_ONCE = new Set([
  "math-ref-modal",
  "constants-search-modal",
  "formula-solver-modal",
  "bitmask-modal",
]);

const rendered = new Set();

// Lazy-модалки лежать у <template data-modal="id"> (див. build.js) і вставляються
// в DOM при першому відкритті: стартова сторінка легша, браузеру не треба
// стилізувати й компонувати розмітку розділів, які ніхто не відкривав.
// Повертає true, якщо вікно є в DOM (вже було або щойно змонтоване)
function ensureModalMounted(modalId) {
  if (document.getElementById(modalId)) return true;
  const tpl = document.querySelector('template[data-modal="' + modalId + '"]');
  if (!tpl) return false;
  tpl.replaceWith(tpl.content);
  return true;
}

function openModal(modalId) {
  const t0 = performance.now();
  const dbg = typeof perfDebug !== "undefined" && perfDebug.enabled;
  const tap = dbg && perfDebug.tapTs && t0 - perfDebug.tapTs < 1500 ? t0 - perfDebug.tapTs : null;

  if (!ensureModalMounted(modalId)) return;
  const modal = document.getElementById(modalId);
  if (!modal) return;
  const t1 = performance.now();

  // Дешеві розрахунки — ДО показу: один layout з фінальними значеннями,
  // без «стрибка» посеред відкриття
  if (modalId === "settings-modal") syncSettingsControls();
  if (modalId === "vector-calc-modal") solveVectorMath();
  if (modalId === "complex-calc-modal") solveComplexMath();
  const t2 = performance.now();

  document.documentElement.classList.add("modal-open");
  requestAnimationFrame(() => {
    const t3 = performance.now();
    modal.classList.add("active");
    // Важка частина (рендер списків, графіки) — після першого кадру
    requestAnimationFrame(() => {
      const t4 = performance.now();
      setTimeout(() => {
        const t5 = performance.now();
        prepareModal(modalId);
        if (dbg) {
          const t6 = performance.now();
          perfDebug.record({
            id: modalId,
            tap,
            mount: t1 - t0,
            pre: t2 - t1,
            wait: t3 - t2,
            frame: t4 - t3,
            idle: t5 - t4,
            prepare: t6 - t5,
            total: t6 - t0
          });
        }
      }, 0);
    });
  });

  requestAnimationFrame(() => audio.playClick(700));
}

function prepareModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  if (RENDER_ONCE.has(modalId)) {
    if (rendered.has(modalId)) return;
    rendered.add(modalId);
  }

  if (modal) {
    if (modalId === "math-ref-modal") {
      renderMathRefList();
    }
    if (modalId === "trig-circle-modal") {
      updateTrigCircle(state.trigAngleDeg);
    }
    if (modalId === "constants-search-modal") {
      renderExtendedConstants();
    }
    if (modalId === "formula-solver-modal") {
      solvePhysicsFormula("ek");
      solvePhysicsFormula("ohm");
      solvePhysicsFormula("fall");
      solvePhysicsFormula("rho");
      solvePhysicsFormula("grav");
      solvePhysicsFormula("gas");
    }
    if (modalId === "triangle-solver-modal") {
      solveTriangleGeometry();
    }
    if (modalId === "loan-calc-modal") {
      calculateLoanAmortization();
    }
    if (modalId === "bookmarks-modal") {
      renderBookmarks();
    }
    if (modalId === "history-modal") {
      if (dom.historySearch) dom.historySearch.value = "";
      renderHistory();
    }
    if (modalId === "tape-modal") {
      renderTapeRoll();
    }
    if (modalId === "prime-gcd-modal") {
      solvePrimeFactorization();
      solveGcdLcm();
    }
    if (modalId === "deal-calc-modal") {
      calculateUnitDeal();
    }
    if (modalId === "func-eval-modal") {
      evaluateCustomFunc();
    }
    if (modalId === "converter-modal") {
      switchConverterCategory(currentConvCat);
    }
    if (modalId === "programmer-modal") {
      const currentNum = parseInt(state.currentInput, 10) || 0;
      const decEl = document.getElementById("prog-dec");
      if (decEl) {
        decEl.value = currentNum.toString(10);
        syncProgrammerBase("DEC", decEl.value);
      }
    }
    if (modalId === "graph-modal") {
      setTimeout(() => plotFunction(state.activeGraphFunc), 50);
    }
    if (modalId === "finance-modal") {
      calculateFinance();
    }
    if (modalId === "quadratic-modal") {
      solveQuadraticEquation();
    }
    if (modalId === "stats-modal") {
      calculateStatistics();
    }
    if (modalId === "date-modal") {
      const today = new Date().toISOString().slice(0, 10);
      const dStart = document.getElementById("date-start");
      const dEnd = document.getElementById("date-end");
      const dBase = document.getElementById("date-base");
      if (dStart && !dStart.value) dStart.value = today;
      if (dEnd && !dEnd.value) dEnd.value = today;
      if (dBase && !dBase.value) dBase.value = today;
      calculateDateDiff();
      calculateDateAdd();
    }
    if (modalId === "memory-modal") {
      updateMemorySlotsUI();
    }
    if (modalId === "matrix-modal") {
      solveMatrixMath();
    }
    if (modalId === "bitmask-modal") {
      renderBitmaskGrid();
    }
    if (modalId === "percent-modal") {
      calcPercent1();
      calcPercent2();
      calcPercent3();
    }
    if (modalId === "currency-modal") {
      runCurrencyConversion("from");
    }
    if (modalId === "font-modal") {
      ensureAllFontsLoaded();
      setFontScale(state.fontScale, true);
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
  if (!document.querySelector('.modal-overlay.active')) {
    document.documentElement.classList.remove("modal-open");
  }
  requestAnimationFrame(() => audio.playClick(450));
}

window.onclick = function (event) {
  if (event.target.classList.contains("modal-overlay")) {
    closeModal(event.target.id);
  }
};
