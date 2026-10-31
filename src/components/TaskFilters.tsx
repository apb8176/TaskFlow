import type { TaskFilter } from "../types/task";
export function TaskFilters({
  value,
  onChange,
}: {
  value: TaskFilter;
  onChange: (filter: TaskFilter) => void;
}) {
  return (
    <div className="filter-tabs" role="group" aria-label="Filter tasks">
      {(["all", "active", "completed"] as const).map((filter) => (
        <button
          key={filter}
          type="button"
          aria-pressed={value === filter}
          onClick={() => onChange(filter)}
        >
          {filter[0].toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
}
