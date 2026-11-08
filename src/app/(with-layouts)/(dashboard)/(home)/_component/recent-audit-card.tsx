"use client";

import { Card, CardHeader, CardTitle } from "@/components/tailgrids/core/card";
import { Spinner } from "@/components/tailgrids/core/spinner";
import { formatDateTime } from "@/constants/netops";
import { listAuditLogs } from "@/services/api/audit";
import { getStoredUser } from "@/services/api/auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/tailgrids/core/button";

export default function RecentAuditCard() {
  const router = useRouter();
  const user = getStoredUser();
  const isSuperAdmin = user?.role === "super_admin";

  const { data, isLoading } = useQuery({
    queryKey: ["audit", 1],
    queryFn: () => listAuditLogs(8, 1),
    enabled: isSuperAdmin,
  });

  if (!isSuperAdmin) return null;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <p className="mt-0.5 text-xs leading-4 text-text-tertiary">
            Catatan audit perubahan data
          </p>
        </div>
        <Button
          appearance="outline"
          size="sm"
          onPress={() => router.push("/audit-logs")}
        >
          Lihat semua
        </Button>
      </CardHeader>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : (data?.items.length ?? 0) === 0 ? (
        <p className="py-6 text-sm text-text-tertiary">Belum ada aktivitas tercatat.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {data?.items.map((entry) => (
            <li
              key={entry.id}
              className="flex items-start justify-between gap-3 border-b border-card-border pb-3 last:border-none last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">
                  {entry.action}
                </p>
                <p className="text-xs text-text-tertiary">
                  {entry.user?.fullName ?? "Sistem"}
                  {entry.targetTable ? ` · ${entry.targetTable}` : ""}
                </p>
              </div>
              <span className="shrink-0 text-xs text-text-tertiary">
                {formatDateTime(entry.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
