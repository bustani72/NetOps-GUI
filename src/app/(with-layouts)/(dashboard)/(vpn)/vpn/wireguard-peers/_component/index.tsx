"use client";

import ConfirmDialog from "@/components/common/confirm-dialog";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/tailgrids/core/button";
import { Card } from "@/components/tailgrids/core/card";
import { ApiError } from "@/services/api/client";
import {
  createWgPeer,
  deleteWgPeer,
  getWgPeerConfig,
  listWgPeers,
  type CreateWgPeerInput,
  type WgPeer,
} from "@/services/api/vpn";
import { Plus, RefreshCircle1Clockwise } from "@tailgrids/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import CreateWgDialog from "./create-wg-dialog";
import WgConfigDialog from "./wg-config-dialog";
import WgTable from "./wg-table";

export default function WireGuardPeersPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<WgPeer | null>(null);
  const [configTarget, setConfigTarget] = useState<WgPeer | null>(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["vpn-wg-peers"],
    queryFn: listWgPeers,
  });

  const configQuery = useQuery({
    queryKey: ["vpn-wg-config", configTarget?.name],
    queryFn: () => getWgPeerConfig(configTarget!.name),
    enabled: Boolean(configTarget),
    retry: false,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["vpn-wg-peers"] });

  const createMutation = useMutation({
    mutationFn: (input: CreateWgPeerInput) => createWgPeer(input),
    onSuccess: () => {
      toast.success("Peer WireGuard berhasil dibuat.");
      setCreateOpen(false);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal membuat peer."),
  });

  const deleteMutation = useMutation({
    mutationFn: (name: string) => deleteWgPeer(name),
    onSuccess: () => {
      toast.success("Peer WireGuard dihapus.");
      setDeleteTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal menghapus peer."),
  });

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        title="WireGuard Peers"
        description="Kelola peer VPN WireGuard pada server remote."
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
              Tambah Peer
            </Button>
          </div>
        }
      />

      <div className="px-2 lg:px-5">
        <Card className="p-0">
          <div className="overflow-hidden">
            <WgTable
              peers={data ?? []}
              isLoading={isLoading}
              onViewConfig={(peer) => setConfigTarget(peer)}
              onDelete={(peer) => setDeleteTarget(peer)}
            />
          </div>
        </Card>
      </div>

      <CreateWgDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        busy={createMutation.isPending}
        onSubmit={(input) => createMutation.mutate(input)}
      />

      <WgConfigDialog
        open={Boolean(configTarget)}
        onOpenChange={(open) => {
          if (!open) setConfigTarget(null);
        }}
        name={configTarget?.name ?? ""}
        config={configQuery.data?.config ?? ""}
        qrPngBase64={configQuery.data?.qrPngBase64}
        loading={configQuery.isLoading}
        error={
          configQuery.isError
            ? configQuery.error instanceof ApiError
              ? configQuery.error.message
              : "Gagal memuat konfigurasi peer."
            : undefined
        }
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus Peer WireGuard"
        description={`Hapus peer "${deleteTarget?.name}" dari server VPN? Tindakan ini tidak dapat dibatalkan.`}
        busy={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.name)}
      />
    </div>
  );
}
