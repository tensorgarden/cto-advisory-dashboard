import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CTO Advisory Dashboard — Tech Strategy & Roadmap Planning",
  description:
    "Portfolio demo: fractional CTO dashboard for tech stack assessment, architecture decision records, roadmap planning, and team health metrics.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
