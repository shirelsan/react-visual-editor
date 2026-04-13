import React from "react";

export default function TextDisplay({ chars }) {
  return (
    <div style={styles.container}>
      <div style={styles.body}>
        {chars.length === 0 ? (
          <span style={styles.placeholder}>הטקסט יופיע כאן...</span>
        ) : (
          chars.map((c, i) =>
            c.ch === "\n" ? (
              <br key={i} />
            ) : (
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
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
  },
  body: {
    flex: 1,
    padding: "16px 20px",
    overflowY: "auto",
    wordBreak: "break-word",
    lineHeight: 1.7,
    fontFamily: "'Heebo', Arial, sans-serif",
  },
  placeholder: {
    color: "#cbd5e1",
    fontStyle: "italic",
    fontSize: 15,
    fontFamily: "'Heebo', Arial, sans-serif",
  },
};