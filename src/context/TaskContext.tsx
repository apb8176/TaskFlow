import { createContext, type ReactNode } from "react";
import { useTaskState } from "../hooks/useTaskState";
export type TaskContextValue = ReturnType<typeof useTaskState>;
export const TaskContext = createContext<TaskContextValue | null>(null);
export function TaskProvider({ children }: { children: ReactNode }) {
  const value = useTaskState();
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
