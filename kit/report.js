window.HWReport = window.HWReport || {};

HWReport._tabSwitchHandler = null;

HWReport._prefersReducedMotion = function () {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

HWReport.switchTab = function (name, btn) {
  document.querySelectorAll('.tab-content').forEach(function (t) {
    t.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(function (b) {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
    b.setAttribute('tabindex', '-1');
  });
  var panel = document.getElementById('tab-' + name);
  if (panel) panel.classList.add('active');
  if (btn) {
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    btn.setAttribute('tabindex', '0');
    btn.focus();
  }
  if (HWReport._tabSwitchHandler) HWReport._tabSwitchHandler(name);
  document.dispatchEvent(new CustomEvent('hwreport:tabswitch', { detail: { name: name } }));
  HWReport.initScoreboard(panel);
};

HWReport.setSubActive = function (btn) {
  btn.closest('.sub-toggle').querySelectorAll('.sub-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');
};

HWReport.countUp = function (el, target, opts) {
  opts = opts || {};
  var suffix = opts.suffix || '';
  var prefix = opts.prefix || '';
  var decimals = opts.decimals != null ? opts.decimals : (String(target).indexOf('.') >= 0 ? 1 : 0);
  if (HWReport._prefersReducedMotion()) {
    el.textContent = prefix + target + suffix;
    return;
  }
  var start = 0;
  var end = parseFloat(target);
  if (isNaN(end)) {
    el.textContent = prefix + target + suffix;
    return;
  }
  var duration = 800;
  var startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    var p = Math.min((ts - startTime) / duration, 1);
    var val = start + (end - start) * p;
    el.textContent = prefix + val.toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
};

HWReport.initScoreboard = function (scope) {
  var root = scope || document;
  root.querySelectorAll('.stat-scoreboard[data-value]').forEach(function (el) {
    if (el.getAttribute('data-animated') === '1') return;
    el.setAttribute('data-animated', '1');
    var val = el.getAttribute('data-value');
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var decimals = el.getAttribute('data-decimals');
    HWReport.countUp(el, val, {
      suffix: suffix,
      prefix: prefix,
      decimals: decimals != null ? parseInt(decimals, 10) : undefined,
    });
  });
};

HWReport.initTabs = function () {
  var tabBar = document.querySelector('.tab-bar');
  if (!tabBar || tabBar.getAttribute('data-a11y') === '1') return;
  tabBar.setAttribute('role', 'tablist');
  tabBar.setAttribute('data-a11y', '1');

  var tabs = tabBar.querySelectorAll('.tab-btn');
  tabs.forEach(function (btn, i) {
    var label = btn.textContent.trim();
    var id = 'tabpanel-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
    btn.setAttribute('tabindex', btn.classList.contains('active') ? '0' : '-1');
    btn.setAttribute('id', 'tab-' + id);
    var panel = document.querySelectorAll('.tab-content')[i];
    if (panel) {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', 'tab-' + id);
      if (!panel.id) panel.id = id;
    }
    btn.addEventListener('keydown', function (e) {
      var idx = Array.prototype.indexOf.call(tabs, btn);
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[idx + 1] || tabs[0];
      if (e.key === 'ArrowLeft') next = tabs[idx - 1] || tabs[tabs.length - 1];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        var panelId = next.getAttribute('onclick');
        if (panelId) {
          var m = panelId.match(/switchTab\('([^']+)'/);
          if (m) HWReport.switchTab(m[1], next);
        }
      }
    });
  });
};

HWReport.initInsights = function () {
  document.querySelectorAll('.insight').forEach(function (el) {
    // Wrap prose in .insight-body so display:flex does not treat each
    // <strong>/text node as its own flex item (breaks mid-sentence on 5s, 60s, etc.).
    if (!el.querySelector('.insight-body')) {
      var body = document.createElement('div');
      body.className = 'insight-body';
      while (el.firstChild) body.appendChild(el.firstChild);
      el.appendChild(body);
    }
    if (el.querySelector('.insight-icon')) return;
    var iconName = 'alert';
    if (el.classList.contains('good')) iconName = 'trend-up';
    else if (el.classList.contains('bad')) iconName = 'trend-down';
    else if (el.classList.contains('warn')) iconName = 'alert';
    var span = document.createElement('span');
    span.className = 'insight-icon';
    span.innerHTML = HWReport.icon ? HWReport.icon(iconName) : '';
    el.insertBefore(span, el.firstChild);
  });
};

HWReport.initSkipLink = function () {
  if (document.querySelector('.skip-link')) return;
  var main = document.querySelector('main');
  if (!main) return;
  if (!main.id) main.id = 'main-content';
  var link = document.createElement('a');
  link.href = '#' + main.id;
  link.className = 'skip-link';
  link.textContent = 'Skip to content';
  document.body.insertBefore(link, document.body.firstChild);
};

HWReport.indexHref = function () {
  var path = window.location.pathname || '';
  return path.indexOf('/kit/') !== -1 ? '../index.html' : 'index.html';
};

HWReport.initChrome = function () {
  var isIndex = !!document.getElementById('report-list');
  var slug = document.body.getAttribute('data-report-slug');
  if (!slug && !isIndex) {
    var page = window.location.pathname.split('/').pop() || '';
    if (page.endsWith('.html') && page !== 'index.html') {
      slug = page.replace('.html', '');
    }
  }
  var owner = document.body.getAttribute('data-report-owner') || '';

  var header = document.querySelector('header');
  if (header && !isIndex && !header.querySelector('.back-to-index')) {
    var brand = header.querySelector('.brand');
    var link = document.createElement('a');
    link.href = HWReport.indexHref();
    link.className = 'back-to-index';
    link.innerHTML = (HWReport.icon ? HWReport.icon('link') : '') + ' All reports';
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

  if (header && slug && !header.querySelector('.header-actions')) {
    var actions = document.createElement('div');
    actions.className = 'header-actions';
    var copyLinkBtn = document.createElement('button');
    copyLinkBtn.type = 'button';
    copyLinkBtn.className = 'chrome-btn';
    copyLinkBtn.innerHTML = (HWReport.icon ? HWReport.icon('copy') : '') + ' Copy link';
    copyLinkBtn.addEventListener('click', function () {
      HWReport._copyText(window.location.href, copyLinkBtn, 'Copied!');
    });
    actions.appendChild(copyLinkBtn);
    var copyHandoffBtn = document.createElement('button');
    copyHandoffBtn.type = 'button';
    copyHandoffBtn.className = 'chrome-btn';
    copyHandoffBtn.textContent = 'Copy handoff';
    copyHandoffBtn.addEventListener('click', function () {
      fetch('handoffs/' + slug + '.txt')
        .then(function (r) {
          if (!r.ok) throw new Error('not found');
          return r.text();
        })
        .then(function (text) {
          HWReport._copyText(text, copyHandoffBtn, 'Copied!');
        })
        .catch(function () {
          copyHandoffBtn.textContent = 'No handoff file';
          setTimeout(function () { copyHandoffBtn.textContent = 'Copy handoff'; }, 2000);
        });
    });
    actions.appendChild(copyHandoffBtn);
    var headerRight = header.querySelector('.header-right');
    if (headerRight) {
      headerRight.insertBefore(actions, headerRight.firstChild);
    } else {
      header.appendChild(actions);
    }
  }

  var footer = document.querySelector('footer');
  if (footer && !isIndex && !footer.querySelector('.footer-nav')) {
    var nav = document.createElement('p');
    nav.className = 'footer-nav';
    var flink = document.createElement('a');
    flink.href = HWReport.indexHref();
    flink.className = 'back-to-index';
    flink.textContent = '← Back to all reports';
    nav.appendChild(flink);
    footer.insertBefore(nav, footer.firstChild);
  }

  if (footer && slug && !footer.querySelector('.footer-actions')) {
    if (owner) {
      var ownerLine = document.createElement('p');
      ownerLine.className = 'footer-meta';
      ownerLine.textContent = 'Analyst: ' + owner;
      footer.insertBefore(ownerLine, footer.firstChild);
    }
    var fActions = document.createElement('div');
    fActions.className = 'footer-actions';
    var flCopy = document.createElement('button');
    flCopy.type = 'button';
    flCopy.className = 'chrome-btn';
    flCopy.textContent = 'Copy report URL';
    flCopy.addEventListener('click', function () {
      HWReport._copyText(window.location.href, flCopy, 'Copied!');
    });
    fActions.appendChild(flCopy);
    footer.insertBefore(fActions, footer.querySelector('.footer-nav') || footer.firstChild);
  }
};

HWReport._copyText = function (text, btn, okLabel) {
  var done = function () {
    if (!btn) return;
    var prev = btn.textContent;
    btn.textContent = okLabel || 'Copied!';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = prev;
      btn.classList.remove('copied');
    }, 2000);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(function () {
      HWReport._copyTextFallback(text, done);
    });
  } else {
    HWReport._copyTextFallback(text, done);
  }
};

HWReport._copyTextFallback = function (text, cb) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (e) { /* ignore */ }
  document.body.removeChild(ta);
  if (cb) cb();
};

HWReport._copyImage = function (blob, btn) {
  var flash = function (ok, failLabel) {
    if (!btn) return;
    var prev = btn.textContent;
    btn.textContent = ok ? 'Copied!' : (failLabel || 'Unavailable');
    btn.classList.toggle('copied', ok);
    btn.classList.toggle('chrome-btn-fail', !ok);
    setTimeout(function () {
      btn.textContent = prev;
      btn.classList.remove('copied', 'chrome-btn-fail');
    }, 2000);
  };
  if (navigator.clipboard && navigator.clipboard.write && window.ClipboardItem) {
    return navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ]).then(function () {
      flash(true);
    }).catch(function () {
      flash(false);
      return Promise.reject(new Error('Clipboard write failed'));
    });
  }
  flash(false);
  return Promise.reject(new Error('Clipboard API unavailable'));
};

HWReport.measureStickyStack = function () {
  var header = document.querySelector('header');
  var tabBar = document.querySelector('.tab-bar');
  var headerH = header ? header.offsetHeight : 0;
  var tabH = tabBar ? tabBar.offsetHeight : 0;
  document.documentElement.style.setProperty('--header-height', headerH + 'px');
  document.documentElement.style.setProperty('--filter-top', (headerH + tabH) + 'px');
};

document.addEventListener('DOMContentLoaded', function () {
  HWReport.initSkipLink();
  HWReport.initTabs();
  HWReport.initChrome();
  HWReport.initInsights();
  HWReport.initSectionAnchors();
  HWReport.initScoreboard();
  HWReport.measureStickyStack();
  window.addEventListener('resize', HWReport.measureStickyStack);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(HWReport.measureStickyStack);
  }
});

document.addEventListener('hwreport:tabswitch', function () {
  requestAnimationFrame(HWReport.measureStickyStack);
});
