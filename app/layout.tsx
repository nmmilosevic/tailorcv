import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TailorCV",
  description:
    "Rewrite your resume to match a job offer while staying truthful, realistic, and ATS-friendly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
