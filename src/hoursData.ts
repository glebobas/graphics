import type { HoursEntry } from "./types";

/**
 * Фиксированные часы работы — Сентябрь 2026.
 * Реальные интервалы (не общий «день/вечер»), поэтому хранятся отдельно от schedule.
 */
export const HOURS_YEAR = 2026;
export const HOURS_MONTH = 8; // сентябрь (0-indexed)

type Tpl = Omit<HoursEntry, "id">;

/** Типовые смены */
const A: Tpl = { start: "12:00", end: "02:00", hours: 14 };
const B: Tpl = { start: "17:00", end: "04:00", hours: 11 };
const C: Tpl = { start: "12:00", end: "23:00", hours: 11 };
const D: Tpl = { start: "19:00", end: "02:00", hours: 7 };

const e = (id: string, t: Tpl): HoursEntry => ({ id, ...t });

export const HOURS_DATA: Record<number, HoursEntry[]> = {
  1: [e("emp1", A)],
  2: [e("emp3", A)],
  3: [e("emp3", A)],
  4: [e("emp1", A), e("emp3", B)],
  5: [e("emp1", A), e("emp3", B)],
  6: [e("emp2", C), e("emp3", D)],
  7: [e("emp2", A)],
  8: [e("emp1", A)],
  9: [e("emp1", A)],
  10: [e("emp1", A)],
  11: [e("emp2", A), e("emp3", B)],
  12: [e("emp2", A), e("emp1", B)],
  13: [e("emp2", C), e("emp3", D)],
  14: [e("emp1", C), e("emp3", D)],
  15: [e("emp2", C), e("emp3", D)],
  16: [e("emp2", C), e("emp3", D)],
  17: [e("emp3", A)],
  18: [e("emp1", A), e("emp3", B)],
  19: [e("emp2", A), e("emp1", B)],
  20: [e("emp2", C), e("emp3", D)],
  21: [e("emp2", C), e("emp3", D)],
  22: [e("emp1", C), e("emp3", D)],
  23: [e("emp2", C), e("emp3", D)],
  24: [e("emp2", C), e("emp3", D)],
  25: [e("emp1", A), e("emp3", B)],
  26: [e("emp2", A), e("emp1", B)],
  27: [e("emp2", C), e("emp3", D)],
  28: [e("emp2", A)],
  29: [e("emp1", C), e("emp3", D)],
  30: [e("emp1", C), e("emp3", D)],
};
