import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SURAHS } from "@/data/surahs";
import { QuranAPI } from "@/lib/quranApi";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Ayah {
  text: string;
  numberInSurah: number;
}

const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

const SurahRead: React.FC = () => {
  const { num } = useParams();
  const navigate = useNavigate();
  const surahNum = parseInt(num || "1");
  const surah = SURAHS.find((s) => s.number === surahNum);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    QuranAPI.getSurah(surahNum)
      .then((data) => setAyahs(data.ayahs))
      .catch(() => setError("Failed to load surah"))
      .finally(() => setLoading(false));
  }, [surahNum]);

  if (!surah) return <div className="p-4 text-center text-muted-foreground">Surah not found</div>;

  return (
    <div className="px-4 py-4">
      {/* Header */}
      <div className="text-center mb-6 p-4 rounded-2xl bg-card border border-gold/10 shadow-gold animate-fade-in">
        <h2 className="font-arabic text-2xl text-gold">{surah.name}</h2>
        <p className="text-foreground font-medium mt-1">{surah.englishName}</p>
        <p className="text-xs text-muted-foreground">{surah.translation} • {surah.ayahs} Ayahs • {surah.type}</p>
      </div>

      {loading && <LoadingSpinner />}
      {error && (
        <div className="text-center py-8">
          <p className="text-destructive mb-2">{error}</p>
          <button onClick={() => window.location.reload()} className="text-gold text-sm underline">Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="animate-fade-in">
          {/* Bismillah */}
          {surahNum !== 9 && (
            <p className="font-arabic text-xl text-gold text-center mb-6 leading-relaxed">{BISMILLAH}</p>
          )}

          {/* Ayahs */}
          <div className="space-y-4">
            {ayahs.map((ayah) => (
              <div key={ayah.numberInSurah} className="p-4 rounded-xl bg-card/50 border border-gold/5">
                <div className="flex items-start gap-3" dir="rtl">
                  <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs text-gold font-bold mt-1">
                    {ayah.numberInSurah}
                  </span>
                  <p className="font-arabic text-arabic text-lg leading-[2.2] flex-1">{ayah.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 gap-3">
            {surahNum > 1 && (
              <button onClick={() => navigate(`/surah-read/${surahNum - 1}`)} className="flex-1 py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm font-medium transition-smooth hover:border-gold/30">
                ← {SURAHS[surahNum - 2]?.englishName}
              </button>
            )}
            {surahNum < 114 && (
              <button onClick={() => navigate(`/surah-read/${surahNum + 1}`)} className="flex-1 py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm font-medium transition-smooth hover:border-gold/30">
                {SURAHS[surahNum]?.englishName} →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SurahRead;
