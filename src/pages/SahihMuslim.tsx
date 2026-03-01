import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Search, ChevronRight, Loader2, Share2, Wifi, WifiOff, CheckCircle2 } from "lucide-react";
import localforage from "localforage";
import { fetchSection, fetchFullBook, type HadithEntry, type SectionData } from "@/lib/hadithApi";
import { shareAsImage } from "@/lib/shareAsImage";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const store = localforage.createInstance({ name: "sahih_muslim_offline", storeName: "hadiths" });

const SAHIH_MUSLIM_CHAPTERS: { no: number; en: string; ar: string }[] = [
  { no: 1, en: "The Book of Faith", ar: "كتاب الإيمان" },
  { no: 2, en: "The Book of Purification", ar: "كتاب الطهارة" },
  { no: 3, en: "The Book of Menstruation", ar: "كتاب الحيض" },
  { no: 4, en: "The Book of Prayers", ar: "كتاب الصلاة" },
  { no: 5, en: "The Book of Mosques and Places of Prayer", ar: "كتاب المساجد ومواضع الصلاة" },
  { no: 6, en: "The Book of Prayer - Travellers", ar: "كتاب صلاة المسافرين وقصرها" },
  { no: 7, en: "The Book of Prayer - Friday", ar: "كتاب الجمعة" },
  { no: 8, en: "The Book of Prayer - Two Eids", ar: "كتاب صلاة العيدين" },
  { no: 9, en: "The Book of Prayer - Rain", ar: "كتاب صلاة الاستسقاء" },
  { no: 10, en: "The Book of Prayer - Eclipse", ar: "كتاب الكسوف" },
  { no: 11, en: "The Book of Prayer - Dead", ar: "كتاب الجنائز" },
  { no: 12, en: "The Book of Zakat", ar: "كتاب الزكاة" },
  { no: 13, en: "The Book of Fasting", ar: "كتاب الصيام" },
  { no: 14, en: "The Book of I'tikaf", ar: "كتاب الاعتكاف" },
  { no: 15, en: "The Book of Pilgrimage", ar: "كتاب الحج" },
  { no: 16, en: "The Book of Marriage", ar: "كتاب النكاح" },
  { no: 17, en: "The Book of Suckling", ar: "كتاب الرضاع" },
  { no: 18, en: "The Book of Divorce", ar: "كتاب الطلاق" },
  { no: 19, en: "The Book of Invoking Curses", ar: "كتاب اللعان" },
  { no: 20, en: "The Book of Emancipating Slaves", ar: "كتاب العتق" },
  { no: 21, en: "The Book of Transactions", ar: "كتاب البيوع" },
  { no: 22, en: "The Book of Musaqah", ar: "كتاب المساقاة" },
  { no: 23, en: "The Book of the Rules of Inheritance", ar: "كتاب الفرائض" },
  { no: 24, en: "The Book of Gifts", ar: "كتاب الهبات" },
  { no: 25, en: "The Book of Wills", ar: "كتاب الوصية" },
  { no: 26, en: "The Book of Vows", ar: "كتاب النذر" },
  { no: 27, en: "The Book of Oaths", ar: "كتاب الأيمان" },
  { no: 28, en: "The Book of Oaths, Muharibin", ar: "كتاب القسامة والمحاربين" },
  { no: 29, en: "The Book of Legal Punishments", ar: "كتاب الحدود" },
  { no: 30, en: "The Book of Judicial Decisions", ar: "كتاب الأقضية" },
  { no: 31, en: "The Book of Lost Property", ar: "كتاب اللقطة" },
  { no: 32, en: "The Book of Jihad and Expeditions", ar: "كتاب الجهاد والسير" },
  { no: 33, en: "The Book on Government", ar: "كتاب الإمارة" },
  { no: 34, en: "The Book of Hunting, Slaughter", ar: "كتاب الصيد والذبائح" },
  { no: 35, en: "The Book of Sacrifices", ar: "كتاب الأضاحي" },
  { no: 36, en: "The Book of Drinks", ar: "كتاب الأشربة" },
  { no: 37, en: "The Book of Clothes and Adornment", ar: "كتاب اللباس والزينة" },
  { no: 38, en: "The Book of Manners and Etiquette", ar: "كتاب الآداب" },
  { no: 39, en: "The Book of Greetings", ar: "كتاب السلام" },
  { no: 40, en: "The Book Concerning the Use of Correct Words", ar: "كتاب الألفاظ من الأدب" },
  { no: 41, en: "The Book of Poetry", ar: "كتاب الشعر" },
  { no: 42, en: "The Book of Visions", ar: "كتاب الرؤيا" },
  { no: 43, en: "The Book of Virtues", ar: "كتاب الفضائل" },
  { no: 44, en: "The Book of the Merits of the Companions", ar: "كتاب فضائل الصحابة" },
  { no: 45, en: "The Book of Virtue, Enjoining Good Manners", ar: "كتاب البر والصلة والآداب" },
  { no: 46, en: "The Book of Destiny", ar: "كتاب القدر" },
  { no: 47, en: "The Book of Knowledge", ar: "كتاب العلم" },
  { no: 48, en: "The Book of Remembrance of Allah", ar: "كتاب الذكر والدعاء" },
  { no: 49, en: "The Book of Heart-Melting Traditions", ar: "كتاب الرقاق" },
  { no: 50, en: "The Book of Repentance", ar: "كتاب التوبة" },
  { no: 51, en: "The Book of the Qualities of the Hypocrites", ar: "كتاب صفات المنافقين" },
  { no: 52, en: "The Book of the Day of Judgement", ar: "كتاب صفة القيامة" },
  { no: 53, en: "The Book of Paradise", ar: "كتاب الجنة وصفة نعيمها" },
  { no: 54, en: "The Book of Tribulations", ar: "كتاب الفتن وأشراط الساعة" },
  { no: 55, en: "The Book of Asceticism", ar: "كتاب الزهد والرقائق" },
  { no: 56, en: "The Book of Commentary", ar: "كتاب التفسير" },
];

type ViewState =
  | { type: "chapters" }
  | { type: "hadiths"; chapterNo: number; chapterName: string; hadiths: HadithEntry[]; arabicHadiths: HadithEntry[]; urduHadiths: HadithEntry[] };

const SahihMuslim: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [view, setView] = useState<ViewState>({ type: "chapters" });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState<"english" | "urdu">(() => (localStorage.getItem("hadith_book_lang") as any) || "english");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [offlineReady, setOfflineReady] = useState(false);
  const [downloadedChapters, setDownloadedChapters] = useState<Set<number>>(new Set());

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  useEffect(() => {
    store.getItem<boolean>("full_download_complete").then((v) => { if (v) setOfflineReady(true); });
    // Check which chapters are downloaded
    store.keys().then((keys) => {
      const chapters = new Set<number>();
      keys.forEach((k) => { const m = k.match(/^chapter_eng_(\d+)$/); if (m) chapters.add(Number(m[1])); });
      setDownloadedChapters(chapters);
    });
  }, []);

  const openChapter = useCallback(async (ch: typeof SAHIH_MUSLIM_CHAPTERS[0]) => {
    setLoading(true);
    setSearch("");
    try {
      // Try offline first
      const engKey = `chapter_eng_${ch.no}`;
      const araKey = `chapter_ara_${ch.no}`;
      const urdKey = `chapter_urd_${ch.no}`;

      const [offEng, offAra, offUrd] = await Promise.all([
        store.getItem<HadithEntry[]>(engKey),
        store.getItem<HadithEntry[]>(araKey),
        store.getItem<HadithEntry[]>(urdKey),
      ]);

      if (offEng && offAra && offUrd) {
        setView({ type: "hadiths", chapterNo: ch.no, chapterName: ch.en, hadiths: offEng, arabicHadiths: offAra, urduHadiths: offUrd });
        setLoading(false);
        return;
      }

      if (!navigator.onLine) {
        toast({ title: "Offline", description: "This chapter is not downloaded yet.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const [engData, araData, urdData] = await Promise.all([
        fetchSection("eng-muslim", ch.no),
        fetchSection("ara-muslim", ch.no),
        fetchSection("urd-muslim", ch.no),
      ]);

      // Cache for offline
      await Promise.all([
        store.setItem(engKey, engData.hadiths),
        store.setItem(araKey, araData.hadiths),
        store.setItem(urdKey, urdData.hadiths),
      ]);
      setDownloadedChapters((prev) => new Set([...prev, ch.no]));

      setView({ type: "hadiths", chapterNo: ch.no, chapterName: ch.en, hadiths: engData.hadiths, arabicHadiths: araData.hadiths, urduHadiths: urdData.hadiths });
    } catch {
      toast({ title: "Error", description: "Failed to load chapter.", variant: "destructive" });
    }
    setLoading(false);
  }, [toast]);

  const handleDownloadAll = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    setDownloadProgress(0);
    try {
      for (let i = 0; i < SAHIH_MUSLIM_CHAPTERS.length; i++) {
        const ch = SAHIH_MUSLIM_CHAPTERS[i];
        const engKey = `chapter_eng_${ch.no}`;
        const existing = await store.getItem(engKey);
        if (existing) {
          setDownloadProgress(Math.round(((i + 1) / SAHIH_MUSLIM_CHAPTERS.length) * 100));
          continue;
        }

        const [engData, araData, urdData] = await Promise.all([
          fetchSection("eng-muslim", ch.no),
          fetchSection("ara-muslim", ch.no),
          fetchSection("urd-muslim", ch.no),
        ]);

        await Promise.all([
          store.setItem(engKey, engData.hadiths),
          store.setItem(`chapter_ara_${ch.no}`, araData.hadiths),
          store.setItem(`chapter_urd_${ch.no}`, urdData.hadiths),
        ]);

        setDownloadedChapters((prev) => new Set([...prev, ch.no]));
        setDownloadProgress(Math.round(((i + 1) / SAHIH_MUSLIM_CHAPTERS.length) * 100));
      }

      await store.setItem("full_download_complete", true);
      setOfflineReady(true);
      toast({ title: "✅ Download Complete", description: "All 56 chapters saved for offline use." });
    } catch {
      toast({ title: "Error", description: "Download interrupted. You can resume later.", variant: "destructive" });
    }
    setDownloading(false);
  }, [downloading, toast]);

  const handleBack = () => {
    if (view.type === "hadiths") { setView({ type: "chapters" }); setSearch(""); }
    else navigate(-1);
  };

  const handleShare = (eng: HadithEntry, ara: HadithEntry, urd: HadithEntry) => {
    shareAsImage([
      { text: ara.text, font: "bold 26px serif", color: "#d4a843", align: "right" },
      { text: "", font: "14px sans-serif", color: "transparent" },
      { text: urd.text, font: "20px serif", color: "#c8dfd0", align: "right" },
      { text: "", font: "10px sans-serif", color: "transparent" },
      { text: eng.text, font: "15px sans-serif", color: "#a8c8b0" },
      { text: "", font: "14px sans-serif", color: "transparent" },
      { text: `📖 Sahih Muslim — Hadith ${eng.hadithnumber}`, font: "13px sans-serif", color: "rgba(255,255,255,0.45)", align: "left" },
    ], "#064e3b", 800, toast);
  };

  const filteredChapters = useMemo(() =>
    SAHIH_MUSLIM_CHAPTERS.filter((ch) => !search || ch.en.toLowerCase().includes(search.toLowerCase()) || ch.ar.includes(search)),
    [search]
  );

  const filteredHadiths = useMemo(() => {
    if (view.type !== "hadiths") return [];
    if (!search) return view.hadiths;
    const s = search.toLowerCase();
    return view.hadiths.filter((h, i) => {
      const ara = view.arabicHadiths[i];
      const urd = view.urduHadiths[i];
      return h.text.toLowerCase().includes(s) || ara?.text?.includes(search) || urd?.text?.toLowerCase().includes(s) || String(h.hadithnumber).includes(s);
    });
  }, [view, search]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={handleBack} className="active:scale-90 transition-all shrink-0">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-foreground truncate">
                {view.type === "chapters" ? "Sahih Muslim" : view.chapterName}
              </h1>
              <div className="flex items-center gap-1.5">
                {isOnline ? <Wifi className="w-3 h-3 text-primary" /> : <WifiOff className="w-3 h-3 text-destructive" />}
                <span className="text-[9px] text-muted-foreground">{isOnline ? "Online" : "Offline"}</span>
                {offlineReady && <CheckCircle2 className="w-3 h-3 text-primary ml-1" />}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {(["english", "urdu"] as const).map((l) => (
              <button key={l} onClick={() => { setLang(l); localStorage.setItem("hadith_book_lang", l); }}
                className={`text-[9px] px-2 py-0.5 rounded-full font-medium transition-all ${lang === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {l === "english" ? "EN" : "UR"}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mt-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={view.type === "chapters" ? "Search chapters..." : "Search hadiths..."}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Chapter List */}
      {!loading && view.type === "chapters" && (
        <div className="px-4 py-4 space-y-3">
          {/* Download All Button */}
          <div className="rounded-2xl bg-card border border-border p-4">
            <button onClick={handleDownloadAll} disabled={downloading || offlineReady}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.97] transition-all disabled:opacity-60">
              {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : offlineReady ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              {downloading ? "Downloading..." : offlineReady ? "All Chapters Saved Offline ✓" : "Download All for Offline Use"}
            </button>
            {downloading && (
              <div className="mt-3 space-y-1">
                <Progress value={downloadProgress} className="h-2" />
                <p className="text-[10px] text-muted-foreground text-center">{downloadProgress}% — {Math.round(downloadProgress * 56 / 100)}/56 chapters</p>
              </div>
            )}
            {!downloading && !offlineReady && (
              <p className="text-[10px] text-muted-foreground text-center mt-2">Download all 56 chapters for reading without internet</p>
            )}
          </div>

          <p className="text-[10px] text-muted-foreground">{filteredChapters.length} chapters</p>

          {filteredChapters.map((ch) => (
            <button key={ch.no} onClick={() => openChapter(ch)}
              className="w-full text-left px-4 py-3 rounded-xl bg-card border border-border flex items-center justify-between active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[10px] font-bold text-primary bg-primary/10 w-8 h-8 flex items-center justify-center rounded-lg shrink-0">{ch.no}</span>
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{ch.en}</p>
                  <p className="text-[11px] text-muted-foreground font-arabic truncate" dir="rtl">{ch.ar}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {downloadedChapters.has(ch.no) && <span className="text-primary text-[8px]">●</span>}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Hadiths */}
      {!loading && view.type === "hadiths" && (
        <div className="px-4 py-4 space-y-3">
          <p className="text-[10px] text-muted-foreground">{filteredHadiths.length} hadiths</p>

          {filteredHadiths.map((h) => {
            const idx = view.hadiths.indexOf(h);
            const ara = view.arabicHadiths[idx];
            const urd = view.urduHadiths[idx];
            return (
              <div key={h.hadithnumber} className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="px-4 py-3 flex items-start justify-between gap-2 border-b border-border">
                  <span className="text-[10px] font-bold text-primary">#{h.hadithnumber}</span>
                  <button onClick={() => handleShare(h, ara, urd)}
                    className="text-[10px] font-semibold text-primary flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 active:scale-95 transition-all shrink-0">
                    <Share2 className="w-3 h-3" /> Share
                  </button>
                </div>
                {ara && (
                  <div className="px-4 pt-3 pb-2">
                    <p className="font-arabic text-lg leading-[2.2] text-foreground text-right" dir="rtl">{ara.text}</p>
                  </div>
                )}
                <div className="px-4 pb-3">
                  {lang === "urdu" && urd
                    ? <p className="text-sm text-muted-foreground leading-relaxed text-right font-urdu" dir="rtl">{urd.text}</p>
                    : <p className="text-sm text-muted-foreground leading-relaxed">{h.text}</p>}
                </div>
                {h.grades && h.grades.length > 0 && (
                  <div className="px-4 pb-3 flex flex-wrap gap-1">
                    {h.grades.map((g, gi) => (
                      <span key={gi} className="text-[9px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{g.name}: {g.grade}</span>
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

export default SahihMuslim;
