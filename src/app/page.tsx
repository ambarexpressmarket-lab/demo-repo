"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Briefcase, ShoppingCart, User, Check, Loader2 } from "lucide-react";
import type { TaskCategory } from "@/lib/tasks";

interface Task {
  id: string;
  title: string;
  done: boolean;
  category: TaskCategory;
  createdAt: string;
}

const CATEGORIES: { value: TaskCategory; label: string; icon: React.ReactNode }[] = [
  { value: "work", label: "Work", icon: <Briefcase className="h-4 w-4" /> },
  { value: "personal", label: "Personal", icon: <User className="h-4 w-4" /> },
  { value: "shopping", label: "Shopping", icon: <ShoppingCart className="h-4 w-4" /> },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState<TaskCategory>("personal");
  const [filter, setFilter] = useState<TaskCategory | "all">("all");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchTasks = async () => {
    const url = filter === "all" ? "/api/tasks" : `/api/tasks?category=${filter}`;
    const res = await fetch(url);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks().finally(() => setLoading(false));
  }, [filter]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setAdding(true);
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input.trim(), category }),
    });
    if (res.ok) {
      setInput("");
      await fetchTasks();
    }
    setAdding(false);
  };

  const handleToggle = async (id: string) => {
    await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "toggle" }),
    });
    fetchTasks();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const getCategoryIcon = (cat: TaskCategory) => CATEGORIES.find((c) => c.value === cat)?.icon ?? <User className="h-4 w-4" />;

  const completed = tasks.filter((t) => t.done).length;
  const total = tasks.length;

  return (
    <main className="mx-auto min-h-screen max-w-2xl p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="mb-2 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          Task List
        </h1>
        <p className="text-slate-400">
          Next.js · Tailwind · API · Supabase
        </p>
      </div>

      <form onSubmit={handleAdd} className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="New task..."
            className="flex-1 rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-slate-100 placeholder-slate-500 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
            className="rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={adding}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-5 py-3 font-medium text-white shadow-lg shadow-cyan-900/30 transition hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-50"
        >
          {adding ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          Add
        </button>
      </form>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500">Filter:</span>
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            filter === "all"
              ? "bg-cyan-600 text-white"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setFilter(c.value)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              filter === c.value
                ? "bg-cyan-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
          >
            {c.icon}
            {c.label}
          </button>
        ))}
      </div>

      {total > 0 && (
        <p className="mb-4 text-sm text-slate-500">
          {completed} / {total} completed
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-12 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading...
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-800/30 py-16 text-center text-slate-500">
          <p>No tasks yet. Add one above.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="group flex items-center justify-between gap-3 rounded-xl border border-slate-700/80 bg-slate-800/50 px-4 py-3 transition hover:border-slate-600 hover:bg-slate-800/70"
            >
              <label className="flex cursor-pointer items-center gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => handleToggle(task.id)}
                  className="h-5 w-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                />
                <span className={`flex items-center gap-2 truncate ${task.done ? "text-slate-500 line-through" : "text-slate-200"}`}>
                  <span className="shrink-0 text-slate-500">{getCategoryIcon(task.category)}</span>
                  {task.title}
                </span>
              </label>
              <button
                onClick={() => handleDelete(task.id)}
                className="shrink-0 rounded-lg p-2 text-slate-400 opacity-0 transition hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
