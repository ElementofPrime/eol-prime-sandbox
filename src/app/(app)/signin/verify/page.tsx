export default function VerifyRequestPage() {
  return (
    <main className="min-h-screen pt-24 px-4 flex items-start justify-center">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h1 className="text-2xl font-semibold mb-2">Check your email</h1>
        <p className="text-sm opacity-80">
          We sent you a sign-in link. Open it on this device to continue.
        </p>
      </div>
    </main>
  );
}