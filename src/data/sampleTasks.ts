import type { Task } from "../types/task";
export const sampleTasks: Task[] = [
  {
    id: "sample-1",
    title: "Review the homepage wireframes",
    completed: false,
    priority: "high",
    createdAt: "2026-01-01T09:00:00Z",
  },
  {
    id: "sample-2",
    title: "Learn React context patterns",
    completed: false,
    priority: "medium",
    createdAt: "2026-01-01T09:01:00Z",
  },
  {
    id: "sample-3",
    title: "Write notes for the team handoff",
    completed: false,
    priority: "low",
    createdAt: "2026-01-01T09:02:00Z",
  },
  {
    id: "sample-4",
    title: "Set up the project workspace",
    completed: true,
    priority: "medium",
    createdAt: "2026-01-01T09:03:00Z",
  },
  {
    id: "sample-5",
    title: "Explore the TaskFlow codebase",
    completed: true,
    priority: "low",
    createdAt: "2026-01-01T09:04:00Z",
  },
];
