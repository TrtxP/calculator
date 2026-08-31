// ==========================================================================
// Хвильова Ripple-Анімація при кліках на кнопки
// ==========================================================================
document.addEventListener('click', (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (document.documentElement.classList.contains('perf-lite')) return;

    const btn = e.target.closest('.buttons button, .footer-btn, .conv-tab, .sidebar-nav button');
    if (!btn) return;

    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('btn-ripple-wave');

    const ripple = btn.getElementsByClassName('btn-ripple-wave')[0];
    if (ripple) ripple.remove();

    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 550);
});
