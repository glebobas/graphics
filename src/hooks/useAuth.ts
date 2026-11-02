import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { TEAM_KEYS, type Team } from "../constants";
import { auth, db } from "../firebase";

/** Пользователь и его роль из users/{uid}.role ("bar" | "admin") */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Team | null>(null);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    setRole(null);
    if (!user) return;
    return onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        const r = snap.data()?.role;
        setRole(TEAM_KEYS.includes(r) ? r : null);
      },
      (err) => console.error("Роль:", err),
    );
  }, [user]);

  return { user, role };
}
