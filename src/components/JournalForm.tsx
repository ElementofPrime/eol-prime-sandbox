'use client';
import JournalForm from '@/components/JournalForm';

export default function JournalPage() {
  const handleSuccess = () => {
    // e.g., show a toast, or route somewhere
    // router.push('/'); // if you want a redirect
  };
  return <JournalForm onSuccess={handleSuccess} />;
}