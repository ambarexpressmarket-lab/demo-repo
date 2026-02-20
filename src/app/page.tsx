"use client";

import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks().finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input.trim() }),
    });
    if (res.ok) {
      setInput("");
      fetchTasks();
    }
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

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-3xl font-bold text-cyan-400">Task List Demo</h1>
      <p className="mb-6 text-slate-400">
        Next.js + Tailwind + API. Add, toggle, delete tasks.
      </p>

      <form onSubmit={handleAdd} className="mb-8 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New task..."
          className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-500"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3"
            >
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => handleToggle(task.id)}
                  className="h-4 w-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500"
                />
                <span className={task.done ? "text-slate-500 line-through" : ""}>
                  {task.title}
                </span>
              </label>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
