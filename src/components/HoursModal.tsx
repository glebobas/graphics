import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { TimeRange } from "../types";
import { duration, fmtNum } from "../utils/schedule";

interface Props {
  title: string;
  value: TimeRange;
  /** Часы по умолчанию для этой смены */
  def: TimeRange;
  /** null — совпадает с часами по умолчанию */
  onSave: (range: TimeRange | null) => void;
  onClose: () => void;
}

export function HoursModal({ title, value, def, onSave, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [range, setRange] = useState(value);

  useEffect(() => ref.current?.showModal(), []);

  const bind = (k: keyof TimeRange) => ({
    value: range[k],
    onChange: (e: ChangeEvent<HTMLInputElement>) => setRange({ ...range, [k]: e.target.value }),
  });

  const valid = Boolean(range.start && range.end);
  const isDefault = range.start === def.start && range.end === def.end;

  return (
    <dialog
      ref={ref}
      className="modal"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current.close()}
    >
      <form method="dialog" className="modal-body" onSubmit={() => onSave(isDefault ? null : range)}>
        <h3 className="modal-title">{title}</h3>

        <div className="modal-fields">
          <label>
            Начало
            <input type="time" required {...bind("start")} />
          </label>
          <label>
            Конец
            <input type="time" required {...bind("end")} />
          </label>
        </div>

        <div className="modal-row">
          <span className="modal-total">
            Итого: <b>{valid ? `${fmtNum(duration(range))} ч` : "—"}</b>
          </span>
          <button type="button" className="btn-ghost" disabled={isDefault} onClick={() => setRange(def)}>
            По умолчанию
          </button>
        </div>

        <div className="modal-row">
          <button type="button" className="btn-ghost" onClick={() => ref.current?.close()}>
            Отмена
          </button>
          <button type="submit" className="export-btn" disabled={!valid}>
            Сохранить
          </button>
        </div>
      </form>
    </dialog>
  );
}
