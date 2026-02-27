import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Share2, BookOpen, ChevronRight, Loader2, Search, ChevronLeft, Save, Check } from "lucide-react";
import { HADITH_BOOKS, fetchBookSections, fetchSection, fetchFullBook, type HadithBook, type HadithEntry, type SectionData } from "@/lib/hadithApi";
import { shareAsImage } from "@/lib/shareAsImage";
import { useToast } from "@/hooks/use-toast";

type ViewState =
  | { type: "books" }
  | { type: "sections"; book: HadithBook; sections: Record<string, string>; sectionDetail: Record<string, any> }
  | { type: "hadiths"; book: HadithBook; sectionNo: number; sectionName: string; hadiths: HadithEntry[]; arabicHadiths: HadithEntry[]; urduHadiths: HadithEntry[] };

const Hadith: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lang, setLang] = useState<"english" | "urdu">(() =>
    (localStorage.getItem("hadith_book_lang") as any) || "english"
  );
  const [view, setView] = useState<ViewState>({ type: "books" });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [savedBooks, setSavedBooks] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("hadith_saved_books") || "[]"); } catch { return []; }
  });

  const openBook = useCallback(async (book: HadithBook) => {
    setLoading(true);
    setSearch("");
    try {
      const edition = lang === "urdu" ? book.urduEdition : book.englishEdition;
      const data = await fetchBookSections(edition);
      setView({
        type: "sections",
        book,
        sections: data.metadata.section,
        sectionDetail: data.metadata.section_detail,
      });
    } catch (e) {
      toast({ title: "Error", description: "Failed to load book. Check internet connection.", variant: "destructive" });
    }
    setLoading(false);
  }, [lang, toast]);

  const openSection = useCallback(async (book: HadithBook, sectionNo: number, sectionName: string) => {
    setLoading(true);
    setSearch("");
    try {
      const [engData, araData, urdData] = await Promise.all([
        fetchSection(book.englishEdition, sectionNo),
        fetchSection(book.arabicEdition, sectionNo),
        fetchSection(book.urduEdition, sectionNo),
      ]);
      setView({
        type: "hadiths",
        book,
        sectionNo,
        sectionName,
        hadiths: engData.hadiths,
        arabicHadiths: araData.hadiths,
        urduHadiths: urdData.hadiths,
      });
    } catch (e) {
      toast({ title: "Error", description: "Failed to load hadiths.", variant: "destructive" });
    }
    setLoading(false);
  }, [toast]);

  const handleBack = () => {
    if (view.type === "hadiths") {
      openBook(view.book);
    } else if (view.type === "sections") {
      setView({ type: "books" });
      setSearch("");
    } else {
      navigate(-1);
    }
  };

  const handleShareHadith = (eng: HadithEntry, ara: HadithEntry, urd: HadithEntry, bookName: string) => {
    const translationText = lang === "urdu" ? urd.text : eng.text;
    shareAsImage([
      { text: ara.text, font: "bold 26px serif", color: "#ffffff" },
      { text: "", font: "10px sans-serif", color: "transparent" },
      { text: translationText, font: `17px ${lang === "urdu" ? "serif" : "sans-serif"}`, color: "#d1fae5" },
      { text: "", font: "8px sans-serif", color: "transparent" },
      { text: `📖 ${bookName} — Hadith ${eng.hadithnumber}`, font: "13px sans-serif", color: "rgba(255,255,255,0.5)" },
    ], "#064e3b", 800, toast);
  };

  const handleDownloadBook = async (book: HadithBook) => {
    setDownloading(true);
    try {
      const [engData, araData, urdData] = await Promise.all([
        fetchFullBook(book.englishEdition),
        fetchFullBook(book.arabicEdition),
        fetchFullBook(book.urduEdition),
      ]);

      // Mark as saved
      const updated = [...new Set([...savedBooks, book.id])];
      setSavedBooks(updated);
      localStorage.setItem("hadith_saved_books", JSON.stringify(updated));

      // Also generate downloadable text
      let text = `=== ${book.name} — Noble Quran Reader ===\n\n`;
      engData.hadiths.forEach((eng, i) => {
        const ara = araData.hadiths[i];
        const urd = urdData.hadiths[i];
        text += `--- Hadith ${eng.hadithnumber} ---\n`;
        if (ara) text += `Arabic: ${ara.text}\n`;
        text += `English: ${eng.text}\n`;
        if (urd) text += `Urdu: ${urd.text}\n`;
        text += `\n`;
      });

      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${book.id}-hadiths.txt`;
      a.click();
      URL.revokeObjectURL(url);

      toast({ title: "Downloaded & Cached!", description: `${book.name} — ${engData.hadiths.length} hadiths saved for offline` });
    } catch (e) {
      toast({ title: "Error", description: "Download failed. Check connection.", variant: "destructive" });
    }
    setDownloading(false);
  };

  const getTitle = () => {
    if (view.type === "books") return "Hadith Books";
    if (view.type === "sections") return view.book.name;
    return view.sectionName;
  };

  // Filter sections/hadiths by search
  const filteredSections = view.type === "sections"
    ? Object.entries(view.sections).filter(([, name]) =>
        !search || name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const filteredHadiths = view.type === "hadiths"
    ? view.hadiths.filter((h, i) => {
        if (!search) return true;
        const s = search.toLowerCase();
        const ara = view.arabicHadiths[i];
        const urd = view.urduHadiths[i];
        return h.text.toLowerCase().includes(s) || ara?.text?.includes(search) || urd?.text?.includes(s) || String(h.hadithnumber).includes(s);
      })
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={handleBack} className="active:scale-90 transition-smooth shrink-0">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-bold text-foreground truncate">{getTitle()}</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {view.type !== "books" && (
              <div className="flex gap-1">
                {(["english", "urdu"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); localStorage.setItem("hadith_book_lang", l); }}
                    className={`text-[9px] px-2 py-0.5 rounded-full font-medium transition-smooth ${
                      lang === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {l === "english" ? "EN" : "UR"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search bar for sections & hadiths */}
        {(view.type === "sections" || view.type === "hadiths") && (
          <div className="mt-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={view.type === "sections" ? "Search chapters..." : "Search hadiths..."}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Book List */}
      {!loading && view.type === "books" && (
        <div className="px-4 py-4 space-y-3">
          {HADITH_BOOKS.map((book) => (
            <div key={book.id} className="rounded-2xl bg-card border border-border overflow-hidden">
              <button
                onClick={() => openBook(book)}
                className="w-full text-left px-4 py-4 flex items-center justify-between active:scale-[0.98] transition-smooth"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{book.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {savedBooks.includes(book.id) ? "✅ Saved offline" : "Tap to browse"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
              <div className="px-4 pb-3 flex gap-2">
                <button
                  onClick={() => handleDownloadBook(book)}
                  disabled={downloading}
                  className="flex items-center gap-1.5 text-[10px] font-semibold text-primary px-3 py-1.5 rounded-lg bg-primary/10 active:scale-95 transition-smooth disabled:opacity-50"
                >
                  {downloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                  {savedBooks.includes(book.id) ? "Update Offline" : "Save Offline"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section List */}
      {!loading && view.type === "sections" && (
        <div className="px-4 py-4 space-y-2">
          <p className="text-[10px] text-muted-foreground mb-2">{filteredSections.length} chapters</p>
          {filteredSections.map(([num, name]) => (
            <button
              key={num}
              onClick={() => openSection(view.book, Number(num), name)}
              className="w-full text-left px-4 py-3 rounded-xl bg-card border border-border flex items-center justify-between active:scale-[0.98] transition-smooth"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[10px] font-bold text-primary bg-primary/10 w-7 h-7 flex items-center justify-center rounded-lg shrink-0">{num}</span>
                <p className="text-sm text-foreground truncate">{name}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Hadith List */}
      {!loading && view.type === "hadiths" && (
        <div className="px-4 py-4 space-y-3">
          <p className="text-[10px] text-muted-foreground mb-2">{filteredHadiths.length} hadiths</p>
          {filteredHadiths.map((h) => {
            const idx = view.hadiths.indexOf(h);
            const ara = view.arabicHadiths[idx];
            const urd = view.urduHadiths[idx];

            return (
              <div key={h.hadithnumber} className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="px-4 py-3 flex items-start justify-between gap-2 border-b border-border">
                  <span className="text-[10px] font-bold text-primary">#{h.hadithnumber}</span>
                  <button
                    onClick={() => handleShareHadith(h, ara, urd, view.book.name)}
                    className="text-[10px] font-semibold text-primary flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 active:scale-95 transition-smooth shrink-0"
                  >
                    <Share2 className="w-3 h-3" />
                    Share
                  </button>
                </div>

                {/* Arabic */}
                {ara && (
                  <div className="px-4 pt-3 pb-2">
                    <p className="font-arabic text-lg leading-[2.2] text-foreground text-right" dir="rtl">
                      {ara.text}
                    </p>
                  </div>
                )}

                {/* Translation */}
                <div className="px-4 pb-3">
                  {lang === "urdu" && urd ? (
                    <p className="text-sm text-muted-foreground leading-relaxed text-right font-urdu" dir="rtl">
                      {urd.text}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {h.text}
                    </p>
                  )}
                </div>

                {/* Grades if available */}
                {h.grades && h.grades.length > 0 && (
                  <div className="px-4 pb-3 flex flex-wrap gap-1">
                    {h.grades.map((g, gi) => (
                      <span key={gi} className="text-[9px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        {g.name}: {g.grade}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {filteredHadiths.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-10">No hadiths found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Hadith;
