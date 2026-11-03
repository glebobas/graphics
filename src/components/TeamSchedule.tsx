import { useMemo } from "react";
import { TEAMS, type Team } from "../constants";
import { useSchedule } from "../hooks/useSchedule";
import type { MonthCtx } from "../utils/schedule";
import { EmployeeCards } from "./EmployeeCards";
import { ScheduleTable } from "./ScheduleTable";

interface Props {
  team: Team;
  year: number;
  month: number;
  canEdit: boolean;
}

export function TeamSchedule({ team, year, month, canEdit }: Props) {
  const { doc, employees } = TEAMS[team];
  const { schedule, hours, loading, toggle, setHours } = useSchedule(doc, canEdit);

  const ctx = useMemo<MonthCtx>(
    () => ({ year, month, schedule, hours, employees }),
    [year, month, schedule, hours, employees],
  );

  if (loading) return null;

  return (
    <>
      <ScheduleTable ctx={ctx} readOnly={!canEdit} onToggle={toggle} onSetHours={setHours} />
      <EmployeeCards ctx={ctx} />
    </>
  );
}
