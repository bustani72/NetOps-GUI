"use client";

import { Button } from "@/components/tailgrids/core/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/tailgrids/core/dialog";
import { FieldError } from "@/components/tailgrids/core/field";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import {
  Select,
  SelectContent,
  SelectIndicator,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/tailgrids/core/select";
import { TextArea } from "@/components/tailgrids/core/text-area";
import { TextField } from "@/components/tailgrids/core/text-field";
import {
  CLIENT_CATEGORY_LABELS,
  CLIENT_STATUS_LABELS,
} from "@/constants/netops";
import type {
  Client,
  ClientCategory,
  ClientStatus,
  CreateClientInput,
} from "@/services/api/infra";
import { useState } from "react";

const EMPTY = {
  clientCode: "",
  clientName: "",
  category: "school" as ClientCategory,
  picName: "",
  picPhone: "",
  address: "",
  coordinates: "",
  ipAllocation: "",
  bandwidthMbps: "",
  status: "active" as ClientStatus,
};

const CATEGORY_OPTIONS: ClientCategory[] = [
  "school",
  "company",
  "industrial",
  "other",
];
const STATUS_OPTIONS: ClientStatus[] = ["active", "suspended", "terminated"];

function buildInitial(target: Client | null): typeof EMPTY {
  if (!target) return EMPTY;
  return {
    clientCode: target.clientCode,
    clientName: target.clientName,
    category: target.category,
    picName: target.picName ?? "",
    picPhone: target.picPhone ?? "",
    address: target.address ?? "",
    coordinates: target.coordinates ?? "",
    ipAllocation: target.ipAllocation ?? "",
    bandwidthMbps:
      target.bandwidthMbps != null ? String(target.bandwidthMbps) : "",
    status: target.status,
  };
}

export default function ClientDialog({
  open,
  onOpenChange,
  busy,
  target,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  busy: boolean;
  target: Client | null;
  onSubmit: (input: CreateClientInput) => void;
}) {
  const [form, setForm] = useState(() => buildInitial(target));

  const update = <K extends keyof typeof EMPTY>(
    key: K,
    value: (typeof EMPTY)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleConfirm = () => {
    const payload: CreateClientInput = {
      clientCode: form.clientCode.trim(),
      clientName: form.clientName.trim(),
      category: form.category,
      status: form.status,
    };
    if (form.picName.trim()) payload.picName = form.picName.trim();
    if (form.picPhone.trim()) payload.picPhone = form.picPhone.trim();
    if (form.address.trim()) payload.address = form.address.trim();
    if (form.coordinates.trim()) payload.coordinates = form.coordinates.trim();
    if (form.ipAllocation.trim()) payload.ipAllocation = form.ipAllocation.trim();
    if (form.bandwidthMbps.trim()) {
      payload.bandwidthMbps = Number(form.bandwidthMbps);
    }
    onSubmit(payload);
  };

  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{target ? "Edit Klien" : "Tambah Klien"}</DialogTitle>
      </DialogHeader>

      <DialogBody className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            className="w-full flex-col gap-1.5"
            value={form.clientCode}
            onChange={(v) => update("clientCode", v)}
            required
          >
            <Label className="text-sm font-medium text-input-label-text">Kode Klien</Label>
            <Input placeholder="mis. CL-0001" className="w-full px-3 py-2.5 text-sm" />
            <FieldError />
          </TextField>

          <TextField
            className="w-full flex-col gap-1.5"
            value={form.clientName}
            onChange={(v) => update("clientName", v)}
            required
          >
            <Label className="text-sm font-medium text-input-label-text">Nama Klien</Label>
            <Input placeholder="mis. SMAN 1 Jakarta" className="w-full px-3 py-2.5 text-sm" />
            <FieldError />
          </TextField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            value={form.category}
            onChange={(value) => update("category", value as ClientCategory)}
          >
            <SelectLabel>Kategori</SelectLabel>
            <SelectTrigger>
              <SelectValue />
              <SelectIndicator />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((category) => (
                <SelectItem key={category} id={category}>
                  {CLIENT_CATEGORY_LABELS[category]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.status}
            onChange={(value) => update("status", value as ClientStatus)}
          >
            <SelectLabel>Status</SelectLabel>
            <SelectTrigger>
              <SelectValue />
              <SelectIndicator />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} id={status}>
                  {CLIENT_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            className="w-full flex-col gap-1.5"
            value={form.picName}
            onChange={(v) => update("picName", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">Nama PIC</Label>
            <Input placeholder="mis. Budi" className="w-full px-3 py-2.5 text-sm" />
            <FieldError />
          </TextField>

          <TextField
            className="w-full flex-col gap-1.5"
            value={form.picPhone}
            onChange={(v) => update("picPhone", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">Telepon PIC</Label>
            <Input placeholder="mis. 0812xxxxxxx" className="w-full px-3 py-2.5 text-sm" />
            <FieldError />
          </TextField>
        </div>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.address}
          onChange={(v) => update("address", v)}
        >
          <Label className="text-sm font-medium text-input-label-text">Alamat</Label>
          <TextArea placeholder="Alamat klien" className="w-full px-3 py-2.5 text-sm" rows={2} />
          <FieldError />
        </TextField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField
            className="w-full flex-col gap-1.5"
            value={form.coordinates}
            onChange={(v) => update("coordinates", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">Koordinat</Label>
            <Input
              placeholder="-6.2, 106.8"
              className="w-full px-3 py-2.5 text-sm"
            />
            <FieldError />
          </TextField>

          <TextField
            className="w-full flex-col gap-1.5"
            value={form.ipAllocation}
            onChange={(v) => update("ipAllocation", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">Alokasi IP</Label>
            <Input placeholder="mis. 10.10.1.0/30" className="w-full px-3 py-2.5 text-sm" />
            <FieldError />
          </TextField>

          <TextField
            className="w-full flex-col gap-1.5"
            value={form.bandwidthMbps}
            onChange={(v) => update("bandwidthMbps", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">
              Bandwidth (Mbps)
            </Label>
            <Input
              inputMode="numeric"
              placeholder="mis. 100"
              className="w-full px-3 py-2.5 text-sm"
            />
            <FieldError />
          </TextField>
        </div>
      </DialogBody>

      <DialogFooter>
        <Button appearance="outline" onPress={() => onOpenChange(false)} isDisabled={busy}>
          Batal
        </Button>
        <Button onPress={handleConfirm} isDisabled={busy}>
          {busy ? "Menyimpan…" : "Simpan"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
