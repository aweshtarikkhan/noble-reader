import React, { useEffect, useState, useCallback, useRef } from "react";
import { QuranAPI } from "@/lib/quranApi";
import { TOTAL_PAGES } from "@/data/surahs";
import { TOTAL_PAGES_INDIAN, getIndianPageImage, getIndianPageImageFallback } from "@/data/indianMushaf";

// Hook for pinch-to-zoom on touch devices
function usePinchZoom(initialZoom = 1, minZoom = 1, maxZoom = 4) {
  const [zoom, setZoom] = useState(initialZoom);
  const lastDistance = useRef<number | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastDistance.current = Math.hypot(dx, dy);
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastDistance.current !== null) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scale = dist / lastDistance.current;
      setZoom((z) => Math.min(maxZoom, Math.max(minZoom, z * scale)));
      lastDistance.current = dist;
    }
  }, [minZoom, maxZoom]);

  const onTouchEnd = useCallback(() => {
    lastDistance.current = null;
  }, []);

  return { zoom, setZoom, onTouchStart, onTouchMove, onTouchEnd };
}

type QuranStyle = "indopak" | "saudi";

const ReadQuran: React.FC = () => {
  const [style, setStyle] = useState<QuranStyle>(() => (localStorage.getItem("read-quran-style") as QuranStyle) || "indopak");
  const [pages, setPages] = useState<number[]>([]);
  const [jumpTo, setJumpTo] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const totalPages = style === "indopak" ? TOTAL_PAGES_INDIAN : TOTAL_PAGES;
  const storageKey = style === "indopak" ? "read-quran-indopak-page" : "read-quran-saudi-page";

  const getStartPage = useCallback(() => {
    const saved = parseInt(localStorage.getItem(storageKey) || "1");
    return Math.max(1, Math.min(saved, totalPages));
  }, [storageKey, totalPages]);

  useEffect(() => {
    const start = getStartPage();
    const initial = Array.from({ length: 5 }, (_, i) => start + i).filter((p) => p <= totalPages);
    setPages(initial);
    window.scrollTo(0, 0);
  }, [style]);

  useEffect(() => {
    if (pages.length > 0) {
      localStorage.setItem(storageKey, String(pages[0]));
    }
  }, [pages, storageKey]);

  useEffect(() => {
    const handleScroll = () => {
      if (loadingRef.current) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 800) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pages, totalPages]);

  const loadMore = () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setPages((prev) => {
      const last = prev[prev.length - 1] || 0;
      const next = Array.from({ length: 5 }, (_, i) => last + 1 + i).filter((p) => p <= totalPages);
      loadingRef.current = false;
      return [...prev, ...next];
    });
  };

  const handleJump = () => {
    const p = parseInt(jumpTo);
    if (p >= 1 && p <= totalPages) {
      const newPages = Array.from({ length: 5 }, (_, i) => p + i).filter((pg) => pg <= totalPages);
      setPages(newPages);
      window.scrollTo(0, 0);
      setJumpTo("");
    }
  };

  const handleStyleChange = (s: QuranStyle) => {
    setStyle(s);
    localStorage.setItem("read-quran-style", s);
  };

  const getImgSrc = (p: number) => {
    if (style === "indopak") return getIndianPageImage(p);
    return QuranAPI.getMushafPageImage(p);
  };

  return (
    <div ref={containerRef} className="px-4 py-4">
      {/* Style toggle */}
      <div className="flex bg-card rounded-xl p-1 border border-primary/10 mb-4 animate-fade-in">
        <button
          onClick={() => handleStyleChange("indopak")}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${style === "indopak" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          🇮🇳 Indo-Pak Script
        </button>
        <button
          onClick={() => handleStyleChange("saudi")}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${style === "saudi" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          🇸🇦 Uthmani Script
        </button>
      </div>

      {/* Jump to page */}
      <div className="flex gap-2 mb-4 animate-fade-in">
        <input
          type="number"
          placeholder={`Jump to page (1-${totalPages})...`}
          value={jumpTo}
          onChange={(e) => setJumpTo(e.target.value)}
          min={1}
          max={totalPages}
          className="flex-1 px-4 py-3 rounded-xl bg-card border border-primary/10 text-foreground text-sm focus:outline-none focus:border-primary/40"
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
          <ReadQuranPage key={`${style}_${p}`} page={p} style={style} getImgSrc={getImgSrc} />
        ))}
      </div>

      {pages.length > 0 && pages[pages.length - 1] < totalPages && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground mt-2">Loading more pages...</p>
        </div>
      )}
    </div>
  );
};

const ReadQuranPage: React.FC<{ page: number; style: QuranStyle; getImgSrc: (p: number) => string }> = ({ page, style, getImgSrc }) => {
  const [useFallback, setUseFallback] = useState(false);
  const [error, setError] = useState(false);
  const { zoom, setZoom, onTouchStart, onTouchMove, onTouchEnd } = usePinchZoom();

  const handleError = () => {
    if (style === "indopak" && !useFallback) {
      setUseFallback(true);
    } else {
      setError(true);
    }
  };

  const src = style === "indopak" && useFallback ? getIndianPageImageFallback(page) : getImgSrc(page);

  return (
    <div className="rounded-2xl overflow-hidden border border-primary/10 shadow-gold bg-card">
      <div className="flex items-center justify-between px-3 py-1.5 bg-surface">
        <span className="text-xs text-muted-foreground">Page {page}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom((z) => Math.max(1, z - 0.5))} disabled={zoom <= 1} className="text-xs text-muted-foreground disabled:opacity-30 px-1">−</button>
          <span className="text-[10px] text-muted-foreground">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(4, z + 0.5))} disabled={zoom >= 4} className="text-xs text-muted-foreground disabled:opacity-30 px-1">+</button>
        </div>
      </div>
      {error ? (
        <div className="text-center py-8 text-muted-foreground text-xs">Failed to load</div>
      ) : (
        <div
          className="overflow-auto"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ touchAction: zoom > 1 ? "pan-x pan-y" : "auto" }}
        >
          <img
            src={src}
            alt={`Page ${page}`}
            className="transition-transform duration-100"
            style={{ width: `${zoom * 100}%`, maxWidth: "none", transformOrigin: "top center" }}
            loading="lazy"
            onError={handleError}
          />
        </div>
      )}
    </div>
  );
};

export default ReadQuran;
