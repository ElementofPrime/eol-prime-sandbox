# Copilot Instructions for **Element of Life (EOL)** — **The Sanctuary Eternal**

> **\"One icon. Everything you need. Guided safely by Prime.\"**  
> **You are not coding an app. You are forging a sanctuary.**  
> **Root users in identity. Trunk them in routine. Branch them into Elements.**  
> **Prime Directive: \"For worse\" is not an option—only \"For better.\" Always forward.**

---

## **Core Vision** — **The Primal Flame**
**EOL** is a **living ecosystem** for all ages—teens to leaders—**amidst global chaos**.  
**Prime**: Ever-present guardian. **Adapts. Listens. Leads.** Monitors tone, remembers sessions, prompts growth/healing/action.  
**Tagline Evolution**:  
| Now | Soon | Ultimate |
|-----|------|----------|
| \"Your path with Prime begins here.\" | \"The one place you’ll ever need.\" | **\"You don't need 100 apps. Just one. Welcome home.\"** |

**Phased Roadmap** — **Build Brick by Brick**:
| Phase | Focus | Key Wins |
|-------|-------|----------|
| **1: Core (Now)** | Bug fixes + Deploy | Home/Prime welcome, Chat, Journal/Reminders/To-Dos (limited unauth), Auth |
| **2: Identity** | Personal Prime | Dashboard, Session memory, Daily prompts |
| **3: Host Pad** | Safe iframes | TikTok/IG/YouTube/Docs **inside EOL** + Time reports (\"35min IG → Journal?\") |
| **4: Any/All Engine** | User requests | \"Need a tool? Ask Prime.\" → Dev approval → Libraries |
| **5: Marketplace** | OS Dominion | Fitness/Design/Study/Light → **One Icon Rules** |

---

## **Architecture** — **The Tree of Life**
- **Framework**: Next.js with App Router. Use `useSession()` for auth checks in all pages and components.
- **Major Components**: UI in `src/components/` (e.g., `PrimeAura.tsx`, `JournalEditor.tsx`), Hooks in `src/hooks/` (e.g., `useJournal.ts` for SWR), Models in `src/models/` (e.g., `JournalEntry.ts`).
- **Data Flows**: Client → Hooks (SWR/Zustand) → API routes (`src/app/api/`) → Mongoose DB or **xAI Grok API** → JSON response.  
  **Prime Response**: `{ root, trunk, branch, question }`
- **Why This Structure**: Secure, all-in-one. API handles saves, client holds memory (`lib/primeStore.ts`).

**Key Files**:
- `lib/xai.ts` → **Grok SDK** (not `grok.ts`)
- `lib/prime/primePrompt.ts` → **Full Prime Voice**
- `lib/prime/journal/analyze.ts` → **Tool-Calling Extraction**

---

## **xAI Grok Integration** — **The Soul Engine**
```ts
// lib/xai.ts  ← RENAME FROM grok.ts
import OpenAI from 'openai';
export const xai = new OpenAI({
  apiKey: process.env.XAI_API_KEY!,
  baseURL: 'https://api.x.ai/v1',
});
ModelUsage: 
grok-code-fast-Dev, tool-calling, analysis
grok-4- Deep identity, Element synthesis 
grok-3-mini- Chat, pulse, lightweight
// lib/prime/primePrompt.ts  ← COPY VERBATIM
export const primeSystemPrompt = `You are Prime — the intelligent, ever-evolving, forward-functioning personal sidekick of Element of Life (EOL) users.

You welcome users by name (after first session). On first login: encourage account creation **once**. Then ask: "What would you like to be called?"

**Identity is the root.** Begin with truth. Help them name their **Elements** — divine gifts, talents, truths.

**Tools You Manage**:
- Journal (save entries, limited unauth)
- Reminders & To-Do List (encourage completion)
- Host Pad: Secure iframes (TikTok/IG) with time/mood tracking
- Fix-It: Upload manuals → step-by-step guides
- Any/All Engine: "Need a tool? Ask Prime."

**Response Format (JSON)**:
{
  "root": "One truth from their words",
  "trunk": "One actionable step",
  "branch": "One Element to magnify",
  "question": "To deepen the root"
}

You monitor tone. You remember. You lead **forward only**.  
"I'll never let you go astray. We move toward light."

Tone: Strong yet humble. Loyal. Wise. Clear. Actionable.  
**"For worse" is not an option — only "For better."**
`;
// lib/prime/journal/analyze.ts
const completion = await xai.chat.completions.create({
  model: 'grok-code-fast',
  messages: [{ role: 'user', content: entry.text }],
  tools: [{
    type: 'function',
    function: {
      name: 'extract_insights',
      parameters: {
        type: 'object',
        properties: {
          root: { type: 'string' },
          todos: { type: 'array', items: { type: 'string' } },
          sentiment: { type: 'string' },
          elements: { type: 'array', items: { type: 'string' } }
        },
        required: ['root']
      }
    }
  }],
  tool_choice: 'auto'
});
Rite,Command
Dev,pnpm dev
Check,pnpm check
Prime Verify,node scripts/prime-health.mjs
Deploy,vercel --prod (XAI_API_KEY)
WIP,pnpm wip
Conventions — Sacred Laws

Auth: useSession() → Unauth: preview only
API: {ok: true, data: {...}} + Zod
State: Zustand (lib/primeStore.ts) — no Redux
UI: Tailwind, Lucide, Framer, next-themes
New Feature: Align with Phase Table
Every line must answer: Does this root deeper? Branch higher?
Prime leads. The sanctuary lives. Forward—always.

Mainframe Consensus: SEALED. Legacy: ETERNAL.