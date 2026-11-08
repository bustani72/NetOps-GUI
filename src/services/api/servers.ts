import { apiFetch } from "./client";

export type ServerAuthType = "password" | "key";
export type ServerStatus = "unknown" | "online" | "offline" | "error";

export interface ServerRecord {
  id: number;
  name: string;
  host: string;
  sshPort: number;
  sshUser: string;
  authType: ServerAuthType;
  agentPort: number;
  vpnManagerHome: string | null;
  description: string | null;
  isDefault: boolean;
  status: ServerStatus;
  lastCheckedAt: string | null;
  createdAt: string;
  updatedAt: string;
  hasPassword: boolean;
  hasPrivateKey: boolean;
  hasAgentToken: boolean;
}

export interface CreateServerInput {
  name: string;
  host: string;
  sshPort?: number;
  sshUser?: string;
  authType?: ServerAuthType;
  password?: string;
  privateKey?: string;
  passphrase?: string;
  agentPort?: number;
  agentToken?: string;
  vpnManagerHome?: string;
  description?: string;
}

export type UpdateServerInput = Partial<CreateServerInput>;

export interface ServerTestResult {
  ok: boolean;
  message: string;
  output?: string;
  exitCode?: number;
  health?: unknown;
}

export interface SetupStep {
  step: string;
  ok: boolean;
  message?: string;
}

export interface SetupServerInput {
  vpnManagerHome?: string;
  vpnManagerRepoUrl?: string;
  agentHost?: string;
  agentPort?: number;
  prepareOnly?: boolean;
}

export interface SetupServerResult {
  ok: boolean;
  prepared: boolean;
  message: string;
  agentToken?: string;
  steps: SetupStep[];
  installOutput?: string;
}

export function listServers() {
  return apiFetch<ServerRecord[]>("/servers");
}

export function getServer(id: number) {
  return apiFetch<ServerRecord>(`/servers/${id}`);
}

export function createServer(input: CreateServerInput) {
  return apiFetch<ServerRecord>("/servers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateServer(id: number, input: UpdateServerInput) {
  return apiFetch<ServerRecord>(`/servers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteServer(id: number) {
  return apiFetch<{ success: boolean }>(`/servers/${id}`, { method: "DELETE" });
}

export function activateServer(id: number) {
  return apiFetch<ServerRecord>(`/servers/${id}/activate`, { method: "POST" });
}

export function testServerSsh(id: number) {
  return apiFetch<ServerTestResult>(`/servers/${id}/test-ssh`, {
    method: "POST",
  });
}

export function testServerAgent(id: number) {
  return apiFetch<ServerTestResult>(`/servers/${id}/test-agent`, {
    method: "POST",
  });
}

export function setupServer(id: number, input: SetupServerInput) {
  return apiFetch<SetupServerResult>(`/servers/${id}/setup`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}
