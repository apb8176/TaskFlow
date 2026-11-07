import type { Task, TaskFilter } from "../types/task";
export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  if (filter === "active") return tasks.filter((task) => !task.completed);
  if (filter === "completed") return tasks.filter((task) => task.completed);
  return tasks;
}
export function searchTasks(tasks: Task[], query: string): Task[] {
  const normalizedQuery = query.trim().toLowerCase();
  return tasks.filter((task) => task.title.toLowerCase().includes(normalizedQuery));
}
export function orderTasks(tasks: Task[]): Task[] {
  const rank = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort((a, b) => rank[a.priority] - rank[b.priority]);
}
