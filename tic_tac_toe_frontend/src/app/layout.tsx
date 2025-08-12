import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "Tic Tac Toe",
  description:
    "A modern, minimalistic Tic Tac Toe game with move history built with Next.js.",
  applicationName: "Tic Tac Toe",
  authors: [{ name: "Tic Tac Toe Frontend" }],
  keywords: ["Tic Tac Toe", "Game", "Next.js", "React"],
  themeColor: "#1976d2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
