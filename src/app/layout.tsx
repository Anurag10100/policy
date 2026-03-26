import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolicyAI — India's Regulatory Intelligence Platform",
  description:
    "AI-powered regulatory intelligence for Indian enterprises. Track policy changes across BFSI, Healthcare, Energy, Education and more.",
  openGraph: {
    title: "PolicyAI — India's Regulatory Intelligence Platform",
    description:
      "AI-powered regulatory intelligence for Indian enterprises.",
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
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
