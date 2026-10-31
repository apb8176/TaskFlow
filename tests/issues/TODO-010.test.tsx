import { expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { mount } from "../helpers";
it("retains entered search text", async () => {
  const { user } = mount();
  await user.type(screen.getByRole("searchbox"), "React");
  expect(screen.getByRole("searchbox")).toHaveValue("React");
});
it("keeps the query when switching to Active", async () => {
  const { user } = mount();
  await user.type(screen.getByRole("searchbox"), "React");
  await user.click(screen.getByRole("button", { name: "Active" }));
  expect(screen.getByRole("searchbox")).toHaveValue("React");
});
it("combines search with Completed", async () => {
  const { user } = mount();
  await user.type(screen.getByRole("searchbox"), "Plan");
  await user.click(screen.getByRole("button", { name: "Completed" }));
  expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  expect(screen.getByRole("searchbox")).toHaveValue("Plan");
});
it("keeps search when returning to All", async () => {
  const { user } = mount();
  await user.click(screen.getByRole("button", { name: "Completed" }));
  await user.type(screen.getByRole("searchbox"), "Write");
  await user.click(screen.getByRole("button", { name: "All" }));
  expect(screen.getByRole("searchbox")).toHaveValue("Write");
  expect(screen.getAllByRole("checkbox")).toHaveLength(1);
});
it("clearing search restores the selected filter results", async () => {
  const { user } = mount();
  await user.click(screen.getByRole("button", { name: "Completed" }));
  await user.type(screen.getByRole("searchbox"), "No match");
  await user.clear(screen.getByRole("searchbox"));
  expect(screen.getAllByRole("checkbox")).toHaveLength(1);
  expect(screen.getByText("Write React notes")).toBeVisible();
});
