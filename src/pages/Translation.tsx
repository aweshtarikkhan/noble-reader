import React, { useEffect, useState } from "react";
import { SURAHS } from "@/data/surahs";
import { QuranAPI } from "@/lib/quranApi";
import LoadingSpinner from "@/components/LoadingSpinner";

interface TranslationEdition {
  id: string;
  label: string;
  source: "alquran" | "fawaz";
  fawazId?: string;
}

interface TafseerEdition {
  id: string;
  label: string;
  source: "alquran" | "fawaz";
  fawazId?: string;
}

const EDITIONS: { group: string; groupIcon: string; editions: TranslationEdition[] }[] = [
  {
    group: "English",
    groupIcon: "🇬🇧",
    editions: [
      { id: "en.sahih", label: "Sahih International", source: "alquran" },
      { id: "en.yusufali", label: "Yusuf Ali", source: "alquran" },
      { id: "en.pickthall", label: "Pickthall", source: "alquran" },
      { id: "en.hilali", label: "Hilali & Khan", source: "alquran" },
      { id: "en.asad", label: "Muhammad Asad", source: "alquran" },
      { id: "en.maududi", label: "Maududi", source: "alquran" },
      { id: "en.shakir", label: "Shakir", source: "alquran" },
      { id: "en.sarwar", label: "Sarwar", source: "alquran" },
      { id: "en.qaribullah", label: "Qaribullah & Darwish", source: "alquran" },
      { id: "en.itani", label: "Talal Itani", source: "alquran" },
      { id: "en.transliteration", label: "Transliteration", source: "alquran" },
      { id: "en.wahiduddin", label: "Wahiduddin Khan", source: "alquran" },
      { id: "en.ahmedali", label: "Ahmed Ali", source: "alquran" },
      { id: "en.arberry", label: "Arberry", source: "alquran" },
      { id: "en.daryabadi", label: "Daryabadi", source: "alquran" },
    ],
  },
  {
    group: "اردو (Urdu)",
    groupIcon: "🇵🇰",
    editions: [
      { id: "ur.jalandhry", label: "Jalandhry", source: "alquran" },
      { id: "ur.kanzuliman", label: "Kanzul Iman (Qadri)", source: "alquran" },
      { id: "ur.maududi", label: "Maududi (Tafheem)", source: "alquran" },
      { id: "ur.junagarhi", label: "Junagarhi", source: "alquran" },
      { id: "ur.qadri", label: "Tahir-ul-Qadri", source: "alquran" },
      { id: "ur.jawadi", label: "Jawadi", source: "alquran" },
      { id: "ur.najafi", label: "Najafi", source: "alquran" },
      { id: "ur.ahmedali", label: "Ahmed Ali", source: "alquran" },
    ],
  },
  {
    group: "हिन्दी (Hindi)",
    groupIcon: "🇮🇳",
    editions: [
      { id: "hi.hindi", label: "Suhel Farooq Khan", source: "alquran" },
      { id: "hi.farooq", label: "Muhammad Farooq Khan", source: "alquran" },
    ],
  },
  {
    group: "Roman Urdu",
    groupIcon: "📝",
    editions: [
      { id: "fawaz-maududi", label: "Maududi (Tafheem) - Roman", source: "fawaz", fawazId: "urd-abulaalamaududi-la" },
      { id: "fawaz-junagarhi", label: "Junagarhi - Roman", source: "fawaz", fawazId: "urd-muhammadjunagar-la" },
      { id: "fawaz-junagarhi2", label: "Junagarhi & Kazim - Roman", source: "fawaz", fawazId: "urd-muhammadjunagar1" },
      { id: "fawaz-transliteration", label: "Arabic Transliteration (Roman)", source: "fawaz", fawazId: "ara-quran-la" },
      { id: "en.transliteration2", label: "Quran Transliteration", source: "alquran" },
    ],
  },
];

const TAFSEERS: { group: string; groupIcon: string; editions: TafseerEdition[] }[] = [
  {
    group: "Roman Urdu Tafseer",
    groupIcon: "📗",
    editions: [
      { id: "tafseer-fawaz-maududi", label: "Tafheem-ul-Quran (Maududi)", source: "fawaz", fawazId: "urd-abulaalamaududi-la" },
      { id: "tafseer-fawaz-junagarhi", label: "Junagarhi", source: "fawaz", fawazId: "urd-muhammadjunagar-la" },
      { id: "tafseer-fawaz-junagarhi2", label: "Junagarhi & Kazim", source: "fawaz", fawazId: "urd-muhammadjunagar1" },
    ],
  },
  {
    group: "Arabic Tafseer",
    groupIcon: "📕",
    editions: [
      { id: "ar.muyassar", label: "Tafsir Muyassar", source: "alquran" },
      { id: "ar.jalalayn", label: "Tafsir al-Jalalayn", source: "alquran" },
      { id: "ar.qurtubi", label: "Tafsir al-Qurtubi", source: "alquran" },
      { id: "ar.ibnkathir", label: "Tafsir Ibn Kathir", source: "alquran" },
      { id: "ar.baghawi", label: "Tafsir al-Baghawi", source: "alquran" },
      { id: "ar.waseet", label: "Al-Waseet", source: "alquran" },
    ],
  },
];

const Translation: React.FC = () => {
  const [surahNum, setSurahNum] = useState(() => parseInt(localStorage.getItem("trans-surah") || "1"));
  const [selectedEditions, setSelectedEditions] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("trans-editions") || '["en.sahih"]'); } catch { return ["en.sahih"]; }
  });
  const [selectedTafseer, setSelectedTafseer] = useState<string | null>(() => {
    return localStorage.getItem("trans-tafseer") || null;
  });
  const [showTransPanel, setShowTransPanel] = useState(false);
  const [showTafseerPanel, setShowTafseerPanel] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [arabicAyahs, setArabicAyahs] = useState<any[]>([]);
  const [translations, setTranslations] = useState<Record<string, any[]>>({});
  const [tafseerData, setTafseerData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("trans-surah", String(surahNum));
    localStorage.setItem("trans-editions", JSON.stringify(selectedEditions));
    if (selectedTafseer) localStorage.setItem("trans-tafseer", selectedTafseer);
    else localStorage.removeItem("trans-tafseer");
  }, [surahNum, selectedEditions, selectedTafseer]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const arabic = await QuranAPI.getSurah(surahNum);
        setArabicAyahs(arabic.ayahs);

        const allEditions = EDITIONS.flatMap((g) => g.editions);
        const results: Record<string, any[]> = {};
        for (const edId of selectedEditions) {
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

        // Load tafseer
        if (selectedTafseer) {
          const allTafseers = TAFSEERS.flatMap((g) => g.editions);
          const taf = allTafseers.find((t) => t.id === selectedTafseer);
          if (taf) {
            try {
              if (taf.source === "fawaz" && taf.fawazId) {
                const data = await QuranAPI.fetchFawazEdition(taf.fawazId, surahNum);
                setTafseerData(data.ayahs);
              } else {
                const data = await QuranAPI.getSurahEdition(surahNum, taf.id);
                setTafseerData(data.ayahs);
              }
            } catch {
              setTafseerData(null);
            }
          }
        } else {
          setTafseerData(null);
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, [surahNum, selectedEditions, selectedTafseer]);

  const toggleEdition = (id: string) => {
    setSelectedEditions((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const allEditions = EDITIONS.flatMap((g) => g.editions);
  const allTafseers = TAFSEERS.flatMap((g) => g.editions);
  const selectedTafseerLabel = allTafseers.find((t) => t.id === selectedTafseer)?.label;

  return (
    <div className="px-4 py-4">
      {/* Surah selector */}
      <select
        value={surahNum}
        onChange={(e) => setSurahNum(parseInt(e.target.value))}
        className="w-full px-4 py-3 rounded-xl bg-card border border-gold/10 text-foreground focus:outline-none focus:border-gold/40 mb-3 text-sm"
        style={{ backgroundColor: "hsl(222 35% 16%)" }}
      >
        {SURAHS.map((s) => (
          <option key={s.number} value={s.number} style={{ backgroundColor: "hsl(222 35% 16%)", color: "hsl(210 40% 96%)" }}>
            {s.number}. {s.englishName} — {s.name}
          </option>
        ))}
      </select>

      {/* Translation Authors Button */}
      <button
        onClick={() => { setShowTransPanel(!showTransPanel); setShowTafseerPanel(false); }}
        className={`w-full px-4 py-3 rounded-xl border text-sm mb-2 transition-smooth text-left flex items-center justify-between ${
          showTransPanel ? "bg-primary/10 border-gold/30 text-gold" : "bg-card border-gold/10 text-foreground hover:border-gold/30"
        }`}
      >
        <span className="flex items-center gap-2">
          <span>🌐</span>
          <span>Translations & Authors</span>
          <span className="text-[10px] bg-primary/20 text-gold px-2 py-0.5 rounded-full">{selectedEditions.length}</span>
        </span>
        <span>{showTransPanel ? "▲" : "▼"}</span>
      </button>

      {/* Tafseer Button */}
      <button
        onClick={() => { setShowTafseerPanel(!showTafseerPanel); setShowTransPanel(false); }}
        className={`w-full px-4 py-3 rounded-xl border text-sm mb-4 transition-smooth text-left flex items-center justify-between ${
          showTafseerPanel ? "bg-primary/10 border-gold/30 text-gold" : "bg-card border-gold/10 text-foreground hover:border-gold/30"
        }`}
      >
        <span className="flex items-center gap-2">
          <span>📗</span>
          <span>{selectedTafseerLabel ? `Tafseer: ${selectedTafseerLabel}` : "Select Tafseer (Commentary)"}</span>
        </span>
        <span>{showTafseerPanel ? "▲" : "▼"}</span>
      </button>

      {/* Translations Panel */}
      {showTransPanel && (
        <div className="mb-4 p-3 rounded-xl bg-card border border-gold/10 space-y-1 animate-fade-in max-h-[60vh] overflow-y-auto">
          <p className="text-[10px] text-muted-foreground mb-2 px-1">Select one or more translations to display below each ayah</p>
          {EDITIONS.map((group) => {
            const isExpanded = expandedGroups[group.group] !== false; // default open
            const selectedCount = group.editions.filter((e) => selectedEditions.includes(e.id)).length;
            return (
              <div key={group.group} className="rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleGroup(group.group)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-surface rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-smooth"
                >
                  <span className="flex items-center gap-2">
                    <span>{group.groupIcon}</span>
                    <span>{group.group}</span>
                    {selectedCount > 0 && (
                      <span className="text-[10px] bg-primary/20 text-gold px-1.5 py-0.5 rounded-full">{selectedCount}</span>
                    )}
                  </span>
                  <span className="text-muted-foreground text-xs">{isExpanded ? "▲" : "▼"}</span>
                </button>
                {isExpanded && (
                  <div className="px-2 py-1.5 space-y-0.5">
                    {group.editions.map((ed) => (
                      <label
                        key={ed.id}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-smooth ${
                          selectedEditions.includes(ed.id) ? "bg-primary/10 text-gold" : "text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedEditions.includes(ed.id)}
                          onChange={() => toggleEdition(ed.id)}
                          className="accent-[hsl(43,65%,52%)] w-4 h-4 rounded"
                        />
                        <span className="flex-1">{ed.label}</span>
                        <span className="text-[9px] text-muted-foreground uppercase">
                          {ed.source === "fawaz" ? "CDN" : "API"}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tafseer Panel */}
      {showTafseerPanel && (
        <div className="mb-4 p-3 rounded-xl bg-card border border-gold/10 space-y-1 animate-fade-in max-h-[60vh] overflow-y-auto">
          <p className="text-[10px] text-muted-foreground mb-2 px-1">Select a tafseer to display commentary below each ayah</p>
          
          {/* None option */}
          <label
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-smooth ${
              !selectedTafseer ? "bg-primary/10 text-gold" : "text-foreground hover:bg-muted/50"
            }`}
          >
            <input
              type="radio"
              name="tafseer"
              checked={!selectedTafseer}
              onChange={() => setSelectedTafseer(null)}
              className="accent-[hsl(43,65%,52%)] w-4 h-4"
            />
            <span>None (No Tafseer)</span>
          </label>

          {TAFSEERS.map((group) => {
            const isExpanded = expandedGroups[`taf-${group.group}`] !== false;
            return (
              <div key={group.group} className="rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleGroup(`taf-${group.group}`)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-surface rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-smooth"
                >
                  <span className="flex items-center gap-2">
                    <span>{group.groupIcon}</span>
                    <span>{group.group}</span>
                  </span>
                  <span className="text-muted-foreground text-xs">{isExpanded ? "▲" : "▼"}</span>
                </button>
                {isExpanded && (
                  <div className="px-2 py-1.5 space-y-0.5">
                    {group.editions.map((taf) => (
                      <label
                        key={taf.id}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-smooth ${
                          selectedTafseer === taf.id ? "bg-primary/10 text-gold" : "text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="tafseer"
                          checked={selectedTafseer === taf.id}
                          onChange={() => setSelectedTafseer(taf.id)}
                          className="accent-[hsl(43,65%,52%)] w-4 h-4"
                        />
                        <span className="flex-1">{taf.label}</span>
                        <span className="text-[9px] text-muted-foreground uppercase">
                          {taf.source === "fawaz" ? "CDN" : "API"}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Content */}
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
                const isHindi = edId.startsWith("hi.");
                return (
                  <div key={edId} className={`border-l-2 border-gold/20 pl-3 ${isUrdu ? "font-urdu" : ""}`}>
                    <p className="text-[10px] text-gold/60 mb-0.5">{ed?.label}</p>
                    <p
                      className={`text-sm leading-relaxed ${
                        isUrdu ? "text-urdu" : isHindi ? "text-foreground" : edId.startsWith("fawaz") ? "text-muted-foreground" : "text-english"
                      }`}
                      dir={isUrdu ? "rtl" : "ltr"}
                    >
                      {trans.text}
                    </p>
                  </div>
                );
              })}

              {/* Tafseer */}
              {tafseerData && tafseerData[ayah.numberInSurah - 1] && (
                <div className="border-l-2 border-secondary/40 pl-3 bg-secondary/5 rounded-r-lg py-2 pr-2">
                  <p className="text-[10px] text-secondary mb-0.5 font-medium">
                    📗 {selectedTafseerLabel}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {tafseerData[ayah.numberInSurah - 1].text}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Translation;
