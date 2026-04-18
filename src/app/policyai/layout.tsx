import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PolicyAI — Regulatory Research Platform",
};

export default function PolicyAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="policyai-root min-h-screen">{children}</div>;
}
