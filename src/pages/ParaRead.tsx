import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JUZ_DATA } from "@/data/surahs";
import { INDIAN_JUZ_DATA, getIndianPageImage, getIndianPageImageFallback } from "@/data/indianMushaf";
import { QuranAPI } from "@/lib/quranApi";
import { Download, Loader2, CheckCircle2 } from "lucide-react";

type QuranStyle = "indopak" | "saudi";

const PAGES_PER_BATCH = 4;

// IndexedDB helpers for caching downloaded pages
const DB_NAME = "quran_pages_cache";
const STORE_NAME = "pages";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getCachedPage(page: number): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(`page_${page}`);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function cachePage(page: number, dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(dataUrl, `page_${page}`);
  } catch {
    // silently fail
  }
}

async function downloadAndCachePage(page: number): Promise<string> {
  const urls = [getIndianPageImage(page), getIndianPageImageFallback(page)];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const blob = await res.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          cachePage(page, dataUrl);
          resolve(dataUrl);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      continue;
    }
  }
  throw new Error("Failed to download page");
}

const ParaRead: React.FC = () => {
  const { num } = useParams();
  const navigate = useNavigate();
  const juzNum = parseInt(num || "1");
  const [style, setStyle] = useState<QuranStyle>(() => (localStorage.getItem("para-quran-style") as QuranStyle) || "indopak");

  const juz = JUZ_DATA.find((j) => j.number === juzNum);
  const indianJuz = INDIAN_JUZ_DATA.find((j) => j.number === juzNum);

  if (!juz) return <div className="p-4 text-center text-muted-foreground">Para not found</div>;

  const handleStyleChange = (s: QuranStyle) => {
    setStyle(s);
    localStorage.setItem("para-quran-style", s);
  };

  const saudiPages = Array.from({ length: juz.endPage - juz.startPage + 1 }, (_, i) => juz.startPage + i);
  const indianPages = indianJuz
    ? Array.from({ length: indianJuz.endPage - indianJuz.startPage + 1 }, (_, i) => indianJuz.startPage + i)
    : [];

  return (
    <div className="px-4 py-4">
      <div className="text-center mb-4 animate-fade-in">
        <h2 className="font-arabic text-xl text-gold">{juz.name}</h2>
        <p className="text-sm text-muted-foreground">Para {juz.number}</p>
      </div>

      {/* Style toggle */}
      <div className="flex bg-card rounded-xl p-1 border border-gold/10 mb-4 animate-fade-in">
        <button
          onClick={() => handleStyleChange("indopak")}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${style === "indopak" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          🇮🇳 Indo-Pak (16 Line)
        </button>
        <button
          onClick={() => handleStyleChange("saudi")}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${style === "saudi" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          🇸🇦 Saudi Style
        </button>
      </div>

      <div className="space-y-4">
        {style === "saudi"
          ? saudiPages.map((p) => (
              <div key={p} className="rounded-2xl overflow-hidden border border-gold/10 shadow-gold bg-card">
                <div className="text-center py-1 bg-surface text-xs text-muted-foreground">Page {p}</div>
                <img
                  src={QuranAPI.getMushafPageImage(p)}
                  alt={`Page ${p}`}
                  className="w-full"
                  loading="lazy"
                />
              </div>
            ))
          : <IndianPagesLoader pages={indianPages} />
        }
      </div>

      <div className="flex items-center justify-between mt-6 gap-3">
        {juzNum > 1 && (
          <button onClick={() => navigate(`/para-read/${juzNum - 1}`)} className="flex-1 py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm transition-smooth hover:border-gold/30">
            ← Para {juzNum - 1}
          </button>
        )}
        {juzNum < 30 && (
          <button onClick={() => navigate(`/para-read/${juzNum + 1}`)} className="flex-1 py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm transition-smooth hover:border-gold/30">
            Para {juzNum + 1} →
          </button>
        )}
      </div>
    </div>
  );
};

// Progressive loader: loads pages in batches as user scrolls
const IndianPagesLoader: React.FC<{ pages: number[] }> = ({ pages }) => {
  const [visibleCount, setVisibleCount] = useState(PAGES_PER_BATCH);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(PAGES_PER_BATCH);
    setDownloadComplete(false);
    setDownloadProgress(0);
  }, [pages]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGES_PER_BATCH, pages.length));
        }
      },
      { rootMargin: "600px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pages.length]);

  const handleDownloadAll = async () => {
    setDownloading(true);
    setDownloadProgress(0);
    for (let i = 0; i < pages.length; i++) {
      try {
        await downloadAndCachePage(pages[i]);
      } catch {
        // skip failed
      }
      setDownloadProgress(Math.round(((i + 1) / pages.length) * 100));
    }
    setDownloading(false);
    setDownloadComplete(true);
    // Force re-render of visible pages to use cached versions
    setVisibleCount((prev) => prev);
  };

  const visiblePages = pages.slice(0, visibleCount);

  return (
    <>
      {/* Download option */}
      <div className="flex items-center justify-center gap-2 mb-3">
        {downloading ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-gold/10 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>Downloading... {downloadProgress}%</span>
          </div>
        ) : downloadComplete ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-gold/10 text-sm text-primary">
            <CheckCircle2 className="w-4 h-4" />
            <span>Downloaded for offline</span>
          </div>
        ) : (
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-gold/10 text-sm text-muted-foreground hover:border-gold/30 transition-smooth active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download for faster loading</span>
          </button>
        )}
      </div>

      {visiblePages.map((p) => (
        <IndianPage key={p} page={p} />
      ))}

      {visibleCount < pages.length && (
        <div ref={sentinelRef} className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          <span className="ml-3 text-sm text-muted-foreground">Loading more pages...</span>
        </div>
      )}
    </>
  );
};

const IndianPage: React.FC<{ page: number }> = ({ page }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cached = await getCachedPage(page);
      if (cached && !cancelled) {
        setSrc(cached);
        setLoading(false);
        return;
      }
      if (!cancelled) {
        setSrc(getIndianPageImage(page));
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [page]);

  const handleError = () => {
    if (!useFallback) {
      setUseFallback(true);
      setSrc(getIndianPageImageFallback(page));
    } else {
      setError(true);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-gold/10 shadow-gold bg-card">
      <div className="text-center py-1 bg-surface text-xs text-muted-foreground">Page {page}</div>
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-muted-foreground text-xs">Failed to load</div>
      ) : (
        <img src={src!} alt={`Page ${page}`} className="w-full" loading="lazy" onError={handleError} />
      )}
    </div>
  );
};

export default ParaRead;
