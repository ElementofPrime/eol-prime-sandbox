import { create } from "zustand";

interface PrimeState {
  user?: { name?: string | null; email?: string | null };
  elements: string[];
  setUser: (user: PrimeState["user"]) => void;
  addElement: (el: string) => void;
}

export const usePrimeStore = create<PrimeState>((set) => ({
  user: undefined,
  elements: [],
  setUser: (user) => set({ user }),
  addElement: (el) => set((s) => ({ elements: [...s.elements, el] })),
}));
