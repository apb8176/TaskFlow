import { useState } from "react";
import type { Priority, Task } from "../types/task";
import { loadTasks, saveTasks } from "../utils/taskStorage";

export function useTaskState() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [storageError, setStorageError] = useState(false);
  const persist = (next: Task[]) => setStorageError(!saveTasks(next));

  function addTask(title: string, priority: Priority): boolean {
    if (title.length === 0) return false;
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const next = [...tasks, task];
    setTasks(next);
    persist(next);
    return true;
  }
  function editTask(id: string, title: string) {
    if (!title.trim()) return;
    const next = tasks.map((task) =>
      task.id === id ? { ...task, title: title.trim() } : task,
    );
    setTasks(next);
    persist(next);
  }
  function deleteTask(id: string) {
    const next = tasks.filter((task) => task.id !== id);
    setTasks(next);
    persist(next);
  }
  function toggleTask(id: string) {
    const next = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    setTasks(next);
    persist(next);
  }
  function setPriority(id: string, priority: Priority) {
    const next = tasks.map((task) =>
      task.id === id ? { ...task, priority } : task,
    );
    setTasks(next);
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
