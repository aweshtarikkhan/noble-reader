import React, { useState, useEffect, useRef, useCallback } from "react";
import { QuranAPI } from "@/lib/quranApi";
import { SURAHS } from "@/data/surahs";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Play, Pause } from "lucide-react";

const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
const SURAHS_PER_BATCH = 3;

interface SurahData {
  number: number;
  ayahs: { text: string; numberInSurah: number }[];
}

const CompleteTextReader: React.FC = () => {
  const [loadedSurahs, setLoadedSurahs] = useState<SurahData[]>([]);
  const [nextSurah, setNextSurah] = useState(1);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Load bookmark
  useEffect(() => {
    const saved = localStorage.getItem("bookmark_complete_text_surah");
    const startFrom = saved ? parseInt(saved) : 1;
    setNextSurah(startFrom);
    loadSurahs(startFrom, SURAHS_PER_BATCH);
  }, []);

  const loadSurahs = useCallback(async (from: number, count: number) => {
    if (loadingRef.current || from > 114) return;
    loadingRef.current = true;
    setLoading(true);
    const newSurahs: SurahData[] = [];
    for (let i = from; i < from + count && i <= 114; i++) {
      try {
        const data = await QuranAPI.getSurah(i);
        newSurahs.push({ number: i, ayahs: data.ayahs });
      } catch {
        break;
      }
    }
    setLoadedSurahs((prev) => [...prev, ...newSurahs]);
    setNextSurah(from + newSurahs.length);
    setLoading(false);
    loadingRef.current = false;
  }, []);

  // Save bookmark on scroll - track topmost visible surah
  useEffect(() => {
    if (loadedSurahs.length === 0) return;
    localStorage.setItem("bookmark_complete_text_surah", String(loadedSurahs[0].number));
  }, [loadedSurahs]);

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          loadSurahs(nextSurah, SURAHS_PER_BATCH);
        }
      },
      { rootMargin: "800px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [nextSurah, loadSurahs]);

  return (
    <div className="animate-fade-in">
      <p className="text-sm text-muted-foreground mb-4 text-center">📝 Complete Quran - Line by Line Text</p>

      {loadedSurahs.length === 0 && loading && <LoadingSpinner />}

      <div className="space-y-6">
        {loadedSurahs.map((surah) => {
          const info = SURAHS.find((s) => s.number === surah.number);
          return (
            <div key={surah.number} className="space-y-3">
              {/* Surah header */}
              <div className="text-center p-4 rounded-2xl bg-card border border-primary/10">
                <h2 className="font-arabic text-2xl text-primary">{info?.name}</h2>
                <p className="text-foreground font-medium text-sm mt-1">{info?.englishName}</p>
                <p className="text-xs text-muted-foreground">{info?.translation} • {info?.ayahs} Ayahs</p>
              </div>

              {/* Bismillah */}
              {surah.number !== 9 && (
                <p className="font-arabic text-xl text-primary text-center leading-relaxed">{BISMILLAH}</p>
              )}

              {/* Ayahs */}
              {surah.ayahs.map((ayah) => (
                <div key={`${surah.number}-${ayah.numberInSurah}`} className="p-4 rounded-xl bg-card/50 border border-primary/5">
                  <div className="flex items-start gap-3" dir="rtl">
                    <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs text-primary font-bold mt-1">
                      {ayah.numberInSurah}
                    </span>
                    <p className="font-arabic text-lg leading-[2.2] flex-1 text-foreground">{ayah.text}</p>
                  </div>
                </div>
              ))}

              {/* Divider */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-primary/20" />
                <span className="text-[10px] text-muted-foreground">End of Surah {surah.number}</span>
                <div className="flex-1 h-px bg-primary/20" />
              </div>
            </div>
          );
        })}
      </div>

      {nextSurah <= 114 && (
        <div ref={sentinelRef} className="flex items-center justify-center py-8">
          {loading ? (
            <>
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="ml-3 text-sm text-muted-foreground">Loading more surahs...</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">Scroll for more...</span>
          )}
        </div>
      )}

      {nextSurah > 114 && (
        <div className="text-center py-8">
          <p className="text-primary font-arabic text-lg">صدق الله العظيم</p>
          <p className="text-xs text-muted-foreground mt-1">End of the Holy Quran</p>
        </div>
      )}
    </div>
  );
};

export default CompleteTextReader;
