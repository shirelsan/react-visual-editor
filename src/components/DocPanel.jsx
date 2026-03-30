// DocPanel.jsx – אזור תצוגה של טקסט אחד (חלק ג)
// תיקון 3: רוחב גמיש לרספונסיביות
import React from "react";

export default function DocPanel({ doc, isFocused, onFocus, onClose, onSave }) {
  return (
    <div
      style={{ ...styles.panel, ...(isFocused ? styles.focused : {}) }}
      onClick={onFocus}
    >
      {/* כותרת */}
      <div style={styles.header}>
        <span style={styles.docName}>
          {doc.name || "ללא שם"}{doc.dirty ? " *" : ""}
        </span>
        <div style={styles.headerBtns}>
          <button style={styles.saveBtn}
            onClick={e => { e.stopPropagation(); onSave(doc.name); }}
            title="שמור">💾</button>
          <button style={styles.closeBtn}
            onClick={e => { e.stopPropagation(); onClose(); }}
            title="סגור">✕</button>
        </div>
      </div>

      {/* תוכן */}
      <div style={styles.body}>
        {doc.chars.length === 0 ? (
          <span style={styles.placeholder}>{"פה עדיין אין טקסט\n(או אולי בצע יש...)"}</span>
        ) : (
          doc.chars.map((c, i) =>
            c.ch === "\n" ? <br key={i} /> : (
              <span key={i} style={{
                fontFamily:     c.style.font,
                fontSize:       c.style.size + "px",
                color:          c.style.color,
                fontWeight:     c.style.bold      ? "bold"      : "normal",
                fontStyle:      c.style.italic    ? "italic"    : "normal",
                textDecoration: c.style.underline ? "underline" : "none",
                whiteSpace: "pre-wrap",
              }}>{c.ch}</span>
            )
          )
        )}
      </div>
    </div>
  );
}

const styles = {
  panel: {
    // תיקון 3: flex-basis גמיש במקום רוחב קבוע
    flex: "1 1 220px",
    minWidth: 180,
    maxWidth: 300,
    minHeight: 100,
    background: "#fff",
    border: "2px solid #bdc3c7",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    transition: "border-color 0.2s",
    overflow: "hidden",
  },
  focused: {
    borderColor: "#2eadd0",
    boxShadow: "0 0 0 3px rgba(44,62,80,0.2)",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "5px 10px", background: "#ecf0f1",
    borderBottom: "1px solid #bdc3c7", flexShrink: 0,
  },
  docName: { fontSize: 15, fontWeight: "bold", color: "#2c3e50", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  headerBtns: { display: "flex", gap: 4, flexShrink: 0 },
  saveBtn:  { background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#27ae60", padding: "0 2px" },
  closeBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#95a5a6", padding: "0 2px" },
  body: {
    flex: 1, padding: 10,
    overflowY: "auto", wordBreak: "break-word",
    lineHeight: 1.6, fontSize: 14,
  },
  placeholder: { color: "#bdc3c7", fontStyle: "italic", fontSize: 13, whiteSpace: "pre-wrap" },
};
