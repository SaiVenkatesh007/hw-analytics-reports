window.HWReport = window.HWReport || {};

HWReport.initWhaleMm = function () {
  if (HWReport._whaleMmInit) return;
  HWReport._whaleMmInit = true;

  const ranks = ['Rookie','Challenger','Proven','Accomplished','Remarkable'];
  const gc = '#e5e5e0', tc = '#5a5a5a';

  const D = {
    '5day': {
      label: 'May 31 – Jun 4 (5-Day)', comp: 'vs May 24–28',
      base_post:   [5559, 2711, 2207, 2092, 1022],
      base_pct_pre:[5.7, 6.1, 9.0, 10.4, 8.9],
      base_pct_post:[6.2, 6.1, 10.0, 11.1, 9.1],
      pratio_whale_pre: [1.02,1.00,0.99,0.99,0.97],
      pratio_whale_post:[0.85,0.89,0.88,0.87,0.87],
      pratio_nw_pre: [1.01,1.01,1.00,0.99,1.00],
      pratio_nw_post:[1.01,1.02,1.01,1.01,1.01],
      wr_all_pre:   [65.1,60.8,62.5,63.3,55.6],
      wr_all_post:  [74.9,71.2,72.5,74.2,69.2],
      wr_ru_pre:    [38.8,40.3,42.8,43.0,44.2],
      wr_ru_post:   [63.1,62.3,64.5,67.5,66.8],
      quit_opp_whale_pre: [3.2,5.5,6.5,6.9,7.6],
      quit_opp_whale_post:[6.4,9.8,12.3,14.2,14.9],
      quit_opp_nw_pre:    [2.8,3.7,5.3,6.4,7.8],
      quit_opp_nw_post:   [2.8,3.4,5.1,6.3,7.9],
      quit_self_whale_pre: [4.3,6.4,7.1,7.6,7.6],
      quit_self_whale_post:[2.3,4.6,4.6,4.4,4.7],
      quit_self_nw_pre:    [3.0,4.0,5.0,5.8,7.3],
      quit_self_nw_post:   [3.3,4.5,5.7,6.6,8.5],
      league_whale_pre: [62.7,64.5,63.7,61.8,59.9],
      league_whale_post:[64.9,66.9,63.9,60.9,60.1],
      league_nw_pre:    [58.8,49.2,46.8,44.1,45.8],
      league_nw_post:   [60.6,51.8,48.0,45.1,45.0],
      pvp_whale_pre:    [3.9,3.8,4.6,4.8,4.9],
      pvp_whale_post:   [4.2,4.1,4.8,5.3,5.7],
      lge_whale_pre:    [2.8,2.9,3.0,2.9,2.9],
      lge_whale_post:   [2.8,3.0,2.9,2.7,2.7],
      time_whale_pre:   [55.3,58.5,64.8,63.4,68.9],
      time_whale_post:  [56.7,59.0,65.4,65.9,72.8],
      time_nw_pre:      [60.6,57.3,60.5,62.0,64.0],
      time_nw_post:     [62.0,59.2,61.8,63.4,65.5],
      ndr_whale_pre:    [64.2,70.0,78.2,79.0,78.8],
      ndr_whale_post:   [66.2,73.0,79.8,81.2,79.8],
      ndr_nw_pre:       [58.8,73.0,77.5,79.0,80.0],
      ndr_nw_post:      [58.0,73.0,77.8,78.8,80.8],
      whalesfaced_mean: [1,1,1,1,2],
      whalesfaced_q50:  [1,1,1,1,1],
      whalesfaced_q90:  [2,2,2,2,3],
      payer_pct:        [24.1,32.6,37.4,39.4,49.8],
      payer_1plus_pct:  [6.7,11.9,15.5,18.1,31.1],
      has_selfquit: true, has_ndr: true, has_whalesfaced: true, has_payermix: true
    },
    day1: {
      label: 'May 31 (Day 1)', comp: 'vs May 24',
      base_post:   [2033, 1231, 1176, 1220, 631],
      base_pct_pre:[5.4, 5.8, 8.9, 10.0, 8.8],
      base_pct_post:[5.3, 5.0, 9.0, 10.3, 8.5],
      pratio_whale_pre: [1.02,1.00,0.99,0.99,0.97],
      pratio_whale_post:[0.84,0.88,0.87,0.87,0.86],
      pratio_nw_pre: [1.01,1.01,1.00,0.99,1.00],
      pratio_nw_post:[1.01,1.02,1.01,1.01,1.02],
      wr_all_pre:   [64.8,62.0,62.1,62.8,54.6],
      wr_all_post:  [76.2,70.9,73.4,76.1,71.1],
      wr_ru_pre:    [41.1,44.7,43.3,44.9,48.1],
      wr_ru_post:   [68.3,64.3,66.4,70.9,69.1],
      quit_opp_whale_pre: [3.3,6.5,7.2,7.9,8.1],
      quit_opp_whale_post:[7.5,10.0,12.5,16.0,15.8],
      quit_opp_nw_pre:    [3.0,4.0,5.6,7.1,8.4],
      quit_opp_nw_post:   [3.2,3.7,5.4,6.9,8.5],
      league_whale_pre: [65.2,67.2,68.9,68.5,69.7],
      league_whale_post:[63.3,59.6,57.1,54.2,49.8],
      league_nw_pre:    [58.8,51.2,49.9,47.6,50.8],
      league_nw_post:   [59.1,48.7,44.4,40.8,39.8],
      pvp_whale_pre:    [3.9,3.9,4.5,5.1,5.0],
      pvp_whale_post:   [4.1,4.0,4.4,5.1,5.7],
      lge_whale_pre:    [3.1,3.1,3.3,3.4,3.7],
      lge_whale_post:   [2.8,2.7,2.9,2.9,2.9],
      time_whale_pre:   [58.1,61.0,67.5,67.8,78.4],
      time_whale_post:  [57.1,55.7,61.3,62.1,71.2],
      time_nw_pre:      [60.8,59.1,62.1,64.3,66.9],
      time_nw_post:     [60.1,56.7,59.4,60.6,63.1],
      has_selfquit: false, has_ndr: false, has_whalesfaced: false, has_payermix: false
    },
    '3day': {
      label: 'May 31 – Jun 2 (3-Day)', comp: 'vs May 24–26',
      base_post:   [4126, 2227, 1852, 1795, 901],
      base_pct_pre:[5.6, 6.0, 9.0, 10.3, 8.8],
      base_pct_post:[6.0, 5.9, 9.8, 10.9, 9.0],
      pratio_whale_pre: [1.02,1.00,0.99,0.99,0.98],
      pratio_whale_post:[0.84,0.89,0.88,0.87,0.87],
      pratio_nw_pre: [1.01,1.01,1.00,0.99,1.00],
      pratio_nw_post:[1.01,1.02,1.01,1.01,1.02],
      wr_all_pre:   [65.3,61.5,63.3,63.7,55.9],
      wr_all_post:  [75.0,70.9,72.8,74.6,69.4],
      wr_ru_pre:    [39.1,41.3,42.5,43.6,46.0],
      wr_ru_post:   [64.8,63.5,64.6,67.8,67.4],
      quit_opp_whale_pre: [3.1,5.8,6.8,7.0,7.7],
      quit_opp_whale_post:[6.7,10.1,12.4,14.4,14.8],
      quit_opp_nw_pre:    [2.9,3.7,5.4,6.5,7.9],
      quit_opp_nw_post:   [2.9,3.4,5.0,6.4,7.9],
      quit_self_whale_pre: [4.5,6.3,7.2,7.6,7.5],
      quit_self_whale_post:[2.0,4.4,4.5,4.3,4.4],
      quit_self_nw_pre:    [2.9,4.0,5.0,5.9,7.5],
      quit_self_nw_post:   [3.2,4.5,5.6,6.5,8.5],
      league_whale_pre: [63.0,63.9,62.7,60.6,59.8],
      league_whale_post:[64.6,65.6,62.3,58.6,57.3],
      league_nw_pre:    [58.8,49.0,46.6,43.5,44.7],
      league_nw_post:   [60.1,51.2,47.0,43.8,43.1],
      pvp_whale_pre:    [3.9,3.9,4.6,5.0,4.9],
      pvp_whale_post:   [4.2,4.1,4.8,5.3,5.6],
      lge_whale_pre:    [2.8,2.9,3.0,2.9,2.9],
      lge_whale_post:   [2.8,3.0,3.0,2.8,2.8],
      time_whale_pre:   [55.7,58.8,64.6,64.6,70.2],
      time_whale_post:  [57.8,59.7,66.0,65.8,74.3],
      time_nw_pre:      [60.7,57.7,60.3,62.2,64.5],
      time_nw_post:     [61.5,59.3,61.9,63.6,65.8],
      ndr_whale_pre:    [64.0,67.5,78.0,78.5,77.0],
      ndr_whale_post:   [65.0,72.5,79.5,80.5,79.0],
      ndr_nw_pre:       [58.0,72.5,77.5,78.5,79.5],
      ndr_nw_post:      [56.5,72.0,77.0,77.5,80.5],
      whalesfaced_mean: [1,1,1,1,2],
      whalesfaced_q50:  [1,1,1,1,1],
      whalesfaced_q90:  [2,2,2,2,3],
      has_selfquit: true, has_ndr: true, has_whalesfaced: true
    }
  };

  const baseOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: tc, font: { size: 11 }, maxRotation: 0 }, grid: { color: gc } },
      y: { ticks: { color: tc, font: { size: 11 } }, grid: { color: gc } }
    }
  };



  function pct(v) { return v.toFixed(1) + '%'; }
  function pr(v)  { return v.toFixed(2); }

  function deltaClass(v) { return v > 0 ? 'up' : v < 0 ? 'down' : 'flat'; }
  function deltaStr(v, decimals=1) { const s = v > 0 ? '+' : ''; return s + v.toFixed(decimals); }

  function destroyAll() {
    Object.keys(HWReport.charts).forEach(function (k) {
      if (HWReport.charts[k]) HWReport.charts[k].destroy();
      delete HWReport.charts[k];
    });
  }

  function buildChart(id, config) {
    const el = document.getElementById(id);
    if (!el) return;
    HWReport.charts[id] = new Chart(el, config);
  }

  function renderKPIs(d) {
    const row = document.getElementById('kpiRow');
    const wrDelta = (d.wr_ru_post.reduce((a,b)=>a+b,0)/5 - d.wr_ru_pre.reduce((a,b)=>a+b,0)/5).toFixed(0);
    const pratioAvg = (d.pratio_whale_post.reduce((a,b)=>a+b,0)/5).toFixed(2);
    const leagueDelta = ((d.league_whale_post.reduce((a,b)=>a+b,0)/5) - (d.league_whale_pre.reduce((a,b)=>a+b,0)/5)).toFixed(1);
    const ndrLine = d.has_ndr
      ? `<div class="kpi-card"><p class="kpi-label">Whale PvP NDR</p><p class="kpi-value up">+1.5pp</p><p class="kpi-note">69% → 70.5% overall</p></div>`
      : `<div class="kpi-card"><p class="kpi-label">Opp quit rate</p><p class="kpi-value down">~2×</p><p class="kpi-note">expected — weaker opps forfeit</p></div>`;
    const selfLine = d.has_selfquit
      ? `<div class="kpi-card"><p class="kpi-label">Whale self-quit ↓</p><p class="kpi-value up">−3–5pp</p><p class="kpi-note">whales playing through matches</p></div>`
      : `<div class="kpi-card"><p class="kpi-label">Non-whale PRatio</p><p class="kpi-value neutral">1.01</p><p class="kpi-note">unchanged — surgical change</p></div>`;
    row.innerHTML = `
      <div class="kpi-card"><p class="kpi-label">Whale real-user WR avg</p><p class="kpi-value up">+${wrDelta}pp</p><p class="kpi-note">sub-50% → 64–68% across ranks</p></div>
      <div class="kpi-card"><p class="kpi-label">Whale PRatio (real users)</p><p class="kpi-value down">${pratioAvg}</p><p class="kpi-note">was ~0.99 · opponents weaker ✓</p></div>
      <div class="kpi-card"><p class="kpi-label">Non-whale PRatio</p><p class="kpi-value neutral">1.01</p><p class="kpi-note">unchanged · change is surgical</p></div>
      ${selfLine}
      <div class="kpi-card"><p class="kpi-label">Whale league adoption</p><p class="kpi-value down">${leagueDelta}pp avg</p><p class="kpi-note">shifting to PvP as intended</p></div>
    `;
  }

  function renderInsights(id, htmlArr) {
    document.getElementById(id).innerHTML = htmlArr.join('');
  }

  function ins(cls, html) { return `<div class="insight ${cls}">${html}</div>`; }

  function buildWRTable(d) {
    const tbl = document.getElementById('tbl_wr');
    const rows = ranks.map((r,i) => {
      const allD = (d.wr_all_post[i] - d.wr_all_pre[i]).toFixed(1);
      const ruD  = (d.wr_ru_post[i]  - d.wr_ru_pre[i]).toFixed(1);
      return `<tr>
        <td><span class="rank-badge rank-${r}">${r}</span></td>
        <td class="val-muted">${d.wr_all_pre[i]}%</td><td class="val-up">${d.wr_all_post[i].toFixed(1)}%</td><td><span class="delta-pill up">+${allD}pp</span></td>
        <td class="val-down">${d.wr_ru_pre[i]}%</td><td class="val-up">${d.wr_ru_post[i].toFixed(1)}%</td><td><span class="delta-pill up">+${ruD}pp</span></td>
      </tr>`;
    }).join('');
    tbl.innerHTML = `<thead>
      <tr><th>Rank</th><th colspan="3" style="text-align:center;padding-bottom:4px">All Matches WR</th><th colspan="3" style="text-align:center;padding-bottom:4px">Real-User WR ★</th></tr>
      <tr><th></th><th class="pre">Pre</th><th class="post">Post</th><th class="delta">Δ</th><th class="pre">Pre</th><th class="post">Post</th><th class="delta">Δ</th></tr>
    </thead><tbody>${rows}</tbody>`;
  }

  function buildMatchesTable(d) {
    const tbl = document.getElementById('tbl_matches');
    const rows = ranks.map((r,i) => {
      const pvpD = (d.pvp_whale_post[i] - d.pvp_whale_pre[i]).toFixed(1);
      const lgeD = (d.lge_whale_post[i] - d.lge_whale_pre[i]).toFixed(1);
      const pvpCls = pvpD >= 0 ? 'up' : 'down';
      const lgeCls = lgeD <= 0 ? 'up' : 'down';
      return `<tr>
        <td><span class="rank-badge rank-${r}">${r}</span></td>
        <td>${d.pvp_whale_pre[i]}</td><td class="val-${pvpCls}">${d.pvp_whale_post[i]}</td><td><span class="delta-pill ${pvpCls}">${pvpD >= 0 ? '+' : ''}${pvpD}</span></td>
        <td>${d.lge_whale_pre[i]}</td><td class="val-down">${d.lge_whale_post[i]}</td><td><span class="delta-pill up">${lgeD}</span></td>
      </tr>`;
    }).join('');
    tbl.innerHTML = `<thead>
      <tr><th>Rank</th><th colspan="3" style="text-align:center;padding-bottom:4px">PvP Matches/Day</th><th colspan="3" style="text-align:center;padding-bottom:4px">League Matches/Day</th></tr>
      <tr><th></th><th class="pre">Pre</th><th class="post">Post</th><th class="delta">Δ</th><th class="pre">Pre</th><th class="post">Post</th><th class="delta">Δ</th></tr>
    </thead><tbody>${rows}</tbody>`;
  }

  function render(key) {
    const d = D[key];
    destroyAll();

    // caveat + meta
    document.getElementById('compLabel').textContent = d.comp;
    document.getElementById('caveatText').textContent = key === '5day'
      ? '5-day post-change read (May 31 – Jun 4) vs May 24–28. Signals have stabilised.'
      : key === '3day'
      ? '3-day post-change read (May 31 – Jun 2) vs May 24–26. Signals are stabilising but continue monitoring.'
      : '1 day of post-change data — directional signals only. Continue monitoring for stabilisation.';
    document.getElementById('footerLabel').textContent = key === '5day'
      ? 'Post: May 31 – Jun 4 vs Pre: May 24–28'
      : key === '3day'
      ? 'Post: May 31 – Jun 2 vs Pre: May 24–26'
      : 'Post: May 31 vs Pre: May 24 · 1-day window';

    // section numbering
    const hasNDR = d.has_ndr;
    const hasPayerMix = d.has_payermix;
    document.getElementById('timespent_num').textContent = hasNDR ? (hasPayerMix ? '07 — Time spent' : '07 — Time spent') : '06 — Time spent';
    document.getElementById('openq_num').textContent = hasPayerMix ? '10 — Open questions' : hasNDR ? '09 — Open questions' : '07 — Open questions';
    document.getElementById('ndr_section').classList.toggle('hidden', !hasNDR);
    document.getElementById('whalesfaced_section').classList.toggle('hidden', !d.has_whalesfaced);
    document.getElementById('payermix_section').classList.toggle('hidden', !d.has_payermix);


    renderKPIs(d);
    buildWRTable(d);
    buildMatchesTable(d);

    // ── CHARTS ──
    buildChart('c_base_post', { type:'bar', data:{ labels:ranks, datasets:[{ data:d.base_post, backgroundColor:['#85B7EB','#7AC8D9','#5CC7A4','#D4A017','#D07050'], borderRadius:4 }]}, options:{...baseOpts, plugins:{legend:{display:false}, tooltip:{callbacks:{label:ctx=>` ${ctx.parsed.y.toLocaleString()} whales`}}}} });

    buildChart('c_base_pct', { type:'bar', data:{ labels:ranks, datasets:[
      {label:'Pre', data:d.base_pct_pre, backgroundColor:'#D85A30', borderRadius:4},
      {label:'Post', data:d.base_pct_post, backgroundColor:'#1D9E75', borderRadius:4}
    ]}, options:{...baseOpts, scales:{x:baseOpts.scales.x, y:{...baseOpts.scales.y, max:14, ticks:{...baseOpts.scales.y.ticks, callback:v=>v+'%'}}}, plugins:{legend:{display:false}, tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`}}}} });

    buildChart('c_pratio_whale', { type:'bar', data:{ labels:ranks, datasets:[
      {label:'Pre', data:d.pratio_whale_pre, backgroundColor:'#D85A30', borderRadius:4},
      {label:'Post', data:d.pratio_whale_post, backgroundColor:'#1D9E75', borderRadius:4}
    ]}, options:{...baseOpts, scales:{x:baseOpts.scales.x, y:{...baseOpts.scales.y, min:0.7, max:1.1, ticks:{...baseOpts.scales.y.ticks, callback:v=>v.toFixed(2)}}}, plugins:{legend:{display:false}, tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}`}}}} });

    buildChart('c_pratio_nonwhale', { type:'bar', data:{ labels:ranks, datasets:[
      {label:'Pre', data:d.pratio_nw_pre, backgroundColor:'#D85A30', borderRadius:4},
      {label:'Post', data:d.pratio_nw_post, backgroundColor:'#85B7EB', borderRadius:4}
    ]}, options:{...baseOpts, scales:{x:baseOpts.scales.x, y:{...baseOpts.scales.y, min:0.7, max:1.1, ticks:{...baseOpts.scales.y.ticks, callback:v=>v.toFixed(2)}}}, plugins:{legend:{display:false}, tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}`}}}} });

    buildChart('c_wr_whale', { type:'bar', data:{ labels:ranks, datasets:[
      {label:'Pre — All Matches', data:d.wr_all_pre, backgroundColor:'rgba(216,90,48,0.3)', borderRadius:4},
      {label:'Pre — Real-User',   data:d.wr_ru_pre,  backgroundColor:'#D85A30', borderRadius:4},
      {label:'Post — All Matches',data:d.wr_all_post, backgroundColor:'rgba(29,158,117,0.3)', borderRadius:4},
      {label:'Post — Real-User',  data:d.wr_ru_post, backgroundColor:'#1D9E75', borderRadius:4}
    ]}, options:{...baseOpts, plugins:{legend:{display:true, position:'top', labels:{font:{size:11}, color:tc, boxWidth:12, padding:14}}, tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`}}}, scales:{x:baseOpts.scales.x, y:{...baseOpts.scales.y, min:30, max:85, ticks:{...baseOpts.scales.y.ticks, callback:v=>v+'%'}}}} });

    const quitYOpts = { ...baseOpts.scales.y, ticks: { ...baseOpts.scales.y.ticks, callback: v => v + '%' } };

    buildChart('c_quit_opp_whale', { type:'bar', data:{ labels:ranks, datasets:[
      {label:'Pre', data:d.quit_opp_whale_pre, backgroundColor:'#D85A30', borderRadius:4},
      {label:'Post', data:d.quit_opp_whale_post, backgroundColor:'#BA7517', borderRadius:4}
    ]}, options:{...baseOpts, plugins:{legend:{display:false}, tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`}}}, scales:{x:baseOpts.scales.x, y:quitYOpts}} });

    buildChart('c_quit_opp_nw', { type:'bar', data:{ labels:ranks, datasets:[
      {label:'Pre', data:d.quit_opp_nw_pre, backgroundColor:'#D85A30', borderRadius:4},
      {label:'Post', data:d.quit_opp_nw_post, backgroundColor:'#85B7EB', borderRadius:4}
    ]}, options:{...baseOpts, plugins:{legend:{display:false}, tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`}}}, scales:{x:baseOpts.scales.x, y:quitYOpts}} });

    document.getElementById('selfquit_row').classList.toggle('hidden', !d.has_selfquit);
    if (d.has_selfquit) {
      buildChart('c_quit_self_whale', { type:'bar', data:{ labels:ranks, datasets:[
        {label:'Pre', data:d.quit_self_whale_pre, backgroundColor:'#D85A30', borderRadius:4},
        {label:'Post', data:d.quit_self_whale_post, backgroundColor:'#1D9E75', borderRadius:4}
      ]}, options:{...baseOpts, plugins:{legend:{display:false}, tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`}}}, scales:{x:baseOpts.scales.x, y:quitYOpts}} });

      buildChart('c_quit_self_nw', { type:'bar', data:{ labels:ranks, datasets:[
        {label:'Pre', data:d.quit_self_nw_pre, backgroundColor:'#D85A30', borderRadius:4},
        {label:'Post', data:d.quit_self_nw_post, backgroundColor:'#85B7EB', borderRadius:4}
      ]}, options:{...baseOpts, plugins:{legend:{display:false}, tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`}}}, scales:{x:baseOpts.scales.x, y:quitYOpts}} });
    }

    buildChart('c_league', { type:'bar', data:{ labels:ranks, datasets:[
      {label:'Whale Pre',     data:d.league_whale_pre, backgroundColor:'#D4A017', borderRadius:4},
      {label:'Whale Post',    data:d.league_whale_post, backgroundColor:'#BA7517', borderRadius:4},
      {label:'Non-Whale Pre', data:d.league_nw_pre, backgroundColor:'#85B7EB', borderRadius:4},
      {label:'Non-Whale Post',data:d.league_nw_post, backgroundColor:'#185FA5', borderRadius:4}
    ]}, options:{...baseOpts, plugins:{legend:{display:true, position:'top', labels:{font:{size:11}, color:tc, boxWidth:12, padding:14}}, tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`}}}, scales:{x:baseOpts.scales.x, y:{...baseOpts.scales.y, min:30, max:80, ticks:{...baseOpts.scales.y.ticks, callback:v=>v+'%'}}}} });

    if (d.has_ndr) {
      buildChart('c_ndr_whale', { type:'bar', data:{ labels:ranks, datasets:[
        {label:'Pre', data:d.ndr_whale_pre, backgroundColor:'#D85A30', borderRadius:4},
        {label:'Post', data:d.ndr_whale_post, backgroundColor:'#1D9E75', borderRadius:4}
      ]}, options:{...baseOpts, scales:{x:baseOpts.scales.x, y:{...baseOpts.scales.y, min:50, max:90, ticks:{...baseOpts.scales.y.ticks, callback:v=>v+'%'}}}, plugins:{legend:{display:false}, tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`}}}} });

      buildChart('c_ndr_nonwhale', { type:'bar', data:{ labels:ranks, datasets:[
        {label:'Pre', data:d.ndr_nw_pre, backgroundColor:'#D85A30', borderRadius:4},
        {label:'Post', data:d.ndr_nw_post, backgroundColor:'#85B7EB', borderRadius:4}
      ]}, options:{...baseOpts, scales:{x:baseOpts.scales.x, y:{...baseOpts.scales.y, min:50, max:90, ticks:{...baseOpts.scales.y.ticks, callback:v=>v+'%'}}}, plugins:{legend:{display:false}, tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`}}}} });
    }

    buildChart('c_time_whale', { type:'bar', data:{ labels:ranks, datasets:[
      {label:'Pre', data:d.time_whale_pre, backgroundColor:'#D85A30', borderRadius:4},
      {label:'Post', data:d.time_whale_post, backgroundColor:'#1D9E75', borderRadius:4}
    ]}, options:{...baseOpts, scales:{x:baseOpts.scales.x, y:{...baseOpts.scales.y, min:40, max:90, ticks:{...baseOpts.scales.y.ticks, callback:v=>v+' m'}}}, plugins:{legend:{display:false}, tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)} mins`}}}} });

    buildChart('c_time_nonwhale', { type:'bar', data:{ labels:ranks, datasets:[
      {label:'Pre', data:d.time_nw_pre, backgroundColor:'#D85A30', borderRadius:4},
      {label:'Post', data:d.time_nw_post, backgroundColor:'#85B7EB', borderRadius:4}
    ]}, options:{...baseOpts, scales:{x:baseOpts.scales.x, y:{...baseOpts.scales.y, min:40, max:90, ticks:{...baseOpts.scales.y.ticks, callback:v=>v+' m'}}}, plugins:{legend:{display:false}, tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)} mins`}}}} });

    if (d.has_whalesfaced) {
      buildChart('c_whalesfaced', { type:'bar', data:{ labels:ranks, datasets:[
        {label:'Mean', data:d.whalesfaced_mean, backgroundColor:'#85B7EB', borderRadius:4},
        {label:'Q50',  data:d.whalesfaced_q50,  backgroundColor:'#185FA5', borderRadius:4},
        {label:'Q90',  data:d.whalesfaced_q90,  backgroundColor:'#D85A30', borderRadius:4}
      ]}, options:{...baseOpts, plugins:{legend:{display:true, position:'top', labels:{font:{size:11}, color:tc, boxWidth:12, padding:12}}, tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}`}}}, scales:{x:baseOpts.scales.x, y:{...baseOpts.scales.y, max:5, ticks:{...baseOpts.scales.y.ticks, stepSize:1}}}} });
    }

    // ── INSIGHTS ──
    renderInsights('ins_base', [
      ins('good', '<strong>Eligible base is stable across all windows.</strong> Whale % per rank shifted by ≤0.5pp. No composition change — pre/post differences are attributable to the matchmaking change, not a different user mix.' + (key === '5day' ? ' 5-day post window (May 31–Jun 4) compared against matched 5-day pre window (May 24–28).' : ''))
    ]);

    const pratioNote = key === '5day'
      ? 'in the 5-day window — consistent across all three post-change reads. No drift.'
      : key === '3day' ? 'in the 3-day window' : 'on Day 1';
    renderInsights('ins_pratio', [
      ins('good', '<strong>Power band is working and holding.</strong> Whale PRatio is 0.84–0.89 across all ranks ' + pratioNote + ', down from ~0.97–1.02 pre-change. Opponents are genuinely weaker.'),
      ins('good', '<strong>Non-whale pool unaffected.</strong> Non-whale PRatio is ~1.01 both pre and post. The change is surgical.')
    ]);

    const ruAvgPre  = (d.wr_ru_pre.reduce((a,b)=>a+b,0)/5).toFixed(0);
    const ruAvgPost = (d.wr_ru_post.reduce((a,b)=>a+b,0)/5).toFixed(0);
    renderInsights('ins_wr', [
      ins('warn', '<strong>Pre-change: whales were losing to real users across every rank.</strong> Real-user WR was ' + ruAvgPre + '% on average — sub-50%. Whales were being punished for spending.'),
      ins('good', '<strong>Post-change: consistent 20–28pp gain across all ranks.</strong> Real-user WR is now ' + ruAvgPost + '% on average. ' + (key==='3day' ? 'The Day 1 spike has moderated slightly but the improvement is holding firmly.' : 'Rookie shows the largest jump (+27pp) where the D3 whale problem was most acute.')),
      ins('', '<strong>Non-whale WR unchanged.</strong> The gain is not coming at the broader population\'s cost.')
    ]);

    const quitIns = [
      ins('warn', '<strong>Opponent quit rate roughly doubled for whales at higher ranks</strong> — ~14–15% at Accomplished/Remarkable (was ~7–8%). Expected: weaker opponents see the mismatch and forfeit. Non-whale quit rate is flat.')
    ];
    if (d.has_selfquit) {
      quitIns.push(ins('good', '<strong>Whales are playing through their matches.</strong> Whale self-quit dropped from 4.5–7.6% to 2.0–4.7% — now below non-whale self-quit at every rank. Pre-change, whales were rage-quitting their own matches. That pain signal is gone.'));
    }
    if (d.has_payermix) {
      quitIns.push(ins('warn', '<strong>Same-day safeguard is being built for all ranks.</strong> Payer analysis confirms the urgency — paying users are present in the at-risk pool at every rank, from Rookie (24.1%) to Remarkable (49.8%). See Section 09 for full breakdown.'));
    } else {
      quitIns.push(ins('warn', '<strong>Same-day cooldown is not yet shipped.</strong> Monitor opponent quit rates closely — repeated exposure of the same non-whale to a Q90 whale in a single day could drive churn.'));
    }
    renderInsights('ins_quit', quitIns);

    const leagueInsights = key === 'day1' ? [
      ins('good', '<strong>Engagement shift confirmed.</strong> Whale League adoption fell 2–20pp across ranks (Remarkable: −19.9pp). League matches/day down 0.3–0.8. Whales are responding to a better PvP experience.'),
      ins('warn', '<strong>Non-whale League adoption also dipped at higher ranks.</strong> May be correlated — non-whales quitting against whales and disengaging. Separate from the whale effect before drawing conclusions.')
    ] : key === '3day' ? [
      ins('good', '<strong>Engagement shift is holding across 3 days.</strong> Whale League adoption is down at Proven (−4.4pp), Accomplished (−2.0pp), and Remarkable (−2.5pp). The reversal is consistent, not a Day 1 spike.'),
      ins('good', '<strong>Whale PvP matches/day ticked up across all ranks.</strong> League matches/day is flat to slightly down. Whales are choosing PvP more.'),
      ins('', '<strong>Non-whale League adoption is broadly stable.</strong> Unlike the Day 1 read, the 3-day window shows non-whale League behaviour is not meaningfully affected.')
    ] : [
      ins('good', '<strong>Engagement shift is confirmed and holding across 5 days.</strong> Whale League adoption is down at Proven (−2.4pp), Accomplished (−2.1pp), and Remarkable (−0.2pp) vs the matched pre window. Shift is sticky.'),
      ins('good', '<strong>Whale PvP matches/day is up at every rank.</strong> Remarkable whales went from 4.9 → 5.7 matches/day. League matches/day held flat or ticked down. The pattern is consistent.'),
      ins('', '<strong>Non-whale League adoption is stable.</strong> The 5-day window confirms the Day 1 non-whale dip was noise. No spillover effect on the broader population.')
    ];
    renderInsights('ins_engagement', leagueInsights);

    if (d.has_ndr) {
      renderInsights('ins_ndr', [
        ins('good', '<strong>Whale NDR improved from 69% → 70.5% (+1.5pp)</strong> overall. Non-whale dipped marginally from 68% → 67.5%. A better PvP experience is translating into whales returning to the game the next day.'),
        ins('good', '<strong>Whale NDR now exceeds non-whale at every rank except Remarkable.</strong> Rookie whale NDR is 65% vs non-whale 56.5%. This is particularly meaningful — early-stage whales who were churning due to bad PvP experience are now sticking around.'),
        ins('warn', '<strong>Remarkable whale NDR (79%) is just below non-whale (80.5%)</strong> — the only rank where the gap hasn\'t flipped. Worth watching as the rank with the highest average matches/day and the strongest pre-change pain.')
      ]);
    }

    const timeInsights = key === '3day' ? [
      ins('good', '<strong>The Day 1 time-spent dip has reversed.</strong> In the 3-day window, whale time spent is up 2.1–4.1 mins at Proven, Accomplished, and Remarkable vs pre-change. The Day 1 drop was likely noise from match distribution on a single day.'),
      ins('', '<strong>Non-whale time spent is flat to slightly up</strong> across all ranks (±1–2 mins). No negative spillover from the matchmaking change on the broader population\'s session depth.')
    ] : [
      ins('warn', '<strong>Whale session time is down 1–7 mins across all ranks</strong> (largest at Remarkable: −7.2 mins, Proven: −6.2 mins). Likely inflated pre-change by grinding through harder opponents. Monitor over the next few days to see if this stabilises.'),
      ins('', '<strong>Non-whale time also dipped slightly (−1 to −4 mins)</strong> — suggests part of this may be a day-level effect rather than purely the matchmaking change.')
    ];
    renderInsights('ins_time', timeInsights);

    if (d.has_whalesfaced) {
      renderInsights('ins_whalesfaced', [
        ins('', '<strong>Median non-whale faces 1 whale per day across all ranks.</strong> Q50 is 1 at every rank — most non-whales encounter at most one Q90 opponent in a day.'),
        ins('warn', '<strong>Q90 reaches 2–3, with Remarkable hitting 3.</strong> Consistent across all post-change windows. A tail of non-whale users at Remarkable are facing Q90 whales repeatedly in a single day.'),
        ins(d.has_payermix ? 'good' : 'warn', d.has_payermix
          ? '<strong>Safeguard is being built for all ranks.</strong> Combined with the payer mix data (Section 09), payers are present in the at-risk pool at every rank. The same-day cooldown will cover Rookie through Remarkable.'
          : '<strong>Same-day cooldown is not yet shipped — Remarkable warrants prioritisation.</strong> At lower ranks (Rookie–Accomplished), repeated exposure is low enough that the cooldown is not urgent. Remarkable is the exception.')
      ]);
    }

    // ── PAYER MIX CHART ──
    if (d.has_payermix) {
      buildChart('c_payer_mix', { type:'bar', data:{ labels:ranks, datasets:[
        {label:'Any payer', data:d.payer_pct, backgroundColor:'#185FA5', borderRadius:4},
        {label:'$1+ payer (LTV > $80)', data:d.payer_1plus_pct, backgroundColor:'#1D9E75', borderRadius:4}
      ]}, options:{...baseOpts, plugins:{legend:{display:false}, tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`}}}, scales:{x:baseOpts.scales.x, y:{...baseOpts.scales.y, max:60, ticks:{...baseOpts.scales.y.ticks, callback:v=>v+'%'}}}} });

      renderInsights('ins_payermix', [
        ins('warn', '<strong>Payer exposure exists at every rank — not just Remarkable.</strong> Even at Rookie, 24.1% of non-whales facing whales are payers and 6.7% are $1+ spenders. These are not just casual free users being put in front of a mismatch.'),
        ins('warn', '<strong>Payer density scales with rank.</strong> From Rookie (24.1%) to Remarkable (49.8%), the share of paying users in the at-risk pool grows consistently — but the risk is present across all ranks.'),
        ins('good', '<strong>Safeguard is being built for all ranks.</strong> The same-day cooldown will prevent repeated whale exposure within a single day across Rookie through Remarkable — protecting the paying user experience at every level.')
      ]);
    }

    const openQs = key === '5day' ? [
      { icon:'💰', title:'Monetisation conversion', desc:'Does better PvP experience convert into spend? Track LTV and purchase frequency for eligible whales over the next 7–14 days vs a matched pre-change cohort.' },
      { icon:'🏆', title:'Rank progression speed', desc:'Higher win rates → faster rank-ups. Are whales now moving through rep ranks faster, and does that push them out of Q90 eligibility — making the system partially self-correcting?' },
      { icon:'🔄', title:'Win streak reversion rate', desc:'How often are whales hitting the ≥4 win streak threshold and reverting to normal matchmaking? If most never reach this, the power band stays on indefinitely for the majority.' },
      { icon:'📉', title:'Post-safeguard payer retention', desc:'Once the same-day cooldown is shipped, track D7 and D14 PvP retention for paying non-whales across all ranks to confirm the protection is working. Prioritise Accomplished and Remarkable where payer density is highest.' }
    ] : key === '3day' ? [
      { icon:'📊', title:'Win streak reversion rate', desc:'How often are whales hitting the ≥4 win streak threshold and reverting to normal matchmaking? If most whales never reach this, the reversion logic is largely inactive.' },
      { icon:'📉', title:'Weaker-opponent churn signal', desc:'Non-whales who quit against Q90 whales — are they churning from PvP? Track D3 and D7 retention for this sub-segment.' },
      { icon:'💰', title:'Monetisation conversion', desc:'Do whales with better PvP experience spend more in the following week? LTV and purchase frequency for eligible whales post-change vs matched pre-change cohort.' },
      { icon:'⚡', title:'Same-day cooldown prioritisation', desc:'Remarkable Q90 non-whales face up to 3 whales/day. Ship the cooldown for Remarkable first, then evaluate whether lower ranks need it based on continued monitoring.' }
    ] : [
      { icon:'📊', title:'Win streak reversion rate', desc:'How often are whales hitting the ≥4 win streak threshold and reverting to normal matchmaking? If most whales never reach this, the reversion logic is largely inactive.' },
      { icon:'📉', title:'Weaker-opponent churn signal', desc:'Non-whales who quit against Q90 whales — are they churning from PvP? Track D3 and D7 retention for this sub-segment.' },
      { icon:'💰', title:'Monetisation conversion', desc:'Do whales with better PvP experience spend more in the following week? LTV and purchase frequency for eligible whales post-change vs matched pre-change cohort.' },
      { icon:'🏆', title:'Rank progression speed', desc:'Higher win rates mean faster rank-ups. Does that push whales out of Q90 eligibility — making the system partially self-correcting?' }
    ];
    document.getElementById('openq_grid').innerHTML = openQs.map(q => `
      <div class="opp-card">
        <div class="opp-icon" style="background:var(--blue-light);">${q.icon}</div>
        <p class="opp-title">${q.title}</p>
        <p class="opp-desc">${q.desc}</p>
      </div>`).join('');
  }


  // ══════════════════════════════════════════════
  // OVERALL PAGE DATA — update these values each time new data is shared
  // Pre = May 24–28, Post = May 31–Jun 4
  // ══════════════════════════════════════════════
  const overallData = {
    pre: {
      label: 'Apr 30 – May 9',
      matches: {
        free:  [5.5, 4.8, 5.5, 5.8, 5.8],
        payer: [5.9, 5.2, 5.8, 6.1, 6.4],
        whale: [7.2, 6.4, 6.7, 7.7, 6.8]
      },
      wr: {
        free:  [67.8, 59.8, 60.5, 61.4, 54.0],
        payer: [64.9, 60.1, 60.4, 61.1, 54.2],
        whale: [67.2, 62.4, 63.7, 62.6, 55.5]
      },
      rwr: {
        free:  [45.5, 43.6, 45.1, 47.0, 47.1],
        payer: [43.6, 42.8, 44.0, 45.9, 47.3],
        whale: [45.9, 44.8, 48.2, 48.5, 48.7]
      },
      ndr: {
        free:  [59.8, 70.5, 74.6, 75.1, 78.7],
        payer: [68.3, 73.1, 76.7, 76.3, 79.7],
        whale: [74.9, 79.5, 81.0, 82.0, 82.3]
      },
      arppu: {
        payer: [101, 89, 111, 113, 227],
        whale: [1671, 2603, 1871, 2093, 2153]
      },
      arpu: {
        payer: [11, 23, 32, 39, 96],
        whale: [10, 36, 31, 48, 73]
      }
    },
    post: {
      label: 'May 31 – Jun 9',
      matches: {
        free:  [5.3, 5.1, 5.5, 5.9, 5.9],
        payer: [5.9, 5.3, 5.9, 6.4, 6.5],
        whale: [6.9, 6.3, 6.8, 7.9, 7.3]
      },
      wr: {
        free:  [67.8, 60.8, 62.3, 62.8, 53.7],
        payer: [67.8, 61.7, 63.4, 63.5, 55.6],
        whale: [69.9, 67.7, 70.3, 69.7, 64.4]
      },
      rwr: {
        free:  [45.8, 43.6, 45.8, 47.0, 46.1],
        payer: [46.3, 44.3, 47.7, 48.2, 48.6],
        whale: [51.9, 56.1, 60.5, 59.6, 60.2]
      },
      ndr: {
        free:  [59.3, 71.0, 75.5, 77.2, 79.7],
        payer: [68.7, 73.7, 78.3, 79.5, 80.7],
        whale: [74.8, 79.5, 83.9, 84.8, 82.6]
      },
      arppu: {
        payer: [99, 88, 104, 127, 185],
        whale: [2002, 1842, 2632, 1704, 2569]
      },
      arpu: {
        payer: [11, 22, 32, 45, 81],
        whale: [13, 20, 50, 37, 86]
      }
    }
  };

  // ══════════════════════════════════════════════
  // OVERALL PAGE RENDERING
  // ══════════════════════════════════════════════
  // Rank colours — Pre uses muted versions, Post uses vivid versions
  const rankColorsPre  = ['#8FAFD4', '#60A898', '#B8A040', '#C07850', '#A87898'];
  const rankColorsPost = ['#2E7FCC', '#1D9E75', '#D4A017', '#D85A30', '#9B5E8A'];

  function buildOverallChart(id, preVals, postVals, opts = {}) {
    const el = document.getElementById(id);
    if (!el) return;
    const { yMin, yMax, fmt } = opts;
    const fmtFn = fmt === 'pct' ? v => v.toFixed(1) + '%'
                : fmt === 'inr' ? v => '₹' + v.toLocaleString()
                : v => v.toFixed(1);

    const yScale = { ...baseOpts.scales.y };
    if (yMin !== undefined) yScale.min = yMin;
    if (yMax !== undefined) yScale.max = yMax;
    if (fmt === 'pct') yScale.ticks = { ...yScale.ticks, callback: v => v + '%' };
    if (fmt === 'inr') yScale.ticks = { ...yScale.ticks, callback: v => '₹' + v.toLocaleString() };

    HWReport.charts[id] = new Chart(el, {
      type: 'bar',
      data: {
        labels: ranks,
        datasets: [
          {
            label: overallData.pre.label,
            data: preVals,
            backgroundColor: rankColorsPre,
            borderRadius: 4
          },
          {
            label: overallData.post.label,
            data: postVals,
            backgroundColor: rankColorsPost,
            borderRadius: 4
          }
        ]
      },
      options: {
        ...baseOpts,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: { font: { size: 10 }, color: tc, boxWidth: 10, padding: 10 }
          },
          tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${fmtFn(ctx.parsed.y)}` } }
        },
        scales: { x: baseOpts.scales.x, y: yScale }
      }
    });
  }

  function renderOverall() {
    const od = overallData;

    // Matches
    buildOverallChart('ov_matches_free',  od.pre.matches.free,  od.post.matches.free,  { yMin: 3, yMax: 9 });
    buildOverallChart('ov_matches_payer', od.pre.matches.payer, od.post.matches.payer, { yMin: 3, yMax: 9 });
    buildOverallChart('ov_matches_whale', od.pre.matches.whale, od.post.matches.whale, { yMin: 3, yMax: 9 });

    // Win Rate
    buildOverallChart('ov_wr_free',  od.pre.wr.free,  od.post.wr.free,  { yMin: 40, yMax: 80, fmt: 'pct' });
    buildOverallChart('ov_wr_payer', od.pre.wr.payer, od.post.wr.payer, { yMin: 40, yMax: 80, fmt: 'pct' });
    buildOverallChart('ov_wr_whale', od.pre.wr.whale, od.post.wr.whale, { yMin: 40, yMax: 80, fmt: 'pct' });

    // Real-User WR
    buildOverallChart('ov_rwr_free',  od.pre.rwr.free,  od.post.rwr.free,  { yMin: 30, yMax: 70, fmt: 'pct' });
    buildOverallChart('ov_rwr_payer', od.pre.rwr.payer, od.post.rwr.payer, { yMin: 30, yMax: 70, fmt: 'pct' });
    buildOverallChart('ov_rwr_whale', od.pre.rwr.whale, od.post.rwr.whale, { yMin: 30, yMax: 70, fmt: 'pct' });

    // NDR
    buildOverallChart('ov_ndr_free',  od.pre.ndr.free,  od.post.ndr.free,  { yMin: 50, yMax: 95, fmt: 'pct' });
    buildOverallChart('ov_ndr_payer', od.pre.ndr.payer, od.post.ndr.payer, { yMin: 50, yMax: 95, fmt: 'pct' });
    buildOverallChart('ov_ndr_whale', od.pre.ndr.whale, od.post.ndr.whale, { yMin: 50, yMax: 95, fmt: 'pct' });

    // ARPPU
    buildOverallChart('ov_arppu_payer', od.pre.arppu.payer, od.post.arppu.payer, { yMin: 0, fmt: 'inr' });
    buildOverallChart('ov_arppu_whale', od.pre.arppu.whale, od.post.arppu.whale, { yMin: 0, fmt: 'inr' });

    // ARPU
    buildOverallChart('ov_arpu_payer', od.pre.arpu.payer, od.post.arpu.payer, { yMin: 0, fmt: 'inr' });
    buildOverallChart('ov_arpu_whale', od.pre.arpu.whale, od.post.arpu.whale, { yMin: 0, fmt: 'inr' });
  }

  // ══════════════════════════════════════════════
  // OVERALL PAGE SHOW/HIDE LOGIC
  // ══════════════════════════════════════════════
  const mainSections = document.querySelector('main');

  function showOverall() {
    document.getElementById('ranksplit_page').classList.add('hidden');
    document.getElementById('overall_page').classList.remove('hidden');
    document.getElementById('compLabel').textContent = 'Apr 30–May 9 vs May 31–Jun 9';
    document.getElementById('caveatBanner').style.display = 'none';
    if (!HWReport.charts['ov_matches_free']) renderOverall();
  }

  function hideOverall() {
    document.getElementById('ranksplit_page').classList.remove('hidden');
    document.getElementById('overall_page').classList.add('hidden');
    document.getElementById('caveatBanner').style.display = '';
  }

  function showAB() {
    document.getElementById('ranksplit_page').classList.add('hidden');
    document.getElementById('overall_page').classList.add('hidden');
    document.getElementById('ab_page').classList.remove('hidden');
    document.getElementById('compLabel').textContent = 'May 15 – Jun 21';
    document.getElementById('caveatBanner').style.display = 'none';
    if (!HWReport.charts['ab_eng_overall']) renderAB();
  }

  function hideAB() {
    document.getElementById('ab_page').classList.add('hidden');
    document.getElementById('caveatBanner').style.display = '';
  }

  function showJun29() {
    document.getElementById('ranksplit_page').classList.add('hidden');
    document.getElementById('overall_page').classList.add('hidden');
    document.getElementById('ab_page').classList.add('hidden');
    document.getElementById('ab_jun29_page').classList.remove('hidden');
    document.getElementById('compLabel').textContent = 'Jun 15 – Jun 29';
    document.getElementById('caveatBanner').style.display = 'none';
    document.getElementById('footerLabel').textContent = 'Winstreak A/B · Jun 15 – Jun 29';
    if (!HWReport._jun29ChartsInit || !HWReport.charts['j29_eng_overall']) {
      renderJun29Charts();
      HWReport._jun29ChartsInit = true;
    }
    refreshJun29Dom();
    renderJun29KPIs();
  }

  function hideJun29() {
    document.getElementById('ab_jun29_page').classList.add('hidden');
  }

  // Patch the existing timeline change handler
  document.getElementById('timelineSelect').addEventListener('change', e => {
    const val = e.target.value;
    hideOverall();
    hideAB();
    hideJun29();
    if (val === 'overall') {
      showOverall();
    } else if (val === 'ab') {
      showAB();
    } else if (val === 'ab_jun29') {
      showJun29();
    } else {
      document.getElementById('ranksplit_page').classList.remove('hidden');
      document.getElementById('caveatBanner').style.display = '';
      render(val);
    }
  });




  // ══════════════════════════════════════════════
  // A/B PAGE DATA
  // ══════════════════════════════════════════════
  const abData = {
    ranks: ['Rookie','Challenger','Proven','Accomplished','Remarkable'],
    eng: {
      base: { mdau:3.91, wr:72, rwr:63, bot:29, whaleMpd:3.02, normalMpd:0.89, prWhole:0.78, prNormal:1.01, ndr:72.4 },
      test: { mdau:3.76, wr:70, rwr:58, bot:31, whaleMpd:2.61, normalMpd:1.15, prWhole:0.79, prNormal:1.01, ndr:72.3 }
    },
    engRank: {
      base: {
        rwr:  [57, 65, 67, 68, 65],
        normalMpd: [0.47, 0.68, 0.93, 1.23, 2.27],
        ndr:  [27, 41, 48, 55, 56]
      },
      test: {
        rwr:  [51, 60, 62, 64, 62],
        normalMpd: [0.80, 0.94, 1.23, 1.48, 2.34],
        ndr:  [29, 40, 51, 54, 54]
      }
    },
    monet: {
      raw: {
        overall: {
          base: { conv:10.86, arpu:247, arppu:2279 },
          test: { conv:10.86, arpu:182, arppu:1672 }
        },
        rank: {
          base: { conv:[7.23,9.85,11.21,15.28,18.21], arpu:[107,205,253,417,558], arppu:[1472,2087,2259,2731,3066] },
          test: { conv:[6.83,10.45,12.44,13.12,22.34], arpu:[89,171,201,264,418], arppu:[1303,1635,1615,2012,1869] }
        }
      },
      '5k': {
        overall: {
          base: { conv:10.1, arpu:90, arppu:892 },
          test: { conv:10.24, arpu:97, arppu:949 }
        },
        rank: {
          base: { conv:[6.88,9.26,10.49,14.02,16.64], arpu:[52,82,97,134,163], arppu:[762,886,921,954,980] },
          test: { conv:[6.45,9.98,12.0,11.95,21.28], arpu:[60,87,98,116,244], arppu:[936,875,816,973,1147] }
        }
      },
      '10k': {
        overall: {
          base: { conv:10.5, arpu:121, arppu:1155 },
          test: { conv:10.57, arpu:123, arppu:1159 }
        },
        rank: {
          base: { conv:[7.05,9.52,10.85,14.82,17.3], arpu:[63,101,129,201,226], arppu:[898,1057,1191,1358,1308] },
          test: { conv:[6.77,10.11,12.22,12.54,21.75], arpu:[81,96,115,168,287], arppu:[1190,953,939,1343,1319] }
        }
      },
      '15k': {
        overall: {
          base: { conv:10.61, arpu:136, arppu:1283 },
          test: { conv:10.69, arpu:139, arppu:1299 }
        },
        rank: {
          base: { conv:[7.13,9.52,11.14,14.89,17.56], arpu:[72,101,168,210,264], arppu:[1010,1057,1507,1414,1501] },
          test: { conv:[6.83,10.11,12.22,12.93,21.99], arpu:[89,96,115,220,328], arppu:[1303,953,939,1702,1491] }
        }
      }
    }
  };

  // ── AB CHART HELPERS ──
  function buildABBar(id, baseVals, testVals, opts = {}) {
    const el = document.getElementById(id);
    if (!el) return;
    const { yMin, yMax, fmt, labels } = opts;
    const fmtFn = fmt === 'pct' ? v => v.toFixed(1) + '%'
                : fmt === 'inr' ? v => '₹' + v.toLocaleString()
                : v => typeof v === 'number' ? v.toFixed(2) : v;
    const yScale = { ...baseOpts.scales.y };
    if (yMin !== undefined) yScale.min = yMin;
    if (yMax !== undefined) yScale.max = yMax;
    if (fmt === 'pct') yScale.ticks = { ...yScale.ticks, callback: v => v + '%' };
    if (fmt === 'inr') yScale.ticks = { ...yScale.ticks, callback: v => '₹' + v.toLocaleString() };
    HWReport.charts[id] = new Chart(el, {
      type: 'bar',
      data: {
        labels: labels || abData.ranks,
        datasets: [
          { label: 'Base', data: baseVals, backgroundColor: '#185FA5', borderRadius: 4 },
          { label: 'Test', data: testVals, backgroundColor: '#1D9E75', borderRadius: 4 }
        ]
      },
      options: {
        ...baseOpts,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${fmtFn(ctx.parsed.y)}` } }
        },
        scales: { x: baseOpts.scales.x, y: yScale }
      }
    });
  }

  function buildABGrouped(id, baseVals, testVals, labels, opts = {}) {
    const el = document.getElementById(id);
    if (!el) return;
    const { fmt } = opts;
    const fmtFn = fmt === 'pct' ? v => v.toFixed(1) + '%'
                : fmt === 'inr' ? v => '₹' + v.toLocaleString()
                : v => v.toFixed(2);
    const yScale = { ...baseOpts.scales.y };
    if (fmt === 'inr') yScale.ticks = { ...yScale.ticks, callback: v => '₹' + v.toLocaleString() };
    HWReport.charts[id] = new Chart(el, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Base', data: baseVals, backgroundColor: '#185FA5', borderRadius: 4 },
          { label: 'Test', data: testVals, backgroundColor: '#1D9E75', borderRadius: 4 }
        ]
      },
      options: {
        ...baseOpts,
        plugins: {
          legend: { display: true, position: 'top', labels: { font:{size:10}, color:tc, boxWidth:10, padding:10 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${fmtFn(ctx.parsed.y)}` } }
        },
        scales: { x: baseOpts.scales.x, y: yScale }
      }
    });
  }

  // overall monet table is now HTML, no chart needed

  function renderABMonetCut(cut) {
    const d = abData.monet[cut];
    buildABBar('ab_conv_' + cut + '_rank',  d.rank.base.conv,  d.rank.test.conv,  { fmt:'pct' });
    buildABBar('ab_arpu_' + cut + '_rank',  d.rank.base.arpu,  d.rank.test.arpu,  { fmt:'inr' });
    buildABBar('ab_arppu_' + cut + '_rank', d.rank.base.arppu, d.rank.test.arppu, { fmt:'inr' });
  }

  function renderAB() {
    const e = abData.eng;
    const er = abData.engRank;

    // Overall engagement grouped
    buildABGrouped('ab_eng_overall',
      [e.base.mdau, e.base.wr, e.base.rwr, e.base.bot],
      [e.test.mdau, e.test.wr, e.test.rwr, e.test.bot],
      ['MDAU', 'Win Rate %', 'Real-User WR %', 'Bot %']
    );

    // Match distribution
    buildABGrouped('ab_matches_dist',
      [e.base.whaleMpd, e.base.normalMpd],
      [e.test.whaleMpd, e.test.normalMpd],
      ['Whale MM Matches/Day', 'Normal MM Matches/Day']
    );

    // Rank charts
    buildABBar('ab_rwr_rank',    er.base.rwr,       er.test.rwr,       { fmt:'pct', yMin:40, yMax:80 });
    buildABBar('ab_normal_rank', er.base.normalMpd, er.test.normalMpd);
    buildABBar('ab_ndr_rank',    er.base.ndr,        er.test.ndr,        { fmt:'pct', yMin:20, yMax:70 });

    // PRatio — two groups: whale MM and normal MM
    buildABGrouped('ab_pratio',
      [e.base.prWhole, e.base.prNormal],
      [e.test.prWhole, e.test.prNormal],
      ['Whale MM Match PRatio', 'Normal MM Match PRatio']
    );

    // Monetisation — render raw by default, others lazy
    renderABMonetCut('raw');
  }

  // ── CUT TOGGLE ──
  function switchCut(cut, btn) {
    document.querySelectorAll('#ab_page .monet-cut').forEach(function (el) { el.classList.remove('active'); });
    document.querySelectorAll('#ab_page .ab-toggle-row .ab-toggle').forEach(function (el) { el.classList.remove('active'); });
    document.getElementById('cut_' + cut).classList.add('active');
    btn.classList.add('active');
    var cutId = 'ab_conv_' + cut + '_rank';
    if (!HWReport.charts[cutId]) renderABMonetCut(cut);
  }
  window.switchCut = switchCut;

  // ══════════════════════════════════════════════
  // JUN 15–29 READ + D3 WHALES
  // ══════════════════════════════════════════════
  const jun29Data = {
    ranks: ['Rookie','Challenger','Proven','Accomplished','Remarkable'],
    eng: {
      base: { mdau: 3.70, wr: 75, rwr: 65, bot: 31, normalMpd: 0.81, ndr: 77.4 },
      test: { mdau: 3.61, wr: 73, rwr: 60, bot: 33, normalMpd: 1.07, ndr: 77.1 }
    },
    engRank: {
      base: {
        mdau: [3.05, 3.33, 4.00, 4.85, 5.20],
        rwr: [59, 68, 69, 71, 67],
        normalMpd: [0.48, 0.65, 0.88, 1.18, 2.21],
        ndr: [29, 43, 52, 58, 58]
      },
      test: {
        mdau: [3.01, 3.46, 3.95, 4.63, 4.82],
        rwr: [53, 63, 65, 66, 65],
        normalMpd: [0.77, 0.90, 1.16, 1.43, 2.40],
        ndr: [30, 43, 54, 57, 58]
      }
    },
    monet: {
      raw: {
        banner: '⚠ Raw cut includes all spenders. Base ARPU ₹355 vs Test ₹293 — gap driven by highrollers concentrated in Base. See exclusion cuts.',
        overall: {
          base: { conv: 14.91, arpu: 355, arppu: 2378 },
          test: { conv: 15.12, arpu: 293, arppu: 1940 }
        },
        rank: {
          base: { conv: [11.58, 13.52, 16.64, 19.7, 23.39], arpu: [174, 366, 349, 605, 831], arppu: [1503, 2705, 2095, 3070, 3553] },
          test: { conv: [11.45, 14.92, 18.1, 17.77, 26.6], arpu: [168, 283, 351, 388, 770], arppu: [1466, 1894, 1940, 2185, 2895] }
        }
      },
      '5k': {
        banner: '238 payers excluded · ₹40.4L revenue removed. Test Conv% ahead: 14.17% vs 13.89%.',
        overall: {
          base: { conv: 13.89, arpu: 130, arppu: 939 },
          test: { conv: 14.17, arpu: 129, arppu: 910 }
        },
        rank: {
          base: { conv: [10.97, 12.73, 15.65, 17.93, 21.22], arpu: [92, 135, 141, 179, 216], arppu: [836, 1058, 902, 998, 1020] },
          test: { conv: [10.74, 14.12, 17.19, 16.44, 24.71], arpu: [93, 121, 148, 141, 306], arppu: [864, 859, 863, 857, 1237] }
        }
      },
      '10k': {
        banner: '118 payers excluded · ₹32.2L revenue removed. Excl. >₹10k: ARPU Base ₹167 vs Test ₹171; Conv% Test ahead 14.70% vs 14.35%.',
        overall: {
          base: { conv: 14.35, arpu: 167, arppu: 1163 },
          test: { conv: 14.70, arpu: 171, arppu: 1164 }
        },
        rank: {
          base: { conv: [11.33, 12.92, 16.02, 18.77, 22.27], arpu: [118, 152, 173, 246, 308], arppu: [1038, 1175, 1078, 1310, 1382] },
          test: { conv: [11.28, 14.36, 17.73, 17.06, 25.67], arpu: [134, 140, 191, 194, 380], arppu: [1192, 976, 1078, 1138, 1481] }
        }
      },
      '15k': {
        banner: '77 payers excluded · ₹27.2L revenue removed. Excl. >₹15k: Test ahead on Conv% (14.87% vs 14.53%), ARPU (₹194 vs ₹192), Remarkable ARPU ₹416 vs ₹325.',
        overall: {
          base: { conv: 14.53, arpu: 192, arppu: 1322 },
          test: { conv: 14.87, arpu: 194, arppu: 1303 }
        },
        rank: {
          base: { conv: [11.45, 12.97, 16.38, 19.08, 22.37], arpu: [134, 158, 225, 292, 325], arppu: [1172, 1220, 1375, 1531, 1451] },
          test: { conv: [11.39, 14.59, 17.78, 17.36, 25.86], arpu: [149, 171, 197, 239, 416], arppu: [1312, 1174, 1111, 1376, 1608] }
        }
      }
    },
    d3whales: {
      total: 383,
      arpu3: {
        base: { n: 183, arpu: 2336, median: 1446 },
        test: { n: 200, arpu: 2082, median: 1349 }
      },
      arpu7: {
        base: { n: 130, arpu: 2373, median: 1546 },
        test: { n: 132, arpu: 2972, median: 1860 }
      },
      region: {
        arpu3: { base: { india: 2206, intl: 2439 }, test: { india: 1908, intl: 2249 } },
        arpu7: { base: { india: 2182, intl: 2532 }, test: { india: 2648, intl: 3327 } }
      },
      sku: {
        labels: ['SP', 'HC_Pack', 'Others', 'TP', 'LiveOps', 'Monthly Offer'],
        arpu3: { base: [851, 665, 674, 84, 45, 0], test: [792, 459, 660, 96, 25, 27] },
        arpu7: { base: [927, 531, 696, 103, 84, 22], test: [919, 758, 947, 203, 54, 61] }
      }
    }
  };

  function getActiveJ29Cut() {
    const btn = document.querySelector('#j29_monet_toggles .ab-toggle.active');
    return btn ? (btn.getAttribute('data-cut') || 'raw') : 'raw';
  }

  function deltaPill(delta, fmt) {
    const cls = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
    const sign = delta > 0 ? '+' : '';
    let text;
    if (fmt === 'pp') text = sign + delta.toFixed(1) + 'pp';
    else if (fmt === 'inr') text = sign + '₹' + Math.round(delta).toLocaleString();
    else text = sign + delta.toFixed(2);
    return `<span class="delta-pill ${cls}">${text}</span>`;
  }

  function renderJun29RankEngTable() {
    const er = jun29Data.engRank;
    const rows = jun29Data.ranks.map(function (r, i) {
      const mdauD = er.test.mdau[i] - er.base.mdau[i];
      const rwrD = er.test.rwr[i] - er.base.rwr[i];
      const normD = er.test.normalMpd[i] - er.base.normalMpd[i];
      return `<tr>
        <td><span class="rank-badge rank-${r}">${r}</span></td>
        <td style="text-align:center">${er.base.mdau[i].toFixed(2)}</td><td style="text-align:center">${er.test.mdau[i].toFixed(2)}</td><td>${deltaPill(mdauD, 'num')}</td>
        <td style="text-align:center">${er.base.rwr[i]}%</td><td style="text-align:center">${er.test.rwr[i]}%</td><td>${deltaPill(rwrD, 'pp')}</td>
        <td style="text-align:center">${er.base.normalMpd[i].toFixed(2)}</td><td style="text-align:center">${er.test.normalMpd[i].toFixed(2)}</td><td>${deltaPill(normD, 'num')}</td>
      </tr>`;
    }).join('');
    document.getElementById('j29_rank_eng_tbl').innerHTML = `
      <table class="comp-table">
        <thead>
          <tr><th>Rank</th><th colspan="3" style="text-align:center">MDAU</th><th colspan="3" style="text-align:center">Real-User WR</th><th colspan="3" style="text-align:center">Normal MM / day</th></tr>
          <tr><th></th><th class="post">Base</th><th class="pre">Test</th><th class="delta">Δ</th><th class="post">Base</th><th class="pre">Test</th><th class="delta">Δ</th><th class="post">Base</th><th class="pre">Test</th><th class="delta">Δ</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function renderJun29RankRetTable() {
    const er = jun29Data.engRank;
    const rows = jun29Data.ranks.map(function (r, i) {
      const d = er.test.ndr[i] - er.base.ndr[i];
      return `<tr>
        <td><span class="rank-badge rank-${r}">${r}</span></td>
        <td style="text-align:center">${er.base.ndr[i]}%</td>
        <td style="text-align:center">${er.test.ndr[i]}%</td>
        <td>${deltaPill(d, 'pp')}</td>
      </tr>`;
    }).join('');
    document.getElementById('j29_rank_ret_tbl').innerHTML = `
      <table class="comp-table">
        <thead><tr><th>Rank</th><th class="post">Base NDR</th><th class="pre">Test NDR</th><th class="delta">Δ</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function renderJun29RankMonetTable(cut) {
    const d = jun29Data.monet[cut];
    const cutLabel = { raw: 'Raw', '5k': 'Excl. >₹5k', '10k': 'Excl. >₹10k', '15k': 'Excl. >₹15k' }[cut];
    document.getElementById('j29_rank_monet_cut_label').textContent = 'Showing: ' + cutLabel + ' (change cut in Section 02)';
    const rows = jun29Data.ranks.map(function (r, i) {
      const bc = d.rank.base.conv[i], tc = d.rank.test.conv[i];
      const ba = d.rank.base.arpu[i], ta = d.rank.test.arpu[i];
      const bp = d.rank.base.arppu[i], tp = d.rank.test.arppu[i];
      return `<tr>
        <td><span class="rank-badge rank-${r}">${r}</span></td>
        <td style="text-align:center">${bc}%</td><td style="text-align:center">${tc}%</td><td>${deltaPill(tc - bc, 'pp')}</td>
        <td style="text-align:center">₹${ba.toLocaleString()}</td><td style="text-align:center">₹${ta.toLocaleString()}</td><td>${deltaPill(ta - ba, 'inr')}</td>
        <td style="text-align:center">₹${bp.toLocaleString()}</td><td style="text-align:center">₹${tp.toLocaleString()}</td><td>${deltaPill(tp - bp, 'inr')}</td>
      </tr>`;
    }).join('');
    document.getElementById('j29_rank_monet_tbl').innerHTML = `
      <table class="comp-table">
        <thead>
          <tr><th>Rank</th><th colspan="3" style="text-align:center">Conv%</th><th colspan="3" style="text-align:center">ARPU</th><th colspan="3" style="text-align:center">ARPPU</th></tr>
          <tr><th></th><th class="post">Base</th><th class="pre">Test</th><th class="delta">Δ</th><th class="post">Base</th><th class="pre">Test</th><th class="delta">Δ</th><th class="post">Base</th><th class="pre">Test</th><th class="delta">Δ</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function switchJ29RankTab(tab, btn) {
    document.querySelectorAll('#j29_rank_toggles .ab-toggle').forEach(function (el) { el.classList.remove('active'); });
    btn.classList.add('active');
    document.querySelectorAll('.j29-rank-panel').forEach(function (el) { el.classList.remove('active'); });
    document.getElementById('j29_rank_' + tab).classList.add('active');
    if (tab === 'monet') renderJun29RankMonetTable(getActiveJ29Cut());
  }
  window.switchJ29RankTab = switchJ29RankTab;

  function renderJun29MonetInsights() {
    renderInsights('j29_monet_insights', [
      ins('warn', '<strong>Raw numbers favour Base — highroller skew.</strong> Raw ARPU ₹355 vs ₹293. 238 payers >₹5k account for ₹40.4L of the gap.'),
      ins('good', '<strong>Excl. >₹10k: cases are flat.</strong> ARPU Base ₹167 vs Test ₹171. ARPPU ₹1,163 vs ₹1,164. Conv% Test ahead.'),
      ins('good', '<strong>Excl. >₹15k: Test ahead on Conv% and ARPU.</strong> Conv% 14.87% vs 14.53%. Remarkable Test ARPU ₹416 vs ₹325.')
    ]);
  }

  function renderJun29MonetCut(cut) {
    const bannerEl = document.getElementById('j29_monet_banner');
    const tblEl = document.getElementById('j29_monet_overall_tbl');
    if (!bannerEl || !tblEl) return;
    const d = jun29Data.monet[cut];
    const b = d.overall.base;
    const t = d.overall.test;
    const convDelta = (t.conv - b.conv).toFixed(2);
    const arpuDelta = t.arpu - b.arpu;
    const arppuDelta = t.arppu - b.arppu;
    bannerEl.textContent = d.banner;
    tblEl.innerHTML = `
      <div class="card" style="margin-bottom:1.1rem;">
        <p class="card-title">Overall — Conv%, ARPU, ARPPU</p>
        <table class="comp-table">
          <thead><tr><th></th><th class="post" style="text-align:center">Base</th><th class="pre" style="text-align:center">Test</th><th class="delta">Δ</th></tr></thead>
          <tbody>
            <tr><td>Conv%</td><td style="text-align:center">${b.conv}%</td><td style="text-align:center" class="${t.conv >= b.conv ? 'val-up' : ''}">${t.conv}%</td><td><span class="delta-pill ${t.conv >= b.conv ? 'up' : 'down'}">${convDelta >= 0 ? '+' : ''}${convDelta}pp</span></td></tr>
            <tr><td>ARPU</td><td style="text-align:center">₹${b.arpu.toLocaleString()}</td><td style="text-align:center">₹${t.arpu.toLocaleString()}</td><td><span class="delta-pill ${arpuDelta >= 0 ? 'up' : 'down'}">${arpuDelta >= 0 ? '+' : ''}₹${arpuDelta.toLocaleString()}</span></td></tr>
            <tr><td>ARPPU</td><td style="text-align:center">₹${b.arppu.toLocaleString()}</td><td style="text-align:center">₹${t.arppu.toLocaleString()}</td><td><span class="delta-pill ${arppuDelta >= 0 ? 'up' : 'down'}">${arppuDelta >= 0 ? '+' : ''}₹${arppuDelta.toLocaleString()}</span></td></tr>
          </tbody>
        </table>
      </div>`;
    ['j29_conv_rank', 'j29_arpu_rank', 'j29_arppu_rank'].forEach(function (id) {
      if (HWReport.charts[id]) { HWReport.charts[id].destroy(); delete HWReport.charts[id]; }
    });
    buildABBar('j29_conv_rank', d.rank.base.conv, d.rank.test.conv, { fmt: 'pct', labels: jun29Data.ranks });
    buildABBar('j29_arpu_rank', d.rank.base.arpu, d.rank.test.arpu, { fmt: 'inr', labels: jun29Data.ranks });
    buildABBar('j29_arppu_rank', d.rank.base.arppu, d.rank.test.arppu, { fmt: 'inr', labels: jun29Data.ranks });
    renderJun29RankMonetTable(cut);
  }

  function switchJ29Cut(cut, btn) {
    document.querySelectorAll('#j29_monet_toggles .ab-toggle').forEach(function (el) { el.classList.remove('active'); });
    btn.classList.add('active');
    renderJun29MonetCut(cut);
  }
  window.switchJ29Cut = switchJ29Cut;

  function refreshJun29Dom() {
    const cut = getActiveJ29Cut();
    renderJun29MonetCut(cut);
    renderJun29MonetInsights();
    renderJun29RankEngTable();
    renderJun29RankRetTable();
    if (document.getElementById('j29_rank_monet') && document.getElementById('j29_rank_monet').classList.contains('active')) {
      renderJun29RankMonetTable(cut);
    }
  }

  function getActiveJ29SkuCut() {
    const skuBtn = document.querySelector('#j29_sku_toggles .ab-toggle.active');
    if (!skuBtn) return 'arpu3';
    return skuBtn.textContent.indexOf('ARPU7') >= 0 ? 'arpu7' : 'arpu3';
  }

  function renderJun29KPIs() {
    const d = jun29Data;
    const mdauDelta = (d.eng.test.mdau - d.eng.base.mdau).toFixed(2);
    const arpu7Delta = d.d3whales.arpu7.test.arpu - d.d3whales.arpu7.base.arpu;
    document.getElementById('kpiRow').innerHTML = `
      <div class="kpi-card"><p class="kpi-label">MDAU — gap narrowing</p><p class="kpi-value neutral">${d.eng.base.mdau} vs ${d.eng.test.mdau}</p><p class="kpi-note">essentially flat (${mdauDelta} Test)</p></div>
      <div class="kpi-card" style="border-color:var(--teal);background:var(--teal-light);"><p class="kpi-label">D3 whale ARPU7 ★</p><p class="kpi-value up">+₹${arpu7Delta.toLocaleString()}</p><p class="kpi-note">Test ₹${d.d3whales.arpu7.test.arpu.toLocaleString()} vs Base ₹${d.d3whales.arpu7.base.arpu.toLocaleString()}</p></div>
      <div class="kpi-card"><p class="kpi-label">Whale NDR</p><p class="kpi-value neutral">${d.eng.base.ndr}% / ${d.eng.test.ndr}%</p><p class="kpi-note">both arms up ~77%</p></div>
      <div class="kpi-card"><p class="kpi-label">D3 revenue whales</p><p class="kpi-value neutral">${d.d3whales.total}</p><p class="kpi-note">183 Base · 200 Test (mature D3)</p></div>
      <div class="kpi-card"><p class="kpi-label">D3 whale ARPU3</p><p class="kpi-value down">−₹${(d.d3whales.arpu3.base.arpu - d.d3whales.arpu3.test.arpu).toLocaleString()}</p><p class="kpi-note">back-loaded — recovers by D7</p></div>
    `;
  }

  function renderJun29SkuInsights(cut) {
    const lines = cut === 'arpu3'
      ? [
          ins('warn', '<strong>HC_Pack drives D3 dip.</strong> Test ARPU3 ₹459 vs Base ₹665 (−₹206). Conv% also lower (−4.5pp).'),
          ins('', '<strong>SP still dominant.</strong> ~₹800 ARPU3 both arms; total SP revenue flat/higher in Test — more whales dilute per-user ARPU.'),
          ins('good', '<strong>Small Test gains in TP and Monthly Offer</strong> — not enough to offset HC_Pack at D3.')
        ]
      : [
          ins('good', '<strong>Test ahead on D7 across tail SKUs.</strong> Others +₹251, HC_Pack +₹227, TP +₹100 ARPU7 per user.'),
          ins('good', '<strong>SP flat through D7.</strong> Core offer monetisation unchanged — ₹919 vs ₹927.'),
          ins('warn', '<strong>International lifts D7.</strong> ARPU7 +₹795 Intl vs +₹466 India in Test. Others bucket includes uncategorized offers.')
        ];
    renderInsights('j29_sku_insights', lines);
  }

  function renderJun29SkuChart(cut) {
    const sku = jun29Data.d3whales.sku;
    const title = cut === 'arpu3' ? 'SKU ARPU3 — ₹ per D3 whale user' : 'SKU ARPU7 — ₹ per D3 whale user (mature D7 installs)';
    document.getElementById('j29_sku_chart_title').textContent = title;
    if (HWReport.charts['j29_d3_sku_arpu']) {
      HWReport.charts['j29_d3_sku_arpu'].destroy();
      delete HWReport.charts['j29_d3_sku_arpu'];
    }
    buildABBar('j29_d3_sku_arpu', sku[cut].base, sku[cut].test, {
      fmt: 'inr',
      labels: sku.labels,
      yMin: 0
    });
    renderJun29SkuInsights(cut);
  }

  function renderJun29Charts() {
    const e = jun29Data.eng;
    const er = jun29Data.engRank;
    const d3 = jun29Data.d3whales;

    buildABGrouped('j29_eng_overall',
      [e.base.mdau, e.base.wr, e.base.rwr, e.base.bot],
      [e.test.mdau, e.test.wr, e.test.rwr, e.test.bot],
      ['MDAU', 'Win Rate %', 'Real-User WR %', 'Bot %']
    );
    buildABBar('j29_normal_rank', er.base.normalMpd, er.test.normalMpd, { labels: jun29Data.ranks });

    buildABBar('j29_rank_mdau', er.base.mdau, er.test.mdau, { labels: jun29Data.ranks });
    buildABBar('j29_rank_rwr', er.base.rwr, er.test.rwr, { fmt: 'pct', labels: jun29Data.ranks, yMin: 40, yMax: 80 });
    buildABBar('j29_rank_ndr', er.base.ndr, er.test.ndr, { fmt: 'pct', labels: jun29Data.ranks, yMin: 20, yMax: 70 });

    buildABGrouped('j29_d3_arpu_overall',
      [d3.arpu3.base.arpu, d3.arpu7.base.arpu],
      [d3.arpu3.test.arpu, d3.arpu7.test.arpu],
      ['ARPU3 (₹)', 'ARPU7 (₹)'],
      { fmt: 'inr' }
    );

    const r = d3.region;
    document.getElementById('j29_d3_region_tbl').innerHTML = `
      <thead>
        <tr><th>Region</th><th>Window</th><th class="post">Base</th><th class="pre">Test</th><th class="delta">Δ</th></tr>
      </thead>
      <tbody>
        <tr><td>India</td><td>ARPU3</td><td style="text-align:center">₹${r.arpu3.base.india.toLocaleString()}</td><td style="text-align:center">₹${r.arpu3.test.india.toLocaleString()}</td><td><span class="delta-pill ${r.arpu3.test.india - r.arpu3.base.india >= 0 ? 'up' : 'down'}">₹${r.arpu3.test.india - r.arpu3.base.india >= 0 ? '+' : ''}${(r.arpu3.test.india - r.arpu3.base.india).toLocaleString()}</span></td></tr>
        <tr><td>International</td><td>ARPU3</td><td style="text-align:center">₹${r.arpu3.base.intl.toLocaleString()}</td><td style="text-align:center">₹${r.arpu3.test.intl.toLocaleString()}</td><td><span class="delta-pill ${r.arpu3.test.intl - r.arpu3.base.intl >= 0 ? 'up' : 'down'}">₹${r.arpu3.test.intl - r.arpu3.base.intl >= 0 ? '+' : ''}${(r.arpu3.test.intl - r.arpu3.base.intl).toLocaleString()}</span></td></tr>
        <tr><td>India</td><td>ARPU7</td><td style="text-align:center">₹${r.arpu7.base.india.toLocaleString()}</td><td style="text-align:center">₹${r.arpu7.test.india.toLocaleString()}</td><td><span class="delta-pill up">+₹${(r.arpu7.test.india - r.arpu7.base.india).toLocaleString()}</span></td></tr>
        <tr><td>International</td><td>ARPU7</td><td style="text-align:center">₹${r.arpu7.base.intl.toLocaleString()}</td><td style="text-align:center">₹${r.arpu7.test.intl.toLocaleString()}</td><td><span class="delta-pill up">+₹${(r.arpu7.test.intl - r.arpu7.base.intl).toLocaleString()}</span></td></tr>
      </tbody>`;

    renderJun29SkuChart('arpu3');
  }

  function switchD3Sku(cut, btn) {
    document.querySelectorAll('#j29_sku_toggles .ab-toggle').forEach(function (el) { el.classList.remove('active'); });
    btn.classList.add('active');
    renderJun29SkuChart(cut);
  }
  window.switchD3Sku = switchD3Sku;

  showJun29();
};

document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('timelineSelect')) {
    HWReport.initWhaleMm();
  }
});
