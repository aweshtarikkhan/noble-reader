import React, { useEffect, useState } from "react";
import { getCachedPage, cacheImageFromElement } from "@/lib/quranCache";
import { getIndianPageImageFallback } from "@/data/indianMushaf";
import { usePinchZoom } from "@/hooks/usePinchZoom";

export type QuranStyle = "indopak" | "saudi";

export const getCacheKey = (style: QuranStyle, page: number) => `${style}_page_${page}`;

interface QuranPageViewProps {
  page: number;
  style: QuranStyle;
  getImgUrl: (p: number) => string;
}

const QuranPageView: React.FC<QuranPageViewProps> = ({ page, style, getImgUrl }) => {
  const [useFallback, setUseFallback] = useState(false);
  const [error, setError] = useState(false);
  const [cachedSrc, setCachedSrc] = useState<string | null>(null);
  const { zoom, setZoom, onTouchStart, onTouchMove, onTouchEnd } = usePinchZoom();

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

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (cachedSrc) return;
    const key = getCacheKey(style, page);
    // Try to cache from the loaded image element (may fail due to CORS taint)
    cacheImageFromElement(e.currentTarget, key);
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
            onError={handleError}
            onLoad={handleLoad}
          />
        </div>
      )}
    </div>
  );
};

export default QuranPageView;
