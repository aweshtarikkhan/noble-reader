import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QuranAPI } from "@/lib/quranApi";
import { TOTAL_PAGES, JUZ_DATA, SURAHS } from "@/data/surahs";
import { TOTAL_PAGES_INDIAN, getIndianPageImage, INDIAN_JUZ_DATA } from "@/data/indianMushaf";
import { getCachedCount, getCachedPage, setCachedPage, downloadImageAsDataUrl } from "@/lib/quranCache";
import { getIndianPageImageFallback } from "@/data/indianMushaf";
import QuranPageView, { type QuranStyle, getCacheKey } from "@/components/QuranPageView";
import { BookOpen, BookMarked, Bookmark, ChevronRight, ArrowLeft } from "lucide-react";
import CompleteTextReader from "@/components/CompleteTextReader";

type ReadMode = "complete" | "para" | "surah";
type StyleOption = "indopak" | "saudi" | "text";
type WizardStep = "mode" | "style" | "reading";

// Bookmark helpers
const getBookmarkKey = (mode: ReadMode, style: StyleOption) => `bookmark_${mode}_${style}`;

const getBookmark = (mode: ReadMode, style: StyleOption): number => {
  const val = localStorage.getItem(getBookmarkKey(mode, style));
  return val ? parseInt(val) : 1;
};

const setBookmark = (mode: ReadMode, style: StyleOption, page: number) => {
  localStorage.setItem(getBookmarkKey(mode, style), String(page));
};

const ReadQuran: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>("mode");
  const [mode, setMode] = useState<ReadMode>("complete");
  const [style, setStyle] = useState<StyleOption>("indopak");

  // Complete reading state
  const [pages, setPages] = useState<number[]>([]);
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

  const totalPages = style === "indopak" ? TOTAL_PAGES_INDIAN : TOTAL_PAGES;
  const juzData = style === "indopak" ? INDIAN_JUZ_DATA : JUZ_DATA;

  // Bookmark for current page in complete mode
  const currentBookmark = getBookmark(mode, style);

  const handleModeSelect = (m: ReadMode) => {
    setMode(m);
    setStep("style");
  };

  const handleStyleSelect = (s: StyleOption) => {
    setStyle(s);
    localStorage.setItem("read-quran-style", s === "text" ? "saudi" : s);

    // Text mode always goes to reading step (shows surah list for selection)
    if (s === "text") {
      setStep("reading");
      return;
    }

    if (mode === "para") {
      setStep("reading");
    } else if (mode === "surah") {
      setStep("reading");
    } else {
      // Complete mode
      setStep("reading");
      const start = getBookmark("complete", s);
      const initial = Array.from({ length: 5 }, (_, i) => start + i).filter((p) => p <= (s === "indopak" ? TOTAL_PAGES_INDIAN : TOTAL_PAGES));
      setPages(initial);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step === "style") setStep("mode");
    else if (step === "reading") {
      setStep("style");
      setPages([]);
      setDownloading(false);
      downloadAbort.current = true;
    }
  };

  // Complete mode: save bookmark on scroll
  useEffect(() => {
    if (step !== "reading" || mode !== "complete" || pages.length === 0) return;
    setBookmark("complete", style, pages[0]);
  }, [pages, step, mode, style]);

  // Download cache count
  useEffect(() => {
    if (step === "reading" && mode === "complete" && style !== "text") {
      getCachedCount(`${style}_page_`, totalPages).then(setCachedPages);
    }
  }, [style, totalPages, step, mode]);

  // Infinite scroll
  useEffect(() => {
    if (step !== "reading" || mode !== "complete") return;
    const handleScroll = () => {
      if (loadingRef.current) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 800) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pages, totalPages, step, mode]);

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
      setBookmark("complete", style, p);
      window.scrollTo(0, 0);
      setJumpTo("");
    }
  };

  const getImgUrl = (p: number) => {
    if (style === "indopak") return getIndianPageImage(p);
    return QuranAPI.getMushafPageImage(p);
  };

  const handleDownloadAll = async () => {
    if (downloading) { downloadAbort.current = true; setDownloading(false); return; }
    setDownloading(true);
    downloadAbort.current = false;
    setDownloadProgress(0);
    for (let i = 1; i <= totalPages; i++) {
      if (downloadAbort.current) break;
      const key = getCacheKey(style as QuranStyle, i);
      const existing = await getCachedPage(key);
      if (existing) { setDownloadProgress(i); continue; }
      const primaryUrl = style === "indopak" ? getIndianPageImage(i) : QuranAPI.getMushafPageImage(i);
      let dataUrl = await downloadImageAsDataUrl(primaryUrl);
      if (!dataUrl && style === "indopak") dataUrl = await downloadImageAsDataUrl(getIndianPageImageFallback(i));
      if (!dataUrl && style === "saudi") {
        for (const fb of QuranAPI.getMushafPageImageFallbacks(i)) { dataUrl = await downloadImageAsDataUrl(fb); if (dataUrl) break; }
      }
      if (dataUrl) await setCachedPage(key, dataUrl);
      setDownloadProgress(i);
    }
    const count = await getCachedCount(`${style}_page_`, totalPages);
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
          <h1 className="text-xl font-bold text-foreground">Read Quran</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose how you'd like to read</p>
        </div>

        <div className="flex flex-col gap-3">
          {([
            { key: "complete" as ReadMode, icon: "📖", title: "Complete Quran", desc: "Read from cover to cover with continuous scrolling", bookmark: getBookmark("complete", "indopak") },
            { key: "para" as ReadMode, icon: "📚", title: "Read by Para (Juz)", desc: "Choose a specific para to read", bookmark: null },
            { key: "surah" as ReadMode, icon: "📜", title: "Read by Surah", desc: "Select any surah from the 114 chapters", bookmark: null },
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
                    <span className="text-[10px] text-primary font-medium">Bookmarked at page {m.bookmark}</span>
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

  // ============= STEP 2: Choose Style =============
  if (step === "style") {
    const modeLabel = mode === "complete" ? "Complete Quran" : mode === "para" ? "By Para" : "By Surah";
    return (
      <div className="px-4 py-6">
        <button onClick={handleBack} className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 hover:text-foreground transition-smooth">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BookMarked className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Choose Script Style</h1>
          <p className="text-sm text-muted-foreground mt-1">Reading: {modeLabel}</p>
        </div>

        <div className="flex flex-col gap-3">
          {([
            { key: "indopak" as StyleOption, icon: "🇮🇳", title: "Indo-Pak Script", desc: "16-line Taj Company style, commonly used in South Asia", detail: "Naskh script with ruku markers" },
            { key: "saudi" as StyleOption, icon: "🇸🇦", title: "Uthmani Script", desc: "Standard Madani mushaf style used in Saudi Arabia", detail: "15-line Madinah Mushaf" },
            { key: "text" as StyleOption, icon: "📝", title: "Line by Line (Text)", desc: "Digital text format with clear ayah numbering", detail: "Searchable Arabic text" },
          ]).map((s, i) => (
            <button
              key={s.key}
              onClick={() => handleStyleSelect(s.key)}
              className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-primary/10 hover:border-primary/30 transition-smooth text-left animate-fade-in active:scale-[0.98]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-2xl">{s.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-base text-foreground">{s.title}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                <p className="text-[10px] text-primary mt-1">{s.detail}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ============= STEP 3: Reading =============
  return (
    <div ref={containerRef} className="px-4 py-4">
      {/* Top bar with back + bookmark info */}
      <div className="flex items-center justify-between mb-4 animate-fade-in">
        <button onClick={handleBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth">
          <ArrowLeft className="w-4 h-4" /> Change Style
        </button>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10">
          <span className="text-[10px] font-medium text-primary">
            {style === "indopak" ? "🇮🇳 Indo-Pak" : style === "saudi" ? "🇸🇦 Uthmani" : "📝 Text"}
          </span>
        </div>
      </div>

      {/* === COMPLETE QURAN MODE === */}
      {mode === "complete" && style !== "text" && (
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
            <span className="text-[11px] text-primary font-medium">Bookmarked at page {pages[0] || currentBookmark}</span>
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
                  <QuranPageView page={p} style={style as QuranStyle} getImgUrl={getImgUrl} mode="complete" context="Complete Quran" />
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
      {mode === "complete" && style === "text" && (
        <CompleteTextReader />
      )}

      {/* === BY PARA MODE === */}
      {mode === "para" && (
        <div className="flex flex-col gap-2 animate-fade-in">
          {juzData.map((juz, i) => {
            const paraBookmark = getBookmark("para", style);
            const isBookmarked = paraBookmark === juz.number;
            return (
              <button
                key={juz.number}
                onClick={() => {
                  setBookmark("para", style, juz.number);
                  navigate(`/para-read/${juz.number}${style === "text" ? "?style=text" : ""}`);
                }}
                className={`flex items-center gap-3 p-4 rounded-xl bg-card border ${isBookmarked ? "border-primary/40 ring-1 ring-primary/20" : "border-primary/10"} hover:border-primary/30 transition-smooth text-left`}
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
            placeholder="Search surah by name or number..."
            value={surahSearch}
            onChange={(e) => setSurahSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-card border border-primary/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-smooth mb-4 text-sm"
          />
          <div className="flex flex-col gap-2">
            {filteredSurahs.map((s, i) => {
              const surahBookmark = getBookmark("surah", style);
              const isBookmarked = surahBookmark === s.number;
              return (
                <button
                  key={s.number}
                  onClick={() => {
                    setBookmark("surah", style, s.number);
                    navigate(`/surah-read/${s.number}${style === "text" ? "?style=text" : ""}`);
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
                        <span className="text-[10px] text-muted-foreground">{s.ayahs} ayahs</span>
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
