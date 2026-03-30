// useAuth.js – ניהול משתמשים בצד לקוח (חלק ד)
// אימות בסיסי בלבד באמצעות LocalStorage

import { useState } from "react";

const LS_USERS = "rte_users"; // { username: password }

function getUsers() {
  try { return JSON.parse(localStorage.getItem(LS_USERS)) || {}; }
  catch { return {}; }
}

function saveUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

export function useAuth() {
  // שמירת המשתמש הנוכחי ב-sessionStorage כך שסגירת הטאב מנתקת
  const [currentUser, setCurrentUser] = useState(
    () => sessionStorage.getItem("rte_current_user") || null
  );

  function register(username, password) {
    if (!username || !password) return "נא למלא שם משתמש וסיסמה";
    const users = getUsers();
    if (users[username]) return "שם המשתמש תפוס";
    users[username] = password;
    saveUsers(users);
    sessionStorage.setItem("rte_current_user", username);
    setCurrentUser(username);
    return null; // אין שגיאה
  }

  function login(username, password) {
    if (!username || !password) return "נא למלא שם משתמש וסיסמה";
    const users = getUsers();
    if (!users[username] || users[username] !== password) return "שם משתמש או סיסמה שגויים";
    sessionStorage.setItem("rte_current_user", username);
    setCurrentUser(username);
    return null;
  }

  function logout() {
    sessionStorage.removeItem("rte_current_user");
    setCurrentUser(null);
  }

  return { currentUser, login, register, logout };
}
