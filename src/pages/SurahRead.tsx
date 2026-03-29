import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SURAHS, getSurahPageRange } from "@/data/surahs";
import { QuranAPI } from "@/lib/quranApi";
import { getIndianPageImage } from "@/data/indianMushaf";
import { getHifzPageImage } from "@/data/hifzMushaf";
import { getCachedPage, setCachedPage, downloadImageAsDataUrl } from "@/lib/quranCache";
import { getIndianPageImageFallback } from "@/data/indianMushaf";
import { getHifzPageImageFallback } from "@/data/hifzMushaf";
import { Loader2, CheckCircle2, HardDriveDownload, Play, Pause } from "lucide-react";
import QuranPageView, { type QuranStyle, getCacheKey } from "@/components/QuranPageView";
import LoadingSpinner from "@/components/LoadingSpinner";
import StyleSwitcher, { type ReadingStyle } from "@/components/StyleSwitcher";
import { QURAN_RECITERS, getAyahAudioUrl, DEFAULT_RECITER } from "@/data/quranReciters";

const PAGES_PER_BATCH = 4;
const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

interface Ayah {
  text: string;
  numberInSurah: number;
  number: number; // global verse number
}

const useAyahAudio = (ayahs: Ayah[], reciterId: string) => {
  const [playingVerse, setPlayingVerse] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayahsRef = useRef(ayahs);
  const reciterRef = useRef(reciterId);
  ayahsRef.current = ayahs;
  reciterRef.current = reciterId;

  const stopAudio = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlayingVerse(null);
  }, []);

  const playFromVerse = useCallback((globalNumber: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(getAyahAudioUrl(reciterRef.current, globalNumber));
    audio.onended = () => {
      const currentIdx = ayahsRef.current.findIndex(a => a.number === globalNumber);
      if (currentIdx >= 0 && currentIdx < ayahsRef.current.length - 1) {
        const nextAyah = ayahsRef.current[currentIdx + 1];
        playFromVerse(nextAyah.number);
      } else {
        setPlayingVerse(null);
        audioRef.current = null;
      }
    };
    audio.onerror = () => { setPlayingVerse(null); audioRef.current = null; };
    audio.play();
    audioRef.current = audio;
    setPlayingVerse(globalNumber);
  }, []);

  const toggleAudio = useCallback((globalNumber: number) => {
    if (playingVerse === globalNumber) {
      stopAudio();
      return;
    }
    playFromVerse(globalNumber);
  }, [playingVerse, stopAudio, playFromVerse]);

  // Stop audio when reciter changes
  useEffect(() => {
    stopAudio();
  }, [reciterId, stopAudio]);

  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  return { playingVerse, toggleAudio };
};

// Reciter selector
const ReciterSelector: React.FC<{ reciterId: string; onChange: (id: string) => void }> = ({ reciterId, onChange }) => (
  <div className="mb-4 animate-fade-in">
    <label className="text-xs text-muted-foreground mb-1 block">🎙️ Reciter</label>
    <select
      value={reciterId}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-xl bg-card border border-primary/10 text-foreground text-sm focus:outline-none focus:border-primary/40"
    >
      {QURAN_RECITERS.map((r) => (
        <option key={r.id} value={r.id}>{r.name} - {r.nameAr}</option>
      ))}
    </select>
  </div>
);

// Text ayahs with audio buttons
const TextAyahsView: React.FC<{ ayahs: Ayah[]; surahNum: number; reciterId: string }> = ({ ayahs, surahNum, reciterId }) => {
  const { playingVerse, toggleAudio } = useAyahAudio(ayahs, reciterId);

  return (
    <div className="animate-fade-in">
      {surahNum !== 9 && (
        <p className="font-arabic text-xl text-primary text-center mb-6 leading-relaxed">{BISMILLAH}</p>
      )}
      <div className="space-y-3">
        {ayahs.map((ayah) => (
          <div key={ayah.numberInSurah} className={`p-4 rounded-xl border transition-smooth ${playingVerse === ayah.number ? "bg-primary/10 border-primary/30 shadow-md shadow-primary/10" : "bg-card/50 border-primary/5"}`}>
            <div className="flex items-start gap-3" dir="rtl">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs text-primary font-bold mt-1">
                {ayah.numberInSurah}
              </span>
              <p className="font-arabic text-lg leading-[2.2] flex-1 text-foreground">{ayah.text}</p>
              <button
                onClick={() => toggleAudio(ayah.number)}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 transition-smooth ${
                  playingVerse === ayah.number ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                {playingVerse === ayah.number ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>
            </div>
          </div>
        ))}
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

      <div className="space-y-4 snap-y snap-mandatory">
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

const SurahRead: React.FC = () => {
  const { num } = useParams();
  const navigate = useNavigate();
  const surahNum = parseInt(num || "1");
  const surah = SURAHS.find((s) => s.number === surahNum);

  const [readingStyle, setReadingStyle] = useState<ReadingStyle>(
    () => (localStorage.getItem("read-quran-style-full") as ReadingStyle) || "indopak"
  );
  const imageStyle: QuranStyle = readingStyle === "text" ? "indopak" : readingStyle;

  const [reciterId, setReciterId] = useState<string>(
    () => localStorage.getItem("quran-reciter") || DEFAULT_RECITER
  );

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (readingStyle === "text") {
      setLoading(true);
      setError("");
      QuranAPI.getSurah(surahNum)
        .then((data) => setAyahs(data.ayahs))
        .catch(() => setError("Failed to load surah"))
        .finally(() => setLoading(false));
    }
  }, [surahNum, readingStyle]);

  if (!surah) return <div className="p-4 text-center text-muted-foreground">Surah not found</div>;

  const handleStyleChange = (s: ReadingStyle) => {
    setReadingStyle(s);
    localStorage.setItem("read-quran-style-full", s);
  };

  const handleReciterChange = (id: string) => {
    setReciterId(id);
    localStorage.setItem("quran-reciter", id);
  };

  const { startPage, endPage } = getSurahPageRange(surahNum, imageStyle);
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const getImgUrl = (p: number) => {
    if (imageStyle === "indopak") return getIndianPageImage(p);
    if (imageStyle === "hifz") return getHifzPageImage(p);
    return QuranAPI.getMushafPageImage(p);
  };

  return (
    <div className="px-4 py-4">
      <div className="text-center mb-4 animate-fade-in p-4 rounded-2xl bg-card border border-primary/10 shadow-gold">
        <h2 className="font-arabic text-2xl text-primary">{surah.name}</h2>
        <p className="text-foreground font-medium mt-1">{surah.englishName}</p>
        <p className="text-xs text-muted-foreground">{surah.translation} • {surah.ayahs} Ayahs • {surah.type}</p>
      </div>

      <StyleSwitcher style={readingStyle} onChange={handleStyleChange} />

      {readingStyle === "text" && (
        <>
          <ReciterSelector reciterId={reciterId} onChange={handleReciterChange} />
          {loading && <LoadingSpinner />}
          {error && (
            <div className="text-center py-8">
              <p className="text-destructive mb-2">{error}</p>
              <button onClick={() => window.location.reload()} className="text-primary text-sm underline">Retry</button>
            </div>
          )}
          {!loading && !error && (
            <TextAyahsView ayahs={ayahs} surahNum={surahNum} reciterId={reciterId} />
          )}
        </>
      )}

      {readingStyle !== "text" && (
        <SurahPagesLoader pages={pages} style={imageStyle} getImgUrl={getImgUrl} surahNum={surahNum} />
      )}

      <div className="flex items-center justify-between mt-6 gap-3">
        {surahNum > 1 && (
          <button onClick={() => navigate(`/surah-read/${surahNum - 1}`)} className="flex-1 py-3 rounded-xl bg-card border border-primary/10 text-foreground text-sm transition-smooth hover:border-primary/30">
            ← {SURAHS[surahNum - 2]?.englishName}
          </button>
        )}
        {surahNum < 114 && (
          <button onClick={() => navigate(`/surah-read/${surahNum + 1}`)} className="flex-1 py-3 rounded-xl bg-card border border-primary/10 text-foreground text-sm transition-smooth hover:border-primary/30">
            {SURAHS[surahNum]?.englishName} →
          </button>
        )}
      </div>
    </div>
  );
};

export default SurahRead;
