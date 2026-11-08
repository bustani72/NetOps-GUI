import PageHeader from "@/components/common/page-header";
import RecentAuditCard from "./_component/recent-audit-card";
import TaskOverviewCard from "./_component/task-overview-card";
import VpnOverviewCard from "./_component/vpn-overview-card";

export default function Home() {
  return (
    <div className="mt-6 space-y-5">
      <PageHeader
        title="Dashboard"
        description="Ringkasan kontrol VPN Manager dan pekerjaan harian tim operasional."
      />

      <div className="space-y-5 px-2 lg:px-5">
        <VpnOverviewCard />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <TaskOverviewCard />
          <RecentAuditCard />
        </div>
      </div>
    </div>
  );
}
