// In-memory store for demo (replace with Postgres/Supabase in production)
export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

const tasks: Task[] = [
  { id: "1", title: "Setup Next.js project", done: true, createdAt: new Date().toISOString() },
  { id: "2", title: "Add Tailwind CSS", done: true, createdAt: new Date().toISOString() },
  { id: "3", title: "Create API routes", done: false, createdAt: new Date().toISOString() },
];

export function getTasks(): Task[] {
  return [...tasks];
}

export function addTask(title: string): Task {
  const task: Task = {
    id: crypto.randomUUID(),
    title,
    done: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

export function toggleTask(id: string): Task | null {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  task.done = !task.done;
  return task;
}

export function deleteTask(id: string): boolean {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  return true;
}
