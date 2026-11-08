"use client";

import ConfirmDialog from "@/components/common/confirm-dialog";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/tailgrids/core/button";
import { Card } from "@/components/tailgrids/core/card";
import { ApiError } from "@/services/api/client";
import {
  activateServer,
  createServer,
  deleteServer,
  listServers,
  setupServer,
  testServerAgent,
  testServerSsh,
  updateServer,
  type CreateServerInput,
  type ServerRecord,
  type SetupServerInput,
  type SetupServerResult,
  type UpdateServerInput,
} from "@/services/api/servers";
import { Plus, RefreshCircle1Clockwise } from "@tailgrids/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import ServerDialog from "./server-dialog";
import ServerTable from "./server-table";
import SetupDialog from "./setup-dialog";

export default function ServersPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ServerRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServerRecord | null>(null);
  const [setupTarget, setSetupTarget] = useState<ServerRecord | null>(null);
  const [setupResult, setSetupResult] = useState<SetupServerResult | null>(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["servers"],
    queryFn: listServers,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["servers"] });

  const createMutation = useMutation({
    mutationFn: (input: CreateServerInput) => createServer(input),
    onSuccess: () => {
      toast.success("Server berhasil ditambahkan.");
      setCreateOpen(false);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal menambahkan server."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateServerInput }) =>
      updateServer(id, input),
    onSuccess: () => {
      toast.success("Server berhasil diperbarui.");
      setEditTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal memperbarui server."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteServer(id),
    onSuccess: () => {
      toast.success("Server dihapus.");
      setDeleteTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal menghapus server."),
  });

  const activateMutation = useMutation({
    mutationFn: (id: number) => activateServer(id),
    onSuccess: () => {
      toast.success("Server aktif diperbarui.");
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal mengaktifkan server."),
  });

  const testSshMutation = useMutation({
    mutationFn: (id: number) => testServerSsh(id),
    onSuccess: (res) => {
      if (res.ok) toast.success(res.message || "SSH terhubung.");
      else toast.warning(res.message || "Koneksi SSH gagal.");
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal menguji SSH."),
  });

  const testAgentMutation = useMutation({
    mutationFn: (id: number) => testServerAgent(id),
    onSuccess: (res) => {
      if (res.ok) toast.success(res.message || "Agent online.");
      else toast.warning(res.message || "Agent tidak merespons.");
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal menguji agent."),
  });

  const setupMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: SetupServerInput }) =>
      setupServer(id, input),
    onSuccess: (res) => {
      setSetupResult(res);
      if (res.ok) toast.success("Setup server selesai.");
      else toast.error(res.message || "Setup server gagal.");
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal menjalankan setup."),
  });

  const closeSetup = () => {
    setSetupTarget(null);
    setSetupResult(null);
  };

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        title="Servers"
        description="Kelola daftar server Linux (VPN-manager) dan lakukan setup agent langsung dari portal."
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
              Tambah Server
            </Button>
          </div>
        }
      />

      <div className="px-2 lg:px-5">
        <Card className="p-0">
          <div className="overflow-hidden">
            <ServerTable
              servers={data ?? []}
              isLoading={isLoading}
              onEdit={(server) => setEditTarget(server)}
              onDelete={(server) => setDeleteTarget(server)}
              onSetup={(server) => setSetupTarget(server)}
              onActivate={(server) => activateMutation.mutate(server.id)}
              onTestSsh={(server) => testSshMutation.mutate(server.id)}
              onTestAgent={(server) => testAgentMutation.mutate(server.id)}
              testingId={
                testSshMutation.isPending
                  ? testSshMutation.variables
                  : testAgentMutation.isPending
                    ? testAgentMutation.variables
                    : null
              }
            />
          </div>
        </Card>
      </div>

      <ServerDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        busy={createMutation.isPending}
        onSubmit={(input) => createMutation.mutate(input)}
      />

      {editTarget && (
        <ServerDialog
          open
          onOpenChange={(next) => !next && setEditTarget(null)}
          server={editTarget}
          busy={updateMutation.isPending}
          onSubmit={(input) => updateMutation.mutate({ id: editTarget.id, input })}
        />
      )}

      {setupTarget && (
        <SetupDialog
          server={setupTarget}
          onClose={closeSetup}
          busy={setupMutation.isPending}
          result={setupResult}
          onSubmit={(input) => setupMutation.mutate({ id: setupTarget.id, input })}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus Server"
        description={`Hapus server "${deleteTarget?.name}"? Kredensial yang tersimpan akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.`}
        busy={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
