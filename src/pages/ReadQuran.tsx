import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QuranAPI } from "@/lib/quranApi";
import { TOTAL_PAGES, JUZ_DATA, SURAHS } from "@/data/surahs";
import { TOTAL_PAGES_INDIAN, getIndianPageImage, INDIAN_JUZ_DATA } from "@/data/indianMushaf";
import { getHifzPageImage, TOTAL_PAGES_HIFZ } from "@/data/hifzMushaf";
import { getCachedCount, getCachedPage, setCachedPage, downloadImageAsDataUrl } from "@/lib/quranCache";
import { getIndianPageImageFallback } from "@/data/indianMushaf";
import { getHifzPageImageFallback } from "@/data/hifzMushaf";
import QuranPageView, { type QuranStyle, getCacheKey } from "@/components/QuranPageView";
import { BookOpen, BookMarked, Bookmark, ChevronRight } from "lucide-react";
import CompleteTextReader from "@/components/CompleteTextReader";
import StyleSwitcher, { type ReadingStyle } from "@/components/StyleSwitcher";
import { useI18n } from "@/lib/i18n";

type ReadMode = "complete" | "para" | "surah";
type WizardStep = "mode" | "reading";

// Bookmark helpers
const getBookmarkKey = (mode: ReadMode, style: string) => `bookmark_${mode}_${style}`;

const getBookmark = (mode: ReadMode, style: string): number => {
  const val = localStorage.getItem(getBookmarkKey(mode, style));
  return val ? parseInt(val) : 1;
};

const setBookmark = (mode: ReadMode, style: string, page: number) => {
  localStorage.setItem(getBookmarkKey(mode, style), String(page));
};

const ReadQuran: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useI18n();
  const isContinue = searchParams.get("continue") === "1";
  const [readingStyle, setReadingStyle] = useState<ReadingStyle>(
    () => (localStorage.getItem("read-quran-style-full") as ReadingStyle) || "indopak"
  );
  const [step, setStep] = useState<WizardStep>(isContinue ? "reading" : "mode");
  const [mode, setMode] = useState<ReadMode>("complete");

  const imageStyle: QuranStyle = readingStyle === "text" ? "indopak" : readingStyle;

  // Complete reading state
  const [pages, setPages] = useState<number[]>(() => {
    if (isContinue && readingStyle !== "text") {
      const start = getBookmark("complete", readingStyle);
      const tp = readingStyle === "indopak" ? TOTAL_PAGES_INDIAN : TOTAL_PAGES;
      return Array.from({ length: 5 }, (_, i) => start + i).filter((p) => p <= tp);
    }
    return [];
  });
  const [jumpTo, setJumpTo] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Download state
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [cachedPages, setCachedPages] = useState(0);
  const downloadAbort = useRef(false);

  // Surah/Para search
  const [surahSearch, setSurahSearch] = useState("");

  const totalPages = imageStyle === "indopak" ? TOTAL_PAGES_INDIAN : (imageStyle === "hifz" ? TOTAL_PAGES_HIFZ : TOTAL_PAGES);
  const juzData = imageStyle === "indopak" ? INDIAN_JUZ_DATA : JUZ_DATA;

  const currentBookmark = getBookmark(mode, readingStyle);

  const handleModeSelect = (m: ReadMode) => {
    setMode(m);
    if (m === "complete") {
      setStep("reading");
      window.history.pushState({ readQuranView: "reading", mode: m }, "");
      const start = getBookmark("complete", readingStyle);
      const tp = readingStyle === "text" ? TOTAL_PAGES_INDIAN : (readingStyle === "indopak" ? TOTAL_PAGES_INDIAN : TOTAL_PAGES);
      const initial = Array.from({ length: 5 }, (_, i) => start + i).filter((p) => p <= tp);
      setPages(initial);
      window.scrollTo(0, 0);
    } else {
      setStep("reading");
      window.history.pushState({ readQuranView: "reading", mode: m }, "");
    }
  };

  const handleStyleChange = (s: ReadingStyle) => {
    setReadingStyle(s);
    localStorage.setItem("read-quran-style-full", s);
    if (mode === "complete" && s !== "text") {
      const tp = s === "indopak" ? TOTAL_PAGES_INDIAN : TOTAL_PAGES;
      const start = getBookmark("complete", s);
      const initial = Array.from({ length: 5 }, (_, i) => start + i).filter((p) => p <= tp);
      setPages(initial);
      window.scrollTo(0, 0);
    }
  };

  // Handle browser back to go from reading → mode selection
  useEffect(() => {
    if (step !== "reading") return;
    const handlePopState = () => {
      setStep("mode");
      setPages([]);
      setDownloading(false);
      downloadAbort.current = true;
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [step]);

  // Complete mode: save bookmark on scroll
  useEffect(() => {
    if (step !== "reading" || mode !== "complete" || readingStyle === "text" || pages.length === 0) return;
    setBookmark("complete", readingStyle, pages[0]);
  }, [pages, step, mode, readingStyle]);

  // Download cache count
  useEffect(() => {
    if (step === "reading" && mode === "complete" && readingStyle !== "text") {
      getCachedCount(`${imageStyle}_page_`, totalPages).then(setCachedPages);
    }
  }, [imageStyle, totalPages, step, mode, readingStyle]);

  // Infinite scroll
  useEffect(() => {
    if (step !== "reading" || mode !== "complete" || readingStyle === "text") return;
    const handleScroll = () => {
      if (loadingRef.current) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 800) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pages, totalPages, step, mode, readingStyle]);

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
      setBookmark("complete", readingStyle, p);
      window.scrollTo(0, 0);
      setJumpTo("");
    }
  };

  const getImgUrl = (p: number) => {
    if (imageStyle === "indopak") return getIndianPageImage(p);
    if (imageStyle === "hifz") return getHifzPageImage(p);
    return QuranAPI.getMushafPageImage(p);
  };

  const handleDownloadAll = async () => {
    if (downloading) { downloadAbort.current = true; setDownloading(false); return; }
    setDownloading(true);
    downloadAbort.current = false;
    setDownloadProgress(0);
    for (let i = 1; i <= totalPages; i++) {
      if (downloadAbort.current) break;
      const key = getCacheKey(imageStyle, i);
      const existing = await getCachedPage(key);
      if (existing) { setDownloadProgress(i); continue; }
      const primaryUrl = imageStyle === "indopak" ? getIndianPageImage(i) : (imageStyle === "hifz" ? getHifzPageImage(i) : QuranAPI.getMushafPageImage(i));
      let dataUrl = await downloadImageAsDataUrl(primaryUrl);
      if (!dataUrl && imageStyle === "indopak") dataUrl = await downloadImageAsDataUrl(getIndianPageImageFallback(i));
      if (!dataUrl && imageStyle === "hifz") {
        dataUrl = await downloadImageAsDataUrl(getHifzPageImageFallback(i));
        if (!dataUrl) dataUrl = await downloadImageAsDataUrl((await import("@/data/hifzMushaf")).getHifzPageImageFallback2(i));
      }
      if (!dataUrl && imageStyle === "saudi") {
        for (const fb of QuranAPI.getMushafPageImageFallbacks(i)) { dataUrl = await downloadImageAsDataUrl(fb); if (dataUrl) break; }
      }
      if (dataUrl) await setCachedPage(key, dataUrl);
      setDownloadProgress(i);
    }
    const count = await getCachedCount(`${imageStyle}_page_`, totalPages);
    setCachedPages(count);
    setDownloading(false);
  };

  const filteredSurahs = SURAHS.filter(
    (s) =>
      s.englishName.toLowerCase().includes(surahSearch.toLowerCase()) ||
      s.translation.toLowerCase().includes(surahSearch.toLowerCase()) ||
      s.name.includes(surahSearch) ||
      String(s.number).includes(surahSearch)
  );

  // ============= STEP 1: Choose Mode =============
  if (step === "mode") {
    return (
      <div className="px-4 py-6">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{t("read.readQuran")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("read.chooseHow")}</p>
        </div>

        <div className="flex flex-col gap-3">
          {([
            { key: "complete" as ReadMode, icon: "📖", title: t("read.completeQuran"), desc: t("read.completeDesc"), bookmark: getBookmark("complete", "indopak") },
            { key: "para" as ReadMode, icon: "📚", title: t("read.byPara"), desc: t("read.byParaDesc"), bookmark: null },
            { key: "surah" as ReadMode, icon: "📜", title: t("read.bySurah"), desc: t("read.bySurahDesc"), bookmark: null },
          ]).map((m, i) => (
            <button
              key={m.key}
              onClick={() => handleModeSelect(m.key)}
              className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-primary/10 hover:border-primary/30 transition-smooth text-left animate-fade-in active:scale-[0.98]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-2xl">{m.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-base text-foreground">{m.title}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                {m.key === "complete" && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <Bookmark className="w-3 h-3 text-primary" />
                    <span className="text-[10px] text-primary font-medium">{t("read.bookmarkedAt")} {m.bookmark}</span>
                  </div>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ============= STEP 2: Reading =============
  return (
    <div ref={containerRef} className="px-4 py-4">

      {/* Style switcher - always visible */}
      <StyleSwitcher style={readingStyle} onChange={handleStyleChange} />

      {/* === COMPLETE QURAN MODE (Image) === */}
      {mode === "complete" && readingStyle !== "text" && (
        <>
          {/* Download + Bookmark */}
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

          {/* Bookmark indicator */}
          <div className="flex items-center gap-2 mb-3 px-1 animate-fade-in">
            <Bookmark className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-[11px] text-primary font-medium">{t("read.bookmarkedAt")} {pages[0] || currentBookmark}</span>
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
            <button onClick={handleJump} className="px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-smooth">{t("read.go")}</button>
          </div>

          {/* Pages */}
          <div className="space-y-4 snap-y snap-mandatory">
            {pages.map((p) => {
              const juz = juzData.find((j) => j.startPage === p);
              return (
                <React.Fragment key={`${imageStyle}_${p}`}>
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
                  <QuranPageView
                    page={p}
                    style={imageStyle}
                    getImgUrl={getImgUrl}
                    mode="complete"
                    context="Complete Quran"
                    totalPages={totalPages}
                    onNavigate={(target) => {
                      // Ensure target page is loaded
                      setPages((prev) => {
                        if (prev.includes(target)) return prev;
                        const last = prev[prev.length - 1] || 0;
                        if (target > last) {
                          const additions = Array.from({ length: target - last }, (_, i) => last + 1 + i).filter((pg) => pg <= totalPages);
                          return [...prev, ...additions];
                        }
                        // target before first loaded → reset window starting at target
                        return Array.from({ length: 5 }, (_, i) => target + i).filter((pg) => pg <= totalPages);
                      });
                      setBookmark("complete", readingStyle, target);
                      // Wait for render then scroll
                      requestAnimationFrame(() => {
                        setTimeout(() => {
                          const el = document.querySelector(`[data-quran-page="${imageStyle}_${target}"]`) as HTMLElement | null;
                          el?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 50);
                      });
                    }}
                  />
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

      {/* === COMPLETE QURAN in TEXT MODE === */}
      {mode === "complete" && readingStyle === "text" && (
        <CompleteTextReader />
      )}

      {/* === BY PARA MODE === */}
      {mode === "para" && (
        <div className="flex flex-col gap-2 animate-fade-in">
          {juzData.map((juz, i) => {
            const paraBookmark = getBookmark("para", readingStyle);
            const isBookmarked = paraBookmark === juz.number;
            return (
              <button
                key={juz.number}
                onClick={() => {
                  setBookmark("para", readingStyle, juz.number);
                  navigate(`/para-read/${juz.number}`);
                }}
                className={`flex items-center gap-3 p-4 rounded-xl bg-card border ${isBookmarked ? "border-primary/40 ring-1 ring-primary/20" : "border-primary/10"} hover:border-primary/30 transition-smooth text-left`}
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-primary text-sm font-bold">{juz.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">{t("read.para")} {juz.number} - {juz.nameTransliteration}</span>
                    <span className="font-arabic text-primary text-sm">{juz.name}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {t("read.pages")} {juz.startPage}–{juz.endPage}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {isBookmarked && <Bookmark className="w-3.5 h-3.5 text-primary fill-primary" />}
                  <span className="text-muted-foreground">›</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* === BY SURAH MODE === */}
      {mode === "surah" && (
        <div className="animate-fade-in">
          <input
            type="text"
            placeholder={t("read.searchSurah")}
            value={surahSearch}
            onChange={(e) => setSurahSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-card border border-primary/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-smooth mb-4 text-sm"
          />
          <div className="flex flex-col gap-2">
            {filteredSurahs.map((s, i) => {
              const surahBookmark = getBookmark("surah", readingStyle);
              const isBookmarked = surahBookmark === s.number;
              return (
                <button
                  key={s.number}
                  onClick={() => {
                    setBookmark("surah", readingStyle, s.number);
                    navigate(`/surah-read/${s.number}`);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl bg-card border ${isBookmarked ? "border-primary/40 ring-1 ring-primary/20" : "border-primary/10"} hover:border-primary/30 transition-smooth text-left`}
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
                        {isBookmarked && <Bookmark className="w-3 h-3 text-primary fill-primary" />}
                        <span className="text-[10px] text-muted-foreground">{s.ayahs} {t("audio.ayahs")}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${s.type === "Meccan" ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"}`}>
                          {s.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadQuran;
