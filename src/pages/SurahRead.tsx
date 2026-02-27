import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { SURAHS, getSurahPageRange } from "@/data/surahs";
import { QuranAPI } from "@/lib/quranApi";
import { getIndianPageImage } from "@/data/indianMushaf";
import { getCachedPage, setCachedPage, downloadImageAsDataUrl } from "@/lib/quranCache";
import { getIndianPageImageFallback } from "@/data/indianMushaf";
import { Loader2, CheckCircle2, HardDriveDownload } from "lucide-react";
import QuranPageView, { type QuranStyle, getCacheKey } from "@/components/QuranPageView";
import LoadingSpinner from "@/components/LoadingSpinner";

const PAGES_PER_BATCH = 4;
const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

interface Ayah {
  text: string;
  numberInSurah: number;
}

const SurahRead: React.FC = () => {
  const { num } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const surahNum = parseInt(num || "1");
  const surah = SURAHS.find((s) => s.number === surahNum);

  const isTextMode = searchParams.get("style") === "text";
  const [style, setStyle] = useState<QuranStyle>(() => (localStorage.getItem("read-quran-style") as QuranStyle) || "indopak");

  // Text mode state
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isTextMode) {
      setLoading(true);
      setError("");
      QuranAPI.getSurah(surahNum)
        .then((data) => setAyahs(data.ayahs))
        .catch(() => setError("Failed to load surah"))
        .finally(() => setLoading(false));
    }
  }, [surahNum, isTextMode]);

  if (!surah) return <div className="p-4 text-center text-muted-foreground">Surah not found</div>;

  const handleStyleChange = (s: QuranStyle) => {
    setStyle(s);
    localStorage.setItem("read-quran-style", s);
  };

  const { startPage, endPage } = getSurahPageRange(surahNum, style === "indopak" ? "indopak" : "saudi");
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const getImgUrl = (p: number) => {
    if (style === "indopak") return getIndianPageImage(p);
    return QuranAPI.getMushafPageImage(p);
  };

  const navSuffix = isTextMode ? "?style=text" : "";

  return (
    <div className="px-4 py-4">
      {/* Header */}
      <div className="text-center mb-4 animate-fade-in p-4 rounded-2xl bg-card border border-primary/10 shadow-gold">
        <h2 className="font-arabic text-2xl text-primary">{surah.name}</h2>
        <p className="text-foreground font-medium mt-1">{surah.englishName}</p>
        <p className="text-xs text-muted-foreground">{surah.translation} • {surah.ayahs} Ayahs • {surah.type}</p>
        {isTextMode && (
          <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">📝 Line by Line Text</span>
        )}
      </div>

      {/* Style toggle (only for image mode) */}
      {!isTextMode && (
        <div className="flex bg-card rounded-xl p-1 border border-primary/10 mb-4 animate-fade-in">
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
            🇸🇦 Uthmani Script
          </button>
        </div>
      )}

      {/* Text mode */}
      {isTextMode && (
        <>
          {loading && <LoadingSpinner />}
          {error && (
            <div className="text-center py-8">
              <p className="text-destructive mb-2">{error}</p>
              <button onClick={() => window.location.reload()} className="text-primary text-sm underline">Retry</button>
            </div>
          )}
          {!loading && !error && (
            <div className="animate-fade-in">
              {surahNum !== 9 && (
                <p className="font-arabic text-xl text-primary text-center mb-6 leading-relaxed">{BISMILLAH}</p>
              )}
              <div className="space-y-3">
                {ayahs.map((ayah) => (
                  <div key={ayah.numberInSurah} className="p-4 rounded-xl bg-card/50 border border-primary/5">
                    <div className="flex items-start gap-3" dir="rtl">
                      <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs text-primary font-bold mt-1">
                        {ayah.numberInSurah}
                      </span>
                      <p className="font-arabic text-lg leading-[2.2] flex-1 text-foreground">{ayah.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Image mode */}
      {!isTextMode && (
        <SurahPagesLoader pages={pages} style={style} getImgUrl={getImgUrl} surahNum={surahNum} />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 gap-3">
        {surahNum > 1 && (
          <button onClick={() => navigate(`/surah-read/${surahNum - 1}${navSuffix}`)} className="flex-1 py-3 rounded-xl bg-card border border-primary/10 text-foreground text-sm transition-smooth hover:border-primary/30">
            ← {SURAHS[surahNum - 2]?.englishName}
          </button>
        )}
        {surahNum < 114 && (
          <button onClick={() => navigate(`/surah-read/${surahNum + 1}${navSuffix}`)} className="flex-1 py-3 rounded-xl bg-card border border-primary/10 text-foreground text-sm transition-smooth hover:border-primary/30">
            {SURAHS[surahNum]?.englishName} →
          </button>
        )}
      </div>
    </div>
  );
};

// Progressive loader with download support
const SurahPagesLoader: React.FC<{ pages: number[]; style: QuranStyle; getImgUrl: (p: number) => string; surahNum: number }> = ({ pages, style, getImgUrl, surahNum }) => {
  const [visibleCount, setVisibleCount] = useState(PAGES_PER_BATCH);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [cachedPages, setCachedPages] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(PAGES_PER_BATCH);
    setDownloadProgress(0);
    setDownloading(false);
    const checkCached = async () => {
      let count = 0;
      for (const p of pages) {
        const cached = await getCachedPage(getCacheKey(style, p));
        if (cached) count++;
      }
      setCachedPages(count);
    };
    checkCached();
  }, [pages, surahNum, style]);

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
      const key = getCacheKey(style, pages[i]);
      const existing = await getCachedPage(key);
      if (!existing) {
        const primaryUrl = style === "indopak" ? getIndianPageImage(pages[i]) : QuranAPI.getMushafPageImage(pages[i]);
        let dataUrl = await downloadImageAsDataUrl(primaryUrl);
        if (!dataUrl && style === "indopak") {
          dataUrl = await downloadImageAsDataUrl(getIndianPageImageFallback(pages[i]));
        }
        if (!dataUrl && style === "saudi") {
          for (const fb of QuranAPI.getMushafPageImageFallbacks(pages[i])) {
            dataUrl = await downloadImageAsDataUrl(fb);
            if (dataUrl) break;
          }
        }
        if (dataUrl) await setCachedPage(key, dataUrl);
      }
      setDownloadProgress(i + 1);
    }
    setCachedPages(pages.length);
    setDownloading(false);
    setVisibleCount(pages.length);
  };

  const allCached = cachedPages === pages.length;
  const visiblePages = pages.slice(0, visibleCount);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-muted-foreground">
          {pages.length} page{pages.length > 1 ? "s" : ""}
        </span>
        {downloading ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-primary/10 text-xs text-muted-foreground">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            <span>Downloading... {Math.round((downloadProgress / pages.length) * 100)}%</span>
          </div>
        ) : allCached ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-primary/10 text-xs text-primary">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Downloaded</span>
          </div>
        ) : (
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-primary/10 text-xs text-muted-foreground hover:border-primary/30 transition-smooth active:scale-95"
          >
            <HardDriveDownload className="w-3.5 h-3.5" />
            <span>Download Surah</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {visiblePages.map((p) => (
          <QuranPageView key={`${style}_${p}`} page={p} style={style} getImgUrl={getImgUrl} mode="surah" context={`Surah ${surahNum}`} surahNum={surahNum} />
        ))}
      </div>

      {visibleCount < pages.length && (
        <div ref={sentinelRef} className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="ml-3 text-sm text-muted-foreground">Loading more pages...</span>
        </div>
      )}
    </>
  );
};

export default SurahRead;
