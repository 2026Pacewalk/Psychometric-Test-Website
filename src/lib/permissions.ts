import { Role } from "./auth";

// Permission keys used across the super-admin dashboard.
export const PERMISSIONS = [
  "schools",
  "companies",
  "centres",
  "individuals",
  "students",
  "results",
  "questions",
  "scoring",
  "content",
  "careers",
  "payments",
  "pricing",
  "leads",
  "admins",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const PERMISSION_LABELS: Record<Permission, string> = {
  schools: "Manage Schools",
  companies: "Manage Companies",
  centres: "Manage Study Centres",
  individuals: "Manage Individual Users",
  students: "Manage Students",
  results: "View Results & Reports",
  questions: "Manage Questions",
  scoring: "Manage Scoring Logic",
  content: "Manage Website Content",
  careers: "Manage Career Suggestions",
  payments: "Manage Payments",
  pricing: "Manage Pricing",
  leads: "Manage Leads & Inquiries",
  admins: "Manage Admin Users",
};

// Default permissions by role.
export function defaultPermissions(role: Role): Permission[] {
  switch (role) {
    case "superadmin":
      return [...PERMISSIONS];
    case "admin":
      return ["schools", "students", "results", "leads", "content"];
    case "viewer":
      return ["results"];
    default:
      return [];
  }
}

export function effectivePermissions(
  role: Role,
  stored: string | null | undefined
): Permission[] {
  if (role === "superadmin") return [...PERMISSIONS];
  try {
    const parsed = stored ? (JSON.parse(stored) as Permission[]) : [];
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    /* ignore */
  }
  return defaultPermissions(role);
}

export function can(perms: Permission[], key: Permission): boolean {
  return perms.includes(key);
}
