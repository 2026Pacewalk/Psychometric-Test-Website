import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import QuestionsClient, { QRow } from "./QuestionsClient";

export const dynamic = "force-dynamic";

export default async function QuestionsPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("questions")) redirect("/admin");

  const questions = await prisma.question.findMany({ orderBy: { order: "asc" } });
  const rows: QRow[] = questions.map((q) => ({
    id: q.id,
    order: q.order,
    textEn: q.textEn,
    textPa: q.textPa,
    skill: q.skill,
    reverse: q.reverse,
    active: q.active,
  }));
  return <QuestionsClient rows={rows} />;
}
