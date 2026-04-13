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
    padding: "6px 12px",
    background: "#e2e8f0",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 0,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderLeftStyle: "solid",
    borderTopColor: "#e2e8f0",
    borderRightColor: "#e2e8f0",
    borderLeftColor: "#e2e8f0",
    borderRadius: "8px 8px 0 0",
    cursor: "pointer",
    maxWidth: 180,
    minWidth: 100,
    transition: "background 0.15s",
    flexShrink: 0,
    fontFamily: "'Heebo', Arial, sans-serif",
  },
  tabFocused: {
      background: "#ffffff",
      borderTopColor: "#e2e8f0",
      borderRightColor: "#e2e8f0",
      borderLeftColor: "#e2e8f0",
      borderBottomWidth: 0,
      boxShadow: "0 -2px 6px rgba(37,99,235,0.08)",
      zIndex: 1,
      position: "relative",
  },
  docName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
  },
  actions: { display: "flex", gap: 2, flexShrink: 0 },
  saveBtn: {
    background: "none", border: "none",
    cursor: "pointer", fontSize: 12,
    color: "#16a34a", padding: "1px 3px",
    lineHeight: 1,
  },
  closeBtn: {
    background: "none", border: "none",
    cursor: "pointer", fontSize: 11,
    color: "#94a3b8", padding: "1px 3px",
    lineHeight: 1,
  },
};