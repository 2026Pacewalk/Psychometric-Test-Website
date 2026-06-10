import { requireCentre } from "@/lib/session-helpers";
import { prisma } from "@/lib/db";
import CentreProfileClient from "./CentreProfileClient";

export const dynamic = "force-dynamic";

export default async function CentreProfilePage() {
  const session = await requireCentre();
  const c = await prisma.studyCentre.findUnique({ where: { id: session.sub } });
  if (!c) return null;
  return (
    <CentreProfileClient
      centre={{
        name: c.name, code: c.code, email: c.email, ownerName: c.ownerName || "", mobile: c.mobile || "",
        city: c.city || "", district: c.district || "", state: c.state || "", address: c.address || "",
        status: c.status, commissionPercent: c.commissionPercent,
      }}
    />
  );
}
