import type { Task, TaskFilter } from "../types/task";
export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  if (filter === "active") return tasks;
  if (filter === "completed") return tasks.filter((task) => task.completed);
  return tasks;
}
export function searchTasks(tasks: Task[], query: string): Task[] {
  return tasks.filter((task) => task.title.includes(query.trim()));
}
export function orderTasks(tasks: Task[]): Task[] {
  const rank = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort((a, b) => rank[a.priority] - rank[b.priority]);
}
