"use client";

import { Card } from "@/components/tailgrids/core/card";
import { TASK_STATUS_LABELS } from "@/constants/netops";
import type { DailyTaskItem, TaskStatus } from "@/services/api/tasks";

const ORDER: TaskStatus[] = ["open", "in_progress", "pending", "done"];

export default function TaskStats({ tasks }: { tasks: DailyTaskItem[] }) {
  const counts = ORDER.reduce<Record<TaskStatus, number>>(
    (acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status).length;
      return acc;
    },
    { open: 0, in_progress: 0, pending: 0, done: 0 },
  );

  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      {ORDER.map((status) => (
        <Card key={status}>
          <p className="text-sm leading-5 font-medium text-text-tertiary">
            {TASK_STATUS_LABELS[status]}
          </p>
          <p className="mt-1.5 text-2xl leading-8 font-semibold text-text-primary">
            {counts[status]}
          </p>
        </Card>
      ))}
    </div>
  );
}
