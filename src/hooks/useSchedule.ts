import { onAuthStateChanged, type User } from "firebase/auth";
import { deleteField, doc, onSnapshot, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import type { HoursMap, ScheduleMap, TimeRange } from "../types";
import { nextShift } from "../utils/schedule";

const ref = doc(db, "schedules", "main");

// merge: true обновляет только переданные ячейки, а не весь документ
const save = (data: object) =>
  setDoc(ref, data, { merge: true }).catch((err) => {
    console.error("Ошибка записи:", err);
    alert("Не удалось сохранить: " + err.code);
  });

export function useSchedule() {
  const [schedule, setSchedule] = useState<ScheduleMap>({});
  const [hours, setHoursMap] = useState<HoursMap>({});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

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
    [],
  );

  const readOnly = !user;

  /** Смена переключается — ручные часы сбрасываются к значениям по умолчанию */
  const toggle = useCallback(
    (key: string) => {
      if (readOnly) return;
      save({ schedule: { [key]: nextShift(schedule[key] ?? "off") }, hours: { [key]: deleteField() } });
    },
    [readOnly, schedule],
  );

  /** null — вернуть часы по умолчанию */
  const setHours = useCallback(
    (key: string, range: TimeRange | null) => {
      if (readOnly) return;
      save({ hours: { [key]: range ?? deleteField() } });
    },
    [readOnly],
  );

  return { schedule, hours, readOnly, loading, toggle, setHours, user };
}
