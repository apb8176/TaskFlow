import { useState } from "react";
import { TaskProvider } from "./context/TaskContext";
import { useTasks } from "./hooks/useTasks";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TaskFilters } from "./components/TaskFilters";
import { TaskSearch } from "./components/TaskSearch";
import { TaskStats } from "./components/TaskStats";
import { filterTasks, orderTasks, searchTasks } from "./utils/taskFilters";
import type { TaskFilter } from "./types/task";
export function Workspace() {
  const { tasks, storageError } = useTasks();
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [query, setQuery] = useState("");
  function changeFilter(next: TaskFilter) {
    setFilter(next);
  }
  const visible = orderTasks(searchTasks(filterTasks(tasks, filter), query));
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#main">
          <span className="brand-mark">✓</span>taskflow
          <span className="brand-dot">.</span>
        </a>
        <div className="workspace-label">YOUR WORKSPACE</div>
        <a className="nav-current" href="#main">
          <span aria-hidden="true">▦</span> My tasks{" "}
          <span className="nav-count">{tasks.length}</span>
        </a>
        <div className="sidebar-note">
          <span className="note-spark" aria-hidden="true">
            ✳
          </span>
          <h2>
            Make room for
            <br />
            what matters.
          </h2>
          <p>
            Clear your mind.
            <br />
            One task at a time.
          </p>
          <div className="note-lines" aria-hidden="true">
            ↗
          </div>
        </div>
        <footer className="sidebar-footer">
          <span className="avatar">T</span>
          <div>
            <strong>TieOpp</strong>
            <span>Engineering workspace</span>
          </div>
        </footer>
      </aside>
      <main id="main" className="main-content">
        <header className="topbar">
          <span>
            Workspace <span aria-hidden="true">/</span>{" "}
            <strong>My tasks</strong>
          </span>
          <span className="local-badge">
            <i /> Saved on this device
          </span>
        </header>
        <div className="content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">A LITTLE FOCUS GOES A LONG WAY</p>
              <h1>
                Let’s get things done<span>.</span>
              </h1>
              <p>Your ideas, plans, and everyday wins. All in one place.</p>
            </div>
            <span className="heading-art" aria-hidden="true">
              ✳
            </span>
          </div>
          <TaskStats />
          <section className="tasks-panel" aria-labelledby="tasks-heading">
            <div className="panel-title">
              <h2 id="tasks-heading">My tasks</h2>
              <span>Keep the momentum going</span>
            </div>
            <TaskForm />
            {storageError && (
              <p role="alert" className="storage-warning">
                Storage is unavailable. Changes will last only for this session.
              </p>
            )}
            <div className="task-toolbar">
              <TaskFilters value={filter} onChange={changeFilter} />
              <TaskSearch value={query} onChange={setQuery} />
            </div>
            <TaskList visibleTasks={visible} />
            <div className="panel-footer">
              <span>
                {visible.length} {visible.length === 1 ? "task" : "tasks"} in
                view
              </span>
              <span>Ordered by priority</span>
            </div>
          </section>
          <footer className="page-footer">
            <span>Built for a clearer day.</span>
            <span>
              TaskFlow <span aria-hidden="true">·</span> by TieOpp
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
export default function App() {
  return (
    <TaskProvider>
      <Workspace />
    </TaskProvider>
  );
}
