import type { Metadata } from "next";
import VpnServicesPage from "./_component";

export const metadata: Metadata = {
  title: "VPN Services",
};

export default function Page() {
  return <VpnServicesPage />;
}
