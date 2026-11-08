import { apiFetch } from "./client";

// ---- Server status ----

export interface VpnServerInfo {
  publicIp: string;
  interface: string;
}

export interface VpnResources {
  cpuCores: number;
  load1: number;
  ramTotalMb: number;
  ramUsedMb: number;
  ramPct: number;
  diskTotalMb: number;
  diskUsedMb: number;
  diskPct: number;
  uptimeSeconds: number;
}

export interface VpnServiceInfo {
  active: string;
  enabled: string;
  port?: string;
  subnet?: string;
  localIp?: string;
  serverIp?: string;
  publicKey?: string;
  listening?: number;
  total?: number;
}

export interface VpnServicesMap {
  l2tp: VpnServiceInfo;
  wireguard: VpnServiceInfo;
  forwards: VpnServiceInfo;
}

export interface VpnCounts {
  l2tpUsers: number;
  l2tpOnline: number;
  wgPeers: number;
  wgOnline: number;
}

export interface VpnStatus {
  ok: boolean;
  server: VpnServerInfo;
  resources: VpnResources;
  services: VpnServicesMap;
  counts: VpnCounts;
}

export type VpnServiceAction = "start" | "stop" | "restart";

export function getVpnStatus() {
  return apiFetch<VpnStatus>("/vpn/status");
}

export function getVpnServices() {
  return apiFetch<VpnServicesMap>("/vpn/services");
}

export function vpnServiceAction(action: VpnServiceAction) {
  return apiFetch<{ ok: boolean; output?: string }>(`/vpn/services/${action}`, {
    method: "POST",
  });
}

// ---- L2TP ----

export interface L2tpUser {
  username: string;
  password: string;
  vpnIp: string;
}

export type ForwardMode = "skip" | "standard" | "custom";

export interface CreateL2tpUserInput {
  username: string;
  password: string;
  ip?: string;
  forward?: ForwardMode;
  ports?: string;
  description?: string;
}

export function listL2tpUsers() {
  return apiFetch<L2tpUser[]>("/vpn/l2tp/users");
}

export function createL2tpUser(input: CreateL2tpUserInput) {
  return apiFetch<{ ok: boolean }>("/vpn/l2tp/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteL2tpUser(username: string) {
  return apiFetch<{ ok: boolean }>(
    `/vpn/l2tp/users/${encodeURIComponent(username)}`,
    { method: "DELETE" },
  );
}

// ---- WireGuard ----

export interface WgPeer {
  name: string;
  ip: string;
  pubkey: string;
  description: string;
  keyMode: string;
  dns: string;
  created: string;
  online: boolean;
}

export interface CreateWgPeerInput {
  name: string;
  description?: string;
  dns?: string;
  allowedIps?: string;
  forward?: ForwardMode;
  ports?: string;
  keyMode?: "auto" | "external";
  pubkey?: string;
}

export interface WgPeerConfig {
  ok: boolean;
  name: string;
  config: string;
  qrPngBase64?: string;
}

export function listWgPeers() {
  return apiFetch<WgPeer[]>("/vpn/wg/peers");
}

export function createWgPeer(input: CreateWgPeerInput) {
  return apiFetch<{ ok: boolean }>("/vpn/wg/peers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getWgPeerConfig(name: string) {
  return apiFetch<WgPeerConfig>(
    `/vpn/wg/peers/${encodeURIComponent(name)}/config`,
  );
}

export function deleteWgPeer(name: string) {
  return apiFetch<{ ok: boolean }>(`/vpn/wg/peers/${encodeURIComponent(name)}`, {
    method: "DELETE",
  });
}

// ---- Port forwards ----

export interface PortForward {
  name: string;
  publicPort: number;
  internalIp: string;
  internalPort: number;
  protocol: string;
  description: string;
  listening: boolean;
}

export type ForwardProtocol = "tcp" | "udp" | "both";

export interface CreateForwardInput {
  name: string;
  publicPort: number;
  destinationPort: number;
  internalIp: string;
  protocol?: ForwardProtocol;
  description?: string;
}

export function listForwards() {
  return apiFetch<PortForward[]>("/vpn/forwards");
}

export function createForward(input: CreateForwardInput) {
  return apiFetch<{ ok: boolean }>("/vpn/forwards", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteForward(name: string) {
  return apiFetch<{ ok: boolean }>(`/vpn/forwards/${encodeURIComponent(name)}`, {
    method: "DELETE",
  });
}

export function restartForwards() {
  return apiFetch<{ ok: boolean; output?: string }>("/vpn/forwards/restart", {
    method: "POST",
  });
}
