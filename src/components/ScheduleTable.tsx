import { EMPLOYEES, EMP_KEYS, LABELS } from "../constants";
import { isToday } from "../utils/isToday";
import {
  daysInMonth,
  dowStr,
  fmtRange,
  getShift,
  hoursEntry,
  isConflict,
  isWeekend,
  scheduleKey,
  type MonthCtx,
} from "../utils/schedule";

interface Props {
  ctx: MonthCtx;
  readOnly: boolean;
  onToggle: (key: string) => void;
}

export function ScheduleTable({ ctx, readOnly, onToggle }: Props) {
  const { year, month } = ctx;
  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);

  return (
    <div className="card">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th className="name-th">Сотрудник</th>
              {days.map((d) => {
                const today = isToday(d);
                return (
                  <th key={d} className={`day-num${isWeekend(year, month, d) ? " weekend-col" : ""} ${today ? "is-today" : ""}`}>
                    {d}
                    <span className={`dow ${today ? "is-today" : ""}`}>{dowStr(year, month, d)}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {EMP_KEYS.map((id) => {
              const emp = EMPLOYEES[id];
              return (
                <tr key={id}>
                  <td className="name-td">
                    <span className="emp-name">{emp.name}</span>
                    <span className="emp-insta">{emp.instagram}</span>
                  </td>
                  {days.map((d) => {
                    const h = hoursEntry(year, month, id, d);
                    const sh = getShift(ctx, id, d);
                    const cls = [
                      "chip",
                      sh,
                      isConflict(ctx, id, d) && "conflict",
                      (readOnly || h) && "readonly",
                      h && "has-hours",
                    ]
                      .filter(Boolean)
                      .join(" ");
                    const clickable = !readOnly && !h;

                    return (
                      <td key={d} className={isWeekend(year, month, d) ? "weekend-col" : ""}>
                        <span
                          className={cls}
                          title={h ? `${emp.name}: ${h.start}–${h.end} (${h.hours}ч)` : undefined}
                          onClick={clickable ? () => onToggle(scheduleKey(id, year, month, d)) : undefined}
                        >
                          {h ? (
                            <>
                              <span className="chip-time">{fmtRange(h)}</span>
                              <span className="chip-hours">{h.hours}ч</span>
                            </>
                          ) : (
                            LABELS[sh]
                          )}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
