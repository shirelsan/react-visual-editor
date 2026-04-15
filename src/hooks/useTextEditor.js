// useTextEditor.js – לוגיקת עריכה לטקסט אחד
import { useState } from "react";
import { DEFAULT_STYLE } from "../data/styleOptions";

const MAX_UNDO = 50;

function makeChar(ch, style) {
  return { ch, style: { ...style } };
}

export function useTextEditor() {
  const [chars, setChars]               = useState([]);
  const [currentStyle, setCurrentStyle] = useState({ ...DEFAULT_STYLE });
  const [applyToAll, setApplyToAll]     = useState(false);
  const [history, setHistory]            = useState([]);

  function pushHistory(snapshot) {
    historyRef.current.push(snapshot.map(c => ({ ...c, style: { ...c.style } })));
    if (historyRef.current.length > MAX_UNDO) historyRef.current.shift();
  }

  function addChar(ch) {
    pushHistory(chars);
    if (applyToAll) {
      setChars(prev => [
        ...prev.map(c => makeChar(c.ch, currentStyle)),
        makeChar(ch, currentStyle),
      ]);
    } else {
      setChars(prev => [...prev, makeChar(ch, currentStyle)]);
    }
  }

  function deleteChar() {
    if (chars.length === 0) return;
    pushHistory(chars);
    setChars(prev => prev.slice(0, -1));
  }

  function deleteWord() {
    if (chars.length === 0) return;
    pushHistory(chars);
    setChars(prev => {
      let arr = [...prev];
      while (arr.length > 0 && arr[arr.length - 1].ch === " ") arr.pop();
      while (arr.length > 0 && arr[arr.length - 1].ch !== " ") arr.pop();
      return arr;
    });
  }

  function deleteAll() {
    if (chars.length === 0) return;
    pushHistory(chars);
    setChars([]);
  }

  function undo() {
    if (historyRef.current.length === 0) return;
    setChars(historyRef.current.pop());
  }

  function updateStyle(partial) {
    const newStyle = { ...currentStyle, ...partial };
    setCurrentStyle(newStyle);
    if (applyToAll) {
      pushHistory(chars);
      setChars(prev => prev.map(c => makeChar(c.ch, newStyle)));
    }
  }

  function findChar(ch) {
    return chars.filter(c => c.ch === ch).length;
  }

  function replaceChar(findCh, replaceCh) {
    const count = chars.filter(c => c.ch === findCh).length;
    if (count === 0) return 0;
    pushHistory(chars);
    setChars(prev => prev.map(c => c.ch === findCh ? makeChar(replaceCh, c.style) : c));
    return count;
  }

  // טעינת תוכן מקובץ שמור
  function loadChars(savedChars) {
    historyRef.current = [];
    setChars(savedChars);
  }

  return {
    chars, currentStyle, applyToAll, setApplyToAll,
    addChar, deleteChar, deleteWord, deleteAll,
    undo, updateStyle, findChar, replaceChar, loadChars,
  };
}
