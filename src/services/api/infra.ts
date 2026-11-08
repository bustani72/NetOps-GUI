import { apiFetch } from "./client";

// ---- POP ----

export interface Pop {
  id: number;
  popCode: string;
  popName: string;
  address: string | null;
  coordinates: string | null;
  deviceNotes: string | null;
}

export interface PopDetail extends Pop {
  otbs: Otb[];
}

export interface CreatePopInput {
  popCode: string;
  popName: string;
  address?: string;
  coordinates?: string;
  deviceNotes?: string;
}

export function listPops() {
  return apiFetch<Pop[]>("/pops");
}

export function getPop(id: number) {
  return apiFetch<PopDetail>(`/pops/${id}`);
}

export function createPop(input: CreatePopInput) {
  return apiFetch<Pop>("/pops", { method: "POST", body: JSON.stringify(input) });
}

export function updatePop(id: number, input: Partial<CreatePopInput>) {
  return apiFetch<Pop>(`/pops/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deletePop(id: number) {
  return apiFetch<{ success: boolean }>(`/pops/${id}`, { method: "DELETE" });
}

// ---- OTB ----

export interface Otb {
  id: number;
  popId: number;
  otbName: string;
  cableType: string | null;
  direction: string | null;
  pop?: Pop;
}

export interface OtbDetail extends Otb {
  cores: OtbCore[];
}

export interface CreateOtbInput {
  popId: number;
  otbName: string;
  cableType?: string;
  direction?: string;
}

export function listOtbs(popId?: number) {
  const qs = popId ? `?popId=${popId}` : "";
  return apiFetch<Otb[]>(`/otbs${qs}`);
}

export function getOtb(id: number) {
  return apiFetch<OtbDetail>(`/otbs/${id}`);
}

export function createOtb(input: CreateOtbInput) {
  return apiFetch<Otb>("/otbs", { method: "POST", body: JSON.stringify(input) });
}

export function updateOtb(id: number, input: Partial<CreateOtbInput>) {
  return apiFetch<Otb>(`/otbs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteOtb(id: number) {
  return apiFetch<{ success: boolean }>(`/otbs/${id}`, { method: "DELETE" });
}

// ---- OTB Cores ----

export type CoreStatus = "used" | "idle" | "damaged";
export type CoreUsageType = "uplink_metro" | "client" | "backbone" | "spare";

export interface OtbCore {
  id: number;
  otbId: number;
  tubeColor: string | null;
  coreNumber: number | null;
  coreColor: string | null;
  status: CoreStatus;
  usageType: CoreUsageType;
  clientId: number | null;
  destinationPopId: number | null;
  notes: string | null;
}

export interface CreateCoreInput {
  tubeColor?: string;
  coreNumber?: number;
  coreColor?: string;
  status?: CoreStatus;
  usageType?: CoreUsageType;
  clientId?: number;
  destinationPopId?: number;
  notes?: string;
}

export function listCores(otbId: number) {
  return apiFetch<OtbCore[]>(`/otbs/${otbId}/cores`);
}

export function createCore(otbId: number, input: CreateCoreInput) {
  return apiFetch<OtbCore>(`/otbs/${otbId}/cores`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCore(id: number, input: Partial<CreateCoreInput>) {
  return apiFetch<OtbCore>(`/cores/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteCore(id: number) {
  return apiFetch<{ success: boolean }>(`/cores/${id}`, { method: "DELETE" });
}

// ---- Client ----

export type ClientCategory = "school" | "company" | "industrial" | "other";
export type ClientStatus = "active" | "suspended" | "terminated";

export interface Client {
  id: number;
  clientCode: string;
  clientName: string;
  category: ClientCategory;
  picName: string | null;
  picPhone: string | null;
  address: string | null;
  coordinates: string | null;
  ipAllocation: string | null;
  bandwidthMbps: number | null;
  status: ClientStatus;
}

export interface CreateClientInput {
  clientCode: string;
  clientName: string;
  category?: ClientCategory;
  picName?: string;
  picPhone?: string;
  address?: string;
  coordinates?: string;
  ipAllocation?: string;
  bandwidthMbps?: number;
  status?: ClientStatus;
}

export interface QueryClient {
  category?: ClientCategory;
  status?: ClientStatus;
  search?: string;
}

export function listClients(query?: QueryClient) {
  const params = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
  }
  const qs = params.toString();
  return apiFetch<Client[]>(`/clients${qs ? `?${qs}` : ""}`);
}

export function getClient(id: number) {
  return apiFetch<Client>(`/clients/${id}`);
}

export function createClient(input: CreateClientInput) {
  return apiFetch<Client>("/clients", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateClient(id: number, input: Partial<CreateClientInput>) {
  return apiFetch<Client>(`/clients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteClient(id: number) {
  return apiFetch<{ success: boolean }>(`/clients/${id}`, { method: "DELETE" });
}
