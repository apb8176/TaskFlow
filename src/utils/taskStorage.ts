import type { Task } from "../types/task";
import { sampleTasks } from "../data/sampleTasks";
export const STORAGE_KEY = "tieopp.taskflow.v1";
function isTask(value: unknown): value is Task {
  if (!value || typeof value !== "object") return false;
  const task = value as Partial<Task>;
  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.completed === "boolean" &&
    typeof task.createdAt === "string" &&
    ["high", "medium", "low"].includes(task.priority ?? "")
  );
}
export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.every(isTask) &&
        new Set(parsed.map((t) => t.id)).size === parsed.length
      ) {
        // TODO-005: Intentionally incorrect assessment attempt; still truncates saved tasks.
        return parsed.slice(0, 4);
      }
    }
  } catch {
    /* An unavailable store must not prevent local use. */
  }
  return sampleTasks.map((task) => ({ ...task }));
}
export function saveTasks(tasks: Task[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}
