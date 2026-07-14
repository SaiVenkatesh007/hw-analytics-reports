window.HWReport = window.HWReport || {};
HWReport.charts = HWReport.charts || {};

HWReport.COLORS = {
  BLUE: '#3A8FD4',
  TEAL: '#1E8F5E',
  CORAL: '#C0392B',
  AMBER: '#BA7517',
  PURPLE: '#6C4AB6',
  GRAY: '#767676',
  RANKS: {},
};

HWReport._chartInstances = HWReport._chartInstances || {};
HWReport._chartMeta = HWReport._chartMeta || {};

HWReport.fmt = {
  pct: function (v) { return v + '%'; },
  pp: function (v) { return (v > 0 ? '+' : '') + v + 'pp'; },
  count: function (v) { return Number(v).toLocaleString(); },
  inr: function (v) { return '₹' + Number(v).toLocaleString(); },
  raw: function (v) { return String(v); },
  tick: function (kind) {
    var fn = HWReport.fmt[kind] || HWReport.fmt.raw;
    return function (v) { return fn(v); };
  },
  tooltip: function (kind) {
    var fn = HWReport.fmt[kind] || HWReport.fmt.raw;
    return function (ctx) {
      var v = ctx.parsed && ctx.parsed.y != null ? ctx.parsed.y : ctx.raw;
      return ctx.dataset.label + ': ' + fn(v);
    };
  },
};

function _cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function _loadRankColors() {
  var ranks = ['Rookie', 'Challenger', 'Proven', 'Accomplished', 'Remarkable'];
  HWReport.COLORS.RANKS = {};
  ranks.forEach(function (r) {
    var el = document.createElement('span');
    el.className = 'rank-badge rank-' + r;
    el.style.position = 'absolute';
    el.style.visibility = 'hidden';
    document.body.appendChild(el);
    var s = getComputedStyle(el);
    HWReport.COLORS.RANKS[r] = { bg: s.backgroundColor, fg: s.color };
    document.body.removeChild(el);
  });
}

function _colorAlpha(hex, alpha) {
  if (!hex || hex.indexOf('#') !== 0) return hex;
  var h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
  var r = parseInt(h.slice(0, 2), 16);
  var g = parseInt(h.slice(2, 4), 16);
  var b = parseInt(h.slice(4, 6), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

function _datasetColors(hex, fillAlpha) {
  return { bg: _colorAlpha(hex, fillAlpha || 0.6), border: hex };
}

function _ariaWrap(canvas, label) {
  if (!canvas || !label) return;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', label);
}

function _initOrUpdateChart(id, ctx, config, meta) {
  meta = meta || {};
  var prev = HWReport._chartInstances[id];
  if (prev && prev.canvas && prev.canvas.isConnected && meta.type && prev.config.type === meta.type) {
    var dsCount = config.data.datasets.length;
    if (prev.data.datasets.length === dsCount) {
      prev.data.labels = config.data.labels;
      for (var i = 0; i < dsCount; i++) {
        prev.data.datasets[i].data = config.data.datasets[i].data;
        prev.data.datasets[i].label = config.data.datasets[i].label;
        if (config.data.datasets[i].backgroundColor != null) prev.data.datasets[i].backgroundColor = config.data.datasets[i].backgroundColor;
        if (config.data.datasets[i].borderColor != null) prev.data.datasets[i].borderColor = config.data.datasets[i].borderColor;
        if (config.data.datasets[i].borderWidth != null) prev.data.datasets[i].borderWidth = config.data.datasets[i].borderWidth;
        if (config.data.datasets[i].borderRadius != null) prev.data.datasets[i].borderRadius = config.data.datasets[i].borderRadius;
        if (config.data.datasets[i].type != null) prev.data.datasets[i].type = config.data.datasets[i].type;
        if (config.data.datasets[i].pointRadius != null) prev.data.datasets[i].pointRadius = config.data.datasets[i].pointRadius;
        if (config.data.datasets[i].fill != null) prev.data.datasets[i].fill = config.data.datasets[i].fill;
      }
      if (config.options) {
        if (config.options.scales) prev.options.scales = config.options.scales;
        if (config.options.indexAxis != null) prev.options.indexAxis = config.options.indexAxis;
      }
      var mode = HWReport._prefersReducedMotion && HWReport._prefersReducedMotion() ? 'none' : undefined;
      prev.update(mode);
      _ariaWrap(prev.canvas, meta.ariaLabel);
      HWReport._chartMeta[id] = meta;
      return prev;
    }
    prev.destroy();
  } else if (prev) {
    prev.destroy();
  }
  var chart = new Chart(ctx, config);
  HWReport._chartInstances[id] = chart;
  HWReport.charts[id] = chart;
  HWReport._chartMeta[id] = meta;
  _ariaWrap(chart.canvas, meta.ariaLabel);
  return chart;
}

function _scaleOpts(overrides) {
  var t = HWReport.theme.getChartTheme();
  var base = {
    x: {
      grid: { display: false, color: t.grid },
      ticks: { color: t.tick, font: { size: 11, family: "'DM Mono', monospace" } },
    },
    y: {
      grid: { color: t.grid },
      ticks: { color: t.tick, font: { size: 11, family: "'DM Mono', monospace" } },
    },
  };
  if (!overrides) return base;
  return {
    x: Object.assign({}, base.x, overrides.x || {}),
    y: Object.assign({}, base.y, overrides.y || {}),
  };
}

function _baseOpts(kind, extra) {
  var t = HWReport.theme.getChartTheme();
  var plugins = {
    legend: {
      display: kind !== 'sparkline',
      position: 'bottom',
      labels: { color: t.tickSecondary, font: { size: 11 }, boxWidth: 10 },
    },
    tooltip: {
      backgroundColor: t.tooltipBg,
      titleColor: t.tooltipText,
      bodyColor: t.tooltipText,
      borderColor: t.border,
      borderWidth: 1,
    },
  };
  if (extra && extra.plugins) {
    Object.keys(extra.plugins).forEach(function (k) { plugins[k] = extra.plugins[k]; });
    delete extra.plugins;
  }
  var opts = Object.assign({ responsive: true, maintainAspectRatio: false, plugins: plugins }, extra || {});
  return opts;
}

HWReport.charts.scaleOpts = _scaleOpts;
HWReport.charts._baseOpts = _baseOpts;
HWReport.charts._datasetColors = _datasetColors;
HWReport.charts.loadRankColors = _loadRankColors;

HWReport.charts.refreshTheme = function () {
  Object.keys(HWReport._chartInstances).forEach(function (id) {
    var chart = HWReport._chartInstances[id];
    if (!chart || !chart.options) return;
    var t = HWReport.theme.getChartTheme();
    if (chart.options.scales) {
      ['x', 'y'].forEach(function (axis) {
        var s = chart.options.scales[axis];
        if (!s) return;
        if (s.grid) s.grid.color = t.grid;
        if (s.ticks) s.ticks.color = t.tick;
      });
    }
    if (chart.options.plugins) {
      if (chart.options.plugins.legend && chart.options.plugins.legend.labels) {
        chart.options.plugins.legend.labels.color = t.tickSecondary;
      }
      if (chart.options.plugins.tooltip) {
        chart.options.plugins.tooltip.backgroundColor = t.tooltipBg;
        chart.options.plugins.tooltip.titleColor = t.tooltipText;
        chart.options.plugins.tooltip.bodyColor = t.tooltipText;
        chart.options.plugins.tooltip.borderColor = t.border;
      }
    }
    var meta = HWReport._chartMeta[id];
    if (meta && meta.colors && chart.data.datasets) {
      chart.data.datasets.forEach(function (ds, i) {
        var c = meta.colors[i];
        if (!c) return;
        var dc = _datasetColors(c, meta.fillAlpha || 0.6);
        ds.backgroundColor = dc.bg;
        ds.borderColor = dc.border;
      });
    }
    chart.update('none');
  });
};

function _barDs(label, data, color, radius) {
  var dc = _datasetColors(color, 0.6);
  return { label: label, data: data, backgroundColor: dc.bg, borderColor: dc.border, borderWidth: 1, borderRadius: radius || 3 };
}

HWReport.grouped = function (id, labels, d1, d2, c1, c2, opts) {
  opts = opts || {};
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var chartOpts = _baseOpts('bar', {
    plugins: { legend: { display: opts.legend !== false && false } },
    scales: _scaleOpts(opts.scales),
  });
  if (opts.yFmt) chartOpts.scales.y.ticks.callback = HWReport.fmt.tick(opts.yFmt);
  _initOrUpdateChart(id, ctx, {
    type: 'bar',
    data: { labels: labels, datasets: [_barDs('Base', d1, c1), _barDs('Test', d2, c2)] },
    options: chartOpts,
  }, { type: 'bar', ariaLabel: opts.ariaLabel || 'Grouped bar chart', colors: [c1, c2] });
};

HWReport.ppGrouped = function (id, labels, ppObj, shotNames, shotColors, opts) {
  opts = opts || {};
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var keys = ['z', 'o', 't', 'f', 's'];
  var colors = keys.map(function (k) { return shotColors[k]; });
  var datasets = keys.map(function (k) {
    return _barDs(shotNames[k], ppObj[k], shotColors[k], 2);
  });
  var scales = _scaleOpts();
  scales.y.ticks.callback = HWReport.fmt.tick('pp');
  var chartOpts = _baseOpts('bar', {
    plugins: {
      legend: { display: true },
      tooltip: { callbacks: { label: HWReport.fmt.tooltip('pp') } },
    },
    scales: scales,
  });
  _initOrUpdateChart(id, ctx, { type: 'bar', data: { labels: labels, datasets: datasets }, options: chartOpts }, { type: 'bar', ariaLabel: opts.ariaLabel || 'Shot mix shift chart', colors: colors });
};

HWReport.stackedMix = function (id, mixBase, mixTest, shotNames, shotColors, opts) {
  opts = opts || {};
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var keys = ['z', 'o', 't', 'f', 's'];
  var colors = keys.map(function (k) { return shotColors[k]; });
  var datasets = keys.map(function (k) {
    var dc = _datasetColors(shotColors[k], 0.73);
    return { label: shotNames[k], data: [mixBase[k][0], mixTest[k][0]], backgroundColor: dc.bg, borderColor: dc.border, borderWidth: 1 };
  });
  var scales = _scaleOpts();
  scales.x.stacked = true;
  scales.y = { stacked: true, grid: { display: false }, ticks: { color: scales.y.ticks.color, font: scales.y.ticks.font, callback: HWReport.fmt.tick('pct') } };
  var chartOpts = _baseOpts('bar', { plugins: { legend: { display: true } }, scales: scales, indexAxis: 'y' });
  _initOrUpdateChart(id, ctx, { type: 'bar', data: { labels: ['Base', 'Test'], datasets: datasets }, options: chartOpts }, { type: 'bar', ariaLabel: opts.ariaLabel || 'Stacked shot mix', colors: colors, fillAlpha: 0.73 });
};

HWReport.dualBar = function (id, labels, closeData, oneSidedData, opts) {
  if (typeof opts === 'string') opts = { label1: opts, label2: arguments[5], ymax: arguments[6] };
  opts = opts || {};
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var c = HWReport.COLORS;
  var yFmt = opts.yFmt || 'pct';
  var scales = _scaleOpts();
  scales.y.min = opts.ymin != null ? opts.ymin : 0;
  if (opts.ymax != null) scales.y.max = opts.ymax;
  else if (yFmt === 'pct') scales.y.max = 70;
  scales.y.ticks.callback = opts.tickCallback || HWReport.fmt.tick(yFmt);
  var chartOpts = _baseOpts('bar', {
    plugins: {
      legend: { display: true },
      tooltip: { callbacks: { label: HWReport.fmt.tooltip(yFmt) } },
    },
    scales: scales,
  });
  _initOrUpdateChart(id, ctx, {
    type: 'bar',
    data: { labels: labels, datasets: [_barDs(opts.label1 || 'Close %', closeData, c.BLUE), _barDs(opts.label2 || 'One-sided %', oneSidedData, c.CORAL)] },
    options: chartOpts,
  }, { type: 'bar', ariaLabel: opts.ariaLabel || 'Dual bar chart', colors: [c.BLUE, c.CORAL] });
};

HWReport.lineChart = function (id, labels, datasets, yOpts) {
  yOpts = yOpts || {};
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var scales = _scaleOpts();
  if (yOpts.min != null) scales.y.min = yOpts.min;
  if (yOpts.max != null) scales.y.max = yOpts.max;
  scales.y.ticks.callback = yOpts.tickCallback || HWReport.fmt.tick(yOpts.yFmt || 'pct');
  var showLegend = datasets.length > 1;
  var chartOpts = _baseOpts('line', { plugins: { legend: { display: showLegend } }, scales: scales });
  if (yOpts.annotations && typeof Chart !== 'undefined' && Chart.registry.plugins.get('annotation')) {
    chartOpts.plugins.annotation = { annotations: yOpts.annotations };
  }
  var colors = datasets.map(function (d) { return d.borderColor; });
  _initOrUpdateChart(id, ctx, { type: 'line', data: { labels: labels, datasets: datasets }, options: chartOpts }, { type: 'line', ariaLabel: yOpts.ariaLabel || 'Line chart', colors: colors, fillAlpha: 0.2 });
};

HWReport.lineChartSimple = function (id, labels, data, label, color, yOpts) {
  var dc = _datasetColors(color, 0.2);
  HWReport.lineChart(id, labels, [{
    label: label, data: data, borderColor: color, backgroundColor: dc.bg, tension: 0.3, fill: true, pointRadius: 4,
  }], yOpts || { min: 30, max: 75 });
};

HWReport.singleBar = function (id, labels, data, color, yOpts) {
  yOpts = yOpts || {};
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var yFmt = yOpts.yFmt || 'pct';
  var scales = _scaleOpts();
  scales.x.ticks.maxRotation = 45;
  scales.y.min = yOpts.min != null ? yOpts.min : 0;
  if (yOpts.max != null) scales.y.max = yOpts.max;
  else if (yFmt === 'pct') scales.y.max = 100;
  scales.y.ticks.callback = yOpts.tickCallback || HWReport.fmt.tick(yFmt);
  var chartOpts = _baseOpts('bar', {
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: HWReport.fmt.tooltip(yFmt) } },
    },
    scales: scales,
  });
  _initOrUpdateChart(id, ctx, {
    type: 'bar',
    data: { labels: labels, datasets: [_barDs(yOpts.label || 'Value', data, color)] },
    options: chartOpts,
  }, { type: 'bar', ariaLabel: yOpts.ariaLabel || 'Bar chart', colors: [color] });
};

HWReport.donut = function (id, labels, data, colors, opts) {
  opts = opts || {};
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var chartOpts = _baseOpts('doughnut', { plugins: { legend: { display: true } }, cutout: '62%' });
  _initOrUpdateChart(id, ctx, { type: 'doughnut', data: { labels: labels, datasets: [{ data: data, backgroundColor: colors, borderWidth: 0 }] }, options: chartOpts }, { type: 'doughnut', ariaLabel: opts.ariaLabel || 'Donut chart', colors: colors });
};

HWReport.horizontalRankedBar = function (id, labels, data, color, opts) {
  opts = opts || {};
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var scales = _scaleOpts();
  scales.x.grid.display = true;
  scales.y.grid.display = false;
  var chartOpts = _baseOpts('bar', { plugins: { legend: { display: false } }, scales: scales, indexAxis: 'y' });
  _initOrUpdateChart(id, ctx, {
    type: 'bar',
    data: { labels: labels, datasets: [_barDs(opts.label || 'Value', data, color)] },
    options: chartOpts,
  }, { type: 'bar', ariaLabel: opts.ariaLabel || 'Horizontal bar chart', colors: [color] });
};

HWReport.sparkline = function (id, data, color) {
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var dc = _datasetColors(color, 0.13);
  var scales = _scaleOpts();
  scales.x.display = false;
  scales.y.display = false;
  _initOrUpdateChart(id, ctx, {
    type: 'line',
    data: {
      labels: data.map(function (_, i) { return i; }),
      datasets: [{ data: data, borderColor: color, backgroundColor: dc.bg, borderWidth: 1.5, pointRadius: 0, tension: 0.35, fill: true }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: scales },
  }, { type: 'line', ariaLabel: 'Sparkline', colors: [color], fillAlpha: 0.13 });
};

HWReport.scatter = function (id, points, color, xLabel, yLabel, opts) {
  opts = opts || {};
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var scales = _scaleOpts();
  if (xLabel) scales.x.title = { display: true, text: xLabel, color: scales.x.ticks.color, font: { size: 11 } };
  if (yLabel) scales.y.title = { display: true, text: yLabel, color: scales.y.ticks.color, font: { size: 11 } };
  var chartOpts = _baseOpts('scatter', { plugins: { legend: { display: false } }, scales: scales });
  _initOrUpdateChart(id, ctx, {
    type: 'scatter',
    data: { datasets: [{ data: points, backgroundColor: _datasetColors(color, 0.6).bg, borderColor: color, pointRadius: 4 }] },
    options: chartOpts,
  }, { type: 'scatter', ariaLabel: opts.ariaLabel || 'Scatter chart', colors: [color] });
};

HWReport.quantileBand = function (id, labels, qbase, qtest, opts) {
  opts = opts || {};
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var metric = opts.metric || 'wk';
  var b25 = qbase[metric + '_q25'];
  var b75 = qbase[metric + '_q75'];
  var t50 = qtest[metric + '_q50'];
  var bandLow = b25.map(function (v, i) { return Math.min(v, b75[i]); });
  var bandHigh = b25.map(function (v, i) { return Math.max(v, b75[i]); });
  var bandData = bandLow.map(function (lo, i) { return [lo, bandHigh[i]]; });
  var c = HWReport.COLORS;
  var chartOpts = _baseOpts('bar', { plugins: { legend: { display: true } }, scales: _scaleOpts() });
  _initOrUpdateChart(id, ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'q25–q90 band', data: bandData, backgroundColor: _colorAlpha(c.BLUE, 0.25), borderWidth: 0, borderSkipped: false },
        { label: 'Test median', data: t50, type: 'line', borderColor: c.TEAL, backgroundColor: c.TEAL, pointRadius: 4, borderWidth: 2, fill: false },
      ],
    },
    options: chartOpts,
  }, { type: 'bar', ariaLabel: opts.ariaLabel || 'Quantile band chart', colors: [c.BLUE, c.TEAL] });
};

HWReport.waterfall = function (id, labels, values, opts) {
  opts = opts || {};
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var bases = [];
  var heights = [];
  var running = opts.start || 0;
  values.forEach(function (v) {
    bases.push(running);
    heights.push(v);
    running += v;
  });
  var c = HWReport.COLORS;
  var colors = values.map(function (v) { return v >= 0 ? c.TEAL : c.CORAL; });
  var chartOpts = _baseOpts('bar', { plugins: { legend: { display: false } }, scales: _scaleOpts() });
  _initOrUpdateChart(id, ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'base', data: bases, backgroundColor: 'transparent', borderWidth: 0, stack: 'wf' },
        { label: 'delta', data: heights, backgroundColor: colors.map(function (col) { return _colorAlpha(col, 0.7); }), borderColor: colors, borderWidth: 1, borderRadius: 3, stack: 'wf' },
      ],
    },
    options: Object.assign(chartOpts, { scales: Object.assign(chartOpts.scales || _scaleOpts(), { x: { stacked: true }, y: { stacked: true } }) }),
  }, { type: 'bar', ariaLabel: opts.ariaLabel || 'Waterfall chart', colors: colors });
};

HWReport.funnel = function (id, stages, values, opts) {
  opts = opts || {};
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var conv = values.map(function (v, i) {
    if (i === 0) return '100%';
    return values[i - 1] ? Math.round(v / values[i - 1] * 100) + '%' : '—';
  });
  var labels = stages.map(function (s, i) { return s + ' (' + conv[i] + ')'; });
  var c = HWReport.COLORS.BLUE;
  var chartOpts = _baseOpts('bar', { plugins: { legend: { display: false } }, scales: _scaleOpts(), indexAxis: 'y' });
  _initOrUpdateChart(id, ctx, {
    type: 'bar',
    data: { labels: labels, datasets: [_barDs('Users', values, c)] },
    options: chartOpts,
  }, { type: 'bar', ariaLabel: opts.ariaLabel || 'Funnel chart', colors: [c] });
};

HWReport.heatmapTable = function (el, rows, cols, matrix, opts) {
  opts = opts || {};
  var root = typeof el === 'string' ? document.getElementById(el) : el;
  if (!root) return;
  var min = opts.min != null ? opts.min : Math.min.apply(null, matrix.flat());
  var max = opts.max != null ? opts.max : Math.max.apply(null, matrix.flat());
  function heat(v) {
    var t = max === min ? 0.5 : (v - min) / (max - min);
    var r = Math.round(255 - t * 120);
    var g = Math.round(240 - t * 80);
    var b = Math.round(250 - t * 160);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }
  var h = '<table class="heatmap-table"><thead><tr><th></th>';
  cols.forEach(function (c) { h += '<th scope="col">' + c + '</th>'; });
  h += '</tr></thead><tbody>';
  rows.forEach(function (row, ri) {
    h += '<tr><th scope="row">' + row + '</th>';
    cols.forEach(function (_, ci) {
      var v = matrix[ri][ci];
      h += '<td style="background:' + heat(v) + '">' + v + '</td>';
    });
    h += '</tr>';
  });
  h += '</tbody></table>';
  root.innerHTML = h;
};

HWReport.baseLegend = function () {
  var c = HWReport.COLORS;
  return (
    '<span class="leg"><span class="leg-sq" style="background:' + c.BLUE + '"></span>Base</span>' +
    '<span class="leg"><span class="leg-sq" style="background:' + c.TEAL + '"></span>Test</span>'
  );
};

function _slugChartFilename(title, fallback) {
  var s = (title || '').trim().replace(/[^\w\s-]+/g, '').replace(/\s+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  return s || fallback || 'chart';
}

function _parseCardLegend(card) {
  if (!card) return [];
  var legend = card.querySelector('.legend');
  if (!legend) return [];
  var items = [];
  legend.querySelectorAll('.leg').forEach(function (leg) {
    var sq = leg.querySelector('.leg-sq');
    var color = '#888888';
    if (sq) {
      color = sq.style.background || sq.style.backgroundColor || getComputedStyle(sq).backgroundColor || color;
    }
    items.push({ color: color, label: leg.textContent.trim() });
  });
  return items;
}

HWReport.exportChartImage = function (canvasId) {
  var fontReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  return fontReady.then(function () {
    var chart = HWReport._chartInstances[canvasId];
    if (!chart || !chart.canvas) return Promise.reject(new Error('Chart not found'));
    var src = chart.canvas;
    var card = src.closest('.card');
    var titleEl = card && card.querySelector('.card-title');
    var title = titleEl ? titleEl.textContent.trim() : '';
    var legendItems = _parseCardLegend(card);
    var root = getComputedStyle(document.documentElement);
    var bg = root.getPropertyValue('--surface').trim() || '#ffffff';
    var titleColor = root.getPropertyValue('--text-secondary').trim() || '#6B6A5E';
    var legendColor = root.getPropertyValue('--text-tertiary').trim() || '#767676';
    var scale = Math.max(window.devicePixelRatio || 1, 2);
    var pad = Math.round(16 * scale);
    var gap = Math.round(10 * scale);
    var titleSize = Math.round(13 * scale);
    var legendSize = Math.round(11 * scale);
    var sqSize = Math.round(10 * scale);
    var chartW = src.width;
    var chartH = src.height;
    var off = document.createElement('canvas');
    var ctx = off.getContext('2d');
    ctx.font = '500 ' + titleSize + 'px "DM Sans", sans-serif';
    var titleH = title ? Math.round(titleSize * 1.35) : 0;
    var legendH = legendItems.length ? Math.round(legendSize * 1.5) : 0;
    var contentW = chartW;
    if (title) contentW = Math.max(contentW, ctx.measureText(title).width);
    if (legendItems.length) {
      ctx.font = legendSize + 'px "DM Mono", monospace';
      var legendW = pad;
      legendItems.forEach(function (item, i) {
        legendW += sqSize + Math.round(5 * scale) + ctx.measureText(item.label).width;
        if (i < legendItems.length - 1) legendW += Math.round(10 * scale);
      });
      contentW = Math.max(contentW, legendW - pad);
    }
    off.width = Math.ceil(contentW + 2 * pad);
    off.height = pad + titleH + (legendH ? gap + legendH : 0) + gap + chartH + pad;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, off.width, off.height);
    var y = pad;
    if (title) {
      ctx.fillStyle = titleColor;
      ctx.font = '500 ' + titleSize + 'px "DM Sans", sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText(title, pad, y);
      y += titleH + gap;
    }
    if (legendItems.length) {
      ctx.font = legendSize + 'px "DM Mono", monospace';
      ctx.textBaseline = 'middle';
      var x = pad;
      var legendMid = y + legendH / 2;
      legendItems.forEach(function (item, i) {
        ctx.fillStyle = item.color;
        ctx.fillRect(x, legendMid - sqSize / 2, sqSize, sqSize);
        x += sqSize + Math.round(5 * scale);
        ctx.fillStyle = legendColor;
        ctx.fillText(item.label, x, legendMid);
        x += ctx.measureText(item.label).width + Math.round(10 * scale);
      });
      y += legendH + gap;
    }
    ctx.drawImage(src, pad, y, chartW, chartH);
    return new Promise(function (resolve, reject) {
      off.toBlob(function (blob) {
        if (blob) resolve(blob);
        else reject(new Error('PNG export failed'));
      }, 'image/png');
    });
  });
};

HWReport.downloadChart = function (id) {
  var canvas = document.getElementById(id);
  var card = canvas && canvas.closest('.card');
  var titleEl = card && card.querySelector('.card-title');
  var filename = _slugChartFilename(titleEl ? titleEl.textContent : '', id) + '.png';
  return HWReport.exportChartImage(id).then(function (blob) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  });
};

HWReport.copyChart = function (id, btn) {
  return HWReport.exportChartImage(id).then(function (blob) {
    if (HWReport._copyImage) return HWReport._copyImage(blob, btn);
    return Promise.reject(new Error('Clipboard unavailable'));
  });
};

HWReport.wrapChartCard = function (canvasId) {
  var canvas = document.getElementById(canvasId);
  if (!canvas || !HWReport.initCardChrome) return;
  var card = canvas.closest('.card');
  if (card) HWReport.initCardChrome(card);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _loadRankColors);
} else {
  _loadRankColors();
}
