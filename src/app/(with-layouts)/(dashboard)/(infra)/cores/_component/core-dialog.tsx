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
  CORE_STATUS_LABELS,
  CORE_USAGE_LABELS,
} from "@/constants/netops";
import type {
  Client,
  CoreStatus,
  CoreUsageType,
  CreateCoreInput,
  OtbCore,
  Pop,
} from "@/services/api/infra";
import { useState } from "react";

const EMPTY = {
  tubeColor: "",
  coreNumber: "",
  coreColor: "",
  status: "idle" as CoreStatus,
  usageType: "spare" as CoreUsageType,
  clientId: "none",
  destinationPopId: "none",
  notes: "",
};

const STATUS_OPTIONS: CoreStatus[] = ["used", "idle", "damaged"];
const USAGE_OPTIONS: CoreUsageType[] = [
  "uplink_metro",
  "client",
  "backbone",
  "spare",
];

function buildInitial(target: OtbCore | null): typeof EMPTY {
  if (!target) return EMPTY;
  return {
    tubeColor: target.tubeColor ?? "",
    coreNumber: target.coreNumber != null ? String(target.coreNumber) : "",
    coreColor: target.coreColor ?? "",
    status: target.status,
    usageType: target.usageType,
    clientId: target.clientId != null ? String(target.clientId) : "none",
    destinationPopId:
      target.destinationPopId != null ? String(target.destinationPopId) : "none",
    notes: target.notes ?? "",
  };
}

export default function CoreDialog({
  open,
  onOpenChange,
  busy,
  target,
  clients,
  pops,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  busy: boolean;
  target: OtbCore | null;
  clients: Client[];
  pops: Pop[];
  onSubmit: (input: CreateCoreInput) => void;
}) {
  const [form, setForm] = useState(() => buildInitial(target));

  const update = <K extends keyof typeof EMPTY>(
    key: K,
    value: (typeof EMPTY)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleConfirm = () => {
    const payload: CreateCoreInput = {
      status: form.status,
      usageType: form.usageType,
    };
    if (form.tubeColor.trim()) payload.tubeColor = form.tubeColor.trim();
    if (form.coreColor.trim()) payload.coreColor = form.coreColor.trim();
    if (form.coreNumber.trim()) payload.coreNumber = Number(form.coreNumber);
    if (form.clientId !== "none") payload.clientId = Number(form.clientId);
    if (form.destinationPopId !== "none") {
      payload.destinationPopId = Number(form.destinationPopId);
    }
    if (form.notes.trim()) payload.notes = form.notes.trim();
    onSubmit(payload);
  };

  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{target ? "Edit Core" : "Tambah Core"}</DialogTitle>
      </DialogHeader>

      <DialogBody className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            className="w-full flex-col gap-1.5"
            value={form.tubeColor}
            onChange={(v) => update("tubeColor", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">Warna Tube</Label>
            <Input placeholder="mis. Merah" className="w-full px-3 py-2.5 text-sm" />
            <FieldError />
          </TextField>

          <TextField
            className="w-full flex-col gap-1.5"
            value={form.coreNumber}
            onChange={(v) => update("coreNumber", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">Nomor Core</Label>
            <Input
              inputMode="numeric"
              placeholder="mis. 1"
              className="w-full px-3 py-2.5 text-sm"
            />
            <FieldError />
          </TextField>
        </div>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.coreColor}
          onChange={(v) => update("coreColor", v)}
        >
          <Label className="text-sm font-medium text-input-label-text">Warna Core</Label>
          <Input placeholder="mis. Biru" className="w-full px-3 py-2.5 text-sm" />
          <FieldError />
        </TextField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            value={form.status}
            onChange={(value) => update("status", value as CoreStatus)}
          >
            <SelectLabel>Status</SelectLabel>
            <SelectTrigger>
              <SelectValue />
              <SelectIndicator />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} id={status}>
                  {CORE_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.usageType}
            onChange={(value) => update("usageType", value as CoreUsageType)}
          >
            <SelectLabel>Penggunaan</SelectLabel>
            <SelectTrigger>
              <SelectValue />
              <SelectIndicator />
            </SelectTrigger>
            <SelectContent>
              {USAGE_OPTIONS.map((usage) => (
                <SelectItem key={usage} id={usage}>
                  {CORE_USAGE_LABELS[usage]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select
          value={form.clientId}
          onChange={(value) => update("clientId", value as string)}
        >
          <SelectLabel>Klien (opsional)</SelectLabel>
          <SelectTrigger>
            <SelectValue />
            <SelectIndicator />
          </SelectTrigger>
          <SelectContent>
            <SelectItem id="none">Tidak ada</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} id={String(client.id)}>
                {client.clientCode} — {client.clientName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={form.destinationPopId}
          onChange={(value) => update("destinationPopId", value as string)}
        >
          <SelectLabel>POP Tujuan (opsional)</SelectLabel>
          <SelectTrigger>
            <SelectValue />
            <SelectIndicator />
          </SelectTrigger>
          <SelectContent>
            <SelectItem id="none">Tidak ada</SelectItem>
            {pops.map((pop) => (
              <SelectItem key={pop.id} id={String(pop.id)}>
                {pop.popCode} — {pop.popName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.notes}
          onChange={(v) => update("notes", v)}
        >
          <Label className="text-sm font-medium text-input-label-text">Catatan</Label>
          <TextArea
            placeholder="Catatan tambahan"
            className="w-full px-3 py-2.5 text-sm"
            rows={3}
          />
          <FieldError />
        </TextField>
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
