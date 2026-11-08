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
import type { CreateL2tpUserInput, ForwardMode } from "@/services/api/vpn";
import { useState } from "react";

const INITIAL = {
  username: "",
  password: "",
  ip: "",
  forward: "standard" as ForwardMode,
  ports: "",
  description: "",
};

export default function CreateL2tpDialog({
  open,
  onOpenChange,
  busy,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  busy: boolean;
  onSubmit: (input: CreateL2tpUserInput) => void;
}) {
  const [form, setForm] = useState(INITIAL);

  const reset = () => setForm(INITIAL);

  const update = <K extends keyof typeof INITIAL>(
    key: K,
    value: (typeof INITIAL)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleConfirm = () => {
    const payload: CreateL2tpUserInput = {
      username: form.username.trim(),
      password: form.password,
      forward: form.forward,
    };
    if (form.ip.trim()) payload.ip = form.ip.trim();
    if (form.forward === "custom" && form.ports.trim()) payload.ports = form.ports.trim();
    if (form.description.trim()) payload.description = form.description.trim();
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
        <DialogTitle>Tambah L2TP User</DialogTitle>
      </DialogHeader>

      <DialogBody className="space-y-4">
        <TextField
          className="w-full flex-col gap-1.5"
          value={form.username}
          onChange={(v) => update("username", v)}
          required
        >
          <Label className="text-sm font-medium text-input-label-text">Username</Label>
          <Input placeholder="mis. pelanggan01" className="w-full px-3 py-2.5 text-sm" />
          <FieldError />
        </TextField>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.password}
          onChange={(v) => update("password", v)}
          required
        >
          <Label className="text-sm font-medium text-input-label-text">Password</Label>
          <Input placeholder="Minimal 6 karakter" className="w-full px-3 py-2.5 text-sm" />
          <FieldError />
        </TextField>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.ip}
          onChange={(v) => update("ip", v)}
        >
          <Label className="text-sm font-medium text-input-label-text">
            IP VPN (opsional)
          </Label>
          <Input placeholder="mis. 172.16.101.20" className="w-full px-3 py-2.5 text-sm" />
          <FieldError />
        </TextField>

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
            <SelectItem id="skip">Skip (tanpa forward)</SelectItem>
            <SelectItem id="standard">Standard</SelectItem>
            <SelectItem id="custom">Custom</SelectItem>
          </SelectContent>
        </Select>

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

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.description}
          onChange={(v) => update("description", v)}
        >
          <Label className="text-sm font-medium text-input-label-text">
            Deskripsi (opsional)
          </Label>
          <Input placeholder="Catatan pelanggan" className="w-full px-3 py-2.5 text-sm" />
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
