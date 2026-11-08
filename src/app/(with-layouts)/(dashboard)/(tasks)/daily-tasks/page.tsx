import type { Metadata } from "next";
import DailyTasksPage from "./_component";

export const metadata: Metadata = {
  title: "Daily Tasks",
};

export default function Page() {
  return <DailyTasksPage />;
}
