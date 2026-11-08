"use client";

import ConfirmDialog from "@/components/common/confirm-dialog";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/tailgrids/core/button";
import { Card } from "@/components/tailgrids/core/card";
import { ApiError } from "@/services/api/client";
import {
  createForward,
  deleteForward,
  listForwards,
  restartForwards,
  type CreateForwardInput,
  type PortForward,
} from "@/services/api/vpn";
import { Plus, RefreshCircle1Clockwise } from "@tailgrids/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import CreateForwardDialog from "./create-forward-dialog";
import ForwardTable from "./forward-table";

export default function PortForwardsPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [target, setTarget] = useState<PortForward | null>(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["vpn-forwards"],
    queryFn: listForwards,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["vpn-forwards"] });

  const createMutation = useMutation({
    mutationFn: (input: CreateForwardInput) => createForward(input),
    onSuccess: () => {
      toast.success("Port forward berhasil dibuat.");
      setCreateOpen(false);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal membuat port forward."),
  });

  const deleteMutation = useMutation({
    mutationFn: (name: string) => deleteForward(name),
    onSuccess: () => {
      toast.success("Port forward dihapus.");
      setTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal menghapus port forward."),
  });

  const restartMutation = useMutation({
    mutationFn: () => restartForwards(),
    onSuccess: () => {
      toast.success("Layanan port forwarding di-restart.");
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal restart port forwarding."),
  });

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        title="Port Forwards"
        description="Kelola penerusan port publik ke klien VPN pada server remote."
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
            <Button
              appearance="outline"
              size="md"
              isDisabled={restartMutation.isPending}
              onPress={() => restartMutation.mutate()}
            >
              Restart Service
            </Button>
            <Button size="md" onPress={() => setCreateOpen(true)}>
              <Plus />
              Tambah Forward
            </Button>
          </div>
        }
      />

      <div className="px-2 lg:px-5">
        <Card className="p-0">
          <div className="overflow-hidden">
            <ForwardTable
              forwards={data ?? []}
              isLoading={isLoading}
              onDelete={(forward) => setTarget(forward)}
            />
          </div>
        </Card>
      </div>

      <CreateForwardDialog
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
        title="Hapus Port Forward"
        description={`Hapus port forward "${target?.name}" dari server VPN? Tindakan ini tidak dapat dibatalkan.`}
        busy={deleteMutation.isPending}
        onConfirm={() => target && deleteMutation.mutate(target.name)}
      />
    </div>
  );
}
