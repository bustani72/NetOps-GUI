import { apiFetch } from "./client";

export interface SystemSetting {
  id: number;
  settingKey: string;
  settingValue: string | null;
  description: string | null;
  updatedAt: string;
}

export interface UpdateSettingInput {
  settingValue: string;
  description?: string;
}

export function listSettings() {
  return apiFetch<SystemSetting[]>("/settings");
}

export function getSetting(key: string) {
  return apiFetch<SystemSetting>(`/settings/${encodeURIComponent(key)}`);
}

export function upsertSetting(key: string, input: UpdateSettingInput) {
  return apiFetch<SystemSetting>(`/settings/${encodeURIComponent(key)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
