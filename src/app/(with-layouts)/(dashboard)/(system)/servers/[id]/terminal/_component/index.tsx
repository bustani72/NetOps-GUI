"use client";

import { Badge } from "@/components/tailgrids/core/badge";
import { Button } from "@/components/tailgrids/core/button";
import { Card } from "@/components/tailgrids/core/card";
import { formatDateTime } from "@/constants/netops";
import { getToken } from "@/services/api/client";
import { getServer } from "@/services/api/servers";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { ArrowLeft, RefreshCircle1Clockwise } from "@tailgrids/icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";

const TERMINAL_WS_BASE = API_BASE_URL.replace(/^http/, "ws");

type TerminalStatus = "connecting" | "connected" | "closed" | "error";

const STATUS_META: Record<TerminalStatus, { label: string; color: "gray" | "success" | "warning" | "error" }> = {
  connecting: { label: "Menghubungkan…", color: "warning" },
  connected: { label: "Terhubung", color: "success" },
  closed: { label: "Terputus", color: "gray" },
  error: { label: "Error", color: "error" },
};

export default function TerminalClient({ serverId }: { serverId: number }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<TerminalStatus>("connecting");
  const [nonce, setNonce] = useState(0);

  const { data: server } = useQuery({
    queryKey: ["server", String(serverId)],
    queryFn: () => getServer(serverId),
    enabled: Number.isInteger(serverId),
  });

  useEffect(() => {
    if (!containerRef.current || !Number.isInteger(serverId)) return;

    let disposed = false;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 13,
      fontFamily: "var(--font-mono, monospace)",
      scrollback: 3000,
      theme: {
        background: "#0b1120",
        foreground: "#e2e8f0",
        cursor: "#e2e8f0",
      },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(containerRef.current);
    fit.fit();
    term.focus();

    const token = getToken();
    const url = `${TERMINAL_WS_BASE}/ws/terminal?serverId=${serverId}&token=${encodeURIComponent(
      token ?? "",
    )}&cols=${term.cols}&rows=${term.rows}`;

    const ws = new WebSocket(url);

    ws.onopen = () => {
      if (disposed) return;
      setStatus("connected");
      fit.fit();
    };

    ws.onmessage = (event) => {
      if (disposed) return;
      if (typeof event.data === "string") {
        term.write(event.data);
      } else if (event.data instanceof ArrayBuffer) {
        term.write(new Uint8Array(event.data));
      }
    };

    ws.onclose = () => {
      if (disposed) return;
      setStatus((prev) => (prev === "error" ? prev : "closed"));
      term.write("\r\n\x1b[33m[netops] Koneksi terminal ditutup.\x1b[0m\r\n");
    };

    ws.onerror = () => {
      if (disposed) return;
      setStatus("error");
    };

    const dataSub = term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) ws.send(data);
    });

    const resizeSub = term.onResize(({ cols, rows }) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "resize", cols, rows }));
      }
    });

    const onWindowResize = () => {
      try {
        fit.fit();
      } catch {
        // abaikan
      }
    };
    window.addEventListener("resize", onWindowResize);

    return () => {
      disposed = true;
      window.removeEventListener("resize", onWindowResize);
      dataSub.dispose();
      resizeSub.dispose();
      try {
        ws.close();
      } catch {
        // abaikan
      }
      term.dispose();
    };
  }, [serverId, nonce]);

  const meta = STATUS_META[status];

  return (
    <div className="mt-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3 px-2 lg:px-6">
        <div>
          <Button
            variant="ghost"
            size="xs"
            className="mb-2 -ml-2 text-sm text-text-tertiary"
            onPress={() => router.push("/servers")}
          >
            <ArrowLeft />
            Kembali ke Servers
          </Button>
          <h1 className="mb-1 flex items-center gap-3 text-[28px] leading-8 font-medium text-text-primary">
            Terminal
            <Badge color={meta.color} size="sm">
              {meta.label}
            </Badge>
          </h1>
          <p className="text-sm leading-5 text-text-tertiary">
            {server
              ? `${server.sshUser}@${server.host}:${server.sshPort} · terakhir dicek ${formatDateTime(
                  server.lastCheckedAt,
                )}`
              : "Memuat informasi server…"}
          </p>
        </div>

        <Button
          appearance="outline"
          size="md"
          onPress={() => {
            setStatus("connecting");
            setNonce((n) => n + 1);
          }}
        >
          <RefreshCircle1Clockwise />
          Reconnect
        </Button>
      </div>

      <div className="px-2 lg:px-5">
        <Card className="overflow-hidden p-0">
          <div
            ref={containerRef}
            className="h-[70vh] w-full bg-[#0b1120] p-2"
          />
        </Card>
      </div>
    </div>
  );
}
