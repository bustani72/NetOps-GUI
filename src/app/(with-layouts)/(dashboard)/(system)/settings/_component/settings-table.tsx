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
import { formatDateTime } from "@/constants/netops";
import type { SystemSetting } from "@/services/api/settings";
import { PenToSquare } from "@tailgrids/icons";

export default function SettingsTable({
  settings,
  isLoading,
  onEdit,
}: {
  settings: SystemSetting[];
  isLoading: boolean;
  onEdit: (setting: SystemSetting) => void;
}) {
  return (
    <TableRoot className="w-full rounded-none border-none">
      <TableHeader>
        <TableRow className="[&_th]:border-t">
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Key
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Nilai
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Deskripsi
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Diperbarui
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

        {!isLoading && settings.length === 0 && (
          <TableRow>
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={5}>
              Belum ada pengaturan.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          settings.map((setting) => (
            <TableRow key={setting.id} className="[&_td]:border-none">
              <TableCell className="px-6 py-3.5 font-mono text-sm font-medium text-text-primary">
                {setting.settingKey}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {setting.settingValue || "-"}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {setting.description || "-"}
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {formatDateTime(setting.updatedAt)}
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="xs"
                    aria-label="Ubah pengaturan"
                    className="h-7 w-7 p-1.5 text-icon-tertiary"
                    onPress={() => onEdit(setting)}
                  >
                    <PenToSquare />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </TableRoot>
  );
}
