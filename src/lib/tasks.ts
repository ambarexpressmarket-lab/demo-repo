import { supabase } from "./supabase";

export type TaskCategory = "work" | "personal" | "shopping";

export interface Task {
  id: string;
  title: string;
  done: boolean;
  category: TaskCategory;
  createdAt: string;
}

// Fallback in-memory store when Supabase not configured (local dev)
const memoryTasks: Task[] = [
  { id: "1", title: "Setup Next.js + Tailwind", done: true, category: "work", createdAt: new Date().toISOString() },
  { id: "2", title: "Add Supabase (PostgreSQL)", done: true, category: "work", createdAt: new Date().toISOString() },
  { id: "3", title: "Deploy to Vercel", done: false, category: "work", createdAt: new Date().toISOString() },
];

async function getFromSupabase(category?: TaskCategory) {
  if (!supabase) return null;
  let q = supabase.from("tasks").select("*").order("created_at", { ascending: true });
  if (category) q = q.eq("category", category);
  const { data } = await q;
  return data?.map((r) => ({
    id: r.id,
    title: r.title,
    done: r.done,
    category: r.category as TaskCategory,
    createdAt: r.created_at,
  })) ?? null;
}

export async function getTasks(category?: TaskCategory): Promise<Task[]> {
  const fromDb = await getFromSupabase(category);
  if (fromDb) return fromDb;
  let list = [...memoryTasks];
  if (category) list = list.filter((t) => t.category === category);
  return list;
}

export async function addTask(title: string, category: TaskCategory = "personal"): Promise<Task | null> {
  const task: Task = {
    id: crypto.randomUUID(),
    title,
    done: false,
    category,
    createdAt: new Date().toISOString(),
  };
  if (supabase) {
    const { data, error } = await supabase
      .from("tasks")
      .insert({ id: task.id, title: task.title, done: task.done, category: task.category, created_at: task.createdAt })
      .select()
      .single();
    if (!error) return { ...task, createdAt: data.created_at };
    return null;
  }
  memoryTasks.push(task);
  return task;
}

export async function toggleTask(id: string): Promise<Task | null> {
  const task = supabase ? null : memoryTasks.find((t) => t.id === id);
  if (supabase) {
    const { data: current } = await supabase.from("tasks").select("done").eq("id", id).single();
    if (!current) return null;
    const { data } = await supabase.from("tasks").update({ done: !current.done }).eq("id", id).select().single();
    return data ? { id: data.id, title: data.title, done: data.done, category: data.category, createdAt: data.created_at } : null;
  }
  if (!task) return null;
  task.done = !task.done;
  return task;
}

export async function deleteTask(id: string): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    return !error;
  }
  const idx = memoryTasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  memoryTasks.splice(idx, 1);
  return true;
}
