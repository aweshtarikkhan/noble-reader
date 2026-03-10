import React from "react";
import { ArrowLeft, Settings, Languages, BookOpen, Heart, Share2, Copy } from "lucide-react";
import { DuaTranslation } from "@/data/duas";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { shareAsImage } from "@/lib/shareAsImage";

type Lang = "english" | "urdu" | "romanUrdu" | "hindi";
const LANG_OPTIONS: { key: Lang; label: string }[] = [
  { key: "english", label: "English" },
  { key: "urdu", label: "اردو" },
  { key: "hindi", label: "हिंदी" },
  { key: "romanUrdu", label: "Roman Urdu" },
];

const getDuaText = (dua: DuaTranslation, lang: Lang): string => {
  if (lang === "hindi") return dua.romanUrdu;
  return dua[lang];
};

interface DuaDetailViewProps {
  dua: DuaTranslation;
  catName: string;
  lang: Lang;
  setLang: (l: Lang) => void;
  isFav: boolean;
  toggleFav: () => void;
  onBack: () => void;
}

const DuaDetailView: React.FC<DuaDetailViewProps> = ({ dua, catName, lang, setLang, isFav, toggleFav, onBack }) => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [showSettings, setShowSettings] = React.useState(false);

  const shareDua = async () => {
    await shareAsImage(
      [
        { text: dua.arabic, font: "bold 28px serif", color: "#d4a843", align: "right" },
        { text: "", font: "14px sans-serif", color: "transparent" },
        { text: dua.urdu, font: "20px serif", color: "#c8dfd0", align: "right" },
        { text: "", font: "10px sans-serif", color: "transparent" },
        { text: dua.english, font: "15px sans-serif", color: "#a8c8b0" },
        { text: "", font: "10px sans-serif", color: "transparent" },
        { text: dua.romanUrdu, font: "italic 14px sans-serif", color: "#8ab89a" },
        { text: "", font: "14px sans-serif", color: "transparent" },
        { text: dua.reference ? `📖 ${dua.reference}` : "", font: "13px sans-serif", color: "rgba(255,255,255,0.45)", align: "left" },
      ],
      "#064e3b", 800, toast
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card sticky z-10" style={{ top: "calc(56px + env(safe-area-inset-top, 20px))" }}>
        <button onClick={onBack} className="p-1 rounded-lg active:bg-muted/50">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-sm font-semibold text-foreground truncate flex-1">{catName}</h1>
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

      <div className="px-4 py-5 space-y-5">
        <div className="rounded-2xl bg-primary/8 border border-primary/15 p-6">
          <p className="font-arabic text-[1.65rem] leading-[2.4] text-foreground text-center" dir="rtl">{dua.arabic}</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2"><Languages className="w-4.5 h-4.5 text-primary" /><h2 className="text-sm font-bold text-foreground">{t("duas.translation")}</h2></div>
          <p className={`text-sm leading-relaxed text-muted-foreground pl-1 ${lang === "urdu" ? "text-right font-urdu" : lang === "hindi" ? "font-hindi" : ""}`} dir={lang === "urdu" ? "rtl" : "ltr"}>{getDuaText(dua, lang)}</p>
        </div>
        <div className="border-t border-border" />
        {dua.reference && (
          <div className="space-y-3">
            <div className="flex items-center gap-2"><BookOpen className="w-4.5 h-4.5 text-primary" /><h2 className="text-sm font-bold text-foreground">{t("duas.reference")}</h2></div>
            <p className="text-xs text-muted-foreground pl-1">{dua.reference}</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-24 right-5 flex flex-col gap-3">
        <button onClick={() => { const text = `${dua.arabic}\n\n${getDuaText(dua, lang)}${dua.reference ? '\n\n📖 ' + dua.reference : ''}`; navigator.clipboard.writeText(text); toast({ title: "📋", description: "Copied to clipboard" }); }} className="w-12 h-12 rounded-full bg-card text-muted-foreground border border-border shadow-lg flex items-center justify-center active:scale-95 transition-smooth"><Copy className="w-5 h-5" /></button>
        <button onClick={toggleFav} className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-smooth ${isFav ? "bg-destructive text-destructive-foreground" : "bg-card text-muted-foreground border border-border"}`}><Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} /></button>
        <button onClick={shareDua} className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center active:scale-95 transition-smooth"><Share2 className="w-5 h-5" /></button>
      </div>
    </div>
  );
};

export default DuaDetailView;
