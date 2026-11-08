"use client";

import ConfirmDialog from "@/components/common/confirm-dialog";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/tailgrids/core/button";
import { Card } from "@/components/tailgrids/core/card";
import { ApiError } from "@/services/api/client";
import {
  createPop,
  deletePop,
  listPops,
  updatePop,
  type CreatePopInput,
  type Pop,
} from "@/services/api/infra";
import { Plus, RefreshCircle1Clockwise } from "@tailgrids/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import PopDialog from "./pop-dialog";
import PopTable from "./pop-table";

export default function PopPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [target, setTarget] = useState<Pop | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Pop | null>(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["pops"],
    queryFn: listPops,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["pops"] });

  const saveMutation = useMutation({
    mutationFn: (input: CreatePopInput) =>
      target ? updatePop(target.id, input) : createPop(input),
    onSuccess: () => {
      toast.success(target ? "POP berhasil diperbarui." : "POP berhasil dibuat.");
      setDialogOpen(false);
      setTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError
          ? err.message
          : target
            ? "Gagal memperbarui POP."
            : "Gagal membuat POP.",
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePop(id),
    onSuccess: () => {
      toast.success("POP dihapus.");
      setDeleteTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal menghapus POP."),
  });

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        title="POP"
        description="Kelola data Point of Presence (POP) beserta lokasi dan perangkatnya."
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
              size="md"
              onPress={() => {
                setTarget(null);
                setDialogOpen(true);
              }}
            >
              <Plus />
              Tambah POP
            </Button>
          </div>
        }
      />

      <div className="px-2 lg:px-5">
        <Card className="p-0">
          <div className="overflow-hidden">
            <PopTable
              pops={data ?? []}
              isLoading={isLoading}
              onEdit={(pop) => {
                setTarget(pop);
                setDialogOpen(true);
              }}
              onDelete={(pop) => setDeleteTarget(pop)}
            />
          </div>
        </Card>
      </div>

      <PopDialog
        key={dialogOpen ? `pop-${target?.id ?? "new"}` : "pop-closed"}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setTarget(null);
        }}
        busy={saveMutation.isPending}
        target={target}
        onSubmit={(input) => saveMutation.mutate(input)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus POP"
        description={`Hapus POP "${deleteTarget?.popName}"? Tindakan ini tidak dapat dibatalkan.`}
        busy={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
