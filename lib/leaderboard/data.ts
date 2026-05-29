export interface LeaderboardEntry {
  rank: number;
  name: string;
  time: string;
  mistakes: number;
  difficulty: "Easy" | "Medium" | "Hard";
  streak: number;
}

export const LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, name: "Nova", time: "03:42", mistakes: 0, difficulty: "Hard", streak: 12 },
  { rank: 2, name: "Cipher", time: "04:08", mistakes: 1, difficulty: "Hard", streak: 8 },
  { rank: 3, name: "Astra", time: "04:31", mistakes: 0, difficulty: "Medium", streak: 15 },
  { rank: 4, name: "Pixel", time: "05:02", mistakes: 2, difficulty: "Hard", streak: 5 },
  { rank: 5, name: "Echo", time: "05:18", mistakes: 1, difficulty: "Medium", streak: 9 },
  { rank: 6, name: "Flux", time: "05:44", mistakes: 0, difficulty: "Easy", streak: 21 },
  { rank: 7, name: "Lyra", time: "06:01", mistakes: 3, difficulty: "Medium", streak: 4 },
  { rank: 8, name: "Zen", time: "06:27", mistakes: 1, difficulty: "Easy", streak: 11 },
];
