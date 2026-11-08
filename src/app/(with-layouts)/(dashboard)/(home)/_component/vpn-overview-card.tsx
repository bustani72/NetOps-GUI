"use client";

import { Badge } from "@/components/tailgrids/core/badge";
import { Button } from "@/components/tailgrids/core/button";
import { Card, CardHeader, CardTitle } from "@/components/tailgrids/core/card";
import { Progress } from "@/components/tailgrids/core/progress";
import { Spinner } from "@/components/tailgrids/core/spinner";
import { formatMb, formatUptime } from "@/constants/netops";
import { ApiError } from "@/services/api/client";
import { getVpnStatus, type VpnServiceInfo } from "@/services/api/vpn";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

function serviceBadge(label: string, info: VpnServiceInfo | undefined) {
  const active = info?.active === "active";
  return (
    <div
      key={label}
      className="flex items-center justify-between rounded-lg border border-card-border px-3 py-2"
    >
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <Badge color={active ? "success" : "error"} size="sm">
        {active ? "Active" : info?.active || "Unknown"}
      </Badge>
    </div>
  );
}

export default function VpnOverviewCard() {
  const router = useRouter();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["vpn-status"],
    queryFn: getVpnStatus,
    refetchInterval: 15000,
  });

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>VPN Manager</CardTitle>
          <p className="mt-0.5 text-xs leading-4 text-text-tertiary">
            Server VPN remote (dedicated)
          </p>
        </div>
        <Button
          appearance="outline"
          size="sm"
          onPress={() => router.push("/vpn/services")}
        >
          Kelola
        </Button>
      </CardHeader>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <Spinner size="lg" />
        </div>
      )}

      {isError && (
        <p className="py-6 text-sm text-text-tertiary">
          {error instanceof ApiError
            ? error.message
            : "Server VPN tidak dapat dihubungi. Periksa agent & koneksi LAN."}
        </p>
      )}

      {data && (
        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <p className="text-xs leading-4 text-text-tertiary">IP Publik</p>
              <p className="text-sm font-medium text-text-primary">
                {data.server.publicIp}
              </p>
            </div>
            <div>
              <p className="text-xs leading-4 text-text-tertiary">Interface</p>
              <p className="text-sm font-medium text-text-primary">
                {data.server.interface}
              </p>
            </div>
            <div>
              <p className="text-xs leading-4 text-text-tertiary">Uptime</p>
              <p className="text-sm font-medium text-text-primary">
                {formatUptime(data.resources.uptimeSeconds)}
              </p>
            </div>
            <div>
              <p className="text-xs leading-4 text-text-tertiary">CPU</p>
              <p className="text-sm font-medium text-text-primary">
                {data.resources.cpuCores} core
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "RAM", pct: data.resources.ramPct, caption: `${formatMb(data.resources.ramUsedMb)} / ${formatMb(data.resources.ramTotalMb)}` },
              { label: "Disk", pct: data.resources.diskPct, caption: `${formatMb(data.resources.diskUsedMb)} / ${formatMb(data.resources.diskTotalMb)}` },
            ].map((meter) => (
              <div key={meter.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-text-secondary">
                    {meter.label}
                  </span>
                  <span className="text-sm font-semibold text-text-primary">
                    {meter.pct}%
                  </span>
                </div>
                <Progress progress={meter.pct} className="max-w-none" withLabel={false} />
                <p className="mt-1 text-xs text-text-tertiary">{meter.caption}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {serviceBadge("L2TP", data.services.l2tp)}
            {serviceBadge("WireGuard", data.services.wireguard)}
            {serviceBadge("Forwards", data.services.forwards)}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "L2TP Users", value: data.counts.l2tpUsers },
              { label: "L2TP Online", value: data.counts.l2tpOnline },
              { label: "WG Peers", value: data.counts.wgPeers },
              { label: "WG Online", value: data.counts.wgOnline },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-card-border px-3 py-2"
              >
                <p className="text-xs text-text-tertiary">{item.label}</p>
                <p className="text-lg font-semibold text-text-primary">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
