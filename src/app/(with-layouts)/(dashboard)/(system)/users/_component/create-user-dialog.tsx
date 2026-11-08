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
import type { AppRole, CreateUserInput } from "@/services/api/users";
import { useState } from "react";

const INITIAL = {
  fullName: "",
  email: "",
  phoneWa: "",
  password: "",
  role: "technician" as AppRole,
};

export default function CreateUserDialog({
  open,
  onOpenChange,
  busy,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  busy: boolean;
  onSubmit: (input: CreateUserInput) => void;
}) {
  const [form, setForm] = useState(INITIAL);

  const reset = () => setForm(INITIAL);

  const update = <K extends keyof typeof INITIAL>(
    key: K,
    value: (typeof INITIAL)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleConfirm = () => {
    const payload: CreateUserInput = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    };
    if (form.phoneWa.trim()) payload.phoneWa = form.phoneWa.trim();
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
        <DialogTitle>Tambah User</DialogTitle>
      </DialogHeader>

      <DialogBody className="space-y-4">
        <TextField
          className="w-full flex-col gap-1.5"
          value={form.fullName}
          onChange={(v) => update("fullName", v)}
          required
        >
          <Label className="text-sm font-medium text-input-label-text">Nama Lengkap</Label>
          <Input placeholder="mis. Budi Santoso" className="w-full px-3 py-2.5 text-sm" />
          <FieldError />
        </TextField>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.email}
          onChange={(v) => update("email", v)}
          required
        >
          <Label className="text-sm font-medium text-input-label-text">Email</Label>
          <Input
            type="email"
            placeholder="mis. budi@example.com"
            className="w-full px-3 py-2.5 text-sm"
          />
          <FieldError />
        </TextField>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.phoneWa}
          onChange={(v) => update("phoneWa", v)}
        >
          <Label className="text-sm font-medium text-input-label-text">
            No. WhatsApp (opsional)
          </Label>
          <Input
            type="tel"
            placeholder="mis. 08123456789"
            className="w-full px-3 py-2.5 text-sm"
          />
          <FieldError />
        </TextField>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.password}
          onChange={(v) => update("password", v)}
          required
        >
          <Label className="text-sm font-medium text-input-label-text">Password</Label>
          <Input
            type="password"
            minLength={6}
            placeholder="Minimal 6 karakter"
            className="w-full px-3 py-2.5 text-sm"
          />
          <FieldError />
        </TextField>

        <Select value={form.role} onChange={(value) => update("role", value as AppRole)}>
          <SelectLabel>Role</SelectLabel>
          <SelectTrigger>
            <SelectValue />
            <SelectIndicator />
          </SelectTrigger>
          <SelectContent>
            <SelectItem id="super_admin">Super Admin</SelectItem>
            <SelectItem id="technician">Teknisi</SelectItem>
          </SelectContent>
        </Select>
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
