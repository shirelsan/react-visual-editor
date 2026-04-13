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
    background: "#f1f5f9",
    borderTop: "2px solid #e2e8f0",
    flexShrink: 0,
    maxHeight: "52vh",
    display: "flex",
    flexDirection: "column",
  },
  inner: {
    padding: "10px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flex: 1,
    overflowY: "auto",
  },
};