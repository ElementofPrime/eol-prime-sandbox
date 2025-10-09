import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TEMP: accept any non-empty email/pw so we can boot
        if (credentials?.email && credentials?.password) {
          return { id: "1", name: "Prime User", email: credentials.email };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.JWT_SECRET,
};
