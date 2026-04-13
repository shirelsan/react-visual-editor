// Data structure in localStorage:
// "users" : { username: { password, files: { filename: chars[] } } }
// "current_user" : username (active session)

import { useState } from "react";

const LS_USERS   = "all_users";
const LS_CURRENT = "current_user";

export function getUsers() {
  try { return JSON.parse(localStorage.getItem(LS_USERS)) || {}; }
  catch { return {}; }
}

function saveUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(
    () => localStorage.getItem(LS_CURRENT) || null
  );

  function register(username, password) {
    if (!username || !password) 
      return "Please fill in your username and password";
    
    const users = getUsers();
    if (users[username])
      return "Username is taken";
    
    users[username] = { password, files: {} };
    saveUsers(users);
    localStorage.setItem(LS_CURRENT, username);
    setCurrentUser(username);
    return null;
  }

  function login(username, password) {
    if (!username || !password) return "Please fill in your username and password";
    const users = getUsers();
    if (!users[username] || users[username].password !== password)
      return "Incorrect username or password";
    localStorage.setItem(LS_CURRENT, username);
    setCurrentUser(username);
    return null;
  }

  function logout() {
    localStorage.removeItem(LS_CURRENT);
    setCurrentUser(null);
  }

  return { currentUser, login, register, logout };
}