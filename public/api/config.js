export const apiUrl = "http://localhost:8080";

export const getToken = () => localStorage.getItem("token");
export const getUserId = () => localStorage.getItem("userId");
export const getUserName = () => localStorage.getItem("userName") || "Usuário";

export const logout = () => {
  localStorage.clear();
  window.location.href = "index.html";
};
