import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SURAHS } from "@/data/surahs";

const TafseerReader: React.FC = () => {
  const navigate = useNavigate();
  const [translationId] = useState("en.sahih");
  const [tafseerId] = useState("fawaz-maududi");

  return (
    <div className="px-4 py-4">
      <div className="mb-4 p-4 rounded-xl bg-card border border-gold/10 animate-fade-in">
        <p className="text-xs text-muted-foreground mb-1">Translation + Tafseer Reader</p>
        <p className="text-sm text-foreground">Select a Surah to begin reading with Tafseer</p>
      </div>

      <div className="flex flex-col gap-2">
        {SURAHS.map((s, i) => (
          <button
            key={s.number}
            onClick={() => navigate(`/tafseer-read/${s.number}`)}
            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-gold/10 hover:border-gold/30 transition-smooth text-left animate-fade-in"
            style={{ animationDelay: `${Math.min(i * 0.02, 0.5)}s` }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-gold text-sm font-bold">{s.number}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-foreground">{s.englishName}</span>
                <span className="font-arabic text-gold text-sm">{s.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-muted-foreground">{s.ayahs} ayahs</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${s.ayahs <= 50 ? "bg-secondary/20 text-secondary" : "bg-primary/20 text-gold"}`}>
                  {s.ayahs <= 50 ? "FULL" : "AYAT"}
                </span>
              </div>
            </div>
            <span className="text-muted-foreground">›</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TafseerReader;
