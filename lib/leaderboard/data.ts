export interface LeaderboardEntry {
  rank: number;
  name: string;
  city: string;
  diamonds: number;
  time: string;
  mistakes: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

export const LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, name: "Aizat", city: "Almaty", diamonds: 950, difficulty: "Hard", mistakes: 0, time: "03:42" },
  { rank: 2, name: "Marzhan", city: "Almaty", diamonds: 880, difficulty: "Hard", mistakes: 1, time: "04:08" },
  { rank: 3, name: "Dias", city: "Astana", diamonds: 820, difficulty: "Medium", mistakes: 0, time: "04:31" },
  { rank: 4, name: "Ainur", city: "Shymkent", diamonds: 760, difficulty: "Hard", mistakes: 2, time: "05:02" },
  { rank: 5, name: "Timur", city: "Almaty", diamonds: 700, difficulty: "Medium", mistakes: 1, time: "05:18" },
  { rank: 6, name: "Zarina", city: "Astana", diamonds: 650, difficulty: "Easy", mistakes: 0, time: "05:44" },
  { rank: 7, name: "Nursultan", city: "Karaganda", diamonds: 600, difficulty: "Medium", mistakes: 3, time: "06:01" },
  { rank: 8, name: "Aliya", city: "Almaty", diamonds: 550, difficulty: "Easy", mistakes: 1, time: "06:27" },
  { rank: 9, name: "Milana", city: "Almaty", diamonds: 510, difficulty: "Medium", mistakes: 2, time: "06:45" },
  { rank: 10, name: "Zhavokhir", city: "Tashkent", diamonds: 480, difficulty: "Hard", mistakes: 3, time: "07:02" },
  { rank: 11, name: "Dastan", city: "Astana", diamonds: 450, difficulty: "Medium", mistakes: 1, time: "07:18" },
  { rank: 12, name: "Asylzat", city: "Almaty", diamonds: 420, difficulty: "Easy", mistakes: 0, time: "07:35" },
  { rank: 13, name: "Dilyara", city: "Shymkent", diamonds: 390, difficulty: "Medium", mistakes: 2, time: "07:52" },
];
