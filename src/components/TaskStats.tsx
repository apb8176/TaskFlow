import { useTasks } from "../hooks/useTasks";
export function TaskStats() {
  const { tasks } = useTasks();
  const completed = tasks.filter((task) => task.completed).length;
  const active = tasks.length - completed;
  return (
    <section aria-label="Task statistics" className="stats-grid">
      <article>
        <span className="stat-icon" aria-hidden="true">
          ▦
        </span>
        <div>
          <span className="stat-label">Total tasks</span>
          <strong data-testid="total-count">{tasks.length}</strong>
        </div>
        <span className="stat-note">Everything on your plate</span>
      </article>
      <article>
        <span className="stat-icon amber" aria-hidden="true">
          ◷
        </span>
        <div>
          <span className="stat-label">In progress</span>
          <strong data-testid="active-count">{active}</strong>
        </div>
        <span className="stat-note">One step at a time</span>
      </article>
      <article>
        <span className="stat-icon green" aria-hidden="true">
          ✓
        </span>
        <div>
          <span className="stat-label">Completed</span>
          <strong data-testid="completed-count">{completed}</strong>
        </div>
        <span className="stat-note">Small wins add up</span>
      </article>
    </section>
  );
}
