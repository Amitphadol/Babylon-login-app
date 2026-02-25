import type { Metadata } from "next";
import "./globals.css";
import React from "react";

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
      <body>
        {children}
        <footer style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "15px 19px",
          fontSize: "14px",
          color: "rgba(255,255,255,0.3)",
          fontFamily: "Georgia, serif",
          letterSpacing: "0.08em",
          zIndex: 10,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(10, 10, 15, 0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}>
          &copy; {new Date().getFullYear()} Amit Phadol. All rights reserved.
          {" · "}
          <a href="mailto:amitphadol@gmail.com" style={{ color: "rgba(192,132,252,0.7)", textDecoration: "none" }}>
            amitphadol@gmail.com
          </a>
          {" · "}
          Support:{" "}
          <a href="mailto:amitphadol@gmail.com" style={{ color: "rgba(192,132,252,0.7)", textDecoration: "none" }}>
            amitphadol@gmail.com
          </a>
        </footer>
      </body>
    </html>
  );
}