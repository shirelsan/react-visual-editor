// Keyboard.jsx – מקלדת ויזואלית עם מעבר שפות (חלק א)
// תיקון 3: מקשים מתכווצים במסכים קטנים
import React, { useState } from "react";
import { KEYBOARDS, LANG_ORDER, DIGITS_ROW, SYMBOLS_ROW } from "../data/keyboards";

export default function Keyboard({ onChar, currentLang, onLangChange }) {
  const [shift, setShift] = useState(false);

  const kb   = KEYBOARDS[currentLang];
  const rows = (shift && kb.shiftRows) ? kb.shiftRows : kb.rows;

  function handleKey(ch) {
    onChar(ch);
    if (shift && kb.shiftRows) setShift(false);
  }

  return (
    <div style={styles.container}>

      {/* בחירת שפה */}
      <div style={styles.langRow}>
        {LANG_ORDER.map(lang => (
          <button key={lang}
            style={{ ...styles.langBtn, ...(currentLang === lang ? styles.langActive : {}) }}
            onClick={() => { onLangChange(lang); setShift(false); }}>
            {KEYBOARDS[lang].label}
          </button>
        ))}
        {kb.shiftRows && (
          <button
            style={{ ...styles.langBtn, ...(shift ? styles.langActive : {}), marginRight: "auto" }}
            onClick={() => setShift(s => !s)}>
            ⇧ Shift
          </button>
        )}
      </div>

      {/* ספרות */}
      <div style={styles.row}>
        {DIGITS_ROW.map(ch => (
          <button key={ch} style={styles.key} onClick={() => handleKey(ch)}>{ch}</button>
        ))}
      </div>

      {/* סימנים מיוחדים */}
      <div style={styles.row}>
        {SYMBOLS_ROW.map((ch, i) => (
          <button key={i} style={styles.key} onClick={() => handleKey(ch)}>{ch}</button>
        ))}
      </div>

      {/* אותיות */}
      {rows.map((row, ri) => (
        <div key={ri} style={styles.row}>
          {row.map((ch, ci) => (
            <button key={ci} style={styles.key} onClick={() => handleKey(ch)}>{ch}</button>
          ))}
        </div>
      ))}

      {/* רווח + Enter */}
      <div style={styles.row}>
        <button style={{ ...styles.key, flex: 3, Width: 90 }} onClick={() => handleKey(" ")}>רווח</button>
        <button style={{ ...styles.key, flex: 2, Width: 80 }} onClick={() => handleKey("\n")}>↵ Enter</button>
      </div>

    </div>
  );
}

const styles = {
  container: {
    display: "flex", flexDirection: "column", gap: 4,
    background: "#dfe6e9", borderRadius: 10,
    padding: 8, border: "1px solid #b2bec3",
  },
  langRow: { display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 2 },
  langBtn: {
    padding: "3px 10px", borderRadius: 6,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#b2bec3",
    background: "#fff",
    cursor: "pointer", fontSize: 12, fontWeight: "bold", color: "#2c3e50",
    whiteSpace: "nowrap",
  },
  langActive: { background: "#2c3e50", color: "#fff", borderColor: "#2c3e50" },
  row: { display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center" },
  key: {
    flex: 1,
    minWidth: 24,   // תיקון 3: קטן יותר במסכים צרים
    maxWidth: 46,
    height: 38,     // תיקון 3: גובה קטן יותר
    background: "#fff", border: "1px solid #b2bec3", borderRadius: 6,
    cursor: "pointer", fontSize: 13, color: "#2c3e50",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 0 #b2bec3", userSelect: "none",
  },
};
