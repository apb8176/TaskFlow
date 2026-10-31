import { expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { add, mount, row } from "../helpers";
it("counts after adding", async () => {
  const { user } = mount();
  await add(user, "Another task");
  expect(screen.getByTestId("completed-count")).toHaveTextContent("1");
  expect(screen.getByTestId("total-count")).toHaveTextContent("4");
});
it("counts after completing", async () => {
  const { user } = mount();
  await user.click(row("a").getByRole("checkbox"));
  expect(screen.getByTestId("completed-count")).toHaveTextContent("2");
});
it("counts after uncompleting", async () => {
  const { user } = mount();
  await user.click(row("b").getByRole("checkbox"));
  expect(screen.getByTestId("completed-count")).toHaveTextContent("0");
});
it("counts after deletion", async () => {
  const { user } = mount();
  await user.click(
    screen.getByRole("button", { name: "Delete Write React notes" }),
  );
  expect(screen.getByTestId("completed-count")).toHaveTextContent("0");
});
