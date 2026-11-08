"use client";

import { Card, CardHeader, CardTitle } from "@/components/tailgrids/core/card";
import { Progress } from "@/components/tailgrids/core/progress";
import type { VpnStatus } from "@/services/api/vpn";
import { useEffect, useState } from "react";

function formatUptime(seconds: number): string {
  if (!seconds || seconds < 0) return "-";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}h ${hours}j ${minutes}m`;
  if (hours > 0) return `${hours}j ${minutes}m`;
  return `${minutes}m`;
}

function formatMb(mb: number): string {
  if (!mb) return "0 MB";
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

export default function ServerSummary({ status }: { status: VpnStatus }) {
  const { server, resources } = status;
  const [clock, setClock] = useState<string>("");

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const meters = [
    {
      label: "RAM",
      value: resources.ramPct,
      caption: `${formatMb(resources.ramUsedMb)} / ${formatMb(resources.ramTotalMb)}`,
    },
    {
      label: "Disk",
      value: resources.diskPct,
      caption: `${formatMb(resources.diskUsedMb)} / ${formatMb(resources.diskTotalMb)}`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Server VPN</CardTitle>
          <p className="mt-0.5 text-xs leading-4 text-text-tertiary">
            {server.interface} · {server.publicIp}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg leading-6 font-semibold text-text-primary">{clock}</p>
          <p className="text-xs leading-4 text-text-tertiary">
            Uptime {formatUptime(resources.uptimeSeconds)}
          </p>
        </div>
      </CardHeader>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {meters.map((meter) => (
          <div key={meter.label}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm leading-5 font-medium text-text-secondary">
                {meter.label}
              </span>
              <span className="text-sm leading-5 font-semibold text-text-primary">
                {meter.value}%
              </span>
            </div>
            <Progress progress={meter.value} className="max-w-none" withLabel={false} />
            <p className="mt-1.5 text-xs leading-4 text-text-tertiary">{meter.caption}</p>
          </div>
        ))}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm leading-5 font-medium text-text-secondary">CPU</span>
            <span className="text-sm leading-5 font-semibold text-text-primary">
              {resources.cpuCores} core
            </span>
          </div>
          <Progress progress={0} className="max-w-none" withLabel={false} />
          <p className="mt-1.5 text-xs leading-4 text-text-tertiary">
            Load average {resources.load1}
          </p>
        </div>
      </div>
    </Card>
  );
}
