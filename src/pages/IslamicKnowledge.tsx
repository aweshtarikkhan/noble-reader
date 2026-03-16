import React, { useState, useRef, useEffect, useCallback } from "react";
import BookPageViewer from "@/components/BookPageViewer";
import { useSearchParams } from "react-router-dom";
import { Search, Star, BookOpen, Mic, GraduationCap, Copy, ChevronRight, ChevronLeft, Play, Pause, Download, Check, FileText, BookOpenCheck, Languages, Bookmark as BookmarkIcon, RotateCcw, Hash, X } from "lucide-react";
import { toggleContentBookmark, isContentBookmarked } from "@/lib/contentBookmarks";
import { toast as sonnerToast } from "sonner";
import { ALLAH_NAMES } from "@/data/allahNames";
import { SEERAT_CHAPTERS, SEERAT_BOOK_CREDITS, type SeeratChapter, type SeeratSection } from "@/data/seeratContent";
import { SEERAT_ROMAN_CHAPTERS, SEERAT_ROMAN_BOOK_CREDITS, type SeeratRomanChapter } from "@/data/seeratRomanContent";
import { ISLAMIC_BOOKS, type IslamicBook } from "@/data/islamicBooks";
import { LECTURE_SERIES, type LectureSeries, type LectureItem } from "@/data/islamicLectures";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import localforage from "localforage";

type Tab = "main" | "names" | "seerat" | "books" | "lectures";
type SeeratLang = "english" | "roman";
type SubView = null | { type: "seerat-chapter"; chapter: SeeratChapter } | { type: "seerat-roman-chapter"; chapter: SeeratRomanChapter } | { type: "book-read"; book: IslamicBook } | { type: "book-pdf"; book: IslamicBook } | { type: "lecture-series"; series: LectureSeries };

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>("main");
  const [subView, setSubView] = useState<SubView>(null);
  const [seeratLang, setSeeratLang] = useState<SeeratLang>(() => (localStorage.getItem("seerat_lang") as SeeratLang) || "english");
  const [nameSearch, setNameSearch] = useState("");

  // Handle bookmark navigation via URL params
  useEffect(() => {
    const navTab = searchParams.get("tab");
    if (!navTab) return;

    if (navTab === "seerat") {
      const chapterId = searchParams.get("chapterId");
      const navLang = searchParams.get("lang") || "english";
      setTab("seerat");
      setSeeratLang(navLang as SeeratLang);
      if (chapterId) {
        if (navLang === "roman") {
          const ch = SEERAT_ROMAN_CHAPTERS.find((c) => c.id === chapterId);
          if (ch) setSubView({ type: "seerat-roman-chapter", chapter: ch });
        } else {
          const ch = SEERAT_CHAPTERS.find((c) => c.id === chapterId);
          if (ch) setSubView({ type: "seerat-chapter", chapter: ch });
        }
      }
    } else if (navTab === "books") {
      const bookId = searchParams.get("bookId");
      setTab("books");
      if (bookId) {
        const book = ISLAMIC_BOOKS.find((b) => b.id === bookId);
        if (book) setSubView(book.type === "pdf" ? { type: "book-pdf", book } : { type: "book-read", book });
      }
    } else if (navTab === "lectures") {
      const seriesId = searchParams.get("seriesId");
      setTab("lectures");
      if (seriesId) {
        const series = LECTURE_SERIES.find((s) => s.id === seriesId);
        if (series) setSubView({ type: "lecture-series", series });
      }
    }
    // Clear params after navigation
    setSearchParams({}, { replace: true });
  }, []);

  // Audio player state
  const [playingLecture, setPlayingLecture] = useState<LectureItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [playingSeriesId, setPlayingSeriesId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playRequestRef = useRef(0);

  // Resume play state
  interface LastPlayed { lectureId: string; seriesId: string; currentTime: number; title: string; titleUr: string; }
  const [lastPlayed, setLastPlayed] = useState<LastPlayed | null>(() => {
    try {
      const raw = localStorage.getItem("audio_last_played");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  // PDF page bookmarks state
  const [pdfPageInput, setPdfPageInput] = useState("");
  const [pdfBookmarkedPages, setPdfBookmarkedPages] = useState<Record<string, number[]>>(() => {
    try {
      const raw = localStorage.getItem("pdf_bookmarked_pages");
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });

  // Offline state
  const [downloadedLectures, setDownloadedLectures] = useState<Set<string>>(new Set());
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingAllSeriesId, setDownloadingAllSeriesId] = useState<string | null>(null);
  const [downloadAllProgress, setDownloadAllProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });

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

  const cacheLectureAudio = async (lecture: LectureItem) => {
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
    setDownloadedLectures((prev) => {
      const next = new Set(prev);
      next.add(lecture.id);
      return next;
    });
  };

  // Save audio position periodically
  const saveAudioPosition = useCallback((lectureId: string, seriesId: string, title: string, titleUr: string) => {
    if (audioRef.current && audioRef.current.currentTime > 0) {
      const data: LastPlayed = { lectureId, seriesId, currentTime: audioRef.current.currentTime, title, titleUr };
      localStorage.setItem("audio_last_played", JSON.stringify(data));
      setLastPlayed(data);
    }
  }, []);

  // Audio player functions
  const playLecture = async (lecture: LectureItem, resumeTime?: number) => {
    const requestId = ++playRequestRef.current;

    if (playingLecture?.id === lecture.id && isPlaying) {
      audioRef.current?.pause();
      // Save position on pause
      if (playingSeriesId) saveAudioPosition(lecture.id, playingSeriesId, lecture.title, lecture.titleUr);
      setIsPlaying(false);
      return;
    }

    if (playingLecture?.id === lecture.id && !isPlaying && audioRef.current) {
      try {
        await audioRef.current.play();
        if (requestId !== playRequestRef.current) return;
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

    const audio = new Audio();
    audio.preload = "auto";
    audio.playbackRate = playbackRate;
    audioRef.current = audio;
    void audio.play().catch(() => {});

    // Save position every 5 seconds
    let saveInterval: ReturnType<typeof setInterval> | null = null;

    audio.onended = () => {
      if (saveInterval) clearInterval(saveInterval);
      if (requestId === playRequestRef.current) {
        setIsPlaying(false);
        // Clear last played on completion
        localStorage.removeItem("audio_last_played");
        setLastPlayed(null);
      }
    };

    audio.onerror = () => {
      if (saveInterval) clearInterval(saveInterval);
      if (requestId === playRequestRef.current) {
        setIsPlaying(false);
      }
    };

    const cached = await lectureStore.getItem<unknown>(lecture.id);
    if (requestId !== playRequestRef.current) return;

    const sources: string[] = [];

    if (isAudioDataUrl(cached)) {
      sources.push(cached);
    } else if (cached !== null) {
      await lectureStore.removeItem(lecture.id);
      setDownloadedLectures((prev) => {
        const next = new Set(prev);
        next.delete(lecture.id);
        return next;
      });
    }

    sources.push(lecture.audioUrl);

    let lastError: unknown = null;

    for (const src of sources) {
      audio.src = src;
      try {
        await audio.play();
        if (requestId !== playRequestRef.current) return;
        // Restore resume position
        if (resumeTime && resumeTime > 0) {
          audio.currentTime = resumeTime;
        }
        setPlayingLecture(lecture);
        setIsPlaying(true);
        // Start saving position
        const currentSeriesId = subView?.type === "lecture-series" ? subView.series.id : (playingSeriesId || "");
        setPlayingSeriesId(currentSeriesId);
        saveInterval = setInterval(() => {
          saveAudioPosition(lecture.id, currentSeriesId, lecture.title, lecture.titleUr);
        }, 5000);
        return;
      } catch (error) {
        lastError = error;
      }
    }

    if (requestId !== playRequestRef.current) return;

    if (lastError instanceof DOMException && (lastError.name === "AbortError" || lastError.name === "NotAllowedError")) {
      return;
    }

    toast({ title: "⚠️", description: isUrdu ? "آڈیو لوڈ نہیں ہو سکا" : "Could not load audio" });
    setPlayingLecture(null);
    setIsPlaying(false);
  };

  // Resume last played lecture
  const resumeLastPlayed = () => {
    if (!lastPlayed) return;
    // Find the lecture across all series
    for (const series of LECTURE_SERIES) {
      const lecture = series.lectures.find((l) => l.id === lastPlayed.lectureId);
      if (lecture) {
        setPlayingSeriesId(series.id);
        playLecture(lecture, lastPlayed.currentTime);
        return;
      }
    }
    sonnerToast(isUrdu ? "لیکچر نہیں ملا" : "Lecture not found");
  };

  // PDF page bookmark helpers
  const bookmarkPdfPage = (bookId: string, page: number) => {
    const updated = { ...pdfBookmarkedPages };
    if (!updated[bookId]) updated[bookId] = [];
    if (updated[bookId].includes(page)) {
      updated[bookId] = updated[bookId].filter((p) => p !== page);
      sonnerToast(isUrdu ? "صفحہ بک مارک ہٹا دیا" : "Page bookmark removed");
    } else {
      updated[bookId].push(page);
      updated[bookId].sort((a, b) => a - b);
      sonnerToast(isUrdu ? "صفحہ بک مارک ہو گیا" : "Page bookmarked!");
    }
    setPdfBookmarkedPages(updated);
    localStorage.setItem("pdf_bookmarked_pages", JSON.stringify(updated));
  };

  const jumpToPdfPage = (pdfUrl: string, page: number) => {
    window.open(`${pdfUrl}#page=${page}`, "_blank", "noopener,noreferrer");
  };

  const downloadLecture = async (lecture: LectureItem) => {
    if (downloadedLectures.has(lecture.id) || downloadingAllSeriesId) return;
    setDownloadingId(lecture.id);

    try {
      await cacheLectureAudio(lecture);
      toast({ title: "✅", description: isUrdu ? "ڈاؤن لوڈ مکمل" : "Downloaded for offline" });
    } catch {
      toast({ title: "⚠️", description: isUrdu ? "ڈاؤن لوڈ ناکام" : "Download failed" });
    } finally {
      setDownloadingId(null);
    }
  };

  const downloadAllLectures = async (series: LectureSeries) => {
    if (downloadingAllSeriesId) return;

    const pendingLectures = series.lectures.filter((lecture) => !downloadedLectures.has(lecture.id));
    if (pendingLectures.length === 0) {
      toast({ title: "✅", description: isUrdu ? "تمام ابواب پہلے سے ڈاؤن لوڈ ہیں" : "All chapters are already downloaded" });
      return;
    }

    setDownloadingAllSeriesId(series.id);
    setDownloadAllProgress({ done: 0, total: pendingLectures.length });

    let successCount = 0;

    for (const lecture of pendingLectures) {
      try {
        await cacheLectureAudio(lecture);
        successCount += 1;
      } catch {
        // continue remaining downloads
      } finally {
        setDownloadAllProgress((prev) => ({ ...prev, done: Math.min(prev.done + 1, prev.total) }));
      }
    }

    if (successCount === pendingLectures.length) {
      toast({ title: "✅", description: isUrdu ? "تمام ابواب ڈاؤن لوڈ ہو گئے" : "All chapters downloaded" });
    } else {
      toast({
        title: "⚠️",
        description: isUrdu
          ? `${successCount} / ${pendingLectures.length} ابواب ڈاؤن لوڈ ہوئے`
          : `${successCount}/${pendingLectures.length} chapters downloaded`,
      });
    }

    setDownloadingAllSeriesId(null);
    setDownloadAllProgress({ done: 0, total: 0 });
  };

  // Cleanup audio on unmount - save position
  useEffect(() => {
    return () => {
      playRequestRef.current += 1;
      if (audioRef.current && playingLecture && playingSeriesId) {
        saveAudioPosition(playingLecture.id, playingSeriesId, playingLecture.title, playingLecture.titleUr);
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [playingLecture, playingSeriesId, saveAudioPosition]);

  const getTitle = () => {
    if (subView) {
      if (subView.type === "seerat-chapter") return isUrdu ? subView.chapter.titleUr : subView.chapter.title;
      if (subView.type === "seerat-roman-chapter") return subView.chapter.title;
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
          {/* Quick shortcuts to Hadith and Duas */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <button onClick={() => window.location.hash = "#/hadith"} className="text-left px-4 py-4 rounded-2xl bg-primary/5 border-2 border-primary/25 flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-all duration-150">
              <div className="text-2xl">📖</div>
              <p className="text-xs font-bold text-foreground text-center">{isUrdu ? "حدیث" : "Hadith"}</p>
            </button>
            <button onClick={() => window.location.hash = "#/duas"} className="text-left px-4 py-4 rounded-2xl bg-primary/5 border-2 border-primary/25 flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-all duration-150">
              <div className="text-2xl">🤲</div>
              <p className="text-xs font-bold text-foreground text-center">{isUrdu ? "دعائیں" : "Duas"}</p>
            </button>
          </div>

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
        <div className="px-4 py-4 space-y-3">
          {/* Language Toggle */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/50 border border-border">
            <button onClick={() => { setSeeratLang("english"); localStorage.setItem("seerat_lang", "english"); }}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${seeratLang === "english" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}>
              <Languages className="w-3.5 h-3.5" /> English
            </button>
            <button onClick={() => { setSeeratLang("roman"); localStorage.setItem("seerat_lang", "roman"); }}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${seeratLang === "roman" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}>
              <Languages className="w-3.5 h-3.5" /> Roman Urdu
            </button>
          </div>

          {seeratLang === "english" ? (
            SEERAT_CHAPTERS.map((ch) => (
              <button key={ch.id} onClick={() => openSubView({ type: "seerat-chapter", chapter: ch })} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border active:scale-[0.98] transition-all duration-150">
                <span className="text-xl">{ch.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{isUrdu ? ch.titleUr : ch.title}</p>
                  <p className="text-[10px] text-muted-foreground">{ch.sections.length} {isUrdu ? "ابواب" : "sections"}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))
          ) : (
            SEERAT_ROMAN_CHAPTERS.map((ch) => (
              <button key={ch.id} onClick={() => openSubView({ type: "seerat-roman-chapter", chapter: ch })} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border active:scale-[0.98] transition-all duration-150">
                <span className="text-xl">{ch.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{ch.title}</p>
                  <p className="text-[10px] text-muted-foreground">{ch.titleEn}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))
          )}
        </div>
      )}

      {/* Seerat Chapter Detail (English) */}
      {subView?.type === "seerat-chapter" && (
        <div className="px-4 py-4 space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                const added = toggleContentBookmark({
                  type: "seerat",
                  contentId: subView.chapter.id,
                  title: subView.chapter.title,
                  titleUr: subView.chapter.titleUr,
                  icon: subView.chapter.icon,
                  navData: { tab: "seerat", chapterId: subView.chapter.id, lang: "english" },
                });
                sonnerToast(added ? (isUrdu ? "بک مارک شامل ہو گیا" : "Bookmarked!") : (isUrdu ? "بک مارک ہٹا دیا" : "Bookmark removed"));
              }}
              className="p-2 rounded-lg active:scale-90 transition-all"
            >
              <BookmarkIcon className={`w-5 h-5 ${isContentBookmarked("seerat", subView.chapter.id) ? "text-primary fill-primary" : "text-muted-foreground"}`} />
            </button>
          </div>
          {subView.chapter.sections.map((sec, i) => (
            <SeeratSectionCard key={i} section={sec} isUrdu={isUrdu} />
          ))}
          <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 mt-6">
            <p className="text-[10px] font-bold text-primary mb-1">📚 {isUrdu ? "ماخذ" : "Source"}</p>
            <p className="text-xs font-semibold text-foreground">{isUrdu ? SEERAT_BOOK_CREDITS.titleUr : SEERAT_BOOK_CREDITS.title}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{isUrdu ? SEERAT_BOOK_CREDITS.authorsUr : SEERAT_BOOK_CREDITS.authors}</p>
            <p className="text-[10px] text-muted-foreground">{isUrdu ? SEERAT_BOOK_CREDITS.editionUr : SEERAT_BOOK_CREDITS.edition}</p>
            <p className="text-[10px] text-muted-foreground">{isUrdu ? "نظرثانی:" : "Reviewed by:"} {isUrdu ? SEERAT_BOOK_CREDITS.reviewerUr : SEERAT_BOOK_CREDITS.reviewer}</p>
          </div>
        </div>
      )}

      {/* Seerat Chapter Detail (Roman Urdu) */}
      {subView?.type === "seerat-roman-chapter" && (
        <div className="px-4 py-4 space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                const added = toggleContentBookmark({
                  type: "seerat-roman",
                  contentId: subView.chapter.id,
                  title: subView.chapter.title,
                  titleUr: subView.chapter.title,
                  icon: subView.chapter.icon,
                  navData: { tab: "seerat", chapterId: subView.chapter.id, lang: "roman" },
                });
                sonnerToast(added ? "Bookmarked!" : "Bookmark removed");
              }}
              className="p-2 rounded-lg active:scale-90 transition-all"
            >
              <BookmarkIcon className={`w-5 h-5 ${isContentBookmarked("seerat-roman", subView.chapter.id) ? "text-primary fill-primary" : "text-muted-foreground"}`} />
            </button>
          </div>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
            {subView.chapter.content}
          </p>
          <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 mt-6">
            <p className="text-[10px] font-bold text-primary mb-1">📚 Source</p>
            <p className="text-xs font-semibold text-foreground">{SEERAT_ROMAN_BOOK_CREDITS.title}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{SEERAT_ROMAN_BOOK_CREDITS.author}</p>
            <p className="text-[10px] text-muted-foreground">{SEERAT_ROMAN_BOOK_CREDITS.publisher} ({SEERAT_ROMAN_BOOK_CREDITS.edition})</p>
            <p className="text-[10px] text-muted-foreground">ISBN: {SEERAT_ROMAN_BOOK_CREDITS.isbn}</p>
            <p className="text-[10px] text-muted-foreground/70 mt-1 italic">{SEERAT_ROMAN_BOOK_CREDITS.note}</p>
          </div>
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
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">{isUrdu ? subView.book.descriptionUr : subView.book.description}</p>
            <button
              onClick={() => {
                const added = toggleContentBookmark({
                  type: "book-text",
                  contentId: subView.book.id,
                  title: subView.book.title,
                  titleUr: subView.book.titleUr,
                  icon: subView.book.icon,
                  navData: { tab: "books", bookId: subView.book.id },
                });
                sonnerToast(added ? (isUrdu ? "بک مارک شامل ہو گیا" : "Bookmarked!") : (isUrdu ? "بک مارک ہٹا دیا" : "Bookmark removed"));
              }}
              className="p-2 rounded-lg active:scale-90 transition-all shrink-0"
            >
              <BookmarkIcon className={`w-5 h-5 ${isContentBookmarked("book-text", subView.book.id) ? "text-primary fill-primary" : "text-muted-foreground"}`} />
            </button>
          </div>
          {subView.book.chapters.map((ch, i) => (
            <BookChapterCard key={i} chapter={ch} isUrdu={isUrdu} index={i} />
          ))}
        </div>
      )}

      {/* Book PDF Viewer */}
      {subView?.type === "book-pdf" && subView.book.pdfUrl && (
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">{isUrdu ? subView.book.descriptionUr : subView.book.description}</p>
            <button
              onClick={() => {
                const added = toggleContentBookmark({
                  type: "book-pdf",
                  contentId: subView.book.id,
                  title: subView.book.title,
                  titleUr: subView.book.titleUr,
                  icon: subView.book.icon,
                  navData: { tab: "books", bookId: subView.book.id },
                });
                sonnerToast(added ? (isUrdu ? "بک مارک شامل ہو گیا" : "Bookmarked!") : (isUrdu ? "بک مارک ہٹا دیا" : "Bookmark removed"));
              }}
              className="p-2 rounded-lg active:scale-90 transition-all shrink-0"
            >
              <BookmarkIcon className={`w-5 h-5 ${isContentBookmarked("book-pdf", subView.book.id) ? "text-primary fill-primary" : "text-muted-foreground"}`} />
            </button>
          </div>

          {/* Jump to Page & Bookmark Page Controls */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                value={pdfPageInput}
                onChange={(e) => setPdfPageInput(e.target.value)}
                placeholder={isUrdu ? "صفحہ نمبر..." : "Page no..."}
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={() => {
                  const page = parseInt(pdfPageInput);
                  if (page > 0) jumpToPdfPage(subView.book.pdfUrl!, page);
                  else sonnerToast(isUrdu ? "درست صفحہ نمبر درج کریں" : "Enter a valid page number");
                }}
                className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium active:scale-95 transition-all flex items-center gap-1"
              >
                <Hash className="w-3 h-3" />
                {isUrdu ? "جائیں" : "Go"}
              </button>
              <button
                onClick={() => {
                  const page = parseInt(pdfPageInput);
                  if (page > 0) bookmarkPdfPage(subView.book.id, page);
                  else sonnerToast(isUrdu ? "پہلے صفحہ نمبر درج کریں" : "Enter page number first");
                }}
                className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-xs font-medium active:scale-95 transition-all flex items-center gap-1 text-foreground"
              >
                <BookmarkIcon className="w-3 h-3" />
                {isUrdu ? "محفوظ" : "Save"}
              </button>
            </div>
          </div>

          {/* Saved Page Bookmarks */}
          {pdfBookmarkedPages[subView.book.id]?.length > 0 && (
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">{isUrdu ? "محفوظ صفحات:" : "Saved pages:"}</span>
              {pdfBookmarkedPages[subView.book.id].map((page) => (
                <button
                  key={page}
                  onClick={() => jumpToPdfPage(subView.book.pdfUrl!, page)}
                  className="group relative px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium active:scale-90 transition-all flex items-center gap-1"
                >
                  📄 {page}
                  <span
                    onClick={(e) => { e.stopPropagation(); bookmarkPdfPage(subView.book.id, page); }}
                    className="text-muted-foreground hover:text-destructive ml-0.5"
                  >
                    ×
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="rounded-xl overflow-hidden border border-border bg-card" style={{ height: "calc(100vh - 300px)" }}>
            <iframe
              src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(subView.book.pdfUrl)}`}
              className="w-full h-full"
              title={subView.book.title}
              allowFullScreen
            />
          </div>
          {subView.book.sizeWarning && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-xs text-destructive font-medium">{isUrdu ? subView.book.sizeWarningUr : subView.book.sizeWarning}</p>
            </div>
          )}
          <a href={subView.book.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold active:scale-[0.98] transition-all duration-150">
            <Download className="w-4 h-4" />
            {isUrdu ? "پی ڈی ایف ڈاؤن لوڈ کریں" : "Download PDF"}
          </a>
        </div>
      )}

      {/* Lectures - Series List */}
      {tab === "lectures" && !subView && (
        <div className="px-4 py-4 space-y-2">
          {/* Resume Last Played */}
          {lastPlayed && !playingLecture && (
            <button
              onClick={resumeLastPlayed}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/30 active:scale-[0.98] transition-all duration-150 mb-2"
            >
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-bold text-primary">{isUrdu ? "آخری سنا ہوا جاری رکھیں" : "Resume Last Played"}</p>
                <p className="text-[10px] text-foreground truncate">{isUrdu ? lastPlayed.titleUr : lastPlayed.title}</p>
                <p className="text-[9px] text-muted-foreground">{Math.floor(lastPlayed.currentTime / 60)}:{String(Math.floor(lastPlayed.currentTime % 60)).padStart(2, "0")} {isUrdu ? "پر" : "at"}</p>
              </div>
              <Play className="w-4 h-4 text-primary shrink-0" />
            </button>
          )}
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
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">{isUrdu ? subView.series.descriptionUr : subView.series.description}</p>
            <button
              onClick={() => {
                const added = toggleContentBookmark({
                  type: "lecture",
                  contentId: subView.series.id,
                  title: subView.series.title,
                  titleUr: subView.series.titleUr,
                  icon: subView.series.icon,
                  navData: { tab: "lectures", seriesId: subView.series.id },
                });
                sonnerToast(added ? (isUrdu ? "بک مارک شامل ہو گیا" : "Bookmarked!") : (isUrdu ? "بک مارک ہٹا دیا" : "Bookmark removed"));
              }}
              className="p-2 rounded-lg active:scale-90 transition-all shrink-0"
            >
              <BookmarkIcon className={`w-5 h-5 ${isContentBookmarked("lecture", subView.series.id) ? "text-primary fill-primary" : "text-muted-foreground"}`} />
            </button>
          </div>

          <button
            onClick={() => downloadAllLectures(subView.series)}
            disabled={downloadingAllSeriesId === subView.series.id}
            className="w-full mb-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-150 disabled:opacity-70"
          >
            {downloadingAllSeriesId === subView.series.id ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/70 border-t-transparent rounded-full animate-spin" />
                <span>
                  {isUrdu
                    ? `ڈاؤن لوڈ ہو رہا ہے... ${downloadAllProgress.done}/${downloadAllProgress.total}`
                    : `Downloading... ${downloadAllProgress.done}/${downloadAllProgress.total}`}
                </span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{isUrdu ? "تمام ابواب ڈاؤن لوڈ کریں" : "Download all chapters"}</span>
              </>
            )}
          </button>

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
                <button onClick={() => downloadLecture(lecture)} disabled={isDownloaded || isDownloadingThis || downloadingAllSeriesId === subView.series.id} className="p-2 rounded-lg active:scale-90 transition-all duration-150 disabled:opacity-50">
                  {isDownloaded ? <Check className="w-4 h-4 text-primary" /> : isDownloadingThis ? (
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
          <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-lg">
            <div className="flex items-center gap-3">
              <button onClick={() => playLecture(playingLecture)} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 active:scale-90 transition-all duration-150">
                {isPlaying ? <Pause className="w-5 h-5 text-primary-foreground" /> : <Play className="w-5 h-5 text-primary-foreground ml-0.5" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{isUrdu ? playingLecture.titleUr : playingLecture.title}</p>
                <p className="text-[10px] text-muted-foreground">{isPlaying ? (isUrdu ? "چل رہا ہے" : "Playing") : (isUrdu ? "روکا ہوا" : "Paused")}</p>
              </div>
              <button onClick={() => { 
                if (playingLecture && playingSeriesId) saveAudioPosition(playingLecture.id, playingSeriesId, playingLecture.title, playingLecture.titleUr);
                playRequestRef.current += 1; audioRef.current?.pause(); audioRef.current = null; setPlayingLecture(null); setIsPlaying(false); 
              }} className="text-[10px] text-muted-foreground px-2 py-1 rounded-lg">✕</button>
            </div>
            {/* Speed Controls */}
            <div className="flex items-center gap-1.5 mt-2 justify-center">
              <span className="text-[10px] text-muted-foreground mr-1">{isUrdu ? "رفتار:" : "Speed:"}</span>
              {[1, 1.25, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.playbackRate = speed;
                    }
                    setPlaybackRate(speed);
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all duration-150 active:scale-90 ${
                    playbackRate === speed
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
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
