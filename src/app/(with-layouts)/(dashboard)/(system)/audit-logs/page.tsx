import type { Metadata } from "next";
import AuditLogsPage from "./_component";

export const metadata: Metadata = {
  title: "Audit Logs",
};

export default function Page() {
  return <AuditLogsPage />;
}
