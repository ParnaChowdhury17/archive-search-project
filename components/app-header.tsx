export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 glass w-full py-4 px-6 md:px-12 flex justify-between items-center transition-all">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-purple-500 via-indigo-500 to-teal-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <span className="font-semibold text-lg tracking-wide bg-gradient-to-r from-neutral-100 to-neutral-300 bg-clip-text text-transparent">
          Rittika Archive
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs font-medium text-neutral-400">
        <span className="hidden sm:inline px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
          Semantic Search V1.0
        </span>
      </div>
    </header>
  );
}
