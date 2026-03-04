import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Growatt OpenAPI Docs",
  description: "Customer-friendly Growatt OpenAPI HTML documentation site.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="font-sans">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
