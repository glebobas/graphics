import { DAYS_RU, DEFAULT_HOURS, SHIFTS } from "../constants";
import { HOURS_DATA, HOURS_MONTH, HOURS_YEAR } from "../hoursData";
import type { HoursEntry, HoursMap, ScheduleMap, Shift, TimeRange, WorkingShift } from "../types";

export interface MonthCtx {
  year: number;
  month: number; // 0-indexed
  schedule: ScheduleMap;
  hours: HoursMap;
}

export interface CellHours extends TimeRange {
  hours: number;
  /** Часы из hoursData.ts — не редактируются */
  locked: boolean;
}

export const scheduleKey = (id: string, year: number, month: number, d: number) =>
  `${id}|${year}|${month}|${d}`;

export const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

export const dowIdx = (year: number, month: number, d: number) => new Date(year, month, d).getDay();

export const dowStr = (year: number, month: number, d: number) => DAYS_RU[dowIdx(year, month, d)];

export const isWeekend = (year: number, month: number, d: number) => {
  const w = dowIdx(year, month, d);
  return w === 0 || w === 6;
};

export const padTwo = (n: number) => String(n).padStart(2, "0");

export const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const nextShift = (s: Shift): Shift => SHIFTS[(SHIFTS.indexOf(s) + 1) % SHIFTS.length];

/* ── Часы ── */
function legacyHours(year: number, month: number, id: string, d: number): HoursEntry | null {
  if (year !== HOURS_YEAR || month !== HOURS_MONTH) return null;
  return HOURS_DATA[d]?.find((entry) => entry.id === id) ?? null;
}

const shiftFromHours = (h: HoursEntry): Shift => (h.start === "12:00" ? "day" : "eve");

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/** Длительность в часах; конец раньше начала — смена через полночь */
export const duration = ({ start, end }: TimeRange) =>
  ((toMin(end) - toMin(start) + 1440) % 1440 || 1440) / 60;

/** Пт и Сб — «длинные» дни */
export const defaultHours = (shift: WorkingShift, year: number, month: number, d: number): TimeRange =>
  DEFAULT_HOURS[shift][[5, 6].includes(dowIdx(year, month, d)) ? 1 : 0];

export const fmtNum = (n: number) => String(+n.toFixed(2)).replace(".", ",");
const shortTime = (t: string) => t.replace(/:00$/, "");
export const fmtRange = (h: TimeRange) => `${shortTime(h.start)}–${shortTime(h.end)}`;

/** Часы ячейки: hoursData.ts → ручная правка → по умолчанию для смены */
export function getHours(ctx: MonthCtx, id: string, d: number): CellHours | null {
  const { year, month } = ctx;
  const legacy = legacyHours(year, month, id, d);
  if (legacy) return { start: legacy.start, end: legacy.end, hours: legacy.hours, locked: true };

  const sh = getShift(ctx, id, d);
  if (sh === "off") return null;
  const range = ctx.hours[scheduleKey(id, year, month, d)] ?? defaultHours(sh, year, month, d);
  return { ...range, hours: duration(range), locked: false };
}

/* ── Смены ── */
export function getShift(ctx: MonthCtx, id: string, d: number): Shift {
  const h = legacyHours(ctx.year, ctx.month, id, d);
  if (h) return shiftFromHours(h);
  return ctx.schedule[scheduleKey(id, ctx.year, ctx.month, d)] ?? "off";
}

/** Короткий отдых: вечерняя смена → дневная на следующий день */
export function isConflict(ctx: MonthCtx, id: string, d: number): boolean {
  return d > 1 && getShift(ctx, id, d - 1) === "eve" && getShift(ctx, id, d) === "day";
}

/** Разбивка месяца на недели (Пн–Вс) */
export function splitWeeks(year: number, month: number): number[][] {
  const days = daysInMonth(year, month);
  const weeks: number[][] = [];
  let cur: number[] = [];
  for (let d = 1; d <= days; d++) {
    const dow = dowIdx(year, month, d);
    if (dow === 1 && cur.length > 0) {
      weeks.push(cur);
      cur = [];
    }
    cur.push(d);
    if (dow === 0) {
      weeks.push(cur);
      cur = [];
    }
  }
  if (cur.length > 0) weeks.push(cur);
  return weeks;
}
