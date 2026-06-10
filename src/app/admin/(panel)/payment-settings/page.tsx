import { getAdminWithPermissions } from "@/lib/session-helpers";
import { redirect } from "next/navigation";
import { getSettings } from "@/lib/settings";
import PaymentSettingsClient from "./PaymentSettingsClient";

export const dynamic = "force-dynamic";

export default async function PaymentSettingsPage() {
  const { permissions } = await getAdminWithPermissions();
  if (!permissions.includes("centres")) redirect("/admin");
  const s = await getSettings();
  return <PaymentSettingsClient settings={{ joiningFee: s.joiningFee, upiId: s.upiId, upiName: s.upiName, hasQr: !!s.qrImage }} />;
}
