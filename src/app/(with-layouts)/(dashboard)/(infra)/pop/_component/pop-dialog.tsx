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
import { TextArea } from "@/components/tailgrids/core/text-area";
import { TextField } from "@/components/tailgrids/core/text-field";
import type { CreatePopInput, Pop } from "@/services/api/infra";
import { useState } from "react";

const EMPTY = {
  popCode: "",
  popName: "",
  address: "",
  coordinates: "",
  deviceNotes: "",
};

function buildInitial(target: Pop | null): typeof EMPTY {
  if (!target) return EMPTY;
  return {
    popCode: target.popCode,
    popName: target.popName,
    address: target.address ?? "",
    coordinates: target.coordinates ?? "",
    deviceNotes: target.deviceNotes ?? "",
  };
}

export default function PopDialog({
  open,
  onOpenChange,
  busy,
  target,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  busy: boolean;
  target: Pop | null;
  onSubmit: (input: CreatePopInput) => void;
}) {
  const [form, setForm] = useState(() => buildInitial(target));

  const update = <K extends keyof typeof EMPTY>(
    key: K,
    value: (typeof EMPTY)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleConfirm = () => {
    const payload: CreatePopInput = {
      popCode: form.popCode.trim(),
      popName: form.popName.trim(),
    };
    if (form.address.trim()) payload.address = form.address.trim();
    if (form.coordinates.trim()) payload.coordinates = form.coordinates.trim();
    if (form.deviceNotes.trim()) payload.deviceNotes = form.deviceNotes.trim();
    onSubmit(payload);
  };

  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{target ? "Edit POP" : "Tambah POP"}</DialogTitle>
      </DialogHeader>

      <DialogBody className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            className="w-full flex-col gap-1.5"
            value={form.popCode}
            onChange={(v) => update("popCode", v)}
            required
          >
            <Label className="text-sm font-medium text-input-label-text">Kode POP</Label>
            <Input placeholder="mis. POP-JKT-01" className="w-full px-3 py-2.5 text-sm" />
            <FieldError />
          </TextField>

          <TextField
            className="w-full flex-col gap-1.5"
            value={form.popName}
            onChange={(v) => update("popName", v)}
            required
          >
            <Label className="text-sm font-medium text-input-label-text">Nama POP</Label>
            <Input placeholder="mis. POP Jakarta Pusat" className="w-full px-3 py-2.5 text-sm" />
            <FieldError />
          </TextField>
        </div>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.address}
          onChange={(v) => update("address", v)}
        >
          <Label className="text-sm font-medium text-input-label-text">Alamat</Label>
          <Input placeholder="Alamat lokasi POP" className="w-full px-3 py-2.5 text-sm" />
          <FieldError />
        </TextField>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.coordinates}
          onChange={(v) => update("coordinates", v)}
        >
          <Label className="text-sm font-medium text-input-label-text">Koordinat</Label>
          <Input
            placeholder="mis. -6.200000, 106.816666"
            className="w-full px-3 py-2.5 text-sm"
          />
          <FieldError />
        </TextField>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.deviceNotes}
          onChange={(v) => update("deviceNotes", v)}
        >
          <Label className="text-sm font-medium text-input-label-text">
            Catatan Perangkat
          </Label>
          <TextArea
            placeholder="Catatan perangkat pada POP ini"
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
