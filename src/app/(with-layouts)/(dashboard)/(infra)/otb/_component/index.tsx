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
  createOtb,
  deleteOtb,
  listOtbs,
  listPops,
  updateOtb,
  type CreateOtbInput,
  type Otb,
} from "@/services/api/infra";
import { Plus, RefreshCircle1Clockwise } from "@tailgrids/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import OtbDialog from "./otb-dialog";
import OtbTable from "./otb-table";

export default function OtbPage() {
  const queryClient = useQueryClient();
  const [popFilter, setPopFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [target, setTarget] = useState<Otb | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Otb | null>(null);

  const popId = popFilter === "all" ? undefined : Number(popFilter);

  const popsQuery = useQuery({ queryKey: ["pops"], queryFn: listPops });

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["otbs", popId],
    queryFn: () => listOtbs(popId),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["otbs"] });
  };

  const saveMutation = useMutation({
    mutationFn: (input: CreateOtbInput) =>
      target ? updateOtb(target.id, input) : createOtb(input),
    onSuccess: () => {
      toast.success(target ? "OTB berhasil diperbarui." : "OTB berhasil dibuat.");
      setDialogOpen(false);
      setTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError
          ? err.message
          : target
            ? "Gagal memperbarui OTB."
            : "Gagal membuat OTB.",
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteOtb(id),
    onSuccess: () => {
      toast.success("OTB dihapus.");
      setDeleteTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal menghapus OTB."),
  });

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        title="OTB"
        description="Kelola Optical Termination Box (OTB) dan relasinya dengan POP serta core."
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
              Tambah OTB
            </Button>
          </div>
        }
      />

      <div className="px-2 lg:px-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Select
            className="w-full sm:w-64"
            value={popFilter}
            onChange={(value) => setPopFilter(value as string)}
          >
            <SelectTrigger>
              <SelectValue />
              <SelectIndicator />
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="all">Semua POP</SelectItem>
              {(popsQuery.data ?? []).map((pop) => (
                <SelectItem key={pop.id} id={String(pop.id)}>
                  {pop.popCode} — {pop.popName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="p-0">
          <div className="overflow-hidden">
            <OtbTable
              otbs={data ?? []}
              isLoading={isLoading}
              onEdit={(otb) => {
                setTarget(otb);
                setDialogOpen(true);
              }}
              onDelete={(otb) => setDeleteTarget(otb)}
            />
          </div>
        </Card>
      </div>

      <OtbDialog
        key={dialogOpen ? `otb-${target?.id ?? "new"}` : "otb-closed"}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setTarget(null);
        }}
        busy={saveMutation.isPending}
        target={target}
        pops={popsQuery.data ?? []}
        onSubmit={(input) => saveMutation.mutate(input)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus OTB"
        description={`Hapus OTB "${deleteTarget?.otbName}"? Tindakan ini tidak dapat dibatalkan.`}
        busy={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
