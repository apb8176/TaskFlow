import { expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { edit, fixtures, mount, row, stored } from "../helpers";
it("edits normally", async () => {
  const { user } = mount();
  await edit(user, "Learn React", "Learn hooks");
  expect(row("a").getByText("Learn hooks")).toBeVisible();
});
it("edits the selected task after filtering", async () => {
  const { user } = mount();
  await user.click(screen.getByRole("button", { name: "Completed" }));
  await edit(user, "Write React notes", "Updated notes");
  expect(stored().find((t) => t.id === "b")?.title).toBe("Updated notes");
});
it("edits correctly after priority ordering changes", async () => {
  const { user } = mount();
  await user.selectOptions(
    screen.getByLabelText("Priority for Plan release"),
    "high",
  );
  await edit(user, "Plan release", "Plan next release");
  expect(row("c").getByText("Plan next release")).toBeVisible();
});
it("leaves unrelated tasks unchanged", async () => {
  const { user } = mount();
  await user.type(screen.getByRole("searchbox"), "Plan");
  await edit(user, "Plan release", "Plan launch");
  expect(stored().find((t) => t.id === "a")).toEqual(fixtures[0]);
  expect(stored().find((t) => t.id === "b")).toEqual(fixtures[1]);
});
