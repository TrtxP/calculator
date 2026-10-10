// ==========================================================================
// Сесійний Таймер
// ==========================================================================
setInterval(() => {
    state.sessionSeconds++;
    if (dom.timerVal) {
        const mins = Math.floor(state.sessionSeconds / 60).toString().padStart(2, '0');
        const secs = (state.sessionSeconds % 60).toString().padStart(2, '0');
        dom.timerVal.innerText = `${mins}:${secs}`;
    }
}, 1000);

// ==========================================================================
// Повноекранний Режим (Fullscreen Toggle)
// ==========================================================================
function toggleFullScreen() {
    audio.playAction();
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            showToast('Повноекранний режим активовано (Esc для виходу)', '⛶');
        }).catch(() => {
            showToast('Повноекранний режим не підтримується браузером', '⚠️');
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            showToast('Вихід з повноекранного режиму', '🪟');
        }
    }
}

// ==========================================================================
// Динамічний Canvas з Інтерактивними Частинками (Particle Dynamics)
// ==========================================================================
let particles = [];
let animFrameId = null;
let mousePos = { x: -1000, y: -1000, active: false };
let particlesPaused = false;
let resizeTimer = null;

if (!window.matchMedia('(pointer: coarse)').matches) {
    window.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        mousePos.active = true;
    });

    window.addEventListener('mouseleave', () => {
        mousePos.active = false;
    });
}

document.addEventListener('visibilitychange', () => {
    particlesPaused = document.hidden;
    if (!document.hidden && state.particlesEnabled) {
        if (!animFrameId) initParticlesCanvas();
    } else if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
    }
});

function initParticlesCanvas() {
    const canvas = dom.bgParticlesCanvas;
    if (!canvas || !state.particlesEnabled || particlesPaused) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particles = [];
    const rawCount = Math.floor((canvas.width * canvas.height) / 50000);
    const count = Math.min(rawCount, typeof getParticleCountLimit === 'function' ? getParticleCountLimit() : 60);
    const drawConnections = typeof shouldDrawParticleConnections === 'function'
        ? shouldDrawParticleConnections()
        : true;

    let speedMult = 1.0;
    if (state.particleSpeedMode === 'aurora') speedMult = 0.5;
    if (state.particleSpeedMode === 'starlight') speedMult = 0.8;
    if (state.particleSpeedMode === 'warp') speedMult = 2.4;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5 * speedMult,
            vy: (Math.random() - 0.5) * 0.5 * speedMult,
            radius: Math.random() * 2.2 + 1,
            color: Math.random() > 0.4 ? 'rgba(192, 38, 211, ' : (Math.random() > 0.5 ? 'rgba(245, 158, 11, ' : 'rgba(255, 0, 85, ')
        });
    }

    function render() {
        if (!state.particlesEnabled || particlesPaused) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            animFrameId = null;
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            if (mousePos.active) {
                const dx = mousePos.x - p.x;
                const dy = mousePos.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140 && dist > 10) {
                    p.x += (dx / dist) * 0.6;
                    p.y += (dy / dist) * 0.6;
                }
            }

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + '0.75)';
            ctx.fill();

            if (drawConnections) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = dx * dx + dy * dy;
                    if (dist < 115 * 115) {
                        const distSqrt = Math.sqrt(dist);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(192, 38, 211, ${0.35 * (1 - distSqrt / 115)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        }
        animFrameId = requestAnimationFrame(render);
    }

    if (animFrameId) cancelAnimationFrame(animFrameId);
    render();
}

function setParticleSpeedMode(mode) {
    state.particleSpeedMode = mode;
    localStorage.setItem('calc_part_mode', mode);
    document.querySelectorAll('.particle-preset-btn').forEach(b => {
        b.classList.toggle('active', b.id === `part-btn-${mode}`);
    });
    initParticlesCanvas();
    const names = { standard: 'Стандарт (Calm)', aurora: 'Aurora Flow', starlight: 'Starlight', warp: 'Warp Speed' };
    showToast(`Динаміка частинок: ${names[mode]}`, '✨');
}

window.addEventListener('resize', () => {
    if (!dom.bgParticlesCanvas || !state.particlesEnabled) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => initParticlesCanvas(), 180);
});

function stopParticlesCanvas() {
    if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
    }
    if (dom.bgParticlesCanvas) {
        const ctx = dom.bgParticlesCanvas.getContext('2d');
        ctx.clearRect(0, 0, dom.bgParticlesCanvas.width, dom.bgParticlesCanvas.height);
    }
}

function toggleParticlesSetting(val) {
    // У легкому режимі частинки недоступні: запам'ятовуємо побажання
    // і вмикаємо їх лише коли користувач перейде на режим «Повний»
    if (val === 'on' && document.documentElement.classList.contains('perf-lite')) {
        localStorage.setItem('calc_particles', 'on');
        state.particlesEnabled = false;
        stopParticlesCanvas();
        syncSettingsControls();
        showToast('Частинки доступні у режимі «Повний» (Опції → Режим продуктивності)', '⚡');
        return;
    }
    state.particlesEnabled = val === 'on';
    localStorage.setItem('calc_particles', val);
    if (state.particlesEnabled) {
        initParticlesCanvas();
        showToast('Живі частинки увімкнено', '✨');
    } else {
        stopParticlesCanvas();
        showToast('Фонові частинки вимкнено', '⏸️');
    }
}
