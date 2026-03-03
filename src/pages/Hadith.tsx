import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Share2, BookOpen, ChevronRight, Loader2, Search, ChevronLeft, Save, Check, HardDriveDownload } from "lucide-react";
import { HADITH_BOOKS, fetchBookSections, fetchSection, fetchFullBook, type HadithBook, type HadithEntry, type SectionData } from "@/lib/hadithApi";
import { getHadithBookOffline, saveHadithBookOffline } from "@/lib/hadithOffline";
import { shareAsImage } from "@/lib/shareAsImage";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import HadithDownloadManager from "@/components/HadithDownloadManager";

type ViewState =
  | { type: "books" }
  | { type: "sections"; book: HadithBook; sections: Record<string, string>; sectionDetail: Record<string, any> }
  | { type: "hadiths"; book: HadithBook; sectionNo: number; sectionName: string; hadiths: HadithEntry[]; arabicHadiths: HadithEntry[]; urduHadiths: HadithEntry[] };

const Hadith: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useI18n();
  const [lang, setLang] = useState<"english" | "urdu">(() => (localStorage.getItem("hadith_book_lang") as any) || "english");
  const [view, setView] = useState<ViewState>({ type: "books" });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [savedBooks, setSavedBooks] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("hadith_saved_books") || "[]"); } catch { return []; } });
  const [showDownloadManager, setShowDownloadManager] = useState(false);

  const openBook = useCallback(async (book: HadithBook) => {
    setLoading(true); setSearch(""); window.scrollTo(0, 0);
    try {
      // Try offline first
      const offline = await getHadithBookOffline(book.id);
      if (offline) {
        const src = lang === "urdu" ? offline.urdu : offline.english;
        const sections = src.metadata.section || (src.metadata as any).sections || {};
        const sectionDetail = src.metadata.section_detail || (src.metadata as any).section_details || {};
        setView({ type: "sections", book, sections, sectionDetail });
      } else {
        const edition = lang === "urdu" ? book.urduEdition : book.englishEdition;
        const data = await fetchBookSections(edition);
        setView({ type: "sections", book, sections: data.metadata.section, sectionDetail: data.metadata.section_detail });
      }
    } catch { toast({ title: t("common.error"), description: "Failed to load book.", variant: "destructive" }); }
    setLoading(false);
  }, [lang, toast, t]);

  const openSection = useCallback(async (book: HadithBook, sectionNo: number, sectionName: string) => {
    setLoading(true); setSearch(""); window.scrollTo(0, 0);
    try {
      // Try offline first
      const offline = await getHadithBookOffline(book.id);
      if (offline) {
        const filterBySection = (data: SectionData) => {
          const details = data.metadata.section_detail || (data.metadata as any).section_details || {};
          const detail = details[String(sectionNo)];
          if (!detail) return data.hadiths;
          return data.hadiths.filter((h) => h.hadithnumber >= detail.hadithnumber_first && h.hadithnumber <= detail.hadithnumber_last);
        };
        setView({ type: "hadiths", book, sectionNo, sectionName, hadiths: filterBySection(offline.english), arabicHadiths: filterBySection(offline.arabic), urduHadiths: filterBySection(offline.urdu) });
      } else {
        const [engData, araData, urdData] = await Promise.all([fetchSection(book.englishEdition, sectionNo), fetchSection(book.arabicEdition, sectionNo), fetchSection(book.urduEdition, sectionNo)]);
        setView({ type: "hadiths", book, sectionNo, sectionName, hadiths: engData.hadiths, arabicHadiths: araData.hadiths, urduHadiths: urdData.hadiths });
      }
    } catch { toast({ title: t("common.error"), description: "Failed to load hadiths.", variant: "destructive" }); }
    setLoading(false);
  }, [toast, t]);

  const handleBack = () => { window.scrollTo(0, 0); if (showDownloadManager) { setShowDownloadManager(false); } else if (view.type === "hadiths") openBook(view.book); else if (view.type === "sections") { setView({ type: "books" }); setSearch(""); } else navigate(-1); };

  const handleShareHadith = (eng: HadithEntry, ara: HadithEntry, urd: HadithEntry, bookName: string) => {
    shareAsImage([
      { text: ara.text, font: "bold 26px serif", color: "#d4a843", align: "right" },
      { text: "", font: "14px sans-serif", color: "transparent" },
      { text: urd.text, font: "20px serif", color: "#c8dfd0", align: "right" },
      { text: "", font: "10px sans-serif", color: "transparent" },
      { text: eng.text, font: "15px sans-serif", color: "#a8c8b0" },
      { text: "", font: "14px sans-serif", color: "transparent" },
      { text: `📖 ${bookName} — Hadith ${eng.hadithnumber}`, font: "13px sans-serif", color: "rgba(255,255,255,0.45)", align: "left" },
    ], "#064e3b", 800, toast);
  };

  const handleDownloadBook = async (book: HadithBook) => {
    setDownloading(true);
    try {
      const [engData, araData, urdData] = await Promise.all([fetchFullBook(book.englishEdition), fetchFullBook(book.arabicEdition), fetchFullBook(book.urduEdition)]);
      await saveHadithBookOffline(book.id, araData, engData, urdData);
      const updated = [...new Set([...savedBooks, book.id])]; setSavedBooks(updated); localStorage.setItem("hadith_saved_books", JSON.stringify(updated));
      toast({ title: "✅", description: `${book.name} saved offline — ${engData.hadiths.length} hadiths` });
    } catch { toast({ title: t("common.error"), description: "Download failed.", variant: "destructive" }); }
    setDownloading(false);
  };

  const getTitle = () => { if (showDownloadManager) return "Download Hadith Books"; if (view.type === "books") return t("hadith.books"); if (view.type === "sections") return view.book.name; return view.sectionName; };
  const filteredSections = view.type === "sections" ? Object.entries(view.sections).filter(([, name]) => !search || name.toLowerCase().includes(search.toLowerCase())) : [];
  const filteredHadiths = view.type === "hadiths" ? view.hadiths.filter((h, i) => { if (!search) return true; const s = search.toLowerCase(); const ara = view.arabicHadiths[i]; const urd = view.urduHadiths[i]; return h.text.toLowerCase().includes(s) || ara?.text?.includes(search) || urd?.text?.includes(s) || String(h.hadithnumber).includes(s); }) : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={handleBack} className="active:scale-90 transition-smooth shrink-0"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
            <h1 className="text-lg font-bold text-foreground truncate">{getTitle()}</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {view.type === "books" && !showDownloadManager && (
              <button onClick={() => setShowDownloadManager(true)} className="p-2 rounded-xl bg-primary/10 active:scale-90 transition-smooth">
                <HardDriveDownload className="w-4 h-4 text-primary" />
              </button>
            )}
            {view.type !== "books" && !showDownloadManager && (
              <div className="flex gap-1">
                {(["english", "urdu"] as const).map((l) => (
                  <button key={l} onClick={() => { setLang(l); localStorage.setItem("hadith_book_lang", l); }} className={`text-[9px] px-2 py-0.5 rounded-full font-medium transition-smooth ${lang === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{l === "english" ? "EN" : "UR"}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        {(view.type === "sections" || view.type === "hadiths") && (
          <div className="mt-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={view.type === "sections" ? t("hadith.searchChapters") : t("hadith.searchHadiths")} className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        )}
      </div>

      {loading && <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}

      {showDownloadManager && (
        <div className="px-4 py-4">
          <HadithDownloadManager autoStart onOpenBook={async (book) => { setShowDownloadManager(false); await openBook(book); }} />
        </div>
      )}

      {!loading && !showDownloadManager && view.type === "books" && (
        <div className="px-4 py-4 space-y-3">
          {HADITH_BOOKS.map((book) => (
            <div key={book.id} className="rounded-2xl bg-card border border-border overflow-hidden">
              <button onClick={() => openBook(book)} className="w-full text-left px-4 py-4 flex items-center justify-between active:scale-[0.98] transition-smooth">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><BookOpen className="w-5 h-5 text-primary" /></div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{book.name}</p>
                    <p className="text-[10px] text-muted-foreground">{savedBooks.includes(book.id) ? t("hadith.savedOffline") : t("hadith.tapToBrowse")}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
              <div className="px-4 pb-3 flex gap-2">
                <button onClick={() => handleDownloadBook(book)} disabled={downloading} className="flex items-center gap-1.5 text-[10px] font-semibold text-primary px-3 py-1.5 rounded-lg bg-primary/10 active:scale-95 transition-smooth disabled:opacity-50">
                  {downloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                  {savedBooks.includes(book.id) ? t("hadith.updateOffline") : t("hadith.saveOffline")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !showDownloadManager && view.type === "sections" && (
        <div className="px-4 py-4 space-y-2">
          <p className="text-[10px] text-muted-foreground mb-2">{filteredSections.length} {t("hadith.chapters")}</p>
          {filteredSections.map(([num, name]) => (
            <button key={num} onClick={() => openSection(view.book, Number(num), name)} className="w-full text-left px-4 py-3 rounded-xl bg-card border border-border flex items-center justify-between active:scale-[0.98] transition-smooth">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[10px] font-bold text-primary bg-primary/10 w-7 h-7 flex items-center justify-center rounded-lg shrink-0">{num}</span>
                <p className="text-sm text-foreground truncate">{name}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      )}

      {!loading && !showDownloadManager && view.type === "hadiths" && (
        <div className="px-4 py-4 space-y-3">
          <p className="text-[10px] text-muted-foreground mb-2">{filteredHadiths.length} {t("hadith.hadiths")}</p>
          {filteredHadiths.map((h) => {
            const idx = view.hadiths.indexOf(h); const ara = view.arabicHadiths[idx]; const urd = view.urduHadiths[idx];
            return (
              <div key={h.hadithnumber} className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="px-4 py-3 flex items-start justify-between gap-2 border-b border-border">
                  <span className="text-[10px] font-bold text-primary">#{h.hadithnumber}</span>
                  <button onClick={() => handleShareHadith(h, ara, urd, view.book.name)} className="text-[10px] font-semibold text-primary flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 active:scale-95 transition-smooth shrink-0"><Share2 className="w-3 h-3" />{t("hadith.share")}</button>
                </div>
                {ara && <div className="px-4 pt-3 pb-2"><p className="font-arabic text-lg leading-[2.2] text-foreground text-right" dir="rtl">{ara.text}</p></div>}
                <div className="px-4 pb-3">{lang === "urdu" && urd ? <p className="text-sm text-muted-foreground leading-relaxed text-right font-urdu" dir="rtl">{urd.text}</p> : <p className="text-sm text-muted-foreground leading-relaxed">{h.text}</p>}</div>
                {h.grades && h.grades.length > 0 && <div className="px-4 pb-3 flex flex-wrap gap-1">{h.grades.map((g, gi) => <span key={gi} className="text-[9px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{g.name}: {g.grade}</span>)}</div>}
              </div>
            );
          })}
          {filteredHadiths.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">{t("hadith.noHadiths")}</p>}
        </div>
      )}
    </div>
  );
};

export default Hadith;
