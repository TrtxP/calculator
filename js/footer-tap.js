// ==========================================================================
// Швидкий тап по кнопках футера (сенсорні екрани)
// pointerdown: миттєва візуальна реакція кнопки + попереднє монтування вікна
//              з <template> (вартість монтування «ховається» під час тапу);
// pointerup:   відкриття розділу без очікування синтетичного click.
// Якщо палець зсунувся (>10px) або браузер почав скрол (pointercancel) —
// розділ не відкривається, тож прокрутка сторінки не викликає випадкових відкриттів.
// ==========================================================================
(function initFooterFastTap() {
  const footer = document.querySelector('.footer');
  if (!footer || !window.PointerEvent) return;

  const OPEN_RE = /openModal\('([^']+)'\)/;
  let press = null;
  let suppressBtn = null;
  let suppressUntil = 0;

  function clearPress() {
    if (press) press.btn.classList.remove('is-pressed');
    press = null;
  }

  footer.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse') return;
    const btn = e.target.closest('.footer-btn');
    if (!btn) return;
    const m = OPEN_RE.exec(btn.getAttribute('onclick') || '');
    if (!m) return;
    btn.classList.add('is-pressed');
    ensureModalMounted(m[1]);
    press = { btn, id: m[1], x: e.clientX, y: e.clientY, pointerId: e.pointerId };
  }, { passive: true });

  footer.addEventListener('pointerup', e => {
    if (!press || e.pointerId !== press.pointerId) return;
    const p = press;
    clearPress();
    if (Math.hypot(e.clientX - p.x, e.clientY - p.y) > 10) return;
    suppressBtn = p.btn;
    suppressUntil = performance.now() + 700;
    openModal(p.id);
  });

  footer.addEventListener('pointercancel', clearPress);

  // Синтетичний click після вже виконаного відкриття не повинен відкрити вікно вдруге
  footer.addEventListener('click', e => {
    if (suppressBtn && performance.now() < suppressUntil && suppressBtn.contains(e.target)) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
    suppressBtn = null;
  }, true);
})();
