"use client";

import ConfirmDialog from "@/components/common/confirm-dialog";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/tailgrids/core/button";
import { Card } from "@/components/tailgrids/core/card";
import { ApiError } from "@/services/api/client";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
  type AppUser,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/services/api/users";
import { Plus, RefreshCircle1Clockwise } from "@tailgrids/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import CreateUserDialog from "./create-user-dialog";
import EditUserDialog from "./edit-user-dialog";
import UserTable from "./user-table";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AppUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: listUsers,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["users"] });

  const createMutation = useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: () => {
      toast.success("User berhasil dibuat.");
      setCreateOpen(false);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal membuat user."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateUserInput }) =>
      updateUser(id, input),
    onSuccess: () => {
      toast.success("User berhasil diperbarui.");
      setEditTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal memperbarui user."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      toast.success("User dihapus.");
      setDeleteTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal menghapus user."),
  });

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        title="Users"
        description="Kelola akun pengguna portal dan hak aksesnya (Super Admin, Teknisi)."
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
              Tambah User
            </Button>
          </div>
        }
      />

      <div className="px-2 lg:px-5">
        <Card className="p-0">
          <div className="overflow-hidden">
            <UserTable
              users={data ?? []}
              isLoading={isLoading}
              onEdit={(user) => setEditTarget(user)}
              onDelete={(user) => setDeleteTarget(user)}
            />
          </div>
        </Card>
      </div>

      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        busy={createMutation.isPending}
        onSubmit={(input) => createMutation.mutate(input)}
      />

      {editTarget && (
        <EditUserDialog
          user={editTarget}
          onClose={() => setEditTarget(null)}
          busy={updateMutation.isPending}
          onSubmit={(input) => updateMutation.mutate({ id: editTarget.id, input })}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus User"
        description={`Hapus user "${deleteTarget?.fullName}"? Tindakan ini tidak dapat dibatalkan.`}
        busy={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
