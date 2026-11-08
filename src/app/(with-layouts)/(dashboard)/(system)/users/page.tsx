import type { Metadata } from "next";
import UsersPage from "./_component";

export const metadata: Metadata = {
  title: "Users",
};

export default function Page() {
  return <UsersPage />;
}
