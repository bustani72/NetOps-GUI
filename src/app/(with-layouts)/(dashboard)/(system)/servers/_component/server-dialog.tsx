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
import type {
  CreateServerInput,
  ServerAuthType,
  ServerRecord,
} from "@/services/api/servers";
import { useState } from "react";

function initialForm(server?: ServerRecord) {
  return {
    name: server?.name ?? "",
    host: server?.host ?? "",
    sshPort: String(server?.sshPort ?? 22),
    sshUser: server?.sshUser ?? "root",
    authType: (server?.authType ?? "password") as ServerAuthType,
    password: "",
    privateKey: "",
    passphrase: "",
    agentPort: String(server?.agentPort ?? 9099),
    agentToken: "",
    vpnManagerHome: server?.vpnManagerHome ?? "/opt/netops/vpn-manager",
    description: server?.description ?? "",
  };
}

export default function ServerDialog({
  open,
  onOpenChange,
  server,
  busy,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server?: ServerRecord;
  busy: boolean;
  onSubmit: (input: CreateServerInput) => void;
}) {
  const isEdit = Boolean(server);
  const [form, setForm] = useState(() => initialForm(server));

  const reset = () => setForm(initialForm(server));

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleConfirm = () => {
    const payload: CreateServerInput = {
      name: form.name.trim(),
      host: form.host.trim(),
      sshPort: Number(form.sshPort) || 22,
      sshUser: form.sshUser.trim() || "root",
      authType: form.authType,
      agentPort: Number(form.agentPort) || 9099,
    };

    if (form.authType === "password") {
      if (form.password) payload.password = form.password;
    } else {
      if (form.privateKey) payload.privateKey = form.privateKey;
      if (form.passphrase) payload.passphrase = form.passphrase;
    }

    if (form.agentToken.trim()) payload.agentToken = form.agentToken.trim();
    if (form.vpnManagerHome.trim()) payload.vpnManagerHome = form.vpnManagerHome.trim();
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
        <DialogTitle>{isEdit ? "Ubah Server" : "Tambah Server"}</DialogTitle>
      </DialogHeader>

      <DialogBody className="max-h-[70vh] space-y-4 overflow-y-auto">
        <TextField
          className="w-full flex-col gap-1.5"
          value={form.name}
          onChange={(v) => update("name", v)}
          required
        >
          <Label className="text-sm font-medium text-input-label-text">Nama Server</Label>
          <Input placeholder="mis. VPN-Jakarta-01" className="w-full px-3 py-2.5 text-sm" />
          <FieldError />
        </TextField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            className="w-full flex-col gap-1.5"
            value={form.host}
            onChange={(v) => update("host", v)}
            required
          >
            <Label className="text-sm font-medium text-input-label-text">Host / IP</Label>
            <Input placeholder="mis. 172.100.100.252" className="w-full px-3 py-2.5 text-sm" />
            <FieldError />
          </TextField>

          <TextField
            className="w-full flex-col gap-1.5"
            value={form.sshPort}
            onChange={(v) => update("sshPort", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">Port SSH</Label>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="22"
              className="w-full px-3 py-2.5 text-sm"
            />
            <FieldError />
          </TextField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            className="w-full flex-col gap-1.5"
            value={form.sshUser}
            onChange={(v) => update("sshUser", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">User SSH</Label>
            <Input placeholder="root" className="w-full px-3 py-2.5 text-sm" />
            <FieldError />
          </TextField>

          <Select
            value={form.authType}
            onChange={(value) => update("authType", value as ServerAuthType)}
          >
            <SelectLabel>Metode Autentikasi</SelectLabel>
            <SelectTrigger>
              <SelectValue />
              <SelectIndicator />
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="password">Password</SelectItem>
              <SelectItem id="key">SSH Private Key</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {form.authType === "password" ? (
          <TextField
            className="w-full flex-col gap-1.5"
            value={form.password}
            onChange={(v) => update("password", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">
              {isEdit ? "Password SSH (kosongkan bila tidak diubah)" : "Password SSH"}
            </Label>
            <Input
              type="password"
              placeholder={isEdit ? "••••••••" : "Password SSH"}
              className="w-full px-3 py-2.5 text-sm"
            />
            <FieldError />
          </TextField>
        ) : (
          <TextField
            className="w-full flex-col gap-1.5"
            value={form.privateKey}
            onChange={(v) => update("privateKey", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">
              {isEdit ? "Private Key (kosongkan bila tidak diubah)" : "Private Key (PEM)"}
            </Label>
            <TextArea
              rows={5}
              placeholder="-----BEGIN OPENSSH PRIVATE KEY-----"
              className="font-mono text-xs"
            />
            <FieldError />
          </TextField>
        )}

        {form.authType === "key" && (
          <TextField
            className="w-full flex-col gap-1.5"
            value={form.passphrase}
            onChange={(v) => update("passphrase", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">
              Passphrase (opsional)
            </Label>
            <Input
              type="password"
              placeholder="Passphrase private key"
              className="w-full px-3 py-2.5 text-sm"
            />
            <FieldError />
          </TextField>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            className="w-full flex-col gap-1.5"
            value={form.agentPort}
            onChange={(v) => update("agentPort", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">Port Agent</Label>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="9099"
              className="w-full px-3 py-2.5 text-sm"
            />
            <FieldError />
          </TextField>

          <TextField
            className="w-full flex-col gap-1.5"
            value={form.agentToken}
            onChange={(v) => update("agentToken", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">
              Token Agent (opsional)
            </Label>
            <Input
              type="password"
              placeholder={server?.hasAgentToken ? "Sudah tersimpan" : "Token X-Agent-Token"}
              className="w-full px-3 py-2.5 text-sm"
            />
            <FieldError />
          </TextField>
        </div>

        <TextField
          className="w-full flex-col gap-1.5"
          value={form.vpnManagerHome}
          onChange={(v) => update("vpnManagerHome", v)}
        >
          <Label className="text-sm font-medium text-input-label-text">
            Lokasi vpn-manager di server
          </Label>
          <Input placeholder="/opt/netops/vpn-manager" className="w-full px-3 py-2.5 text-sm" />
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
          <TextArea rows={2} placeholder="Catatan tentang server ini" />
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
