import { expect, it } from "vitest";
import { filterTasks } from "../../src/utils/taskFilters";
import { fixtures } from "../helpers";
it("shows only incomplete tasks in Active", () => {
  expect(filterTasks(fixtures, "active").map((t) => t.id)).toEqual(["a", "c"]);
});
it("shows only completed tasks in Completed", () => {
  expect(filterTasks(fixtures, "completed").map((t) => t.id)).toEqual(["b"]);
});
it("shows all tasks in All", () => {
  expect(filterTasks(fixtures, "all")).toEqual(fixtures);
});
it("reflects changed completion state", () => {
  const changed = fixtures.map((t) =>
    t.id === "a" ? { ...t, completed: true } : t,
  );
  expect(filterTasks(changed, "active").map((t) => t.id)).toEqual(["c"]);
  expect(filterTasks(changed, "completed")).toHaveLength(2);
});
