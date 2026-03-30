// FileManager.jsx – שמירה ופתיחת קבצים (חלק ב)
import React, { useState } from "react";

export default function FileManager({ files, onSave, onOpen, onDelete, onClose }) {
  const [newName, setNewName] = useState("");
  const [msg, setMsg]         = useState("");

  function handleSave() {
    if (!newName.trim()) { setMsg("נא להזין שם קובץ"); return; }
    onSave(newName.trim());
    setMsg(`נשמר: "${newName.trim()}"`);
    setNewName("");
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <div style={styles.title}>📁 ניהול קבצים</div>

        {/* שמירה בשם */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>שמור קובץ נוכחי בשם:</div>
          <div style={styles.row}>
            <input style={styles.input} value={newName} placeholder="שם הקובץ"
              onChange={e => { setNewName(e.target.value); setMsg(""); }} />
            <button style={styles.btnSave} onClick={handleSave}>שמור</button>
          </div>
          {msg && <div style={styles.msg}>{msg}</div>}
        </div>

        {/* קבצים קיימים */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>קבצים שמורים:</div>
          {files.length === 0
            ? <div style={styles.empty}>אין קבצים שמורים עדיין</div>
            : files.map(name => (
              <div key={name} style={styles.fileRow}>
                <span style={styles.fileName}>{name}</span>
                <button style={styles.btnOpen}   onClick={() => { onOpen(name); onClose(); }}>פתח</button>
                <button style={styles.btnDelete} onClick={() => onDelete(name)}>🗑</button>
              </div>
            ))
          }
        </div>

        <button style={styles.btnClose} onClick={onClose}>סגור</button>
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
    minWidth: 340, maxHeight: "80vh", overflowY: "auto",
    display: "flex", flexDirection: "column", gap: 16,
    direction: "rtl", boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#2c3e50" },
  section: { display: "flex", flexDirection: "column", gap: 8 },
  sectionTitle: { fontWeight: "bold", fontSize: 14, color: "#2c3e50" },
  row: { display: "flex", gap: 8 },
  input: {
    flex: 1, border: "1px solid #bdc3c7", borderRadius: 6,
    padding: "6px 10px", fontSize: 14,
  },
  msg:   { fontSize: 13, color: "#27ae60" },
  empty: { fontSize: 13, color: "#bdc3c7", fontStyle: "italic" },
  fileRow: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "6px 0", borderBottom: "1px solid #ecf0f1",
  },
  fileName: { flex: 1, fontSize: 14, color: "#2c3e50" },
  btnSave:   { padding: "6px 14px", background: "#2c3e50", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  btnOpen:   { padding: "4px 10px", background: "#3498db", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 13 },
  btnDelete: { padding: "4px 8px",  background: "#e74c3c", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 13 },
  btnClose:  { alignSelf: "flex-end", padding: "6px 18px", background: "#95a5a6", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
};
