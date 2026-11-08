"use client";

import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/tailgrids/core/button";
import { Card } from "@/components/tailgrids/core/card";
import { Pagination } from "@/components/tailgrids/core/pagination";
import { listAuditLogs } from "@/services/api/audit";
import { RefreshCircle1Clockwise } from "@tailgrids/icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import AuditTable from "./audit-table";

const LIMIT = 20;

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["audit", page],
    queryFn: () => listAuditLogs(LIMIT, page),
  });

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        title="Audit Logs"
        description="Riwayat aktivitas dan perubahan konfigurasi pada sistem."
        action={
          <Button
            appearance="outline"
            size="md"
            isDisabled={isFetching}
            onPress={() => refetch()}
          >
            <RefreshCircle1Clockwise />
            Refresh
          </Button>
        }
      />

      <div className="space-y-4 px-2 lg:px-5">
        <Card className="p-0">
          <div className="overflow-hidden">
            <AuditTable logs={data?.items ?? []} isLoading={isLoading} />
          </div>
        </Card>

        {data && data.total > 0 && (
          <Pagination
            currentPage={data.page}
            totalPages={Math.max(1, Math.ceil(data.total / data.limit))}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
