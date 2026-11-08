"use client";

import ConfirmDialog from "@/components/common/confirm-dialog";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/tailgrids/core/button";
import { Card } from "@/components/tailgrids/core/card";
import { Input } from "@/components/tailgrids/core/input";
import {
  Select,
  SelectContent,
  SelectIndicator,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/tailgrids/core/select";
import { TextField } from "@/components/tailgrids/core/text-field";
import { CLIENT_CATEGORY_LABELS } from "@/constants/netops";
import { ApiError } from "@/services/api/client";
import {
  createClient,
  deleteClient,
  listClients,
  updateClient,
  type Client,
  type ClientCategory,
  type CreateClientInput,
} from "@/services/api/infra";
import { Plus, RefreshCircle1Clockwise } from "@tailgrids/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ClientDialog from "./client-dialog";
import ClientTable from "./client-table";

const CATEGORY_OPTIONS: ClientCategory[] = [
  "school",
  "company",
  "industrial",
  "other",
];

export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"" | ClientCategory>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [target, setTarget] = useState<Client | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["clients", { search, category }],
    queryFn: () =>
      listClients({
        search: search || undefined,
        category: category || undefined,
      }),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["clients"] });
  };

  const saveMutation = useMutation({
    mutationFn: (input: CreateClientInput) =>
      target ? updateClient(target.id, input) : createClient(input),
    onSuccess: () => {
      toast.success(target ? "Klien berhasil diperbarui." : "Klien berhasil dibuat.");
      setDialogOpen(false);
      setTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError
          ? err.message
          : target
            ? "Gagal memperbarui klien."
            : "Gagal membuat klien.",
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteClient(id),
    onSuccess: () => {
      toast.success("Klien dihapus.");
      setDeleteTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal menghapus klien."),
  });

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        title="Clients"
        description="Kelola data klien (sekolah, perusahaan, industri) beserta status layanan."
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
              Tambah Klien
            </Button>
          </div>
        }
      />

      <div className="px-2 lg:px-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <TextField
            className="w-full flex-col sm:w-72"
            value={searchInput}
            onChange={setSearchInput}
          >
            <Input
              placeholder="Cari kode atau nama klien…"
              className="w-full px-3 py-2.5 text-sm"
            />
          </TextField>

          <Select
            className="w-full sm:w-56"
            value={category || "all"}
            onChange={(value) => setCategory(value === "all" ? "" : (value as ClientCategory))}
          >
            <SelectTrigger>
              <SelectValue />
              <SelectIndicator />
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="all">Semua Kategori</SelectItem>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option} id={option}>
                  {CLIENT_CATEGORY_LABELS[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="p-0">
          <div className="overflow-hidden">
            <ClientTable
              clients={data ?? []}
              isLoading={isLoading}
              onEdit={(client) => {
                setTarget(client);
                setDialogOpen(true);
              }}
              onDelete={(client) => setDeleteTarget(client)}
            />
          </div>
        </Card>
      </div>

      <ClientDialog
        key={dialogOpen ? `client-${target?.id ?? "new"}` : "client-closed"}
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
        title="Hapus Klien"
        description={`Hapus klien "${deleteTarget?.clientName}"? Tindakan ini tidak dapat dibatalkan.`}
        busy={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
