import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContextIQ — Autonomous Customer Success",
  description: "The autonomous customer success platform that replaces your entire CS team with AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-text-primary antialiased noise-subtle">{children}</body>
    </html>
  );
}
