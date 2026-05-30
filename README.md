# SudoLogic — Premium Puzzle Platform

A modern multi-page SudoLogic web app built with Next.js 15, TypeScript, Tailwind CSS, and the App Router.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, themes, leaderboard preview |
| `/game` | Classic Sudoku gameplay |
| `/daily` | Daily challenge (same puzzle for everyone each day) |
| `/leaderboard` | Top player rankings |
| `/settings` | Theme and preferences |

## Features

- Premium dark UI with 3 themes (Neon Cyberpunk, Ocean, Emerald Luxury)
- Full Sudoku engine: generation, validation, difficulty levels
- Responsive layout with navbar, footer, and mobile navigation
- Theme persistence via localStorage
- Smooth page transitions and scroll animations

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
