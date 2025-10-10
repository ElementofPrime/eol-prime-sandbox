export const dynamic = 'force-dynamic'; // ok on a server file

import ChatClient from '@/components/ChatClient'; // this stays a client component

export default function ChatPage() {
  return <ChatClient />;
}
