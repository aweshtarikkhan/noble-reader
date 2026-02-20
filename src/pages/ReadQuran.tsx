import React, { useEffect, useState, useCallback, useRef } from "react";
import { QuranAPI } from "@/lib/quranApi";
import { TOTAL_PAGES } from "@/data/surahs";

const ReadQuran: React.FC = () => {
  const [pages, setPages] = useState<number[]>([]);
  const [jumpTo, setJumpTo] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const startPage = useCallback(() => {
    const saved = parseInt(localStorage.getItem("read-quran-page") || "1");
    return Math.max(1, Math.min(saved, TOTAL_PAGES));
  }, []);

  useEffect(() => {
    const start = startPage();
    const initial = Array.from({ length: 5 }, (_, i) => start + i).filter((p) => p <= TOTAL_PAGES);
    setPages(initial);
  }, []);

  useEffect(() => {
    if (pages.length > 0) {
      localStorage.setItem("read-quran-page", String(pages[0]));
    }
  }, [pages]);

  useEffect(() => {
    const handleScroll = () => {
      if (loadingRef.current) return;
      const el = containerRef.current;
      if (!el) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 800) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pages]);

  const loadMore = () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setPages((prev) => {
      const last = prev[prev.length - 1] || 0;
      const next = Array.from({ length: 5 }, (_, i) => last + 1 + i).filter((p) => p <= TOTAL_PAGES);
      loadingRef.current = false;
      return [...prev, ...next];
    });
  };

  const handleJump = () => {
    const p = parseInt(jumpTo);
    if (p >= 1 && p <= TOTAL_PAGES) {
      const newPages = Array.from({ length: 5 }, (_, i) => p + i).filter((pg) => pg <= TOTAL_PAGES);
      setPages(newPages);
      window.scrollTo(0, 0);
      setJumpTo("");
    }
  };

  return (
    <div ref={containerRef} className="px-4 py-4">
      {/* Jump to page */}
      <div className="flex gap-2 mb-4 animate-fade-in">
        <input
          type="number"
          placeholder="Jump to page..."
          value={jumpTo}
          onChange={(e) => setJumpTo(e.target.value)}
          min={1}
          max={TOTAL_PAGES}
          className="flex-1 px-4 py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm focus:outline-none focus:border-gold/40"
        />
        <button
          onClick={handleJump}
          className="px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-smooth"
        >
          Go
        </button>
      </div>

      {/* Pages */}
      <div className="space-y-4">
        {pages.map((p) => (
          <div key={p} className="rounded-2xl overflow-hidden border border-gold/10 shadow-gold bg-card">
            <div className="text-center py-1.5 bg-surface text-xs text-muted-foreground">Page {p}</div>
            <img
              src={QuranAPI.getMushafPageImage(p)}
              alt={`Page ${p}`}
              className="w-full"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {pages[pages.length - 1] < TOTAL_PAGES && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground mt-2">Loading more pages...</p>
        </div>
      )}
    </div>
  );
};

export default ReadQuran;
