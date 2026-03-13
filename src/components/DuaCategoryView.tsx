import React from "react";
import { ArrowLeft, Settings, Languages, BookOpen, Heart, Share2, Copy } from "lucide-react";
import { DuaTranslation, DuaCategory } from "@/data/duas";
import { DUA_CATEGORY_EMOJIS } from "@/data/duaCategoryEmojis";
import { DUA_CATEGORY_TRANSLATIONS } from "@/data/duaCategoryTranslations";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { shareAsImage } from "@/lib/shareAsImage";

type Lang = "english" | "urdu" | "romanUrdu" | "hindi";
const LANG_OPTIONS: { key: Lang; label: string }[] = [
  { key: "english", label: "English" },
  { key: "urdu", label: "اردو" },
  { key: "romanUrdu", label: "Roman Urdu" },
];

const getDuaText = (dua: DuaTranslation, lang: Lang): string => {
  if (lang === "hindi") return dua.romanUrdu;
  return dua[lang];
};

const getCatName = (cat: DuaCategory, appLang: string): string => {
  const tr = DUA_CATEGORY_TRANSLATIONS[cat.id];
  if (appLang === "ur" && tr?.ur) return tr.ur;
  if (appLang === "hi" && tr?.hi) return tr.hi;
  return cat.name;
};

interface DuaCategoryViewProps {
  category: DuaCategory;
  lang: Lang;
  setLang: (l: Lang) => void;
  onBack: () => void;
  onSelectDua: (dua: DuaTranslation) => void;
  favorites: string[];
  toggleFav: (key: string) => void;
}

const duaKey = (dua: DuaTranslation) => dua.arabic.slice(0, 30);

const DuaCategoryView: React.FC<DuaCategoryViewProps> = ({
  category, lang, setLang, onBack, onSelectDua, favorites, toggleFav
}) => {
  const { t, lang: appLang } = useI18n();
  const { toast } = useToast();
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card sticky z-10" style={{ top: "calc(56px + env(safe-area-inset-top, 20px))" }}>
        <button onClick={onBack} className="p-1 rounded-lg active:bg-muted/50">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-xl">{DUA_CATEGORY_EMOJIS[category.id] || "📿"}</span>
        <h1 className={`text-sm font-semibold text-foreground truncate flex-1 ${appLang === "ur" ? "font-urdu" : ""}`}>
          {getCatName(category, appLang)}
        </h1>
        <button onClick={() => setShowSettings(!showSettings)} className="p-2 -mr-2 rounded-lg active:bg-muted/50">
          <Settings className="w-4.5 h-4.5 text-muted-foreground" />
        </button>
      </div>

      {showSettings && (
        <div className="mx-4 mt-3 rounded-xl bg-card border border-border p-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("duas.translationLang")}</p>
          <div className="flex gap-2">
            {LANG_OPTIONS.map((opt) => (
              <button key={opt.key} onClick={() => { setLang(opt.key); localStorage.setItem("dua_lang", opt.key); }} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-smooth ${lang === opt.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{opt.label}</button>
            ))}
          </div>
        </div>
      )}

      <div className="divide-y divide-border">
        {category.duas.map((dua, i) => {
          const key = duaKey(dua);
          const isFav = favorites.includes(key);
          return (
            <div key={i} className="flex items-start">
              <button onClick={() => onSelectDua(dua)} className="flex-1 text-left px-4 py-4 space-y-2 active:bg-muted/30 transition-smooth min-w-0">
                <p className="font-arabic text-lg leading-[2] text-foreground text-right line-clamp-2" dir="rtl">{dua.arabic}</p>
                <p className={`text-xs leading-relaxed line-clamp-2 ${lang === "urdu" ? "text-right font-urdu" : lang === "hindi" ? "font-hindi" : ""} text-muted-foreground`} dir={lang === "urdu" ? "rtl" : "ltr"}>{getDuaText(dua, lang)}</p>
                {dua.reference && <p className="text-[10px] text-primary/70 font-medium">📖 {dua.reference}</p>}
              </button>
              <div className="flex flex-col items-center gap-1 px-2 py-4">
                <button onClick={() => toggleFav(key)} className="p-1.5 active:scale-90">
                  <Heart className={`w-3.5 h-3.5 ${isFav ? "text-destructive fill-current" : "text-muted-foreground"}`} />
                </button>
                <button onClick={() => { const text = `${dua.arabic}\n\n${getDuaText(dua, lang)}${dua.reference ? '\n\n📖 ' + dua.reference : ''}`; navigator.clipboard.writeText(text); toast({ title: "📋", description: "Copied!" }); }} className="p-1.5 active:scale-90">
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DuaCategoryView;
