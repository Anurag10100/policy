import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolicyAI — India's AI-Powered Policy Intelligence Platform",
  description:
    "AI-summarized regulatory updates across BFSI, Healthcare, Energy & EdTech. Stay ahead of policy changes that impact your business.",
  openGraph: {
    title: "PolicyAI — India's AI-Powered Policy Intelligence Platform",
    description:
      "AI-summarized regulatory updates across BFSI, Healthcare, Energy & EdTech.",
    url: "https://policyai.com",
    siteName: "PolicyAI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
