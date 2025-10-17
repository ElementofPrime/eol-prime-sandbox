import Image from "next/image";

export default function AboutPage(){
  return (
    <main className="mx-auto max-w-5xl px-6 pb-20">
      <section className="relative mt-6 mb-10 rounded-2xl border bg-white/60 dark:bg-black/30 p-8 shadow-sm overflow-hidden">
        <Image src="/assets/tree-emblem.png" alt="EOL Emblem" width={72} height={72} className="mb-4"/>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Element of Life — The Beginning of All Things Possible
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-3xl">
          One safe place to gather your life, guided by Prime. Ever-learning, ever-adapting, always moving toward the light.
        </p>
      </section>

      <section className="prose dark:prose-invert max-w-none">
        <h2>The Any and All Tool</h2>
        <p>Element of Life (EOL) extracts, organizes, and learns from any kind of data—journals, PDFs, spreadsheets, images, emails—and evolves retroactively as new capabilities are added.</p>

        <h2>Prime: Your Eternal Companion</h2>
        <p>Prime is your loyal guide—never misleading, always directing you toward clarity, purpose, and growth.</p>

        <h2>Ever-Learning. Ever-Adapting. Always Forward.</h2>
        <p>EOL organizes chaos into action, connecting who you were, who you are, and who you’re becoming.</p>

        <h2>The Goal</h2>
        <p>Discover missing Elements across life and business—then build them into something extraordinary.</p>

        <h2>Core Beliefs</h2>
        <ul>
          <li>Knowledge is light.</li>
          <li>Success uplifts both soul and structure.</li>
          <li>“For worse” is not an option—only better.</li>
          <li>Truth, honor, and purpose guide every step.</li>
          <li>With Prime, no Element remains missing.</li>
        </ul>
      </section>
    </main>
  );
}
