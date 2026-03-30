// SearchReplace.jsx – חיפוש והחלפת תו (חלק א)
import React, { useState } from "react";

export default function SearchReplace({ onFind, onReplace, onClose }) {
  const [findCh, setFindCh]       = useState("");
  const [replaceCh, setReplaceCh] = useState("");
  const [result, setResult]       = useState(null);

  function handleFind() {
    if (!findCh) return;
    setResult({ count: onFind(findCh), action: "find" });
  }

  function handleReplace() {
    if (!findCh) return;
    setResult({ count: onReplace(findCh, replaceCh), action: "replace" });
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <div style={styles.title}>🔍 חיפוש והחלפה</div>

        <div style={styles.row}>
          <label style={styles.label}>חפש תו:</label>
          <input style={styles.input} maxLength={1} value={findCh}
            onChange={e => { setFindCh(e.target.value); setResult(null); }} />
        </div>

        <div style={styles.row}>
          <label style={styles.label}>החלף ב:</label>
          <input style={styles.input} maxLength={1} value={replaceCh}
            onChange={e => { setReplaceCh(e.target.value); setResult(null); }} />
        </div>

        {result && (
          <div style={styles.result}>
            {result.action === "find"
              ? `נמצאו ${result.count} מופעים של "${findCh}"`
              : `הוחלפו ${result.count} מופעים`}
          </div>
        )}

        <div style={styles.btnRow}>
          <button style={styles.btn}                          onClick={handleFind}>חפש</button>
          <button style={{ ...styles.btn, ...styles.btnBlue }} onClick={handleReplace}>החלף הכל</button>
          <button style={{ ...styles.btn, ...styles.btnGray }} onClick={onClose}>סגור</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
  },
  box: {
    background: "#fff", borderRadius: 12, padding: 28,
    minWidth: 300, display: "flex", flexDirection: "column",
    gap: 14, direction: "rtl", boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#2c3e50" },
  row:   { display: "flex", alignItems: "center", gap: 10 },
  label: { fontSize: 14, color: "#2c3e50", minWidth: 70 },
  input: {
    border: "1px solid #bdc3c7", borderRadius: 6,
    padding: "5px 10px", fontSize: 15, width: 60, textAlign: "center",
  },
  result: {
    background: "#eaf4fb", border: "1px solid #aed6f1",
    borderRadius: 6, padding: "6px 12px", fontSize: 13, color: "#1a5276",
  },
  btnRow: { display: "flex", gap: 8, justifyContent: "flex-end" },
  btn: {
    padding: "6px 16px", borderRadius: 7,
    border: "1px solid #bdc3c7", background: "#ecf0f1",
    color: "#2c3e50", cursor: "pointer", fontSize: 13,
  },
  btnBlue: { background: "#3498db", color: "#fff", borderColor: "#2980b9" },
  btnGray: { background: "#95a5a6", color: "#fff", borderColor: "#7f8c8d" },
};
