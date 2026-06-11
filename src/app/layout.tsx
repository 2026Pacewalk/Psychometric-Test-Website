import type { Metadata } from "next";
import { Inter, Noto_Sans_Gurmukhi } from "next/font/google";
import "./globals.css";

// Self-hosted via next/font with unique internal family names — immune to any
// broken/symbol font of the same name installed on a visitor's machine.
const fontSans = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
const fontPunjabi = Noto_Sans_Gurmukhi({
  subsets: ["gurmukhi"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-punjabi",
});

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
    <html lang="en" className={`${fontSans.variable} ${fontPunjabi.variable}`}>
      <body>{children}</body>
    </html>
  );
}
