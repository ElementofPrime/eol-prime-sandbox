import NextAuth from "next-auth";
import { authOptions } from '@/lib/auth/options';

const handler = NextAuth(authOptions);

pages: {
  signIn: '/signin',
}

export { handler as GET, handler as POST }; // ✅ valid route exports only

