"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "Explain naked singles",
  "What is X-Wing strategy?",
  "Tips for beginners",
  "How to solve faster?",
  "Explain hidden pairs",
  "What is pointing pairs?",
];

const WELCOME_MESSAGE = "Hi! I'm SudoBot 🤖 Ask me anything about Sudoku!";

export function AICoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.text ?? "Sorry, I couldn't respond.",
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "SudoBot could not connect right now. Try again in a moment ✨",
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

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="relative glass-card-lg bg-gradient-premium p-5 sm:p-8 overflow-hidden">
        <div className="absolute inset-0 bg-card-overlay pointer-events-none" aria-hidden />

        <div className="relative z-[1] flex min-h-[70vh] flex-col">
          <header className="text-center">
            <h1 className="text-3xl sm:text-5xl font-bold gradient-text">
              AI Coach 🤖
            </h1>
            <p className="mt-3 text-sm sm:text-base text-themed-muted">
              Your personal Sudoku trainer
            </p>
          </header>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void sendMessage(prompt)}
                disabled={isLoading}
                className="glass-panel px-3 py-2 text-xs sm:text-sm font-medium text-themed-muted transition-all duration-200 hover:text-themed-primary hover:bg-themed-glass-hover hover:border-themed-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:opacity-40"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-1">
            {messages.map((message, index) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
                  className={`flex gap-3 animate-fade-in ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                      🤖
                    </span>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm sm:text-base leading-7 ${
                      isUser
                        ? "bg-gradient-accent text-white shadow-glow-sm"
                        : "glass-panel text-themed-muted"
                    }`}
                  >
                    <p className="mb-1 text-xs font-semibold text-themed-primary">
                      {isUser ? "You" : "SudoBot"}
                    </p>
                    {message.content}
                  </div>
                  {isUser && (
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-themed-glass">
                      👤
                    </span>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start gap-3 animate-fade-in">
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                  🤖
                </span>
                <div className="glass-panel px-4 py-3 text-sm text-themed-muted">
                  SudoBot is thinking... ✨
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about a Sudoku strategy..."
              disabled={isLoading}
              className="glass-panel min-w-0 flex-1 px-4 py-3 text-sm text-themed-primary placeholder:text-themed-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="btn-glow inline-flex items-center justify-center rounded-xl bg-gradient-accent bg-[length:200%_200%] px-6 py-3 text-sm font-semibold text-white shadow-btn-primary transition-all duration-300 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
