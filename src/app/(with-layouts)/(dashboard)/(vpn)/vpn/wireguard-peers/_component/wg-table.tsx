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
import type { WgPeer } from "@/services/api/vpn";
import { Eye, Trash1 } from "@tailgrids/icons";

export default function WgTable({
  peers,
  isLoading,
  onViewConfig,
  onDelete,
}: {
  peers: WgPeer[];
  isLoading: boolean;
  onViewConfig: (peer: WgPeer) => void;
  onDelete: (peer: WgPeer) => void;
}) {
  return (
    <TableRoot className="w-full rounded-none border-none">
      <TableHeader>
        <TableRow className="[&_th]:border-t">
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Nama
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            IP
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Public Key
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

        {!isLoading && peers.length === 0 && (
          <TableRow>
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={5}>
              Belum ada peer WireGuard.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          peers.map((peer) => (
            <TableRow key={peer.name} className="[&_td]:border-none">
              <TableCell className="px-6 py-3.5">
                <div className="text-sm font-medium text-text-primary">{peer.name}</div>
                {peer.description && (
                  <div className="text-xs text-text-tertiary">{peer.description}</div>
                )}
              </TableCell>
              <TableCell className="px-6 py-3.5">
                {peer.ip ? (
                  <Badge color="violet" size="sm">
                    {peer.ip}
                  </Badge>
                ) : (
                  <span className="text-sm text-text-tertiary">-</span>
                )}
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <span className="font-mono text-xs text-text-secondary">
                  {peer.pubkey ? `${peer.pubkey.slice(0, 20)}…` : "-"}
                </span>
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <Badge color={peer.online ? "success" : "gray"} size="sm">
                  {peer.online ? "Online" : "Offline"}
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    aria-label="Lihat konfigurasi"
                    className="h-7 w-7 p-1.5 text-icon-tertiary"
                    onPress={() => onViewConfig(peer)}
                  >
                    <Eye />
                  </Button>
                  <Button
                    variant="danger"
                    appearance="ghost"
                    size="xs"
                    aria-label="Hapus peer"
                    className="h-7 w-7 p-1.5"
                    onPress={() => onDelete(peer)}
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
