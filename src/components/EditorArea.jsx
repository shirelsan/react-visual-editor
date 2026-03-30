// EditorArea.jsx – אזור הזנה ועריכה – תחתית המסך (חלק א)
// תיקון 2: גלילה פנימית כדי לא לדחוף את אזור הטקסט
import React, { useState } from "react";
import StyleBar  from "./StyleBar";
import ActionBar from "./ActionBar";
import Keyboard  from "./Keyboard";

export default function EditorArea({
  currentStyle, applyToAll, onStyleChange, onApplyToAllChange,
  onChar, onDeleteChar, onDeleteWord, onDeleteAll, onUndo, onSearchOpen,
}) {
  const [currentLang, setCurrentLang] = useState("EN");

  return (
    <div style={styles.container}>
      <div style={styles.label}>אזור עריכה</div>
      {/* תיקון 2: גלילה פנימית – העורך לא דוחף את אזור הטקסט */}
      <div style={styles.inner}>
        <StyleBar
          style={currentStyle} onChange={onStyleChange}
          applyToAll={applyToAll} onApplyToAllChange={onApplyToAllChange}
        />
        <ActionBar
          onDeleteChar={onDeleteChar} onDeleteWord={onDeleteWord}
          onDeleteAll={onDeleteAll}   onUndo={onUndo}
          onSearch={onSearchOpen}
        />
        <Keyboard
          onChar={onChar}
          currentLang={currentLang}
          onLangChange={setCurrentLang}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#f4f6f7",
    borderTop: "2px solid #bdc3c7",
    flexShrink: 0,
    // תיקון 2: גובה מקסימלי + גלילה פנימית
    maxHeight: "52vh",
    display: "flex",
    flexDirection: "column",
    //overflow: "hidden",
  },
  label: {
    background: "#2c3e50", color: "#ecf0f1",
    padding: "6px 14px", fontSize: 13, fontWeight: "bold",
    flexShrink: 0,
  },
  inner: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    //overflowY: "auto", // תיקון 2: גלילה אם תוכן גדול
    flex: 1,
  },
};
