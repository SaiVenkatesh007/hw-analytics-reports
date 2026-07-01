window.HWReport = window.HWReport || {};

HWReport.initCatalog = function () {
  var listEl = document.getElementById('report-list');
  if (!listEl) return;

  fetch('catalog.json')
    .then(function (r) { return r.json(); })
    .then(function (catalog) {
      var reports = catalog.reports.slice().sort(function (a, b) {
        return b.date.localeCompare(a.date);
      });

      var allTags = [];
      reports.forEach(function (rep) {
        rep.tags.forEach(function (t) {
          if (allTags.indexOf(t) === -1) allTags.push(t);
        });
      });
      allTags.sort();

      var filtersEl = document.getElementById('catalog-filters');
      var activeTag = '';

      function ownerInitials(name) {
        return name.split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
      }

      function renderCards() {
        var filtered = activeTag
          ? reports.filter(function (r) { return r.tags.indexOf(activeTag) !== -1; })
          : reports;

        if (!filtered.length) {
          listEl.innerHTML = '<p class="catalog-empty">No reports match this filter.</p>';
          return;
        }

        listEl.innerHTML = filtered.map(function (r) {
          var tagHtml = r.tags.map(function (t) {
            return '<span class="tag-pill">' + t + '</span>';
          }).join('');

          return (
            '<a class="report-card" href="' + r.slug + '.html">' +
              '<div class="report-card-top">' +
                '<span class="owner-badge" title="' + r.owner + '">' + ownerInitials(r.owner) + '</span>' +
              '</div>' +
              '<h3>' + r.title + '</h3>' +
              '<p class="meta">' + r.date_label + ' · ' + r.owner + '</p>' +
              '<div class="tag-row">' + tagHtml + '</div>' +
              '<p class="thesis">' + r.thesis + '</p>' +
            '</a>'
          );
        }).join('');
      }

      function renderFilters() {
        if (!filtersEl) return;
        var chips = ['<button type="button" class="filter-chip active" data-tag="">All</button>'];
        allTags.forEach(function (t) {
          chips.push('<button type="button" class="filter-chip" data-tag="' + t + '">' + t + '</button>');
        });
        filtersEl.innerHTML = chips.join('');
        filtersEl.querySelectorAll('.filter-chip').forEach(function (btn) {
          btn.addEventListener('click', function () {
            activeTag = btn.getAttribute('data-tag') || '';
            filtersEl.querySelectorAll('.filter-chip').forEach(function (b) {
              b.classList.toggle('active', b === btn);
            });
            renderCards();
          });
        });
      }

      renderFilters();
      renderCards();
    })
    .catch(function () {
      listEl.innerHTML = '<p class="catalog-empty">Could not load report catalog.</p>';
    });
};

document.addEventListener('DOMContentLoaded', function () {
  HWReport.initCatalog();
});
