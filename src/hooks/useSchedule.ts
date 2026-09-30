import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import type { ScheduleMap } from "../types";
import { nextShift } from "../utils/schedule";

const ref = doc(db, "schedules", "main");

export function useSchedule() {
  const [schedule, setSchedule] = useState<ScheduleMap>({});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(
    () =>
      onSnapshot(
        ref,
        (snap) => {
          setSchedule((snap.data()?.schedule as ScheduleMap) ?? {});
          setLoading(false);
        },
        onSnapshot(
          ref,
          (snap) => {
            setSchedule((snap.data()?.schedule as ScheduleMap) ?? {});
            setLoading(false);
          },
          (err) => {
            console.error("Firestore:", err);
            setLoading(false);
          },
        ),
      ),
    [],
  );

  const readOnly = !user;

  const toggle = useCallback(
    (key: string) => {
      if (readOnly) return;
      // merge: true обновляет только одну ячейку, а не весь документ
      setDoc(ref, { schedule: { [key]: nextShift(schedule[key] ?? "off") } }, { merge: true }).catch((err) => {
        console.error("Ошибка записи:", err);
        alert("Не удалось сохранить: " + err.code);
      });
    },
    [readOnly, schedule],
  );

  return { schedule, readOnly, loading, toggle, user };
}
