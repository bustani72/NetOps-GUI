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
import { TASK_CATEGORY_LABELS, toDateInputValue } from "@/constants/netops";
import type { Client } from "@/services/api/infra";
import type { Pop } from "@/services/api/infra";
import type {
  CreateTaskInput,
  DailyTaskItem,
  TaskCategory,
  UpdateTaskInput,
} from "@/services/api/tasks";
import { toast } from "sonner";
import { useState } from "react";

const CATEGORY_OPTIONS: TaskCategory[] = [
  "maintenance",
  "installation",
  "troubleshooting",
  "vpn_config",
];

export default function TaskFormDialog({
  open,
  onOpenChange,
  mode,
  initial,
  pops,
  clients,
  busy,
  onCreate,
  onUpdate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initial?: DailyTaskItem | null;
  pops: Pop[];
  clients: Client[];
  busy: boolean;
  onCreate: (input: CreateTaskInput) => void;
  onUpdate: (input: UpdateTaskInput) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<TaskCategory>(initial?.category ?? "maintenance");
  const [taskDate, setTaskDate] = useState(
    initial?.taskDate ? toDateInputValue(initial.taskDate) : toDateInputValue(new Date()),
  );
  const [popId, setPopId] = useState(initial?.popId ? String(initial.popId) : "");
  const [clientId, setClientId] = useState(initial?.clientId ? String(initial.clientId) : "");
  const [description, setDescription] = useState(initial?.description ?? "");

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Judul tugas wajib diisi.");
      return;
    }

    if (mode === "create") {
      const payload: CreateTaskInput = {
        title: title.trim(),
        category,
        taskDate,
      };
      if (description.trim()) payload.description = description.trim();
      if (popId) payload.popId = Number(popId);
      if (clientId) payload.clientId = Number(clientId);
      onCreate(payload);
      return;
    }

    onUpdate({
      title: title.trim(),
      description: description.trim() ? description.trim() : undefined,
    });
  };

  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{mode === "create" ? "Tambah Tugas" : "Ubah Tugas"}</DialogTitle>
      </DialogHeader>

      <DialogBody className="space-y-4">
        <TextField
          className="w-full flex-col gap-1.5"
          value={title}
          onChange={setTitle}
          required
        >
          <Label className="text-sm font-medium text-input-label-text">Judul</Label>
          <Input placeholder="mis. Perawatan OTB POP Kota" className="w-full px-3 py-2.5 text-sm" />
          <FieldError />
        </TextField>

        {mode === "create" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select value={category} onChange={(v) => setCategory(v as TaskCategory)}>
              <SelectLabel>Kategori</SelectLabel>
              <SelectTrigger>
                <SelectValue />
                <SelectIndicator />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option} id={option}>
                    {TASK_CATEGORY_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <TextField
              className="w-full flex-col gap-1.5"
              value={taskDate}
              onChange={setTaskDate}
              required
            >
              <Label className="text-sm font-medium text-input-label-text">Tanggal</Label>
              <Input type="date" className="w-full px-3 py-2.5 text-sm" />
              <FieldError />
            </TextField>
          </div>
        )}

        {mode === "create" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select value={popId} onChange={(v) => setPopId(String(v))}>
              <SelectLabel>POP (opsional)</SelectLabel>
              <SelectTrigger>
                <SelectValue />
                <SelectIndicator />
              </SelectTrigger>
              <SelectContent>
                <SelectItem id="">Tidak ada</SelectItem>
                {pops.map((pop) => (
                  <SelectItem key={pop.id} id={String(pop.id)}>
                    {pop.popName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={clientId} onChange={(v) => setClientId(String(v))}>
              <SelectLabel>Klien (opsional)</SelectLabel>
              <SelectTrigger>
                <SelectValue />
                <SelectIndicator />
              </SelectTrigger>
              <SelectContent>
                <SelectItem id="">Tidak ada</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} id={String(client.id)}>
                    {client.clientName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <TextField
          className="w-full flex-col gap-1.5"
          value={description}
          onChange={setDescription}
        >
          <Label className="text-sm font-medium text-input-label-text">
            Deskripsi (opsional)
          </Label>
          <TextArea
            rows={3}
            placeholder="Detail pekerjaan"
            className="w-full text-sm"
          />
          <FieldError />
        </TextField>
      </DialogBody>

      <DialogFooter>
        <Button appearance="outline" onPress={() => onOpenChange(false)} isDisabled={busy}>
          Batal
        </Button>
        <Button onPress={handleSubmit} isDisabled={busy}>
          {busy ? "Menyimpan…" : "Simpan"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
