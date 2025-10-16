export default function AboutPage() {
  return (
    <div className="relative mx-auto max-w-4xl w-full px-4 overflow-visible">
      <h1 className="text-2xl md:text-3xl font-semibold text-slate-100 mb-4">About Element of Life</h1>

      <p className="text-slate-300 leading-relaxed mb-6">
        Element of Life (EOL) is your “Any and All” tool — an AI sidekick designed to help you
        focus, grow, and transform. Prime, our assistant, adapts as your work and life evolve.
      </p>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-cyan-400">Mission</h2>
        <p className="text-slate-300">
          Build a future-proof personal OS that ingests data, learns patterns, and turns them into
          clear action — with integrity and simplicity.
        </p>
      </section>

      <section className="space-y-2 mt-6">
        <h2 className="text-lg font-semibold text-cyan-400">What’s inside</h2>
        <ul className="list-disc list-inside text-slate-300 space-y-1">
          <li>Chat — Prime for guidance and build support</li>
          <li>Journal — structured capture with intelligence (next milestone)</li>
          <li>Tasks & Reminders — focus and follow-through</li>
          <li>Core — your fundamental elements and identity work</li>
        </ul>
      </section>

      <section className="space-y-2 mt-6">
        <h2 className="text-lg font-semibold text-cyan-400">Origins</h2>
        <p className="text-slate-300">
          Inspired by decades of hands-on business, design, and systems building — Element of Life
          brings those lessons together into a single, evolving tool.
        </p>
      </section>
    </div>
  );
}
