import React, { useState, useMemo } from "react";
import { Search, Settings, ChevronDown, ChevronUp, Heart, Share2, ArrowLeft, BookOpen, Languages } from "lucide-react";
import { DUA_CATEGORIES, DuaTranslation } from "@/data/duas";
import { useNavigate } from "react-router-dom";

type Lang = "english" | "urdu" | "romanUrdu";
const LANG_OPTIONS: { key: Lang; label: string }[] = [
  { key: "english", label: "English" },
  { key: "urdu", label: "اردو" },
  { key: "romanUrdu", label: "Roman Urdu" },
];

const Duas: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("dua_lang") as Lang) || "english");
  const [showSettings, setShowSettings] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedDua, setSelectedDua] = useState<{ dua: DuaTranslation; catName: string } | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("dua_favs") || "[]"); } catch { return []; }
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return DUA_CATEGORIES;
    const q = search.toLowerCase();
    return DUA_CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.duas.some(
          (d) =>
            d.arabic.includes(search) ||
            d.english.toLowerCase().includes(q) ||
            d.urdu.includes(search) ||
            d.romanUrdu.toLowerCase().includes(q)
        )
    );
  }, [search]);

  const setLanguage = (l: Lang) => {
    setLang(l);
    localStorage.setItem("dua_lang", l);
  };

  const toggleFav = (key: string) => {
    const next = favorites.includes(key) ? favorites.filter(f => f !== key) : [...favorites, key];
    setFavorites(next);
    localStorage.setItem("dua_favs", JSON.stringify(next));
  };

  const shareDua = async (dua: DuaTranslation) => {
    const text = `${dua.arabic}\n\n${dua[lang]}\n\n${dua.reference ? `📖 ${dua.reference}` : ""}`;
    if (navigator.share) {
      try { await navigator.share({ text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  const duaKey = (dua: DuaTranslation) => dua.arabic.slice(0, 30);

  // ===== DUA DETAIL VIEW =====
  if (selectedDua) {
    const { dua, catName } = selectedDua;
    const key = duaKey(dua);
    const isFav = favorites.includes(key);
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card sticky top-0 z-10">
          <button onClick={() => setSelectedDua(null)} className="p-2 -ml-2 rounded-lg active:bg-muted/50">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-sm font-semibold text-foreground truncate max-w-[60%]">{catName}</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 -mr-2 rounded-lg active:bg-muted/50"
          >
            <Settings className="w-4.5 h-4.5 text-muted-foreground" />
          </button>
        </div>

        {showSettings && (
          <div className="mx-4 mt-3 rounded-xl bg-card border border-border p-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Translation Language</p>
            <div className="flex gap-2">
              {LANG_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setLanguage(opt.key)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-smooth ${
                    lang === opt.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 py-5 space-y-5">
          {/* Arabic Card - Green tinted */}
          <div className="rounded-2xl bg-primary/8 border border-primary/15 p-6">
            <p
              className="font-arabic text-[1.65rem] leading-[2.4] text-foreground text-center"
              dir="rtl"
            >
              {dua.arabic}
            </p>
          </div>

          {/* Translation Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Languages className="w-4.5 h-4.5 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Translation</h2>
            </div>
            <p
              className={`text-sm leading-relaxed text-muted-foreground pl-1 ${
                lang === "urdu" ? "text-right font-urdu" : ""
              }`}
              dir={lang === "urdu" ? "rtl" : "ltr"}
            >
              {dua[lang]}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Reference Section */}
          {dua.reference && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-primary" />
                <h2 className="text-sm font-bold text-foreground">Reference</h2>
              </div>
              <p className="text-xs text-muted-foreground pl-1">
                {dua.reference}
              </p>
            </div>
          )}
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-24 right-5 flex flex-col gap-3">
          <button
            onClick={() => toggleFav(key)}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-smooth ${
              isFav ? "bg-destructive text-destructive-foreground" : "bg-card text-muted-foreground border border-border"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={() => shareDua(dua)}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center active:scale-95 transition-smooth"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // ===== CATEGORY LIST VIEW =====
  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search duas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-card text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-10 h-10 rounded-xl bg-card flex items-center justify-center border border-border active:scale-95 transition-smooth"
        >
          <Settings className="w-4.5 h-4.5 text-muted-foreground" />
        </button>
      </div>

      {/* Language Settings */}
      {showSettings && (
        <div className="rounded-xl bg-card border border-border p-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Translation Language</p>
          <div className="flex gap-2">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setLanguage(opt.key)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-smooth ${
                  lang === opt.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-muted-foreground">{filtered.length} categories found</p>

      {/* Dua List */}
      <div className="space-y-2">
        {filtered.map((cat) => {
          const isOpen = expandedId === cat.id;
          return (
            <div key={cat.id} className="rounded-xl bg-card border border-border overflow-hidden">
              <button
                onClick={() => setExpandedId(isOpen ? null : cat.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-muted/50 transition-smooth"
              >
                <span className="text-sm font-semibold text-foreground pr-2">{cat.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {cat.duas.length}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border">
                  {cat.duas.map((dua, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDua({ dua, catName: cat.name })}
                      className={`w-full text-left px-4 py-4 space-y-2 active:bg-muted/30 transition-smooth ${
                        i > 0 ? "border-t border-border/50" : ""
                      }`}
                    >
                      <p
                        className="font-arabic text-lg leading-[2] text-foreground text-right line-clamp-2"
                        dir="rtl"
                      >
                        {dua.arabic}
                      </p>
                      <p className={`text-xs leading-relaxed line-clamp-2 ${
                        lang === "urdu" ? "text-right font-urdu" : ""
                      } text-muted-foreground`} dir={lang === "urdu" ? "rtl" : "ltr"}>
                        {dua[lang]}
                      </p>
                      {dua.reference && (
                        <p className="text-[10px] text-primary/70 font-medium">
                          📖 {dua.reference}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">No duas found for "{search}"</p>
        </div>
      )}
    </div>
  );
};

export default Duas;
