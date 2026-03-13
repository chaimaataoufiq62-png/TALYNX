import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};
// Déconnexion locale
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
// Sauvegarder les données utilisateur après login
export const saveAuthData = (data) => {
  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
};
// Récupérer l'utilisateur connecté
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Vérifier si connecté
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};