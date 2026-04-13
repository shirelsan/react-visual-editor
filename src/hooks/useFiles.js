// All files stored inside the user's object:
// users -> { [username]: { password, files: { [filename]: chars[] } } }

import { getUsers } from "./useAuth";

const LS_USERS = "users";

function saveUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

export function useFiles(username) {

  // Get the current user's files
  function getUserFiles() {
    const users = getUsers();
    return users[username]?.files || {};
  }

  // List all file names for this user
  function listFiles() {
    return Object.keys(getUserFiles()).sort();//למה למיין??
  }

  // Save a file under this user
  function saveFile(filename, chars) {
    if (!filename || !username) return;
    const users = getUsers();
    if (!users[username]) return;
    users[username].files[filename] = chars;
    saveUsers(users);
  }

  // Load a file by name
  function openFile(filename) {
    const files = getUserFiles();
    return files[filename] || null;
  }

  // Delete a file by name
  function deleteFile(filename) {
    if (!username) 
      return;
    const users = getUsers();
    if (!users[username]?.files) 
      return;
    delete users[username].files[filename];
    saveUsers(users);
  }

  // Rename a file
  function renameFile(oldName, newName) {
    if (!oldName || !newName || oldName === newName || !username) return false;
    const users = getUsers();

    if (!users[username]?.files) 
      return false;
    if (users[username].files[newName] !== undefined) 
      return false; // name taken

    users[username].files[newName] = users[username].files[oldName];
    delete users[username].files[oldName];
    saveUsers(users);
    return true;
  }

  return { listFiles, saveFile, openFile, deleteFile, renameFile };
}