import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JUZ_DATA } from "@/data/surahs";
import { INDIAN_JUZ_DATA, getIndianPageImage, getIndianPageImageFallback } from "@/data/indianMushaf";
import { QuranAPI } from "@/lib/quranApi";

type QuranStyle = "indopak" | "saudi";

const ParaRead: React.FC = () => {
  const { num } = useParams();
  const navigate = useNavigate();
  const juzNum = parseInt(num || "1");
  const [style, setStyle] = useState<QuranStyle>(() => (localStorage.getItem("para-quran-style") as QuranStyle) || "indopak");

  const juz = JUZ_DATA.find((j) => j.number === juzNum);
  const indianJuz = INDIAN_JUZ_DATA.find((j) => j.number === juzNum);

  if (!juz) return <div className="p-4 text-center text-muted-foreground">Para not found</div>;

  const handleStyleChange = (s: QuranStyle) => {
    setStyle(s);
    localStorage.setItem("para-quran-style", s);
  };

  const saudiPages = Array.from({ length: juz.endPage - juz.startPage + 1 }, (_, i) => juz.startPage + i);
  const indianPages = indianJuz
    ? Array.from({ length: indianJuz.endPage - indianJuz.startPage + 1 }, (_, i) => indianJuz.startPage + i)
    : [];

  return (
    <div className="px-4 py-4">
      <div className="text-center mb-4 animate-fade-in">
        <h2 className="font-arabic text-xl text-gold">{juz.name}</h2>
        <p className="text-sm text-muted-foreground">Para {juz.number}</p>
      </div>

      {/* Style toggle */}
      <div className="flex bg-card rounded-xl p-1 border border-gold/10 mb-4 animate-fade-in">
        <button
          onClick={() => handleStyleChange("indopak")}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${style === "indopak" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          🇮🇳 Indo-Pak (16 Line)
        </button>
        <button
          onClick={() => handleStyleChange("saudi")}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${style === "saudi" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          🇸🇦 Saudi Style
        </button>
      </div>

      <div className="space-y-4">
        {style === "saudi"
          ? saudiPages.map((p) => (
              <div key={p} className="rounded-2xl overflow-hidden border border-gold/10 shadow-gold bg-card">
                <div className="text-center py-1 bg-surface text-xs text-muted-foreground">Page {p}</div>
                <img
                  src={QuranAPI.getMushafPageImage(p)}
                  alt={`Page ${p}`}
                  className="w-full"
                  loading="lazy"
                />
              </div>
            ))
          : indianPages.map((p) => (
              <IndianPage key={p} page={p} />
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

const IndianPage: React.FC<{ page: number }> = ({ page }) => {
  const [useFallback, setUseFallback] = useState(false);
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!useFallback) setUseFallback(true);
    else setError(true);
  };

  const src = useFallback ? getIndianPageImageFallback(page) : getIndianPageImage(page);

  return (
    <div className="rounded-2xl overflow-hidden border border-gold/10 shadow-gold bg-card">
      <div className="text-center py-1 bg-surface text-xs text-muted-foreground">Page {page}</div>
      {error ? (
        <div className="text-center py-8 text-muted-foreground text-xs">Failed to load</div>
      ) : (
        <img src={src} alt={`Page ${page}`} className="w-full" loading="lazy" onError={handleError} />
      )}
    </div>
  );
};

export default ParaRead;
