import { requireSchool } from "@/lib/session-helpers";
import { prisma } from "@/lib/db";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await requireSchool();
  const school = await prisma.school.findUnique({ where: { id: session.sub } });
  if (!school) return null;

  return (
    <ProfileClient
      school={{
        name: school.name,
        code: school.code,
        email: school.email,
        phone: school.phone || "",
        city: school.city || "",
        state: school.state || "",
        address: school.address || "",
        principal: school.principal || "",
        status: school.status,
      }}
    />
  );
}
