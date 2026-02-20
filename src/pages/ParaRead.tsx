import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JUZ_DATA } from "@/data/surahs";
import { QuranAPI } from "@/lib/quranApi";

const ParaRead: React.FC = () => {
  const { num } = useParams();
  const navigate = useNavigate();
  const juzNum = parseInt(num || "1");
  const juz = JUZ_DATA.find((j) => j.number === juzNum);

  if (!juz) return <div className="p-4 text-center text-muted-foreground">Para not found</div>;

  const pages = Array.from({ length: juz.endPage - juz.startPage + 1 }, (_, i) => juz.startPage + i);

  return (
    <div className="px-4 py-4">
      <div className="text-center mb-4 animate-fade-in">
        <h2 className="font-arabic text-xl text-gold">{juz.name}</h2>
        <p className="text-sm text-muted-foreground">Para {juz.number} • Pages {juz.startPage}–{juz.endPage}</p>
      </div>

      <div className="space-y-4">
        {pages.map((p) => (
          <div key={p} className="rounded-2xl overflow-hidden border border-gold/10 shadow-gold bg-card">
            <div className="text-center py-1 bg-surface text-xs text-muted-foreground">Page {p}</div>
            <img
              src={QuranAPI.getMushafPageImage(p)}
              alt={`Page ${p}`}
              className="w-full"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 gap-3">
        {juzNum > 1 && (
          <button onClick={() => navigate(`/para-read/${juzNum - 1}`)} className="flex-1 py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm transition-smooth hover:border-gold/30">
            ← Para {juzNum - 1}
          </button>
        )}
        {juzNum < 30 && (
          <button onClick={() => navigate(`/para-read/${juzNum + 1}`)} className="flex-1 py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm transition-smooth hover:border-gold/30">
            Para {juzNum + 1} →
          </button>
        )}
      </div>
    </div>
  );
};

export default ParaRead;
