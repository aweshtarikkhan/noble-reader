import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SURAHS } from "@/data/surahs";
import { QuranAPI } from "@/lib/quranApi";
import LoadingSpinner from "@/components/LoadingSpinner";

const TafseerRead: React.FC = () => {
  const { num } = useParams();
  const navigate = useNavigate();
  const surahNum = parseInt(num || "1");
  const surah = SURAHS.find((s) => s.number === surahNum);
  const isAyatMode = surah && surah.ayahs > 50;

  const [arabicAyahs, setArabicAyahs] = useState<any[]>([]);
  const [translation, setTranslation] = useState<any[]>([]);
  const [tafseer, setTafseer] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAyah, setCurrentAyah] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [arabic, trans, tafs] = await Promise.all([
          QuranAPI.getSurah(surahNum),
          QuranAPI.getSurahEdition(surahNum, "en.sahih"),
          QuranAPI.fetchFawazEdition("urd-abulaalamaududi-la", surahNum),
        ]);
        setArabicAyahs(arabic.ayahs);
        setTranslation(trans.ayahs);
        setTafseer(tafs.ayahs);
      } catch {}
      setLoading(false);
    };
    load();
    setCurrentAyah(1);
  }, [surahNum]);

  if (!surah) return <div className="p-4 text-center text-muted-foreground">Surah not found</div>;

  const renderAyah = (index: number) => {
    const arabic = arabicAyahs[index];
    const trans = translation[index];
    const tafs = tafseer[index];
    if (!arabic) return null;

    return (
      <div key={index} className="p-4 rounded-xl bg-card border border-gold/5 space-y-3">
        <div dir="rtl" className="flex items-start gap-2">
          <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-gold font-bold shrink-0 mt-1">
            {arabic.numberInSurah}
          </span>
          <p className="font-arabic text-arabic text-lg leading-[2.2] flex-1">{arabic.text}</p>
        </div>
        {trans && (
          <div className="border-l-2 border-gold/20 pl-3">
            <p className="text-[10px] text-gold/60 mb-0.5">Translation</p>
            <p className="text-sm text-english leading-relaxed">{trans.text}</p>
          </div>
        )}
        {tafs && (
          <div className="border-l-2 border-secondary/40 pl-3">
            <p className="text-[10px] text-secondary/60 mb-0.5">Tafseer (Maududi)</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{tafs.text}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="px-4 py-4">
      <div className="text-center mb-4 p-4 rounded-2xl bg-card border border-gold/10 shadow-gold animate-fade-in">
        <h2 className="font-arabic text-xl text-gold">{surah.name}</h2>
        <p className="text-foreground text-sm font-medium">{surah.englishName}</p>
        <p className="text-xs text-muted-foreground">{surah.ayahs} Ayahs • {isAyatMode ? "Ayat-by-Ayat Mode" : "Full Surah"}</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : isAyatMode ? (
        <div className="animate-fade-in">
          {renderAyah(currentAyah - 1)}
          <div className="mt-4 space-y-3">
            <div className="text-center text-xs text-muted-foreground">
              Ayah {currentAyah} of {surah.ayahs}
            </div>
            <input
              type="range"
              min={1}
              max={surah.ayahs}
              value={currentAyah}
              onChange={(e) => setCurrentAyah(parseInt(e.target.value))}
              className="w-full accent-gold"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentAyah(Math.max(1, currentAyah - 1))}
                disabled={currentAyah <= 1}
                className="flex-1 py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm transition-smooth disabled:opacity-30"
              >
                ← Prev
              </button>
              <button
                onClick={() => setCurrentAyah(Math.min(surah.ayahs, currentAyah + 1))}
                disabled={currentAyah >= surah.ayahs}
                className="flex-1 py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm transition-smooth disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {arabicAyahs.map((_, i) => renderAyah(i))}
        </div>
      )}

      {/* Surah nav */}
      <div className="flex items-center justify-between mt-8 gap-3">
        {surahNum > 1 && (
          <button onClick={() => navigate(`/tafseer-read/${surahNum - 1}`)} className="flex-1 py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm transition-smooth">
            ← {SURAHS[surahNum - 2]?.englishName}
          </button>
        )}
        {surahNum < 114 && (
          <button onClick={() => navigate(`/tafseer-read/${surahNum + 1}`)} className="flex-1 py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm transition-smooth">
            {SURAHS[surahNum]?.englishName} →
          </button>
        )}
      </div>
    </div>
  );
};

export default TafseerRead;
