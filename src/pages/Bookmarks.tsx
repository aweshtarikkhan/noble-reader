import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBookmarks, removeBookmark, clearAllBookmarks, type Bookmark } from "@/lib/bookmarks";
import { Bookmark as BookmarkIcon, Trash2, BookOpen, X } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

const Bookmarks: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filter, setFilter] = useState<"all" | "complete" | "para" | "surah">("all");

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const filtered = filter === "all" ? bookmarks : bookmarks.filter((b) => b.mode === filter);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeBookmark(id);
    setBookmarks(getBookmarks());
    toast(t("bookmarks.removed"));
  };

  const handleClearAll = () => {
    if (bookmarks.length === 0) return;
    clearAllBookmarks();
    setBookmarks([]);
    toast(t("bookmarks.cleared"));
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

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="px-4 py-4">
      <div className="text-center mb-6 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <BookmarkIcon className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-lg font-bold text-foreground">{t("bookmarks.myBookmarks")}</h1>
        <p className="text-xs text-muted-foreground mt-1">{bookmarks.length} bookmark{bookmarks.length !== 1 ? "s" : ""} {t("bookmarks.saved")}</p>
      </div>

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
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 text-[11px] text-destructive/70 hover:text-destructive transition-smooth"
          >
            <Trash2 className="w-3 h-3" /> {t("bookmarks.clearAll")}
          </button>
        </div>
      )}

      {/* Bookmark list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{t("bookmarks.noBookmarks")}</p>
          <p className="text-xs text-muted-foreground/60 mt-1">{t("bookmarks.longPress")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 animate-fade-in">
          {filtered.map((b, i) => (
            <button
              key={b.id}
              onClick={() => handleNavigate(b)}
              className="flex items-center gap-3 p-4 rounded-xl bg-card border border-primary/10 hover:border-primary/30 transition-smooth text-left active:scale-[0.98]"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <BookmarkIcon className="w-4 h-4 text-primary fill-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-foreground">{t("bookmarks.page")} {b.page}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    {b.style === "indopak" ? "Indo-Pak" : "Uthmani"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{b.context}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{formatDate(b.createdAt)}</p>
              </div>
              <button
                onClick={(e) => handleRemove(b.id, e)}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
