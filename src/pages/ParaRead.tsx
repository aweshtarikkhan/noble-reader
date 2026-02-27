import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { JUZ_DATA } from "@/data/surahs";
import { INDIAN_JUZ_DATA, getIndianPageImage } from "@/data/indianMushaf";
import { QuranAPI } from "@/lib/quranApi";
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
  surah: { number: number; name: string; englishName: string };
}

const ParaRead: React.FC = () => {
  const { num } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const juzNum = parseInt(num || "1");
  const isTextMode = searchParams.get("style") === "text";
  const [style, setStyle] = useState<QuranStyle>(() => (localStorage.getItem("read-quran-style") as QuranStyle) || "indopak");

  // Text mode state
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const juz = JUZ_DATA.find((j) => j.number === juzNum);
  const indianJuz = INDIAN_JUZ_DATA.find((j) => j.number === juzNum);

  useEffect(() => {
    if (isTextMode) {
      setLoading(true);
      setError("");
      QuranAPI.getJuz(juzNum)
        .then((data) => setAyahs(data.ayahs))
        .catch(() => setError("Failed to load para"))
        .finally(() => setLoading(false));
    }
  }, [juzNum, isTextMode]);

  if (!juz) return <div className="p-4 text-center text-muted-foreground">Para not found</div>;

  const handleStyleChange = (s: QuranStyle) => {
    setStyle(s);
    localStorage.setItem("read-quran-style", s);
  };

  const saudiPages = Array.from({ length: juz.endPage - juz.startPage + 1 }, (_, i) => juz.startPage + i);
  const indianPages = indianJuz
    ? Array.from({ length: indianJuz.endPage - indianJuz.startPage + 1 }, (_, i) => indianJuz.startPage + i)
    : [];
  const pages = style === "indopak" ? indianPages : saudiPages;

  const getImgUrl = (p: number) => {
    if (style === "indopak") return getIndianPageImage(p);
    return QuranAPI.getMushafPageImage(p);
  };

  const navSuffix = isTextMode ? "?style=text" : "";

  // Group ayahs by surah for text mode
  const groupedAyahs = ayahs.reduce<Record<number, { name: string; englishName: string; ayahs: { text: string; numberInSurah: number }[] }>>((acc, ayah) => {
    const sNum = ayah.surah.number;
    if (!acc[sNum]) acc[sNum] = { name: ayah.surah.name, englishName: ayah.surah.englishName, ayahs: [] };
    acc[sNum].ayahs.push({ text: ayah.text, numberInSurah: ayah.numberInSurah });
    return acc;
  }, {});

  return (
    <div className="px-4 py-4">
      <div className="text-center mb-4 animate-fade-in">
        <h2 className="font-arabic text-xl text-gold">{juz.name}</h2>
        <p className="text-sm text-muted-foreground">Para {juz.number} - {juz.nameTransliteration}</p>
        {isTextMode && (
          <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">📝 Line by Line Text</span>
        )}
      </div>

      {/* Style toggle (only for image mode) */}
      {!isTextMode && (
        <div className="flex bg-card rounded-xl p-1 border border-primary/10 mb-4 animate-fade-in">
          <button onClick={() => handleStyleChange("indopak")} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${style === "indopak" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            🇮🇳 Indo-Pak (16 Line)
          </button>
          <button onClick={() => handleStyleChange("saudi")} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${style === "saudi" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            🇸🇦 Saudi Style
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
            <div className="animate-fade-in space-y-6">
              {Object.entries(groupedAyahs).map(([sNum, data]) => (
                <div key={sNum} className="space-y-3">
                  <div className="text-center p-3 rounded-xl bg-card border border-primary/10">
                    <h3 className="font-arabic text-xl text-primary">{data.name}</h3>
                    <p className="text-xs text-muted-foreground">{data.englishName}</p>
                  </div>
                  {data.ayahs[0]?.numberInSurah === 1 && parseInt(sNum) !== 9 && (
                    <p className="font-arabic text-xl text-primary text-center leading-relaxed">{BISMILLAH}</p>
                  )}
                  {data.ayahs.map((ayah) => (
                    <div key={`${sNum}-${ayah.numberInSurah}`} className="p-4 rounded-xl bg-card/50 border border-primary/5">
                      <div className="flex items-start gap-3" dir="rtl">
                        <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs text-primary font-bold mt-1">
                          {ayah.numberInSurah}
                        </span>
                        <p className="font-arabic text-lg leading-[2.2] flex-1 text-foreground">{ayah.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Image mode */}
      {!isTextMode && (
        <ParaPagesLoader pages={pages} style={style} getImgUrl={getImgUrl} juzNum={juzNum} />
      )}

      <div className="flex items-center justify-between mt-6 gap-3">
        {juzNum > 1 && (
          <button onClick={() => navigate(`/para-read/${juzNum - 1}${navSuffix}`)} className="flex-1 py-3 rounded-xl bg-card border border-primary/10 text-foreground text-sm transition-smooth hover:border-primary/30">
            ← Para {juzNum - 1}
          </button>
        )}
        {juzNum < 30 && (
          <button onClick={() => navigate(`/para-read/${juzNum + 1}${navSuffix}`)} className="flex-1 py-3 rounded-xl bg-card border border-primary/10 text-foreground text-sm transition-smooth hover:border-primary/30">
            Para {juzNum + 1} →
          </button>
        )}
      </div>
    </div>
  );
};

// Progressive loader with download support using shared cache
const ParaPagesLoader: React.FC<{ pages: number[]; style: QuranStyle; getImgUrl: (p: number) => string; juzNum: number }> = ({ pages, style, getImgUrl, juzNum }) => {
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
  }, [pages, juzNum, style]);

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
      <div className="flex items-center justify-center mb-3">
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
          <button onClick={handleDownloadAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-primary/10 text-xs text-muted-foreground hover:border-primary/30 transition-smooth active:scale-95">
            <HardDriveDownload className="w-3.5 h-3.5" />
            <span>Download Complete Para</span>
          </button>
        )}
      </div>
      <div className="space-y-4">
        {visiblePages.map((p) => (
          <QuranPageView key={`${style}_${p}`} page={p} style={style} getImgUrl={getImgUrl} mode="para" context={`Para ${juzNum}`} paraNum={juzNum} />
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

export default ParaRead;
