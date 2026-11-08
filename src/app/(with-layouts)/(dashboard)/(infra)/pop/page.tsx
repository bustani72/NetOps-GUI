import type { Metadata } from "next";
import PopPage from "./_component";

export const metadata: Metadata = {
  title: "POP",
};

export default function Page() {
  return <PopPage />;
}
