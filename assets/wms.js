/* WMS prototype shared script.
   Builds the shell (logo, nav, user, bell + inbox), and provides modal, toast,
   form-error, storage and prototype-control helpers used by every page.
   Plain JavaScript, no libraries, works when opened from the file system. */
(function () {
  'use strict';

  /* ---------- Prototype "today" (fixed so every screenshot shows the same dates) ---------- */
  var TODAY = '2026-11-27'; // Friday 27 Nov 2026

  /* ---------- Personas (login usernames) ---------- */
  var PERSONAS = {
    'nur.aisyah': { name: 'Nur Aisyah', role: 'Paramedic', group: 'staff', id: 'PM-05', zone: 'North zone, Ang Mo Kio base', phone: '9123 4567', email: 'nur.aisyah@hospital.example', address: 'Blk 456 Yishun Ave 6, #08-21' },
    'ravi.kumar': { name: 'Ravi Kumar', role: 'Care Assistant', group: 'staff', id: 'CA-03', zone: 'North zone, Ang Mo Kio base', phone: '9234 5678', email: 'ravi.kumar@hospital.example', address: 'Blk 12 Toa Payoh Lor 7, #03-110' },
    'marcus.tan': { name: 'Marcus Tan', role: 'Driver', group: 'staff', id: 'DRV-03', zone: 'North zone, Ang Mo Kio base', phone: '9345 6789', email: 'marcus.tan@hospital.example', address: 'Blk 88 Bishan St 12, #10-05' },
    'rachel.lim': { name: 'Rachel Lim', role: 'Manager', group: 'manager', id: 'MGR-002' },
    'jason.ong': { name: 'Jason Ong', role: 'IT Administrator', group: 'admin', id: 'IT-001' },
    'alex.wong': { name: 'Alex Wong', role: 'Paramedic', group: 'staff', id: 'PM-031', deactivated: true }
  };
  var PASSWORD = 'demo1234';

  /* ---------- Navigation per role (teammates' pages go through todo.html until built) ---------- */
  var NAV = {
    staff: [
      ['schedule', 'My Schedule', 'staff-schedule.html'],
      ['availability', 'Availability', 'staff-availability.html'],
      ['requests', 'Requests', 'staff-requests.html'],
      ['dispatch', 'Dispatch', 'staff-dispatch.html'],
      ['profile', 'Profile', 'staff-profile.html']
    ],
    manager: [
      ['manager-overview', 'Overview', 'manager-overview.html'],
      ['manager-allocation', 'Allocation', 'manager-allocation.html'],
      ['manager-coverage', 'Coverage', 'manager-coverage.html'],
      ['manager-timetable', 'Timetable', 'manager-timetable.html'],
      ['manager-requests', 'Requests', 'manager-requests.html'],
      ['manager-swaps', 'Swaps & Stand-ins', 'manager-swaps.html'],
      ['manager-leave', 'Leave Records', 'manager-leave.html']
    ],
    admin: [
      ['admin-accounts', 'Accounts', 'admin-accounts.html'],
      ['admin-roles', 'Roles & Permissions', 'admin-roles.html'],
      ['admin-audit', 'Audit Log', 'admin-audit.html']
    ]
  };
  var HOME = { staff: 'staff-schedule.html', manager: 'manager-overview.html', admin: 'admin-accounts.html' };
  var DEFAULT_USER = { staff: 'nur.aisyah', manager: 'rachel.lim', admin: 'jason.ong' };

  /* ---------- Shared sample data ---------- */
  var WEEKS = [
    { id: '2026-11-23', label: '23 – 29 Nov 2026', draft: false },
    { id: '2026-11-30', label: '30 Nov – 06 Dec 2026', draft: false },
    { id: '2026-12-07', label: '07 – 13 Dec 2026', draft: true }
  ];
  var MY_SHIFTS = [
    { id: 's1', date: '2026-11-23', slot: 'Day', amb: 'AMB-03', week: '2026-11-23' },
    { id: 's2', date: '2026-11-27', slot: 'Day', amb: 'AMB-03', week: '2026-11-23' },
    { id: 's3', date: '2026-11-28', slot: 'Night', amb: 'AMB-05', week: '2026-11-23' },
    { id: 's4', date: '2026-11-30', slot: 'Day', amb: 'AMB-03', week: '2026-11-30' },
    { id: 's5', date: '2026-12-01', slot: 'Day', amb: 'AMB-03', week: '2026-11-30' },
    { id: 's6', date: '2026-12-03', slot: 'Night', amb: 'AMB-05', week: '2026-11-30' },
    { id: 's7', date: '2026-12-07', slot: 'Day', amb: 'AMB-03', week: '2026-12-07' },
    { id: 's8', date: '2026-12-09', slot: 'Day', amb: 'AMB-03', week: '2026-12-07' },
    { id: 's9', date: '2026-12-11', slot: 'Day', amb: 'AMB-03', week: '2026-12-07' }
  ];
  var COLLEAGUES = {
    'Paramedic': [
      { name: 'Daniel Ho', shifts: [{ id: 'c1', date: '2026-12-02', slot: 'Day', amb: 'AMB-03' }, { id: 'c2', date: '2026-12-04', slot: 'Day', amb: 'AMB-02' }] },
      { name: 'Siti Rahim', shifts: [{ id: 'c3', date: '2026-11-29', slot: 'Night', amb: 'AMB-05' }, { id: 'c4', date: '2026-12-05', slot: 'Day', amb: 'AMB-04' }] },
      { name: 'Arjun Menon', shifts: [{ id: 'c5', date: '2026-12-02', slot: 'Night', amb: 'AMB-01' }, { id: 'c6', date: '2026-12-01', slot: 'Night', amb: 'AMB-01' }] }
    ],
    'Care Assistant': [
      { name: 'Jun Wei Lee', shifts: [{ id: 'c1', date: '2026-12-02', slot: 'Day', amb: 'AMB-03' }, { id: 'c2', date: '2026-12-04', slot: 'Day', amb: 'AMB-02' }] },
      { name: 'Farah Iskandar', shifts: [{ id: 'c3', date: '2026-11-29', slot: 'Night', amb: 'AMB-05' }, { id: 'c4', date: '2026-12-05', slot: 'Day', amb: 'AMB-04' }] }
    ],
    'Driver': [
      { name: 'Hafiz Osman', shifts: [{ id: 'c1', date: '2026-12-02', slot: 'Day', amb: 'AMB-03' }, { id: 'c2', date: '2026-12-04', slot: 'Day', amb: 'AMB-02' }] },
      { name: 'Kelvin Goh', shifts: [{ id: 'c3', date: '2026-11-29', slot: 'Night', amb: 'AMB-05' }, { id: 'c4', date: '2026-12-05', slot: 'Day', amb: 'AMB-04' }] }
    ]
  };
  var SLOT_TIME = { Day: '08:00–20:00', Night: '20:00–08:00' };

  /* ---------- Storage (wrapped: some browsers block it for local files) ---------- */
  var memory = {};
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem('wms.' + k); return v === null ? d : JSON.parse(v); }
      catch (e) { return k in memory ? memory[k] : d; }
    },
    set: function (k, v) {
      try { localStorage.setItem('wms.' + k, JSON.stringify(v)); } catch (e) { memory[k] = v; }
    },
    clearAll: function () {
      try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf('wms.') === 0) localStorage.removeItem(k); }); } catch (e) { memory = {}; }
    }
  };

  /* ---------- Small helpers ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function nonWs(s) { return String(s || '').replace(/\s/g, '').length; }
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function parse(iso) { var p = iso.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function iso(d) { return d.toISOString().slice(0, 10); }
  function addDays(isoStr, n) { var d = parse(isoStr); d.setUTCDate(d.getUTCDate() + n); return iso(d); }
  function fmtDate(isoStr, opts) {
    var d = parse(isoStr); opts = opts || {};
    var s = (opts.noDay ? '' : DAYS[d.getUTCDay()] + ' ') + String(d.getUTCDate()).padStart(2, '0') + ' ' + MONTHS[d.getUTCMonth()];
    return opts.year ? s + ' ' + d.getUTCFullYear() : s;
  }
  function shiftLabel(s) { return fmtDate(s.date) + ', ' + s.slot + ' ' + SLOT_TIME[s.slot] + ' · ' + s.amb; }
  function ago(ts) {
    var m = Math.max(1, Math.round((Date.now() - ts) / 60000));
    if (m < 60) return m + ' min ago';
    var h = Math.round(m / 60); if (h < 24) return h + (h === 1 ? ' hour ago' : ' hours ago');
    var dd = Math.round(h / 24); return dd + (dd === 1 ? ' day ago' : ' days ago');
  }

  var LOGO_MARK = '<span class="logo-mark" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z"/></svg></span>';
  var ICONS = {
    bell: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    alert: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="7" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    lock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
    clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="12" y1="7" x2="12.01" y2="7"/></svg>'
  };

  /* ---------- Current user ---------- */
  function currentUser() {
    var key = store.get('user', null);
    return key && PERSONAS[key] ? Object.assign({ key: key }, PERSONAS[key]) : null;
  }
  function ensureUser(group) {
    var u = currentUser();
    if (!u || u.group !== group) { store.set('user', DEFAULT_USER[group]); u = currentUser(); }
    return u;
  }
  function login(key) { store.set('user', key); }
  function logout() { store.set('user', null); }

  /* ---------- Notifications ---------- */
  function seedNotes(u) {
    var now = Date.now(), min = 60000;
    if (u.group === 'staff') {
      var c = (COLLEAGUES[u.role] || [])[0];
      return [
        { id: 'n1', text: 'Availability for the week of 14 Dec closes Thu 03 Dec, 00:00 (SGT).', ts: now - 3 * 60 * min, read: false },
        { id: 'n2', text: (c ? c.name : 'A colleague') + ' wants to swap Wed 02 Dec, Day with your Tue 01 Dec, Day.', ts: now - 45 * min, read: false },
        { id: 'n3', text: 'Your roster for 30 Nov – 06 Dec 2026 has been published.', ts: now - 4 * 24 * 60 * min, read: true }
      ];
    }
    if (u.group === 'manager') {
      return [
        { id: 'n1', text: 'Fewer than six fully staffed ambulances in service – Mon 07 Dec 2026, 08:00–20:00.', ts: now - 5 * min, read: false },
        { id: 'n2', text: 'Nur Aisyah submitted a late availability request for 07 – 13 Dec 2026.', ts: now - 30 * min, read: false }
      ];
    }
    return [{ id: 'n1', text: 'Role and permission changes for Kelvin Goh were saved.', ts: now - 2 * 60 * min, read: true }];
  }
  function notes(u) {
    u = u || currentUser(); if (!u) return [];
    var list = store.get('notes.' + u.key, null);
    if (!list) { list = seedNotes(u); store.set('notes.' + u.key, list); }
    return list;
  }
  function notify(text, userKey) {
    var key = userKey || (currentUser() || {}).key; if (!key) return;
    var u = Object.assign({ key: key }, PERSONAS[key]);
    var list = notes(u);
    list.unshift({ id: 'n' + Date.now(), text: text, ts: Date.now(), read: false });
    store.set('notes.' + key, list);
    renderInbox();
  }

  /* ---------- Shell ---------- */
  var inboxTab = 'inbox';
  function buildShell() {
    var group = document.body.getAttribute('data-group');
    if (!group) return;
    var u = ensureUser(group);
    var active = document.body.getAttribute('data-active');
    var skip = '<a class="skip" href="#main">Skip to content</a>';
    var nav = NAV[group].map(function (n) {
      return '<a href="' + n[2] + '"' + (n[0] === active ? ' aria-current="page"' : '') + '>' + esc(n[1]) + '</a>';
    }).join('');
    var html = skip +
      '<header class="shell"><div class="shell-bar">' +
      '<a class="logo" href="' + HOME[group] + '" aria-label="WMS home">' + LOGO_MARK + '<span class="logo-text"><strong>WMS</strong><small>Ambulance Workforce</small></span></a>' +
      '<div class="shell-right">' +
      '<div class="who"><span class="who-name">' + esc(u.name) + '</span><span class="who-role">' + esc(u.role) + '</span></div>' +
      '<button class="icon-btn" id="bell" aria-haspopup="true" aria-expanded="false" aria-controls="inbox">' + ICONS.bell + '<span class="badge" id="bell-badge"></span></button>' +
      '<a class="logout" href="index.html" id="logout">Log out</a>' +
      '</div>' +
      '<div class="inbox" id="inbox" hidden role="region" aria-label="Notifications"></div>' +
      '</div></header>' +
      '<nav class="folder-tabs" aria-label="Main">' + nav + '</nav>';
    document.body.classList.add('has-shell');
    document.body.insertAdjacentHTML('afterbegin', html);
    document.getElementById('logout').addEventListener('click', function () { logout(); });
    var bell = document.getElementById('bell'), box = document.getElementById('inbox');
    bell.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = box.hidden; box.hidden = !open; bell.setAttribute('aria-expanded', String(open));
      if (open) renderInbox();
    });
    document.addEventListener('click', function (e) { if (!box.hidden && !box.contains(e.target)) { box.hidden = true; bell.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) { box.hidden = true; bell.setAttribute('aria-expanded', 'false'); bell.focus(); } });
    renderInbox();
    startIdleTimer();
  }
  function renderInbox() {
    var box = document.getElementById('inbox'); if (!box) return;
    var list = notes();
    var unread = list.filter(function (n) { return !n.read; });
    var badge = document.getElementById('bell-badge');
    badge.textContent = unread.length || '';
    badge.style.display = unread.length ? '' : 'none';
    document.getElementById('bell').setAttribute('aria-label', 'Notifications, ' + unread.length + ' unread');
    var shown = inboxTab === 'inbox' ? unread : list;
    box.innerHTML =
      '<div class="inbox-head"><h2>Notifications</h2><button class="linklike" id="mark-all">Mark all as read</button></div>' +
      '<div class="inbox-tabs" role="tablist">' +
      '<button role="tab" aria-selected="' + (inboxTab === 'inbox') + '" data-tab="inbox">Inbox (' + unread.length + ')</button>' +
      '<button role="tab" aria-selected="' + (inboxTab === 'all') + '" data-tab="all">All</button></div>' +
      (shown.length ? '<ul>' + shown.map(function (n) {
        return '<li class="' + (n.read ? 'read' : '') + '"><span class="dot" aria-hidden="true"></span><div>' + esc(n.text) +
          '<span class="time">' + ago(n.ts) + (n.read ? '' : ' · <span class="sr-only">unread</span>') + '</span></div></li>';
      }).join('') + '</ul>' : '<p class="empty">You have no unread notifications.</p>');
    box.querySelectorAll('[data-tab]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.stopPropagation(); inboxTab = b.getAttribute('data-tab'); renderInbox(); });
    });
    document.getElementById('mark-all').addEventListener('click', function (e) {
      e.stopPropagation();
      var all = notes(); all.forEach(function (n) { n.read = true; });
      store.set('notes.' + currentUser().key, all); renderInbox();
    });
  }
  function openInbox() {
    var box = document.getElementById('inbox'); if (!box) return;
    // deferred so the click that triggered it does not immediately close the panel
    setTimeout(function () { box.hidden = false; document.getElementById('bell').setAttribute('aria-expanded', 'true'); renderInbox(); }, 0);
  }

  /* ---------- Session timeout (NFR-11: 15 min idle on mobile) ---------- */
  function startIdleTimer() {
    if (!window.matchMedia || !window.matchMedia('(max-width: 768px)').matches) return;
    var t; var reset = function () { clearTimeout(t); t = setTimeout(function () { location.href = 'session-expired.html'; }, 15 * 60 * 1000); };
    ['click', 'keydown', 'touchstart', 'scroll'].forEach(function (ev) { document.addEventListener(ev, reset, { passive: true }); });
    reset();
  }

  /* ---------- Modal ---------- */
  var lastFocus = null;
  function closeModal() {
    var o = document.querySelector('.modal-overlay'); if (o) o.remove();
    document.removeEventListener('keydown', modalKeys);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  var modalCancel = null;
  function modalKeys(e) {
    if (e.key === 'Escape') { var c = modalCancel; closeModal(); if (c) c(); }
    if (e.key === 'Tab') {
      var m = document.querySelector('.modal'); if (!m) return;
      var f = m.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  }
  /* actions: secondary first, primary last (NFR-18: same order on every screen) */
  function modal(opts) {
    closeModal();
    lastFocus = document.activeElement; modalCancel = opts.onCancel || null;
    var o = document.createElement('div'); o.className = 'modal-overlay';
    o.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
      '<h2 id="modal-title">' + esc(opts.title) + '</h2><div class="modal-body">' + (opts.html || '') + '</div>' +
      '<div class="actions"></div></div>';
    var bar = o.querySelector('.actions');
    (opts.actions || [{ label: 'OK', primary: true }]).forEach(function (a) {
      var b = document.createElement('button');
      b.className = 'btn' + (a.primary ? ' primary' : '') + (a.danger ? ' danger' : '');
      b.textContent = a.label; b.type = 'button';
      b.addEventListener('click', function () { var keep = a.onClick ? a.onClick(o) : false; if (keep !== true) closeModal(); });
      bar.appendChild(b);
    });
    o.addEventListener('click', function (e) { if (e.target === o && opts.dismissable !== false) { var c = modalCancel; closeModal(); if (c) c(); } });
    document.body.appendChild(o);
    document.addEventListener('keydown', modalKeys);
    var first = o.querySelector('input, select, textarea') || o.querySelector('.actions .btn');
    if (first) first.focus();
    if (opts.onOpen) opts.onOpen(o);
    return o;
  }

  /* ---------- Toast ---------- */
  function toast(msg) {
    var z = document.querySelector('.toast-zone');
    if (!z) { z = document.createElement('div'); z.className = 'toast-zone'; z.setAttribute('role', 'status'); z.setAttribute('aria-live', 'polite'); document.body.appendChild(z); }
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; z.appendChild(t);
    setTimeout(function () { t.remove(); }, 4500);
  }

  /* ---------- Form errors (FR-31: name each invalid field and the fix) ---------- */
  function setError(el, msg) {
    var f = el.closest('.field') || el.parentElement; f.classList.add('has-error');
    el.setAttribute('aria-invalid', 'true');
    var id = (el.id || 'f' + Math.random().toString(36).slice(2)) + '-err';
    var old = f.querySelector('.err'); if (old) old.remove();
    var p = document.createElement('p'); p.className = 'err'; p.id = id; p.innerHTML = ICONS.alert + '<span>' + esc(msg) + '</span>';
    f.appendChild(p); el.setAttribute('aria-describedby', id);
  }
  function clearErrors(scope) {
    scope.querySelectorAll('.has-error').forEach(function (f) { f.classList.remove('has-error'); });
    scope.querySelectorAll('.err').forEach(function (e) { e.remove(); });
    scope.querySelectorAll('[aria-invalid]').forEach(function (e) { e.removeAttribute('aria-invalid'); e.removeAttribute('aria-describedby'); });
    var s = scope.querySelector('.form-summary'); if (s) s.innerHTML = '';
  }
  function summary(scope, msg) {
    var s = scope.querySelector('.form-summary'); if (!s) return;
    s.innerHTML = '<div class="banner err" role="alert">' + ICONS.alert + '<p>' + esc(msg) + '</p></div>';
  }

  /* ---------- Prototype controls (shown below the page, outside the design) ---------- */
  function controls(items) {
    var sec = document.createElement('aside'); sec.className = 'proto'; sec.setAttribute('aria-label', 'Prototype controls');
    sec.innerHTML = '<div class="proto-inner"><h2>Prototype controls – not part of the design</h2><div class="btns"></div></div>';
    var btns = sec.querySelector('.btns');
    var all = (items || []).concat([
      { label: 'Simulate 15 min idle on mobile (NFR-11)', onClick: function () { location.href = 'session-expired.html'; } },
      { label: 'Reset prototype data', onClick: function () { var k = store.get('user', null); store.clearAll(); store.set('user', k); location.reload(); } }
    ]);
    all.forEach(function (it) {
      var b = document.createElement('button'); b.className = 'btn'; b.type = 'button'; b.textContent = it.label;
      if (typeof it.pressed === 'boolean') b.setAttribute('aria-pressed', String(it.pressed));
      b.addEventListener('click', function () { var r = it.onClick(b); if (typeof r === 'boolean') b.setAttribute('aria-pressed', String(r)); });
      btns.appendChild(b);
    });
    document.body.appendChild(sec);
  }

  /* ---------- Audit trail (FR-32): every committed roster, swap, absence, replacement or account change ---------- */
  function audit(action, target, prev, next) {
    var u = currentUser() || { name: 'System' };
    var list = store.get('audit', null) || seedAudit();
    list.unshift({ ts: Date.now(), user: u.name, ip: '10.20.4.' + (11 + (u.name.length * 7) % 80), action: action, target: target, prev: prev == null ? '–' : String(prev), next: next == null ? '–' : String(next) });
    store.set('audit', list.slice(0, 300));
  }
  function seedAudit() {
    var h = 3600000, now = Date.now();
    var s = [
      { ts: now - 2 * h, user: 'Jason Ong', ip: '10.20.4.67', action: 'Role changed', target: 'Kelvin Goh (DRV-15)', prev: 'Driver: standard permissions', next: 'Driver: + view crew listings' },
      { ts: now - 26 * h, user: 'Rachel Lim', ip: '10.20.4.81', action: 'Absence recorded', target: 'Daniel Ho (PM-06)', prev: '–', next: 'Annual Leave 03–04 Dec 2026' },
      { ts: now - 50 * h, user: 'Rachel Lim', ip: '10.20.4.81', action: 'Roster published', target: 'Week 30 Nov – 06 Dec 2026', prev: 'Draft', next: 'Published' },
      { ts: now - 74 * h, user: 'Jason Ong', ip: '10.20.4.67', action: 'Account deactivated', target: 'Alex Wong (PM-31)', prev: 'Active', next: 'Deactivated' }
    ];
    store.set('audit', s); return s;
  }
  function isDeactivated(key) {
    var acc = store.get('accounts', null);
    if (acc) { var a = acc.filter(function (x) { return x.username === key; })[0]; if (a) return a.status === 'Deactivated'; }
    return !!(PERSONAS[key] && PERSONAS[key].deactivated);
  }

  window.WMS = {
    LOGO_MARK: LOGO_MARK, TODAY: TODAY, PERSONAS: PERSONAS, PASSWORD: PASSWORD, HOME: HOME, NAV: NAV,
    WEEKS: WEEKS, MY_SHIFTS: MY_SHIFTS, COLLEAGUES: COLLEAGUES, SLOT_TIME: SLOT_TIME, ICONS: ICONS,
    store: store, esc: esc, nonWs: nonWs, parse: parse, addDays: addDays, fmtDate: fmtDate, shiftLabel: shiftLabel, ago: ago,
    currentUser: currentUser, ensureUser: ensureUser, login: login, logout: logout,
    notes: notes, notify: notify, openInbox: openInbox, renderInbox: renderInbox,
    modal: modal, closeModal: closeModal, toast: toast, setError: setError, clearErrors: clearErrors, summary: summary, controls: controls, audit: audit, seedAudit: seedAudit, isDeactivated: isDeactivated
  };

  buildShell();
})();
