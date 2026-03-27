import React, { useEffect, useState, useRef, useCallback } from "react";
import { getCachedPage, cacheImageFromElement } from "@/lib/quranCache";
import { getIndianPageImageFallback } from "@/data/indianMushaf";
import { usePinchZoom } from "@/hooks/usePinchZoom";
import { isPageBookmarked, toggleBookmark } from "@/lib/bookmarks";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

export type QuranStyle = "indopak" | "saudi";

export const getCacheKey = (style: QuranStyle, page: number) => `${style}_page_${page}`;

interface QuranPageViewProps {
  page: number;
  style: QuranStyle;
  getImgUrl: (p: number) => string;
  mode?: "complete" | "para" | "surah";
  context?: string;
  paraNum?: number;
  surahNum?: number;
}

const QuranPageView: React.FC<QuranPageViewProps> = ({
  page, style, getImgUrl,
  mode = "complete", context = "Complete Quran", paraNum, surahNum,
}) => {
  const [useFallback, setUseFallback] = useState(false);
  const [error, setError] = useState(false);
  const [cachedSrc, setCachedSrc] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [showLongPressMenu, setShowLongPressMenu] = useState(false);
  const { zoom, setZoom, origin, onTouchStart: pinchStart, onTouchMove: pinchMove, onTouchEnd: pinchEnd } = usePinchZoom(1, 1, 5);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);

  useEffect(() => {
    const key = getCacheKey(style, page);
    getCachedPage(key).then((cached) => {
      if (cached) setCachedSrc(cached);
    });
  }, [page, style]);

  useEffect(() => {
    setBookmarked(isPageBookmarked(page, style, mode));
  }, [page, style, mode]);

  const handleToggleBookmark = useCallback(() => {
    const added = toggleBookmark({
      page, style, mode, context, paraNum, surahNum,
    });
    setBookmarked(added);
    toast(added ? "🔖 Bookmark added" : "Bookmark removed", {
      description: added ? `Page ${page} saved` : `Page ${page} removed from bookmarks`,
      duration: 2000,
    });
    setShowLongPressMenu(false);
  }, [page, style, mode, context, paraNum, surahNum]);

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
    cacheImageFromElement(e.currentTarget, key);
  };

  // Long press handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    longPressTriggered.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      setShowLongPressMenu(true);
    }, 600);
    pinchStart(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    pinchMove(e);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    pinchEnd();
  };

  // Context menu for desktop right-click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLongPressMenu(true);
  };

  const networkSrc = style === "indopak" && useFallback ? getIndianPageImageFallback(page) : getImgUrl(page);
  const src = cachedSrc || networkSrc;

  return (
    <div className="rounded-2xl overflow-hidden border border-primary/10 shadow-gold bg-card relative">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-surface">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Page {page}</span>
          {cachedSrc && <span className="text-[9px] text-primary">●</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleBookmark}
            className={`p-1 rounded-md transition-smooth active:scale-90 ${bookmarked ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            title={bookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-primary" : ""}`} />
          </button>
          <button onClick={() => setZoom((z) => Math.max(1, z - 0.5))} disabled={zoom <= 1} className="text-xs text-muted-foreground disabled:opacity-30 px-1">−</button>
          <span className="text-[10px] text-muted-foreground">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(4, z + 0.5))} disabled={zoom >= 4} className="text-xs text-muted-foreground disabled:opacity-30 px-1">+</button>
        </div>
      </div>

      {error ? (
        <div className="text-center py-8 text-muted-foreground text-xs">Failed to load</div>
      ) : (
        <div
          className="overflow-auto relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onContextMenu={handleContextMenu}
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

      {/* Long press / context menu overlay */}
      {showLongPressMenu && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setShowLongPressMenu(false)} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card border border-primary/20 rounded-2xl shadow-xl p-4 min-w-[220px] animate-fade-in">
            <p className="text-xs text-muted-foreground mb-3 text-center">Page {page}</p>
            <button
              onClick={handleToggleBookmark}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-smooth text-left active:scale-[0.98]"
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? "text-primary fill-primary" : "text-primary"}`} />
              <span className="text-sm font-medium text-foreground">
                {bookmarked ? "Remove Bookmark" : "Add Bookmark"}
              </span>
            </button>
            <button
              onClick={() => setShowLongPressMenu(false)}
              className="w-full mt-2 px-4 py-2 rounded-xl text-xs text-muted-foreground hover:bg-muted/50 transition-smooth"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuranPageView;
