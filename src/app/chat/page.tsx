import { motion } from 'framer-motion';
import ChatClient from '@/components/ChatClient'; // this stays a client component

export const dynamic = 'force-dynamic'; // ok on a server file
export default function ChatPage() {
  return <ChatClient />;
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-4"
        style={{ fontFamily: 'var(--font-greatvibes), cursive' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        You Weren’t Meant to Do This Alone
      </motion.h1>
      </div>
   }
