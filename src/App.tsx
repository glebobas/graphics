import { useEffect, useState } from "react";
import { AuthBar } from "./components/AuthBar";
import { Header } from "./components/Header";
import { Legend } from "./components/Legend";
import { TeamSchedule } from "./components/TeamSchedule";
import { TeamTabs } from "./components/TeamTabs";
import type { Team } from "./constants";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [team, setTeam] = useState<Team>("bar");
  const { user, role } = useAuth();

  // После входа открываем свой график
  useEffect(() => {
    if (role) setTeam(role);
  }, [role]);

  const shiftMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  const canEdit = role === team;

  return (
    <div className="page">
      <AuthBar user={user} role={role} />
      <Header
        year={year}
        month={month}
        readOnly={!canEdit}
        onPrev={() => shiftMonth(-1)}
        onNext={() => shiftMonth(1)}
      />
      <TeamTabs value={team} own={role} onChange={setTeam} />
      <Legend />
      <TeamSchedule key={team} team={team} year={year} month={month} canEdit={canEdit} />
    </div>
  );
}
