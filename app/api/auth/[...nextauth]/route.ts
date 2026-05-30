import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/users";

function getHandler() {
  return NextAuth({
    providers: [
      CredentialsProvider({
        name: "Email",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const email = credentials?.email;
          const password = credentials?.password;
          if (!email || !password) return null;

          const user = await findUserByEmail(email);
          if (!user) return null;

          const passwordMatches = await bcrypt.compare(password, user.passwordHash);
          if (!passwordMatches) return null;

          return { id: user.id, email: user.email, name: user.name };
        },
      }),
    ],
    pages: {
      signIn: "/auth/signin",
    },
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
  });
}

export async function GET(req: Request, ctx: unknown) {
  return getHandler()(req as any, ctx as any);
}

export async function POST(req: Request, ctx: unknown) {
  return getHandler()(req as any, ctx as any);
}