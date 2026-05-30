"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to create account.");
        return;
      }

      setSuccess("Account created! Redirecting to sign in...");
      window.setTimeout(() => router.push("/auth/signin"), 900);
    } catch (error) {
      setError("Unable to create account right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-mesh px-4 py-12 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-md glass-card-lg bg-gradient-premium p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-card-overlay pointer-events-none" aria-hidden />
        <div className="relative z-[1]">
          <Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-3 group">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-accent text-lg font-bold text-white shadow-glow-sm transition-transform group-hover:scale-105">
              S
            </span>
            <span className="text-2xl font-bold gradient-text">SudoLogic</span>
          </Link>

          <div className="text-center">
            <h1 className="text-3xl font-bold gradient-text">Create account</h1>
            <p className="mt-2 text-sm text-themed-muted">
              Start saving progress and competing as a player.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-themed-muted">Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="mt-2 w-full glass-panel px-4 py-3 text-sm text-themed-primary placeholder:text-themed-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                placeholder="Player"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-themed-muted">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full glass-panel px-4 py-3 text-sm text-themed-primary placeholder:text-themed-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-themed-muted">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                className="mt-2 w-full glass-panel px-4 py-3 text-sm text-themed-primary placeholder:text-themed-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                placeholder="At least 8 characters"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-themed-muted">Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={8}
                className="mt-2 w-full glass-panel px-4 py-3 text-sm text-themed-primary placeholder:text-themed-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                placeholder="Repeat your password"
              />
            </label>

            {error && (
              <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-glow inline-flex w-full items-center justify-center rounded-2xl bg-gradient-accent bg-[length:200%_200%] px-6 py-3.5 text-base font-semibold text-white border border-white/20 shadow-btn-primary animate-gradient-shift transition-all duration-300 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:opacity-40"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-themed-muted">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-semibold text-themed-primary hover:text-accent-hover">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
