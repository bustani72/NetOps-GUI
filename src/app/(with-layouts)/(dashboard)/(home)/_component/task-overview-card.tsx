"use client";

import { Button } from "@/components/tailgrids/core/button";
import { Card, CardHeader, CardTitle } from "@/components/tailgrids/core/card";
import { Spinner } from "@/components/tailgrids/core/spinner";
import { TASK_STATUS_LABELS, formatDate } from "@/constants/netops";
import { listTasks, type TaskStatus } from "@/services/api/tasks";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const ORDER: TaskStatus[] = ["open", "in_progress", "pending", "done"];

export default function TaskOverviewCard() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["tasks", {}],
    queryFn: () => listTasks({}),
  });

  const counts = ORDER.reduce<Record<TaskStatus, number>>(
    (acc, status) => {
      acc[status] = (data ?? []).filter((task) => task.status === status).length;
      return acc;
    },
    { open: 0, in_progress: 0, pending: 0, done: 0 },
  );

  const upcoming = (data ?? [])
    .filter((task) => task.status !== "done")
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Daily Tasks</CardTitle>
          <p className="mt-0.5 text-xs leading-4 text-text-tertiary">
            Ringkasan pekerjaan harian
          </p>
        </div>
        <Button
          appearance="outline"
          size="sm"
          onPress={() => router.push("/daily-tasks")}
        >
          Lihat semua
        </Button>
      </CardHeader>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ORDER.map((status) => (
              <div
                key={status}
                className="rounded-lg border border-card-border px-3 py-2"
              >
                <p className="text-xs text-text-tertiary">
                  {TASK_STATUS_LABELS[status]}
                </p>
                <p className="text-lg font-semibold text-text-primary">
                  {counts[status]}
                </p>
              </div>
            ))}
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-text-tertiary">
              Tugas belum selesai
            </p>
            {upcoming.length === 0 ? (
              <p className="text-sm text-text-tertiary">Tidak ada tugas aktif.</p>
            ) : (
              <ul className="space-y-2">
                {upcoming.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-card-border px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">
                        {task.title}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {formatDate(task.taskDate)}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-text-secondary">
                      {TASK_STATUS_LABELS[task.status]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
