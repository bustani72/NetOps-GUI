"use client";

import { Button } from "@/components/tailgrids/core/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/tailgrids/core/dialog";

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Hapus",
  busy,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange} className="max-w-100">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>

      <DialogBody>{description}</DialogBody>

      <DialogFooter>
        <Button
          variant="danger"
          isDisabled={busy}
          onPress={() => {
            onConfirm();
          }}
        >
          {busy ? "Memproses…" : confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
