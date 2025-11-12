// src/lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { clientPromise } from "@/lib/mongo";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),

  // Use DB sessions (MongoDBAdapter will manage the sessions collection)
  session: { strategy: "database" },

  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: Number(process.env.EMAIL_SERVER_PORT!),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
      },
      from: process.env.EMAIL_FROM!,
      // Magic link validity (seconds). Adjust if you want longer links.
      maxAge: 10 * 60,
    }),
  ],

  pages: {
    signIn: "/signin", // OK if you have this page; otherwise remove
    verifyRequest: "/signin/verify",
  },

  callbacks: {
    session: ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
