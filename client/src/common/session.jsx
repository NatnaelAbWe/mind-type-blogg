function storeInSession(key, value) {
  return sessionStorage.setItem(key, value);
}

function lookInSession(key) {
  return sessionStorage.getItem(key);
}

function removeFromSession(key) {
  return sessionStorage.removeItem(key);
}

function logOutUser() {
  return sessionStorage.clear();
}

export { storeInSession, lookInSession, removeFromSession, logOutUser };
