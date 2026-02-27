import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QuranAPI } from "@/lib/quranApi";
import { TOTAL_PAGES } from "@/data/surahs";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useI18n } from "@/lib/i18n";

const Mushaf: React.FC = () => {
  const { page: pageParam } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [mode, setMode] = useState<"image" | "text">(() => (localStorage.getItem("mushaf-mode") as "image" | "text") || "image");
  const [page, setPage] = useState(() => { const p = pageParam ? parseInt(pageParam) : parseInt(localStorage.getItem("mushaf-page") || "1"); return Math.max(1, Math.min(p, TOTAL_PAGES)); });
  const [loading, setLoading] = useState(false);
  const [textData, setTextData] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<number[]>(() => { try { return JSON.parse(localStorage.getItem("mushaf-bookmarks") || "[]"); } catch { return []; } });
  const [imgError, setImgError] = useState(false);

  useEffect(() => { localStorage.setItem("mushaf-page", String(page)); navigate(`/mushaf/${page}`, { replace: true }); }, [page]);
  useEffect(() => { localStorage.setItem("mushaf-mode", mode); }, [mode]);
  useEffect(() => { if (mode === "text") { setLoading(true); QuranAPI.getPage(page).then((d) => setTextData(d)).catch(() => setTextData(null)).finally(() => setLoading(false)); } }, [page, mode]);

  const toggleBookmark = () => { const updated = bookmarks.includes(page) ? bookmarks.filter((b) => b !== page) : [...bookmarks, page]; setBookmarks(updated); localStorage.setItem("mushaf-bookmarks", JSON.stringify(updated)); };
  const goPage = (p: number) => { if (p >= 1 && p <= TOTAL_PAGES) { setPage(p); setImgError(false); } };
  const [touchStart, setTouchStart] = useState(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => setTouchStart(e.touches[0].clientX), []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => { const diff = touchStart - e.changedTouches[0].clientX; if (Math.abs(diff) > 60) { if (diff > 0) goPage(page + 1); else goPage(page - 1); } }, [touchStart, page]);

  return (
    <div className="px-4 py-4" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="flex items-center gap-2 mb-4 animate-fade-in">
        <div className="flex flex-1 bg-card rounded-xl p-1 border border-gold/10">
          <button onClick={() => setMode("image")} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${mode === "image" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t("mushaf.image")}</button>
          <button onClick={() => setMode("text")} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${mode === "text" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t("mushaf.text")}</button>
        </div>
        <button onClick={toggleBookmark} className={`w-10 h-10 rounded-xl border transition-smooth flex items-center justify-center ${bookmarks.includes(page) ? "bg-primary/20 border-gold/30 text-gold" : "bg-card border-gold/10 text-muted-foreground"}`}>{bookmarks.includes(page) ? "🔖" : "📑"}</button>
      </div>
      <div className="text-center mb-3"><span className="text-xs text-muted-foreground">{t("mushaf.pageOf")} {page} {t("common.of")} {TOTAL_PAGES}</span></div>
      {mode === "image" ? (
        <div className="rounded-2xl overflow-hidden border border-gold/10 shadow-gold bg-card min-h-[400px] flex items-center justify-center">
          {imgError ? <div className="text-center py-12"><p className="text-muted-foreground text-sm mb-2">{t("mushaf.failedLoad")}</p><button onClick={() => setImgError(false)} className="text-gold text-sm underline">{t("common.retry")}</button></div> : <img src={QuranAPI.getMushafPageImage(page)} alt={`Quran Page ${page}`} className="w-full" onError={() => setImgError(true)} loading="lazy" />}
        </div>
      ) : loading ? <LoadingSpinner /> : textData ? (
        <div className="rounded-2xl p-4 bg-card border border-gold/10 shadow-gold" dir="rtl">
          <div className="font-arabic text-arabic text-lg leading-[2.4] text-center">{textData.ayahs?.map((a: any) => <span key={a.number}>{a.text}{" "}<span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-gold text-[10px] align-middle mx-1">{a.numberInSurah}</span>{" "}</span>)}</div>
        </div>
      ) : <div className="text-center py-12 text-muted-foreground">{t("mushaf.noData")}</div>}
      <div className="flex items-center justify-between mt-4 gap-3">
        <button onClick={() => goPage(page - 1)} disabled={page <= 1} className="flex-1 py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm font-medium transition-smooth hover:border-gold/30 disabled:opacity-30">{t("common.prev")}</button>
        <input type="number" min={1} max={TOTAL_PAGES} value={page} onChange={(e) => { const v = parseInt(e.target.value); if (v >= 1 && v <= TOTAL_PAGES) goPage(v); }} className="w-20 text-center py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm focus:outline-none focus:border-gold/40" />
        <button onClick={() => goPage(page + 1)} disabled={page >= TOTAL_PAGES} className="flex-1 py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm font-medium transition-smooth hover:border-gold/30 disabled:opacity-30">{t("common.next")}</button>
      </div>
    </div>
  );
};

export default Mushaf;
