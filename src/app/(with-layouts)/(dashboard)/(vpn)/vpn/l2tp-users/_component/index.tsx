"use client";

import ConfirmDialog from "@/components/common/confirm-dialog";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/tailgrids/core/button";
import { Card } from "@/components/tailgrids/core/card";
import { ApiError } from "@/services/api/client";
import {
  createL2tpUser,
  deleteL2tpUser,
  listL2tpUsers,
  type CreateL2tpUserInput,
  type L2tpUser,
} from "@/services/api/vpn";
import { Plus, RefreshCircle1Clockwise } from "@tailgrids/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import CreateL2tpDialog from "./create-l2tp-dialog";
import L2tpTable from "./l2tp-table";

export default function L2tpUsersPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [target, setTarget] = useState<L2tpUser | null>(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["vpn-l2tp-users"],
    queryFn: listL2tpUsers,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["vpn-l2tp-users"] });

  const createMutation = useMutation({
    mutationFn: (input: CreateL2tpUserInput) => createL2tpUser(input),
    onSuccess: () => {
      toast.success("User L2TP berhasil dibuat.");
      setCreateOpen(false);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal membuat user L2TP."),
  });

  const deleteMutation = useMutation({
    mutationFn: (username: string) => deleteL2tpUser(username),
    onSuccess: () => {
      toast.success("User L2TP dihapus.");
      setTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal menghapus user L2TP."),
  });

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        title="L2TP Users"
        description="Kelola akun VPN L2TP pada server remote."
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
            <L2tpTable
              users={data ?? []}
              isLoading={isLoading}
              onDelete={(user) => setTarget(user)}
            />
          </div>
        </Card>
      </div>

      <CreateL2tpDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        busy={createMutation.isPending}
        onSubmit={(input) => createMutation.mutate(input)}
      />

      <ConfirmDialog
        open={Boolean(target)}
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
        title="Hapus User L2TP"
        description={`Hapus user "${target?.username}" dari server VPN? Tindakan ini tidak dapat dibatalkan.`}
        busy={deleteMutation.isPending}
        onConfirm={() => target && deleteMutation.mutate(target.username)}
      />
    </div>
  );
}
