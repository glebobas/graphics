import { useState } from "react";
import { LABELS } from "../constants";
import type { TimeRange, WorkingShift } from "../types";
import { isToday } from "../utils/isToday";
import {
  daysInMonth,
  defaultHours,
  dowStr,
  fmtNum,
  fmtRange,
  getHours,
  getShift,
  isConflict,
  isWeekend,
  padTwo,
  scheduleKey,
  type MonthCtx,
} from "../utils/schedule";
import { HoursModal } from "./HoursModal";

interface Props {
  ctx: MonthCtx;
  readOnly: boolean;
  onToggle: (key: string) => void;
  onSetHours: (key: string, range: TimeRange | null) => void;
}

interface Editing {
  key: string;
  title: string;
  value: TimeRange;
  def: TimeRange;
}

const PencilIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M11.5 1.5l3 3L5 14H2v-3z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export function ScheduleTable({ ctx, readOnly, onToggle, onSetHours }: Props) {
  const { year, month } = ctx;
  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
  const [editing, setEditing] = useState<Editing | null>(null);

  return (
    <div className="card">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th className="name-th">Сотрудник</th>
              {days.map((d) => {
                const today = isToday(year, month, d) ? " is-today" : "";
                return (
                  <th key={d} className={`day-num${isWeekend(year, month, d) ? " weekend-col" : ""}${today}`}>
                    {d}
                    <span className={`dow${today}`}>{dowStr(year, month, d)}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ctx.employees.map((emp) => {
              const { id } = emp;
              return (
                <tr key={id}>
                  <td className="name-td">
                    <span className="emp-name">{emp.name}</span>
                    <span className="emp-insta">{emp.instagram}</span>
                  </td>
                  {days.map((d) => {
                    const key = scheduleKey(id, year, month, d);
                    const sh = getShift(ctx, id, d);
                    const h = getHours(ctx, id, d);
                    const editable = !readOnly && !h?.locked;
                    const cls = [
                      "chip",
                      sh,
                      isConflict(ctx, id, d) && "conflict",
                      !editable && "readonly",
                      h && "has-hours",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <td key={d} className={isWeekend(year, month, d) ? "weekend-col" : ""}>
                        <span className="cell">
                          <span
                            className={cls}
                            title={h ? `${emp.name}: ${h.start}–${h.end} (${fmtNum(h.hours)} ч)` : undefined}
                            onClick={editable ? () => onToggle(key) : undefined}
                          >
                            {h ? (
                              <>
                                <span className="chip-time">{fmtRange(h)}</span>
                                <span className="chip-hours">{fmtNum(h.hours)}ч</span>
                              </>
                            ) : (
                              LABELS[sh]
                            )}
                          </span>
                          {editable && h && (
                            <button
                              className="edit-btn"
                              aria-label="Изменить часы"
                              onClick={() =>
                                setEditing({
                                  key,
                                  title: `${emp.name} · ${dowStr(year, month, d)} ${padTwo(d)}.${padTwo(month + 1)}`,
                                  value: { start: h.start, end: h.end },
                                  def: defaultHours(sh as WorkingShift, year, month, d),
                                })
                              }
                            >
                              <PencilIcon />
                            </button>
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

      {editing && (
        <HoursModal
          title={editing.title}
          value={editing.value}
          def={editing.def}
          onSave={(range) => onSetHours(editing.key, range)}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
