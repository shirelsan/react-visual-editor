// FileManager.jsx – שמירה ופתיחת קבצים (חלק ב)
import React, { useState } from "react";

export default function FileManager({ files, onSave, onRename, onOpen, onDelete, onClose }) {
  const [newName, setNewName] = useState("");
  const [msg, setMsg]         = useState("");
  const [renamingFiles, setRenamingFiles] = useState({}); 

  function handleRename(oldName) {
    const nextName = renamingFiles[oldName]?.trim();
    if (!nextName || nextName === oldName) return;
    
    onRename(oldName, nextName);
    // ניקוי השדה לאחר השינוי
    setRenamingFiles(prev => {
      const updated = { ...prev };
      delete updated[oldName];
      return updated;
    });
  }

  function handleSave() {
    if (!newName.trim()) { setMsg("נא להזין שם קובץ"); return; }
    if (newName.trim() === "new") { setMsg('שם "new" שמור למערכת, בחר שם אחר'); return; }
    
    if (files.includes(newName.trim())) {
        if (!window.confirm(`הקובץ "${newName.trim()}" כבר קיים. להחליף אותו?`)) return;
    }
    
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
          {files.map(name => ( // המשתנה כאן הוא name
          <div key={name} style={styles.fileRow}>
            <span style={styles.fileName}>{name}</span>
                  
            <button style={styles.btnOpen} onClick={() => { onOpen(name); onClose(); }}>פתח</button>
                  
            <input 
              style={styles.renameInput}
              placeholder="שם חדש..."
              // כאן היה f, צריך להיות name:
              value={renamingFiles[name] || ""} 
              onChange={(e) => setRenamingFiles({ ...renamingFiles, [name]: e.target.value })}
            />
            
            {/* גם כאן להחליף ל-name: */}
            <button style={styles.btnRename} onClick={() => handleRename(name)}>שנה שם</button>
                  
            <button style={styles.btnDelete} onClick={() => onDelete(name)}>🗑</button>
          </div>
        ))}
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

  renameInput: {
    width: 80,
    fontSize: 12,
    padding: "2px 5px",
    border: "1px solid #ccc",
    borderRadius: 4
  },
  btnRename: {
    padding: "4px 8px",
    fontSize: 11,
    background: "#f39c12", // צבע כתום לשינוי שם
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer"
  },
};
