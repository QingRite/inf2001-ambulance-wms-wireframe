# WMS interactive wireframe prototype (INF2001 P12 Team 2, M2)

Clickable low-fidelity prototype of the ambulance workload management system (WMS).
Plain HTML, CSS and JavaScript.

## How to open

1. Unzip the folder anywhere (a shared drive folder is fine).
2. Double-click `index.html`. It opens in Chrome, Edge, Firefox or Safari.
3. Log in with a demo account (listed in the dashed **Prototype controls** box under the login form).

| Username | Role | Lands on |
| --- | --- | --- |
| `nur.aisyah` | Paramedic | My Schedule |
| `ravi.kumar` | Care Assistant | My Schedule |
| `marcus.tan` | Driver | My Schedule (Dispatch shows driving details) |
| `rachel.lim` | Manager | Placeholder (Mustaqim / Joel to build) |
| `jason.ong` | IT Administrator | Placeholder (Joel to build) |
| `alex.wong` | Deactivated account | Login denied state |

Password for all: `demo1234`. Any other password shows the login-failed state.

**Prototype date:** every page treats today as **Fri 27 Nov 2026**, so screenshots always show the same dates.
The week of 07–13 Dec 2026 is the draft roster (same week as the white-box tests in 4.2.5).

**Prototype controls:** the dashed box at the bottom of each page switches into states that depend on time or on
other people (cutoff passed, roster published, 24 hours later). It is not part of the design. Crop it out of screenshots.
"Reset prototype data" puts everything back to the starting state. Data is saved in your own browser only.

## What is built (7 pages plus the shared components)

| File | Page | Requirements | Use cases |
| --- | --- | --- | --- |
| `index.html` | Login | FR-01, FR-31, FR-43 | – |
| `session-expired.html` | Session expired | NFR-11 | – |
| `staff-schedule.html` | My Schedule (staff landing page) | FR-11, FR-18, FR-19, FR-20, FR-33 (staff view), FR-37 | UC-03, UC-04 |
| `staff-availability.html` | Availability and preferences | FR-12, FR-13, FR-14, FR-17, FR-30, FR-31, NFR-04 | UC-01, UC-02 |
| `staff-requests.html` | Requests (late requests, swaps, absence) | FR-14, FR-21, FR-22, FR-23, FR-31 | UC-05, UC-06, UC-07 |
| `staff-dispatch.html` | Dispatch (medical) / My vehicle (Driver) | FR-26, FR-27, FR-38, FR-39, FR-40 | UC-08, UC-09 |
| `staff-profile.html` | Profile and access denied | FR-38, FR-41 | – |
| `components.html` | Shared components reference | NFR-07, NFR-18 | – |

Also included: `todo.html` (placeholder for every page still to build, with its requirements and notes) and `_template.html` (starting file for a new page).

## Still to build (9 pages plus 1 optional)

Each one already has a nav link that opens `todo.html` with its requirements, use cases, report figures and M1 feedback.
Log in as `rachel.lim` or `jason.ong` to click through them.

| Page | Suggested builder (WBS) | Requirements | Use cases |
| --- | --- | --- | --- |
| Manager Overview | Mustaqim (4.3) | FR-02 to FR-06 | UC-11 |
| Weekly Allocation | Mustaqim (4.3) | FR-07 to FR-10, FR-35 | UC-10, UC-16 |
| Staffing Coverage | Mustaqim (4.3) | FR-05, FR-06, FR-34 | UC-11 |
| Requests to Review | Mustaqim (4.3) | FR-15, FR-16 | UC-13 |
| Timetable (Manager view) | Not assigned – Mustaqim or Kiyonn | FR-33 | UC-11 |
| Swaps & Stand-ins | Joel (4.4) | FR-20, FR-22, FR-24, FR-25 | UC-12, UC-14 |
| Leave Records | Joel (4.4) | FR-23, FR-36, FR-41 | UC-05, UC-15 |
| Accounts | Joel (4.4) | FR-28, FR-29, FR-42, FR-43, BR-02 | UC-17 |
| Roles & Permissions | Joel (4.4) | FR-28, FR-29 | UC-18 |
| Audit Log (optional) | Team decision | FR-32, NFR-16 | – |

**Weekly Allocation publish rule** (so the prototype matches the white-box section 4.2): a crew is fully staffed with at least
1 Driver, 1 Care Assistant and 2 Paramedics. Publish only when at least 6 ambulances are fully staffed in every 12-hour slot;
otherwise keep the roster in Draft and show "Fewer than six fully staffed ambulances in service".

## How to add a page

1. Copy `_template.html` and rename it (for example `manager-allocation.html`).
2. On `<body>`, set `data-group` (`staff`, `manager` or `admin`) and `data-active` (the page's key in `NAV` in `assets/wms.js`).
3. In `assets/wms.js`, change that NAV entry's link from `todo.html?p=...` to your file name.
4. Use the pieces in `components.html` (buttons, status labels, form errors, pop-ups, notifications). Do not invent new styles.

## Conventions (from the Wireframes section of the report)

- Low-fidelity greyscale. Green only for selected availability and approved states; red only for errors and destructive actions.
- Every status is a colour plus a text label (NFR-07). Same label for the same action on every page, Cancel on the left, main action on the right (NFR-18).
- Every logged-in page: WMS logo, role nav with the current tab in bold, name and role, bell with inbox panel.
- Pop-ups are a grey box over the dimmed page. Errors show a (!) message next to each invalid field plus a summary near the main button (FR-31).
- Works from 360 px phone width to desktop (NFR-05); buttons are at least 44 px tall.
- Personas: Nur Aisyah (Paramedic), Ravi Kumar (Care Assistant), Marcus Tan (Driver), Rachel Lim (Manager), Jason Ong (IT Administrator).


## Known limits

- No backend or database. Data is kept in your own browser (localStorage), so each person testing sees their own data.
- Staff actions that notify the Manager (late request, rejection, swap, absence) appear in Rachel Lim's bell inbox,
  because both share the same browser storage. Manager pages that act on them are still to be built.
- The 15-minute idle logout only runs at phone widths (768 px or narrower), as NFR-11 is about mobile sessions.
