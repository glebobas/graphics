export type Shift = "off" | "day" | "eve";
export type WorkingShift = Exclude<Shift, "off">;

export interface Employee {
  id: string;
  name: string;
  instagram: string;
}

/** Ключ вида `emp1|2026|8|15` (месяц 0-indexed, как в исходном коде). */
export type ScheduleMap = Record<string, Shift>;

export interface HoursEntry {
  id: string;
  start: string;
  end: string;
  hours: number;
}

export interface ScheduleFile {
  schedule: ScheduleMap;
}
