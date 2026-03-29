import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBookmarks, removeBookmark, clearAllBookmarks, type Bookmark } from "@/lib/bookmarks";
import { getContentBookmarks, removeContentBookmark, clearAllContentBookmarks, type ContentBookmark } from "@/lib/contentBookmarks";
import { Bookmark as BookmarkIcon, Trash2, BookOpen, X, Mic, FileText } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

type MainTab = "quran" | "content";

const Bookmarks: React.FC = () => {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const isUrdu = lang === "ur";
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [contentBookmarks, setContentBookmarks] = useState<ContentBookmark[]>([]);
  const [mainTab, setMainTab] = useState<MainTab>("quran");
  const [filter, setFilter] = useState<"all" | "complete" | "para" | "surah">("all");

  useEffect(() => {
    setBookmarks(getBookmarks());
    setContentBookmarks(getContentBookmarks());
  }, []);

  const filtered = filter === "all" ? bookmarks : bookmarks.filter((b) => b.mode === filter);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeBookmark(id);
    setBookmarks(getBookmarks());
    toast(t("bookmarks.removed"));
  };

  const handleRemoveContent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeContentBookmark(id);
    setContentBookmarks(getContentBookmarks());
    toast(isUrdu ? "بک مارک ہٹا دیا" : "Bookmark removed");
  };

  const handleClearAll = () => {
    if (mainTab === "quran") {
      if (bookmarks.length === 0) return;
      clearAllBookmarks();
      setBookmarks([]);
      toast(t("bookmarks.cleared"));
    } else {
      if (contentBookmarks.length === 0) return;
      clearAllContentBookmarks();
      setContentBookmarks([]);
      toast(isUrdu ? "تمام بک مارکس ہٹا دیے" : "All bookmarks cleared");
    }
  };

  const handleNavigate = (b: Bookmark) => {
    if (b.mode === "para" && b.paraNum) {
      navigate(`/para-read/${b.paraNum}`);
    } else if (b.mode === "surah" && b.surahNum) {
      navigate(`/surah-read/${b.surahNum}`);
    } else {
      localStorage.setItem(
        b.style === "indopak" ? "read-quran-indopak-page" : "read-quran-saudi-page",
        String(b.page)
      );
      navigate("/read-quran");
    }
  };

  const handleContentNavigate = (b: ContentBookmark) => {
    // Navigate to Islamic Knowledge with stored nav data
    const params = new URLSearchParams();
    Object.entries(b.navData).forEach(([k, v]) => params.set(k, String(v)));
    navigate(`/islamic-knowledge?${params.toString()}`);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const totalBookmarks = bookmarks.length + contentBookmarks.length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lecture": return <Mic className="w-4 h-4 text-primary" />;
      case "book-pdf": case "book-text": return <FileText className="w-4 h-4 text-primary" />;
      default: return <BookOpen className="w-4 h-4 text-primary" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "lecture": return isUrdu ? "لیکچر" : "Lecture";
      case "book-pdf": return "PDF";
      case "book-text": return isUrdu ? "کتاب" : "Book";
      case "seerat": return isUrdu ? "سیرت" : "Seerat";
      case "seerat-roman": return "Seerat (Roman)";
      default: return type;
    }
  };

  return (
    <div className="px-4 py-4">
      <div className="text-center mb-6 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <BookmarkIcon className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-lg font-bold text-foreground">{t("bookmarks.myBookmarks")}</h1>
        <p className="text-xs text-muted-foreground mt-1">{totalBookmarks} bookmark{totalBookmarks !== 1 ? "s" : ""} {t("bookmarks.saved")}</p>
      </div>

      {/* Main tabs: Quran vs Content */}
      <div className="flex bg-card rounded-xl p-1 border border-primary/10 mb-4 animate-fade-in">
        <button
          onClick={() => setMainTab("quran")}
          className={`flex-1 py-2 text-[11px] font-medium rounded-lg transition-smooth flex items-center justify-center gap-1 ${mainTab === "quran" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          📖 {isUrdu ? "قرآن" : "Quran"} ({bookmarks.length})
        </button>
        <button
          onClick={() => setMainTab("content")}
          className={`flex-1 py-2 text-[11px] font-medium rounded-lg transition-smooth flex items-center justify-center gap-1 ${mainTab === "content" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          📚 {isUrdu ? "مواد" : "Content"} ({contentBookmarks.length})
        </button>
      </div>

      {mainTab === "quran" && (
        <>
          {/* Filter tabs */}
          <div className="flex bg-card rounded-xl p-1 border border-primary/10 mb-4 animate-fade-in">
            {(["all", "complete", "para", "surah"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 text-[11px] font-medium rounded-lg transition-smooth ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                {f === "all" ? t("bookmarks.all") : f === "complete" ? t("bookmarks.quran") : f === "para" ? t("bookmarks.para") : t("bookmarks.surah")}
              </button>
            ))}
          </div>

          {/* Clear all */}
          {bookmarks.length > 0 && (
            <div className="flex justify-end mb-3">
              <button onClick={handleClearAll} className="flex items-center gap-1 text-[11px] text-destructive/70 hover:text-destructive transition-smooth">
                <Trash2 className="w-3 h-3" /> {t("bookmarks.clearAll")}
              </button>
            </div>
          )}

          {/* Quran Bookmark list */}
          {filtered.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{t("bookmarks.noBookmarks")}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{t("bookmarks.longPress")}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 animate-fade-in">
              {filtered.map((b, i) => (
                <button key={b.id} onClick={() => handleNavigate(b)} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-primary/10 hover:border-primary/30 transition-smooth text-left active:scale-[0.98]" style={{ animationDelay: `${i * 0.03}s` }}>
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <BookmarkIcon className="w-4 h-4 text-primary fill-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-foreground">{t("bookmarks.page")} {b.page}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{b.style === "indopak" ? "Indo-Pak" : b.style === "hifz" ? "Hifz Color" : "Uthmani"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.context}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{formatDate(b.createdAt)}</p>
                  </div>
                  <button onClick={(e) => handleRemove(b.id, e)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {mainTab === "content" && (
        <>
          {contentBookmarks.length > 0 && (
            <div className="flex justify-end mb-3">
              <button onClick={handleClearAll} className="flex items-center gap-1 text-[11px] text-destructive/70 hover:text-destructive transition-smooth">
                <Trash2 className="w-3 h-3" /> {isUrdu ? "سب صاف کریں" : "Clear all"}
              </button>
            </div>
          )}

          {contentBookmarks.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{isUrdu ? "کوئی بک مارک نہیں" : "No bookmarks yet"}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{isUrdu ? "کتابوں، لیکچرز اور سیرت میں بک مارک آئیکن دبائیں" : "Tap the bookmark icon in books, lectures & seerat"}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 animate-fade-in">
              {contentBookmarks.map((b, i) => (
                <button key={b.id} onClick={() => handleContentNavigate(b)} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-primary/10 hover:border-primary/30 transition-smooth text-left active:scale-[0.98]" style={{ animationDelay: `${i * 0.03}s` }}>
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-lg">
                    {b.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-foreground truncate">{isUrdu ? b.titleUr : b.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1 shrink-0 ml-1">
                        {getTypeIcon(b.type)} {getTypeLabel(b.type)}
                      </span>
                    </div>
                    {b.subtitle && <p className="text-xs text-muted-foreground mt-0.5 truncate">{b.subtitle}</p>}
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{formatDate(b.createdAt)}</p>
                  </div>
                  <button onClick={(e) => handleRemoveContent(b.id, e)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Bookmarks;
