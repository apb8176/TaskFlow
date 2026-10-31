import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../../src/App";
import { add, edit, fixtures, mount, row, stored } from "../helpers";
import { loadTasks, STORAGE_KEY } from "../../src/utils/taskStorage";
describe("Supported baseline behavior", () => {
  it("opens a populated workspace on first visit", () => {
    render(<App />);
    expect(screen.getAllByRole("checkbox")).toHaveLength(5);
  });
  it("shows the workspace title", () => {
    mount();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Let’s get things done",
    );
  });
  it("adds a valid task", async () => {
    const { user } = mount();
    await add(user, "Ship a draft");
    expect(screen.getByText("Ship a draft")).toBeVisible();
  });
  it("clears the successful add input", async () => {
    const { user } = mount();
    await add(user, "New work");
    expect(screen.getByLabelText("New task", { exact: true })).toHaveValue("");
  });
  it("rejects an empty title", async () => {
    const { user } = mount();
    await user.click(screen.getByRole("button", { name: /Add task/ }));
    expect(screen.getByRole("alert")).toBeVisible();
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });
  it("assigns priority at creation", async () => {
    const { user } = mount();
    await user.selectOptions(screen.getByLabelText("New task priority"), "low");
    await add(user, "Read docs");
    expect(screen.getByLabelText("Priority for Read docs")).toHaveValue("low");
  });
  it("toggles task completion", async () => {
    const { user } = mount();
    await user.click(row("a").getByRole("checkbox"));
    expect(row("a").getByRole("checkbox")).toBeChecked();
  });
  it("toggles completed tasks back", async () => {
    const { user } = mount();
    await user.click(row("b").getByRole("checkbox"));
    expect(row("b").getByRole("checkbox")).not.toBeChecked();
  });
  it("edits a task in the original order", async () => {
    const { user } = mount();
    await edit(user, "Learn React", "Read React");
    expect(row("a").getByText("Read React")).toBeVisible();
  });
  it("cancels editing", async () => {
    const { user } = mount();
    await user.click(screen.getByRole("button", { name: "Edit Learn React" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(row("a").getByText("Learn React")).toBeVisible();
  });
  it("deletes a task in original order", async () => {
    const { user } = mount();
    await user.click(
      screen.getByRole("button", { name: "Delete Learn React" }),
    );
    expect(screen.queryByTestId("task-a")).not.toBeInTheDocument();
  });
  it("shows completed tasks", async () => {
    const { user } = mount();
    await user.click(screen.getByRole("button", { name: "Completed" }));
    expect(screen.getAllByRole("checkbox")).toHaveLength(1);
    expect(row("b").getByRole("checkbox")).toBeChecked();
  });
  it("finds exact-case search text", async () => {
    const { user } = mount();
    await user.type(screen.getByRole("searchbox"), "React");
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });
  it("restores an existing small collection", () => {
    mount();
    expect(stored()).toEqual(fixtures);
    expect(loadTasks()).toEqual(fixtures);
  });
  it("recovers from malformed storage and reports denied writes", async () => {
    localStorage.setItem(STORAGE_KEY, "{broken");
    render(<App />);
    expect(screen.getAllByRole("checkbox")).toHaveLength(5);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });
    const user = (await import("@testing-library/user-event")).default.setup();
    await add(user, "Offline task");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Storage is unavailable",
    );
  });
});
