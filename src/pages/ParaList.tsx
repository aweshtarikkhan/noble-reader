import React from "react";
import { useNavigate } from "react-router-dom";
import { JUZ_DATA } from "@/data/surahs";

const ParaList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-4">
      <div className="flex flex-col gap-2">
        {JUZ_DATA.map((juz, i) => (
          <button
            key={juz.number}
            onClick={() => navigate(`/para-read/${juz.number}`)}
            className="flex items-center gap-3 p-4 rounded-xl bg-card border border-gold/10 hover:border-gold/30 transition-smooth text-left animate-fade-in"
            style={{ animationDelay: `${i * 0.03}s` }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-gold text-sm font-bold">{juz.number}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-foreground">Para {juz.number}</span>
                <span className="font-arabic text-gold text-sm">{juz.name}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Pages {juz.startPage}–{juz.endPage} • {juz.startSurah.split(" ")[0]}
              </p>
            </div>
            <span className="text-muted-foreground">›</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ParaList;
