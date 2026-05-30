# SudoLogic — Premium Puzzle Platform

A modern multi-page SudoLogic web app built with Next.js 15, TypeScript, Tailwind CSS, and the App Router.

## What is SudoLogic?

SudoLogic is a premium Sudoku platform for puzzle lovers who want more than a basic game. It combines classic Sudoku gameplay with modern design, AI-powered coaching, and daily challenges — all in one place.

## Who is it for?

Puzzle enthusiasts of all levels — from beginners learning Sudoku to advanced players who want a daily mental challenge.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, themes, leaderboard preview |
| `/game` | Classic Sudoku gameplay |
| `/daily` | Daily challenge (same puzzle for everyone each day) |
| `/leaderboard` | Top player rankings |
| `/settings` | Theme and preferences |

## Features

- 🤖 **AI Coach** — Smart hints and explanations powered by Gemini AI
- 🎨 **3 Premium Themes** — Neon Cyberpunk, Ocean, Emerald Luxury
- 📅 **Daily Challenges** — A new puzzle every day
- 🏆 **Leaderboard** — Compete with other players globally
- Full Sudoku engine: generation, validation, difficulty levels
- Responsive layout with navbar, footer, and mobile navigation
- Theme persistence via localStorage
- Smooth page transitions and scroll animations

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Auth:** NextAuth.js
- **AI:** Gemini API
- **Deployment:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/                    # Next.js App Router pages
components/
  layout/               # Navbar, Footer, SiteShell
  landing/              # Landing page sections
  sudoku/               # Game UI components
  theme/                # Theme system
  daily/                # Daily challenge
  leaderboard/          # Leaderboard table
  settings/             # Settings panel
hooks/                  # useSudokuGame, useTimer, useInView
lib/
  sudoku/               # Game logic
  themes/               # Theme tokens
  daily/                # Daily puzzle seeding
  leaderboard/          # Mock leaderboard data
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Run production server |

## Live Demo

🔗 [sudoku-platform.vercel.app](https://sudoku-platform.vercel.app)

---

Built with ❤️ by Marzhan Mamatova
