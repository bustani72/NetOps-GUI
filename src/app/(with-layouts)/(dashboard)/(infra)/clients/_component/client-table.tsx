"use client";

import { Badge } from "@/components/tailgrids/core/badge";
import { Button } from "@/components/tailgrids/core/button";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/components/tailgrids/core/table";
import {
  CLIENT_CATEGORY_LABELS,
  CLIENT_STATUS_COLORS,
  CLIENT_STATUS_LABELS,
} from "@/constants/netops";
import type { Client } from "@/services/api/infra";
import { PenToSquare, Trash1 } from "@tailgrids/icons";

export default function ClientTable({
  clients,
  isLoading,
  onEdit,
  onDelete,
}: {
  clients: Client[];
  isLoading: boolean;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}) {
  return (
    <TableRoot className="w-full rounded-none border-none">
      <TableHeader>
        <TableRow className="[&_th]:border-t">
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Kode Klien
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Nama Klien
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Kategori
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            PIC
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Telepon PIC
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Bandwidth
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Status
          </TableHead>
          <TableHead className="px-6 py-2.5 text-right text-xs font-semibold text-text-secondary">
            Aksi
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={8}>
              Memuat data…
            </TableCell>
          </TableRow>
        )}

        {!isLoading && clients.length === 0 && (
          <TableRow>
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={8}>
              Belum ada klien.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          clients.map((client) => (
            <TableRow key={client.id} className="[&_td]:border-none">
              <TableCell className="px-6 py-3.5 text-sm font-medium text-text-primary">
                {client.clientCode}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-primary">
                {client.clientName}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {CLIENT_CATEGORY_LABELS[client.category]}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {client.picName || "-"}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {client.picPhone || "-"}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {client.bandwidthMbps != null ? `${client.bandwidthMbps} Mbps` : "-"}
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <Badge color={CLIENT_STATUS_COLORS[client.status]} size="sm">
                  {CLIENT_STATUS_LABELS[client.status]}
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    aria-label="Edit klien"
                    className="h-7 w-7 p-1.5 text-icon-tertiary"
                    onPress={() => onEdit(client)}
                  >
                    <PenToSquare />
                  </Button>
                  <Button
                    variant="danger"
                    appearance="ghost"
                    size="xs"
                    className="h-7 w-7 p-1.5"
                    aria-label="Hapus klien"
                    onPress={() => onDelete(client)}
                  >
                    <Trash1 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </TableRoot>
  );
}
