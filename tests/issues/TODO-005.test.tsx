import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../../src/App";
import { sampleTasks } from "../../src/data/sampleTasks";
import { add, edit, mount } from "../helpers";
it("restores a newly added task after reload of a populated workspace", async () => {
  const { user, unmount } = mount(sampleTasks);
  await add(user, "Prepare the demo");
  unmount();
  render(<App />);
  expect(screen.getByText("Prepare the demo")).toBeVisible();
  expect(screen.getAllByRole("checkbox")).toHaveLength(6);
});
it("restores an edited title", async () => {
  const { user, unmount } = mount();
  await edit(user, "Learn React", "Learn hooks");
  unmount();
  render(<App />);
  expect(screen.getByText("Learn hooks")).toBeVisible();
});
it("keeps a deleted task removed", async () => {
  const { user, unmount } = mount();
  await user.click(screen.getByRole("button", { name: "Delete Learn React" }));
  unmount();
  render(<App />);
  expect(screen.queryByText("Learn React")).not.toBeInTheDocument();
  expect(screen.getAllByRole("checkbox")).toHaveLength(2);
});
it("restores an intentionally empty list", () => {
  const { unmount } = mount([]);
  unmount();
  render(<App />);
  expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
});
