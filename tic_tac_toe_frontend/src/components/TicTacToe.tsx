"use client";

import React, { useMemo, useState } from "react";

type Player = "X" | "O";
type SquareValue = Player | null;

type WinnerResult =
  | {
      winner: Player;
      line: number[];
    }
  | null;

 // PUBLIC_INTERFACE
/**
 * Determine the winner of a Tic Tac Toe board.
 * @param squares - An array of 9 squares representing the current board state.
 * @returns A WinnerResult containing the winner and the winning line, or null if no winner.
 */
export function calculateWinner(squares: SquareValue[]): WinnerResult {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diags
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a] as Player, line: [a, b, c] };
    }
  }
  return null;
}

 // PUBLIC_INTERFACE
/**
 * Format a move label for the history list.
 * @param moveIndex - The move index in the history.
 * @param position - Optional board index (0-8) where move occurred.
 * @returns Readable label string.
 */
export function formatMoveLabel(moveIndex: number, position?: number): string {
  if (moveIndex === 0) return "Go to game start";
  if (typeof position === "number") {
    const row = Math.floor(position / 3) + 1;
    const col = (position % 3) + 1;
    return `Go to move #${moveIndex} (r${row}, c${col})`;
  }
  return `Go to move #${moveIndex}`;
}

type BoardProps = {
  squares: SquareValue[];
  onSquareClick: (index: number) => void;
  winningLine?: number[] | null;
};

function Square({
  value,
  onClick,
  isWinning,
  disabled,
}: {
  value: SquareValue;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
}) {
  // Base button styles with TailwindCSS using theme variables for color
  const base =
    "flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 border border-gray-200 text-3xl sm:text-4xl font-semibold rounded-md transition-colors";
  const enabled =
    "bg-white hover:bg-gray-50 active:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]";
  const disabledCls = "bg-gray-50";
  const winning =
    "ring-2 ring-offset-2 ring-[var(--color-accent)] text-[var(--color-accent)]";

  return (
    <button
      aria-label={`Square ${value ?? "empty"}`}
      className={[
        base,
        disabled ? disabledCls : enabled,
        isWinning ? winning : "text-gray-800",
      ].join(" ")}
      onClick={onClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
}

function Board({ squares, onSquareClick, winningLine }: BoardProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {squares.map((sq, i) => (
        <Square
          key={i}
          value={sq}
          onClick={() => onSquareClick(i)}
          isWinning={Boolean(winningLine?.includes(i))}
          disabled={Boolean(sq)}
        />
      ))}
    </div>
  );
}

 // PUBLIC_INTERFACE
/**
 * The main Tic Tac Toe interactive component.
 * This component renders:
 * - A centered header
 * - The 3x3 game board
 * - Current status (next player, winner, or draw)
 * - Move history with time-travel capability
 * - Restart button to start a new game
 */
export default function TicTacToe() {
  // history: list of board states; positions: list of last-move positions
  const [history, setHistory] = useState<SquareValue[][]>([
    Array<SquareValue>(9).fill(null),
  ]);
  const [positions, setPositions] = useState<number[]>([NaN]); // position (0-8) for each move, NaN for start
  const [stepNumber, setStepNumber] = useState(0);

  // Derive current board and player from stepNumber
  const current = history[stepNumber];
  const xIsNext = stepNumber % 2 === 0;

  const result = useMemo(() => calculateWinner(current), [current]);
  const isDraw = !result && current.every((s) => s !== null);
  const status = result
    ? `Winner: ${result.winner}`
    : isDraw
    ? "Draw"
    : `Next player: ${xIsNext ? "X" : "O"}`;

  function handleSquareClick(i: number) {
    if (result || current[i] !== null) return;

    const newHistory = history.slice(0, stepNumber + 1);
    const newPositions = positions.slice(0, stepNumber + 1);
    const squares = newHistory[newHistory.length - 1].slice();

    squares[i] = xIsNext ? "X" : "O";
    setHistory([...newHistory, squares]);
    setPositions([...newPositions, i]);
    setStepNumber(newHistory.length); // move forward one step
  }

  function jumpTo(step: number) {
    setStepNumber(step);
  }

  function restart() {
    setHistory([Array<SquareValue>(9).fill(null)]);
    setPositions([NaN]);
    setStepNumber(0);
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--color-primary)]">
          Tic Tac Toe
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Two-player local play. Minimal, modern, light theme.
        </p>
      </header>

      <main className="flex flex-col items-center">
        <Board
          squares={current}
          onSquareClick={handleSquareClick}
          winningLine={result?.line ?? null}
        />

        <section className="w-full mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div
            aria-live="polite"
            className={[
              "text-base sm:text-lg font-medium",
              result
                ? "text-[var(--color-accent)]"
                : isDraw
                ? "text-gray-700"
                : "text-[var(--color-primary)]",
            ].join(" ")}
          >
            {status}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-[var(--color-primary)] text-white hover:opacity-90 active:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            >
              Restart
            </button>
          </div>
        </section>

        <section className="w-full mt-8">
          <h2 className="sr-only">Move History</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {history.map((_, move) => {
              const isCurrent = move === stepNumber;
              return (
                <li key={move}>
                  <button
                    onClick={() => jumpTo(move)}
                    className={[
                      "w-full text-left rounded-md px-3 py-2 text-sm border transition-colors",
                      isCurrent
                        ? "border-[var(--color-primary)] bg-blue-50/60 text-[var(--color-primary)]"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700",
                    ].join(" ")}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {formatMoveLabel(move, positions[move])}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
