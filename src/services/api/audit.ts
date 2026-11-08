import { apiFetch } from "./client";

export interface AuditLogEntry {
  id: number;
  userId: number | null;
  action: string;
  targetTable: string | null;
  targetId: number | null;
  details: string | null;
  createdAt: string;
  user: { id: number; fullName: string; email: string } | null;
}

export interface AuditLogPage {
  items: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
}

export function listAuditLogs(limit = 50, page = 1) {
  return apiFetch<AuditLogPage>(`/audit?limit=${limit}&page=${page}`);
}
