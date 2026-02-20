import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SURAHS } from "@/data/surahs";
import { QuranAPI } from "@/lib/quranApi";
import LoadingSpinner from "@/components/LoadingSpinner";

interface TranslationEdition {
  id: string;
  label: string;
  source: "alquran" | "fawaz";
  fawazId?: string;
}

const EDITIONS: { group: string; editions: TranslationEdition[] }[] = [
  {
    group: "English",
    editions: [
      { id: "en.sahih", label: "Sahih International", source: "alquran" },
      { id: "en.yusufali", label: "Yusuf Ali", source: "alquran" },
      { id: "en.pickthall", label: "Pickthall", source: "alquran" },
    ],
  },
  {
    group: "اردو (Urdu)",
    editions: [
      { id: "ur.jalandhry", label: "Jalandhry", source: "alquran" },
      { id: "ur.kanzuliman", label: "Kanzul Iman", source: "alquran" },
      { id: "ur.maududi", label: "Maududi", source: "alquran" },
    ],
  },
  {
    group: "Roman Urdu",
    editions: [
      { id: "fawaz-maududi", label: "Maududi (Tafheem)", source: "fawaz", fawazId: "urd-abulaalamaududi-la" },
      { id: "fawaz-junagarhi", label: "Junagarhi", source: "fawaz", fawazId: "urd-muhammadjunagar-la" },
      { id: "fawaz-transliteration", label: "Arabic Transliteration", source: "fawaz", fawazId: "ara-quran-la" },
    ],
  },
];

const Translation: React.FC = () => {
  const navigate = useNavigate();
  const [surahNum, setSurahNum] = useState(() => parseInt(localStorage.getItem("trans-surah") || "1"));
  const [selectedEditions, setSelectedEditions] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("trans-editions") || '["en.sahih"]'); } catch { return ["en.sahih"]; }
  });
  const [showPanel, setShowPanel] = useState(false);
  const [arabicAyahs, setArabicAyahs] = useState<any[]>([]);
  const [translations, setTranslations] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("trans-surah", String(surahNum));
    localStorage.setItem("trans-editions", JSON.stringify(selectedEditions));
  }, [surahNum, selectedEditions]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const arabic = await QuranAPI.getSurah(surahNum);
        setArabicAyahs(arabic.ayahs);

        const results: Record<string, any[]> = {};
        for (const edId of selectedEditions) {
          const allEditions = EDITIONS.flatMap((g) => g.editions);
          const ed = allEditions.find((e) => e.id === edId);
          if (!ed) continue;
          try {
            if (ed.source === "fawaz" && ed.fawazId) {
              const data = await QuranAPI.fetchFawazEdition(ed.fawazId, surahNum);
              results[edId] = data.ayahs;
            } else {
              const data = await QuranAPI.getSurahEdition(surahNum, edId);
              results[edId] = data.ayahs;
            }
          } catch {}
        }
        setTranslations(results);
      } catch {}
      setLoading(false);
    };
    load();
  }, [surahNum, selectedEditions]);

  const toggleEdition = (id: string) => {
    setSelectedEditions((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const surah = SURAHS.find((s) => s.number === surahNum);
  const allEditions = EDITIONS.flatMap((g) => g.editions);

  return (
    <div className="px-4 py-4">
      {/* Surah selector */}
      <select
        value={surahNum}
        onChange={(e) => setSurahNum(parseInt(e.target.value))}
        className="w-full px-4 py-3 rounded-xl bg-card border border-gold/10 text-foreground focus:outline-none focus:border-gold/40 mb-3 text-sm"
      >
        {SURAHS.map((s) => (
          <option key={s.number} value={s.number}>
            {s.number}. {s.englishName} — {s.name}
          </option>
        ))}
      </select>

      {/* Toggle panel */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="w-full px-4 py-2 rounded-xl bg-card border border-gold/10 text-sm text-muted-foreground mb-4 transition-smooth hover:border-gold/30"
      >
        {showPanel ? "▲ Hide" : "▼ Select"} Translations ({selectedEditions.length})
      </button>

      {showPanel && (
        <div className="mb-4 p-4 rounded-xl bg-card border border-gold/10 space-y-4 animate-fade-in">
          {EDITIONS.map((group) => (
            <div key={group.group}>
              <h4 className="text-xs font-semibold text-gold mb-2">{group.group}</h4>
              <div className="space-y-1">
                {group.editions.map((ed) => (
                  <label key={ed.id} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEditions.includes(ed.id)}
                      onChange={() => toggleEdition(ed.id)}
                      className="accent-gold"
                    />
                    {ed.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading translations..." />
      ) : (
        <div className="space-y-4 animate-fade-in">
          {arabicAyahs.map((ayah: any) => (
            <div key={ayah.numberInSurah} className="p-4 rounded-xl bg-card border border-gold/5 space-y-3">
              {/* Arabic */}
              <div dir="rtl" className="flex items-start gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-gold font-bold shrink-0 mt-1">
                  {ayah.numberInSurah}
                </span>
                <p className="font-arabic text-arabic text-lg leading-[2.2] flex-1">{ayah.text}</p>
              </div>

              {/* Translations */}
              {selectedEditions.map((edId) => {
                const ed = allEditions.find((e) => e.id === edId);
                const trans = translations[edId]?.[ayah.numberInSurah - 1];
                if (!trans) return null;
                const isUrdu = edId.startsWith("ur.");
                return (
                  <div key={edId} className={`border-l-2 border-gold/20 pl-3 ${isUrdu ? "font-urdu" : ""}`}>
                    <p className="text-[10px] text-gold/60 mb-0.5">{ed?.label}</p>
                    <p className={`text-sm leading-relaxed ${isUrdu ? "text-urdu" : edId.startsWith("fawaz") ? "text-muted-foreground" : "text-english"}`} dir={isUrdu ? "rtl" : "ltr"}>
                      {trans.text}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Translation;
