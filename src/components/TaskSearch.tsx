export function TaskSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (query: string) => void;
}) {
  return (
    <div className="search">
      <span aria-hidden="true">⌕</span>
      <label className="sr-only" htmlFor="search">
        Search tasks
      </label>
      <input
        type="search"
        id="search"
        placeholder="Search tasks…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
