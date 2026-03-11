import React from "react";
import { icons } from "lucide-react";
import { DuaCategory } from "@/data/duas";
import { DUA_CATEGORY_ICONS } from "@/data/duaCategoryIcons";
import { DUA_CATEGORY_GROUPS } from "@/data/duaCategoryEmojis";
import { DUA_CATEGORY_TRANSLATIONS } from "@/data/duaCategoryTranslations";

interface DuaCategoryGridProps {
  categories: DuaCategory[];
  appLang: string;
  onSelectCategory: (cat: DuaCategory) => void;
  search: string;
}

const getCatName = (cat: DuaCategory, appLang: string): string => {
  const tr = DUA_CATEGORY_TRANSLATIONS[cat.id];
  if (appLang === "ur" && tr?.ur) return tr.ur;
  if (appLang === "hi" && tr?.hi) return tr.hi;
  return cat.name;
};

const getGroupLabel = (group: typeof DUA_CATEGORY_GROUPS[0], appLang: string): string => {
  if (appLang === "ur") return group.labelUr;
  if (appLang === "hi") return group.labelHi;
  return group.label;
};

const CategoryIcon: React.FC<{ catId: string }> = ({ catId }) => {
  const iconName = DUA_CATEGORY_ICONS[catId] || "BookOpen";
  const LucideIcon = (icons as any)[iconName];
  if (!LucideIcon) {
    const Fallback = (icons as any)["BookOpen"];
    return <Fallback className="w-7 h-7 text-primary" />;
  }
  return <LucideIcon className="w-7 h-7 text-primary" />;
};

const CategoryCard: React.FC<{ cat: DuaCategory; appLang: string; onSelect: () => void }> = ({ cat, appLang, onSelect }) => (
  <button
    onClick={onSelect}
    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-primary/10 hover:border-primary/30 active:scale-[0.97] transition-all"
  >
    <div className="w-14 h-14 rounded-2xl border-2 border-primary/25 bg-primary/5 flex items-center justify-center">
      <CategoryIcon catId={cat.id} />
    </div>
    <span className={`text-xs font-semibold text-foreground text-center leading-tight line-clamp-2 ${appLang === "ur" ? "font-urdu" : ""}`}>
      {getCatName(cat, appLang)}
    </span>
    <span className="text-[10px] text-muted-foreground">{cat.duas.length} duas</span>
  </button>
);

const DuaCategoryGrid: React.FC<DuaCategoryGridProps> = ({ categories, appLang, onSelectCategory, search }) => {
  const catMap = new Map(categories.map(c => [c.id, c]));

  if (search.trim()) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {categories.map(cat => (
          <CategoryCard key={cat.id} cat={cat} appLang={appLang} onSelect={() => onSelectCategory(cat)} />
        ))}
      </div>
    );
  }

  const usedIds = new Set<string>();

  return (
    <div className="space-y-6">
      {DUA_CATEGORY_GROUPS.map((group) => {
        const groupCats = group.ids
          .map(id => catMap.get(id))
          .filter((c): c is DuaCategory => !!c);

        if (groupCats.length === 0) return null;
        groupCats.forEach(c => usedIds.add(c.id));

        return (
          <div key={group.label}>
            <h2 className={`text-sm font-bold text-foreground mb-3 ${appLang === "ur" ? "text-right font-urdu" : ""}`}>
              {getGroupLabel(group, appLang)}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {groupCats.map(cat => (
                <CategoryCard key={cat.id} cat={cat} appLang={appLang} onSelect={() => onSelectCategory(cat)} />
              ))}
            </div>
          </div>
        );
      })}

      {(() => {
        const remaining = categories.filter(c => !usedIds.has(c.id));
        if (remaining.length === 0) return null;
        return (
          <div>
            <h2 className="text-sm font-bold text-foreground mb-3">📌 More</h2>
            <div className="grid grid-cols-2 gap-3">
              {remaining.map(cat => (
                <CategoryCard key={cat.id} cat={cat} appLang={appLang} onSelect={() => onSelectCategory(cat)} />
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default DuaCategoryGrid;
