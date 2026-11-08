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
import { TextField } from "@/components/tailgrids/core/text-field";
import type { CreateWgPeerInput, ForwardMode } from "@/services/api/vpn";
import { useState } from "react";

const INITIAL = {
  name: "",
  description: "",
  dns: "",
  allowedIps: "",
  forward: "standard" as ForwardMode,
  ports: "",
  keyMode: "auto" as "auto" | "external",
  pubkey: "",
};

export default function CreateWgDialog({
  open,
  onOpenChange,
  busy,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  busy: boolean;
  onSubmit: (input: CreateWgPeerInput) => void;
}) {
  const [form, setForm] = useState(INITIAL);

  const reset = () => setForm(INITIAL);

  const update = <K extends keyof typeof INITIAL>(
    key: K,
    value: (typeof INITIAL)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleConfirm = () => {
    const payload: CreateWgPeerInput = {
      name: form.name.trim(),
      keyMode: form.keyMode,
    };
    if (form.description.trim()) payload.description = form.description.trim();
    if (form.dns.trim()) payload.dns = form.dns.trim();
    if (form.allowedIps.trim()) payload.allowedIps = form.allowedIps.trim();
    if (form.forward !== "standard") payload.forward = form.forward;
    if (form.forward === "custom" && form.ports.trim()) payload.ports = form.ports.trim();
    if (form.keyMode === "external" && form.pubkey.trim())
      payload.pubkey = form.pubkey.trim();
    onSubmit(payload);
  };

  return (
    <Dialog
      isOpen={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogHeader>
        <DialogTitle>Tambah WireGuard Peer</DialogTitle>
      </DialogHeader>

      <DialogBody className="space-y-4">
        <TextField
          className="w-full flex-col gap-1.5"
          value={form.name}
          onChange={(v) => update("name", v)}
          required
        >
          <Label className="text-sm font-medium text-input-label-text">Nama Peer</Label>
          <Input placeholder="mis. kantor-cabang" className="w-full px-3 py-2.5 text-sm" />
          <FieldError />
        </TextField>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.description}
          onChange={(v) => update("description", v)}
        >
          <Label className="text-sm font-medium text-input-label-text">
            Deskripsi (opsional)
          </Label>
          <Input placeholder="Catatan" className="w-full px-3 py-2.5 text-sm" />
          <FieldError />
        </TextField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            className="w-full flex-col gap-1.5"
            value={form.dns}
            onChange={(v) => update("dns", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">
              DNS (opsional)
            </Label>
            <Input placeholder="mis. 1.1.1.1" className="w-full px-3 py-2.5 text-sm" />
            <FieldError />
          </TextField>

          <TextField
            className="w-full flex-col gap-1.5"
            value={form.allowedIps}
            onChange={(v) => update("allowedIps", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">
              Allowed IPs (opsional)
            </Label>
            <Input placeholder="mis. 0.0.0.0/0" className="w-full px-3 py-2.5 text-sm" />
            <FieldError />
          </TextField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            value={form.keyMode}
            onChange={(value) => update("keyMode", value as "auto" | "external")}
          >
            <SelectLabel>Mode Kunci</SelectLabel>
            <SelectTrigger>
              <SelectValue />
              <SelectIndicator />
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="auto">Auto (generate)</SelectItem>
              <SelectItem id="external">External (import pubkey)</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={form.forward}
            onChange={(value) => update("forward", value as ForwardMode)}
          >
            <SelectLabel>Port Forwarding</SelectLabel>
            <SelectTrigger>
              <SelectValue />
              <SelectIndicator />
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="skip">Skip</SelectItem>
              <SelectItem id="standard">Standard</SelectItem>
              <SelectItem id="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {form.keyMode === "external" && (
          <TextField
            className="w-full flex-col gap-1.5"
            value={form.pubkey}
            onChange={(v) => update("pubkey", v)}
            required
          >
            <Label className="text-sm font-medium text-input-label-text">
              Public Key Peer
            </Label>
            <Input
              placeholder="Base64 public key"
              className="w-full px-3 py-2.5 font-mono text-sm"
            />
            <FieldError />
          </TextField>
        )}

        {form.forward === "custom" && (
          <TextField
            className="w-full flex-col gap-1.5"
            value={form.ports}
            onChange={(v) => update("ports", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">
              Port Custom
            </Label>
            <Input
              placeholder="mis. 80,443:web,8080"
              className="w-full px-3 py-2.5 text-sm"
            />
            <FieldError />
          </TextField>
        )}
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
