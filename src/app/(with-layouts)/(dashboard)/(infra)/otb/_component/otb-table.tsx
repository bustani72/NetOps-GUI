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
import type { Otb } from "@/services/api/infra";
import { PenToSquare, Trash1 } from "@tailgrids/icons";

export default function OtbTable({
  otbs,
  isLoading,
  onEdit,
  onDelete,
}: {
  otbs: Otb[];
  isLoading: boolean;
  onEdit: (otb: Otb) => void;
  onDelete: (otb: Otb) => void;
}) {
  return (
    <TableRoot className="w-full rounded-none border-none">
      <TableHeader>
        <TableRow className="[&_th]:border-t">
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Nama OTB
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            POP
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Tipe Kabel
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Arah
          </TableHead>
          <TableHead className="px-6 py-2.5 text-right text-xs font-semibold text-text-secondary">
            Aksi
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={5}>
              Memuat data…
            </TableCell>
          </TableRow>
        )}

        {!isLoading && otbs.length === 0 && (
          <TableRow>
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={5}>
              Belum ada OTB.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          otbs.map((otb) => (
            <TableRow key={otb.id} className="[&_td]:border-none">
              <TableCell className="px-6 py-3.5 text-sm font-medium text-text-primary">
                {otb.otbName}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {otb.pop?.popName ?? "-"}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {otb.cableType || "-"}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {otb.direction || "-"}
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    aria-label="Edit OTB"
                    className="h-7 w-7 p-1.5 text-icon-tertiary"
                    onPress={() => onEdit(otb)}
                  >
                    <PenToSquare />
                  </Button>
                  <Button
                    variant="danger"
                    appearance="ghost"
                    size="xs"
                    className="h-7 w-7 p-1.5"
                    aria-label="Hapus OTB"
                    onPress={() => onDelete(otb)}
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
