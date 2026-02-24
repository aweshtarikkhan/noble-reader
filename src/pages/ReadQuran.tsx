import React, { useEffect, useState, useCallback, useRef } from "react";
import { QuranAPI } from "@/lib/quranApi";
import { TOTAL_PAGES } from "@/data/surahs";
import { TOTAL_PAGES_INDIAN, getIndianPageImage, getIndianPageImageFallback } from "@/data/indianMushaf";
import { getCachedPage, setCachedPage, downloadImageAsDataUrl, getCachedCount } from "@/lib/quranCache";

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

const getCacheKey = (style: QuranStyle, page: number) => `${style}_page_${page}`;

const ReadQuran: React.FC = () => {
  const [style, setStyle] = useState<QuranStyle>(() => (localStorage.getItem("read-quran-style") as QuranStyle) || "indopak");
  const [pages, setPages] = useState<number[]>([]);
  const [jumpTo, setJumpTo] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Download all state
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [cachedPages, setCachedPages] = useState(0);
  const downloadAbort = useRef(false);

  const totalPages = style === "indopak" ? TOTAL_PAGES_INDIAN : TOTAL_PAGES;
  const storageKey = style === "indopak" ? "read-quran-indopak-page" : "read-quran-saudi-page";

  const getStartPage = useCallback(() => {
    const saved = parseInt(localStorage.getItem(storageKey) || "1");
    return Math.max(1, Math.min(saved, totalPages));
  }, [storageKey, totalPages]);

  // Check cached count on mount and style change
  useEffect(() => {
    getCachedCount(`${style}_page_`, totalPages).then(setCachedPages);
  }, [style, totalPages]);

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
    setDownloading(false);
    downloadAbort.current = true;
  };

  const getImgUrl = (p: number) => {
    if (style === "indopak") return getIndianPageImage(p);
    return QuranAPI.getMushafPageImage(p);
  };

  const handleDownloadAll = async () => {
    if (downloading) {
      downloadAbort.current = true;
      setDownloading(false);
      return;
    }

    setDownloading(true);
    downloadAbort.current = false;
    setDownloadProgress(0);

    for (let i = 1; i <= totalPages; i++) {
      if (downloadAbort.current) break;

      const key = getCacheKey(style, i);
      const existing = await getCachedPage(key);
      if (existing) {
        setDownloadProgress(i);
        continue;
      }

      // Try primary URL
      const primaryUrl = style === "indopak" ? getIndianPageImage(i) : QuranAPI.getMushafPageImage(i);
      let dataUrl = await downloadImageAsDataUrl(primaryUrl);

      // Try fallback for indopak
      if (!dataUrl && style === "indopak") {
        dataUrl = await downloadImageAsDataUrl(getIndianPageImageFallback(i));
      }

      // Try fallbacks for saudi
      if (!dataUrl && style === "saudi") {
        const fallbacks = QuranAPI.getMushafPageImageFallbacks(i);
        for (const fb of fallbacks) {
          dataUrl = await downloadImageAsDataUrl(fb);
          if (dataUrl) break;
        }
      }

      if (dataUrl) {
        await setCachedPage(key, dataUrl);
      }

      setDownloadProgress(i);
    }

    const count = await getCachedCount(`${style}_page_`, totalPages);
    setCachedPages(count);
    setDownloading(false);
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

      {/* Download All / Cache Status */}
      <div className="bg-card rounded-xl border border-primary/10 p-3 mb-4 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs font-medium text-foreground">📥 Offline Reading</p>
            <p className="text-[10px] text-muted-foreground">
              {cachedPages}/{totalPages} pages saved • {cachedPages === totalPages ? "✅ All downloaded" : "Download for instant loading"}
            </p>
          </div>
          <button
            onClick={handleDownloadAll}
            disabled={cachedPages === totalPages && !downloading}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth ${
              downloading
                ? "bg-destructive/20 text-destructive border border-destructive/30"
                : cachedPages === totalPages
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {downloading ? "Stop" : cachedPages === totalPages ? "Downloaded ✓" : "Download All"}
          </button>
        </div>
        {downloading && (
          <div className="space-y-1">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(downloadProgress / totalPages) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              {downloadProgress}/{totalPages} ({Math.round((downloadProgress / totalPages) * 100)}%)
            </p>
          </div>
        )}
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
          <ReadQuranPage key={`${style}_${p}`} page={p} style={style} getImgUrl={getImgUrl} />
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

const ReadQuranPage: React.FC<{ page: number; style: QuranStyle; getImgUrl: (p: number) => string }> = ({ page, style, getImgUrl }) => {
  const [useFallback, setUseFallback] = useState(false);
  const [error, setError] = useState(false);
  const [cachedSrc, setCachedSrc] = useState<string | null>(null);
  const { zoom, setZoom, onTouchStart, onTouchMove, onTouchEnd } = usePinchZoom();

  // Try to load from cache first
  useEffect(() => {
    const key = getCacheKey(style, page);
    getCachedPage(key).then((cached) => {
      if (cached) setCachedSrc(cached);
    });
  }, [page, style]);

  const handleError = () => {
    if (style === "indopak" && !useFallback) {
      setUseFallback(true);
    } else {
      setError(true);
    }
  };

  // Auto-cache on successful load
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (cachedSrc) return; // already cached
    const key = getCacheKey(style, page);
    const img = e.currentTarget;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/webp", 0.8);
        setCachedPage(key, dataUrl);
      }
    } catch {
      // CORS may block canvas - silently skip auto-cache
    }
  };

  const networkSrc = style === "indopak" && useFallback ? getIndianPageImageFallback(page) : getImgUrl(page);
  const src = cachedSrc || networkSrc;

  return (
    <div className="rounded-2xl overflow-hidden border border-primary/10 shadow-gold bg-card">
      <div className="flex items-center justify-between px-3 py-1.5 bg-surface">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Page {page}</span>
          {cachedSrc && <span className="text-[9px] text-primary">●</span>}
        </div>
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
            crossOrigin="anonymous"
            onError={handleError}
            onLoad={handleLoad}
          />
        </div>
      )}
    </div>
  );
};

export default ReadQuran;
