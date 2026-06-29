window.HWReport = window.HWReport || {};

HWReport.SHOT_NAMES = { z: '0s (Dot)', o: '1s', t: '2s', f: '4s', s: '6s' };

HWReport.SHOT_COLORS = {
  z: HWReport.COLORS.GRAY,
  o: HWReport.COLORS.BLUE,
  t: HWReport.COLORS.TEAL,
  f: HWReport.COLORS.AMBER,
  s: HWReport.COLORS.PURPLE,
};

HWReport.initAbTest = function (DD, opts) {
  opts = opts || {};
  var BR = opts.brackets || ['0-50k', '50k-75k', '75k-100k', '100k+'];
  var BLUE = HWReport.COLORS.BLUE;
  var TEAL = HWReport.COLORS.TEAL;
  var inited = {};
  var subState = { inn: 'overall', i2: 'overall_i2', ss: 'overall', dist: 'overall' };

  function innBody(containerId, key, chartPrefix) {
    var d = DD[key];
    var c = document.getElementById(containerId);
    var wkAvg = (d.wk_pct.reduce(function (a, b) { return a + b; }, 0) / BR.length).toFixed(1);
    var scAvg = (d.sc_pct.reduce(function (a, b) { return a + b; }, 0) / BR.length).toFixed(1);
    var medBase = d.qbase.wk_q50[0];
    var medTest = d.qtest.wk_q50[0];
    var sampleNote = d.sample ? 'n=' + d.sample.join('/') : 'across ' + BR.length + ' brackets';
    var kpis =
      '<div class="kpi-row">' +
      '<div class="kpi-card"><p class="kpi-label">Mean Wickets Δ (avg)</p><p class="kpi-value up">+' + wkAvg + '%</p><p class="kpi-note">' + sampleNote + '</p></div>' +
      '<div class="kpi-card"><p class="kpi-label">Mean Score Δ (avg)</p><p class="kpi-value down">' + scAvg + '%</p><p class="kpi-note">essentially flat</p></div>' +
      '<div class="kpi-card"><p class="kpi-label">Biggest Wickets Δ</p><p class="kpi-value up">+' + Math.max.apply(null, d.wk_pct) + '%</p><p class="kpi-note">' + BR[d.wk_pct.indexOf(Math.max.apply(null, d.wk_pct))] + '</p></div>' +
      '<div class="kpi-card"><p class="kpi-label">Median Wickets (q50)</p><p class="kpi-value neutral">' + medBase + ' → ' + medTest + '</p><p class="kpi-note">q50 bracket 0</p></div>' +
      '</div>';
    c.innerHTML =
      kpis +
      '<div class="two-col"><div class="card"><p class="card-title">Mean Wickets — Base vs Test</p><div class="legend">' + HWReport.baseLegend() + '</div><div class="chart-wrap" style="height:230px"><canvas id="' + chartPrefix + '-wk"></canvas></div></div>' +
      '<div class="card"><p class="card-title">Mean Score — Base vs Test</p><div class="legend">' + HWReport.baseLegend() + '</div><div class="chart-wrap" style="height:230px"><canvas id="' + chartPrefix + '-sc"></canvas></div></div></div>' +
      '<div class="card" style="margin-top:1.25rem"><p class="card-title">Full comparison</p><table class="comp-table"><thead><tr><th>Bracket</th><th class="base">Base Score</th><th class="test">Test Score</th><th class="delta">Δ Score</th><th class="base">Base Wkts</th><th class="test">Test Wkts</th><th class="delta">Δ Wkts</th><th class="base">Base Balls</th><th class="test">Test Balls</th><th>Sample</th></tr></thead><tbody id="' + chartPrefix + '-tb"></tbody></table></div>';
    HWReport.grouped(chartPrefix + '-wk', BR, d.base.wickets, d.test.wickets, BLUE, TEAL);
    HWReport.grouped(chartPrefix + '-sc', BR, d.base.total, d.test.total, BLUE, TEAL);
    var rows = '';
    for (var i = 0; i < BR.length; i++) {
      var ds = d.sc_pct[i];
      var dw = d.wk_pct[i];
      var n = d.sample ? d.sample[i] : '';
      rows +=
        '<tr><td>' + BR[i] + '</td><td>' + d.base.total[i] + '</td><td>' + d.test.total[i] + '</td><td class="' + (ds < 0 ? 'val-down' : 'val-up') + '">' + (ds > 0 ? '+' : '') + ds + '%</td>' +
        '<td>' + d.base.wickets[i] + '</td><td>' + d.test.wickets[i] + '</td><td class="' + (dw > 0 ? 'val-up' : 'val-down') + '">' + (dw > 0 ? '+' : '') + dw + '%</td>' +
        '<td>' + d.base.balls[i] + '</td><td>' + d.test.balls[i] + '</td><td class="val-muted">' + n + '</td></tr>';
    }
    document.getElementById(chartPrefix + '-tb').innerHTML = rows;
  }

  function ssBody(key) {
    var d = DD[key];
    var c = document.getElementById('ss-body');
    c.innerHTML =
      '<div class="two-col"><div class="card"><p class="card-title">Shot Mix — Base vs Test (' + BR[0] + ', share %)</p><div class="chart-wrap" style="height:240px"><canvas id="ss-mix"></canvas></div></div>' +
      '<div class="card"><p class="card-title">Shot Mix Shift by Bracket (percentage points)</p><div class="chart-wrap" style="height:240px"><canvas id="ss-pp"></canvas></div></div></div>' +
      '<div class="card" style="margin-top:1.25rem"><p class="card-title">Shot Mix % and pp shift — all brackets</p><table class="heatmap-table" id="ss-hm"></table></div>';
    HWReport.stackedMix('ss-mix', d.mix_base, d.mix_test, HWReport.SHOT_NAMES, HWReport.SHOT_COLORS);
    HWReport.ppGrouped('ss-pp', BR, d.mix_pp, HWReport.SHOT_NAMES, HWReport.SHOT_COLORS);
    var keys = ['z', 'o', 't', 'f', 's'];
    var h = '<thead><tr><th>Bracket</th>';
    keys.forEach(function (k) {
      h += '<th>' + HWReport.SHOT_NAMES[k] + ' Base</th><th>' + HWReport.SHOT_NAMES[k] + ' Test</th><th>Δpp</th>';
    });
    h += '</tr></thead><tbody>';
    for (var i = 0; i < BR.length; i++) {
      h += '<tr><td>' + BR[i] + '</td>';
      keys.forEach(function (k) {
        var b = d.mix_base[k][i];
        var t = d.mix_test[k][i];
        var pp = d.mix_pp[k][i];
        var cls = pp > 0.3 ? 'pp-pos' : pp < -0.3 ? 'pp-neg' : 'pp-flat';
        h += '<td>' + b.toFixed(1) + '%</td><td>' + t.toFixed(1) + '%</td><td class="' + cls + '">' + (pp > 0 ? '+' : '') + pp + '</td>';
      });
      h += '</tr>';
    }
    h += '</tbody>';
    document.getElementById('ss-hm').innerHTML = h;
  }

  function distBody(key) {
    var d = DD[key];
    var c = document.getElementById('dist-body');
    c.innerHTML =
      '<div class="card"><p class="card-title">Wicket Quartiles — Base → Test (absolute)</p><table class="heatmap-table" id="dist-wk"></table></div>' +
      '<div class="card" style="margin-top:1.25rem"><p class="card-title">Score Quartiles — Base → Test (absolute)</p><table class="heatmap-table" id="dist-sc"></table></div>' +
      '<div style="margin-top:1rem" class="insights"><div class="insight warn"><strong>The median tells the real story:</strong> Across every bracket, the median (q50) wickets is unchanged base→test. Even q75 and q90 barely move. The mean ticks up because of a small shift in the right tail, but the typical match sees the same number of wickets as before.</div></div>';
    var wq = [['q25', 'wk_q25'], ['q50 (median)', 'wk_q50'], ['q75', 'wk_q75'], ['q90', 'wk_q90']];
    var hw = '<thead><tr><th>Bracket</th>';
    wq.forEach(function (q) { hw += '<th>' + q[0] + '</th>'; });
    hw += '</tr></thead><tbody>';
    for (var i = 0; i < BR.length; i++) {
      hw += '<tr><td>' + BR[i] + '</td>';
      wq.forEach(function (q) {
        var b = d.qbase[q[1]][i];
        var t = d.qtest[q[1]][i];
        var same = b === t;
        hw += '<td class="' + (same ? 'pp-flat' : t > b ? 'pp-pos' : 'pp-neg') + '">' + b + ' → ' + t + '</td>';
      });
      hw += '</tr>';
    }
    hw += '</tbody>';
    document.getElementById('dist-wk').innerHTML = hw;
    var sq = [['q25', 'tot_q25'], ['q50 (median)', 'tot_q50'], ['q75', 'tot_q75'], ['q90', 'tot_q90']];
    var hs = '<thead><tr><th>Bracket</th>';
    sq.forEach(function (q) { hs += '<th>' + q[0] + '</th>'; });
    hs += '</tr></thead><tbody>';
    for (var j = 0; j < BR.length; j++) {
      hs += '<tr><td>' + BR[j] + '</td>';
      sq.forEach(function (q) {
        var b2 = d.qbase[q[1]][j];
        var t2 = d.qtest[q[1]][j];
        hs += '<td class="' + (b2 === t2 ? 'pp-flat' : t2 > b2 ? 'pp-pos' : 'pp-neg') + '">' + b2 + ' → ' + t2 + '</td>';
      });
      hs += '</tr>';
    }
    hs += '</tbody>';
    document.getElementById('dist-sc').innerHTML = hs;
  }

  window.switchSub = function (group, key, btn) {
    subState[group] = key;
    HWReport.setSubActive(btn);
    if (group === 'inn') innBody('inn-body', key, 'inn');
    if (group === 'i2') innBody('i2-body', key, 'i2');
    if (group === 'ss') ssBody(key);
    if (group === 'dist') distBody(key);
  };

  HWReport._tabSwitchHandler = function (name) {
    if (name === 'overview' && !inited.ov) {
      inited.ov = 1;
      HWReport.grouped('ov-wk', BR, DD.overall.base.wickets, DD.overall.test.wickets, BLUE, TEAL);
      HWReport.grouped('ov-sc', BR, DD.overall.base.total, DD.overall.test.total, BLUE, TEAL);
    }
    if (name === 'innings' && !inited.inn) { inited.inn = 1; innBody('inn-body', 'overall', 'inn'); }
    if (name === 'init2' && !inited.i2) { inited.i2 = 1; innBody('i2-body', 'overall_i2', 'i2'); }
    if (name === 'shotsel' && !inited.ss) { inited.ss = 1; ssBody('overall'); }
    if (name === 'dist' && !inited.dist) { inited.dist = 1; distBody('overall'); }
    if (name === 'method' && !inited.method && opts.renderMethodology) {
      inited.method = 1;
      opts.renderMethodology(DD, BR);
    }
  };

  HWReport.grouped('ov-wk', BR, DD.overall.base.wickets, DD.overall.test.wickets, BLUE, TEAL);
  HWReport.grouped('ov-sc', BR, DD.overall.base.total, DD.overall.test.total, BLUE, TEAL);
  inited.ov = 1;
};
