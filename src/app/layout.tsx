import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "NoteNurse AI - Nursing documentation from the conversation", template: "%s | NoteNurse AI" },
  description:
    "NoteNurse AI turns bedside conversations into source-linked draft nursing notes that nurses review and verify before they chart.",
  openGraph: { title: "NoteNurse AI", description: "Draft nursing notes from the conversation. Review every line against its source.", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
