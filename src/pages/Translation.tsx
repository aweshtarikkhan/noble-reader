import React, { useEffect, useState, useRef } from "react";
import { SURAHS } from "@/data/surahs";
import { QuranAPI } from "@/lib/quranApi";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Settings, Search, Bookmark, BookmarkCheck, Play, X, ChevronDown } from "lucide-react";

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
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [arabicAyahs, setArabicAyahs] = useState<any[]>([]);
  const [translations, setTranslations] = useState<Record<string, any[]>>({});
  const [tafseerData, setTafseerData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("trans-bookmarks") || "[]"); } catch { return []; }
  });
  const [showSurahDropdown, setShowSurahDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const surahInfo = SURAHS.find((s) => s.number === surahNum);

  useEffect(() => {
    localStorage.setItem("trans-surah", String(surahNum));
    localStorage.setItem("trans-editions", JSON.stringify(selectedEditions));
    if (selectedTafseer) localStorage.setItem("trans-tafseer", selectedTafseer);
    else localStorage.removeItem("trans-tafseer");
  }, [surahNum, selectedEditions, selectedTafseer]);

  useEffect(() => {
    localStorage.setItem("trans-bookmarks", JSON.stringify(bookmarkedAyahs));
  }, [bookmarkedAyahs]);

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

  const toggleBookmark = (ayahNum: number) => {
    setBookmarkedAyahs((prev) =>
      prev.includes(ayahNum) ? prev.filter((a) => a !== ayahNum) : [...prev, ayahNum]
    );
  };

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const allEditions = EDITIONS.flatMap((g) => g.editions);
  const allTafseers = TAFSEERS.flatMap((g) => g.editions);
  const selectedTafseerLabel = allTafseers.find((t) => t.id === selectedTafseer)?.label;

  // Filter ayahs by search
  const filteredAyahs = searchQuery.trim()
    ? arabicAyahs.filter((ayah: any) => {
        const num = ayah.numberInSurah;
        if (String(num).includes(searchQuery)) return true;
        // Search in translations
        for (const edId of selectedEditions) {
          const trans = translations[edId]?.[num - 1];
          if (trans?.text?.toLowerCase().includes(searchQuery.toLowerCase())) return true;
        }
        return false;
      })
    : arabicAyahs;

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Surah Selector */}
          <div className="relative">
            <button
              onClick={() => setShowSurahDropdown(!showSurahDropdown)}
              className="flex items-center gap-1 text-left"
            >
              <div>
                <h1 className="text-base font-bold text-foreground leading-tight">{surahInfo?.englishName}</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Ayah 1 of {surahInfo?.ayahs}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {showSurahDropdown && (
              <div className="absolute top-full left-0 mt-1 w-72 max-h-80 overflow-y-auto bg-card border border-border rounded-xl shadow-lg z-30 animate-fade-in">
                {SURAHS.map((s) => (
                  <button
                    key={s.number}
                    onClick={() => { setSurahNum(s.number); setShowSurahDropdown(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-muted transition-smooth ${
                      s.number === surahNum ? "bg-primary/10 text-primary" : "text-foreground"
                    }`}
                  >
                    <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                      {s.number}
                    </span>
                    <span className="flex-1">{s.englishName}</span>
                    <span className="font-arabic text-xs text-muted-foreground">{s.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setShowSettings(!showSettings); setShowSearch(false); }}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-smooth active:scale-90 ${
                showSettings ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setShowSearch(!showSearch); setShowSettings(false); }}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-smooth active:scale-90 ${
                showSearch ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth active:scale-90"
              aria-label="Bookmarks"
              onClick={() => {
                // Scroll to first bookmarked ayah
                if (bookmarkedAyahs.length > 0) {
                  const el = document.getElementById(`ayah-${bookmarkedAyahs[0]}`);
                  el?.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
            >
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="mt-3 flex items-center gap-2 animate-fade-in">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ayah or translation..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
              />
            </div>
            <button
              onClick={() => { setShowSearch(false); setSearchQuery(""); }}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Settings Panel (overlay) */}
      {showSettings && (
        <div className="sticky top-[60px] z-10 bg-card border-b border-border px-4 py-3 max-h-[70vh] overflow-y-auto animate-fade-in">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">Translations</h3>
          {EDITIONS.map((group) => {
            const isExpanded = expandedGroups[group.group] !== false;
            const selectedCount = group.editions.filter((e) => selectedEditions.includes(e.id)).length;
            return (
              <div key={group.group} className="mb-1">
                <button
                  onClick={() => toggleGroup(group.group)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-smooth"
                >
                  <span className="flex items-center gap-2">
                    <span>{group.groupIcon}</span>
                    <span>{group.group}</span>
                    {selectedCount > 0 && (
                      <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">{selectedCount}</span>
                    )}
                  </span>
                  <span className="text-muted-foreground text-xs">{isExpanded ? "▲" : "▼"}</span>
                </button>
                {isExpanded && (
                  <div className="px-2 py-1 space-y-0.5">
                    {group.editions.map((ed) => (
                      <label
                        key={ed.id}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-smooth ${
                          selectedEditions.includes(ed.id) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedEditions.includes(ed.id)}
                          onChange={() => toggleEdition(ed.id)}
                          className="accent-[hsl(var(--primary))] w-4 h-4 rounded"
                        />
                        <span className="flex-1">{ed.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <h3 className="text-xs font-bold text-foreground uppercase tracking-wide mb-3 mt-4">Tafseer</h3>
          <label
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-smooth ${
              !selectedTafseer ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
            }`}
          >
            <input type="radio" name="tafseer" checked={!selectedTafseer} onChange={() => setSelectedTafseer(null)} className="accent-[hsl(var(--primary))] w-4 h-4" />
            <span>None</span>
          </label>
          {TAFSEERS.map((group) => {
            const isExpanded = expandedGroups[`taf-${group.group}`] !== false;
            return (
              <div key={group.group} className="mb-1">
                <button
                  onClick={() => toggleGroup(`taf-${group.group}`)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-smooth"
                >
                  <span className="flex items-center gap-2">
                    <span>{group.groupIcon}</span>
                    <span>{group.group}</span>
                  </span>
                  <span className="text-muted-foreground text-xs">{isExpanded ? "▲" : "▼"}</span>
                </button>
                {isExpanded && (
                  <div className="px-2 py-1 space-y-0.5">
                    {group.editions.map((taf) => (
                      <label
                        key={taf.id}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-smooth ${
                          selectedTafseer === taf.id ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <input type="radio" name="tafseer" checked={selectedTafseer === taf.id} onChange={() => setSelectedTafseer(taf.id)} className="accent-[hsl(var(--primary))] w-4 h-4" />
                        <span className="flex-1">{taf.label}</span>
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
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <LoadingSpinner message="Loading translations..." />
        ) : (
          <div className="space-y-4 animate-fade-in">
            {filteredAyahs.map((ayah: any) => {
              const isBookmarked = bookmarkedAyahs.includes(ayah.numberInSurah);
              return (
                <div
                  key={ayah.numberInSurah}
                  id={`ayah-${ayah.numberInSurah}`}
                  className={`p-4 rounded-2xl border space-y-4 ${
                    isBookmarked ? "bg-primary/5 border-primary/20" : "bg-card border-border"
                  }`}
                >
                  {/* Ayah header: number + play + bookmark */}
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-bold">
                      {ayah.numberInSurah}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(ayah.numberInSurah)}
                        className="active:scale-90 transition-smooth"
                        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-primary" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground text-background text-xs font-medium active:scale-95 transition-smooth">
                        <Play className="w-3 h-3 fill-current" />
                        Play
                      </button>
                    </div>
                  </div>

                  {/* Arabic */}
                  <div dir="rtl" className="py-3">
                    <p className="font-arabic text-arabic text-xl leading-[2.4] text-center">{ayah.text}</p>
                  </div>

                  {/* Translations */}
                  {selectedEditions.map((edId) => {
                    const ed = allEditions.find((e) => e.id === edId);
                    const trans = translations[edId]?.[ayah.numberInSurah - 1];
                    if (!trans) return null;
                    const isUrdu = edId.startsWith("ur.");
                    return (
                      <div key={edId} className={`space-y-1 ${isUrdu ? "font-urdu" : ""}`}>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                          {ed?.label}
                        </p>
                        <p
                          className={`text-sm leading-relaxed ${isUrdu ? "text-urdu" : "text-foreground"}`}
                          dir={isUrdu ? "rtl" : "ltr"}
                        >
                          {trans.text}
                        </p>
                      </div>
                    );
                  })}

                  {/* Tafseer */}
                  {tafseerData && tafseerData[ayah.numberInSurah - 1] && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-primary uppercase tracking-wide font-bold">
                        {selectedTafseerLabel}
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground italic">
                        {tafseerData[ayah.numberInSurah - 1].text}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Translation;
