export type Priority = "high" | "medium" | "low";
export type TaskFilter = "all" | "active" | "completed";
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
}
