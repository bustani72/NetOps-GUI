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
import type { PortForward } from "@/services/api/vpn";
import { Trash1 } from "@tailgrids/icons";

export default function ForwardTable({
  forwards,
  isLoading,
  onDelete,
}: {
  forwards: PortForward[];
  isLoading: boolean;
  onDelete: (forward: PortForward) => void;
}) {
  return (
    <TableRoot className="w-full rounded-none border-none">
      <TableHeader>
        <TableRow className="[&_th]:border-t">
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Nama
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Public → Internal
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Protokol
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
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={5}>
              Memuat data…
            </TableCell>
          </TableRow>
        )}

        {!isLoading && forwards.length === 0 && (
          <TableRow>
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={5}>
              Belum ada port forward.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          forwards.map((forward) => (
            <TableRow key={forward.name} className="[&_td]:border-none">
              <TableCell className="px-6 py-3.5">
                <div className="text-sm font-medium text-text-primary">{forward.name}</div>
                {forward.description && (
                  <div className="text-xs text-text-tertiary">{forward.description}</div>
                )}
              </TableCell>
              <TableCell className="px-6 py-3.5 font-mono text-sm text-text-secondary">
                :{forward.publicPort} → {forward.internalIp}:{forward.internalPort}
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <Badge color="cyan" size="sm">
                  {forward.protocol}
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <Badge color={forward.listening ? "success" : "warning"} size="sm">
                  {forward.listening ? "Listening" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <div className="flex justify-end">
                  <Button
                    variant="danger"
                    appearance="ghost"
                    size="xs"
                    aria-label="Hapus forward"
                    className="h-7 w-7 p-1.5"
                    onPress={() => onDelete(forward)}
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
