window.HWReport = window.HWReport || {};
HWReport.table = HWReport.table || function () {};

HWReport.table = function (el, opts) {
  opts = opts || {};
  var root = typeof el === 'string' ? document.getElementById(el) : el;
  if (!root) return null;
  var columns = opts.columns || [];
  var rows = (opts.rows || []).map(function (r) { return r.slice(); });
  var sortCol = null;
  var sortDir = 1;

  function render() {
    var tblCls = 'hw-table' + (opts.compTable ? ' comp-table' : '') + (opts.stickyHeader ? ' sticky-head' : '');
    var h = '<div class="hw-table-wrap"><table class="' + tblCls + '">';
    if (opts.caption) h += '<caption>' + opts.caption + '</caption>';
    h += '<thead><tr>';
    columns.forEach(function (col, i) {
      var sortAttr = opts.sortable ? ' aria-sort="none"' : '';
      if (sortCol === i) sortAttr = ' aria-sort="' + (sortDir > 0 ? 'ascending' : 'descending') + '"';
      h += '<th scope="col"' + (opts.sortable ? ' data-col="' + i + '"' + sortAttr : '') + '>' + col.label + '</th>';
    });
    h += '</tr></thead><tbody>';
    rows.forEach(function (row) {
      h += '<tr>';
      row.forEach(function (cell, ci) {
        var col = columns[ci] || {};
        var fmt = col.fmt && HWReport.fmt[col.fmt] ? HWReport.fmt[col.fmt] : null;
        var val = cell;
        if (fmt && typeof cell === 'number') val = fmt(cell);
        var tag = ci === 0 && col.rowHeader ? 'th scope="row"' : 'td';
        h += '<' + tag + '>' + val + '</' + (ci === 0 && col.rowHeader ? 'th' : 'td') + '>';
      });
      h += '</tr>';
    });
    h += '</tbody></table></div>';
    root.innerHTML = h;
    if (opts.sortable) {
      root.querySelectorAll('th[data-col]').forEach(function (th) {
        th.addEventListener('click', function () {
          var ci = parseInt(th.getAttribute('data-col'), 10);
          if (sortCol === ci) sortDir *= -1;
          else { sortCol = ci; sortDir = 1; }
          rows.sort(function (a, b) {
            var av = a[ci];
            var bv = b[ci];
            if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sortDir;
            return String(av).localeCompare(String(bv)) * sortDir;
          });
          render();
        });
      });
    }
  }

  render();
  return {
    exportCsv: function () {
      var lines = [columns.map(function (c) { return '"' + c.label.replace(/"/g, '""') + '"'; }).join(',')];
      rows.forEach(function (row) {
        lines.push(row.map(function (cell) {
          return '"' + String(cell).replace(/"/g, '""') + '"';
        }).join(','));
      });
      return lines.join('\n');
    },
    downloadCsv: function (filename) {
      var blob = new Blob([this.exportCsv()], { type: 'text/csv;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename || 'table.csv';
      a.click();
      URL.revokeObjectURL(a.href);
    },
  };
};

HWReport.initCardChrome = function (scope) {
  var root = scope || document;
  root.querySelectorAll('.card').forEach(function (card) {
    if (card.getAttribute('data-chrome') === '1') return;
    var canvas = card.querySelector('canvas[id]');
    var tableWrap = card.querySelector('.hw-table-wrap, .table-wrap');
    if (!canvas && !tableWrap) return;
    card.setAttribute('data-chrome', '1');
    var titleEl = card.querySelector('.card-title');
    if (!titleEl) return;
    var row = document.createElement('div');
    row.className = 'card-title-row';
    titleEl.parentNode.insertBefore(row, titleEl);
    row.appendChild(titleEl);
    var actions = document.createElement('div');
    actions.className = 'card-actions';
    if (canvas) {
      var pngBtn = document.createElement('button');
      pngBtn.type = 'button';
      pngBtn.className = 'chrome-btn chart-download-btn';
      pngBtn.textContent = 'PNG';
      pngBtn.setAttribute('aria-label', 'Download chart as PNG');
      pngBtn.addEventListener('click', function () {
        HWReport.downloadChart(canvas.id).catch(function () { /* ignore */ });
      });
      actions.appendChild(pngBtn);
      var copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'chrome-btn chart-copy-btn';
      copyBtn.textContent = 'Copy';
      copyBtn.setAttribute('aria-label', 'Copy chart image to clipboard');
      copyBtn.addEventListener('click', function () {
        HWReport.copyChart(canvas.id, copyBtn).catch(function () { /* ignore */ });
      });
      actions.appendChild(copyBtn);
    }
    if (tableWrap) {
      var csvBtn = document.createElement('button');
      csvBtn.type = 'button';
      csvBtn.className = 'chrome-btn';
      csvBtn.textContent = 'CSV';
      csvBtn.addEventListener('click', function () {
        var tableEl = tableWrap.querySelector('table');
        if (!tableEl) return;
        var lines = [];
        tableEl.querySelectorAll('tr').forEach(function (tr) {
          var cells = tr.querySelectorAll('th, td');
          lines.push(Array.prototype.map.call(cells, function (c) {
            return '"' + c.textContent.replace(/"/g, '""') + '"';
          }).join(','));
        });
        var blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (titleEl.textContent || 'table').replace(/\s+/g, '_') + '.csv';
        a.click();
        URL.revokeObjectURL(a.href);
      });
      actions.appendChild(csvBtn);
    }
    var sec = card.closest('.section');
    if (sec && sec.id) {
      var linkBtn = document.createElement('button');
      linkBtn.type = 'button';
      linkBtn.className = 'chrome-btn';
      linkBtn.textContent = 'Link';
      linkBtn.addEventListener('click', function () {
        var url = window.location.origin + window.location.pathname + window.location.search + '#' + sec.id.replace(/^sec-/, '') + window.location.hash.replace(/^#/, '') ? (window.location.hash.indexOf('=') >= 0 ? window.location.hash : '') : '';
        if (sec.id.indexOf('sec-') === 0) {
          url = window.location.href.split('#')[0] + '#' + sec.id;
          if (HWReport.filters && HWReport.filters.get) {
            var fv = HWReport.filters.get();
            var params = new URLSearchParams();
            Object.keys(fv).forEach(function (k) { params.set(k, fv[k]); });
            var qs = params.toString();
            if (qs) url += (url.indexOf('#') >= 0 ? '&' : '#') + qs;
          }
        }
        HWReport._copyText(url, linkBtn, 'Copied!');
      });
      actions.appendChild(linkBtn);
    }
    if (actions.children.length) row.appendChild(actions);
  });
};

HWReport.initSectionAnchors = function () {
  document.querySelectorAll('.section').forEach(function (sec, i) {
    if (sec.id) return;
    var title = sec.querySelector('.section-title');
    if (!title) return;
    var slug = title.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    sec.id = 'sec-' + (slug || 'section-' + i);
    if (!title.querySelector('.sec-anchor')) {
      var a = document.createElement('a');
      a.className = 'sec-anchor';
      a.href = '#' + sec.id;
      a.setAttribute('aria-label', 'Copy link to section');
      a.textContent = '#';
      a.addEventListener('click', function (e) {
        e.preventDefault();
        HWReport._copyText(window.location.href.split('#')[0] + '#' + sec.id, null, null);
      });
      title.appendChild(a);
    }
  });
};
