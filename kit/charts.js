window.HWReport = window.HWReport || {};

HWReport.charts = HWReport.charts || {};

HWReport.COLORS = {
  BLUE: '#3A8FD4',
  TEAL: '#1E8F5E',
  CORAL: '#C0392B',
  AMBER: '#BA7517',
  PURPLE: '#6C4AB6',
  GRAY: '#767676',
};

HWReport._chartInstances = HWReport._chartInstances || {};

function _chartStore(id, chart) {
  if (HWReport._chartInstances[id]) HWReport._chartInstances[id].destroy();
  HWReport._chartInstances[id] = chart;
  HWReport.charts[id] = chart;
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

function _pluginOpts(extra) {
  var t = HWReport.theme.getChartTheme();
  var plugins = {
    legend: {
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
  if (extra) Object.keys(extra).forEach(function (k) { plugins[k] = extra[k]; });
  return { plugins: plugins };
}

HWReport.charts.scaleOpts = _scaleOpts;
HWReport.charts.pluginOpts = _pluginOpts;

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
    chart.update('none');
  });
};

HWReport.grouped = function (id, labels, d1, d2, c1, c2) {
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var opts = _pluginOpts({ legend: { display: false } });
  _chartStore(id, new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Base', data: d1, backgroundColor: c1 + '99', borderColor: c1, borderWidth: 1, borderRadius: 3 },
        { label: 'Test', data: d2, backgroundColor: c2 + '99', borderColor: c2, borderWidth: 1, borderRadius: 3 },
      ],
    },
    options: Object.assign({ responsive: true, maintainAspectRatio: false, scales: _scaleOpts() }, opts),
  }));
};

HWReport.ppGrouped = function (id, labels, ppObj, shotNames, shotColors) {
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var keys = ['z', 'o', 't', 'f', 's'];
  var datasets = keys.map(function (k) {
    return {
      label: shotNames[k],
      data: ppObj[k],
      backgroundColor: shotColors[k] + '99',
      borderColor: shotColors[k],
      borderWidth: 1,
      borderRadius: 2,
    };
  });
  var opts = _pluginOpts({
    legend: { display: true, position: 'bottom' },
    tooltip: {
      callbacks: {
        label: function (c) {
          return c.dataset.label + ': ' + (c.parsed.y >= 0 ? '+' : '') + c.parsed.y + 'pp';
        },
      },
    },
  });
  var scales = _scaleOpts();
  scales.y.ticks.callback = function (v) { return (v > 0 ? '+' : '') + v + 'pp'; };
  _chartStore(id, new Chart(ctx, {
    type: 'bar',
    data: { labels: labels, datasets: datasets },
    options: Object.assign({ responsive: true, maintainAspectRatio: false, scales: scales }, opts),
  }));
};

HWReport.stackedMix = function (id, mixBase, mixTest, shotNames, shotColors) {
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var keys = ['z', 'o', 't', 'f', 's'];
  var datasets = keys.map(function (k) {
    return {
      label: shotNames[k],
      data: [mixBase[k][0], mixTest[k][0]],
      backgroundColor: shotColors[k] + 'bb',
      borderColor: shotColors[k],
      borderWidth: 1,
    };
  });
  var scales = _scaleOpts();
  scales.x.stacked = true;
  scales.y = { stacked: true, grid: { display: false }, ticks: { color: scales.y.ticks.color, font: scales.y.ticks.font } };
  scales.x.ticks.callback = function (v) { return v + '%'; };
  var opts = _pluginOpts({ legend: { display: true, position: 'bottom' } });
  _chartStore(id, new Chart(ctx, {
    type: 'bar',
    data: { labels: ['Base', 'Test'], datasets: datasets },
    options: Object.assign({ responsive: true, maintainAspectRatio: false, indexAxis: 'y', scales: scales }, opts),
  }));
};

HWReport.dualBar = function (id, labels, closeData, oneSidedData, opts) {
  if (typeof opts === 'string') {
    opts = { label1: opts, label2: arguments[5], ymax: arguments[6] };
  }
  opts = opts || {};
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var c = HWReport.COLORS;
  var scales = _scaleOpts();
  scales.y.min = opts.ymin != null ? opts.ymin : 0;
  scales.y.max = opts.ymax != null ? opts.ymax : 70;
  scales.y.ticks.callback = function (v) { return v + '%'; };
  var chartOpts = _pluginOpts({ legend: { display: true, position: 'bottom' } });
  _chartStore(id, new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: opts.label1 || 'Close %', data: closeData, backgroundColor: c.BLUE + '99', borderColor: c.BLUE, borderWidth: 1, borderRadius: 3 },
        { label: opts.label2 || 'One-sided %', data: oneSidedData, backgroundColor: c.CORAL + '99', borderColor: c.CORAL, borderWidth: 1, borderRadius: 3 },
      ],
    },
    options: Object.assign({ responsive: true, maintainAspectRatio: false, scales: scales }, chartOpts),
  }));
};

HWReport.lineChart = function (id, labels, datasets, yOpts) {
  yOpts = yOpts || {};
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var scales = _scaleOpts();
  if (yOpts.min != null) scales.y.min = yOpts.min;
  if (yOpts.max != null) scales.y.max = yOpts.max;
  scales.y.ticks.callback = yOpts.tickCallback || function (v) { return v + '%'; };
  var showLegend = datasets.length > 1;
  var chartOpts = _pluginOpts({ legend: { display: showLegend, position: 'bottom' } });
  _chartStore(id, new Chart(ctx, {
    type: 'line',
    data: { labels: labels, datasets: datasets },
    options: Object.assign({ responsive: true, maintainAspectRatio: false, scales: scales }, chartOpts),
  }));
};

HWReport.lineChartSimple = function (id, labels, data, label, color, yOpts) {
  HWReport.lineChart(id, labels, [{
    label: label,
    data: data,
    borderColor: color,
    backgroundColor: color + '33',
    tension: 0.3,
    fill: true,
    pointRadius: 4,
  }], yOpts || { min: 30, max: 75 });
};

HWReport.singleBar = function (id, labels, data, color, yOpts) {
  yOpts = yOpts || {};
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var scales = _scaleOpts();
  scales.x.ticks.maxRotation = 45;
  scales.y.min = yOpts.min != null ? yOpts.min : 0;
  scales.y.max = yOpts.max != null ? yOpts.max : 100;
  scales.y.ticks.callback = yOpts.tickCallback || function (v) { return v + '%'; };
  var chartOpts = _pluginOpts({ legend: { display: false } });
  _chartStore(id, new Chart(ctx, {
    type: 'bar',
    data: { labels: labels, datasets: [{ label: yOpts.label || 'Value', data: data, backgroundColor: color + '99', borderColor: color, borderWidth: 1, borderRadius: 3 }] },
    options: Object.assign({ responsive: true, maintainAspectRatio: false, scales: scales }, chartOpts),
  }));
};

HWReport.donut = function (id, labels, data, colors) {
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var chartOpts = _pluginOpts({ legend: { display: true, position: 'bottom' } });
  _chartStore(id, new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{ data: data, backgroundColor: colors, borderWidth: 0 }],
    },
    options: Object.assign({ responsive: true, maintainAspectRatio: false, cutout: '62%' }, chartOpts),
  }));
};

HWReport.horizontalRankedBar = function (id, labels, data, color) {
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var scales = _scaleOpts();
  scales.x.grid.display = true;
  scales.y.grid.display = false;
  var chartOpts = _pluginOpts({ legend: { display: false } });
  _chartStore(id, new Chart(ctx, {
    type: 'bar',
    data: { labels: labels, datasets: [{ data: data, backgroundColor: color + '99', borderColor: color, borderWidth: 1, borderRadius: 3 }] },
    options: Object.assign({ responsive: true, maintainAspectRatio: false, indexAxis: 'y', scales: scales }, chartOpts),
  }));
};

HWReport.sparkline = function (id, data, color) {
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var scales = _scaleOpts();
  scales.x.display = false;
  scales.y.display = false;
  _chartStore(id, new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(function (_, i) { return i; }),
      datasets: [{ data: data, borderColor: color, backgroundColor: color + '22', borderWidth: 1.5, pointRadius: 0, tension: 0.35, fill: true }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: scales },
  }));
};

HWReport.scatter = function (id, points, color, xLabel, yLabel) {
  var ctx = document.getElementById(id);
  if (!ctx) return;
  var scales = _scaleOpts();
  if (xLabel) scales.x.title = { display: true, text: xLabel, color: scales.x.ticks.color, font: { size: 11 } };
  if (yLabel) scales.y.title = { display: true, text: yLabel, color: scales.y.ticks.color, font: { size: 11 } };
  var chartOpts = _pluginOpts({ legend: { display: false } });
  _chartStore(id, new Chart(ctx, {
    type: 'scatter',
    data: { datasets: [{ data: points, backgroundColor: color + '99', borderColor: color, pointRadius: 4 }] },
    options: Object.assign({ responsive: true, maintainAspectRatio: false, scales: scales }, chartOpts),
  }));
};

HWReport.baseLegend = function () {
  var c = HWReport.COLORS;
  return (
    '<span class="leg"><span class="leg-sq" style="background:' + c.BLUE + '"></span>Base</span>' +
    '<span class="leg"><span class="leg-sq" style="background:' + c.TEAL + '"></span>Test</span>'
  );
};

HWReport.downloadChart = function (id) {
  var chart = HWReport._chartInstances[id];
  if (!chart) return;
  var url = chart.canvas.toDataURL('image/png');
  var a = document.createElement('a');
  a.href = url;
  a.download = id + '.png';
  a.click();
};

HWReport.wrapChartCard = function (canvasId, title) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;
  var card = canvas.closest('.card');
  if (!card || card.querySelector('.chart-download-btn')) return;
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'chrome-btn chart-download-btn';
  btn.textContent = 'PNG';
  btn.setAttribute('aria-label', 'Download chart as PNG');
  btn.addEventListener('click', function () { HWReport.downloadChart(canvasId); });
  var titleEl = card.querySelector('.card-title');
  if (titleEl) {
    var row = document.createElement('div');
    row.className = 'card-title-row';
    titleEl.parentNode.insertBefore(row, titleEl);
    row.appendChild(titleEl);
    row.appendChild(btn);
  }
};
