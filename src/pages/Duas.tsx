import React, { useState, useMemo } from "react";
import { Search, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { DUA_CATEGORIES } from "@/data/duas";

type Lang = "english" | "urdu" | "romanUrdu";
const LANG_OPTIONS: { key: Lang; label: string }[] = [
  { key: "english", label: "English" },
  { key: "urdu", label: "اردو" },
  { key: "romanUrdu", label: "Roman Urdu" },
];

const Duas: React.FC = () => {
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("dua_lang") as Lang) || "english");
  const [showSettings, setShowSettings] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
                    <div
                      key={i}
                      className={`px-4 py-5 space-y-4 ${i > 0 ? "border-t border-border/50" : ""}`}
                    >
                      {/* Arabic */}
                      <p
                        className="font-arabic text-2xl leading-[2.2] text-foreground text-right"
                        dir="rtl"
                      >
                        {dua.arabic}
                      </p>

                      {/* Translation */}
                      <p className={`text-sm leading-relaxed ${lang === "urdu" ? "text-right font-urdu" : ""} text-muted-foreground`} dir={lang === "urdu" ? "rtl" : "ltr"}>
                        {dua[lang]}
                      </p>

                      {/* Reference */}
                      {dua.reference && (
                        <p className="text-[10px] text-primary/70 font-medium">
                          📖 {dua.reference}
                        </p>
                      )}
                    </div>
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
