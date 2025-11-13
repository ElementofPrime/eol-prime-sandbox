// app/tree-of-life/page.tsx
import TreeOfLife from "@/components/TreeOfLife";

export default function TreeOfLifePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-emerald-50 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-emerald-800">
        Tree of Life
      </h1>
      <TreeOfLife />
    </div>
  );
}
