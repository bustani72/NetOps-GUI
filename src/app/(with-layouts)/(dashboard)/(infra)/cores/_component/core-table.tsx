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
  CORE_STATUS_COLORS,
  CORE_STATUS_LABELS,
  CORE_USAGE_LABELS,
} from "@/constants/netops";
import type { OtbCore } from "@/services/api/infra";
import { PenToSquare, Trash1 } from "@tailgrids/icons";

export default function CoreTable({
  cores,
  isLoading,
  hasOtb,
  onEdit,
  onDelete,
}: {
  cores: OtbCore[];
  isLoading: boolean;
  hasOtb: boolean;
  onEdit: (core: OtbCore) => void;
  onDelete: (core: OtbCore) => void;
}) {
  return (
    <TableRoot className="w-full rounded-none border-none">
      <TableHeader>
        <TableRow className="[&_th]:border-t">
          <TableHead className="px-5 py-2.5 text-xs font-semibold text-text-secondary">
            No. Core
          </TableHead>
          <TableHead className="px-5 py-2.5 text-xs font-semibold text-text-secondary">
            Warna Tube
          </TableHead>
          <TableHead className="px-5 py-2.5 text-xs font-semibold text-text-secondary">
            Warna Core
          </TableHead>
          <TableHead className="px-5 py-2.5 text-xs font-semibold text-text-secondary">
            Status
          </TableHead>
          <TableHead className="px-5 py-2.5 text-xs font-semibold text-text-secondary">
            Penggunaan
          </TableHead>
          <TableHead className="px-5 py-2.5 text-xs font-semibold text-text-secondary">
            ID Klien
          </TableHead>
          <TableHead className="px-5 py-2.5 text-xs font-semibold text-text-secondary">
            POP Tujuan
          </TableHead>
          <TableHead className="px-5 py-2.5 text-xs font-semibold text-text-secondary">
            Catatan
          </TableHead>
          <TableHead className="px-5 py-2.5 text-right text-xs font-semibold text-text-secondary">
            Aksi
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {!hasOtb && (
          <TableRow>
            <TableCell className="px-5 py-6 text-center text-sm text-text-tertiary" colSpan={9}>
              Pilih OTB untuk menampilkan cores.
            </TableCell>
          </TableRow>
        )}

        {hasOtb && isLoading && (
          <TableRow>
            <TableCell className="px-5 py-6 text-center text-sm text-text-tertiary" colSpan={9}>
              Memuat data…
            </TableCell>
          </TableRow>
        )}

        {hasOtb && !isLoading && cores.length === 0 && (
          <TableRow>
            <TableCell className="px-5 py-6 text-center text-sm text-text-tertiary" colSpan={9}>
              Belum ada core pada OTB ini.
            </TableCell>
          </TableRow>
        )}

        {hasOtb &&
          !isLoading &&
          cores.map((core) => (
            <TableRow key={core.id} className="[&_td]:border-none">
              <TableCell className="px-5 py-3.5 text-sm font-medium text-text-primary">
                {core.coreNumber ?? "-"}
              </TableCell>
              <TableCell className="px-5 py-3.5 text-sm text-text-secondary">
                {core.tubeColor || "-"}
              </TableCell>
              <TableCell className="px-5 py-3.5 text-sm text-text-secondary">
                {core.coreColor || "-"}
              </TableCell>
              <TableCell className="px-5 py-3.5">
                <Badge color={CORE_STATUS_COLORS[core.status]} size="sm">
                  {CORE_STATUS_LABELS[core.status]}
                </Badge>
              </TableCell>
              <TableCell className="px-5 py-3.5 text-sm text-text-secondary">
                {CORE_USAGE_LABELS[core.usageType]}
              </TableCell>
              <TableCell className="px-5 py-3.5 text-sm text-text-secondary">
                {core.clientId ?? "-"}
              </TableCell>
              <TableCell className="px-5 py-3.5 text-sm text-text-secondary">
                {core.destinationPopId ?? "-"}
              </TableCell>
              <TableCell className="max-w-60 px-5 py-3.5 text-sm text-text-secondary">
                {core.notes || "-"}
              </TableCell>
              <TableCell className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    aria-label="Edit core"
                    className="h-7 w-7 p-1.5 text-icon-tertiary"
                    onPress={() => onEdit(core)}
                  >
                    <PenToSquare />
                  </Button>
                  <Button
                    variant="danger"
                    appearance="ghost"
                    size="xs"
                    className="h-7 w-7 p-1.5"
                    aria-label="Hapus core"
                    onPress={() => onDelete(core)}
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
