// StyleBar.jsx – בחירת גופן / גודל / צבע / עיצוב (חלק א)
// תיקון 3: flexWrap לרספונסיביות
import React from "react";
import { FONTS, SIZES, COLORS } from "../data/styleOptions";

export default function StyleBar({ style, onChange, applyToAll, onApplyToAllChange }) {
  return (
    <div style={styles.container}>
      <select style={styles.select} value={style.font}
        onChange={e => onChange({ font: e.target.value })}>
        {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
      </select>

      <select style={styles.select} value={style.size}
        onChange={e => onChange({ size: Number(e.target.value) })}>
        {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <button style={{ ...styles.btn, ...(style.bold ? styles.btnActive : {}), fontWeight: "bold" }}
        onClick={() => onChange({ bold: !style.bold })}>B</button>
      <button style={{ ...styles.btn, ...(style.italic ? styles.btnActive : {}), fontStyle: "italic" }}
        onClick={() => onChange({ italic: !style.italic })}>I</button>
      <button style={{ ...styles.btn, ...(style.underline ? styles.btnActive : {}), textDecoration: "underline" }}
        onClick={() => onChange({ underline: !style.underline })}>U</button>

      <div style={styles.sep} />

      <div style={styles.colorsWrap}>
        {COLORS.map(c => (
          <div key={c} onClick={() => onChange({ color: c })} style={{
            ...styles.colorDot,
            background: c,
            border: style.color === c ? "2px solid #e74c3c" : "2px solid #bdc3c7",
          }} />
        ))}
      </div>

      <div style={styles.sep} />

      <label style={styles.checkLabel}>
        <input type="checkbox" checked={applyToAll}
          onChange={e => onApplyToAllChange(e.target.checked)} />
        <span>החל על כל הטקסט</span>
      </label>
    </div>
  );
}

const styles = {
  container: {
    display: "flex", flexWrap: "wrap", alignItems: "center", gap: 5,
    padding: "6px 10px", background: "#ecf0f1",
    borderRadius: 8, border: "1px solid #bdc3c7",
  },
  select: {
    border: "1px solid #bdc3c7", borderRadius: 5,
    padding: "3px 4px", fontSize: 12, background: "#fff", cursor: "pointer",
    maxWidth: 130,
  },
  btn: {
    minWidth: 28, height: 28, border: "1px solid #bdc3c7",
    borderRadius: 5, background: "#fff", cursor: "pointer", fontSize: 13,
  },
  btnActive: { background: "#2c3e50", color: "#fff", borderColor: "#2c3e50" },
  sep: { width: 1, height: 22, background: "#bdc3c7", margin: "0 2px" },
  colorsWrap: { display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" },
  colorDot: { width: 18, height: 18, borderRadius: "50%", cursor: "pointer", flexShrink: 0 },
  checkLabel: {
    display: "flex", alignItems: "center", gap: 4,
    fontSize: 12, cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
  },
};
