window.HWReport = window.HWReport || {};

HWReport.theme = {
  STORAGE_KEY: 'hw-theme',

  init: function () {
    var stored = null;
    try { stored = localStorage.getItem(this.STORAGE_KEY); } catch (e) { /* ignore */ }
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-theme', stored);
    }
    this.injectToggle();
    document.addEventListener('hw:themechange', function () {
      if (HWReport.charts && HWReport.charts.refreshTheme) {
        HWReport.charts.refreshTheme();
      }
    });
  },

  get: function () {
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },

  set: function (mode) {
    if (mode === 'light' || mode === 'dark') {
      document.documentElement.setAttribute('data-theme', mode);
      try { localStorage.setItem(this.STORAGE_KEY, mode); } catch (e) { /* ignore */ }
    } else {
      document.documentElement.removeAttribute('data-theme');
      try { localStorage.removeItem(this.STORAGE_KEY); } catch (e) { /* ignore */ }
    }
    this._updateToggleLabel();
    document.dispatchEvent(new CustomEvent('hw:themechange'));
  },

  toggle: function () {
    this.set(this.get() === 'dark' ? 'light' : 'dark');
  },

  getChartTheme: function () {
    var s = getComputedStyle(document.documentElement);
    return {
      grid: s.getPropertyValue('--chart-grid').trim(),
      tick: s.getPropertyValue('--text-tertiary').trim(),
      tickSecondary: s.getPropertyValue('--text-secondary').trim(),
      tooltipBg: s.getPropertyValue('--surface').trim(),
      tooltipText: s.getPropertyValue('--text-primary').trim(),
      border: s.getPropertyValue('--border-strong').trim(),
    };
  },

  injectToggle: function () {
    var header = document.querySelector('header');
    if (!header || header.querySelector('.theme-toggle')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chrome-btn theme-toggle';
    btn.setAttribute('aria-label', 'Toggle light or dark theme');
    btn.addEventListener('click', function () { HWReport.theme.toggle(); });
    this._updateToggleLabel(btn);
    var right = header.querySelector('.header-right') || header.querySelector('.header-actions');
    if (right) {
      right.appendChild(btn);
    } else {
      var wrap = document.createElement('div');
      wrap.className = 'header-right';
      wrap.appendChild(btn);
      header.appendChild(wrap);
    }
  },

  _updateToggleLabel: function (btn) {
    if (!btn) btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.textContent = this.get() === 'dark' ? 'Light mode' : 'Dark mode';
  },
};

document.addEventListener('DOMContentLoaded', function () {
  HWReport.theme.init();
});
