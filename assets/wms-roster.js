/* WMS prototype: shared roster data for the Manager and IT Admin pages.
   Load after assets/wms.js. Builds a deterministic staff list and the draft roster for 07 – 13 Dec 2026,
   saved in the browser so every Manager page (and the staff side) sees the same changes. */
(function () {
  'use strict';
  var W = window.WMS;
  var WEEK = '2026-12-07';
  var AMBS = ['AMB-01', 'AMB-02', 'AMB-03', 'AMB-04', 'AMB-05', 'AMB-06', 'AMB-07', 'AMB-08', 'AMB-09', 'AMB-10'];
  var BASES = { 'AMB-01': 'Ang Mo Kio', 'AMB-02': 'Ang Mo Kio', 'AMB-03': 'Ang Mo Kio', 'AMB-04': 'Bedok', 'AMB-05': 'Bedok', 'AMB-06': 'Bedok', 'AMB-07': 'Jurong', 'AMB-08': 'Jurong', 'AMB-09': 'Novena', 'AMB-10': 'Novena' };
  var SEATS = [['driver', 'Driver'], ['ca', 'Care Assistant'], ['pm1', 'Paramedic'], ['pm2', 'Paramedic']];
  var ROLE_OF_SEAT = { driver: 'Driver', ca: 'Care Assistant', pm1: 'Paramedic', pm2: 'Paramedic' };
  var MIN_FULL = 6;
  var PUBLISH_BY = 'Mon 30 Nov 2026, 08:00';

  /* 14 twelve-hour slots: index 0 = Mon 07 Dec Day, 1 = Mon Night, ... 13 = Sun Night */
  var SLOTS = [];
  for (var i = 0; i < 14; i++) SLOTS.push({ i: i, date: W.addDays(WEEK, Math.floor(i / 2)), slot: i % 2 ? 'Night' : 'Day' });
  function slotLabel(i, short) { var s = SLOTS[i]; return W.fmtDate(s.date) + ', ' + s.slot + (short ? '' : ' ' + W.SLOT_TIME[s.slot]); }

  /* Five rotating teams; no team works two adjacent slots, so every generated shift respects the 12-hour rest rule. */
  var TEAMS = [[0, 4, 8], [1, 5, 13], [2, 6, 10], [3, 7, 11], [9, 12]];

  var FIRST = ['Wei Ming', 'Mei Ling', 'Hui Min', 'Zhi Hao', 'Priya', 'Suresh', 'Nurul', 'Hakim', 'Jia Hui', 'Ethan', 'Chloe', 'Bryan', 'Aisha', 'Kumar', 'Shu Fen', 'Darren', 'Rachel', 'Imran', 'Li Ting', 'Gabriel', 'Farhan', 'Joanne', 'Vikram', 'Xin Yi'];
  var LAST = ['Tan', 'Lim', 'Lee', 'Ng', 'Wong', 'Goh', 'Chua', 'Koh', 'Teo', 'Ong', 'Rahman', 'Pillai', 'Ismail', 'Nair', 'Yeo', 'Chan', 'Low', 'Sim', 'Ho', 'Kaur'];
  var NAMED = {
    'DRV-03': 'Marcus Tan', 'CA-03': 'Ravi Kumar', 'PM-05': 'Nur Aisyah', 'PM-06': 'Daniel Ho', 'PM-12': 'Arjun Menon',
    'PM-13': 'Siti Rahim', 'CA-09': 'Jun Wei Lee', 'DRV-09': 'Hafiz Osman', 'CA-15': 'Farah Iskandar', 'DRV-15': 'Kelvin Goh'
  };
  var USERNAME = { 'DRV-03': 'marcus.tan', 'CA-03': 'ravi.kumar', 'PM-05': 'nur.aisyah' };
  var PREFS = ['Day', 'Night', 'No preference'];
  var DUTIES = ['Emergency response', 'Patient transfer', 'No preference'];
  function num(id) { return parseInt(id.split('-')[1], 10); }
  function pad(n) { return n < 10 ? '0' + n : String(n); }

  var STAFF = [], BY_ID = {}, n = 0;
  function add(id, role, team, amb) {
    var name = NAMED[id] || (FIRST[n % FIRST.length] + ' ' + LAST[(n * 7 + 3) % LAST.length]);
    n++;
    var s = { id: id, name: name, role: role, team: team, amb: amb, base: BASES[amb] || 'Jurong',
      pref: PREFS[(num(id) * 5 + role.length) % 3], duty: DUTIES[(num(id) + role.length) % 3], username: USERNAME[id] || null };
    STAFF.push(s); BY_ID[id] = s;
  }
  for (var t = 0; t < 5; t++) {
    for (var j = 1; j <= 6; j++) {
      add('DRV-' + pad(6 * t + j), 'Driver', t, 'AMB-0' + j);
      add('CA-' + pad(6 * t + j), 'Care Assistant', t, 'AMB-0' + j);
      add('PM-' + pad(12 * t + 2 * j - 1), 'Paramedic', t, 'AMB-0' + j);
      add('PM-' + pad(12 * t + 2 * j), 'Paramedic', t, 'AMB-0' + j);
    }
  }
  /* part-time relief staff (lowest hours) */
  NAMED['DRV-31'] = 'Ahmad Faizal'; NAMED['CA-31'] = 'Grace Tan'; NAMED['PM-61'] = 'Lim Wei Jie';
  add('DRV-31', 'Driver', -1, 'AMB-07'); add('CA-31', 'Care Assistant', -1, 'AMB-07'); add('PM-61', 'Paramedic', -1, 'AMB-07');

  /* Leave in the target week (FR-33, FR-36). Chosen on days the person is not rostered. */
  var LEAVE = [
    { id: 'L-301', staff: 'DRV-20', cat: 'Emergency Leave', start: '2026-12-07', end: '2026-12-07', reason: 'Family member admitted to hospital.', mc: false, by: 'Rachel Lim', recorded: '2026-11-26' },
    { id: 'L-302', staff: 'PM-30', cat: 'Medical Leave', start: '2026-12-09', end: '2026-12-09', reason: 'Minor surgery, 1 day MC.', mc: true, by: 'PM-30 (self)', recorded: '2026-11-24' },
    { id: 'L-303', staff: 'CA-14', cat: 'Annual Leave', start: '2026-12-11', end: '2026-12-11', reason: 'Wedding anniversary.', mc: false, by: 'CA-14 (self)', recorded: '2026-11-10' },
    { id: 'L-298', staff: 'PM-06', cat: 'Annual Leave', start: '2026-12-03', end: '2026-12-04', reason: 'Family trip.', mc: false, by: 'Rachel Lim', recorded: '2026-11-25' },
    { id: 'L-297', staff: 'PM-05', cat: 'Annual Leave', start: '2026-12-21', end: '2026-12-22', reason: 'Family trip.', mc: false, by: 'PM-05 (self)', recorded: '2026-11-02' }
  ];
  function leaves() {
    var extra = W.store.get('mgr.leave', []);
    var staffSide = W.store.get('absences', []).map(function (a, k) {
      return { id: 'L-S' + k, staff: 'PM-05', cat: a.cat, start: a.start, end: a.end, reason: a.desc || '–', mc: !!a.file, by: 'PM-05 (self)', recorded: a.sent };
    });
    return extra.concat(staffSide).concat(LEAVE);
  }
  function onLeave(id, date) { return leaves().filter(function (l) { return l.staff === id && date >= l.start && date <= l.end; })[0] || null; }

  /* ---------- Roster ---------- */
  function emptySlot() { var o = {}; AMBS.forEach(function (a) { o[a] = { driver: null, ca: null, pm1: null, pm2: null }; }); return o; }
  function generate() {
    var r = [];
    for (var i = 0; i < 14; i++) r.push(emptySlot());
    TEAMS.forEach(function (slots, t) {
      slots.forEach(function (i) {
        for (var j = 1; j <= 6; j++) {
          r[i]['AMB-0' + j] = { driver: 'DRV-' + pad(6 * t + j), ca: 'CA-' + pad(6 * t + j), pm1: 'PM-' + pad(12 * t + 2 * j - 1), pm2: 'PM-' + pad(12 * t + 2 * j) };
        }
      });
    });
    r[2]['AMB-07'] = { driver: 'DRV-31', ca: 'CA-31', pm1: 'PM-61', pm2: null };   // relief crew, incomplete (FR-05 flag)
    r[10]['AMB-07'] = { driver: null, ca: null, pm1: 'PM-13', pm2: null };          // Siti Rahim extra shift: 48 h (FR-04)
    r[0]['AMB-06'].pm2 = null;                                                    // Arjun Menon rejected Mon Day: 5 of 6 (FR-06)
    return r;
  }
  function roster() { var r = W.store.get('roster.0712', null); if (!r) { r = generate(); W.store.set('roster.0712', r); } return r; }
  function saveRoster(r) { W.store.set('roster.0712', r); }
  function published() { return W.store.get('published0712', false); }

  function rejections() {
    var r = W.store.get('mgr.rejections', null);
    if (!r) { r = [{ staff: 'PM-12', slot: 0, amb: 'AMB-06', seat: 'pm2', reason: 'Family commitment that morning. I told Rachel last week.', filled: null }]; W.store.set('mgr.rejections', r); }
    return r;
  }

  function seatsOf(id, r) {
    r = r || roster(); var out = [];
    r.forEach(function (slot, i) { AMBS.forEach(function (a) { SEATS.forEach(function (s) { if (slot[a][s[0]] === id) out.push({ slot: i, amb: a, seat: s[0] }); }); }); });
    return out;
  }
  function hours(id, r) { return seatsOf(id, r).length * 12; }
  function isFull(c) { return !!(c.driver && c.ca && c.pm1 && c.pm2); }
  function fullCount(i, r) { r = r || roster(); return AMBS.filter(function (a) { return isFull(r[i][a]); }).length; }
  function crewCount(c) { return ['driver', 'ca', 'pm1', 'pm2'].filter(function (k) { return c[k]; }).length; }
  function missing(c) {
    var m = [];
    if (!c.driver) m.push('Driver'); if (!c.ca) m.push('Care Assistant');
    var p = (c.pm1 ? 1 : 0) + (c.pm2 ? 1 : 0); if (p < 2) m.push((2 - p) + ' Paramedic' + (2 - p > 1 ? 's' : ''));
    return m;
  }
  function ambStatus(c) { var k = crewCount(c); return k === 4 ? 'In service' : k === 0 ? 'Standby' : 'Crew incomplete'; }
  function utilization(a, r) { r = r || roster(); var k = 0; for (var i = 0; i < 14; i++) if (isFull(r[i][a])) k++; return Math.round(k / 14 * 100); }
  function shortSlots(r) { r = r || roster(); var out = []; for (var i = 0; i < 14; i++) { var f = fullCount(i, r); if (f < MIN_FULL) out.push({ i: i, full: f }); } return out; }

  /* FR-10: block when less than 12 h rest before or after; return the conflicting shift and the rest the person would get */
  function restCheck(id, i, r) {
    var mine = seatsOf(id, r);
    var same = mine.filter(function (x) { return x.slot === i; })[0];
    if (same) return { ok: false, kind: 'same', other: same };
    for (var k = 0; k < mine.length; k++) {
      var gap = (Math.abs(mine[k].slot - i) - 1) * 12;
      if (gap < 12) return { ok: false, kind: 'rest', other: mine[k], rest: gap };
    }
    return { ok: true };
  }
  function available(id, i) {
    var o = W.store.get('availOverride', {})[id + '|' + i];
    if (typeof o === 'boolean') return o;
    var s = BY_ID[id]; if (!s) return false;
    if (s.team >= 0 && TEAMS[s.team].indexOf(i) >= 0) return true;
    return (num(id) * 3 + i) % 4 !== 0;
  }
  function jobs(id, date) { return (num(id) + parseInt(date.slice(8), 10)) % 4; }

  /* Mirror of WeeklyRoster.checkStaffingRequirements (white-box 4.2) for one slot */
  function checkStaffingRequirements(i, r) { return fullCount(i, r) >= MIN_FULL; }

  /* White-box test cases #1–#6 for slot Mon 07 Dec Day (4.2.5) */
  function loadTestCase(n) {
    var r = roster(); r[0] = emptySlot();
    var A1 = r[0]['AMB-01'];
    if (n === 2) { A1.ca = 'CA-01'; A1.pm1 = 'PM-01'; A1.pm2 = 'PM-02'; }
    if (n === 3) { A1.driver = 'DRV-01'; A1.pm1 = 'PM-01'; A1.pm2 = 'PM-02'; }
    if (n === 4) { A1.driver = 'DRV-01'; A1.ca = 'CA-01'; A1.pm1 = 'PM-01'; }
    if (n === 5) { r[0]['AMB-01'] = { driver: 'DRV-01', ca: 'CA-01', pm1: 'PM-01', pm2: 'PM-02' }; }
    if (n === 6) for (var j = 1; j <= 6; j++) r[0]['AMB-0' + j] = { driver: 'DRV-0' + j, ca: 'CA-0' + j, pm1: 'PM-' + pad(2 * j - 1), pm2: 'PM-' + pad(2 * j) };
    saveRoster(r); return r;
  }

  function staffName(id) { return BY_ID[id] ? BY_ID[id].name : id; }
  function staffLabel(id) { return BY_ID[id] ? BY_ID[id].name + ' (' + id + ')' : id; }

  /* ---------- User accounts (IT Administrator pages) ---------- */
  function slug(name) { return name.toLowerCase().replace(/[^a-z ]/g, '').trim().replace(/\s+/g, '.'); }
  function accounts() {
    var a = W.store.get('accounts', null);
    if (a) return a;
    var seen = {};
    a = STAFF.map(function (s) {
      var u = s.username || slug(s.name); if (seen[u]) u = u + '.' + num(s.id); seen[u] = 1;
      return { username: u, name: s.name, role: s.role, staffId: s.id, status: 'Active', email: u + '@hospital.example', created: '2025-0' + (1 + num(s.id) % 9) + '-15' };
    });
    a.push({ username: 'rachel.lim', name: 'Rachel Lim', role: 'Manager', staffId: 'MGR-02', status: 'Active', email: 'rachel.lim@hospital.example', created: '2024-03-01' });
    a.push({ username: 'jason.ong', name: 'Jason Ong', role: 'IT Administrator', staffId: 'IT-01', status: 'Active', email: 'jason.ong@hospital.example', created: '2024-01-08' });
    a.push({ username: 'alex.wong', name: 'Alex Wong', role: 'Paramedic', staffId: 'PM-62', status: 'Deactivated', email: 'alex.wong@hospital.example', created: '2025-02-10' });
    W.store.set('accounts', a); return a;
  }
  function saveAccounts(a) { W.store.set('accounts', a); }
  var PERMS = [
    ['own', 'View own schedule and records'], ['avail', 'Submit availability and preferences'], ['shiftreq', 'Reject shifts, request swaps, record own absence'],
    ['dispatch', 'View dispatch details for own ambulance'], ['crew', 'View crew listings and peer shifts'], ['alloc', 'Allocate the draft roster'],
    ['publish', 'Publish the roster'], ['approve', 'Approve late requests, swaps and stand-ins'], ['conf', 'View confidential staff records'],
    ['accounts', 'Manage user accounts'], ['roles', 'Manage roles and permissions'], ['audit', 'View the audit log']
  ];
  var ROLES = ['Paramedic', 'Care Assistant', 'Driver', 'Manager', 'IT Administrator'];
  function rolePerms() {
    var p = W.store.get('rolePerms', null);
    if (!p) {
      var staff = ['own', 'avail', 'shiftreq', 'dispatch', 'crew'];
      p = { 'Paramedic': staff.slice(), 'Care Assistant': staff.slice(), 'Driver': staff.slice(), 'Manager': ['own', 'crew', 'alloc', 'publish', 'approve', 'conf', 'audit'], 'IT Administrator': ['own', 'accounts', 'roles', 'audit'] };
      W.store.set('rolePerms', p);
    }
    return p;
  }
  /* BR-02: no deactivation while on an ongoing shift or a confirmed stand-in assignment (prototype today: Fri 27 Nov, AMB-03 Day crew on duty) */
  var ON_DUTY_NOW = { 'DRV-03': 'AMB-03', 'CA-03': 'AMB-03', 'PM-05': 'AMB-03', 'PM-06': 'AMB-03' };
  function activeDuty(staffId) {
    if (ON_DUTY_NOW[staffId]) return 'is on an ongoing shift (Fri 27 Nov, Day 08:00–20:00, ' + ON_DUTY_NOW[staffId] + ')';
    var f = W.store.get('mgr.filled', {});
    for (var k in f) if (f[k] === staffId) return 'has a confirmed stand-in assignment';
    return null;
  }

  W.R = {
    accounts: accounts, saveAccounts: saveAccounts, PERMS: PERMS, ROLES: ROLES, rolePerms: rolePerms, activeDuty: activeDuty,
    WEEK: WEEK, AMBS: AMBS, BASES: BASES, SEATS: SEATS, ROLE_OF_SEAT: ROLE_OF_SEAT, MIN_FULL: MIN_FULL, PUBLISH_BY: PUBLISH_BY,
    SLOTS: SLOTS, TEAMS: TEAMS, STAFF: STAFF, BY_ID: BY_ID, slotLabel: slotLabel,
    leaves: leaves, onLeave: onLeave, roster: roster, saveRoster: saveRoster, generate: generate, published: published, rejections: rejections,
    seatsOf: seatsOf, hours: hours, isFull: isFull, fullCount: fullCount, crewCount: crewCount, missing: missing, ambStatus: ambStatus,
    utilization: utilization, shortSlots: shortSlots, restCheck: restCheck, available: available, jobs: jobs,
    checkStaffingRequirements: checkStaffingRequirements, loadTestCase: loadTestCase, staffName: staffName, staffLabel: staffLabel
  };
})();
