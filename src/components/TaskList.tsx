import type { Task } from "../types/task";
import { useTasks } from "../hooks/useTasks";
import { TaskItem } from "./TaskItem";
export function TaskList({ visibleTasks }: { visibleTasks: Task[] }) {
  const { tasks, editTask, deleteTask } = useTasks();
  if (!visibleTasks.length)
    return (
      <div className="empty-state">
        <span aria-hidden="true">◎</span>
        <h3>A little breathing room.</h3>
        <p>No tasks here. Add a task or try another search.</p>
      </div>
    );
  return (
    <ul className="task-list" aria-label="Tasks">
      {visibleTasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={(title) => editTask(tasks[index].id, title)}
          onDelete={() => deleteTask(tasks[index].id)}
        />
      ))}
    </ul>
  );
}
