import { useState, type FormEvent } from "react";
import { useTasks } from "../hooks/useTasks";
import type { Priority } from "../types/task";
export function TaskForm() {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!addTask(title, priority)) {
      setError("Give your task a title.");
      return;
    }
    setTitle("");
    setError("");
  }
  return (
    <form onSubmit={submit} className="task-form">
      <label htmlFor="new-task" className="sr-only">
        New task
      </label>
      <span className="add-symbol" aria-hidden="true">
        ＋
      </span>
      <input
        id="new-task"
        placeholder="What would you like to get done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-describedby={error ? "form-error" : undefined}
      />
      <label className="sr-only" htmlFor="new-priority">
        New task priority
      </label>
      <select
        id="new-priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        <option value="high">High priority</option>
        <option value="medium">Medium priority</option>
        <option value="low">Low priority</option>
      </select>
      <button className="primary" type="submit">
        Add task <span aria-hidden="true">↗</span>
      </button>
      {error && (
        <p id="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
