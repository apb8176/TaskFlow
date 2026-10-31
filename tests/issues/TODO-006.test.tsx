import { expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { fixtures, mount, stored } from "../helpers";
it("deletes normally", async () => {
  const { user } = mount();
  await user.click(screen.getByRole("button", { name: "Delete Learn React" }));
  expect(stored().map((t) => t.id)).toEqual(["b", "c"]);
});
it("deletes from a completed list", async () => {
  const { user } = mount();
  await user.click(screen.getByRole("button", { name: "Completed" }));
  await user.click(
    screen.getByRole("button", { name: "Delete Write React notes" }),
  );
  expect(stored().map((t) => t.id)).toEqual(["a", "c"]);
});
it("deletes from search results", async () => {
  const { user } = mount();
  await user.type(screen.getByRole("searchbox"), "Plan");
  await user.click(screen.getByRole("button", { name: "Delete Plan release" }));
  expect(stored().map((t) => t.id)).toEqual(["a", "b"]);
});
it("preserves unrelated tasks", async () => {
  const { user } = mount();
  await user.type(screen.getByRole("searchbox"), "Write");
  await user.click(
    screen.getByRole("button", { name: "Delete Write React notes" }),
  );
  expect(stored()).toEqual([fixtures[0], fixtures[2]]);
});
