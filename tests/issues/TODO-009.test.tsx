import { act, renderHook } from "@testing-library/react";
import { expect, it } from "vitest";
import { useTaskState } from "../../src/hooks/useTaskState";
import { loadTasks, STORAGE_KEY } from "../../src/utils/taskStorage";
function rapid() {
  localStorage.setItem(STORAGE_KEY, "[]");
  const hook = renderHook(() => useTaskState());
  act(() => {
    for (const title of ["One", "Two", "Three", "Four"])
      hook.result.current.addTask(title, "medium");
  });
  return hook;
}
it("creates one task for each rapid submission", () => {
  expect(rapid().result.current.tasks).toHaveLength(4);
});
it("retains every submitted title", () => {
  expect(rapid().result.current.tasks.map((t) => t.title)).toEqual([
    "One",
    "Two",
    "Three",
    "Four",
  ]);
});
it("assigns a distinct ID to every rapid submission", () => {
  const tasks = rapid().result.current.tasks;
  expect(new Set(tasks.map((t) => t.id)).size).toBe(4);
});
it("persists all rapid updates", () => {
  const hook = rapid();
  hook.unmount();
  expect(loadTasks().map((t) => t.title)).toEqual([
    "One",
    "Two",
    "Three",
    "Four",
  ]);
});
