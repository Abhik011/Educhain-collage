import jwtDecode from "jwt-decode";

export type UserPayload = {
  id: string;
  role: "college_admin" | "issuer";
};

export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const getUser = (): UserPayload | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return jwtDecode(token);
};
