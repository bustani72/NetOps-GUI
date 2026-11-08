import { apiFetch } from "./client";
import type { Client, Pop } from "./infra";

export type TaskCategory =
  | "maintenance"
  | "installation"
  | "troubleshooting"
  | "vpn_config";

export type TaskStatus = "open" | "in_progress" | "pending" | "done";

export interface TaskUserRef {
  id: number;
  fullName: string;
  email: string;
}

export interface TaskAttachment {
  id: number;
  taskId: number;
  filePath: string;
  caption: string | null;
  uploadedAt: string;
}

export interface DailyTaskItem {
  id: number;
  userId: number;
  popId: number | null;
  clientId: number | null;
  title: string;
  category: TaskCategory;
  description: string | null;
  status: TaskStatus;
  pendingReason: string | null;
  taskDate: string;
  completedAt: string | null;
  user: TaskUserRef;
  pop: Pop | null;
  client: Client | null;
  attachments: TaskAttachment[];
}

export interface ListTaskQuery {
  status?: TaskStatus;
  category?: TaskCategory;
  userId?: number;
  from?: string;
  to?: string;
}

export interface CreateTaskInput {
  userId?: number;
  popId?: number;
  clientId?: number;
  title: string;
  category: TaskCategory;
  description?: string;
  taskDate: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  pendingReason?: string;
  completedAt?: string;
}

export interface CreateAttachmentInput {
  filePath: string;
  caption?: string;
}

function toQuery(query?: ListTaskQuery): string {
  if (!query) return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function listTasks(query?: ListTaskQuery) {
  return apiFetch<DailyTaskItem[]>(`/tasks${toQuery(query)}`);
}

export function getTask(id: number) {
  return apiFetch<DailyTaskItem>(`/tasks/${id}`);
}

export function createTask(input: CreateTaskInput) {
  return apiFetch<DailyTaskItem>("/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTask(id: number, input: UpdateTaskInput) {
  return apiFetch<DailyTaskItem>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteTask(id: number) {
  return apiFetch<{ success: boolean }>(`/tasks/${id}`, { method: "DELETE" });
}

export function addTaskAttachment(id: number, input: CreateAttachmentInput) {
  return apiFetch<TaskAttachment>(`/tasks/${id}/attachments`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}
