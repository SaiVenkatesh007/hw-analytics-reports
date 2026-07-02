window.HWReport = window.HWReport || {};

HWReport.ICONS = {
  'trend-up': '<svg class="hw-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter"><path d="M2 12 L6 8 L9 11 L14 4"/><path d="M10 4 H14 V8"/></svg>',
  'trend-down': '<svg class="hw-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter"><path d="M2 4 L6 8 L9 5 L14 12"/><path d="M10 12 H14 V8"/></svg>',
  alert: '<svg class="hw-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square"><path d="M8 2 L14 13 H2 Z"/><path d="M8 6 V9"/><path d="M8 11 H8.01"/></svg>',
  users: '<svg class="hw-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square"><circle cx="6" cy="5" r="2.5"/><path d="M1 14 C1 11 3.5 9.5 6 9.5 C8.5 9.5 11 11 11 14"/><circle cx="11.5" cy="5.5" r="2"/><path d="M11 14 C11 12 12.5 10.5 14.5 10.5"/></svg>',
  calendar: '<svg class="hw-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square"><rect x="2" y="3" width="12" height="11"/><path d="M2 7 H14"/><path d="M5 1 V4"/><path d="M11 1 V4"/></svg>',
  trophy: '<svg class="hw-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square"><path d="M3 3 H13 V6 C13 8.5 11 10 8 10 C5 10 3 8.5 3 6 Z"/><path d="M8 10 V12"/><path d="M5 14 H11"/><path d="M3 3 H1 V5 C1 6 2 6.5 3 6.5"/><path d="M13 3 H15 V5 C15 6 14 6.5 13 6.5"/></svg>',
  whale: '<svg class="hw-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square"><path d="M2 8 C2 5 4 3 7 3 C9 3 10 4 11 5 C12 3 14 2 15 2 V10 C14 10 12 11 11 12 C10 14 8 14 6 14 C3 14 2 11 2 8 Z"/><circle cx="5" cy="7" r="0.75" fill="currentColor"/></svg>',
  link: '<svg class="hw-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square"><path d="M6 10 L10 6"/><path d="M7 6 H10 V9"/><path d="M9 10 H6 V7"/></svg>',
  copy: '<svg class="hw-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square"><rect x="5" y="5" width="9" height="9"/><path d="M3 11 V2 H12"/></svg>',
  sun: '<svg class="hw-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square"><circle cx="8" cy="8" r="3"/><path d="M8 1 V3"/><path d="M8 13 V15"/><path d="M1 8 H3"/><path d="M13 8 H15"/><path d="M3 3 L4.5 4.5"/><path d="M11.5 11.5 L13 13"/><path d="M3 13 L4.5 11.5"/><path d="M11.5 4.5 L13 3"/></svg>',
  moon: '<svg class="hw-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square"><path d="M12 2 C9 2.5 7 5 7 8 C7 11 9 13.5 12 14 C10 15 7 14.5 5.5 12.5 C3.5 9.5 4 5.5 7 3.5 C8 2.5 10 2 12 2 Z"/></svg>',
};

HWReport.icon = function (name) {
  return HWReport.ICONS[name] || '';
};
