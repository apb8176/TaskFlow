import { expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { add, mount } from "../helpers";
it("rejects empty input", async () => {
  const { user } = mount([]);
  await user.click(screen.getByRole("button", { name: /Add task/ }));
  expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
});
it("rejects whitespace-only input", async () => {
  const { user } = mount([]);
  await add(user, "   ");
  expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  expect(screen.getByRole("alert")).toBeVisible();
});
it("accepts a valid title", async () => {
  const { user } = mount([]);
  await add(user, "Write documentation");
  expect(screen.getByText("Write documentation")).toBeVisible();
});
it("preserves internal spaces", async () => {
  const { user } = mount([]);
  await add(user, "Review  the plan");
  expect(screen.getByRole("checkbox")).toHaveAttribute(
    "aria-label",
    "Complete Review  the plan",
  );
});
