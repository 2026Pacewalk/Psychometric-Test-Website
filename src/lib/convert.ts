import { randomBytes } from "crypto";
import { prisma } from "./db";

export type ConvertTarget = "school" | "company" | "centre" | "individual";

const PREFIX: Record<Exclude<ConvertTarget, "individual">, string> = {
  school: "SCH",
  company: "CMP",
  centre: "STC",
};

export function tempPassword(len = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const b = randomBytes(len);
  let s = "";
  for (let i = 0; i < len; i++) s += chars[b[i] % chars.length];
  return s;
}

export async function nextCode(target: ConvertTarget): Promise<string> {
  if (target === "individual") return "USR" + tempPassword(4).toUpperCase();
  const prefix = PREFIX[target];
  const model: any =
    target === "school" ? prisma.school : target === "company" ? prisma.company : prisma.studyCentre;
  const count = await model.count();
  let n = count + 1;
  for (let i = 0; i < 10000; i++) {
    const code = prefix + String(n).padStart(4, "0");
    const exists = await model.findUnique({ where: { code } });
    if (!exists) return code;
    n++;
  }
  return prefix + Date.now().toString().slice(-4);
}

export const LOGIN_URL: Record<ConvertTarget, string> = {
  school: "/school-login",
  company: "/company-login",
  centre: "/centre-login",
  individual: "/individual/login",
};
