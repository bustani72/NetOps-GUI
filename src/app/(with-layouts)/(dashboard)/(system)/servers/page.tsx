import type { Metadata } from "next";
import ServersPage from "./_component";

export const metadata: Metadata = {
  title: "Servers",
};

export default function Page() {
  return <ServersPage />;
}
