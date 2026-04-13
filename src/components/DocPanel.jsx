// DocPanel.jsx – טאב של מסמך (חלק ג)
import React from "react";

export default function DocPanel({ doc, isFocused, onFocus, onClose, onSave }) {
  return (
    <div
      style={{ ...styles.tab, ...(isFocused ? styles.tabFocused : {}) }}
      onClick={onFocus}
      title={doc.name}
    >
      <span style={styles.docName}>
        {doc.name || "ללא שם"}{doc.dirty ? " ●" : ""}
      </span>
      <div style={styles.actions}>
        <button
          style={styles.saveBtn}
          onClick={e => { e.stopPropagation(); onSave(doc.name); }}
          title="שמור"
        >💾</button>
        <button
          style={styles.closeBtn}
          onClick={e => { e.stopPropagation(); onClose(); }}
          title="סגור"
        >✕</button>
      </div>
    </div>
  );
}

const styles = {
  tab: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    background: "#dce1e7",
    border: "1px solid #bdc3c7",
    borderBottom: "none",
    borderRadius: "8px 8px 0 0",
    cursor: "pointer",
    maxWidth: 180,
    minWidth: 100,
    transition: "background 0.15s",
    flexShrink: 0,
  },
  tabFocused: {
    background: "#fff",
    borderColor: "#2eadd0",
    borderBottomColor: "#fff",
    zIndex: 1,
    position: "relative",
  },
  docName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#2c3e50",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
  },
  actions: { display: "flex", gap: 2, flexShrink: 0 },
  saveBtn: {
    background: "none", border: "none",
    cursor: "pointer", fontSize: 12,
    color: "#27ae60", padding: "1px 3px",
    lineHeight: 1,
  },
  closeBtn: {
    background: "none", border: "none",
    cursor: "pointer", fontSize: 11,
    color: "#95a5a6", padding: "1px 3px",
    lineHeight: 1,
  },
};