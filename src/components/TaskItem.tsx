import { useState } from "react";
import type { Priority, Task } from "../types/task";
import { useTasks } from "../hooks/useTasks";
export function TaskItem({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (title: string) => void;
  onDelete: () => void;
}) {
  const { toggleTask, setPriority } = useTasks();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  return (
    <li
      className={`task-row ${task.completed ? "is-complete" : ""}`}
      data-testid={`task-${task.id}`}
    >
      <input
        className="task-check"
        type="checkbox"
        checked={task.completed}
        aria-label={`Complete ${task.title}`}
        onChange={() => toggleTask(task.id)}
      />
      {editing ? (
        <form
          className="edit-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) {
              onEdit(draft);
              setEditing(false);
            }
          }}
        >
          <input
            aria-label="Edit task title"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setEditing(false);
            }}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <span className="task-title">{task.title}</span>
      )}
      <select
        className={`priority priority-${task.priority}`}
        aria-label={`Priority for ${task.title}`}
        value={task.priority}
        onChange={(e) => setPriority(task.id, e.target.value as Priority)}
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <div className="row-actions">
        <button
          type="button"
          aria-label={`Edit ${task.title}`}
          onClick={() => {
            setDraft(task.title);
            setEditing(true);
          }}
        >
          Edit
        </button>
        <button
          type="button"
          className="delete"
          aria-label={`Delete ${task.title}`}
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
