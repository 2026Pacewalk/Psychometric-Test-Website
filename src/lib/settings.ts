import { prisma } from "./db";

export const SETTING_KEYS = {
  joiningFee: "joining_fee",
  upiId: "upi_id",
  qrImage: "qr_image",
  upiName: "upi_name",
} as const;

export async function getSettings() {
  const rows = await prisma.setting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    joiningFee: parseInt(map[SETTING_KEYS.joiningFee] || "5000", 10) || 5000,
    upiId: map[SETTING_KEYS.upiId] || "",
    qrImage: map[SETTING_KEYS.qrImage] || "",
    upiName: map[SETTING_KEYS.upiName] || "AMG Educational Charitable Society",
  };
}

export async function setSetting(key: string, value: string) {
  await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
}
