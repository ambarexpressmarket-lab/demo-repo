import { NextResponse } from "next/server";
import { getTasks, addTask, toggleTask, deleteTask } from "@/lib/tasks";

export async function GET() {
  return NextResponse.json(getTasks());
}

export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "title required" }, { status: 400 });
    }
    const task = addTask(title.trim());
    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, action } = await request.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (action === "toggle") {
      const task = toggleTask(id);
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
  const ok = deleteTask(id);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
