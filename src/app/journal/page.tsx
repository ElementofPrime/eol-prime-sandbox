'use client';

import * as React from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function JournalPage() {
  const { data: session } = useSession();
  const isGuest = !session;
  const [entry, setEntry] = React.useState('');
  const [saved, setSaved] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [audioURL, setAudioURL] = React.useState<string | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  const handleSave = async () => {
    if (isGuest) {
      alert('Sign in to save your journal entries.');
      return;
    }

    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        body: JSON.stringify({ content: entry, audioUrl: audioURL }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to save');

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('[JOURNAL_SAVE_ERROR]', err);
      alert('Failed to save journal entry.');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioURL(URL.createObjectURL(blob));
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      alert('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <main className="min-h-screen bg-baseLight dark:bg-baseDark text-black dark:text-white px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">📝 Daily Journal</h1>

      {isGuest && (
        <div className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 p-4 rounded-xl mb-6">
          You’re in guest mode. Sign in to unlock journal saves, reminders, voice notes, and more.
          <br />
          <button
            onClick={() => signIn()}
            className="mt-4 bg-primary hover:bg-accent text-white px-4 py-2 rounded-xl"
          >
            Sign in to Unlock
          </button>
        </div>
      )}

      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your thoughts here..."
        rows={10}
        className="w-full border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 mb-4"
      />

      <div className="flex gap-4 mb-6 items-center flex-wrap">
        <button
          onClick={handleSave}
          className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-accent"
        >
          Save Entry
        </button>
        {saved && <span className="text-green-500 font-medium">✅ Saved!</span>}

        {!recording ? (
          <button
            onClick={startRecording}
            disabled={isGuest}
            className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 disabled:opacity-50"
          >
            🎤 Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
          >
            ⏹ Stop Recording
          </button>
        )}

        {audioURL && (
          <audio controls className="ml-4">
            <source src={audioURL} type="audio/webm" />
          </audio>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-xl text-blue-800 dark:text-blue-200">
        <p className="mb-1 font-semibold">Prime Suggests:</p>
        <ul className="list-disc list-inside text-sm">
          <li>Start with how you feel today</li>
          <li>Reflect on something meaningful</li>
          <li>Try recording your voice or snapping a quick moment</li>
        </ul>
      </div>
    </main>
  );
}
