// src/app/(app)/to-do/page.tsx
"use client";

import useSWR from "swr";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EOLButton from "@/components/EOLButton";
import { Loader2, GripVertical, Trash2 } from "lucide-react";

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((r) => r.json());

type ToDo = {
  _id: string;
  title: string;
  done: boolean;
  order?: number;
  createdAt: string;
};

function SortableItem({
  item,
  onToggle,
  onRemove,
}: {
  item: ToDo;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`eol-panel group flex items-center gap-3 p-4 transition-all ${
        isDragging ? "scale-105 shadow-2xl" : "hover:scale-[1.005]"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing opacity-40 hover:opacity-80"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      <input
        type="checkbox"
        checked={item.done}
        onChange={onToggle}
        className="w-5 h-5 rounded border-cyan-500/50 text-cyan-600 focus:ring-cyan-500"
      />

      <div
        className={`flex-1 text-sm ${item.done ? "line-through opacity-60" : ""}`}
      >
        {item.title}
      </div>

      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-70 hover:opacity-100 transition"
      >
        <Trash2 className="w-4 h-4 text-rose-400" />
      </button>
    </article>
  );
}

export default function ToDoPage() {
  const { data, mutate, isValidating } = useSWR<{ ok: true; items: ToDo[] }>(
    "/api/to-do",
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );
  const [title, setTitle] = useState("");

  const items = data?.items || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function addToDo(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const optimistic = {
      _id: `temp-${Date.now()}`,
      title: title.trim(),
      done: false,
      createdAt: new Date().toISOString(),
    };

    await mutate(
      async (curr) => {
        const res = await fetch("/api/to-do", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title.trim() }),
        });
        const json = await res.json();
        if (!json.ok) throw new Error(json.error);

        return {
          ok: true,
          items: [
            json.item,
            ...(curr?.items || []).filter((i) => !i._id.startsWith("temp")),
          ],
        };
      },
      {
        optimisticData: { ok: true, items: [optimistic, ...items] },
        revalidate: false,
      }
    );

    setTitle("");
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i._id === active.id);
      const newIndex = items.findIndex((i) => i._id === over?.id);

      const newItems = arrayMove(items, oldIndex, newIndex);

      // Optimistic UI
      mutate({ ok: true, items: newItems }, false);

      // Sync order to backend
      await fetch("/api/to-do/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: newItems.map((item, index) => ({
            id: item._id,
            order: index,
          })),
        }),
      });
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-5xl font-bold bg-linear-to-r from-cyan-400 to-sky-600 bg-clip-text text-transparent">
          ToDo
        </h1>
        <p className="text-sm opacity-70">Drag to reorder. Build momentum.</p>
      </header>

      <form onSubmit={addToDo} className="eol-panel flex gap-3 p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 rounded-xl border border-slate-700/20 bg-slate-900/30 dark:bg-slate-950/50 px-4 py-3 text-sm placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
        <EOLButton variant="primary" disabled={!title.trim()}>
          Add ToDo
        </EOLButton>
      </form>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i._id)}
          strategy={verticalListSortingStrategy}
        >
          <section className="space-y-3">
            {isValidating && !items.length && (
              <div className="eol-panel p-8 text-center opacity-70">
                <Loader2 className="w-6 h-6 mx-auto animate-spin" />
                <p className="mt-2">Loading your To-Do…</p>
              </div>
            )}

            {!items.length && !isValidating && (
              <div className="eol-panel p-8 text-center opacity-70">
                <p>No To-Do yet. Start building momentum!</p>
              </div>
            )}

            {items.map((item) => (
              <SortableItem
                key={item._id}
                item={item}
                onToggle={() =>
                  mutate(
                    {
                      ok: true,
                      items: items.map((i) =>
                        i._id === item._id ? { ...i, done: !i.done } : i
                      ),
                    },
                    false
                  )
                }
                onRemove={() =>
                  mutate(
                    {
                      ok: true,
                      items: items.filter((i) => i._id !== item._id),
                    },
                    false
                  )
                }
              />
            ))}
          </section>
        </SortableContext>
      </DndContext>
    </main>
  );
}
