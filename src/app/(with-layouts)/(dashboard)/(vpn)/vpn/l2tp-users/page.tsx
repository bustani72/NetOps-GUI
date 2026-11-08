import type { Metadata } from "next";
import L2tpUsersPage from "./_component";

export const metadata: Metadata = {
  title: "L2TP Users",
};

export default function Page() {
  return <L2tpUsersPage />;
}
