export type SearchResult = {
  id: string | number;
  page_id?: string | number;
  year?: number;
  issue?: string;
  page?: string | number;
  date?: string | null;
  headline?: string | null;
  snippet?: string;
  image_path?: string;
  image_url?: string | null;
  similarity?: number;
};

type ArticleCardProps = {
  item: SearchResult;
  onClick: () => void;
};

export function ArticleCard({ item, onClick }: ArticleCardProps) {
  const similarityPct = item.similarity
    ? Math.round(item.similarity * 100)
    : null;

  return (
    <article
      onClick={onClick}
      className="glass-card p-5 md:p-6 cursor-pointer flex flex-col gap-4 text-left group"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-neutral-100 group-hover:text-purple-400 transition-colors line-clamp-1">
            {item.headline || "Amrita Bazar Patrika Clipping"}
          </h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400 font-medium">
            {item.date && (
              <time dateTime={item.date} className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5 text-neutral-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {item.date}
              </time>
            )}
            <span className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5 text-neutral-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Issue {item.issue || "N/A"}
            </span>
            <span className="flex items-center gap-1">Page {item.page || "N/A"}</span>
            {item.year && (
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-purple-300">
                Year {item.year}
              </span>
            )}
          </div>
        </div>

        {/* Similarity Score Tag */}
        {similarityPct !== null && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold select-none shadow-sm shadow-purple-500/5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>{similarityPct}% Match</span>
          </div>
        )}
      </div>

      {/* Snippet text */}
      {item.snippet && (
        <p className="text-neutral-300 text-sm leading-relaxed line-clamp-3 font-normal">
          {item.snippet}
        </p>
      )}

      {/* Display image indicator if available */}
      {(item.image_url || item.image_path) && (
        <div className="mt-1 flex items-center gap-2 text-xs text-teal-400 font-medium bg-teal-500/5 border border-teal-500/10 py-1 px-3.5 rounded-lg w-max select-none">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Image clipping available</span>
        </div>
      )}
    </article>
  );
}
