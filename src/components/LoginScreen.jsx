// src/components/LoginScreen.jsx
// Přihlašovací obrazovka – zobrazí se pokud uživatel není přihlášen.
// Podporuje přihlášení i registraci nového účtu.

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

export default function LoginScreen() {
  const [mode, setMode]       = useState("login"); // "login" nebo "register"
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        // Přihlášení existujícího účtu
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Registrace nového účtu
        if (password.length < 6) {
          setError("Heslo musí mít alespoň 6 znaků.");
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // Po úspěšném přihlášení/registraci Firebase automaticky
      // nastaví auth.currentUser – App.jsx to zachytí přes onAuthStateChanged
    } catch (err) {
      // Přeložíme Firebase chybové kódy do češtiny
      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Nesprávný e-mail nebo heslo.");
          break;
        case "auth/email-already-in-use":
          setError("Tento e-mail je již registrován. Zkuste se přihlásit.");
          break;
        case "auth/invalid-email":
          setError("Zadejte prosím platnou e-mailovou adresu.");
          break;
        case "auth/too-many-requests":
          setError("Příliš mnoho pokusů. Zkuste to prosím za chvíli.");
          break;
        default:
          setError("Chyba přihlášení. Zkuste to prosím znovu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Logo / název */}
        <div style={s.logo}>🥗</div>
        <h1 style={s.appName}>NutriApp</h1>
        <p style={s.appSubtitle}>Jídelníčky na míru pro nutriční terapeuty</p>

        {/* Přepínač přihlášení / registrace */}
        <div style={s.toggleRow}>
          <button
            type="button"
            style={mode === "login" ? s.toggleActive : s.toggleInactive}
            onClick={() => { setMode("login"); setError(""); }}
          >
            Přihlásit se
          </button>
          <button
            type="button"
            style={mode === "register" ? s.toggleActive : s.toggleInactive}
            onClick={() => { setMode("register"); setError(""); }}
          >
            Nový účet
          </button>
        </div>

        {/* Formulář */}
        <form onSubmit={handleSubmit} style={s.form}>
          <label style={s.label}>
            E-mail
            <input
              style={s.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vas@email.cz"
              required
            />
          </label>

          <label style={s.label}>
            Heslo
            <input
              style={s.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "register" ? "alespoň 6 znaků" : "••••••••"}
              required
            />
          </label>

          {/* Chybová zpráva */}
          {error && <p style={s.error}>{error}</p>}

          <button type="submit" style={s.submitBtn} disabled={loading}>
            {loading
              ? "Načítám…"
              : mode === "login"
              ? "Přihlásit se"
              : "Vytvořit účet"}
          </button>
        </form>

        {mode === "register" && (
          <p style={s.hint}>
            Po vytvoření účtu se automaticky přihlásíte. Každý terapeut má
            vlastní soukromou databázi klientů.
          </p>
        )}
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#f0f4f1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
    padding: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "40px 36px",
    maxWidth: 400,
    width: "100%",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    textAlign: "center",
  },
  logo:        { fontSize: 48, marginBottom: 8 },
  appName:     { margin: "0 0 4px", fontSize: 28, color: "#2d6a4f" },
  appSubtitle: { margin: "0 0 28px", fontSize: 13, color: "#888" },
  toggleRow: {
    display: "flex",
    gap: 8,
    marginBottom: 24,
    background: "#f0f4f1",
    borderRadius: 10,
    padding: 4,
  },
  toggleActive: {
    flex: 1, padding: "9px", borderRadius: 8,
    border: "none", background: "#2d6a4f",
    color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
  },
  toggleInactive: {
    flex: 1, padding: "9px", borderRadius: 8,
    border: "none", background: "transparent",
    color: "#555", fontWeight: 600, fontSize: 14, cursor: "pointer",
  },
  form: {
    display: "flex", flexDirection: "column",
    gap: 14, textAlign: "left",
  },
  label: {
    display: "flex", flexDirection: "column",
    gap: 5, fontSize: 13, fontWeight: 600, color: "#444",
  },
  input: {
    padding: "10px 12px", borderRadius: 8,
    border: "1px solid #d0d0d0", fontSize: 15,
    outline: "none", width: "100%", boxSizing: "border-box",
  },
  error: {
    margin: 0, padding: "10px 14px",
    background: "#fff0f0", border: "1px solid #f5c0c0",
    borderRadius: 8, color: "#c0392b", fontSize: 13,
  },
  submitBtn: {
    marginTop: 4, padding: "13px",
    background: "#2d6a4f", color: "#fff",
    border: "none", borderRadius: 8,
    fontSize: 15, fontWeight: 700, cursor: "pointer",
  },
  hint: {
    marginTop: 16, fontSize: 12,
    color: "#999", lineHeight: 1.5,
  },
};
