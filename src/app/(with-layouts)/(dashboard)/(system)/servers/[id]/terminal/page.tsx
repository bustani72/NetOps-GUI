import type { Metadata } from "next";
import TerminalClient from "./_component";

export const metadata: Metadata = {
  title: "Terminal",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TerminalClient serverId={Number(id)} />;
}
