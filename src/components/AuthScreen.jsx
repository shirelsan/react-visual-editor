// AuthScreen.jsx – מסך כניסה והרשמה (חלק ד)
import React, { useState } from "react";

export default function AuthScreen({ onLogin, onRegister }) {
  const [mode, setMode]         = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  function handleSubmit() {
    setError("");
    const err = mode === "login"
      ? onLogin(username, password)
      : onRegister(username, password);
    if (err) setError(err);
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <div style={styles.title}>✏️ עורך טקסטים ויזואלי</div>

        {/* טאבים */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(mode === "login" ? styles.tabActive : {}) }}
            onClick={() => { setMode("login"); setError(""); }}
          >כניסה</button>
          <button
            style={{ ...styles.tab, ...(mode === "register" ? styles.tabActive : {}) }}
            onClick={() => { setMode("register"); setError(""); }}
          >הרשמה</button>
        </div>

        <input
          style={styles.input}
          placeholder="שם משתמש"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
        />

        {error && <div style={styles.error}>{error}</div>}

        <button style={styles.btn} onClick={handleSubmit}>
          {mode === "login" ? "כנס" : "הירשם"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "#f0f3f4",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  box: {
    background: "#fff",
    border: "1px solid #bdc3c7",
    borderRadius: 12,
    padding: 36,
    width: 320,
    display: "flex", flexDirection: "column", gap: 12,
    direction: "rtl",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: 20, fontWeight: "bold",
    color: "#2c3e50", textAlign: "center", marginBottom: 4,
  },
  tabs: { display: "flex", gap: 8 },
  tab: {
    flex: 1, padding: "7px",
    background: "#ecf0f1", color: "#7f8c8d",
    border: "1px solid #bdc3c7", borderRadius: 6,
    cursor: "pointer", fontSize: 14,
  },
  tabActive: {
    background: "#2c3e50", color: "#fff", borderColor: "#2c3e50",
  },
  input: {
    border: "1px solid #bdc3c7", borderRadius: 6,
    padding: "8px 12px", fontSize: 14, color: "#2c3e50",
  },
  error: {
    color: "#e74c3c", fontSize: 13, textAlign: "center",
  },
  btn: {
    padding: 10, background: "#2c3e50", color: "#fff",
    border: "none", borderRadius: 8,
    cursor: "pointer", fontSize: 15, fontWeight: "bold",
  },
};
