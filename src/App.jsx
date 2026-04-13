import React, { useState, useRef } from "react";
import AuthScreen    from "./components/AuthScreen";
import DocPanel      from "./components/DocPanel";
import EditorArea    from "./components/EditorArea";
import FileManager   from "./components/FileManager";
import SearchReplace from "./components/SearchReplace";
import TextDisplay   from "./components/TextDisplay";
import { useAuth }   from "./hooks/useAuth";
import { useFiles }  from "./hooks/useFiles";
import { DEFAULT_STYLE } from "./data/styleOptions";


let nextId = 1;
function makeId()    { return nextId++; }
function newDoc() { return { id: makeId(), name: "new", chars: [], dirty: false }; }
function makeChar(ch, style) { return { ch, style: { ...style } }; }
const MAX_UNDO = 50;

// ── App ─────────────────────────────────────────
export default function App() {

  const { currentUser, setCurrentUser, login, register, logout: authLogout } = useAuth();
  const { listFiles, saveFile, openFile, deleteFile, renameFile } = useFiles(currentUser, setCurrentUser);

  // חלק ג – מסמכים פתוחים
  const [docs,      setDocs]      = useState(() => [newDoc()]);
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

  // ── logout – save dirty docs then reset ──
  function handleLogout() {
    const dirtyDocs = docs.filter(d => d.dirty);

    if (dirtyDocs.length > 0) {
      const names = dirtyDocs.map(d => `"${d.name}"`).join(", ");
      const shouldSave = window.confirm(
        `המסמכים הבאים לא נשמרו: ${names}\nלשמור לפני יציאה?`
      );
      if (shouldSave) {
        dirtyDocs.forEach(d => saveFile(d.name, d.chars));
      }
    }

    const fresh = newDoc();
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
    const doc = newDoc();
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
        const fresh = newDoc();
        setFocusedId(fresh.id);
        return [fresh];
      }
      if (focusedId === id) setFocusedId(next[0].id);
      return next;
    });
    delete historyRef.current[id];
  }


  function handleRenameFile (oldName, newName) {
    renameFile(oldName, newName);

    setDocs(prevDocs => 
      prevDocs.map(doc => 
        doc.name === oldName ? { ...doc, name: newName } : doc
      )
    );
  };

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
          <span style={styles.userLabel}>👤 {currentUser?.name}</span>
          <button style={{ ...styles.topBtn, ...styles.topBtnRed }} onClick={handleLogout}>יציאה</button>
        </div>
      </div>

      {/* ── אזור עליון: טאבים + תצוגת טקסט ── */}
      <div style={styles.displayArea}>

        {/* רצועת טאבים */}
        <div style={styles.tabsRow}>
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

        {/* תצוגת הטקסט הממוקד */}
        <div style={styles.textDisplayWrapper}>
          <TextDisplay chars={focusedDoc.chars} />
        </div>

      </div>

      {/* ── חלק א: אזור עריכה – תחתית המסך ── */}
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
          onRename={handleRenameFile}
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
    fontFamily: "'Heebo', Arial, sans-serif",
    background: "#f7f8fa",
    direction: "rtl",
    overflow: "hidden",
  },
  topBar: {
    background: "#ffffff",
    color: "#1e293b",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    flexWrap: "wrap",
    gap: 8,
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  appTitle: { fontSize: 17, fontWeight: "700", color: "#2563eb", letterSpacing: 0.3 },
  topActions: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  topBtn: {
    padding: "5px 14px", borderRadius: 7,
    border: "1px solid #e2e8f0",
    background: "#f1f5f9", color: "#1e293b",
    cursor: "pointer", fontSize: 13, whiteSpace: "nowrap",
    fontFamily: "inherit",
    transition: "background 0.15s",
  },
  topBtnRed: {
    background: "#fee2e2", color: "#dc2626",
    borderColor: "#fca5a5",
  },
  userLabel: {
    background: "#eff6ff", color: "#2563eb",
    border: "1px solid #bfdbfe",
    padding: "4px 12px",
    borderRadius: 7, fontSize: 13, whiteSpace: "nowrap",
    fontWeight: "600",
  },

  // upper area – flex, takes all available space
  displayArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minHeight: 0,
  },

  // tabs row
  tabsRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    overflowX: "auto",
    gap: 4,
    padding: "10px 16px 0 16px",
    background: "#f1f5f9",
    borderBottom: "2px solid #e2e8f0",
    flexShrink: 0,
    alignItems: "flex-end",
  },

  // text display wrapper
  textDisplayWrapper: {
    flex: 1,
    overflow: "hidden",
    padding: "12px 16px",
    minHeight: 0,
  },
};
