import type { Metadata } from "next";
import CoresPage from "./_component";

export const metadata: Metadata = {
  title: "Cores",
};

export default function Page() {
  return <CoresPage />;
}
