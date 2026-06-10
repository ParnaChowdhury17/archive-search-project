"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { SearchBar } from "@/components/search-bar";
import { ArticleCard, SearchResult } from "@/components/article-card";
import { ArticleModal } from "@/components/article-modal";

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  // Trigger search API call
  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({
        q: query,
        year: selectedYear,
      });

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to retrieve search results.");
        return;
      }

      setResults(data.results || []);
    } catch (err) {
      console.error("Search API error:", err);
      setError("An unexpected error occurred. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  }

  // Clear query and search results
  function handleClear() {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    setError("");
  }

  return (
    <div className="min-h-screen bg-grid relative text-neutral-100 font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Visual background glow elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-900/10 blur-[120px] pointer-events-none" />

      {/* Sticky Header */}
      <AppHeader />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
        
        {/* Hero Section */}
        <section className="text-center max-w-3xl mb-12 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            Explore History <br className="sm:hidden" />
            <span className="gradient-text font-black">Semantically</span>
          </h1>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl">
            Search through the Amrita Bazar Patrika archives by year by context.
          </p>
        </section>

        {/* Search Bar / Input Controls */}
        <section className="w-full max-w-3xl mb-10">
          <SearchBar
            query={query}
            setQuery={setQuery}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            onSearch={handleSearch}
            onClear={handleClear}
            loading={loading}
          />
        </section>

        {/* Results Info and Listing */}
        <section className="w-full max-w-3xl">
          
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse" role="status" aria-live="polite">
              <div className="w-12 h-12 rounded-full border-2 border-t-purple-500 border-white/10 animate-spin mb-4" />
              <span className="text-sm text-neutral-400">Scanning historical clippings...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="glass-card p-6 border-red-500/20 bg-red-500/5 text-center flex flex-col items-center justify-center" role="alert">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3 text-red-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-white mb-1">Search Interrupted</h3>
              <p className="text-neutral-400 text-sm max-w-md">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {hasSearched && !loading && !error && results.length === 0 && (
            <div className="glass-card p-10 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-neutral-900/50 flex items-center justify-center mb-4 text-neutral-500 border border-white/5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-200 mb-1">No Matches Found</h3>
              <p className="text-neutral-400 text-sm max-w-md">
                We couldn&apos;t find any clippings matching &ldquo;{query}&rdquo;
                {selectedYear !== "all" ? ` in ${selectedYear}` : ""}. Try adjusting the phrasing of your concept.
              </p>
            </div>
          )}

          {/* Results State */}
          {!loading && !error && results.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center px-1 text-sm text-neutral-400">
                <p>
                  Showing the top <span className="text-purple-400 font-semibold">{results.length}</span> matches... 
                  {selectedYear !== "all" ? ` for the year ${selectedYear}` : ""}
                </p>
                <span className="text-xs text-neutral-500">Sorted by semantic confidence</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {results.map((item) => (
                  <ArticleCard
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedResult(item)}
                  />
                ))}
              </div>
            </div>
          )}

        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-8 text-center text-xs text-neutral-500 bg-neutral-950/20 backdrop-blur-sm">
        <p>&copy; {new Date().getFullYear()} Historical Archive Search Project. All rights reserved.</p>
        <p className="mt-1.5 text-[10px] text-neutral-600">Amrita Bazar Patrika digital restoration archives.</p>
      </footer>

      {/* Expanded OCR Result Modal */}
      <ArticleModal
        item={selectedResult}
        onClose={() => setSelectedResult(null)}
      />
    </div>
  );
}