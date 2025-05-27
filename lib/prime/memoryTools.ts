import { loadUserMemory, saveUserMemory } from './userMemory';

export async function appendJournal(userId: string, entry: string) {
  const memory = await loadUserMemory(userId);
  const newEntry = {
  entry,
  createdAt: new Date().toISOString(),
};
memory.journal.push(newEntry);

  await saveUserMemory(userId, memory);
}

export async function addTask(userId: string, task: string) {
  const memory = await loadUserMemory(userId);
  memory.tasks = memory.tasks || [];
  memory.tasks.push({
    task,
    completed: false,
    created: new Date().toISOString(),
  });
  await saveUserMemory(userId, memory);
}
