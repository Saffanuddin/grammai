import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "GramAI Connect — Government Benefits, Made Simple for Every Citizen",
  description: "AI-powered digital Gram Panchayat: discover welfare schemes, check eligibility, understand documents in English, Telugu & Hindi, prepare applications and track Panchayat complaints.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
