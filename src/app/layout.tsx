import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "NoteNurse AI: AI-native nursing documentation", template: "%s | NoteNurse AI" },
  description:
    "NoteNurse AI analyzes bedside conversations, drafts source-linked nursing notes and automates handoffs for nursing organizations.",
  openGraph: { title: "NoteNurse AI", description: "The AI intelligence layer for nursing documentation.", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
