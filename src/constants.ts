import type { Employee, Shift, TimeRange, WorkingShift } from "./types";

export type Team = "bar" | "admin";

interface TeamConfig {
  label: string;
  /** Документ в коллекции schedules */
  doc: string;
  employees: Employee[];
}

/** Команды и сотрудники — редактируйте здесь. id должны быть уникальны в пределах команды */
export const TEAMS: Record<Team, TeamConfig> = {
  bar: {
    label: "Бармены",
    doc: "main",
    employees: [
      { id: "emp1", name: "Рома", instagram: "@roma" },
      { id: "emp2", name: "Егор", instagram: "@egor" },
      { id: "emp3", name: "Глеб", instagram: "@gleb" },
    ],
  },
  admin: {
    label: "Админы",
    doc: "admin",
    employees: [
      { id: "adm1", name: "Админ 1", instagram: "@admin1" },
      { id: "adm2", name: "Админ 2", instagram: "@admin2" },
    ],
  },
};
export const TEAM_KEYS = Object.keys(TEAMS) as Team[];

export const SHIFTS: Shift[] = ["off", "day", "eve"];
export const LABELS: Record<Shift, string> = { off: "—", day: "Д", eve: "В" };
export const SHIFT_NAMES: Record<WorkingShift, string> = { day: "день", eve: "вечер" };
export const SHIFT_SHORT: Record<WorkingShift, string> = { day: "Д", eve: "В" };

/** Часы по умолчанию: [вс–чт, пт–сб] */
export const DEFAULT_HOURS: Record<WorkingShift, [TimeRange, TimeRange]> = {
  day: [
    { start: "11:30", end: "23:00" },
    { start: "11:30", end: "02:00" },
  ],
  eve: [
    { start: "19:00", end: "02:00" },
    { start: "17:00", end: "04:00" },
  ],
};

export const MONTHS = [
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
/** Индекс = Date.getDay() (0 — воскресенье) */
export const DAYS_RU = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
export const CAL_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export const STORAGE_KEY = "schedule_data";
