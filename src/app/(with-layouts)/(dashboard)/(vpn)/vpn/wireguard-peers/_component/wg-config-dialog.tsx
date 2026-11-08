"use client";

import { Button } from "@/components/tailgrids/core/button";
import { Dialog, DialogBody, DialogHeader, DialogTitle } from "@/components/tailgrids/core/dialog";
import { Spinner } from "@/components/tailgrids/core/spinner";
import { Copy1, Download1 } from "@tailgrids/icons";
import { toast } from "sonner";

export default function WgConfigDialog({
  open,
  onOpenChange,
  name,
  config,
  qrPngBase64,
  loading,
  error,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  config: string;
  qrPngBase64?: string;
  loading: boolean;
  error?: string;
}) {
  const copy = () => {
    navigator.clipboard?.writeText(config);
    toast.success("Konfigurasi disalin ke clipboard.");
  };

  const download = () => {
    const blob = new Blob([config], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name}.conf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success(`Berkas ${name}.conf diunduh.`);
  };

  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange} className="max-w-150">
      <DialogHeader>
        <DialogTitle>Konfigurasi WireGuard · {name}</DialogTitle>
      </DialogHeader>

      <DialogBody>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <p className="py-6 text-center text-sm text-text-tertiary">{error}</p>
        ) : (
          <div className="space-y-4">
            {qrPngBase64 && (
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`data:image/png;base64,${qrPngBase64}`}
                  alt={`QR konfigurasi ${name}`}
                  className="size-48 rounded-lg border border-card-border bg-white p-2"
                />
              </div>
            )}

            <pre className="max-h-80 overflow-auto rounded-lg border border-card-border bg-card-surface-area p-4 font-mono text-xs leading-5 text-text-secondary">
              {config}
            </pre>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button appearance="outline" size="md" className="flex-1" onPress={copy}>
                <Copy1 />
                Salin Konfigurasi
              </Button>
              <Button appearance="outline" size="md" className="flex-1" onPress={download}>
                <Download1 />
                Unduh .conf
              </Button>
            </div>
          </div>
        )}
      </DialogBody>
    </Dialog>
  );
}
