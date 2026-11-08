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
  SelectTrigger,
  SelectValue,
} from "@/components/tailgrids/core/select";
import { ApiError } from "@/services/api/client";
import {
  createCore,
  deleteCore,
  listClients,
  listCores,
  listOtbs,
  listPops,
  updateCore,
  type CreateCoreInput,
  type OtbCore,
} from "@/services/api/infra";
import { Plus, RefreshCircle1Clockwise } from "@tailgrids/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import CoreDialog from "./core-dialog";
import CoreTable from "./core-table";

export default function CoresPage() {
  const queryClient = useQueryClient();
  const [selectedOtbId, setSelectedOtbId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [target, setTarget] = useState<OtbCore | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OtbCore | null>(null);

  const otbId = selectedOtbId ? Number(selectedOtbId) : undefined;

  const otbsQuery = useQuery({ queryKey: ["otbs"], queryFn: () => listOtbs() });
  const clientsQuery = useQuery({ queryKey: ["clients"], queryFn: () => listClients() });
  const popsQuery = useQuery({ queryKey: ["pops"], queryFn: listPops });

  const coresQuery = useQuery({
    queryKey: ["cores", otbId],
    queryFn: () => {
      if (otbId === undefined) return Promise.resolve<OtbCore[]>([]);
      return listCores(otbId);
    },
    enabled: otbId !== undefined,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["cores"] });
  };

  const saveMutation = useMutation({
    mutationFn: (input: CreateCoreInput) => {
      if (target) return updateCore(target.id, input);
      if (otbId === undefined) throw new ApiError(400, "Pilih OTB terlebih dahulu.");
      return createCore(otbId, input);
    },
    onSuccess: () => {
      toast.success(target ? "Core berhasil diperbarui." : "Core berhasil dibuat.");
      setDialogOpen(false);
      setTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError
          ? err.message
          : target
            ? "Gagal memperbarui core."
            : "Gagal membuat core.",
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCore(id),
    onSuccess: () => {
      toast.success("Core dihapus.");
      setDeleteTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal menghapus core."),
  });

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        title="Cores"
        description="Kelola penggunaan core fiber (uplink metro, client, backbone, spare)."
        action={
          <div className="flex items-center gap-2">
            <Button
              appearance="outline"
              size="md"
              isDisabled={coresQuery.isFetching}
              onPress={() => coresQuery.refetch()}
            >
              <RefreshCircle1Clockwise />
              Refresh
            </Button>
            <Button
              size="md"
              isDisabled={otbId === undefined}
              onPress={() => {
                setTarget(null);
                setDialogOpen(true);
              }}
            >
              <Plus />
              Tambah Core
            </Button>
          </div>
        }
      />

      <div className="px-2 lg:px-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Select
            className="w-full sm:w-72"
            value={selectedOtbId}
            onChange={(value) => setSelectedOtbId(value as string)}
          >
            <SelectTrigger>
              <SelectValue />
              <SelectIndicator />
            </SelectTrigger>
            <SelectContent>
              {(otbsQuery.data ?? []).map((otb) => (
                <SelectItem key={otb.id} id={String(otb.id)}>
                  {otb.otbName}
                  {otb.pop ? ` — ${otb.pop.popName}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="p-0">
          <div className="overflow-hidden">
            <CoreTable
              cores={coresQuery.data ?? []}
              isLoading={coresQuery.isLoading}
              hasOtb={otbId !== undefined}
              onEdit={(core) => {
                setTarget(core);
                setDialogOpen(true);
              }}
              onDelete={(core) => setDeleteTarget(core)}
            />
          </div>
        </Card>
      </div>

      <CoreDialog
        key={dialogOpen ? `core-${target?.id ?? "new"}` : "core-closed"}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setTarget(null);
        }}
        busy={saveMutation.isPending}
        target={target}
        clients={clientsQuery.data ?? []}
        pops={popsQuery.data ?? []}
        onSubmit={(input) => saveMutation.mutate(input)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus Core"
        description={`Hapus core nomor "${deleteTarget?.coreNumber ?? "-"}"? Tindakan ini tidak dapat dibatalkan.`}
        busy={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
