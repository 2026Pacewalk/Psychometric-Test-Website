import type { Metadata } from "next";
import "./globals.css";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "TestPsychometric";

export const metadata: Metadata = {
  metadataBase: new URL("https://testpsychometric.com"),
  title: {
    default: `${siteName} — Psychometric & Career Guidance Portal`,
    template: `%s | ${siteName}`,
  },
  description:
    "Scientific psychometric assessment & career guidance for schools, companies and individuals. Bilingual (English & Punjabi) reports. Operated by AMG Educational Charitable Society.",
  keywords: [
    "psychometric test",
    "career guidance",
    "school assessment",
    "multiple intelligence test",
    "RIASEC",
    "AMG Educational Charitable Society",
    "Punjab",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
