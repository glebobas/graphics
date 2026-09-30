import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { auth } from "../firebase";

export function AuthBar({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setOpen(false);
      setPassword("");
      setError("");
    } catch {
      setError("Неверная почта или пароль");
    }
  };

  if (user) {
    return (
      <button className="export-btn" style={{ marginTop: 32 }} onClick={() => signOut(auth)}>
        Выйти
      </button>
    );
  }

  return (
    <div style={{ marginTop: 32 }}>
      {!open ? (
        <button className="export-btn" onClick={() => setOpen(true)}>
          Войти для редактирования
        </button>
      ) : (
        <form onSubmit={submit} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input type="email" placeholder="Почта" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="export-btn" type="submit">Войти</button>
          {error && <span style={{ color: "var(--warn-text)" }}>{error}</span>}
        </form>
      )}
    </div>
  );
}