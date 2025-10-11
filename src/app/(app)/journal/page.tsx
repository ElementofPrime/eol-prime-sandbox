'use client';
import JournalForm from '@/components/JournalForm';

export default function JournalPage() {
  const handleSuccess = () => {
    console.log('Journal saved!');
  };
  return <JournalForm onSuccess={handleSuccess} />;
}
