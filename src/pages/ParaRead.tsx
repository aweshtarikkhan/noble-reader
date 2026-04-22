import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JUZ_DATA } from "@/data/surahs";
import { INDIAN_JUZ_DATA, getIndianPageImage } from "@/data/indianMushaf";
import { getHifzPageImage, getHifzPageImageFallback, getHifzPageImageFallback2 } from "@/data/hifzMushaf";
import { QuranAPI } from "@/lib/quranApi";
import { getCachedPage, setCachedPage, downloadImageAsDataUrl } from "@/lib/quranCache";
import { getIndianPageImageFallback } from "@/data/indianMushaf";
import { Loader2, CheckCircle2, HardDriveDownload } from "lucide-react";
import QuranPageView, { type QuranStyle, getCacheKey } from "@/components/QuranPageView";
import LoadingSpinner from "@/components/LoadingSpinner";
import StyleSwitcher, { type ReadingStyle } from "@/components/StyleSwitcher";

const PAGES_PER_BATCH = 4;
const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

interface Ayah {
  text: string;
  numberInSurah: number;
  surah: { number: number; name: string; englishName: string };
}

const ParaRead: React.FC = () => {
  const { num } = useParams();
  const navigate = useNavigate();
  const juzNum = parseInt(num || "1");

  const [readingStyle, setReadingStyle] = useState<ReadingStyle>(
    () => (localStorage.getItem("read-quran-style-full") as ReadingStyle) || "indopak"
  );
  const imageStyle: QuranStyle = readingStyle === "text" ? "indopak" : readingStyle;

  // Text mode state
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const juz = JUZ_DATA.find((j) => j.number === juzNum);
  const indianJuz = INDIAN_JUZ_DATA.find((j) => j.number === juzNum);

  useEffect(() => {
    if (readingStyle === "text") {
      setLoading(true);
      setError("");
      QuranAPI.getJuz(juzNum)
        .then((data) => setAyahs(data.ayahs))
        .catch(() => setError("Failed to load para"))
        .finally(() => setLoading(false));
    }
  }, [juzNum, readingStyle]);

  if (!juz) return <div className="p-4 text-center text-muted-foreground">Para not found</div>;

  const handleStyleChange = (s: ReadingStyle) => {
    setReadingStyle(s);
    localStorage.setItem("read-quran-style-full", s);
  };

  const saudiPages = Array.from({ length: juz.endPage - juz.startPage + 1 }, (_, i) => juz.startPage + i);
  const indianPages = indianJuz
    ? Array.from({ length: indianJuz.endPage - indianJuz.startPage + 1 }, (_, i) => indianJuz.startPage + i)
    : [];
  const pages = imageStyle === "indopak" ? indianPages : saudiPages;

  const getImgUrl = (p: number) => {
    if (imageStyle === "indopak") return getIndianPageImage(p);
    if (imageStyle === "hifz") return getHifzPageImage(p);
    return QuranAPI.getMushafPageImage(p);
  };

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
      </div>

      {/* Style switcher */}
      <StyleSwitcher style={readingStyle} onChange={handleStyleChange} />

      {/* Text mode */}
      {readingStyle === "text" && (
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
      {readingStyle !== "text" && (
        <ParaPagesLoader pages={pages} style={imageStyle} getImgUrl={getImgUrl} juzNum={juzNum} />
      )}

      <div className="flex items-center justify-between mt-6 gap-3">
        {juzNum > 1 && (
          <button onClick={() => navigate(`/para-read/${juzNum - 1}`)} className="flex-1 py-3 rounded-xl bg-card border border-primary/10 text-foreground text-sm transition-smooth hover:border-primary/30">
            ← Para {juzNum - 1}
          </button>
        )}
        {juzNum < 30 && (
          <button onClick={() => navigate(`/para-read/${juzNum + 1}`)} className="flex-1 py-3 rounded-xl bg-card border border-primary/10 text-foreground text-sm transition-smooth hover:border-primary/30">
            Para {juzNum + 1} →
          </button>
        )}
      </div>
    </div>
  );
};

// Single-page para reader using shared cache
const ParaPagesLoader: React.FC<{ pages: number[]; style: QuranStyle; getImgUrl: (p: number) => string; juzNum: number }> = ({ pages, style, getImgUrl, juzNum }) => {
  const [pageIdx, setPageIdx] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [cachedPages, setCachedPages] = useState(0);

  useEffect(() => {
    setPageIdx(0);
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

  const handleDownloadAll = async () => {
    setDownloading(true);
    setDownloadProgress(0);
    for (let i = 0; i < pages.length; i++) {
      const key = getCacheKey(style, pages[i]);
      const existing = await getCachedPage(key);
      if (!existing) {
        const primaryUrl = style === "indopak" ? getIndianPageImage(pages[i]) : (style === "hifz" ? getHifzPageImage(pages[i]) : QuranAPI.getMushafPageImage(pages[i]));
        let dataUrl = await downloadImageAsDataUrl(primaryUrl);
        if (!dataUrl && style === "indopak") {
          dataUrl = await downloadImageAsDataUrl(getIndianPageImageFallback(pages[i]));
        }
        if (!dataUrl && style === "hifz") {
          dataUrl = await downloadImageAsDataUrl(getHifzPageImageFallback(pages[i]));
          if (!dataUrl) dataUrl = await downloadImageAsDataUrl(getHifzPageImageFallback2(pages[i]));
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
  };

  const allCached = cachedPages === pages.length;
  const currentPage = pages[pageIdx];

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-muted-foreground">
          Page {pageIdx + 1} of {pages.length}
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
          <button onClick={handleDownloadAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-primary/10 text-xs text-muted-foreground hover:border-primary/30 transition-smooth active:scale-95">
            <HardDriveDownload className="w-3.5 h-3.5" />
            <span>Download Complete Para</span>
          </button>
        )}
      </div>
      <QuranPageView
        key={`${style}_${currentPage}`}
        page={currentPage}
        style={style}
        getImgUrl={getImgUrl}
        mode="para"
        context={`Para ${juzNum}`}
        paraNum={juzNum}
        totalPages={pages[pages.length - 1]}
        onNavigate={(target) => {
          const idx = pages.indexOf(target);
          if (idx === -1) return;
          setPageIdx(idx);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </>
  );
};

export default ParaRead;
