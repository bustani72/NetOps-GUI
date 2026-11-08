import type { Metadata } from "next";
import PortForwardsPage from "./_component";

export const metadata: Metadata = {
  title: "Port Forwards",
};

export default function Page() {
  return <PortForwardsPage />;
}
