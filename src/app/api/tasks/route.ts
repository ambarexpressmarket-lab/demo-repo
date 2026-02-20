import { NextResponse } from "next/server";
import { getTasks, addTask, toggleTask, deleteTask } from "@/lib/tasks";
import type { TaskCategory } from "@/lib/tasks";

const CATEGORIES: TaskCategory[] = ["work", "personal", "shopping"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as TaskCategory | null;
  const validCategory = category && CATEGORIES.includes(category) ? category : undefined;
  const tasks = await getTasks(validCategory);
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  try {
    const { title, category } = await request.json();
    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "title required" }, { status: 400 });
    }
    const cat: TaskCategory = category && CATEGORIES.includes(category) ? category : "personal";
    const task = await addTask(title.trim(), cat);
    return task ? NextResponse.json(task, { status: 201 }) : NextResponse.json({ error: "Failed to add" }, { status: 500 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, action } = await request.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (action === "toggle") {
      const task = await toggleTask(id);
      return task ? NextResponse.json(task) : NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const ok = await deleteTask(id);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
