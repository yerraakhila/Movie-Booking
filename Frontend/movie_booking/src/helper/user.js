export function saveUser(user, token) {
  localStorage.setItem("user", user);
  localStorage.setItem("token", token);
}

export function getUser() {
  return localStorage.getItem("user");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function clearUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}
