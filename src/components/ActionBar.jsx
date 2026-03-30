// ActionBar.jsx – כפתורי פעולה: מחיקה / Undo / חיפוש (חלק א)
import React from "react";

export default function ActionBar({ onDeleteChar, onDeleteWord, onDeleteAll, onUndo, onSearch }) {
  return (
    <div style={styles.container}>
      <button style={styles.btn}                        onClick={onDeleteChar}>⌫ מחק תו</button>
      <button style={styles.btn}                        onClick={onDeleteWord}>⌦ מחק מילה</button>
      <button style={{ ...styles.btn, ...styles.danger }} onClick={onDeleteAll} >🗑 מחק הכל</button>
      <div style={styles.sep} />
      <button style={styles.btn}                        onClick={onUndo}      >↩ Undo</button>
      <button style={{ ...styles.btn, ...styles.search }} onClick={onSearch}    >🔍 חיפוש / החלפה</button>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" },
  btn: {
    padding: "5px 14px", borderRadius: 7,
    border: "1px solid #bdc3c7", background: "#ecf0f1",
    color: "#2c3e50", cursor: "pointer", fontSize: 13,
  },
  danger: { background: "#fadbd8", borderColor: "#e74c3c", color: "#c0392b" },
  search: { background: "#d6eaf8", borderColor: "#3498db", color: "#1a5276" },
  sep:    { width: 1, height: 22, background: "#bdc3c7", margin: "0 2px" },
};
