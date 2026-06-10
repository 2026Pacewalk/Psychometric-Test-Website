import { NextRequest, NextResponse } from "next/server";
import { guardAdmin } from "@/lib/api-guard";
import { ConvertTarget, nextCode, tempPassword } from "@/lib/convert";

const TARGETS = ["school", "company", "centre", "individual"];

export async function GET(req: NextRequest) {
  const g = await guardAdmin("leads");
  if ("error" in g) return g.error;

  const target = req.nextUrl.searchParams.get("target") || "";
  if (!TARGETS.includes(target)) return NextResponse.json({ error: "Invalid target." }, { status: 400 });

  // Individuals log in by email, so no code username — just a temp password.
  const username = target === "individual" ? "" : await nextCode(target as ConvertTarget);
  return NextResponse.json({ username, password: tempPassword() });
}
