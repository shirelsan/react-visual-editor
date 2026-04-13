
export function useFiles(currentUser, setCurrentUser) {

  function updateSession(newUserData) {
    if (!currentUser) return;

    const newSession = {
      ...currentUser,
      userData: newUserData
    };

    localStorage.setItem("current_session", JSON.stringify(newSession));
    setCurrentUser(newSession);
  }

  function getUserFiles() {
    return currentUser?.userData?.files || {};
  }

  function listFiles() {
    return Object.keys(getUserFiles()).sort();
  }

  function saveFile(filename, chars) {
    if (!filename || !currentUser) return;

    const newUserData = { ...currentUser.userData };
    newUserData.files[filename] = chars;

    updateSession(newUserData);
  }

  function openFile(filename) {
    const files = getUserFiles();
    return files[filename] || null;
  }

  function deleteFile(filename) {
    if (!filename || !currentUser) return;

    const newUserData = { ...currentUser.userData };
    delete newUserData.files[filename];

    updateSession(newUserData);
  }

  function renameFile(oldName, newName) {
    if (!oldName || !newName || oldName === newName || !currentUser) return;

    const newUserData = { ...currentUser.userData };
    const fileData = newUserData.files[oldName];

    if (!fileData) return;

    delete newUserData.files[oldName];
    newUserData.files[newName] = fileData;

    updateSession(newUserData);
  }

  return { listFiles, saveFile, openFile, deleteFile, renameFile };
}