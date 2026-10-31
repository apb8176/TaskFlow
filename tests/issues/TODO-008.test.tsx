import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../../src/App";
import { fixtures, mount, row, stored } from "../helpers";
it("allows changing priority", async () => {
  const { user } = mount();
  await user.selectOptions(
    screen.getByLabelText("Priority for Learn React"),
    "low",
  );
  expect(screen.getByLabelText("Priority for Learn React")).toHaveValue("low");
});
it("updates the rendered priority immediately", async () => {
  const { user } = mount();
  await user.selectOptions(
    screen.getByLabelText("Priority for Learn React"),
    "medium",
  );
  expect(row("a").getByRole("combobox")).toHaveClass("priority-medium");
});
it("restores priority after reload", async () => {
  const { user, unmount } = mount();
  await user.selectOptions(
    screen.getByLabelText("Priority for Learn React"),
    "low",
  );
  unmount();
  render(<App />);
  expect(screen.getByLabelText("Priority for Learn React")).toHaveValue("low");
});
it("persists priority without changing other properties", async () => {
  const { user } = mount();
  await user.selectOptions(
    screen.getByLabelText("Priority for Learn React"),
    "low",
  );
  expect(stored()).toEqual([
    { ...fixtures[0], priority: "low" },
    fixtures[1],
    fixtures[2],
  ]);
});
