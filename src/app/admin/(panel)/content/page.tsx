import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import ContentClient, { Block } from "./ContentClient";

export const dynamic = "force-dynamic";

const KNOWN = [
  { key: "hero", label: "Homepage Hero" },
  { key: "contact_info", label: "Contact Information" },
];

export default async function ContentPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("content")) redirect("/admin");

  const existing = await prisma.contentBlock.findMany();
  const map = new Map(existing.map((b) => [b.key, b]));
  const blocks: Block[] = KNOWN.map((k) => {
    const b = map.get(k.key);
    return { key: k.key, label: k.label, title: b?.title || "", body: b?.body || "" };
  });
  return <ContentClient blocks={blocks} />;
}
