// src/lib/authOptions.ts
import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { clientPromise } from "@/lib/mongo";

const isDev = process.env.NODE_ENV === "development";
const hasSMTP = !!process.env.EMAIL_SERVER;

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!process.env.MONGODB_URI) {
          if (credentials?.email) {
            return { id: "demo", name: "Demo User", email: credentials.email };
          }
          return null;
        }
        return null;
      },
    }),
    ...(hasSMTP
      ? [
          EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
          }),
        ]
      : []),
  ],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt" as const, // ← EXPLICIT
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
