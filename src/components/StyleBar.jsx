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
            border: style.color === c ? "2px solid #2563eb" : "2px solid #e2e8f0",
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
    display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6,
    padding: "7px 12px",
    background: "#ffffff",
    borderRadius: 9,
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  select: {
    border: "1px solid #e2e8f0", borderRadius: 6,
    padding: "4px 6px", fontSize: 12,
    background: "#f8fafc", cursor: "pointer",
    maxWidth: 130, fontFamily: "inherit",
    color: "#1e293b",
  },
  btn: {
    minWidth: 28, height: 28,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e2e8f0",
    borderRadius: 6, background: "#f8fafc",
    cursor: "pointer", fontSize: 13,
    color: "#1e293b", fontFamily: "inherit",
  },
  btnActive: { background: "#2563eb", color: "#fff", borderColor: "#2563eb" },
  sep: { width: 1, height: 22, background: "#e2e8f0", margin: "0 2px" },
  colorsWrap: { display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" },
  colorDot: { width: 18, height: 18, borderRadius: "50%", cursor: "pointer", flexShrink: 0 },
  checkLabel: {
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 12, cursor: "pointer", userSelect: "none",
    whiteSpace: "nowrap", color: "#475569",
    fontFamily: "inherit",
  },
};