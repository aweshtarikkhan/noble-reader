import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TOTAL_PAGES_INDIAN, getIndianPageImage, getIndianPageImageFallback, INDIAN_JUZ_DATA } from "@/data/indianMushaf";
import LoadingSpinner from "@/components/LoadingSpinner";

const IndianMushaf: React.FC = () => {
  const { page: pageParam } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(() => {
    const p = pageParam ? parseInt(pageParam) : parseInt(localStorage.getItem("indian-mushaf-page") || "1");
    return Math.max(1, Math.min(p, TOTAL_PAGES_INDIAN));
  });
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("indian-mushaf-bookmarks") || "[]"); } catch { return []; }
  });
  const [imgError, setImgError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    localStorage.setItem("indian-mushaf-page", String(page));
    navigate(`/indian-mushaf/${page}`, { replace: true });
  }, [page]);

  const currentJuz = INDIAN_JUZ_DATA.find(
    (j) => page >= j.startPage && page <= j.endPage
  );

  const toggleBookmark = () => {
    const updated = bookmarks.includes(page)
      ? bookmarks.filter((b) => b !== page)
      : [...bookmarks, page];
    setBookmarks(updated);
    localStorage.setItem("indian-mushaf-bookmarks", JSON.stringify(updated));
  };

  const goPage = (p: number) => {
    if (p >= 1 && p <= TOTAL_PAGES_INDIAN) {
      setPage(p);
      setImgError(false);
      setUseFallback(false);
      setZoom(1);
    }
  };

  // Touch swipe (only when not zoomed)
  const [touchStart, setTouchStart] = useState(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoom > 1) return;
    setTouchStart(e.touches[0].clientX);
  }, [zoom]);
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (zoom > 1) return;
      const diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 60) {
        if (diff > 0) goPage(page + 1);
        else goPage(page - 1);
      }
    },
    [touchStart, page, zoom]
  );

  const handleImgError = () => {
    if (!useFallback) {
      setUseFallback(true);
    } else {
      setImgError(true);
    }
  };

  const imgSrc = useFallback ? getIndianPageImageFallback(page) : getIndianPageImage(page);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.5, 4));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.5, 1));

  return (
    <div className="px-4 py-4" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Header info */}
      <div className="flex items-center gap-2 mb-4 animate-fade-in">
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-foreground">🇮🇳 16-Line Indo-Pak Quran</h2>
          <p className="text-[10px] text-muted-foreground">
            With Ruku markers • {currentJuz ? `Para ${currentJuz.number} - ${currentJuz.name}` : ""}
          </p>
        </div>
        <button
          onClick={toggleBookmark}
          className={`w-10 h-10 rounded-xl border transition-smooth flex items-center justify-center ${
            bookmarks.includes(page) ? "bg-primary/20 border-gold/30 text-gold" : "bg-card border-gold/10 text-muted-foreground"
          }`}
        >
          {bookmarks.includes(page) ? "🔖" : "📑"}
        </button>
      </div>

      {/* Page Label + Zoom Controls */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={zoom <= 1}
            className="w-8 h-8 rounded-lg bg-card border border-gold/10 text-foreground text-sm flex items-center justify-center transition-smooth disabled:opacity-30"
          >
            −
          </button>
          <span className="text-xs text-muted-foreground px-1">{Math.round(zoom * 100)}%</span>
          <button
            onClick={zoomIn}
            disabled={zoom >= 4}
            className="w-8 h-8 rounded-lg bg-card border border-gold/10 text-foreground text-sm flex items-center justify-center transition-smooth disabled:opacity-30"
          >
            +
          </button>
        </div>
        <span className="text-xs text-muted-foreground">Page {page} of {TOTAL_PAGES_INDIAN}</span>
      </div>

      {/* Para selector */}
      <div className="flex gap-1 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        {INDIAN_JUZ_DATA.map((j) => (
          <button
            key={j.number}
            onClick={() => goPage(j.startPage)}
            className={`shrink-0 px-2 py-1 rounded-lg text-[10px] border transition-smooth ${
              currentJuz?.number === j.number
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-gold/10 text-muted-foreground hover:border-gold/30"
            }`}
          >
            Para {j.number}
          </button>
        ))}
      </div>

      {/* Image Content with Zoom */}
      <div className="rounded-2xl overflow-auto border border-gold/10 shadow-gold bg-card min-h-[400px] flex items-center justify-center">
        {imgError ? (
          <div className="text-center py-12 px-4">
            <p className="text-muted-foreground text-sm mb-2">Failed to load page image</p>
            <p className="text-muted-foreground text-[10px] mb-3">The image server may be temporarily unavailable</p>
            <button onClick={() => { setImgError(false); setUseFallback(false); }} className="text-gold text-sm underline">
              Retry
            </button>
          </div>
        ) : (
          <img
            src={imgSrc}
            alt={`Indian Quran Page ${page}`}
            className="transition-transform duration-200"
            style={{ 
              width: `${zoom * 100}%`, 
              maxWidth: "none",
              transformOrigin: "top center" 
            }}
            onError={handleImgError}
            loading="lazy"
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4 gap-3">
        <button
          onClick={() => goPage(page - 1)}
          disabled={page <= 1}
          className="flex-1 py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm font-medium transition-smooth hover:border-gold/30 disabled:opacity-30"
        >
          ← Prev
        </button>
        <input
          type="number"
          min={1}
          max={TOTAL_PAGES_INDIAN}
          value={page}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            if (v >= 1 && v <= TOTAL_PAGES_INDIAN) goPage(v);
          }}
          className="w-20 text-center py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm focus:outline-none focus:border-gold/40"
        />
        <button
          onClick={() => goPage(page + 1)}
          disabled={page >= TOTAL_PAGES_INDIAN}
          className="flex-1 py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm font-medium transition-smooth hover:border-gold/30 disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default IndianMushaf;
