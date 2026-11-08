import type { Metadata } from "next";
import WireGuardPeersPage from "./_component";

export const metadata: Metadata = {
  title: "WireGuard Peers",
};

export default function Page() {
  return <WireGuardPeersPage />;
}
