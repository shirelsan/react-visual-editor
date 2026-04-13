import React, { useState, useRef } from "react";
import AuthScreen    from "./components/AuthScreen";
import DocPanel      from "./components/DocPanel";
import EditorArea    from "./components/EditorArea";
import FileManager   from "./components/FileManager";
import SearchReplace from "./components/SearchReplace";
import { useAuth }   from "./hooks/useAuth";
import { useFiles }  from "./hooks/useFiles";
import { DEFAULT_STYLE } from "./data/styleOptions";


let nextId = 1;
function makeId()    { return nextId++; }
function newDoc(name) { return { id: makeId(), name, chars: [], dirty: false }; }
function makeChar(ch, style) { return { ch, style: { ...style } }; }
const MAX_UNDO = 50;

// ── App ─────────────────────────────────────────
export default function App() {

  // חלק ד – אימות
  const { currentUser, login, register, logout: authLogout } = useAuth();

  // חלק ב+ד – קבצים
  const { listFiles, saveFile, openFile, deleteFile } = useFiles(currentUser || "");

  // חלק ג – מסמכים פתוחים
  const [docs,      setDocs]      = useState(() => [newDoc("טקסט 1")]);
  const [focusedId, setFocusedId] = useState(() => docs[0].id);

  // חלק א – מצב עורך
  const [currentStyle, setCurrentStyle] = useState({ ...DEFAULT_STYLE });
  const [applyToAll,   setApplyToAll]   = useState(false);

  // Undo per doc
  const historyRef = useRef({});

  // מודאלים
  const [showFiles,  setShowFiles]  = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // ── המסמך הממוקד ──
  const focusedDoc = docs.find(d => d.id === focusedId) || docs[0];

  // ── עדכון המסמך הממוקד ──
  function updateFocused(updater) {
    setDocs(prev => prev.map(d =>
      d.id === focusedId ? { ...d, ...updater(d), dirty: true } : d
    ));
  }

  function pushHistory(docId, chars) {
    if (!historyRef.current[docId]) historyRef.current[docId] = [];
    const stack = historyRef.current[docId];
    stack.push(chars.map(c => ({ ...c, style: { ...c.style } })));
    if (stack.length > MAX_UNDO) stack.shift();
  }

  // ── תיקון 1: יציאה מאפסת את כל המסמכים ──
  function handleLogout() {
    const fresh = newDoc("טקסט 1");
    setDocs([fresh]);
    setFocusedId(fresh.id);
    setCurrentStyle({ ...DEFAULT_STYLE });
    setApplyToAll(false);
    historyRef.current = {};
    setShowFiles(false);
    setShowSearch(false);
    authLogout();
  }

  // ── חלק א: פעולות עריכה ──

  function handleChar(ch) {
    pushHistory(focusedDoc.id, focusedDoc.chars);
    if (applyToAll) {
      updateFocused(d => ({
        chars: [...d.chars.map(c => makeChar(c.ch, currentStyle)), makeChar(ch, currentStyle)],
      }));
    } else {
      updateFocused(d => ({ chars: [...d.chars, makeChar(ch, currentStyle)] }));
    }
  }

  function handleDeleteChar() {
    if (!focusedDoc.chars.length) return;
    pushHistory(focusedDoc.id, focusedDoc.chars);
    updateFocused(d => ({ chars: d.chars.slice(0, -1) }));
  }

  function handleDeleteWord() {
    if (!focusedDoc.chars.length) return;
    pushHistory(focusedDoc.id, focusedDoc.chars);
    updateFocused(d => {
      let arr = [...d.chars];
      while (arr.length && arr[arr.length - 1].ch === " ") arr.pop();
      while (arr.length && arr[arr.length - 1].ch !== " ") arr.pop();
      return { chars: arr };
    });
  }

  function handleDeleteAll() {
    if (!focusedDoc.chars.length) return;
    pushHistory(focusedDoc.id, focusedDoc.chars);
    updateFocused(() => ({ chars: [] }));
  }

  function handleUndo() {
    const stack = historyRef.current[focusedDoc.id];
    if (!stack || !stack.length) return;
    const prev = stack.pop();
    setDocs(d => d.map(doc => doc.id === focusedId ? { ...doc, chars: prev, dirty: true } : doc));
  }

  function handleStyleChange(partial) {
    const newStyle = { ...currentStyle, ...partial };
    setCurrentStyle(newStyle);
    if (applyToAll) {
      pushHistory(focusedDoc.id, focusedDoc.chars);
      updateFocused(d => ({ chars: d.chars.map(c => makeChar(c.ch, newStyle)) }));
    }
  }

  function handleFind(ch) {
    return focusedDoc.chars.filter(c => c.ch === ch).length;
  }

  function handleReplace(findCh, replaceCh) {
    const count = focusedDoc.chars.filter(c => c.ch === findCh).length;
    if (!count) return 0;
    pushHistory(focusedDoc.id, focusedDoc.chars);
    updateFocused(d => ({
      chars: d.chars.map(c => c.ch === findCh ? makeChar(replaceCh, c.style) : c),
    }));
    return count;
  }

  // ── חלק ב: שמירה / פתיחה ──

  function handleSave(filename, docId) {
    const targetId  = docId || focusedId;
    const targetDoc = docs.find(d => d.id === targetId);
    if (!targetDoc) return;
    saveFile(filename, targetDoc.chars);
    setDocs(prev => prev.map(d =>
      d.id === targetId ? { ...d, name: filename, dirty: false } : d
    ));
  }

  function handleOpen(filename) {
    const chars = openFile(filename);
    if (!chars) return;
    setDocs(prev => prev.map(d =>
      d.id === focusedId ? { ...d, name: filename, chars, dirty: false } : d
    ));
    historyRef.current[focusedId] = [];
  }

  function handleDeleteFile(filename) {
    deleteFile(filename);
    setShowFiles(false);
    setTimeout(() => setShowFiles(true), 0);
  }

  // ── חלק ג: ניהול מסמכים ──

  function handleNew() {
    const doc = newDoc(`טקסט ${docs.length + 1}`);
    setDocs(prev => [...prev, doc]);
    setFocusedId(doc.id);
  }

  function handleClose(id) {
    const doc = docs.find(d => d.id === id);
    if (doc && doc.dirty) {
      if (!window.confirm(`"${doc.name}" לא נשמר. לסגור בכל זאת?`)) return;
    }
    setDocs(prev => {
      const next = prev.filter(d => d.id !== id);
      if (next.length === 0) {
        const fresh = newDoc("טקסט 1");
        setFocusedId(fresh.id);
        return [fresh];
      }
      if (focusedId === id) setFocusedId(next[0].id);
      return next;
    });
    delete historyRef.current[id];
  }

  // ── לפני login ──
  if (!currentUser) {
    return <AuthScreen onLogin={login} onRegister={register} />;
  }

  return (
    <div style={styles.app}>

      {/* ── כותרת + פעולות גלובליות ── */}
      <div style={styles.topBar}>
        <span style={styles.appTitle}>✏️ עורך טקסטים ויזואלי</span>
        <div style={styles.topActions}>
          <button style={styles.topBtn} onClick={handleNew}>+ טקסט חדש</button>
          <button style={styles.topBtn} onClick={() => setShowFiles(true)}>📁 קבצים</button>
          <span style={styles.userLabel}>👤 {currentUser}</span>
          <button style={{ ...styles.topBtn, ...styles.topBtnRed }} onClick={handleLogout}>יציאה</button>
        </div>
      </div>

      {/* ── חלק ג: אזורי תצוגה מרובים ── */}
      <div style={styles.docsArea}>
        {docs.map(doc => (
          <DocPanel
            key={doc.id}
            doc={doc}
            isFocused={doc.id === focusedId}
            onFocus={() => setFocusedId(doc.id)}
            onClose={() => handleClose(doc.id)}
            onSave={(filename) => handleSave(filename, doc.id)}
          />
        ))}
      </div>

      {/* ── חלק א: אזור עריכה ── */}
      <EditorArea
        currentStyle={currentStyle}
        applyToAll={applyToAll}
        onStyleChange={handleStyleChange}
        onApplyToAllChange={setApplyToAll}
        onChar={handleChar}
        onDeleteChar={handleDeleteChar}
        onDeleteWord={handleDeleteWord}
        onDeleteAll={handleDeleteAll}
        onUndo={handleUndo}
        onSearchOpen={() => setShowSearch(true)}
      />

      {/* ── מודאלים ── */}
      {showFiles && (
        <FileManager
          files={listFiles()}
          onSave={handleSave}
          onOpen={handleOpen}
          onDelete={handleDeleteFile}
          onClose={() => setShowFiles(false)}
        />
      )}
      {showSearch && (
        <SearchReplace
          onFind={handleFind}
          onReplace={handleReplace}
          onClose={() => setShowSearch(false)}
        />
      )}

    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    background: "#f0f3f4",
    direction: "rtl",
    overflow: "hidden",
  },
  topBar: {
    background: "#2c3e50",
    color: "#ecf0f1",
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    flexWrap: "wrap",
    gap: 8,
  },
  appTitle: { fontSize: 17, fontWeight: "bold" },
  topActions: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  topBtn: {
    padding: "5px 12px", borderRadius: 6, border: "none",
    background: "#34495e", color: "#ecf0f1",
    cursor: "pointer", fontSize: 13, whiteSpace: "nowrap",
  },
  topBtnRed: { background: "#c0392b" },
  userLabel: {
    background: "#1a252f", padding: "4px 10px",
    borderRadius: 6, fontSize: 13, whiteSpace: "nowrap",
  },
  // תיקון 2: docsArea גמיש יותר עם minHeight קטן יותר
  docsArea: {
    flex: 1,
    display: "flex",
    gap: 12,
    padding: 10,
    maxHeight: "30vh",
    overflowX: "auto",
    overflowY: "hidden",
    alignItems: "stretch",
    minHeight: 80,
  },
};
