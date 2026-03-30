// TextDisplay.jsx – אזור תצוגת טקסט ערוך (חלק א)
import React from "react";

export default function TextDisplay({ chars }) {
  return (
    <div style={styles.container}>
      <div style={styles.label}>תצוגת הטקסט</div>
      <div style={styles.body}>
        {chars.length === 0 ? (
          <span style={styles.placeholder}>הטקסט יופיע כאן...</span>
        ) : (
          chars.map((c, i) =>
            c.ch === "\n" ? (
              <br key={i} />
            ) : (
              <span key={i} style={{
                fontFamily:      c.style.font,
                fontSize:        c.style.size + "px",
                color:           c.style.color,
                fontWeight:      c.style.bold      ? "bold"      : "normal",
                fontStyle:       c.style.italic    ? "italic"    : "normal",
                textDecoration:  c.style.underline ? "underline" : "none",
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
  container: {
    flex: 1, display: "flex", flexDirection: "column",
    background: "#fff", border: "2px solid #bdc3c7",
    borderRadius: 10, overflow: "hidden",
  },
  label: {
    background: "#2c3e50", color: "#ecf0f1",
    padding: "6px 14px", fontSize: 13, fontWeight: "bold",
  },
  body: {
    flex: 1, padding: 16, overflowY: "auto",
    wordBreak: "break-word", lineHeight: 1.6,
  },
  placeholder: { color: "#bdc3c7", fontStyle: "italic", fontSize: 15 },
};
