window.HWReport = window.HWReport || {};
HWReport.filters = HWReport.filters || {};

(function () {
  var state = { dims: [], values: {}, registry: {}, dirty: {}, barEl: null, url: false };

  function defaultsFromDims(dims) {
    var out = {};
    dims.forEach(function (d) {
      out[d.id] = d.default != null ? d.default : (d.options[0] && d.options[0].value);
    });
    return out;
  }

  function parseUrl(dims) {
    var hash = window.location.hash.replace(/^#/, '');
    if (!hash || hash.indexOf('=') === -1) return null;
    var params = new URLSearchParams(hash);
    var out = {};
    dims.forEach(function (d) {
      if (params.has(d.id)) out[d.id] = params.get(d.id);
    });
    return Object.keys(out).length ? out : null;
  }

  function writeUrl() {
    if (!state.url) return;
    var params = new URLSearchParams();
    state.dims.forEach(function (d) {
      var v = state.values[d.id];
      var def = d.default != null ? d.default : (d.options[0] && d.options[0].value);
      if (v != null && v !== def) params.set(d.id, v);
    });
    var next = params.toString();
    var base = window.location.pathname + window.location.search;
    history.replaceState(null, '', next ? base + '#' + next : base);
  }

  function measureFilterTop() {
    var header = document.querySelector('header');
    var tabBar = document.querySelector('.tab-bar');
    var h = (header ? header.offsetHeight : 0) + (tabBar ? tabBar.offsetHeight : 0);
    document.documentElement.style.setProperty('--filter-top', h + 'px');
  }

  function renderBar() {
    if (!state.barEl) return;
    var html = '';
    state.dims.forEach(function (d) {
      html += '<div class="filter-dim" role="group" aria-label="' + d.label + '">';
      html += '<span class="filter-dim-label">' + d.label + '</span>';
      d.options.forEach(function (opt) {
        var active = state.values[d.id] === opt.value;
        html += '<button type="button" class="filter-chip' + (active ? ' active' : '') + '" data-dim="' + d.id + '" data-value="' + opt.value + '" aria-pressed="' + active + '">' + opt.label + '</button>';
      });
      html += '</div>';
    });
    state.barEl.innerHTML = html;
    state.barEl.querySelectorAll('.filter-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dim = btn.getAttribute('data-dim');
        var val = btn.getAttribute('data-value');
        if (state.values[dim] === val) return;
        state.values[dim] = val;
        renderBar();
        writeUrl();
        flushAll(true);
      });
      btn.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var chips = Array.prototype.slice.call(state.barEl.querySelectorAll('[data-dim="' + btn.getAttribute('data-dim') + '"]'));
        var idx = chips.indexOf(btn);
        var next = e.key === 'ArrowRight' ? chips[idx + 1] || chips[0] : chips[idx - 1] || chips[chips.length - 1];
        if (next) { e.preventDefault(); next.focus(); }
      });
    });
  }

  function panelVisible() {
    var panel = document.querySelector('.tab-content.active');
    return panel || document;
  }

  function shouldRender(chartId, entry) {
    var canvas = document.getElementById(chartId);
    if (!canvas) return false;
    var panel = canvas.closest('.tab-content');
    if (panel && !panel.classList.contains('active')) {
      state.dirty[chartId] = true;
      return false;
    }
    return true;
  }

  function flushAll(force) {
    Object.keys(state.registry).forEach(function (id) {
      if (force || state.dirty[id]) {
        state.dirty[id] = false;
        var entry = state.registry[id];
        if (shouldRender(id, entry) || force) entry.render(state.values);
      }
    });
  }

  HWReport.filters.init = function (opts) {
    opts = opts || {};
    state.dims = opts.dims || [];
    state.url = !!opts.url;
    state.barEl = typeof opts.bar === 'string' ? document.querySelector(opts.bar) : opts.bar;
    state.values = Object.assign(defaultsFromDims(state.dims), opts.values || {});
    var fromUrl = state.url ? parseUrl(state.dims) : null;
    if (fromUrl) state.values = Object.assign(state.values, fromUrl);
    renderBar();
    measureFilterTop();
    window.addEventListener('resize', measureFilterTop);
    document.addEventListener('hwreport:tabswitch', function () {
      measureFilterTop();
      flushAll(true);
    });
    writeUrl();
    flushAll(true);
  };

  HWReport.filters.register = function (id, entry) {
    state.registry[id] = entry;
    if (shouldRender(id, entry)) entry.render(state.values);
    else state.dirty[id] = true;
  };

  HWReport.filters.get = function () {
    return Object.assign({}, state.values);
  };

  HWReport.filters.sliceBracket = function (arr, br, brackets) {
    if (!arr) return arr;
    if (!br || br === 'all') return arr.slice();
    var idx = brackets.indexOf(br);
    if (idx < 0) return arr.slice();
    return [arr[idx]];
  };

  HWReport.filters.sliceLabels = function (brackets, br) {
    if (!br || br === 'all') return brackets.slice();
    var idx = brackets.indexOf(br);
    return idx >= 0 ? [brackets[idx]] : brackets.slice();
  };
})();
