import React, { useState, useCallback } from "react";
import { IslamicBook } from "@/data/islamicBooks";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Bookmark as BookmarkIcon, Download } from "lucide-react";
import { usePinchZoom } from "@/hooks/usePinchZoom";

interface BookPageViewerProps {
  book: IslamicBook;
  isUrdu: boolean;
  onBack?: () => void;
}

const BookPageViewer: React.FC<BookPageViewerProps> = ({ book, isUrdu, onBack }) => {
  const totalPages = book.totalPages || 1;
  const storageKey = `book-page-${book.id}`;
  const bookmarkKey = `book-pages-bm-${book.id}`;

  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? Math.min(parseInt(saved), totalPages) : 1;
  });
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(bookmarkKey) || "[]"); } catch { return []; }
  });
  const [pageInput, setPageInput] = useState("");
  const { zoom, setZoom, onTouchStart, onTouchMove, onTouchEnd } = usePinchZoom();

  const goPage = useCallback((p: number) => {
    if (p >= 1 && p <= totalPages) {
      setPage(p);
      setImgError(false);
      setLoading(true);
      setZoom(1);
      localStorage.setItem(storageKey, String(p));
    }
  }, [totalPages, storageKey, setZoom]);

  const toggleBookmark = () => {
    const updated = bookmarks.includes(page)
      ? bookmarks.filter((b) => b !== page)
      : [...bookmarks, page].sort((a, b) => a - b);
    setBookmarks(updated);
    localStorage.setItem(bookmarkKey, JSON.stringify(updated));
  };

  const [touchStartX, setTouchStartX] = useState(0);
  const handleSwipeStart = useCallback((e: React.TouchEvent) => {
    if (zoom > 1) return;
    if (e.touches.length === 1) setTouchStartX(e.touches[0].clientX);
    onTouchStart(e);
  }, [zoom, onTouchStart]);

  const handleSwipeEnd = useCallback((e: React.TouchEvent) => {
    if (zoom > 1) { onTouchEnd(); return; }
    if (e.changedTouches.length === 1) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 60) {
        if (diff > 0) goPage(page + 1);
        else goPage(page - 1);
      }
    }
    onTouchEnd();
  }, [zoom, touchStartX, page, goPage, onTouchEnd]);

  const imgSrc = book.getPageImage ? book.getPageImage(page) : "";

  return (
    <div className="px-4 py-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-foreground truncate">
            {isUrdu ? book.titleUr : book.title}
          </h2>
          <p className="text-[10px] text-muted-foreground truncate">
            {isUrdu ? book.authorUr : book.author} • {isUrdu ? "صفحہ" : "Page"} {page} / {totalPages}
          </p>
        </div>
        <button
          onClick={toggleBookmark}
          className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
            bookmarks.includes(page)
              ? "bg-primary/20 border-primary/30 text-primary"
              : "bg-card border-border text-muted-foreground"
          }`}
        >
          <BookmarkIcon className={`w-5 h-5 ${bookmarks.includes(page) ? "fill-primary" : ""}`} />
        </button>
      </div>

      {/* Controls: Zoom + Page Jump */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom((z) => Math.max(1, z - 0.5))} disabled={zoom <= 1} className="w-8 h-8 rounded-lg bg-card border border-border text-foreground text-sm flex items-center justify-center disabled:opacity-30">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-muted-foreground px-1 w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(4, z + 0.5))} disabled={zoom >= 4} className="w-8 h-8 rounded-lg bg-card border border-border text-foreground text-sm flex items-center justify-center disabled:opacity-30">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            placeholder={`${page}`}
            className="w-16 text-center py-1.5 rounded-lg bg-card border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={() => {
              const v = parseInt(pageInput);
              if (v >= 1 && v <= totalPages) { goPage(v); setPageInput(""); }
            }}
            className="px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
          >
            {isUrdu ? "جائیں" : "Go"}
          </button>
        </div>
      </div>

      {/* Saved Bookmarks */}
      {bookmarks.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">{isUrdu ? "محفوظ:" : "Saved:"}</span>
          {bookmarks.map((bm) => (
            <button
              key={bm}
              onClick={() => goPage(bm)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                bm === page
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary"
              }`}
            >
              📄 {bm}
            </button>
          ))}
        </div>
      )}

      {/* Page Image */}
      <div
        className="rounded-2xl overflow-auto border border-border bg-card min-h-[400px] relative"
        onTouchStart={handleSwipeStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleSwipeEnd}
        style={{ touchAction: zoom > 1 ? "pan-x pan-y" : "auto" }}
      >
        {imgError ? (
          <div className="text-center py-12 px-4">
            <p className="text-muted-foreground text-sm mb-2">{isUrdu ? "صفحہ لوڈ نہیں ہو سکا" : "Failed to load page"}</p>
            <button onClick={() => { setImgError(false); setLoading(true); }} className="text-primary text-sm underline">
              {isUrdu ? "دوبارہ کوشش کریں" : "Retry"}
            </button>
          </div>
        ) : (
          <>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={imgSrc}
              alt={`${book.title} - Page ${page}`}
              className="transition-transform duration-200"
              style={{ width: `${zoom * 100}%`, maxWidth: "none", transformOrigin: "top center" }}
              onError={() => setImgError(true)}
              onLoad={() => setLoading(false)}
              loading="lazy"
            />
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => goPage(page - 1)}
          disabled={page <= 1}
          className="flex-1 py-3 rounded-xl bg-card border border-border text-foreground text-sm font-medium flex items-center justify-center gap-1 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
          {isUrdu ? "پچھلا" : "Prev"}
        </button>
        <span className="text-xs text-muted-foreground font-medium">{page} / {totalPages}</span>
        <button
          onClick={() => goPage(page + 1)}
          disabled={page >= totalPages}
          className="flex-1 py-3 rounded-xl bg-card border border-border text-foreground text-sm font-medium flex items-center justify-center gap-1 disabled:opacity-30"
        >
          {isUrdu ? "اگلا" : "Next"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Download PDF link */}
      {book.pdfUrl && (
        <a
          href={book.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold active:scale-[0.98] transition-all"
        >
          <Download className="w-4 h-4" />
          {isUrdu ? "پی ڈی ایف ڈاؤن لوڈ کریں" : "Download PDF"}
        </a>
      )}
    </div>
  );
};

export default BookPageViewer;
