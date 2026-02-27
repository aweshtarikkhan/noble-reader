import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QuranAPI } from "@/lib/quranApi";
import { TOTAL_PAGES, JUZ_DATA, SURAHS } from "@/data/surahs";
import { TOTAL_PAGES_INDIAN, getIndianPageImage, INDIAN_JUZ_DATA } from "@/data/indianMushaf";
import { getCachedCount, getCachedPage, setCachedPage, downloadImageAsDataUrl } from "@/lib/quranCache";
import { getIndianPageImageFallback } from "@/data/indianMushaf";
import QuranPageView, { type QuranStyle, getCacheKey } from "@/components/QuranPageView";
import { CheckCircle2 } from "lucide-react";

type ReadMode = "complete" | "para" | "surah";

const ReadQuran: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ReadMode>(() => (localStorage.getItem("read-quran-mode") as ReadMode) || "complete");
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

  // Surah search
  const [surahSearch, setSurahSearch] = useState("");

  const totalPages = style === "indopak" ? TOTAL_PAGES_INDIAN : TOTAL_PAGES;
  const storageKey = style === "indopak" ? "read-quran-indopak-page" : "read-quran-saudi-page";

  const getStartPage = useCallback(() => {
    const saved = parseInt(localStorage.getItem(storageKey) || "1");
    return Math.max(1, Math.min(saved, totalPages));
  }, [storageKey, totalPages]);

  useEffect(() => {
    if (mode === "complete") {
      getCachedCount(`${style}_page_`, totalPages).then(setCachedPages);
    }
  }, [style, totalPages, mode]);

  useEffect(() => {
    if (mode === "complete") {
      const start = getStartPage();
      const initial = Array.from({ length: 5 }, (_, i) => start + i).filter((p) => p <= totalPages);
      setPages(initial);
      window.scrollTo(0, 0);
    }
  }, [style, mode]);

  useEffect(() => {
    if (mode === "complete" && pages.length > 0) {
      localStorage.setItem(storageKey, String(pages[0]));
    }
  }, [pages, storageKey, mode]);

  useEffect(() => {
    if (mode !== "complete") return;
    const handleScroll = () => {
      if (loadingRef.current) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 800) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pages, totalPages, mode]);

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

  const handleModeChange = (m: ReadMode) => {
    setMode(m);
    localStorage.setItem("read-quran-mode", m);
    window.scrollTo(0, 0);
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
      if (existing) { setDownloadProgress(i); continue; }

      const primaryUrl = style === "indopak" ? getIndianPageImage(i) : QuranAPI.getMushafPageImage(i);
      let dataUrl = await downloadImageAsDataUrl(primaryUrl);

      if (!dataUrl && style === "indopak") {
        dataUrl = await downloadImageAsDataUrl(getIndianPageImageFallback(i));
      }
      if (!dataUrl && style === "saudi") {
        const fallbacks = QuranAPI.getMushafPageImageFallbacks(i);
        for (const fb of fallbacks) { dataUrl = await downloadImageAsDataUrl(fb); if (dataUrl) break; }
      }
      if (dataUrl) await setCachedPage(key, dataUrl);
      setDownloadProgress(i);
    }

    const count = await getCachedCount(`${style}_page_`, totalPages);
    setCachedPages(count);
    setDownloading(false);
  };

  const juzData = style === "indopak" ? INDIAN_JUZ_DATA : JUZ_DATA;

  const filteredSurahs = SURAHS.filter(
    (s) =>
      s.englishName.toLowerCase().includes(surahSearch.toLowerCase()) ||
      s.translation.toLowerCase().includes(surahSearch.toLowerCase()) ||
      s.name.includes(surahSearch) ||
      String(s.number).includes(surahSearch)
  );

  return (
    <div ref={containerRef} className="px-4 py-4">
      {/* Style toggle */}
      <div className="flex bg-card rounded-xl p-1 border border-primary/10 mb-3 animate-fade-in">
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

      {/* Mode toggle */}
      <div className="flex bg-card rounded-xl p-1 border border-primary/10 mb-4 animate-fade-in">
        {([
          { key: "complete" as ReadMode, label: "📖 Complete Quran" },
          { key: "para" as ReadMode, label: "📚 By Para" },
          { key: "surah" as ReadMode, label: "📜 By Surah" },
        ]).map((m) => (
          <button
            key={m.key}
            onClick={() => handleModeChange(m.key)}
            className={`flex-1 py-2 text-[11px] font-medium rounded-lg transition-smooth ${mode === m.key ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* === COMPLETE QURAN MODE === */}
      {mode === "complete" && (
        <>
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
                  downloading ? "bg-destructive/20 text-destructive border border-destructive/30"
                    : cachedPages === totalPages ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {downloading ? "Stop" : cachedPages === totalPages ? "Downloaded ✓" : "Download All"}
              </button>
            </div>
            {downloading && (
              <div className="space-y-1">
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${(downloadProgress / totalPages) * 100}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground text-center">{downloadProgress}/{totalPages} ({Math.round((downloadProgress / totalPages) * 100)}%)</p>
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
            <button onClick={handleJump} className="px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-smooth">Go</button>
          </div>

          {/* Pages */}
          <div className="space-y-4">
            {pages.map((p) => {
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
        </>
      )}

      {/* === BY PARA MODE === */}
      {mode === "para" && (
        <div className="flex flex-col gap-2 animate-fade-in">
          {juzData.map((juz, i) => (
            <button
              key={juz.number}
              onClick={() => navigate(`/para-read/${juz.number}`)}
              className="flex items-center gap-3 p-4 rounded-xl bg-card border border-primary/10 hover:border-primary/30 transition-smooth text-left"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-primary text-sm font-bold">{juz.number}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-foreground">Para {juz.number} - {juz.nameTransliteration}</span>
                  <span className="font-arabic text-primary text-sm">{juz.name}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Pages {juz.startPage}–{juz.endPage}
                </p>
              </div>
              <span className="text-muted-foreground">›</span>
            </button>
          ))}
        </div>
      )}

      {/* === BY SURAH MODE === */}
      {mode === "surah" && (
        <div className="animate-fade-in">
          <input
            type="text"
            placeholder="Search surah by name or number..."
            value={surahSearch}
            onChange={(e) => setSurahSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-card border border-primary/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-smooth mb-4 text-sm"
          />
          <div className="flex flex-col gap-2">
            {filteredSurahs.map((s, i) => (
              <button
                key={s.number}
                onClick={() => navigate(`/surah-read/${s.number}`)}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-primary/10 hover:border-primary/30 transition-smooth text-left"
                style={{ animationDelay: `${Math.min(i * 0.02, 0.5)}s` }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-primary text-sm font-bold">{s.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">{s.englishName}</span>
                    <span className="font-arabic text-primary text-base">{s.name}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-muted-foreground">{s.translation}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{s.ayahs} ayahs</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${s.type === "Meccan" ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"}`}>
                        {s.type}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadQuran;
