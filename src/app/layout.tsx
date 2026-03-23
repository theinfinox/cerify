import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CertifyBulk - High-Res Certificate Generator",
  description: "Production-ready high resolution exporter with Neo-Brutalist design",
  manifest: "/manifest.json",
  themeColor: "#0d0d0d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
