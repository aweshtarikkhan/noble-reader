import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SURAHS } from "@/data/surahs";
import { useI18n } from "@/lib/i18n";

const SurahList: React.FC = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { t } = useI18n();

  const filtered = SURAHS.filter((s) => s.englishName.toLowerCase().includes(search.toLowerCase()) || s.translation.toLowerCase().includes(search.toLowerCase()) || s.name.includes(search) || String(s.number).includes(search));

  return (
    <div className="px-4 py-4">
      <input type="text" placeholder={t("read.searchSurah")} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-gold/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 transition-smooth mb-4 text-sm" />
      <div className="flex flex-col gap-2">
        {filtered.map((s, i) => (
          <button key={s.number} onClick={() => navigate(`/surah-read/${s.number}`)} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-gold/10 hover:border-gold/30 transition-smooth text-left animate-fade-in" style={{ animationDelay: `${Math.min(i * 0.02, 0.5)}s` }}>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><span className="text-gold text-sm font-bold">{s.number}</span></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between"><span className="font-medium text-sm text-foreground">{s.englishName}</span><span className="font-arabic text-gold text-base">{s.name}</span></div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs text-muted-foreground">{s.translation}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{s.ayahs} {t("audio.ayahs")}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${s.type === "Meccan" ? "bg-primary/20 text-gold" : "bg-secondary/20 text-secondary"}`}>{s.type}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SurahList;
