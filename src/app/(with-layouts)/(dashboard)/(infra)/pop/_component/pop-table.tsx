"use client";

import { Button } from "@/components/tailgrids/core/button";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/components/tailgrids/core/table";
import type { Pop } from "@/services/api/infra";
import { PenToSquare, Trash1 } from "@tailgrids/icons";

export default function PopTable({
  pops,
  isLoading,
  onEdit,
  onDelete,
}: {
  pops: Pop[];
  isLoading: boolean;
  onEdit: (pop: Pop) => void;
  onDelete: (pop: Pop) => void;
}) {
  return (
    <TableRoot className="w-full rounded-none border-none">
      <TableHeader>
        <TableRow className="[&_th]:border-t">
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Kode POP
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Nama POP
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Alamat
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Koordinat
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Catatan Perangkat
          </TableHead>
          <TableHead className="px-6 py-2.5 text-right text-xs font-semibold text-text-secondary">
            Aksi
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={6}>
              Memuat data…
            </TableCell>
          </TableRow>
        )}

        {!isLoading && pops.length === 0 && (
          <TableRow>
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={6}>
              Belum ada POP.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          pops.map((pop) => (
            <TableRow key={pop.id} className="[&_td]:border-none">
              <TableCell className="px-6 py-3.5 text-sm font-medium text-text-primary">
                {pop.popCode}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-primary">
                {pop.popName}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {pop.address || "-"}
              </TableCell>
              <TableCell className="px-6 py-3.5 font-mono text-sm text-text-secondary">
                {pop.coordinates || "-"}
              </TableCell>
              <TableCell className="max-w-60 px-6 py-3.5 text-sm text-text-secondary">
                {pop.deviceNotes || "-"}
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    aria-label="Edit POP"
                    className="h-7 w-7 p-1.5 text-icon-tertiary"
                    onPress={() => onEdit(pop)}
                  >
                    <PenToSquare />
                  </Button>
                  <Button
                    variant="danger"
                    appearance="ghost"
                    size="xs"
                    className="h-7 w-7 p-1.5"
                    aria-label="Hapus POP"
                    onPress={() => onDelete(pop)}
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
