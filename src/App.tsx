import { useMemo, useState } from "react";
import { AuthBar } from "./components/AuthBar";
import { EmployeeCards } from "./components/EmployeeCards";
import { Header } from "./components/Header";
import { Legend } from "./components/Legend";
import { ScheduleTable } from "./components/ScheduleTable";
import { useSchedule } from "./hooks/useSchedule";
import type { MonthCtx } from "./utils/schedule";

export default function App() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const { schedule, hours, readOnly, loading, toggle, setHours, user } = useSchedule();

  const ctx = useMemo<MonthCtx>(() => ({ year, month, schedule, hours }), [year, month, schedule, hours]);

  const shiftMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  if (loading) return null;

  return (
    <div className="page">
      <AuthBar user={user} />
      <Header
        year={year}
        month={month}
        readOnly={readOnly}
        onPrev={() => shiftMonth(-1)}
        onNext={() => shiftMonth(1)}
      />
      <Legend />
      <ScheduleTable ctx={ctx} readOnly={readOnly} onToggle={toggle} onSetHours={setHours} />
      <EmployeeCards ctx={ctx} />
      {/* <WeeklyBreakdown ctx={ctx} /> */}
    </div>
  );
}
