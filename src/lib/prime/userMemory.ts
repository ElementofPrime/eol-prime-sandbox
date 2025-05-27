import fs from 'fs/promises';
import path from 'path';

type UserMemory = {
  journal: { entry: string; createdAt: string }[];
  goals: { goal: string; createdAt: string }[];
  elements: string[];
  tasks?: { task: string; completed: boolean; created: string }[];
  lastReply?: string;
  lastMessage?: string;
  lastInteraction?: string;
  threadId?: string;
};

export async function loadUserMemory(userId: string): Promise<UserMemory> {
  const file = path.join(process.cwd(), 'data', 'users', userId, 'memory.json');

  try {
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw);
  } catch {
    // If no memory file, return blank memory
    return {
      journal: [],
      goals: [],
      elements: [],
      tasks: [],
      lastReply: '',
    };
  }
}

export async function saveUserMemory(userId: string, memory: UserMemory) {
  const dir = path.join(process.cwd(), 'data', 'users', userId);
  const file = path.join(dir, 'memory.json');

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(file, JSON.stringify(memory, null, 2), 'utf-8');
}
