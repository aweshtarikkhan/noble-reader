import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { icons } from "lucide-react";
import { DUA_CATEGORIES, DuaTranslation, DuaCategory } from "@/data/duas";
import { RABBANA_DUAS } from "@/data/rabbanaDuas";
import { DUA_CATEGORY_TRANSLATIONS } from "@/data/duaCategoryTranslations";
import { DUA_CATEGORY_ICONS } from "@/data/duaCategoryIcons";
import { useI18n } from "@/lib/i18n";
import DuaCategoryGrid from "@/components/DuaCategoryGrid";
import DuaCategoryView from "@/components/DuaCategoryView";
import DuaDetailView from "@/components/DuaDetailView";

type Lang = "english" | "urdu" | "romanUrdu" | "hindi";

const getAppLangToDuaLang = (appLang: string): Lang => {
  if (appLang === "ur") return "urdu";
  if (appLang === "hi") return "hindi";
  return "english";
};

const getCatName = (cat: DuaCategory, appLang: string): string => {
  const tr = DUA_CATEGORY_TRANSLATIONS[cat.id];
  if (appLang === "ur" && tr?.ur) return tr.ur;
  if (appLang === "hi" && tr?.hi) return tr.hi;
  return cat.name;
};

const isRamadanMonth = (): boolean => {
  try {
    const now = new Date();
    const adjusted = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-civil', { month: 'numeric' });
    const parts = formatter.formatToParts(adjusted);
    const month = parts.find(p => p.type === 'month')?.value;
    return month === "9";
  } catch { return false; }
};

const duaKey = (dua: DuaTranslation) => dua.arabic.slice(0, 30);

const Duas: React.FC = () => {
  const { t, lang: appLang } = useI18n();
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem("dua_lang") as Lang;
    if (stored) return stored;
    return getAppLangToDuaLang(localStorage.getItem("app_lang") || "en");
  });

  const [selectedCategory, setSelectedCategory] = useState<DuaCategory | null>(null);
  const [selectedDua, setSelectedDua] = useState<{ dua: DuaTranslation; catName: string } | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("dua_favs") || "[]"); } catch { return []; }
  });

  const allCategories = useMemo(() => {
    const rabbanaCategory: DuaCategory = { id: "40-rabbana-duas", name: "40 Rabbana Duas", duas: RABBANA_DUAS };
    const ramadanIsNow = isRamadanMonth();
    const ramadanIdx = DUA_CATEGORIES.findIndex(c => c.id === "ramadan-duas");
    const categories = [...DUA_CATEGORIES];
    if (ramadanIdx >= 0) {
      const [ramadan] = categories.splice(ramadanIdx, 1);
      if (ramadanIsNow) { categories.unshift(rabbanaCategory); categories.unshift(ramadan); }
      else { categories.splice(1, 0, rabbanaCategory); categories.push(ramadan); }
    } else { categories.splice(1, 0, rabbanaCategory); }
    return categories;
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return allCategories;
    const q = search.toLowerCase();
    return allCategories.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.duas.some(d => d.arabic.includes(search) || d.english.toLowerCase().includes(q) || d.urdu.includes(search) || d.romanUrdu.toLowerCase().includes(q))
    );
  }, [search, allCategories]);

  const toggleFav = (key: string) => {
    const next = favorites.includes(key) ? favorites.filter(f => f !== key) : [...favorites, key];
    setFavorites(next);
    localStorage.setItem("dua_favs", JSON.stringify(next));
  };

  // Handle back navigation
  const goBack = useCallback(() => {
    if (selectedDua) { setSelectedDua(null); return; }
    if (selectedCategory) { setSelectedCategory(null); return; }
  }, [selectedDua, selectedCategory]);

  useEffect(() => {
    const handlePopState = () => goBack();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [goBack]);

  const openCategory = useCallback((cat: DuaCategory) => {
    window.history.pushState({ duaCat: true }, "");
    setSelectedCategory(cat);
  }, []);

  const openDua = useCallback((dua: DuaTranslation) => {
    if (!selectedCategory) return;
    window.history.pushState({ duaDetail: true }, "");
    setSelectedDua({ dua, catName: getCatName(selectedCategory, appLang) });
  }, [selectedCategory, appLang]);

  // Detail view
  if (selectedDua) {
    const key = duaKey(selectedDua.dua);
    return (
      <DuaDetailView
        dua={selectedDua.dua}
        catName={selectedDua.catName}
        lang={lang}
        setLang={setLang}
        isFav={favorites.includes(key)}
        toggleFav={() => toggleFav(key)}
        onBack={() => { window.history.back(); }}
      />
    );
  }

  // Category list view
  if (selectedCategory) {
    return (
      <DuaCategoryView
        category={selectedCategory}
        lang={lang}
        setLang={setLang}
        onBack={() => { window.history.back(); }}
        onSelectDua={openDua}
        favorites={favorites}
        toggleFav={toggleFav}
      />
    );
  }

  // Main grid view
  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("duas.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-card text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Special pinned categories */}
      {!search.trim() && (
        <div className="grid grid-cols-2 gap-3">
          {allCategories.filter(c => c.id === "40-rabbana-duas" || c.id === "ramadan-duas").map(cat => (
            <button
              key={cat.id}
              onClick={() => openCategory(cat)}
              className="flex flex-col items-center gap-3 py-5 px-4 rounded-2xl bg-card border border-primary/15 active:scale-[0.97] transition-all"
            >
              <div className="w-16 h-16 rounded-2xl border-2 border-primary/30 bg-primary/5 flex items-center justify-center">
                {(() => {
                  const iconName = DUA_CATEGORY_ICONS[cat.id] || "BookOpen";
                  const Icon = (icons as any)[iconName] || (icons as any)["BookOpen"];
                  return <Icon className="w-8 h-8 text-primary" />;
                })()}
              </div>
              <span className={`text-sm font-bold text-foreground text-center ${appLang === "ur" ? "font-urdu" : ""}`}>
                {getCatName(cat, appLang)}
              </span>
              <span className="text-[10px] text-muted-foreground">{cat.duas.length} duas</span>
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        📂 {filtered.length} {t("duas.categoriesFound")}
      </p>

      <DuaCategoryGrid
        categories={filtered.filter(c => c.id !== "40-rabbana-duas" && c.id !== "ramadan-duas")}
        appLang={appLang}
        onSelectCategory={openCategory}
        search={search}
      />

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">{t("duas.noDuasFound")} "{search}"</p>
        </div>
      )}
    </div>
  );
};

export default Duas;
