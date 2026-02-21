import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JUZ_DATA } from "@/data/surahs";
import { INDIAN_JUZ_DATA, getIndianPageImage, getIndianPageImageFallback } from "@/data/indianMushaf";
import { QuranAPI } from "@/lib/quranApi";
import { Download, Loader2, CheckCircle2, HardDriveDownload } from "lucide-react";

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

async function isPageCached(page: number): Promise<boolean> {
  const cached = await getCachedPage(page);
  return cached !== null;
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
  // Check if already cached
  const existing = await getCachedPage(page);
  if (existing) return existing;

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

async function requestStoragePermission(): Promise<boolean> {
  try {
    // Try Capacitor Filesystem permission
    const { Filesystem } = await import("@capacitor/filesystem");
    const perm = await Filesystem.requestPermissions();
    return perm.publicStorage === "granted";
  } catch {
    // Not on Capacitor or plugin not available
    // For web, check persistent storage
    if (navigator.storage && navigator.storage.persist) {
      const granted = await navigator.storage.persist();
      return granted;
    }
    return true; // IndexedDB works without explicit permission on web
  }
}

async function checkParaDownloaded(pages: number[]): Promise<boolean> {
  try {
    for (const p of pages) {
      const cached = await isPageCached(p);
      if (!cached) return false;
    }
    return true;
  } catch {
    return false;
  }
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
          : <IndianPagesLoader pages={indianPages} juzNum={juzNum} />
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
const IndianPagesLoader: React.FC<{ pages: number[]; juzNum: number }> = ({ pages, juzNum }) => {
  const [visibleCount, setVisibleCount] = useState(PAGES_PER_BATCH);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [paraDownloaded, setParaDownloaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Check if this para is already fully downloaded
  useEffect(() => {
    setVisibleCount(PAGES_PER_BATCH);
    setDownloadProgress(0);
    setDownloading(false);
    checkParaDownloaded(pages).then(setParaDownloaded);
  }, [pages, juzNum]);

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
    // Request storage permission first
    const permGranted = await requestStoragePermission();
    if (!permGranted) {
      alert("Storage permission is needed to download pages for offline use.");
      return;
    }

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
    setParaDownloaded(true);
    // Mark in localStorage so we know this para is downloaded
    localStorage.setItem(`para_downloaded_${juzNum}`, "true");
    // Force refresh pages to use cached data
    setRefreshKey((k) => k + 1);
    setVisibleCount(pages.length);
  };

  const visiblePages = pages.slice(0, visibleCount);

  return (
    <>
      {/* Download Complete Para button at top - compact */}
      <div className="flex items-center justify-center mb-3">
        {downloading ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-gold/10 text-xs text-muted-foreground">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            <span>Downloading... {downloadProgress}%</span>
          </div>
        ) : paraDownloaded ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-gold/10 text-xs text-primary">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Downloaded</span>
          </div>
        ) : (
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-gold/10 text-xs text-muted-foreground hover:border-gold/30 transition-smooth active:scale-95"
          >
            <HardDriveDownload className="w-3.5 h-3.5" />
            <span>Download Complete Para</span>
          </button>
        )}
      </div>

      {visiblePages.map((p) => (
        <IndianPage key={`${p}_${refreshKey}`} page={p} paraDownloaded={paraDownloaded} />
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

const IndianPage: React.FC<{ page: number; paraDownloaded: boolean }> = ({ page, paraDownloaded }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [error, setError] = useState(false);
  const [cached, setCached] = useState(false);
  const [downloadingPage, setDownloadingPage] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cachedData = await getCachedPage(page);
      if (cachedData && !cancelled) {
        setSrc(cachedData);
        setCached(true);
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

  const handleDownloadSingle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const permGranted = await requestStoragePermission();
    if (!permGranted) {
      alert("Storage permission is needed to download.");
      return;
    }
    setDownloadingPage(true);
    try {
      const dataUrl = await downloadAndCachePage(page);
      setSrc(dataUrl);
      setCached(true);
    } catch {
      // failed
    }
    setDownloadingPage(false);
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-gold/10 shadow-gold bg-card">
      <div className="flex items-center justify-between px-3 py-1 bg-surface">
        <span className="text-xs text-muted-foreground">Page {page}</span>
        {/* Per-page download icon */}
        {cached || paraDownloaded ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
        ) : downloadingPage ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
        ) : (
          <button onClick={handleDownloadSingle} className="p-0.5 active:scale-90 transition-smooth">
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
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
