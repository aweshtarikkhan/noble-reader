import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { QuranAPI } from "@/lib/quranApi";
import { TOTAL_PAGES, JUZ_DATA } from "@/data/surahs";
import { TOTAL_PAGES_INDIAN, getIndianPageImage, INDIAN_JUZ_DATA } from "@/data/indianMushaf";
import { getCachedCount, getCachedPage, setCachedPage, downloadImageAsDataUrl } from "@/lib/quranCache";
import { getIndianPageImageFallback } from "@/data/indianMushaf";
import QuranPageView, { type QuranStyle, getCacheKey } from "@/components/QuranPageView";

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

      const primaryUrl = style === "indopak" ? getIndianPageImage(i) : QuranAPI.getMushafPageImage(i);
      let dataUrl = await downloadImageAsDataUrl(primaryUrl);

      if (!dataUrl && style === "indopak") {
        dataUrl = await downloadImageAsDataUrl(getIndianPageImageFallback(i));
      }

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
        {pages.map((p) => {
          const juzData = style === "indopak" ? INDIAN_JUZ_DATA : JUZ_DATA;
          const juz = juzData.find((j) => j.startPage === p);
          return (
            <React.Fragment key={`${style}_${p}`}>
              {juz && (
                <div className="flex items-center gap-3 py-3">
                  <div className="flex-1 h-px bg-primary/20" />
                  <div className="text-center">
                    <p className="font-arabic text-lg text-primary">{juz.name}</p>
                    <p className="text-[10px] text-muted-foreground">Para {juz.number} - {juz.nameTransliteration}</p>
                  </div>
                  <div className="flex-1 h-px bg-primary/20" />
                </div>
              )}
              <QuranPageView page={p} style={style} getImgUrl={getImgUrl} />
            </React.Fragment>
          );
        })}
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

export default ReadQuran;
