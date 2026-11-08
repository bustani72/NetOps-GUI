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
import type { AppRole, AppUser, UpdateUserInput } from "@/services/api/users";
import { useState } from "react";

export default function EditUserDialog({
  user,
  onClose,
  busy,
  onSubmit,
}: {
  user: AppUser;
  onClose: () => void;
  busy: boolean;
  onSubmit: (input: UpdateUserInput) => void;
}) {
  const [form, setForm] = useState(() => ({
    fullName: user.fullName,
    email: user.email,
    phoneWa: user.phoneWa ?? "",
    password: "",
    role: user.role,
    isActive: user.isActive,
  }));

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleConfirm = () => {
    const payload: UpdateUserInput = {
      fullName: form.fullName.trim(),
      phoneWa: form.phoneWa.trim(),
      role: form.role,
      isActive: form.isActive,
    };
    if (form.password) payload.password = form.password;
    onSubmit(payload);
  };

  return (
    <Dialog isOpen onOpenChange={(next) => !next && onClose()}>
      <DialogHeader>
        <DialogTitle>Ubah User</DialogTitle>
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
          disabled
        >
          <Label className="text-sm font-medium text-input-label-text">Email</Label>
          <Input type="email" className="w-full px-3 py-2.5 text-sm" />
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
        >
          <Label className="text-sm font-medium text-input-label-text">
            Password (opsional)
          </Label>
          <Input
            type="password"
            minLength={6}
            placeholder="Kosongkan bila tidak diubah"
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

        <Select
          value={form.isActive ? "active" : "inactive"}
          onChange={(value) => update("isActive", value === "active")}
        >
          <SelectLabel>Status</SelectLabel>
          <SelectTrigger>
            <SelectValue />
            <SelectIndicator />
          </SelectTrigger>
          <SelectContent>
            <SelectItem id="active">Aktif</SelectItem>
            <SelectItem id="inactive">Nonaktif</SelectItem>
          </SelectContent>
        </Select>
      </DialogBody>

      <DialogFooter>
        <Button appearance="outline" onPress={onClose} isDisabled={busy}>
          Batal
        </Button>
        <Button onPress={handleConfirm} isDisabled={busy}>
          {busy ? "Menyimpan…" : "Simpan"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
