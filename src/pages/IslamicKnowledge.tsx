import React, { useState, useRef, useEffect } from "react";
import { Search, Star, BookOpen, Mic, GraduationCap, Copy, ChevronRight, ChevronLeft, Play, Pause, Download, Check, FileText, BookOpenCheck } from "lucide-react";
import { ALLAH_NAMES } from "@/data/allahNames";
import { SEERAT_CHAPTERS, type SeeratChapter, type SeeratSection } from "@/data/seeratContent";
import { ISLAMIC_BOOKS, type IslamicBook } from "@/data/islamicBooks";
import { LECTURE_SERIES, type LectureSeries, type LectureItem } from "@/data/islamicLectures";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import localforage from "localforage";

type Tab = "main" | "names" | "seerat" | "books" | "lectures";
type SubView = null | { type: "seerat-chapter"; chapter: SeeratChapter } | { type: "book-read"; book: IslamicBook } | { type: "book-pdf"; book: IslamicBook } | { type: "lecture-series"; series: LectureSeries };

const lectureStore = localforage.createInstance({ name: "islamic_lectures_cache" });

const isAudioDataUrl = (value: unknown): value is string =>
  typeof value === "string" && value.startsWith("data:audio/");

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Invalid file data"));
      }
    };
    reader.onerror = () => reject(new Error("Could not read audio file"));
    reader.readAsDataURL(blob);
  });

const TABS: { id: Tab; icon: React.ReactNode; labelKey: string; emoji: string }[] = [
  { id: "names", icon: <Star className="w-5 h-5 text-primary" />, labelKey: "knowledge.99names", emoji: "⭐" },
  { id: "seerat", icon: <GraduationCap className="w-5 h-5 text-primary" />, labelKey: "knowledge.seerat", emoji: "🕌" },
  { id: "books", icon: <BookOpen className="w-5 h-5 text-primary" />, labelKey: "knowledge.books", emoji: "📚" },
  { id: "lectures", icon: <Mic className="w-5 h-5 text-primary" />, labelKey: "knowledge.lectures", emoji: "🎙️" },
];

const IslamicKnowledge: React.FC = () => {
  const { toast } = useToast();
  const { t, lang } = useI18n();
  const isUrdu = lang === "ur";
  const [tab, setTab] = useState<Tab>("main");
  const [subView, setSubView] = useState<SubView>(null);
  const [nameSearch, setNameSearch] = useState("");

  // Audio player state
  const [playingLecture, setPlayingLecture] = useState<LectureItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Offline state
  const [downloadedLectures, setDownloadedLectures] = useState<Set<string>>(new Set());
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Load downloaded lecture ids on mount + clear invalid cached files
  useEffect(() => {
    let mounted = true;

    const hydrateDownloads = async () => {
      const keys = await lectureStore.keys();
      const validKeys: string[] = [];

      for (const key of keys) {
        const cached = await lectureStore.getItem<unknown>(key);
        if (isAudioDataUrl(cached)) {
          validKeys.push(key);
        } else {
          await lectureStore.removeItem(key);
        }
      }

      if (mounted) {
        setDownloadedLectures(new Set(validKeys));
      }
    };

    hydrateDownloads();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredNames = ALLAH_NAMES.filter((n) => {
    if (!nameSearch) return true;
    const s = nameSearch.toLowerCase();
    return n.arabic.includes(nameSearch) || n.transliteration.toLowerCase().includes(s) || n.english.toLowerCase().includes(s) || n.urdu.includes(nameSearch) || String(n.number).includes(s);
  });

  const copyName = (n: typeof ALLAH_NAMES[0]) => {
    navigator.clipboard.writeText(`${n.arabic}\n${n.transliteration} — ${n.english}\n${n.urdu}`);
    toast({ title: "📋", description: `${n.transliteration} copied` });
  };

  const openTab = (t: Tab) => {
    setTab(t);
    setSubView(null);
    setNameSearch("");
    window.scrollTo(0, 0);
    window.history.pushState({ knowledgeTab: t }, "");
  };

  const openSubView = (sv: SubView) => {
    setSubView(sv);
    window.scrollTo(0, 0);
    window.history.pushState({ knowledgeSubView: true }, "");
  };

  // Handle back button
  useEffect(() => {
    const handlePopState = () => {
      window.scrollTo(0, 0);
      if (subView) {
        setSubView(null);
      } else if (tab !== "main") {
        setTab("main");
        setNameSearch("");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [tab, subView]);

  // Audio player functions
  const playLecture = async (lecture: LectureItem) => {
    if (playingLecture?.id === lecture.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (playingLecture?.id === lecture.id && !isPlaying && audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        toast({ title: "⚠️", description: isUrdu ? "آڈیو چلانے میں مسئلہ" : "Could not play audio" });
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    // IMPORTANT: create + play immediately in user gesture context
    const audio = new Audio(lecture.audioUrl);
    audio.preload = "auto";
    audioRef.current = audio;

    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      setIsPlaying(false);
    };

    try {
      await audio.play();
      setPlayingLecture(lecture);
      setIsPlaying(true);
      return;
    } catch {
      // network source failed, try cached offline source
    }

    const cached = await lectureStore.getItem<unknown>(lecture.id);

    if (isAudioDataUrl(cached)) {
      audio.src = cached;
      try {
        await audio.play();
        setPlayingLecture(lecture);
        setIsPlaying(true);
        return;
      } catch {
        // continue to final error
      }
    } else if (cached !== null) {
      await lectureStore.removeItem(lecture.id);
      setDownloadedLectures((prev) => {
        const next = new Set(prev);
        next.delete(lecture.id);
        return next;
      });
    }

    toast({ title: "⚠️", description: isUrdu ? "آڈیو لوڈ نہیں ہو سکا" : "Could not load audio" });
    setPlayingLecture(null);
    setIsPlaying(false);
  };

  const downloadLecture = async (lecture: LectureItem) => {
    if (downloadedLectures.has(lecture.id)) return;
    setDownloadingId(lecture.id);

    try {
      const resp = await fetch(lecture.audioUrl, { cache: "no-store" });
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const contentType = resp.headers.get("content-type") ?? "";
      if (!contentType.includes("audio")) {
        throw new Error("Invalid audio response type");
      }

      const blob = await resp.blob();
      if (!blob.type.startsWith("audio/")) {
        throw new Error("Invalid audio blob");
      }

      const dataUrl = await blobToDataUrl(blob);
      if (!isAudioDataUrl(dataUrl)) {
        throw new Error("Invalid audio data URL");
      }

      await lectureStore.setItem(lecture.id, dataUrl);
      setDownloadedLectures((prev) => new Set([...prev, lecture.id]));
      toast({ title: "✅", description: isUrdu ? "ڈاؤن لوڈ مکمل" : "Downloaded for offline" });
    } catch {
      toast({ title: "⚠️", description: isUrdu ? "ڈاؤن لوڈ ناکام" : "Download failed" });
    } finally {
      setDownloadingId(null);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const getTitle = () => {
    if (subView) {
      if (subView.type === "seerat-chapter") return isUrdu ? subView.chapter.titleUr : subView.chapter.title;
      if (subView.type === "book-read" || subView.type === "book-pdf") return isUrdu ? subView.book.titleUr : subView.book.title;
      if (subView.type === "lecture-series") return isUrdu ? subView.series.titleUr : subView.series.title;
    }
    if (tab === "main") return t("page.islamicKnowledge");
    const found = TABS.find((item) => item.id === tab);
    return found ? t(found.labelKey) : t("page.islamicKnowledge");
  };

  const showBack = tab !== "main";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky z-20 bg-background/95 backdrop-blur border-b border-border px-4 py-3" style={{ top: "calc(56px + env(safe-area-inset-top, 20px))" }}>
        <div className="flex items-center gap-2">
          {showBack && (
            <button onClick={() => {
              if (subView) setSubView(null);
              else { setTab("main"); setNameSearch(""); }
              window.scrollTo(0, 0);
            }} className="p-1 -ml-1">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          <h1 className="text-lg font-bold text-foreground truncate">{getTitle()}</h1>
        </div>
        {tab === "names" && !subView && (
          <div className="mt-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={nameSearch} onChange={(e) => setNameSearch(e.target.value)} placeholder={isUrdu ? "نام تلاش کریں..." : "Search names..."} className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        )}
      </div>

      {/* Main menu */}
      {tab === "main" && !subView && (
        <div className="px-4 py-4 space-y-3">
          {TABS.map((item) => (
            <button key={item.id} onClick={() => openTab(item.id)} className="w-full text-left px-4 py-4 rounded-2xl bg-card border border-border flex items-center justify-between active:scale-[0.98] transition-all duration-150">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">{item.icon}</div>
                <p className="text-sm font-bold text-foreground">{t(item.labelKey)}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* 99 Names of Allah */}
      {tab === "names" && !subView && (
        <div className="px-4 py-4">
          <p className="text-[10px] text-muted-foreground mb-2">{filteredNames.length} {isUrdu ? "نام" : "names"}</p>
          <div className="space-y-2">
            {filteredNames.map((n) => (
              <div key={n.number} className="rounded-xl bg-card border border-border px-4 py-3 flex items-center gap-3 active:scale-[0.98] transition-all duration-150 cursor-pointer" onClick={() => copyName(n)}>
                <span className="text-[10px] font-bold text-primary bg-primary/10 w-7 h-7 flex items-center justify-center rounded-lg shrink-0">{n.number}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-arabic text-lg text-foreground text-right leading-relaxed" dir="rtl">{n.arabic}</p>
                  <p className="text-xs font-semibold text-primary">{n.transliteration}</p>
                  <p className="text-xs text-muted-foreground">{n.english}</p>
                  <p className="text-xs text-muted-foreground text-right font-urdu" dir="rtl">{n.urdu}</p>
                </div>
                <Copy className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seerat un Nabi - Chapter List */}
      {tab === "seerat" && !subView && (
        <div className="px-4 py-4 space-y-2">
          {SEERAT_CHAPTERS.map((ch) => (
            <button key={ch.id} onClick={() => openSubView({ type: "seerat-chapter", chapter: ch })} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border active:scale-[0.98] transition-all duration-150">
              <span className="text-xl">{ch.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{isUrdu ? ch.titleUr : ch.title}</p>
                <p className="text-[10px] text-muted-foreground">{ch.sections.length} {isUrdu ? "ابواب" : "sections"}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Seerat Chapter Detail */}
      {subView?.type === "seerat-chapter" && (
        <div className="px-4 py-4 space-y-4">
          {subView.chapter.sections.map((sec, i) => (
            <SeeratSectionCard key={i} section={sec} isUrdu={isUrdu} />
          ))}
        </div>
      )}

      {/* Islamic Books - List */}
      {tab === "books" && !subView && (
        <div className="px-4 py-4 space-y-2">
          {ISLAMIC_BOOKS.map((book) => (
            <button key={book.id} onClick={() => openSubView(book.type === "pdf" ? { type: "book-pdf", book } : { type: "book-read", book })} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border active:scale-[0.98] transition-all duration-150">
              <span className="text-xl">{book.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{isUrdu ? book.titleUr : book.title}</p>
                <p className="text-[10px] text-muted-foreground">{isUrdu ? book.authorUr : book.author}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {book.type === "pdf" ? <FileText className="w-3 h-3 text-primary" /> : <BookOpenCheck className="w-3 h-3 text-primary" />}
                  <span className="text-[9px] text-primary font-medium">{book.type === "pdf" ? "PDF" : isUrdu ? "متن" : "Text"}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Book Text Reader */}
      {subView?.type === "book-read" && subView.book.chapters && (
        <div className="px-4 py-4 space-y-3">
          <p className="text-xs text-muted-foreground mb-2">{isUrdu ? subView.book.descriptionUr : subView.book.description}</p>
          {subView.book.chapters.map((ch, i) => (
            <BookChapterCard key={i} chapter={ch} isUrdu={isUrdu} index={i} />
          ))}
        </div>
      )}

      {/* Book PDF Viewer */}
      {subView?.type === "book-pdf" && subView.book.pdfUrl && (
        <div className="px-4 py-4">
          <p className="text-xs text-muted-foreground mb-3">{isUrdu ? subView.book.descriptionUr : subView.book.description}</p>
          <div className="rounded-xl overflow-hidden border border-border bg-card" style={{ height: "calc(100vh - 200px)" }}>
            <iframe
              src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(subView.book.pdfUrl)}`}
              className="w-full h-full"
              title={subView.book.title}
              allowFullScreen
            />
          </div>
          <a href={subView.book.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold active:scale-[0.98] transition-all duration-150">
            <Download className="w-4 h-4" />
            {isUrdu ? "پی ڈی ایف ڈاؤن لوڈ کریں" : "Download PDF"}
          </a>
        </div>
      )}

      {/* Lectures - Series List */}
      {tab === "lectures" && !subView && (
        <div className="px-4 py-4 space-y-2">
          {LECTURE_SERIES.map((series) => (
            <button key={series.id} onClick={() => openSubView({ type: "lecture-series", series })} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border active:scale-[0.98] transition-all duration-150">
              <span className="text-xl">{series.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{isUrdu ? series.titleUr : series.title}</p>
                <p className="text-[10px] text-muted-foreground">{isUrdu ? series.speakerUr : series.speaker} • {series.lectures.length} {isUrdu ? "لیکچرز" : "lectures"}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Lecture Series Detail with Player */}
      {subView?.type === "lecture-series" && (
        <div className="px-4 py-4 space-y-2">
          <p className="text-xs text-muted-foreground mb-3">{isUrdu ? subView.series.descriptionUr : subView.series.description}</p>
          {subView.series.lectures.map((lecture) => {
            const isCurrent = playingLecture?.id === lecture.id;
            const isDownloaded = downloadedLectures.has(lecture.id);
            const isDownloadingThis = downloadingId === lecture.id;
            return (
              <div key={lecture.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 ${isCurrent && isPlaying ? "bg-primary/10 border-primary/30" : "bg-card border-border"}`}>
                <button onClick={() => playLecture(lecture)} className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 active:scale-90 transition-all duration-150">
                  {isCurrent && isPlaying ? <Pause className="w-4 h-4 text-primary" /> : <Play className="w-4 h-4 text-primary ml-0.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{isUrdu ? lecture.titleUr : lecture.title}</p>
                  {isCurrent && isPlaying && <p className="text-[10px] text-primary animate-pulse">{isUrdu ? "چل رہا ہے..." : "Playing..."}</p>}
                </div>
                <button onClick={() => downloadLecture(lecture)} disabled={isDownloaded || isDownloadingThis} className="p-2 rounded-lg active:scale-90 transition-all duration-150 disabled:opacity-50">
                  {isDownloaded ? <Check className="w-4 h-4 text-green-500" /> : isDownloadingThis ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : <Download className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Audio Player */}
      {playingLecture && (
        <div className="fixed bottom-16 left-0 right-0 z-30 px-4 pb-2">
          <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">
            <button onClick={() => playLecture(playingLecture)} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 active:scale-90 transition-all duration-150">
              {isPlaying ? <Pause className="w-5 h-5 text-primary-foreground" /> : <Play className="w-5 h-5 text-primary-foreground ml-0.5" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{isUrdu ? playingLecture.titleUr : playingLecture.title}</p>
              <p className="text-[10px] text-muted-foreground">{isPlaying ? (isUrdu ? "چل رہا ہے" : "Playing") : (isUrdu ? "روکا ہوا" : "Paused")}</p>
            </div>
            <button onClick={() => { audioRef.current?.pause(); audioRef.current = null; setPlayingLecture(null); setIsPlaying(false); }} className="text-[10px] text-muted-foreground px-2 py-1 rounded-lg">✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Seerat Section Card Component
const SeeratSectionCard: React.FC<{ section: SeeratSection; isUrdu: boolean }> = ({ section, isUrdu }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-4 py-3 flex items-center justify-between">
        <p className="text-sm font-bold text-foreground">{isUrdu ? section.headingUr : section.heading}</p>
        <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`} />
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line" dir={isUrdu ? "rtl" : "ltr"}>
            {isUrdu ? section.contentUr : section.content}
          </p>
          {(section.hadithRef || section.hadithRefUr) && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2.5">
              <p className="text-[10px] font-bold text-primary mb-1">📖 {isUrdu ? "حدیث حوالہ" : "Hadith Reference"}</p>
              <p className="text-xs text-foreground/80 leading-relaxed" dir={isUrdu ? "rtl" : "ltr"}>
                {isUrdu ? section.hadithRefUr : section.hadithRef}
              </p>
              {section.source && <p className="text-[9px] text-muted-foreground mt-1">— {section.source}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Book Chapter Card Component
const BookChapterCard: React.FC<{ chapter: { title: string; titleUr: string; content: string; contentUr: string }; isUrdu: boolean; index: number }> = ({ chapter, isUrdu, index }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-4 py-3 flex items-center gap-3">
        <span className="text-[10px] font-bold text-primary bg-primary/10 w-6 h-6 flex items-center justify-center rounded-lg shrink-0">{index + 1}</span>
        <p className="text-sm font-semibold text-foreground flex-1">{isUrdu ? chapter.titleUr : chapter.title}</p>
        <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`} />
      </button>
      {expanded && (
        <div className="px-4 pb-4">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line font-arabic" dir={isUrdu ? "rtl" : "ltr"} style={{ fontFamily: isUrdu ? "'Noto Nastaliq Urdu', serif" : undefined }}>
            {isUrdu ? chapter.contentUr : chapter.content}
          </p>
        </div>
      )}
    </div>
  );
};

export default IslamicKnowledge;
