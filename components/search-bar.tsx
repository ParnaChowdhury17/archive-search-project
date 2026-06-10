type SearchBarProps = {
  query: string;
  setQuery: (q: string) => void;
  selectedYear: string;
  setSelectedYear: (y: string) => void;
  onSearch: () => void;
  onClear: () => void;
  loading: boolean;
};

const YEARS = [
  { label: "All Years", value: "all" },
  { label: "1939", value: "1939" },
  { label: "1944", value: "1944" },
  { label: "1945", value: "1945" },
  { label: "1946", value: "1946" },
];

export function SearchBar({
  query,
  setQuery,
  selectedYear,
  setSelectedYear,
  onSearch,
  onClear,
  loading,
}: SearchBarProps) {
  return (
    <div className="glass-card p-4 md:p-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Query Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>

          <input
            type="text"
            aria-label="Search historical archives"
            className="glass-input w-full py-3.5 pl-11 pr-10 text-sm md:text-base"
            placeholder="e.g. anti-colonial movements, independence negotiations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
          />

          {query && (
            <button
              onClick={onClear}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-200 transition-colors"
              title="Clear input"
              aria-label="Clear input"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Year Select Filter */}
        <div className="relative min-w-[140px]">
          <select
            aria-label="Filter by year"
            className="glass-input appearance-none w-full py-3.5 pl-4 pr-10 text-sm cursor-pointer"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {YEARS.map((year) => (
              <option
                key={year.value}
                value={year.value}
                className="bg-neutral-900 text-neutral-100"
              >
                {year.label}
              </option>
            ))}
          </select>
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={onSearch}
          disabled={loading || !query.trim()}
          className="gradient-border group overflow-hidden font-medium text-sm md:text-base px-6 py-3.5 rounded-xl text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span>Search</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
