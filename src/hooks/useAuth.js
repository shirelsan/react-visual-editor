// Data structure in localStorage:
// "all_users" : { username: { password, files: { filename: chars[] } } }
// "current_session" : { username, userDtata; {password, files: { filename: chars[] } }}

import { useState } from "react";

export const LS_USERS   = "all_users";
export const LS_SESSION = "current_session"

export function getUsers() {
  try { return JSON.parse(localStorage.getItem(LS_USERS)) || {}; }
  catch { return {}; }
}

function saveUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(() => {
    const session = localStorage.getItem(LS_SESSION);
    return session ? JSON.parse(session) : null;
  });

  function register(username, password) {
    if (!username || !password) 
      return "Please fill in your username and password";
    
    const users = getUsers();
    if (users[username])
      return "Username is taken";
    
    users[username] = { password, files: {} };
    saveUsers(users);
    
    const sessionData = { username, userData: newUser };
    localStorage.setItem(LS_SESSION, JSON.stringify(sessionData));
    setCurrentUser(sessionData);
    return null;
  }

  function login(username, password) {
    if (!username || !password) 
      return "Please fill in your username and password";
    
    const users = getUsers();
    const user = users[username];

    if (!users[username] || users[username].password !== password)
      return "Incorrect username or password";

    const sessionData = {
      username: username,
      userData: user
    };
    localStorage.setItem(LS_SESSION, JSON.stringify(sessionData));    
    setCurrentUser(sessionData);
    return null;
  }

  function logout() {
    if (!currentUser) 
      return;

    const users = getUsers();
    users[currentUser.username] = currentUser.userData;
    localStorage.setItem(LS_USERS, JSON.stringify(users));
    
    localStorage.removeItem(LS_SESSION);
    setCurrentUser(null);
  }

  return { currentUser, setCurrentUser, login, register, logout };
}