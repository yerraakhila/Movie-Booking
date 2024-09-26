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

export function setCity(city) {
  localStorage.setItem("city", city);
}

export function getCity() {
  const city = localStorage.getItem("city");
  if (!city) {
    return "Banglore";
  }
  return city;
}
