import type { TaskCategory, TaskStatus } from "@/services/api/tasks";
import type {
  ClientCategory,
  ClientStatus,
  CoreStatus,
  CoreUsageType,
} from "@/services/api/infra";
import type { AppRole } from "@/services/api/users";
import type { ServerStatus } from "@/services/api/servers";

export type BadgeColor =
  | "gray"
  | "primary"
  | "error"
  | "warning"
  | "success"
  | "cyan"
  | "sky"
  | "blue"
  | "violet"
  | "purple"
  | "pink"
  | "rose"
  | "orange";

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  maintenance: "Maintenance",
  installation: "Instalasi",
  troubleshooting: "Troubleshooting",
  vpn_config: "Konfigurasi VPN",
};

export const TASK_CATEGORY_COLORS: Record<TaskCategory, BadgeColor> = {
  maintenance: "sky",
  installation: "violet",
  troubleshooting: "warning",
  vpn_config: "cyan",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  open: "Open",
  in_progress: "Dikerjakan",
  pending: "Pending",
  done: "Selesai",
};

export const TASK_STATUS_COLORS: Record<TaskStatus, BadgeColor> = {
  open: "gray",
  in_progress: "blue",
  pending: "warning",
  done: "success",
};

export const CLIENT_CATEGORY_LABELS: Record<ClientCategory, string> = {
  school: "Sekolah",
  company: "Perusahaan",
  industrial: "Industri",
  other: "Lainnya",
};

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  active: "Aktif",
  suspended: "Suspend",
  terminated: "Berhenti",
};

export const CLIENT_STATUS_COLORS: Record<ClientStatus, BadgeColor> = {
  active: "success",
  suspended: "warning",
  terminated: "error",
};

export const CORE_STATUS_LABELS: Record<CoreStatus, string> = {
  used: "Terpakai",
  idle: "Idle",
  damaged: "Rusak",
};

export const CORE_STATUS_COLORS: Record<CoreStatus, BadgeColor> = {
  used: "success",
  idle: "gray",
  damaged: "error",
};

export const CORE_USAGE_LABELS: Record<CoreUsageType, string> = {
  uplink_metro: "Uplink Metro",
  client: "Klien",
  backbone: "Backbone",
  spare: "Cadangan",
};

export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Admin",
  technician: "Teknisi",
};

export const SERVER_STATUS_LABELS: Record<ServerStatus, string> = {
  unknown: "Belum dicek",
  online: "Online",
  offline: "Offline",
  error: "Error",
};

export const SERVER_STATUS_COLORS: Record<ServerStatus, BadgeColor> = {
  unknown: "gray",
  online: "success",
  offline: "warning",
  error: "error",
};

export function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatUptime(seconds: number): string {
  if (!seconds || seconds < 0) return "-";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}h ${hours}j ${minutes}m`;
  if (hours > 0) return `${hours}j ${minutes}m`;
  return `${minutes}m`;
}

export function formatMb(mb: number): string {
  if (!mb) return "0 MB";
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

export function toDateInputValue(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}
