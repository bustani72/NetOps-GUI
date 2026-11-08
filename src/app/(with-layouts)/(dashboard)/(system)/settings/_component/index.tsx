"use client";

import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/tailgrids/core/button";
import { Card } from "@/components/tailgrids/core/card";
import { ApiError } from "@/services/api/client";
import {
  listSettings,
  upsertSetting,
  type SystemSetting,
  type UpdateSettingInput,
} from "@/services/api/settings";
import { RefreshCircle1Clockwise } from "@tailgrids/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import EditSettingDialog from "./edit-setting-dialog";
import SettingsTable from "./settings-table";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [editTarget, setEditTarget] = useState<SystemSetting | null>(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["settings"],
    queryFn: listSettings,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["settings"] });

  const upsertMutation = useMutation({
    mutationFn: ({ key, input }: { key: string; input: UpdateSettingInput }) =>
      upsertSetting(key, input),
    onSuccess: () => {
      toast.success("Pengaturan berhasil disimpan.");
      setEditTarget(null);
      invalidate();
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Gagal menyimpan pengaturan."),
  });

  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        title="Settings"
        description="Konfigurasi aplikasi dan preferensi sistem."
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

      <div className="px-2 lg:px-5">
        <Card className="p-0">
          <div className="overflow-hidden">
            <SettingsTable
              settings={data ?? []}
              isLoading={isLoading}
              onEdit={(setting) => setEditTarget(setting)}
            />
          </div>
        </Card>
      </div>

      {editTarget && (
        <EditSettingDialog
          setting={editTarget}
          onClose={() => setEditTarget(null)}
          busy={upsertMutation.isPending}
          onSubmit={(input) =>
            upsertMutation.mutate({ key: editTarget.settingKey, input })
          }
        />
      )}
    </div>
  );
}
