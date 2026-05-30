"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { CellPosition } from "@/lib/sudoku";
import { Button } from "@/components/ui/Button";

interface AICoachProps {
  isOpen: boolean;
  onClose: () => void;
  board: number[][];
  selected: CellPosition | null;
  solution: number[][];
  given: boolean[][];
}

interface ChatMessage {
  id: number;
  role: "bot" | "user";
  content: string;
}

const QUICK_PROMPTS = [
  "Why can't I place 5 here?",
  "What strategy should I use?",
  "Explain naked singles",
  "Give me a hint for this cell",
  "How do I solve this faster?",
];

const WELCOME_MESSAGE =
  "Hi! I'm SudoBot 🤖 Select a cell on the board and I'll help you figure out what goes there!";

export function AICoach({
  isOpen,
  onClose,
  board,
  selected,
  solution,
  given,
}: AICoachProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: "bot", content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextMessageId = useRef(2);

  const boardContext = useMemo(
    () => buildBoardContext(board, selected, solution, given),
    [board, selected, solution, given]
  );

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages, isLoading]);

  if (!isOpen) return null;

  const sendMessage = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    const userMessage = `${trimmed}

Current board context:
${boardContext}`;
    const visibleUserMessage = trimmed;

    setMessages((current) => [
      ...current,
      { id: nextMessageId.current++, role: "user", content: visibleUserMessage },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are an expert Sudoku coach named SudoBot. 
    You help players understand WHY a number fits or doesn't fit in a cell.
    You teach solving strategies like: naked singles, hidden singles, 
    pointing pairs, box-line reduction, X-wing.
    Always be encouraging and explain step by step.
    Keep responses concise — max 3-4 sentences per explanation.
    Always end with a helpful tip or next step.`,
          messages: [
            {
              role: "user",
              content: userMessage,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API returned ${response.status}`);
      }

      const data = await response.json();
      const botReply = extractClaudeText(data);
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId.current++,
          role: "bot",
          content:
            botReply ||
            "I could not read SudoBot's answer, but try checking the selected row, column, and 3x3 box for missing numbers.",
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId.current++,
          role: "bot",
          content:
            "I could not reach SudoBot right now. Try listing the candidates for the selected cell, then compare them against its row, column, and 3x3 box.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-coach-title"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-2xl max-h-[min(42rem,90vh)] flex-col glass-card-lg bg-gradient-premium p-5 sm:p-6 text-left animate-slide-up"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-0 rounded-3xl bg-card-overlay pointer-events-none" aria-hidden />

        <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-xl glass-panel text-themed-muted transition-colors hover:text-themed-primary hover:bg-themed-glass-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            aria-label="Close AI Coach"
          >
            X
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-themed-muted">
            Strategy coach
          </p>
          <h2 id="ai-coach-title" className="mt-2 pr-12 text-2xl sm:text-3xl font-bold gradient-text">
            AI Coach 🤖
          </h2>
          <p className="mt-2 text-sm text-themed-muted">
            Ask SudoBot about candidates, strategies, and your selected cell.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void sendMessage(prompt)}
                disabled={isLoading}
                className="glass-panel px-3 py-2 text-xs font-medium text-themed-muted transition-colors hover:text-themed-primary hover:bg-themed-glass-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:opacity-40"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "bot" && (
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                    🤖
                  </span>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-gradient-accent text-white"
                      : "glass-panel text-themed-muted"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-themed-glass">
                    👤
                  </span>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start gap-2">
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                  🤖
                </span>
                <div className="glass-panel px-4 py-3 text-sm text-themed-muted">
                  SudoBot is thinking<span className="animate-pulse">...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask SudoBot a Sudoku question..."
              className="min-w-0 flex-1 rounded-xl glass-panel px-4 py-3 text-sm text-themed-primary placeholder:text-themed-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              disabled={isLoading}
            />
            <Button type="submit" variant="primary" size="md" disabled={!input.trim() || isLoading}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function buildBoardContext(
  board: number[][],
  selected: CellPosition | null,
  solution: number[][],
  given: boolean[][]
): string {
  const boardRows = board.map((row) => row.map((value) => value || ".").join(" "));
  const boardText = boardRows.join("\n");

  if (!selected) {
    return [
      "No cell is currently selected.",
      `Board:\n${boardText}`,
    ].join("\n");
  }

  const { row, col } = selected;
  const rowValues = uniqueNonZero(board[row] ?? []);
  const columnValues = uniqueNonZero(board.map((boardRow) => boardRow[col] ?? 0));
  const boxValues = uniqueNonZero(getBoxValues(board, row, col));
  const validMoves = getValidMoves(board, row, col);
  const selectedValue = board[row]?.[col] ?? 0;
  const solutionValue = solution[row]?.[col] ?? 0;
  const isGiven = Boolean(given[row]?.[col]);

  return [
    `Selected cell: row ${row + 1}, column ${col + 1}`,
    `Selected cell current value: ${selectedValue || "empty"}`,
    `Selected cell is given: ${isGiven ? "yes" : "no"}`,
    `Correct solution value for selected cell: ${solutionValue || "unknown"}`,
    `Numbers already in row ${row + 1}: ${formatNumberList(rowValues)}`,
    `Numbers already in column ${col + 1}: ${formatNumberList(columnValues)}`,
    `Numbers already in this 3x3 box: ${formatNumberList(boxValues)}`,
    `Valid moves for selected cell: ${formatNumberList(validMoves)}`,
    `Board:\n${boardText}`,
  ].join("\n");
}

function getValidMoves(board: number[][], row: number, col: number): number[] {
  if (board[row]?.[col]) return [];

  const valid: number[] = [];
  for (let value = 1; value <= 9; value++) {
    if (
      !board[row]?.includes(value) &&
      !board.some((boardRow) => boardRow[col] === value) &&
      !getBoxValues(board, row, col).includes(value)
    ) {
      valid.push(value);
    }
  }
  return valid;
}

function getBoxValues(board: number[][], row: number, col: number): number[] {
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  const values: number[] = [];

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      values.push(board[r]?.[c] ?? 0);
    }
  }

  return values;
}

function uniqueNonZero(values: number[]): number[] {
  return Array.from(new Set(values.filter((value) => value !== 0))).sort();
}

function formatNumberList(values: number[]): string {
  return values.length > 0 ? values.join(", ") : "none";
}

function extractClaudeText(data: unknown): string {
  if (!data || typeof data !== "object" || !("content" in data)) return "";
  const content = (data as { content?: unknown }).content;
  if (!Array.isArray(content)) return "";

  return content
    .map((part) => {
      if (part && typeof part === "object" && "text" in part) {
        const text = (part as { text?: unknown }).text;
        return typeof text === "string" ? text : "";
      }
      return "";
    })
    .filter(Boolean)
    .join("\n");
}
