/* ══════════════════════════════════════════
   СОТРУДНИКИ — редактируйте здесь
══════════════════════════════════════════ */
const EMPLOYEES = {
  emp1: { id: "emp1", name: "Рома", instagram: "@roma" },
  emp2: { id: "emp2", name: "Егор", instagram: "@egor" },
  emp3: { id: "emp3", name: "Глеб", instagram: "@gleb" },
};
const EMP_KEYS = Object.keys(EMPLOYEES);

/* ══════════════════════════════════════════
   Константы
══════════════════════════════════════════ */
const SHIFTS = ["off", "day", "eve"];
const LABELS = { off: "—", day: "Д", eve: "В" };
const SHIFT_NAMES = { day: "день", eve: "вечер" };
const SHIFT_SHORT = { day: "Д", eve: "В" };
const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];
const DAYS_RU = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const CAL_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

let year = new Date().getFullYear();
let month = new Date().getMonth();
let schedule = {};
let readOnly = false;

/* ══════════════════════════════════════════
   Фиксированные часы работы — Сентябрь 2026
   Реальные интервалы (не общий "день/вечер"),
   поэтому хранятся отдельно от schedule.
══════════════════════════════════════════ */
const HOURS_YEAR = 2026;
const HOURS_MONTH = 8; // сентябрь (0-indexed)

const HOURS_DATA = {
  1: [{ id: "emp1", start: "12:00", end: "02:00", hours: 14 }],
  2: [{ id: "emp3", start: "12:00", end: "02:00", hours: 14 }],
  3: [{ id: "emp3", start: "12:00", end: "02:00", hours: 14 }],
  4: [
    { id: "emp1", start: "12:00", end: "02:00", hours: 14 },
    { id: "emp3", start: "17:00", end: "04:00", hours: 11 },
  ],
  5: [
    { id: "emp1", start: "12:00", end: "02:00", hours: 14 },
    { id: "emp3", start: "17:00", end: "04:00", hours: 11 },
  ],
  6: [
    { id: "emp2", start: "12:00", end: "23:00", hours: 11 },
    { id: "emp3", start: "19:00", end: "02:00", hours: 7 },
  ],
  7: [{ id: "emp2", start: "12:00", end: "02:00", hours: 14 }],
  8: [{ id: "emp1", start: "12:00", end: "02:00", hours: 14 }],
  9: [{ id: "emp1", start: "12:00", end: "02:00", hours: 14 }],
  10: [{ id: "emp1", start: "12:00", end: "02:00", hours: 14 }],
  11: [
    { id: "emp2", start: "12:00", end: "02:00", hours: 14 },
    { id: "emp3", start: "17:00", end: "04:00", hours: 11 },
  ],
  12: [
    { id: "emp2", start: "12:00", end: "02:00", hours: 14 },
    { id: "emp1", start: "17:00", end: "04:00", hours: 11 },
  ],
  13: [
    { id: "emp2", start: "12:00", end: "23:00", hours: 11 },
    { id: "emp3", start: "19:00", end: "02:00", hours: 7 },
  ],
  14: [
    { id: "emp1", start: "12:00", end: "23:00", hours: 11 },
    { id: "emp3", start: "19:00", end: "02:00", hours: 7 },
  ],
  15: [
    { id: "emp2", start: "12:00", end: "23:00", hours: 11 },
    { id: "emp3", start: "19:00", end: "02:00", hours: 7 },
  ],
  16: [
    { id: "emp2", start: "12:00", end: "23:00", hours: 11 },
    { id: "emp3", start: "19:00", end: "02:00", hours: 7 },
  ],
  17: [{ id: "emp3", start: "12:00", end: "02:00", hours: 14 }],
  18: [
    { id: "emp1", start: "12:00", end: "02:00", hours: 14 },
    { id: "emp3", start: "17:00", end: "04:00", hours: 11 },
  ],
  19: [
    { id: "emp2", start: "12:00", end: "02:00", hours: 14 },
    { id: "emp1", start: "17:00", end: "04:00", hours: 11 },
  ],
  20: [
    { id: "emp2", start: "12:00", end: "23:00", hours: 11 },
    { id: "emp3", start: "19:00", end: "02:00", hours: 7 },
  ],
  21: [
    { id: "emp2", start: "12:00", end: "23:00", hours: 11 },
    { id: "emp3", start: "19:00", end: "02:00", hours: 7 },
  ],
  22: [
    { id: "emp1", start: "12:00", end: "23:00", hours: 11 },
    { id: "emp3", start: "19:00", end: "02:00", hours: 7 },
  ],
  23: [
    { id: "emp2", start: "12:00", end: "23:00", hours: 11 },
    { id: "emp3", start: "19:00", end: "02:00", hours: 7 },
  ],
  24: [
    { id: "emp2", start: "12:00", end: "23:00", hours: 11 },
    { id: "emp3", start: "19:00", end: "02:00", hours: 7 },
  ],
  25: [
    { id: "emp1", start: "12:00", end: "02:00", hours: 14 },
    { id: "emp3", start: "17:00", end: "04:00", hours: 11 },
  ],
  26: [
    { id: "emp2", start: "12:00", end: "02:00", hours: 14 },
    { id: "emp1", start: "17:00", end: "04:00", hours: 11 },
  ],
  27: [
    { id: "emp2", start: "12:00", end: "23:00", hours: 11 },
    { id: "emp3", start: "19:00", end: "02:00", hours: 7 },
  ],
  28: [{ id: "emp2", start: "12:00", end: "02:00", hours: 14 }],
  29: [
    { id: "emp1", start: "12:00", end: "23:00", hours: 11 },
    { id: "emp3", start: "19:00", end: "02:00", hours: 7 },
  ],
  30: [
    { id: "emp1", start: "12:00", end: "23:00", hours: 11 },
    { id: "emp3", start: "19:00", end: "02:00", hours: 7 },
  ],
};

function hoursEntry(id, d) {
  if (year !== HOURS_YEAR || month !== HOURS_MONTH) return null;
  const list = HOURS_DATA[d];
  if (!list) return null;
  return list.find((e) => e.id === id) || null;
}
function shiftFromHours(h) {
  return h.start === "12:00" ? "day" : "eve";
}
function shortHour(t) {
  return t.split(":")[0];
}
function fmtRange(h) {
  return `${shortHour(h.start)}–${shortHour(h.end)}`;
}

/* ══════════════════════════════════════════
   Helpers
══════════════════════════════════════════ */
function key(id, d) {
  return `${id}|${year}|${month}|${d}`;
}
function getShift(id, d) {
  const h = hoursEntry(id, d);
  if (h) return shiftFromHours(h);
  return schedule[key(id, d)] || "off";
}
function nextShift(s) {
  return SHIFTS[(SHIFTS.indexOf(s) + 1) % SHIFTS.length];
}
function daysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}
function isWeekend(d) {
  const w = new Date(year, month, d).getDay();
  return w === 0 || w === 6;
}
function dowIdx(d) {
  return new Date(year, month, d).getDay();
}
function dowStr(d) {
  return DAYS_RU[dowIdx(d)];
}
function isConflict(id, d) {
  return d > 1 && getShift(id, d - 1) === "eve" && getShift(id, d) === "day";
}
function padTwo(n) {
  return String(n).padStart(2, "0");
}
function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ══════════════════════════════════════════
   JSON: экспорт и загрузка
══════════════════════════════════════════ */
function exportJSON() {
  const data = JSON.stringify({ schedule }, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "schedule.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

/* Пытаемся загрузить schedule.json из той же папки.
   Если файл есть → режим просмотра.
   Если нет (404) → режим редактирования. */
async function tryLoadJSON() {
  try {
    const res = await fetch("schedule.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("no file");
    const data = await res.json();
    schedule = data.schedule || {};
    readOnly = true;
  } catch {
    readOnly = false;
    const saved = localStorage.getItem("schedule_data");
    if (saved) {
      try {
        schedule = JSON.parse(saved).schedule || {};
      } catch {}
    }
  }
  applyMode();
  render();
}

function applyMode() {
  if (readOnly) {
    document.getElementById("readonly-banner").classList.add("visible");
    document.getElementById("export-btn").style.display = "none";
    document.getElementById("header-sub").textContent = "Актуальный график";
  } else {
    document.getElementById("readonly-banner").classList.remove("visible");
    document.getElementById("export-btn").style.display = "flex";
    document.getElementById("header-sub").textContent = "Нажмите на ячейку, чтобы переключить смену";
  }
}

function persistLocal() {
  localStorage.setItem("schedule_data", JSON.stringify({ schedule }));
}

/* ══════════════════════════════════════════
   Main render
══════════════════════════════════════════ */
function render() {
  document.getElementById("month-label").textContent = MONTHS[month] + " " + year;
  const days = daysInMonth(year, month);
  renderTable(days);
  renderEmpCards(days);
  renderWeeks(days);
}

/* ── Schedule table ── */
function renderTable(days) {
  const table = document.getElementById("sched-table");
  let html = '<thead><tr><th class="name-th">Сотрудник</th>';

  for (let d = 1; d <= days; d++) {
    const we = isWeekend(d);
    html += `<th class="day-num${we ? " weekend-col" : ""}">${d}<span class="dow">${dowStr(d)}</span></th>`;
  }
  html += "</tr></thead><tbody>";

  for (const id of EMP_KEYS) {
    const emp = EMPLOYEES[id];
    html += `<tr>
      <td class="name-td">
        <span class="emp-name">${emp.name}</span>
        <span class="emp-insta">${emp.instagram}</span>
      </td>`;
    for (let d = 1; d <= days; d++) {
      const h = hoursEntry(id, d);
      const sh = getShift(id, d);
      const we = isWeekend(d);
      const cf = isConflict(id, d);
      const ro = readOnly || h ? " readonly" : "";
      const title = h ? ` title="${emp.name}: ${h.start}–${h.end} (${h.hours}ч)"` : "";
      const content = h
        ? `<span class="chip-time">${fmtRange(h)}</span><span class="chip-hours">${h.hours}ч</span>`
        : LABELS[sh];
      html += `<td class="${we ? "weekend-col" : ""}">
        <span class="chip ${sh}${cf ? " conflict" : ""}${ro}${h ? " has-hours" : ""}" data-id="${id}" data-day="${d}"${title}>${content}</span>
      </td>`;
    }
    html += "</tr>";
  }
  html += "</tbody>";
  table.innerHTML = html;

  if (!readOnly) {
    table.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const id = chip.dataset.id;
        const d = parseInt(chip.dataset.day);
        schedule[key(id, d)] = nextShift(getShift(id, d));
        persistLocal();
        render();
      });
    });
  }
}

/* ── Employee cards with mini-calendar ── */
function renderEmpCards(days) {
  const firstDow = new Date(year, month, 1).getDay();
  const offset = firstDow === 0 ? 6 : firstDow - 1;
  let html = "";

  EMP_KEYS.forEach((id, idx) => {
    const emp = EMPLOYEES[id];
    let dayCnt = 0,
      eveCnt = 0,
      conflicts = 0;

    for (let d = 1; d <= days; d++) {
      const sh = getShift(id, d);
      if (sh === "day") dayCnt++;
      if (sh === "eve") eveCnt++;
      if (isConflict(id, d)) conflicts++;
    }
    const total = dayCnt + eveCnt;

    /* DOW header row */
    let calHtml = CAL_LABELS.map((lbl, i) => `<div class="mini-cal-dow${i >= 5 ? " we" : ""}">${lbl}</div>`).join("");

    /* Empty offset cells */
    for (let i = 0; i < offset; i++) {
      calHtml += `<div class="mini-day empty"></div>`;
    }

    /* Day cells */
    for (let d = 1; d <= days; d++) {
      const sh = getShift(id, d);
      const dow = dowIdx(d);
      const we = dow === 0 || dow === 6;
      const cf = isConflict(id, d);
      const cls = ["mini-day", sh, we ? "is-weekend" : "", cf ? "conflict-flag" : ""].filter(Boolean).join(" ");
      const lbl = sh !== "off" ? `<span class="mini-day-lbl">${SHIFT_SHORT[sh]}</span>` : "";
      calHtml += `<div class="${cls}">
        <div class="mini-day-inner">
          <span class="mini-day-num">${d}</span>${lbl}
        </div>
      </div>`;
    }

    const conflictCell =
      conflicts > 0
        ? `<div class="footer-stat">
           <div class="footer-stat-val fv-warn">${conflicts}</div>
           <div class="footer-stat-lbl">Конфликтов</div>
         </div>`
        : "";

    html += `
      <div class="emp-card">
        <div class="emp-card-header">
          <div class="emp-avatar c${idx}">${initials(emp.name)}</div>
          <div class="emp-card-info">
            <div class="emp-card-name">${emp.name}</div>
            <div class="emp-card-ig">${emp.instagram}</div>
          </div>
        </div>
        <div class="mini-cal">
          <div class="mini-cal-grid">${calHtml}</div>
        </div>
        <div class="emp-card-footer">
          <div class="footer-stat">
            <div class="footer-stat-val fv-day">${dayCnt}</div>
            <div class="footer-stat-lbl">Дневных</div>
          </div>
          <div class="footer-stat">
            <div class="footer-stat-val fv-eve">${eveCnt}</div>
            <div class="footer-stat-lbl">Вечерних</div>
          </div>
          <div class="footer-stat">
            <div class="footer-stat-val fv-total">${total}</div>
            <div class="footer-stat-lbl">Всего смен</div>
          </div>
          ${conflictCell}
        </div>
      </div>`;
  });

  document.getElementById("emp-cards").innerHTML = html;
}

/* ── Weekly breakdown ── */
function renderWeeks(days) {
  const weeks = [];
  let weekDays = [];

  for (let d = 1; d <= days; d++) {
    const dow = dowIdx(d);
    if (dow === 1 && weekDays.length > 0) {
      weeks.push(weekDays);
      weekDays = [];
    }
    weekDays.push(d);
    if (dow === 0 && weekDays.length > 0) {
      weeks.push(weekDays);
      weekDays = [];
    }
  }
  if (weekDays.length > 0) weeks.push(weekDays);

  let html = "";
  for (const wDays of weeks) {
    const first = wDays[0];
    const last = wDays[wDays.length - 1];
    const range = `${padTwo(first)}.${padTwo(month + 1)}.${year} — ${padTwo(last)}.${padTwo(month + 1)}.${year}`;

    let daysHtml = "";
    for (const d of wDays) {
      const dow = dowIdx(d);
      const we = dow === 0 || dow === 6;
      const dateStr = `${padTwo(d)}.${padTwo(month + 1)}`;
      const workers = EMP_KEYS.map((id) => ({ emp: EMPLOYEES[id], sh: getShift(id, d), h: hoursEntry(id, d) })).filter(
        (w) => w.sh !== "off",
      );

      const workersHtml =
        workers.length === 0
          ? `<span class="wday-empty">выходной</span>`
          : workers
              .map((w) =>
                w.h
                  ? `<span class="worker-pill ${w.sh}">
                 ${w.emp.name}
                 <span class="shift-badge">${w.h.start}–${w.h.end} · ${w.h.hours}ч</span>
               </span>`
                  : `<span class="worker-pill ${w.sh}">
                 ${w.emp.instagram}
                 <span class="shift-badge"> ${SHIFT_NAMES[w.sh]}</span>
               </span>`,
              )
              .join("");

      daysHtml += `
        <div class="week-day-row${we ? " is-weekend" : ""}">
          <span class="wday-name${we ? " weekend" : ""}">${DAYS_RU[dow]}</span>
          <span class="wday-date">${dateStr}</span>
          <div class="wday-workers">${workersHtml}</div>
        </div>`;
    }

    html += `
      <div class="week-card">
        <div class="week-header">${range}</div>
        <div class="week-days">${daysHtml}</div>
      </div>`;
  }

  document.getElementById("weeks").innerHTML = html;
}

/* ══════════════════════════════════════════
   Events & Init
══════════════════════════════════════════ */
document.getElementById("prev").addEventListener("click", () => {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  render();
});

document.getElementById("next").addEventListener("click", () => {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  render();
});

document.getElementById("export-btn").addEventListener("click", exportJSON);

tryLoadJSON();
