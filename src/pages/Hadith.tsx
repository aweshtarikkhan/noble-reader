import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { DAILY_HADITHS } from "@/data/hadith";
import { shareAsImage } from "@/lib/shareAsImage";
import { useToast } from "@/hooks/use-toast";

const Hadith: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lang, setLang] = useState<"english" | "urdu" | "romanUrdu">(() =>
    (localStorage.getItem("hadith_lang") as any) || "english"
  );
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleShare = (h: typeof DAILY_HADITHS[0]) => {
    shareAsImage([
      { text: h.arabic, font: "bold 28px serif", color: "#ffffff" },
      { text: "", font: "12px sans-serif", color: "transparent" },
      { text: h[lang], font: `18px ${lang === "urdu" ? "serif" : "sans-serif"}`, color: "#d1fae5" },
      { text: "", font: "8px sans-serif", color: "transparent" },
      { text: `— ${h.narrator}`, font: "italic 14px sans-serif", color: "rgba(255,255,255,0.6)" },
      { text: `📖 ${h.reference}`, font: "13px sans-serif", color: "rgba(255,255,255,0.5)" },
    ], "#064e3b", 800, toast);
  };

  const handleDownloadAll = () => {
    let text = "=== All Hadiths — Noble Quran Reader ===\n\n";
    DAILY_HADITHS.forEach((h, i) => {
      text += `--- Hadith ${i + 1} ---\n`;
      text += `Arabic: ${h.arabic}\n`;
      text += `English: ${h.english}\n`;
      text += `Urdu: ${h.urdu}\n`;
      text += `Roman Urdu: ${h.romanUrdu}\n`;
      text += `Narrator: ${h.narrator}\n`;
      text += `Reference: ${h.reference}\n\n`;
    });
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "all-hadiths.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded!", description: `${DAILY_HADITHS.length} hadiths saved` });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="active:scale-90 transition-smooth">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Hadiths</h1>
          <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">
            {DAILY_HADITHS.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {(["english", "urdu", "romanUrdu"] as const).map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); localStorage.setItem("hadith_lang", l); }}
                className={`text-[9px] px-2 py-0.5 rounded-full font-medium transition-smooth ${
                  lang === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {l === "english" ? "EN" : l === "urdu" ? "UR" : "RU"}
              </button>
            ))}
          </div>
          <button
            onClick={handleDownloadAll}
            className="p-2 rounded-xl bg-primary/10 active:scale-90 transition-smooth"
          >
            <Download className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="px-4 py-4 space-y-3">
        {DAILY_HADITHS.map((h, i) => (
          <button
            key={i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full text-left rounded-2xl bg-card border border-border overflow-hidden active:scale-[0.98] transition-smooth"
          >
            <div className="px-4 py-3 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-primary font-semibold mb-1">📖 {h.reference}</p>
                <p className="text-sm text-foreground line-clamp-2">
                  {h[lang]}
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0 mt-1">#{i + 1}</span>
            </div>

            {expanded === i && (
              <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                <p className="font-arabic text-xl leading-[2.2] text-foreground text-center" dir="rtl">
                  {h.arabic}
                </p>
                {lang !== "english" && (
                  <p className="text-sm text-muted-foreground">{h.english}</p>
                )}
                {lang !== "urdu" && (
                  <p className="text-sm text-muted-foreground text-right font-urdu" dir="rtl">{h.urdu}</p>
                )}
                {lang !== "romanUrdu" && (
                  <p className="text-sm text-muted-foreground">{h.romanUrdu}</p>
                )}
                <p className="text-[10px] text-muted-foreground italic text-right">— {h.narrator}</p>
                <div className="flex justify-center pt-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleShare(h); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary px-4 py-2 rounded-xl bg-primary/10 active:scale-95 transition-smooth"
                  >
                    <Share2 className="w-4 h-4" />
                    Share as Image
                  </button>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Hadith;
