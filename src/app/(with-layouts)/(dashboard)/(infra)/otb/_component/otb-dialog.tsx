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
import type { CreateOtbInput, Otb, Pop } from "@/services/api/infra";
import { useState } from "react";
import { toast } from "sonner";

const EMPTY = {
  popId: "",
  otbName: "",
  cableType: "",
  direction: "",
};

function buildInitial(target: Otb | null): typeof EMPTY {
  if (!target) return EMPTY;
  return {
    popId: String(target.popId),
    otbName: target.otbName,
    cableType: target.cableType ?? "",
    direction: target.direction ?? "",
  };
}

export default function OtbDialog({
  open,
  onOpenChange,
  busy,
  target,
  pops,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  busy: boolean;
  target: Otb | null;
  pops: Pop[];
  onSubmit: (input: CreateOtbInput) => void;
}) {
  const [form, setForm] = useState(() => buildInitial(target));

  const update = <K extends keyof typeof EMPTY>(
    key: K,
    value: (typeof EMPTY)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleConfirm = () => {
    if (!form.popId) {
      toast.error("Pilih POP terlebih dahulu.");
      return;
    }
    if (!form.otbName.trim()) {
      toast.error("Nama OTB wajib diisi.");
      return;
    }
    const payload: CreateOtbInput = {
      popId: Number(form.popId),
      otbName: form.otbName.trim(),
    };
    if (form.cableType.trim()) payload.cableType = form.cableType.trim();
    if (form.direction.trim()) payload.direction = form.direction.trim();
    onSubmit(payload);
  };

  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{target ? "Edit OTB" : "Tambah OTB"}</DialogTitle>
      </DialogHeader>

      <DialogBody className="space-y-4">
        <Select value={form.popId} onChange={(value) => update("popId", value as string)}>
          <SelectLabel>POP</SelectLabel>
          <SelectTrigger>
            <SelectValue />
            <SelectIndicator />
          </SelectTrigger>
          <SelectContent>
            {pops.map((pop) => (
              <SelectItem key={pop.id} id={String(pop.id)}>
                {pop.popCode} — {pop.popName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.otbName}
          onChange={(v) => update("otbName", v)}
          required
        >
          <Label className="text-sm font-medium text-input-label-text">Nama OTB</Label>
          <Input placeholder="mis. OTB-Cengkareng-01" className="w-full px-3 py-2.5 text-sm" />
          <FieldError />
        </TextField>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.cableType}
          onChange={(v) => update("cableType", v)}
        >
          <Label className="text-sm font-medium text-input-label-text">Tipe Kabel</Label>
          <Input placeholder="mis. G655 / G652D" className="w-full px-3 py-2.5 text-sm" />
          <FieldError />
        </TextField>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.direction}
          onChange={(v) => update("direction", v)}
        >
          <Label className="text-sm font-medium text-input-label-text">Arah</Label>
          <Input placeholder="mis. Utara / Selatan" className="w-full px-3 py-2.5 text-sm" />
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
