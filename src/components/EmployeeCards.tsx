import { CAL_LABELS, EMPLOYEES, EMP_KEYS, SHIFT_SHORT } from "../constants";
import type { WorkingShift } from "../types";
import { daysInMonth, dowIdx, getShift, initials, isConflict, type MonthCtx } from "../utils/schedule";

interface CardProps {
  ctx: MonthCtx;
  id: string;
  index: number;
}

function EmployeeCard({ ctx, id, index }: CardProps) {
  const { year, month } = ctx;
  const emp = EMPLOYEES[id];
  const days = daysInMonth(year, month);
  const firstDow = new Date(year, month, 1).getDay();
  const offset = firstDow === 0 ? 6 : firstDow - 1;

  let dayCnt = 0;
  let eveCnt = 0;
  let conflicts = 0;
  for (let d = 1; d <= days; d++) {
    const sh = getShift(ctx, id, d);
    if (sh === "day") dayCnt++;
    if (sh === "eve") eveCnt++;
    if (isConflict(ctx, id, d)) conflicts++;
  }

  return (
    <div className="emp-card">
      <div className="emp-card-header">
        <div className={`emp-avatar c${index}`}>{initials(emp.name)}</div>
        <div className="emp-card-info">
          <div className="emp-card-name">{emp.name}</div>
          <div className="emp-card-ig">{emp.instagram}</div>
        </div>
      </div>

      <div className="mini-cal">
        <div className="mini-cal-grid">
          {CAL_LABELS.map((lbl, i) => (
            <div key={lbl} className={`mini-cal-dow${i >= 5 ? " we" : ""}`}>
              {lbl}
            </div>
          ))}
          {Array.from({ length: offset }, (_, i) => (
            <div key={`e${i}`} className="mini-day empty" />
          ))}
          {Array.from({ length: days }, (_, i) => {
            const d = i + 1;
            const sh = getShift(ctx, id, d);
            const dow = dowIdx(year, month, d);
            const cls = [
              "mini-day",
              sh,
              (dow === 0 || dow === 6) && "is-weekend",
              isConflict(ctx, id, d) && "conflict-flag",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div key={d} className={cls}>
                <div className="mini-day-inner">
                  <span className="mini-day-num">{d}</span>
                  {sh !== "off" && <span className="mini-day-lbl">{SHIFT_SHORT[sh as WorkingShift]}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="emp-card-footer">
        <div className="footer-stat">
          <div className="footer-stat-val fv-day">{dayCnt}</div>
          <div className="footer-stat-lbl">Дневных</div>
        </div>
        <div className="footer-stat">
          <div className="footer-stat-val fv-eve">{eveCnt}</div>
          <div className="footer-stat-lbl">Вечерних</div>
        </div>
        <div className="footer-stat">
          <div className="footer-stat-val fv-total">{dayCnt + eveCnt}</div>
          <div className="footer-stat-lbl">Всего смен</div>
        </div>
        {conflicts > 0 && (
          <div className="footer-stat">
            <div className="footer-stat-val fv-warn">{conflicts}</div>
            <div className="footer-stat-lbl">Конфликтов</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function EmployeeCards({ ctx }: { ctx: MonthCtx }) {
  return (
    <div className="emp-cards-section">
      <div className="section-title">Личное расписание</div>
      <div className="emp-cards-grid">
        {EMP_KEYS.map((id, idx) => (
          <EmployeeCard key={id} ctx={ctx} id={id} index={idx} />
        ))}
      </div>
    </div>
  );
}
