// useFiles.js – שמירה וטעינת קבצים ב-LocalStorage (חלקים ב + ד)
// כל קובץ שמור תחת המפתח: "rte_file_<username>_<filename>"

const PREFIX = "rte_file_";

function fileKey(username, filename) {
  return PREFIX + username + "_" + filename;
}

export function useFiles(username) {

  // רשימת שמות הקבצים של המשתמש הנוכחי
  function listFiles() {
    const prefix = PREFIX + username + "_";
    const names = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(prefix)) {
        names.push(key.slice(prefix.length));
      }
    }
    return names.sort();
  }

  // שמירת קובץ (save / save-as)
  function saveFile(filename, chars) {
    if (!filename) return;
    localStorage.setItem(fileKey(username, filename), JSON.stringify(chars));
  }

  // טעינת קובץ (open)
  function openFile(filename) {
    const raw = localStorage.getItem(fileKey(username, filename));
    if (!raw) return null;
    try { return JSON.parse(raw); }
    catch { return null; }
  }

  // מחיקת קובץ
  function deleteFile(filename) {
    localStorage.removeItem(fileKey(username, filename));
  }

  return { listFiles, saveFile, openFile, deleteFile };
}
