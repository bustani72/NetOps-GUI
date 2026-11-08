"use client";

import { Badge } from "@/components/tailgrids/core/badge";
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
import type {
  ServerRecord,
  SetupServerInput,
  SetupServerResult,
} from "@/services/api/servers";
import { useState } from "react";

export default function SetupDialog({
  server,
  onClose,
  busy,
  result,
  onSubmit,
}: {
  server: ServerRecord;
  onClose: () => void;
  busy: boolean;
  result: SetupServerResult | null;
  onSubmit: (input: SetupServerInput) => void;
}) {
  const [form, setForm] = useState(() => ({
    mode: "full" as "full" | "prepare",
    vpnManagerHome: server.vpnManagerHome ?? "/opt/netops/vpn-manager",
    vpnManagerRepoUrl: "",
    agentHost: server.host,
    agentPort: String(server.agentPort ?? 9099),
  }));

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleRun = () => {
    const payload: SetupServerInput = {
      vpnManagerHome: form.vpnManagerHome.trim() || undefined,
      agentHost: form.agentHost.trim() || undefined,
      agentPort: Number(form.agentPort) || undefined,
      prepareOnly: form.mode === "prepare",
    };
    if (form.vpnManagerRepoUrl.trim()) payload.vpnManagerRepoUrl = form.vpnManagerRepoUrl.trim();
    onSubmit(payload);
  };

  return (
    <Dialog isOpen onOpenChange={(next) => !next && onClose()}>
      <DialogHeader>
        <DialogTitle>Setup Server: {server.name}</DialogTitle>
      </DialogHeader>

      <DialogBody className="max-h-[70vh] space-y-4 overflow-y-auto">
        <p className="text-sm text-text-tertiary">
          Portal akan terhubung via SSH ke{" "}
          <span className="font-medium text-text-secondary">
            {server.sshUser}@{server.host}:{server.sshPort}
          </span>{" "}
          lalu memasang dan menjalankan NetOps Agent pada server tersebut.
        </p>

        <Select
          value={form.mode}
          onChange={(value) => update("mode", value as "full" | "prepare")}
        >
          <SelectLabel>Mode Setup</SelectLabel>
          <SelectTrigger>
            <SelectValue />
            <SelectIndicator />
          </SelectTrigger>
          <SelectContent>
            <SelectItem id="full">Pasang &amp; jalankan agent (systemd)</SelectItem>
            <SelectItem id="prepare">Siapkan file saja (tanpa install)</SelectItem>
          </SelectContent>
        </Select>

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
          value={form.vpnManagerRepoUrl}
          onChange={(v) => update("vpnManagerRepoUrl", v)}
        >
          <Label className="text-sm font-medium text-input-label-text">
            URL Repo vpn-manager (kosongkan bila sudah ada)
          </Label>
          <Input
            placeholder="https://github.com/…/vpn-manager.git"
            className="w-full px-3 py-2.5 text-sm"
          />
          <FieldError />
        </TextField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            className="w-full flex-col gap-1.5"
            value={form.agentHost}
            onChange={(v) => update("agentHost", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">Bind Host Agent</Label>
            <Input placeholder="0.0.0.0" className="w-full px-3 py-2.5 text-sm" />
            <FieldError />
          </TextField>

          <TextField
            className="w-full flex-col gap-1.5"
            value={form.agentPort}
            onChange={(v) => update("agentPort", v)}
          >
            <Label className="text-sm font-medium text-input-label-text">Bind Port Agent</Label>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="9099"
              className="w-full px-3 py-2.5 text-sm"
            />
            <FieldError />
          </TextField>
        </div>

        {result && (
          <div className="space-y-3 rounded-lg border border-card-border p-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-primary">Hasil Setup</span>
              <Badge color={result.ok ? "success" : "error"} size="sm">
                {result.ok ? "Berhasil" : "Gagal"}
              </Badge>
              {result.prepared && (
                <Badge color="warning" size="sm">
                  File disiapkan
                </Badge>
              )}
            </div>

            <p className="text-sm text-text-secondary">{result.message}</p>

            {result.steps?.length > 0 && (
              <ul className="space-y-1.5">
                {result.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span
                      className={
                        step.ok
                          ? "mt-0.5 text-badge-success-text"
                          : "mt-0.5 text-badge-error-text"
                      }
                    >
                      {step.ok ? "✓" : "✕"}
                    </span>
                    <span className="text-text-secondary">
                      {step.step}
                      {step.message ? ` — ${step.message}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {result.agentToken && (
              <div className="text-xs text-text-tertiary">
                Token agent tersimpan otomatis ke database.
              </div>
            )}

            {result.installOutput && (
              <pre className="max-h-64 overflow-auto rounded-md bg-background-gray-primary p-3 font-mono text-xs text-text-secondary">
                {result.installOutput}
              </pre>
            )}
          </div>
        )}
      </DialogBody>

      <DialogFooter>
        <Button appearance="outline" onPress={onClose} isDisabled={busy}>
          Tutup
        </Button>
        <Button onPress={handleRun} isDisabled={busy}>
          {busy ? "Memproses…" : result ? "Jalankan Ulang" : "Jalankan Setup"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
