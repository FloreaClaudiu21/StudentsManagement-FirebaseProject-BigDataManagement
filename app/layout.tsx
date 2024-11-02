import type { Metadata } from "next";
import "./globals.css";
import "./lib/firebase";

export const metadata: Metadata = {
  title: "Project Firebase - Big Data Management",
  description: "Application made for the 'Big Data Management' lecture",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
