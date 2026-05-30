import { promises as fs } from "fs";
import path from "path";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

const usersFilePath = path.join(process.cwd(), "lib", "users.json");

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function readUsers(): Promise<StoredUser[]> {
  try {
    const contents = await fs.readFile(usersFilePath, "utf8");
    const parsed = JSON.parse(contents) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function writeUsers(users: StoredUser[]): Promise<void> {
  await fs.writeFile(usersFilePath, `${JSON.stringify(users, null, 2)}
`, "utf8");
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const normalizedEmail = normalizeEmail(email);
  const users = await readUsers();
  return users.find((user) => normalizeEmail(user.email) === normalizedEmail) ?? null;
}
