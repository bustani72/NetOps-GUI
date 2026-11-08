"use client";

import { Badge } from "@/components/tailgrids/core/badge";
import { Button } from "@/components/tailgrids/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/tailgrids/core/card";
import type { VpnServiceAction, VpnServiceInfo } from "@/services/api/vpn";
import { Play, RefreshCircle1Clockwise } from "@tailgrids/icons";

interface ServiceDetail {
  label: string;
  value: string;
}

export default function ServiceCard({
  title,
  subtitle,
  info,
  details,
  busy,
  onAction,
}: {
  title: string;
  subtitle?: string;
  info: VpnServiceInfo;
  details: ServiceDetail[];
  busy: boolean;
  onAction: (action: VpnServiceAction) => void;
}) {
  const isActive = info?.active === "active";
  const isEnabled = info?.enabled === "enabled";

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          {subtitle && (
            <p className="mt-0.5 text-xs leading-4 text-text-tertiary">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Badge color={isActive ? "success" : "error"} size="sm">
            {isActive ? "Active" : info?.active || "Unknown"}
          </Badge>
          <Badge color={isEnabled ? "primary" : "gray"} size="sm">
            {isEnabled ? "Enabled" : info?.enabled || "Disabled"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="mt-5 p-0">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          {details.map((detail) => (
            <div key={detail.label} className="min-w-0">
              <dt className="text-xs leading-4 text-text-tertiary">{detail.label}</dt>
              <dd className="truncate text-sm leading-5 font-medium text-text-primary">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>

      <div className="mt-5 flex items-center gap-2">
        {isActive ? (
          <Button
            variant="danger"
            appearance="outline"
            size="sm"
            isDisabled={busy}
            onPress={() => onAction("stop")}
          >
            Stop
          </Button>
        ) : (
          <Button
            variant="success"
            appearance="outline"
            size="sm"
            isDisabled={busy}
            onPress={() => onAction("start")}
          >
            <Play />
            Start
          </Button>
        )}
        <Button
          appearance="outline"
          size="sm"
          isDisabled={busy}
          onPress={() => onAction("restart")}
        >
          <RefreshCircle1Clockwise />
          Restart
        </Button>
      </div>
    </Card>
  );
}
