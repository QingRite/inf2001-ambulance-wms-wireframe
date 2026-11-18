# WMS interactive wireframe prototype (INF2001 P12 Team 2, M2)

Clickable prototype of the ambulance workload management system (WMS).
Plain HTML, CSS and JavaScript.


| Username | Role | Lands on |
| --- | --- | --- |
| `nur.aisyah` | Paramedic | My Schedule |
| `ravi.kumar` | Care Assistant | My Schedule |
| `marcus.tan` | Driver | My Schedule (Dispatch shows driving details) |
| `rachel.lim` | Manager | Overview |
| `jason.ong` | IT Administrator | Accounts |
| `alex.wong` | Deactivated account | Login denied state |

Password for all: `demo1234`. Any other password shows the login-failed state.

**Prototype date:** every page treats today as **Fri 27 Nov 2026**, so screenshots always show the same dates.
The week of 07–13 Dec 2026 is the draft roster (same week as the white-box tests in 4.2.5).

**How to open:** double-click `index.html`. Every page opens inside a device preview: the app runs in a phone on the
left, and the prototype controls sit in a panel on the right. The label above the device says which view you are in.

**Prototype controls panel** (not part of the design; everything inside the device is the real app):
- **Toggle view:** switch between Phone (390 × 760) and Laptop (1280 × 800, scaled to fit). Your choice is remembered.
- **View as:** jump straight to Nur Aisyah, Ravi Kumar, Marcus Tan, Rachel Lim or Jason Ong without logging in.
- **This screen:** states for whichever screen is open (cutoff passed, roster published, 24 hours later, white-box tests #1–#6...).
- **Any screen:** simulate 15 minutes idle, reset prototype data, log out.

Data is saved in your own browser only. "Reset prototype data" puts everything back to the starting state.

## What is built 

**Shared**

| File | Page | Requirements | Use cases |
| --- | --- | --- | --- |
| `index.html` | Device preview: phone or laptop frame with the prototype controls panel | NFR-05, NFR-11 | – |
| `login.html` | Login | FR-01, FR-31, FR-43 | – |
| `session-expired.html` | Session expired | NFR-11 | – |
| `components.html` | Shared components reference | NFR-07, NFR-18 | – |

**Operational staff** (log in as `nur.aisyah`, `ravi.kumar` or `marcus.tan`)

| File | Page | Requirements | Use cases |
| --- | --- | --- | --- |
| `staff-schedule.html` | My Schedule (staff landing page) | FR-11, FR-18, FR-19, FR-20, FR-33 (staff view), FR-37 | UC-03, UC-04 |
| `staff-availability.html` | Availability and preferences | FR-12, FR-13, FR-14, FR-17, FR-30, FR-31, NFR-04 | UC-01, UC-02 |
| `staff-requests.html` | Requests (late requests, swaps, absence) | FR-14, FR-21, FR-22, FR-23, FR-31 | UC-05, UC-06, UC-07 |
| `staff-dispatch.html` | Dispatch (medical) / My vehicle (Driver) | FR-26, FR-27, FR-38, FR-39, FR-40 | UC-08, UC-09 |
| `staff-profile.html` | Profile and access denied | FR-38, FR-41 | – |

**Manager** (log in as `rachel.lim`)

| File | Page | Requirements | Use cases |
| --- | --- | --- | --- |
| `manager-overview.html` | Overview: weekly hours, lowest 3, over-40 warning, ambulance status, staffing alert | FR-02, FR-03, FR-04, FR-05, FR-06 | UC-11 |
| `manager-allocation.html` | Allocation: draft roster, compare staff, rest-period check, publish | FR-07, FR-08, FR-09, FR-10, FR-35 | UC-10, UC-16 |
| `manager-coverage.html` | Coverage: who is on duty on a date, slots below minimum | FR-05, FR-06, FR-34 | UC-11 |
| `manager-timetable.html` | Timetable with leave categories | FR-33 (Manager view) | UC-11 |
| `manager-requests.html` | Late availability requests with reasons | FR-15, FR-16 | UC-13 |
| `manager-swaps.html` | Unstaffed positions, stand-ins, swap approvals | FR-20, FR-22, FR-24, FR-25 | UC-12, UC-14 |
| `manager-leave.html` | Leave records, certificates, record an absence | FR-23, FR-36, FR-41 | UC-05, UC-15 |

**IT Administrator** (log in as `jason.ong`)

| File | Page | Requirements | Use cases |
| --- | --- | --- | --- |
| `admin-accounts.html` | Create, edit, deactivate accounts | FR-28, FR-29, FR-42, FR-43, BR-02 | UC-17 |
| `admin-roles.html` | Change a user's role, edit role permissions | FR-28, FR-29, FR-41, FR-42 | UC-18 |
| `admin-audit.html` | Audit log (read-only) | FR-32, NFR-16 | – |

Shared data: `assets/wms-roster.js` holds the 123 staff, 10 ambulances and the 14 twelve-hour slots of the draft roster
for 07–13 Dec 2026. `_template.html` is the starting file for a new page. `todo.html` and `staff-app.html` are no longer used (`staff-app.html` only forwards old links to `index.html`) and can be deleted.

**How the two sides connect** (same browser): a staff late request, shift rejection, accepted swap or absence appears on the
Manager pages; Manager approvals, stand-ins and roster publication show up in staff notifications and on My Schedule and Requests.

## How to add a page

1. Copy `_template.html` and rename it (for example `manager-allocation.html`).
2. On `<body>`, set `data-group` (`staff`, `manager` or `admin`) and `data-active` (the page's key in `NAV` in `assets/wms.js`).
3. In `assets/wms.js`, add the page to that role's `NAV` list with your file name.
4. Use the pieces in `components.html` (buttons, status labels, form errors, pop-ups, notifications). Do not invent new styles.

## Conventions (from the Wireframes section of the report)

- Colours: navy and blue for structure and main actions, green for available and approved, amber for tentative and warnings, red for errors and destructive actions, coral only for the logo and notification badge.
- Every status is a colour plus a text label (NFR-07). Same label for the same action on every page, Cancel on the left, main action on the right (NFR-18).
- Every logged-in page: navy top bar (WMS logo, name and role, bell with inbox panel, Log out) and folder-style tabs; the active tab joins the white content panel below it.
- Pop-ups are a white box over the dimmed page. Errors show a (!) message next to each invalid field plus a summary near the main button (FR-31).
- Works from 360 px phone width to desktop (NFR-05); buttons are at least 44 px tall.
- Personas: Nur Aisyah (Paramedic), Ravi Kumar (Care Assistant), Marcus Tan (Driver), Rachel Lim (Manager), Jason Ong (IT Administrator).


## Known limits

- No backend or database. Data is kept in your own browser (localStorage), so each person testing sees their own data.
- Staff and Manager pages share data only inside one browser. To demo a full flow, use the same browser for both
  logins. "Reset prototype data" on any page clears everything.
- Staff-side shift dates (weeks of 23 Nov and 30 Nov) are separate sample data from the Manager's draft week (07–13 Dec).
- The 15-minute idle logout only runs at phone widths (768 px or narrower), as NFR-11 is about mobile sessions.
