import { SearchResult } from "./article-card";

type ArticleModalProps = {
  item: SearchResult | null;
  onClose: () => void;
};

export function ArticleModal({ item, onClose }: ArticleModalProps) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="glass-card w-full max-w-3xl overflow-hidden max-h-[85vh] flex flex-col bg-neutral-950/90 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header details */}
        <div className="p-6 border-b border-white/10 flex justify-between items-start">
          <div className="space-y-1.5 pr-8">
            <h3
              id="modal-title"
              className="text-xl md:text-2xl font-bold tracking-tight text-white"
            >
              {item.headline || "Newspaper Clipping Record"}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
              {item.date && (
                <span className="font-semibold text-neutral-300">
                  {item.date}
                </span>
              )}
              <span>&bull;</span>
              <span>Issue {item.issue || "N/A"}</span>
              <span>&bull;</span>
              <span>Page {item.page || "N/A"}</span>
              {item.year && (
                <>
                  <span>&bull;</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-purple-300 text-[10px]">
                    Year {item.year}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-1 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
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
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 overflow-y-auto space-y-6 select-text">
          {/* Full OCR text */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
              Full OCR Text Block
            </h4>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-neutral-200 text-sm leading-relaxed font-mono whitespace-pre-line max-h-96 overflow-y-auto">
              {item.snippet || "No textual snippets are associated with this item."}
            </div>
          </div>

          {/* Image Preview Area */}
          {(item.image_url || item.image_path) && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                Image Reference Attachment
              </h4>
              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-neutral-900 flex justify-center items-center py-8">
                {/* Prefer image_url, fallback to local path */}
                {item.image_url ? (
                  <picture>
                    <img
                      src={item.image_url}
                      alt={item.headline || "Clipping image"}
                      className="max-h-64 object-contain rounded"
                      loading="lazy"
                    />
                  </picture>
                ) : (
                  <div className="text-center p-4">
                    <svg
                      className="w-10 h-10 text-neutral-600 mx-auto mb-2"
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
                    <p className="text-xs text-neutral-500">
                      Clipping path recorded in database:
                    </p>
                    <code className="text-[10px] text-neutral-400 break-all">
                      {item.image_path}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg border border-white/5 bg-white/[0.01]">
              <span className="text-neutral-500 block mb-1">Database Match ID</span>
              <code className="text-neutral-300 break-all">{item.id}</code>
            </div>
            <div className="p-3 rounded-lg border border-white/5 bg-white/[0.01]">
              <span className="text-neutral-500 block mb-1">Page Reference ID</span>
              <code className="text-neutral-300 break-all">{item.page_id || "N/A"}</code>
            </div>
            {item.similarity !== undefined && (
              <div className="p-3 rounded-lg border border-white/5 bg-white/[0.01] col-span-2 flex justify-between items-center">
                <div>
                  <span className="text-neutral-500 block">
                    Cosine Similarity Confidence
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    How closely this segment matches the search meaning
                  </span>
                </div>
                <span className="font-semibold text-purple-400 text-sm">
                  {item.similarity.toFixed(6)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal footer */}
        <div className="p-4 border-t border-white/10 bg-neutral-950 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Clipping
          </button>
        </div>
      </div>
    </div>
  );
}
