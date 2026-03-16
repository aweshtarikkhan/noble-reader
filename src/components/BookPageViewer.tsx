import React, { useState, useEffect, useCallback, useRef } from "react";
import { IslamicBook } from "@/data/islamicBooks";
import { Download, Bookmark as BookmarkIcon, ZoomIn, ZoomOut, Check, Loader2 } from "lucide-react";
import { usePinchZoom } from "@/hooks/usePinchZoom";
import localforage from "localforage";

const bookImageStore = localforage.createInstance({ name: "book_images_cache" });

const getCacheKey = (bookId: string, page: number) => `book_${bookId}_page_${page}`;

async function getCachedImage(bookId: string, page: number): Promise<string | null> {
  try {
    const data = await bookImageStore.getItem<string>(getCacheKey(bookId, page));
    return data || null;
  } catch { return null; }
}

async function cacheImage(bookId: string, page: number, dataUrl: string) {
  try {
    await bookImageStore.setItem(getCacheKey(bookId, page), dataUrl);
  } catch { /* storage full */ }
}

async function downloadAndCacheImage(bookId: string, page: number, url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        cacheImage(bookId, page, dataUrl);
        resolve(dataUrl);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
}

// Single page component with lazy loading & caching
const BookPage: React.FC<{
  bookId: string;
  page: number;
  getPageImage: (p: number) => string;
  zoom: number;
}> = ({ bookId, page, getPageImage, zoom }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Intersection observer for lazy loading
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "600px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Load from cache or network
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    (async () => {
      const cached = await getCachedImage(bookId, page);
      if (cached && !cancelled) {
        setSrc(cached);
        setLoading(false);
        return;
      }
      // Load from network and cache
      const url = getPageImage(page);
      const downloaded = await downloadAndCacheImage(bookId, page, url);
      if (!cancelled) {
        if (downloaded) { setSrc(downloaded); setLoading(false); }
        else {
          // Fallback: use direct URL
          setSrc(url);
          setLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [visible, bookId, page, getPageImage]);

  return (
    <div ref={ref} className="relative border-b border-border/50">
      {/* Page number badge */}
      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-background/80 backdrop-blur-sm text-[10px] text-muted-foreground font-medium border border-border/50">
        {page}
      </div>

      {!visible || loading ? (
        <div className="w-full flex items-center justify-center bg-muted/20" style={{ minHeight: 500 }}>
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="w-full flex items-center justify-center bg-muted/20 py-12" style={{ minHeight: 300 }}>
          <p className="text-xs text-muted-foreground">Failed to load page {page}</p>
        </div>
      ) : (
        <img
          src={src || ""}
          alt={`Page ${page}`}
          className="w-full"
          style={{ width: `${zoom * 100}%`, maxWidth: "none", transformOrigin: "top left" }}
          onError={() => setError(true)}
          loading="lazy"
        />
      )}
    </div>
  );
};

interface BookPageViewerProps {
  book: IslamicBook;
  isUrdu: boolean;
}

const BookPageViewer: React.FC<BookPageViewerProps> = ({ book, isUrdu }) => {
  const totalPages = book.totalPages || 1;
  const bookmarkKey = `book-pages-bm-${book.id}`;
  const scrollKey = `book-scroll-${book.id}`;

  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(bookmarkKey) || "[]"); } catch { return []; }
  });
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isFullyDownloaded, setIsFullyDownloaded] = useState(false);
  const { zoom, setZoom, onTouchStart: pinchStart, onTouchMove: pinchMove, onTouchEnd: pinchEnd } = usePinchZoom(1, 1, 4);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if already downloaded
  useEffect(() => {
    (async () => {
      // Check a few pages to see if downloaded
      const checks = [1, Math.floor(totalPages / 2), totalPages];
      const results = await Promise.all(checks.map(p => getCachedImage(book.id, p)));
      if (results.every(r => r !== null)) setIsFullyDownloaded(true);
    })();
  }, [book.id, totalPages]);

  // Restore scroll position
  useEffect(() => {
    const saved = localStorage.getItem(scrollKey);
    if (saved && containerRef.current) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(saved));
      }, 300);
    }
  }, [scrollKey]);

  // Save scroll position periodically
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        localStorage.setItem(scrollKey, String(window.scrollY));
      }, 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => { window.removeEventListener("scroll", handleScroll); clearTimeout(timeout); };
  }, [scrollKey]);

  const toggleBookmark = (page: number) => {
    const updated = bookmarks.includes(page)
      ? bookmarks.filter((b) => b !== page)
      : [...bookmarks, page].sort((a, b) => a - b);
    setBookmarks(updated);
    localStorage.setItem(bookmarkKey, JSON.stringify(updated));
  };

  const scrollToPage = (page: number) => {
    const el = containerRef.current;
    if (!el) return;
    const pages = el.querySelectorAll("[data-page]");
    const target = Array.from(pages).find(p => p.getAttribute("data-page") === String(page));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Download all pages
  const downloadAll = async () => {
    if (downloading || !book.getPageImage) return;
    setDownloading(true);
    setDownloadProgress(0);

    const batchSize = 3;
    for (let i = 1; i <= totalPages; i += batchSize) {
      const batch = [];
      for (let j = i; j < i + batchSize && j <= totalPages; j++) {
        batch.push((async (pg: number) => {
          const cached = await getCachedImage(book.id, pg);
          if (!cached) {
            await downloadAndCacheImage(book.id, pg, book.getPageImage!(pg));
          }
        })(j));
      }
      await Promise.all(batch);
      setDownloadProgress(Math.min(i + batchSize - 1, totalPages));
    }

    setDownloading(false);
    setIsFullyDownloaded(true);
  };

  const [pageInput, setPageInput] = useState("");

  if (!book.getPageImage) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="px-4 py-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-foreground truncate">
            {isUrdu ? book.titleUr : book.title}
          </h2>
          <p className="text-[10px] text-muted-foreground truncate">
            {isUrdu ? book.authorUr : book.author} • {totalPages} {isUrdu ? "صفحات" : "pages"}
          </p>
        </div>

        {/* Download button */}
        <button
          onClick={downloadAll}
          disabled={downloading || isFullyDownloaded}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
            isFullyDownloaded
              ? "bg-green-500/20 text-green-600 border border-green-500/30"
              : downloading
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {isFullyDownloaded ? (
            <><Check className="w-3.5 h-3.5" />{isUrdu ? "محفوظ" : "Saved"}</>
          ) : downloading ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" />{downloadProgress}/{totalPages}</>
          ) : (
            <><Download className="w-3.5 h-3.5" />{isUrdu ? "ڈاؤن لوڈ" : "Download"}</>
          )}
        </button>
      </div>

      {/* Download progress bar */}
      {downloading && (
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(downloadProgress / totalPages) * 100}%` }}
          />
        </div>
      )}

      {/* Controls: Zoom + Page Jump */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(z => Math.max(1, z - 0.5))} disabled={zoom <= 1} className="w-8 h-8 rounded-lg bg-card border border-border text-foreground text-sm flex items-center justify-center disabled:opacity-30">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-muted-foreground px-1 w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(3, z + 0.5))} disabled={zoom >= 3} className="w-8 h-8 rounded-lg bg-card border border-border text-foreground text-sm flex items-center justify-center disabled:opacity-30">
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
            placeholder={isUrdu ? "صفحہ..." : "Page..."}
            className="w-16 text-center py-1.5 rounded-lg bg-card border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={() => {
              const v = parseInt(pageInput);
              if (v >= 1 && v <= totalPages) { scrollToPage(v); setPageInput(""); }
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
              onClick={() => scrollToPage(bm)}
              className="group px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium active:scale-90 transition-all flex items-center gap-1"
            >
              📄 {bm}
              <span
                onClick={(e) => { e.stopPropagation(); toggleBookmark(bm); }}
                className="text-muted-foreground hover:text-destructive ml-0.5"
              >×</span>
            </button>
          ))}
        </div>
      )}

      {/* All Pages - Vertical Scroll */}
      <div
        ref={containerRef}
        className="rounded-2xl overflow-auto border border-border bg-card"
        onTouchStart={pinchStart}
        onTouchMove={pinchMove}
        onTouchEnd={pinchEnd}
        style={{ touchAction: zoom > 1 ? "pan-x pan-y" : "auto" }}
      >
        {pages.map((p) => (
          <div key={p} data-page={p} className="relative">
            <BookPage
              bookId={book.id}
              page={p}
              getPageImage={book.getPageImage!}
              zoom={zoom}
            />
            {/* Bookmark button on each page */}
            <button
              onClick={() => toggleBookmark(p)}
              className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                bookmarks.includes(p)
                  ? "bg-primary/20 text-primary"
                  : "bg-background/60 backdrop-blur-sm text-muted-foreground"
              }`}
            >
              <BookmarkIcon className={`w-3.5 h-3.5 ${bookmarks.includes(p) ? "fill-primary" : ""}`} />
            </button>
          </div>
        ))}
      </div>

      {/* PDF Download link */}
      {book.pdfUrl && (
        <a
          href={book.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm font-medium active:scale-[0.98] transition-all"
        >
          <Download className="w-4 h-4" />
          {isUrdu ? "پی ڈی ایف ڈاؤن لوڈ کریں" : "Download PDF"}
        </a>
      )}
    </div>
  );
};

export default BookPageViewer;
