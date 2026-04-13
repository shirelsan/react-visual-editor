import React, { useState, useEffect } from "react";

export default function AuthScreen({ onLogin, onRegister }) {
  const [mode, setMode]         = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  // Load Heebo font from Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&display=swap";
    link.rel  = "stylesheet";
    document.head.appendChild(link);
  }, []);

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

        <div style={styles.logo}>✏️</div>
        <div style={styles.title}>עורך טקסטים ויזואלי</div>
        <div style={styles.subtitle}>ברוך הבא</div>

        {/* tabs */}
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
    background: "#f7f8fa",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Heebo', Arial, sans-serif",
    direction: "rtl",
  },
  box: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: "36px 40px",
    width: 340,
    display: "flex", flexDirection: "column", gap: 12,
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
  },
  logo: {
    fontSize: 36, textAlign: "center", marginBottom: 2,
  },
  title: {
    fontSize: 20, fontWeight: "700",
    color: "#1e293b", textAlign: "center",
  },
  subtitle: {
    fontSize: 13, color: "#94a3b8",
    textAlign: "center", marginTop: -6, marginBottom: 4,
  },
  tabs: {
    display: "flex", gap: 6,
    background: "#f1f5f9", borderRadius: 8, padding: 4,
  },
  tab: {
    flex: 1, padding: "7px",
    background: "transparent", color: "#64748b",
    border: "none", borderRadius: 6,
    cursor: "pointer", fontSize: 14,
    fontFamily: "inherit", fontWeight: "500",
    transition: "background 0.15s",
  },
  tabActive: {
    background: "#ffffff", color: "#2563eb",
    fontWeight: "700",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  input: {
    border: "1px solid #e2e8f0", borderRadius: 8,
    padding: "9px 14px", fontSize: 14,
    color: "#1e293b", fontFamily: "inherit",
    outline: "none",
    background: "#f8fafc",
  },
  error: {
    color: "#dc2626", fontSize: 13,
    textAlign: "center", background: "#fee2e2",
    borderRadius: 6, padding: "6px 12px",
  },
  btn: {
    padding: 11, background: "#2563eb", color: "#fff",
    border: "none", borderRadius: 9,
    cursor: "pointer", fontSize: 15, fontWeight: "700",
    fontFamily: "inherit",
    transition: "background 0.15s",
  },
};