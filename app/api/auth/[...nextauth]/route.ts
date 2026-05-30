import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // For demo: hardcoded users (replace with DB later)
        const users = [
          { id: "1", email: "test@test.com", password: "password123", name: "Player" },
        ];
        const user = users.find((u) => u.email === credentials?.email);
        if (user && user.password === credentials?.password) {
          return { id: user.id, email: user.email, name: user.name };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
