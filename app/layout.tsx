import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Babylon Login App",
  description: "Firebase Authentication with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}