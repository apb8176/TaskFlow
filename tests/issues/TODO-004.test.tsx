import { expect, it } from "vitest";
import { searchTasks } from "../../src/utils/taskFilters";
import { fixtures } from "../helpers";
it.each(["react", "REACT", "rEaCt"])("finds titles for %s", (query) => {
  expect(searchTasks(fixtures, query).map((t) => t.id)).toEqual(["a", "b"]);
});
it("returns no tasks for a missing term", () => {
  expect(searchTasks(fixtures, "unfindable")).toEqual([]);
});
