"use client";

export const dynamic = "force-static";
export const revalidate = false;

import TicTacToe from "../components/TicTacToe";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex items-start sm:items-center justify-center">
      <TicTacToe />
    </main>
  );
}
