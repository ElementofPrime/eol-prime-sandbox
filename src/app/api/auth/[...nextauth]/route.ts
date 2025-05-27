import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth'; // ✅ THIS IS NOW SAFE

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
