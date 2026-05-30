import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", normalizeEmail(email))
    .single();
  if (error || !data) return null;
  return data as StoredUser;
}

export async function readUsers(): Promise<StoredUser[]> {
  const { data, error } = await supabase.from("users").select("*");
  if (error || !data) return [];
  return data as StoredUser[];
}

export async function writeUsers(users: StoredUser[]): Promise<void> {}

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<StoredUser> {
  const passwordHash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from("users")
    .insert([{
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizeEmail(email),
      passwordHash
    }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as StoredUser;
}