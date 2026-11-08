"use client";

import ConfirmDialog from "@/components/common/confirm-dialog";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/tailgrids/core/button";
import { Card } from "@/components/tailgrids/core/card";
import {
  Select,
  SelectContent,
  SelectIndicator,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/tailgrids/core/select";
import { TASK_CATEGORY_LABELS, TASK_STATUS_LABELS } from "@/constants/netops";
import { ApiError } from "@/services/api/client";
import { listClients, listPops } from "@/services/api/infra";
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
  type CreateTaskInput,
  type DailyTaskItem,
  type TaskCategory,
  type TaskStatus,
  type UpdateTaskInput,
} from "@/services/api/tasks";
import { Plus, RefreshCircle1Clockwise } from "@tailgrids/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import TaskFormDialog from "./task-form-dialog";
import TaskStats from "./task-stats";
import TaskTable from "./task-table";

const CATEGORY_OPTIONS: TaskCategory[] = [
  "maintenance",
  "installation",
  "troubleshooting",
  "vpn_config",
];
const STATUS_OPTIONS: TaskStatus[] = ["open", "in_progress", "pending", "done"];

export default function DailyTasksPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DailyTaskItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DailyTaskItem | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const filters = {
    status: statusFilter ? (statusFilter as TaskStatus) : undefined,
    category: categoryFilter ? (categoryFilter as TaskCategory) : undefined,
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => listTasks(filters),
  });

  const allTasksQuery = useQuery({
    queryKey: ["tasks", {}],
    queryFn: () => listTasks({}),
  });

  const popsQuery = useQuery({ queryKey: ["pops"], queryFn: listPops });
  const clientsQuery = useQuery({ queryKey: ["clients", {}], queryFn: () => listClients() });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["tasks"] });

  const createMutation = useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: () => {
      toast.success("Tugas berhasil dibuat.");
      setCreateOpen(false);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal membuat tugas."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTaskInput }) =>
      updateTask(id, input),
    onSuccess: () => {
      toast.success("Tugas diperbarui.");
      setEditTarget(null);
      setUpdatingId(null);
      invalidate();
    },
    onError: (err) => {
      setUpdatingId(null);
      toast.error(err instanceof ApiError ? err.message : "Gagal memperbarui tugas.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => {
      toast.success("Tugas dihapus.");
      setDeleteTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal menghapus tugas."),
  });

  const handleStatusChange = (task: DailyTaskItem, status: TaskStatus) => {
    if (status === task.status) return;
    setUpdatingId(task.id);
    updateMutation.mutate({ id: task.id, input: { status } });
  };

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        title="Daily Tasks"
        description="Catat dan pantau pekerjaan harian lapangan, instalasi, dan konfigurasi VPN."
        action={
          <div className="flex items-center gap-2">
            <Button
              appearance="outline"
              size="md"
              isDisabled={isFetching}
              onPress={() => refetch()}
            >
              <RefreshCircle1Clockwise />
              Refresh
            </Button>
            <Button size="md" onPress={() => setCreateOpen(true)}>
              <Plus />
              Tambah Tugas
            </Button>
          </div>
        }
      />

      <div className="space-y-5 px-2 lg:px-5">
        <TaskStats tasks={allTasksQuery.data ?? []} />

        <Card className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(String(value))}
              className="w-48"
            >
              <SelectLabel>Filter Status</SelectLabel>
              <SelectTrigger>
                <SelectValue />
                <SelectIndicator />
              </SelectTrigger>
              <SelectContent>
                <SelectItem id="">Semua status</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} id={status}>
                    {TASK_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={categoryFilter}
              onChange={(value) => setCategoryFilter(String(value))}
              className="w-48"
            >
              <SelectLabel>Filter Kategori</SelectLabel>
              <SelectTrigger>
                <SelectValue />
                <SelectIndicator />
              </SelectTrigger>
              <SelectContent>
                <SelectItem id="">Semua kategori</SelectItem>
                {CATEGORY_OPTIONS.map((category) => (
                  <SelectItem key={category} id={category}>
                    {TASK_CATEGORY_LABELS[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="p-0">
          <div className="overflow-hidden">
            <TaskTable
              tasks={data ?? []}
              isLoading={isLoading}
              updatingId={updatingId}
              onStatusChange={handleStatusChange}
              onEdit={(task) => setEditTarget(task)}
              onDelete={(task) => setDeleteTarget(task)}
            />
          </div>
        </Card>
      </div>

      <TaskFormDialog
        key={createOpen ? "create-open" : "create-closed"}
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        pops={popsQuery.data ?? []}
        clients={clientsQuery.data ?? []}
        busy={createMutation.isPending}
        onCreate={(input) => createMutation.mutate(input)}
        onUpdate={() => {}}
      />

      <TaskFormDialog
        key={editTarget ? `edit-${editTarget.id}` : "edit-closed"}
        open={Boolean(editTarget)}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        mode="edit"
        initial={editTarget}
        pops={popsQuery.data ?? []}
        clients={clientsQuery.data ?? []}
        busy={updateMutation.isPending}
        onCreate={() => {}}
        onUpdate={(input) => editTarget && updateMutation.mutate({ id: editTarget.id, input })}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus Tugas"
        description={`Hapus tugas "${deleteTarget?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        busy={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
