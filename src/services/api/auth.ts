import { apiFetch, clearToken, getToken, setToken } from "./client";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: "super_admin" | "technician";
}

const USER_KEY = "netops_user";

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  window.localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export async function login(
  email: string,
  password: string,
): Promise<AuthUser> {
  const res = await apiFetch<{ access_token: string; user: AuthUser }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  );

  setToken(res.access_token);
  setStoredUser(res.user);
  return res.user;
}

export function logout() {
  clearToken();
  clearStoredUser();
}
