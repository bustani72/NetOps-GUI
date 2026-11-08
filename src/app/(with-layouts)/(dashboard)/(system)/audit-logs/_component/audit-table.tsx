"use client";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/components/tailgrids/core/table";
import { formatDateTime } from "@/constants/netops";
import type { AuditLogEntry } from "@/services/api/audit";

const DETAIL_MAX = 60;

function truncateDetail(value: string | null): string {
  if (!value) return "-";
  return value.length > DETAIL_MAX ? `${value.slice(0, DETAIL_MAX)}…` : value;
}

export default function AuditTable({
  logs,
  isLoading,
}: {
  logs: AuditLogEntry[];
  isLoading: boolean;
}) {
  return (
    <TableRoot className="w-full rounded-none border-none">
      <TableHeader>
        <TableRow className="[&_th]:border-t">
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Waktu
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            User
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Action
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Tabel
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Target ID
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Detail
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

        {!isLoading && logs.length === 0 && (
          <TableRow>
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={6}>
              Belum ada aktivitas.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          logs.map((entry) => (
            <TableRow key={entry.id} className="[&_td]:border-none">
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {formatDateTime(entry.createdAt)}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm font-medium text-text-primary">
                {entry.user?.fullName ?? "-"}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {entry.action}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {entry.targetTable ?? "-"}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {entry.targetId ?? "-"}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                <span title={entry.details && entry.details.length > DETAIL_MAX ? entry.details : undefined}>
                  {truncateDetail(entry.details)}
                </span>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </TableRoot>
  );
}
