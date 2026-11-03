import { deleteField, doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";
import type { HoursMap, ScheduleMap, TimeRange } from "../types";
import { nextShift } from "../utils/schedule";

/** График из schedules/{docId}; запись — только при canEdit */
export function useSchedule(docId: string, canEdit: boolean) {
  const ref = useMemo(() => doc(db, "schedules", docId), [docId]);
  const [schedule, setSchedule] = useState<ScheduleMap>({});
  const [hours, setHoursMap] = useState<HoursMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onSnapshot(
        ref,
        (snap) => {
          setSchedule(snap.data()?.schedule ?? {});
          setHoursMap(snap.data()?.hours ?? {});
          setLoading(false);
        },
        (err) => {
          console.error("Firestore:", err);
          setLoading(false);
        },
      ),
    [ref],
  );

  // merge: true обновляет только переданные ячейки, а не весь документ
  const save = (data: object) => {
    if (!canEdit) return;
    setDoc(ref, data, { merge: true }).catch((err) => {
      console.error("Ошибка записи:", err);
      alert("Не удалось сохранить: " + err.code);
    });
  };

  /** Смена переключается — ручные часы сбрасываются к значениям по умолчанию */
  const toggle = (key: string) =>
    save({ schedule: { [key]: nextShift(schedule[key] ?? "off") }, hours: { [key]: deleteField() } });

  /** null — вернуть часы по умолчанию */
  const setHours = (key: string, range: TimeRange | null) => save({ hours: { [key]: range ?? deleteField() } });

  return { schedule, hours, loading, toggle, setHours };
}
