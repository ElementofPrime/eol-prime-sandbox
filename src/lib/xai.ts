export const xai = {
  chat: { completions: { create: async () => ({}) } },
  apiKey: process.env.XAI_API_KEY!,
  baseURL: 'https://api.x.ai/v1',  // ← THIS IS THE SACRED GATEWAY
};

// Model Map (Use in code)
export const GROK_MODELS = {
  CODE: 'grok-code-fast',
  DEEP: 'grok-4',           // Coming soon
  CHAT: 'grok-beta',        // Current stable
  MINI: 'grok-3-mini'       // Lightweight
};