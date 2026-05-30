"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = useMemo(
    () => searchParams.get("callbackUrl") ?? "/game",
    [searchParams]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(result?.url ?? callbackUrl);
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
            <h1 className="text-3xl font-bold gradient-text">Welcome back</h1>
            <p className="mt-2 text-sm text-themed-muted">
              Sign in to continue your Sudoku journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
                className="mt-2 w-full glass-panel px-4 py-3 text-sm text-themed-primary placeholder:text-themed-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                placeholder="Your password"
              />
            </label>

            {error && (
              <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-glow inline-flex w-full items-center justify-center rounded-2xl bg-gradient-accent bg-[length:200%_200%] px-6 py-3.5 text-base font-semibold text-white border border-white/20 shadow-btn-primary animate-gradient-shift transition-all duration-300 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:opacity-40"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-themed-muted">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-themed-primary hover:text-accent-hover">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}


export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInForm />
    </Suspense>
  );
}

function SignInFallback() {
  return (
    <main className="min-h-dvh bg-mesh px-4 py-12 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-md glass-card-lg bg-gradient-premium p-8 text-center">
        <p className="text-themed-muted">Loading sign in...</p>
      </div>
    </main>
  );
}
