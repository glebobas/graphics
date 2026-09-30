import { DAYS_RU, SHIFTS } from "../constants";
import { HOURS_DATA, HOURS_MONTH, HOURS_YEAR } from "../hoursData";
import type { HoursEntry, ScheduleMap, Shift } from "../types";

export interface MonthCtx {
  year: number;
  month: number; // 0-indexed
  schedule: ScheduleMap;
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

/* ── Точные часы ── */
export function hoursEntry(year: number, month: number, id: string, d: number): HoursEntry | null {
  if (year !== HOURS_YEAR || month !== HOURS_MONTH) return null;
  return HOURS_DATA[d]?.find((entry) => entry.id === id) ?? null;
}

const shiftFromHours = (h: HoursEntry): Shift => (h.start === "12:00" ? "day" : "eve");
const shortHour = (t: string) => t.split(":")[0];
export const fmtRange = (h: HoursEntry) => `${shortHour(h.start)}–${shortHour(h.end)}`;

/* ── Смены ── */
export function getShift(ctx: MonthCtx, id: string, d: number): Shift {
  const h = hoursEntry(ctx.year, ctx.month, id, d);
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
