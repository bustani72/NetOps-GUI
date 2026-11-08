import type { Metadata } from "next";
import ClientsPage from "./_component";

export const metadata: Metadata = {
  title: "Clients",
};

export default function Page() {
  return <ClientsPage />;
}
