"use client";

import PageHeader from "@/components/common/page-header";
import { Card, CardContent } from "@/components/tailgrids/core/card";
import { Spinner } from "@/components/tailgrids/core/spinner";
import { ApiError } from "@/services/api/client";
import {
  getVpnStatus,
  vpnServiceAction,
  type VpnServiceAction,
} from "@/services/api/vpn";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import ServerSummary from "./server-summary";
import ServiceCard from "./service-card";

const STAT_ITEMS = [
  { key: "l2tpUsers", label: "L2TP Users" },
  { key: "l2tpOnline", label: "L2TP Online" },
  { key: "wgPeers", label: "WireGuard Peers" },
  { key: "wgOnline", label: "WireGuard Online" },
] as const;

function truncate(value: string | undefined, length = 16): string {
  if (!value) return "-";
  return value.length > length ? `${value.slice(0, length)}…` : value;
}

export default function VpnServicesPage() {
  const queryClient = useQueryClient();
  const [busyService, setBusyService] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["vpn-status"],
    queryFn: getVpnStatus,
    refetchInterval: 15000,
  });

  const actionMutation = useMutation({
    mutationFn: (action: VpnServiceAction) => vpnServiceAction(action),
    onSuccess: (_res, action) => {
      toast.success(`Perintah "${action}" dikirim ke server VPN.`);
      queryClient.invalidateQueries({ queryKey: ["vpn-status"] });
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Gagal menjalankan aksi.");
    },
    onSettled: () => setBusyService(null),
  });

  const handleAction = (service: string, action: VpnServiceAction) => {
    setBusyService(service);
    actionMutation.mutate(action);
  };

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        title="VPN Services"
        description="Kontrol status dan layanan pada server VPN remote (L2TP, WireGuard, Port Forwarding)."
      />

      <div className="space-y-5 px-2 lg:px-5">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        )}

        {isError && (
          <Card>
            <CardContent className="p-0 text-sm text-text-tertiary">
              {error instanceof ApiError
                ? error.message
                : "Tidak dapat menghubungi server VPN. Pastikan agent berjalan dan dapat diakses."}
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            <ServerSummary status={data} />

            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {STAT_ITEMS.map((item) => (
                <Card key={item.key}>
                  <p className="text-sm leading-5 font-medium text-text-tertiary">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-2xl leading-8 font-semibold text-text-primary">
                    {data.counts[item.key]}
                  </p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <ServiceCard
                title="L2TP"
                subtitle="VPN berbasis PSK untuk klien perangkat"
                info={data.services.l2tp}
                busy={busyService === "L2TP"}
                onAction={(action) => handleAction("L2TP", action)}
                details={[
                  { label: "Port", value: data.services.l2tp.port || "-" },
                  { label: "Subnet", value: data.services.l2tp.subnet || "-" },
                  { label: "Local IP", value: data.services.l2tp.localIp || "-" },
                  { label: "Users", value: String(data.counts.l2tpUsers) },
                ]}
              />

              <ServiceCard
                title="WireGuard"
                subtitle="VPN modern berbasis kunci publik"
                info={data.services.wireguard}
                busy={busyService === "WireGuard"}
                onAction={(action) => handleAction("WireGuard", action)}
                details={[
                  { label: "Port", value: data.services.wireguard.port || "-" },
                  { label: "Subnet", value: data.services.wireguard.subnet || "-" },
                  { label: "Server IP", value: data.services.wireguard.serverIp || "-" },
                  {
                    label: "Public Key",
                    value: truncate(data.services.wireguard.publicKey),
                  },
                ]}
              />

              <ServiceCard
                title="Port Forwards"
                subtitle="Penerusan port publik ke klien VPN"
                info={data.services.forwards}
                busy={busyService === "Forwards"}
                onAction={(action) => handleAction("Forwards", action)}
                details={[
                  {
                    label: "Listening",
                    value: String(data.services.forwards.listening ?? 0),
                  },
                  { label: "Total", value: String(data.services.forwards.total ?? 0) },
                ]}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
