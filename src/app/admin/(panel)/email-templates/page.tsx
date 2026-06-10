import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import EmailTemplatesClient, { Tpl } from "./EmailTemplatesClient";

export const dynamic = "force-dynamic";

export default async function EmailTemplatesPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("content")) redirect("/admin");

  const templates = await prisma.emailTemplate.findMany({ orderBy: { category: "asc" } });
  const rows: Tpl[] = templates.map((t) => ({ key: t.key, category: t.category, subject: t.subject, body: t.body }));
  return <EmailTemplatesClient rows={rows} />;
}
