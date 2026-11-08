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
import type { L2tpUser } from "@/services/api/vpn";
import { Copy1, Eye, EyeDisabled, Trash1 } from "@tailgrids/icons";
import { useState } from "react";

export default function L2tpTable({
  users,
  isLoading,
  onDelete,
}: {
  users: L2tpUser[];
  isLoading: boolean;
  onDelete: (user: L2tpUser) => void;
}) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const toggle = (username: string) =>
    setRevealed((prev) => ({ ...prev, [username]: !prev[username] }));

  const copy = (value: string) => {
    navigator.clipboard?.writeText(value);
  };

  return (
    <TableRoot className="w-full rounded-none border-none">
      <TableHeader>
        <TableRow className="[&_th]:border-t">
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Username
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            IP VPN
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Password
          </TableHead>
          <TableHead className="px-6 py-2.5 text-right text-xs font-semibold text-text-secondary">
            Aksi
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={4}>
              Memuat data…
            </TableCell>
          </TableRow>
        )}

        {!isLoading && users.length === 0 && (
          <TableRow>
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={4}>
              Belum ada user L2TP.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          users.map((user) => (
            <TableRow key={user.username} className="[&_td]:border-none">
              <TableCell className="px-6 py-3.5 text-sm font-medium text-text-primary">
                {user.username}
              </TableCell>
              <TableCell className="px-6 py-3.5">
                {user.vpnIp ? (
                  <Badge color="blue" size="sm">
                    {user.vpnIp}
                  </Badge>
                ) : (
                  <span className="text-sm text-text-tertiary">-</span>
                )}
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-text-secondary">
                    {revealed[user.username]
                      ? user.password
                      : "•".repeat(Math.min(user.password?.length ?? 6, 10))}
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    aria-label="Tampilkan password"
                    className="h-7 w-7 p-1.5 text-icon-tertiary"
                    onPress={() => toggle(user.username)}
                  >
                    {revealed[user.username] ? <EyeDisabled /> : <Eye />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    aria-label="Salin password"
                    className="h-7 w-7 p-1.5 text-icon-tertiary"
                    onPress={() => copy(user.password)}
                  >
                    <Copy1 />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <div className="flex justify-end">
                  <Button
                    variant="danger"
                    appearance="ghost"
                    size="xs"
                    className="h-7 w-7 p-1.5"
                    aria-label="Hapus user"
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
