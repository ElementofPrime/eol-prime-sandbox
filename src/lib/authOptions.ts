// src/lib/authOptions.ts
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { mongoClientPromise } from "@/lib/mongo"; // from the file we added

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(mongoClientPromise as any),
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
      maxAge: 10 * 60,
    }),
  ],
  pages: {
    signIn: "/signin",
    verifyRequest: "/signin/verify",
  },
  callbacks: {
    async session({ session, user }) {
      if (session?.user && user?.id) (session.user as any).id = user.id;
      return session;
    },
  },
};
