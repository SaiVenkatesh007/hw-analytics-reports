window.HWReport = window.HWReport || {};

HWReport.charts = {};

HWReport.COLORS = {
  BLUE: '#378ADD',
  TEAL: '#1D9E75',
  CORAL: '#D85A30',
  AMBER: '#BA7517',
  PURPLE: '#534AB7',
  GRAY: '#9a9a9a',
};

HWReport._tabSwitchHandler = null;

HWReport.switchTab = function (name, btn) {
  document.querySelectorAll('.tab-content').forEach(function (t) {
    t.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
  if (HWReport._tabSwitchHandler) {
    HWReport._tabSwitchHandler(name);
  }
};

HWReport.setSubActive = function (btn) {
  btn.closest('.sub-toggle').querySelectorAll('.sub-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');
};

HWReport.grouped = function (id, labels, d1, d2, c1, c2) {
  if (HWReport.charts[id]) HWReport.charts[id].destroy();
  var ctx = document.getElementById(id);
  if (!ctx) return;
  HWReport.charts[id] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Base', data: d1, backgroundColor: c1 + '99', borderColor: c1, borderWidth: 1, borderRadius: 3 },
        { label: 'Test', data: d2, backgroundColor: c2 + '99', borderColor: c2, borderWidth: 1, borderRadius: 3 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } },
      },
    },
  });
};

HWReport.ppGrouped = function (id, labels, ppObj, shotNames, shotColors) {
  if (HWReport.charts[id]) HWReport.charts[id].destroy();
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
  HWReport.charts[id] = new Chart(ctx, {
    type: 'bar',
    data: { labels: labels, datasets: datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, boxWidth: 10 } },
        tooltip: {
          callbacks: {
            label: function (c) {
              return c.dataset.label + ': ' + (c.parsed.y >= 0 ? '+' : '') + c.parsed.y + 'pp';
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { font: { size: 11 }, callback: function (v) { return (v > 0 ? '+' : '') + v + 'pp'; } },
        },
      },
    },
  });
};

HWReport.stackedMix = function (id, mixBase, mixTest, shotNames, shotColors) {
  if (HWReport.charts[id]) HWReport.charts[id].destroy();
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
  HWReport.charts[id] = new Chart(ctx, {
    type: 'bar',
    data: { labels: ['Base', 'Test'], datasets: datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: { legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, boxWidth: 10 } } },
      scales: {
        x: {
          stacked: true,
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: { callback: function (v) { return v + '%'; }, font: { size: 11 } },
        },
        y: { stacked: true, grid: { display: false } },
      },
    },
  });
};

HWReport.baseLegend = function () {
  return (
    '<span class="leg"><span class="leg-sq" style="background:#378ADD"></span>Base</span>' +
    '<span class="leg"><span class="leg-sq" style="background:#1D9E75"></span>Test</span>'
  );
};

HWReport.initChrome = function () {
  if (document.querySelector('.report-list')) return;
  var header = document.querySelector('header');
  if (header && !header.querySelector('.back-to-index')) {
    var brand = header.querySelector('.brand');
    var link = document.createElement('a');
    link.href = 'index.html';
    link.className = 'back-to-index';
    link.textContent = '← All reports';
    if (brand) {
      var left = document.createElement('div');
      left.className = 'header-left';
      header.insertBefore(left, brand);
      left.appendChild(link);
      left.appendChild(brand);
    } else {
      header.insertBefore(link, header.firstChild);
    }
  }
  var footer = document.querySelector('footer');
  if (footer && !footer.querySelector('.footer-nav')) {
    var nav = document.createElement('p');
    nav.className = 'footer-nav';
    var flink = document.createElement('a');
    flink.href = 'index.html';
    flink.className = 'back-to-index';
    flink.textContent = '← Back to all reports';
    nav.appendChild(flink);
    footer.insertBefore(nav, footer.firstChild);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  HWReport.initChrome();
});
