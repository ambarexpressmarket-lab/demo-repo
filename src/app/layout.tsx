import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task List Demo",
  description: "Next.js + Tailwind + API demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
