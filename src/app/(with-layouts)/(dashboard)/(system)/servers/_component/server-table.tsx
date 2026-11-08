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
  SERVER_STATUS_COLORS,
  SERVER_STATUS_LABELS,
  formatDateTime,
} from "@/constants/netops";
import type { ServerRecord } from "@/services/api/servers";
import { Chip2, Command, Gear1, LaptopPhone, PenToSquare, Trash1 } from "@tailgrids/icons";
import { useRouter } from "next/navigation";

export default function ServerTable({
  servers,
  isLoading,
  onEdit,
  onDelete,
  onSetup,
  onActivate,
  onTestSsh,
  onTestAgent,
  testingId,
}: {
  servers: ServerRecord[];
  isLoading: boolean;
  onEdit: (server: ServerRecord) => void;
  onDelete: (server: ServerRecord) => void;
  onSetup: (server: ServerRecord) => void;
  onActivate: (server: ServerRecord) => void;
  onTestSsh: (server: ServerRecord) => void;
  onTestAgent: (server: ServerRecord) => void;
  testingId?: number | null;
}) {
  const router = useRouter();

  return (
    <TableRoot className="w-full rounded-none border-none">
      <TableHeader>
        <TableRow className="[&_th]:border-t">
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Nama
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Host SSH
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Agent
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Status
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Terakhir dicek
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Default
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

        {!isLoading && servers.length === 0 && (
          <TableRow>
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={7}>
              Belum ada server. Tambahkan server Linux untuk mengelola VPN.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          servers.map((server) => {
            const isTesting = testingId === server.id;
            return (
              <TableRow key={server.id} className="[&_td]:border-none">
                <TableCell className="px-6 py-3.5">
                  <div className="text-sm font-medium text-text-primary">{server.name}</div>
                  {server.description && (
                    <div className="text-xs text-text-tertiary">{server.description}</div>
                  )}
                </TableCell>
                <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                  <div>{`${server.host}:${server.sshPort}`}</div>
                  <div className="text-xs text-text-tertiary">
                    {server.sshUser} · {server.authType === "key" ? "SSH Key" : "Password"}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                  <div>{`port ${server.agentPort}`}</div>
                  <div className="text-xs text-text-tertiary">
                    {server.hasAgentToken ? "Token tersimpan" : "Token belum ada"}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-3.5">
                  <Badge color={SERVER_STATUS_COLORS[server.status]} size="sm">
                    {SERVER_STATUS_LABELS[server.status]}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                  {formatDateTime(server.lastCheckedAt)}
                </TableCell>
                <TableCell className="px-6 py-3.5">
                  {server.isDefault ? (
                    <Badge color="success" size="sm">
                      Aktif
                    </Badge>
                  ) : (
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-xs"
                      onPress={() => onActivate(server)}
                    >
                      Jadikan default
                    </Button>
                  )}
                </TableCell>
                <TableCell className="px-6 py-3.5">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      aria-label="Buka terminal"
                      className="h-7 w-7 p-1.5 text-icon-tertiary"
                      onPress={() => router.push(`/servers/${server.id}/terminal`)}
                    >
                      <Command />
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      aria-label="Uji SSH"
                      isDisabled={isTesting}
                      className="h-7 w-7 p-1.5 text-icon-tertiary"
                      onPress={() => onTestSsh(server)}
                    >
                      <LaptopPhone />
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      aria-label="Uji agent"
                      isDisabled={isTesting}
                      className="h-7 w-7 p-1.5 text-icon-tertiary"
                      onPress={() => onTestAgent(server)}
                    >
                      <Chip2 />
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      aria-label="Setup agent"
                      className="h-7 w-7 p-1.5 text-icon-tertiary"
                      onPress={() => onSetup(server)}
                    >
                      <Gear1 />
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      aria-label="Ubah server"
                      className="h-7 w-7 p-1.5 text-icon-tertiary"
                      onPress={() => onEdit(server)}
                    >
                      <PenToSquare />
                    </Button>
                    <Button
                      variant="danger"
                      appearance="ghost"
                      size="xs"
                      aria-label="Hapus server"
                      className="h-7 w-7 p-1.5"
                      onPress={() => onDelete(server)}
                    >
                      <Trash1 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </TableRoot>
  );
}
