import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";
import type { Task } from "../src/types/task";
import { STORAGE_KEY } from "../src/utils/taskStorage";
export const fixtures: Task[] = [
  {
    id: "a",
    title: "Learn React",
    completed: false,
    priority: "high",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "b",
    title: "Write React notes",
    completed: true,
    priority: "medium",
    createdAt: "2026-01-02T00:00:00Z",
  },
  {
    id: "c",
    title: "Plan release",
    completed: false,
    priority: "low",
    createdAt: "2026-01-03T00:00:00Z",
  },
];
export function mount(tasks: Task[] = fixtures) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  return { ...render(<App />), user: userEvent.setup() };
}
export const row = (id: string) => within(screen.getByTestId(`task-${id}`));
export const stored = (): Task[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
export async function edit(
  user: ReturnType<typeof userEvent.setup>,
  title: string,
  next: string,
) {
  await user.click(screen.getByRole("button", { name: `Edit ${title}` }));
  await user.clear(screen.getByRole("textbox", { name: "Edit task title" }));
  await user.type(
    screen.getByRole("textbox", { name: "Edit task title" }),
    next,
  );
  await user.click(screen.getByRole("button", { name: "Save" }));
}
export async function add(
  user: ReturnType<typeof userEvent.setup>,
  title: string,
) {
  await user.type(screen.getByRole("textbox", { name: "New task" }), title);
  await user.click(screen.getByRole("button", { name: /Add task/ }));
}
