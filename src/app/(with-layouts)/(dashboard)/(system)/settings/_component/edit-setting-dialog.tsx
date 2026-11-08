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
import { TextField } from "@/components/tailgrids/core/text-field";
import type { SystemSetting, UpdateSettingInput } from "@/services/api/settings";
import { useState } from "react";

export default function EditSettingDialog({
  setting,
  onClose,
  busy,
  onSubmit,
}: {
  setting: SystemSetting;
  onClose: () => void;
  busy: boolean;
  onSubmit: (input: UpdateSettingInput) => void;
}) {
  const [form, setForm] = useState(() => ({
    settingValue: setting.settingValue ?? "",
    description: setting.description ?? "",
  }));

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleConfirm = () =>
    onSubmit({
      settingValue: form.settingValue.trim(),
      description: form.description.trim(),
    });

  return (
    <Dialog isOpen onOpenChange={(next) => !next && onClose()}>
      <DialogHeader>
        <DialogTitle>Ubah Pengaturan</DialogTitle>
      </DialogHeader>

      <DialogBody className="space-y-4">
        <div className="rounded-lg bg-background-gray-secondary px-3 py-2 font-mono text-sm text-text-secondary">
          {setting.settingKey}
        </div>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.settingValue}
          onChange={(v) => update("settingValue", v)}
          required
        >
          <Label className="text-sm font-medium text-input-label-text">Nilai</Label>
          <Input placeholder="Nilai pengaturan" className="w-full px-3 py-2.5 text-sm" />
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
          <Input placeholder="Deskripsi pengaturan" className="w-full px-3 py-2.5 text-sm" />
          <FieldError />
        </TextField>
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
