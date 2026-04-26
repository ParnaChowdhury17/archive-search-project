"use client";

import { useState } from "react";

type Result = {
  id: string;
  issue: string;
  page: string;
  date: string | null;
  headline: string | null;
  snippet: string;
  image_path: string;
  image_url: string | null;
  similarity?: number;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search() {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Search failed");
        return;
      }

      setResults(data.results || []);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Historical Newspaper Semantic Search
        </h1>

        <p className="text-neutral-400 mb-6">
          Search Amrita Bazar Patrika archive pages by meaning, not only exact keywords.
        </p>

        <div className="flex gap-3 mb-8">
          <input
            className="flex-1 rounded-xl bg-neutral-900 border border-neutral-700 px-4 py-3 outline-none"
            placeholder="Try: German postwar industry, India Russia relations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") search();
            }}
          />

          <button
            onClick={search}
            disabled={loading}
            className="rounded-xl bg-white text-black px-5 py-3 font-medium disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {!loading && results.length > 0 && (
          <p className="text-neutral-400 mb-4">
            Found {results.length} semantic matches
          </p>
        )}

        <div className="space-y-4">
          {results.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
            >
              <h2 className="text-xl font-semibold mb-1">
                {r.headline || "Untitled page"}
              </h2>

              <p className="text-sm text-neutral-400 mb-3">
                {r.date || "Unknown date"} · {r.issue} · {r.page}
              </p>

              <p className="text-neutral-200 leading-relaxed mb-3">
                {r.snippet}
              </p>

              <p className="text-xs text-neutral-500 mb-1">
                Score: {r.similarity?.toFixed(3)}
              </p>

              <p className="text-xs text-neutral-500">
                Image: {r.image_url || r.image_path}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}