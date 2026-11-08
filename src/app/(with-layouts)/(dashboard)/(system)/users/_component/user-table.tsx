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
import { ROLE_LABELS, formatDate } from "@/constants/netops";
import type { AppUser } from "@/services/api/users";
import { PenToSquare, Trash1 } from "@tailgrids/icons";

export default function UserTable({
  users,
  isLoading,
  onEdit,
  onDelete,
}: {
  users: AppUser[];
  isLoading: boolean;
  onEdit: (user: AppUser) => void;
  onDelete: (user: AppUser) => void;
}) {
  return (
    <TableRoot className="w-full rounded-none border-none">
      <TableHeader>
        <TableRow className="[&_th]:border-t">
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Nama
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Email
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            No. WhatsApp
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Role
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Status
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Dibuat
          </TableHead>
          <TableHead className="px-6 py-2.5 text-right text-xs font-semibold text-text-secondary">
            Aksi
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={7}>
              Memuat data…
            </TableCell>
          </TableRow>
        )}

        {!isLoading && users.length === 0 && (
          <TableRow>
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={7}>
              Belum ada user.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          users.map((user) => (
            <TableRow key={user.id} className="[&_td]:border-none">
              <TableCell className="px-6 py-3.5 text-sm font-medium text-text-primary">
                {user.fullName}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {user.email}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {user.phoneWa || "-"}
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <Badge color={user.role === "super_admin" ? "primary" : "gray"} size="sm">
                  {ROLE_LABELS[user.role]}
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <Badge color={user.isActive ? "success" : "gray"} size="sm">
                  {user.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {formatDate(user.createdAt)}
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    aria-label="Ubah user"
                    className="h-7 w-7 p-1.5 text-icon-tertiary"
                    onPress={() => onEdit(user)}
                  >
                    <PenToSquare />
                  </Button>
                  <Button
                    variant="danger"
                    appearance="ghost"
                    size="xs"
                    aria-label="Hapus user"
                    className="h-7 w-7 p-1.5"
                    onPress={() => onDelete(user)}
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
