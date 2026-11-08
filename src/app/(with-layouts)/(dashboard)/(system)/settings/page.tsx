import type { Metadata } from "next";
import SettingsPage from "./_component";

export const metadata: Metadata = {
  title: "Settings",
};

export default function Page() {
  return <SettingsPage />;
}
