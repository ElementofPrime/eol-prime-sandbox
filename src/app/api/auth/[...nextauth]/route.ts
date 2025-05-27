import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google'; // optional

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // Optional additional provider:
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID!,
    //   clientSecret: process.env.GOOGLE_SECRET!,
    // }),
  ],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
