export type Shift = "off" | "day" | "eve";
export type WorkingShift = Exclude<Shift, "off">;

export interface Employee {
  id: string;
  name: string;
  instagram: string;
}

/** Ключ вида `emp1|2026|8|15` (месяц 0-indexed, как в исходном коде). */
export type ScheduleMap = Record<string, Shift>;

/** Интервал смены, время в формате `HH:MM` */
export interface TimeRange {
  start: string;
  end: string;
}

/** Ручные правки часов, ключ — как в ScheduleMap */
export type HoursMap = Record<string, TimeRange>;

export interface HoursEntry extends TimeRange {
  id: string;
  hours: number;
}

export interface ScheduleFile {
  schedule: ScheduleMap;
  hours?: HoursMap;
}
