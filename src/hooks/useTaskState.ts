import { useEffect, useState } from "react";
import type { Priority, Task } from "../types/task";
import { loadTasks, saveTasks } from "../utils/taskStorage";

export function useTaskState() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    setStorageError(!saveTasks(tasks));
  }, [tasks]);

  function addTask(title: string, priority: Priority): boolean {
    if (!title.trim()) return false;
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((current) => [...current, task]);
    return true;
  }
  function editTask(id: string, title: string) {
    if (!title.trim()) return;
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, title: title.trim() } : task,
      ),
    );
  }
  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }
  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }
  function setPriority(id: string, priority: Priority) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, priority } : task,
      ),
    );
  }
  return {
    tasks,
    storageError,
    addTask,
    editTask,
    deleteTask,
    toggleTask,
    setPriority,
  };
}
