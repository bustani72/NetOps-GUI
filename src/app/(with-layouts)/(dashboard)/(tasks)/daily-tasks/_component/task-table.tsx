"use client";

import { Badge } from "@/components/tailgrids/core/badge";
import { Button } from "@/components/tailgrids/core/button";
import {
  Select,
  SelectContent,
  SelectIndicator,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/tailgrids/core/select";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/components/tailgrids/core/table";
import {
  TASK_CATEGORY_COLORS,
  TASK_CATEGORY_LABELS,
  TASK_STATUS_LABELS,
  formatDate,
} from "@/constants/netops";
import type { DailyTaskItem, TaskStatus } from "@/services/api/tasks";
import { PenToSquare, Trash1 } from "@tailgrids/icons";

const STATUS_OPTIONS: TaskStatus[] = ["open", "in_progress", "pending", "done"];

export default function TaskTable({
  tasks,
  isLoading,
  updatingId,
  onStatusChange,
  onEdit,
  onDelete,
}: {
  tasks: DailyTaskItem[];
  isLoading: boolean;
  updatingId: number | null;
  onStatusChange: (task: DailyTaskItem, status: TaskStatus) => void;
  onEdit: (task: DailyTaskItem) => void;
  onDelete: (task: DailyTaskItem) => void;
}) {
  return (
    <TableRoot className="w-full rounded-none border-none">
      <TableHeader>
        <TableRow className="[&_th]:border-t">
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Tugas
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Status
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            POP / Klien
          </TableHead>
          <TableHead className="px-6 py-2.5 text-xs font-semibold text-text-secondary">
            Tanggal
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

        {!isLoading && tasks.length === 0 && (
          <TableRow>
            <TableCell className="px-6 py-6 text-center text-sm text-text-tertiary" colSpan={5}>
              Belum ada tugas.
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          tasks.map((task) => (
            <TableRow key={task.id} className="[&_td]:border-none">
              <TableCell className="px-6 py-3.5">
                <div className="max-w-80 truncate text-sm font-medium text-text-primary">
                  {task.title}
                </div>
                <div className="mt-1">
                  <Badge color={TASK_CATEGORY_COLORS[task.category]} size="sm">
                    {TASK_CATEGORY_LABELS[task.category]}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <Select
                  value={task.status}
                  isDisabled={updatingId === task.id}
                  onChange={(value) => onStatusChange(task, value as TaskStatus)}
                  className="w-40"
                >
                  <SelectTrigger className="h-9 py-1.5">
                    <SelectValue />
                    <SelectIndicator />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} id={status}>
                        {TASK_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <div className="text-sm text-text-secondary">
                  {task.pop?.popName ?? "-"}
                </div>
                <div className="text-xs text-text-tertiary">
                  {task.client?.clientName ?? "-"}
                </div>
              </TableCell>
              <TableCell className="px-6 py-3.5 text-sm text-text-secondary">
                {formatDate(task.taskDate)}
              </TableCell>
              <TableCell className="px-6 py-3.5">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    aria-label="Ubah tugas"
                    className="h-7 w-7 p-1.5 text-icon-tertiary"
                    onPress={() => onEdit(task)}
                  >
                    <PenToSquare />
                  </Button>
                  <Button
                    variant="danger"
                    appearance="ghost"
                    size="xs"
                    aria-label="Hapus tugas"
                    className="h-7 w-7 p-1.5"
                    onPress={() => onDelete(task)}
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
