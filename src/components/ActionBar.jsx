import React from "react";

export default function ActionBar({ onDeleteChar, onDeleteWord, onDeleteAll, onUndo, onSearch }) {
  return (
    <div style={styles.container}>
      <button style={styles.btn}                          onClick={onDeleteChar}>⌫ מחק תו</button>
      <button style={styles.btn}                          onClick={onDeleteWord}>⌦ מחק מילה</button>
      <button style={{ ...styles.btn, ...styles.danger }} onClick={onDeleteAll} >🗑 מחק הכל</button>
      <div style={styles.sep} />
      <button style={styles.btn}                          onClick={onUndo}      >↩ Undo</button>
      <button style={{ ...styles.btn, ...styles.search }} onClick={onSearch}    >🔍 חיפוש / החלפה</button>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" },
  btn: {
    padding: "5px 14px", borderRadius: 7,
    border: "1px solid #e2e8f0",
    background: "#f8fafc", color: "#1e293b",
    cursor: "pointer", fontSize: 13,
    fontFamily: "inherit",
    transition: "background 0.15s",
  },
  danger: { background: "#fee2e2", borderColor: "#fca5a5", color: "#dc2626" },
  search: { background: "#eff6ff", borderColor: "#bfdbfe", color: "#2563eb" },
  sep:    { width: 1, height: 22, background: "#e2e8f0", margin: "0 2px" },
};