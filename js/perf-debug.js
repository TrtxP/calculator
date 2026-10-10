// ==========================================================================
// Діагностика швидкості відкриття розділів: додайте ?perf=1 до адреси
// (?perf=0 — вимкнути). На екрані з'являється панель з часом кожної фази
// відкриття у мс; кнопка «copy» копіює результати для надсилання.
// ==========================================================================
const perfDebug = {
  enabled: false,
  rows: [],
  tapTs: 0,
  panel: null,
  body: null,
  longTasks: { count: 0, max: 0 },

  init() {
    const m = /[?&]perf=([01])\b/.exec(location.search);
    if (m) localStorage.setItem('calc_perf_debug', m[1]);
    this.enabled = localStorage.getItem('calc_perf_debug') === '1';
    if (!this.enabled) return;

    // Момент відпускання пальця: від нього міряємо «тап → відкриття»
    document.addEventListener('pointerup', e => { this.tapTs = e.timeStamp; }, { capture: true, passive: true });

    try {
      new PerformanceObserver(list => {
        list.getEntries().forEach(en => {
          this.longTasks.count++;
          this.longTasks.max = Math.max(this.longTasks.max, en.duration);
        });
        this.render();
      }).observe({ entryTypes: ['longtask'] });
    } catch (e) { /* longtask не підтримується */ }

    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:10001;max-height:42vh;overflow:hidden;' +
      'background:rgba(0,0,0,.88);color:#7CFC8A;font:10px/1.35 monospace;padding:4px 6px;pointer-events:none;';
    const btn = document.createElement('button');
    btn.textContent = 'copy';
    btn.style.cssText = 'position:absolute;right:4px;top:4px;pointer-events:auto;font:11px monospace;padding:2px 8px;';
    btn.onclick = () => {
      const txt = this.text();
      if (navigator.clipboard) navigator.clipboard.writeText(txt).catch(() => {});
      console.log(txt);
    };
    const body = document.createElement('pre');
    body.style.cssText = 'margin:0;white-space:pre-wrap;';
    panel.appendChild(btn);
    panel.appendChild(body);
    document.body.appendChild(panel);
    this.panel = panel;
    this.body = body;
    this.render();
  },

  record(row) {
    this.rows.push(row);
    if (this.rows.length > 40) this.rows.shift();
    console.log('[perf]', this.line(row));
    this.render();
  },

  f(v) { return v == null ? '-' : v.toFixed(1); },

  line(r) {
    return r.id.replace('-modal', '') + ' | tap>' + this.f(r.tap) + ' mount ' + this.f(r.mount) +
      ' pre ' + this.f(r.pre) + ' wait ' + this.f(r.wait) + ' frame ' + this.f(r.frame) +
      ' prep ' + this.f(r.prepare) + ' | total ' + this.f(r.total);
  },

  text() {
    const ua = navigator.userAgent + ' cores=' + navigator.hardwareConcurrency + ' mem=' + navigator.deviceMemory +
      ' perfMode=' + state.perfMode + ' lite=' + document.documentElement.classList.contains('perf-lite');
    return ua + '\n' + this.rows.map(r => this.line(r)).join('\n') +
      '\nlongtasks: ' + this.longTasks.count + ' (max ' + this.f(this.longTasks.max) + ' ms)';
  },

  render() {
    if (!this.body) return;
    const last = this.rows.slice(-8).map(r => this.line(r)).join('\n');
    this.body.textContent = 'PERF (мс) mode=' + state.perfMode + ' longtasks=' + this.longTasks.count +
      ' max=' + this.f(this.longTasks.max) + '\n' + last;
  }
};

perfDebug.init();
