import OpenAI from "openai";

export const grok = new OpenAI({
  apiKey: process.env.GROK_API_KEY!,  // Your xAI key
  baseURL: 'https://api.x.ai/v1',     // xAI endpoint
});