import { apiFetch } from "./client";

export type AppRole = "super_admin" | "technician";

export interface AppUser {
  id: number;
  fullName: string;
  email: string;
  phoneWa: string | null;
  role: AppRole;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserInput {
  fullName: string;
  email: string;
  phoneWa?: string;
  password: string;
  role: AppRole;
}

export interface UpdateUserInput {
  fullName?: string;
  phoneWa?: string;
  password?: string;
  role?: AppRole;
  isActive?: boolean;
}

export function listUsers() {
  return apiFetch<AppUser[]>("/users");
}

export function getUser(id: number) {
  return apiFetch<AppUser>(`/users/${id}`);
}

export function createUser(input: CreateUserInput) {
  return apiFetch<AppUser>("/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateUser(id: number, input: UpdateUserInput) {
  return apiFetch<AppUser>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteUser(id: number) {
  return apiFetch<{ success: boolean }>(`/users/${id}`, { method: "DELETE" });
}
