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
import type { CreateForwardInput, ForwardProtocol } from "@/services/api/vpn";
import { useState } from "react";
import { toast } from "sonner";

const INITIAL = {
  name: "",
  publicPort: "",
  destinationPort: "",
  internalIp: "",
  protocol: "tcp" as ForwardProtocol,
  description: "",
};

export default function CreateForwardDialog({
  open,
  onOpenChange,
  busy,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  busy: boolean;
  onSubmit: (input: CreateForwardInput) => void;
}) {
  const [form, setForm] = useState(INITIAL);

  const reset = () => setForm(INITIAL);

  const update = <K extends keyof typeof INITIAL>(
    key: K,
    value: (typeof INITIAL)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleConfirm = () => {
    const publicPort = Number.parseInt(form.publicPort, 10);
    const destinationPort = Number.parseInt(form.destinationPort, 10);

    if (!(publicPort >= 1 && publicPort <= 65535)) {
      toast.error("Public port tidak valid (1-65535).");
      return;
    }
    if (!(destinationPort >= 1 && destinationPort <= 65535)) {
      toast.error("Destination port tidak valid (1-65535).");
      return;
    }

    const payload: CreateForwardInput = {
      name: form.name.trim(),
      publicPort,
      destinationPort,
      internalIp: form.internalIp.trim(),
      protocol: form.protocol,
    };
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
        <DialogTitle>Tambah Port Forward</DialogTitle>
      </DialogHeader>

      <DialogBody className="space-y-4">
        <TextField
          className="w-full flex-col gap-1.5"
          value={form.name}
          onChange={(v) => update("name", v)}
          required
        >
          <Label className="text-sm font-medium text-input-label-text">Nama</Label>
          <Input placeholder="mis. rtr-pelanggan01" className="w-full px-3 py-2.5 text-sm" />
          <FieldError />
        </TextField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            className="w-full flex-col gap-1.5"
            value={form.publicPort}
            onChange={(v) => update("publicPort", v)}
            required
          >
            <Label className="text-sm font-medium text-input-label-text">
              Public Port
            </Label>
            <Input
              inputMode="numeric"
              placeholder="mis. 18888"
              className="w-full px-3 py-2.5 text-sm"
            />
            <FieldError />
          </TextField>

          <TextField
            className="w-full flex-col gap-1.5"
            value={form.destinationPort}
            onChange={(v) => update("destinationPort", v)}
            required
          >
            <Label className="text-sm font-medium text-input-label-text">
              Destination Port
            </Label>
            <Input
              inputMode="numeric"
              placeholder="mis. 8291"
              className="w-full px-3 py-2.5 text-sm"
            />
            <FieldError />
          </TextField>
        </div>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.internalIp}
          onChange={(v) => update("internalIp", v)}
          required
        >
          <Label className="text-sm font-medium text-input-label-text">
            Internal IP (IP VPN klien)
          </Label>
          <Input
            placeholder="mis. 172.16.101.10"
            className="w-full px-3 py-2.5 text-sm"
          />
          <FieldError />
        </TextField>

        <Select
          value={form.protocol}
          onChange={(value) => update("protocol", value as ForwardProtocol)}
        >
          <SelectLabel>Protokol</SelectLabel>
          <SelectTrigger>
            <SelectValue />
            <SelectIndicator />
          </SelectTrigger>
          <SelectContent>
            <SelectItem id="tcp">TCP</SelectItem>
            <SelectItem id="udp">UDP</SelectItem>
            <SelectItem id="both">TCP + UDP</SelectItem>
          </SelectContent>
        </Select>

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
