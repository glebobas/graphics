import { DAYS_RU, SHIFT_NAMES } from "../constants";
import type { WorkingShift } from "../types";
import { dowIdx, fmtNum, getHours, getShift, padTwo, splitWeeks, type MonthCtx } from "../utils/schedule";

function WeekDayRow({ ctx, d }: { ctx: MonthCtx; d: number }) {
  const { year, month } = ctx;
  const dow = dowIdx(year, month, d);
  const we = dow === 0 || dow === 6;

  const workers = ctx.employees.map((emp) => ({
    emp,
    sh: getShift(ctx, emp.id, d),
    h: getHours(ctx, emp.id, d),
  })).filter((w) => w.sh !== "off");

  return (
    <div className={`week-day-row${we ? " is-weekend" : ""}`}>
      <span className={`wday-name${we ? " weekend" : ""}`}>{DAYS_RU[dow]}</span>
      <span className="wday-date">{`${padTwo(d)}.${padTwo(month + 1)}`}</span>
      <div className="wday-workers">
        {workers.length === 0 ? (
          <span className="wday-empty">выходной</span>
        ) : (
          workers.map((w) => (
            <span key={w.emp.id} className={`worker-pill ${w.sh}`}>
              {w.h ? (
                <>
                  {w.emp.name}
                  <span className="shift-badge">
                    {w.h.start}–{w.h.end} · {fmtNum(w.h.hours)}ч
                  </span>
                </>
              ) : (
                <>
                  {w.emp.instagram}
                  <span className="shift-badge">{SHIFT_NAMES[w.sh as WorkingShift]}</span>
                </>
              )}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

export function WeeklyBreakdown({ ctx }: { ctx: MonthCtx }) {
  const { year, month } = ctx;
  const weeks = splitWeeks(year, month);
  const mm = padTwo(month + 1);

  return (
    <div className="weekly-section">
      <div className="section-title">По неделям</div>
      <div className="weeks-grid">
        {weeks.map((wDays) => (
          <div key={wDays[0]} className="week-card">
            <div className="week-header">
              {padTwo(wDays[0])}.{mm}.{year} — {padTwo(wDays[wDays.length - 1])}.{mm}.{year}
            </div>
            <div className="week-days">
              {wDays.map((d) => (
                <WeekDayRow key={d} ctx={ctx} d={d} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
