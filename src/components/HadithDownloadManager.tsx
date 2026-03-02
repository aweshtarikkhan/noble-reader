import React, { useState, useEffect, useRef, useCallback } from "react";
import { Download, CheckCircle2, Loader2, XCircle, DownloadCloud, Pause } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { HADITH_BOOKS, fetchFullBook, type HadithBook } from "@/lib/hadithApi";
import { saveHadithBookOffline, isBookSavedOffline, getOfflineBookIds } from "@/lib/hadithOffline";
import { useToast } from "@/hooks/use-toast";

type BookStatus = "idle" | "downloading" | "done" | "error";

interface BookProgress {
  status: BookStatus;
  progress: number; // 0-100
  editionsDone: number; // 0-3 (arabic, english, urdu)
}

const HadithDownloadManager: React.FC<{ onClose?: () => void; autoStart?: boolean }> = ({ onClose, autoStart = false }) => {
  const { toast } = useToast();
  const [bookProgress, setBookProgress] = useState<Record<string, BookProgress>>({});
  const [bulkRunning, setBulkRunning] = useState(false);
  const abortRef = useRef(false);
  const autoStartedRef = useRef(false);

  useEffect(() => {
    // Initialize status from offline cache
    const init = async () => {
      const saved = await getOfflineBookIds();
      const initial: Record<string, BookProgress> = {};
      HADITH_BOOKS.forEach((b) => {
        initial[b.id] = { status: saved.includes(b.id) ? "done" : "idle", progress: saved.includes(b.id) ? 100 : 0, editionsDone: saved.includes(b.id) ? 3 : 0 };
      });
      setBookProgress(initial);
      
      // Auto-start bulk download if requested and not all done
      if (autoStart && !autoStartedRef.current) {
        const allDone = HADITH_BOOKS.every((b) => saved.includes(b.id));
        if (!allDone) {
          autoStartedRef.current = true;
          // Trigger download after state is set
          setTimeout(() => downloadAllRef.current?.(), 100);
        }
      }
    };
    init();
  }, [autoStart]);

  const downloadBook = useCallback(async (book: HadithBook) => {
    setBookProgress((prev) => ({ ...prev, [book.id]: { status: "downloading", progress: 0, editionsDone: 0 } }));

    try {
      // Download 3 editions sequentially with progress
      const editions = [
        { key: "arabic", edition: book.arabicEdition },
        { key: "english", edition: book.englishEdition },
        { key: "urdu", edition: book.urduEdition },
      ];

      const data: Record<string, any> = {};
      for (let i = 0; i < editions.length; i++) {
        if (abortRef.current) throw new Error("aborted");
        const ed = editions[i];
        data[ed.key] = await fetchFullBook(ed.edition);
        setBookProgress((prev) => ({
          ...prev,
          [book.id]: { status: "downloading", progress: Math.round(((i + 1) / 3) * 100), editionsDone: i + 1 },
        }));
      }

      await saveHadithBookOffline(book.id, data.arabic, data.english, data.urdu);
      setBookProgress((prev) => ({ ...prev, [book.id]: { status: "done", progress: 100, editionsDone: 3 } }));
    } catch (e: any) {
      if (e.message !== "aborted") {
        setBookProgress((prev) => ({ ...prev, [book.id]: { status: "error", progress: 0, editionsDone: 0 } }));
      }
    }
  }, []);

  const downloadAllRef = useRef<(() => void) | null>(null);

  const downloadAll = async () => {
    setBulkRunning(true);
    abortRef.current = false;

    for (const book of HADITH_BOOKS) {
      if (abortRef.current) break;
      const current = bookProgress[book.id];
      if (current?.status === "done") continue;
      await downloadBook(book);
    }

    setBulkRunning(false);
    if (!abortRef.current) {
      toast({ title: "✅ All hadith books saved offline" });
    }
  };

  downloadAllRef.current = downloadAll;

  const stopAll = () => {
    abortRef.current = true;
    setBulkRunning(false);
  };

  const allDone = HADITH_BOOKS.every((b) => bookProgress[b.id]?.status === "done");
  const totalProgress = HADITH_BOOKS.reduce((sum, b) => sum + (bookProgress[b.id]?.progress || 0), 0) / HADITH_BOOKS.length;

  return (
    <div className="space-y-4">
      {/* Overall progress */}
      <div className="rounded-2xl bg-card border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">Offline Hadith Library</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {allDone ? "All books saved offline ✅" : `${Math.round(totalProgress)}% complete`}
            </p>
          </div>
          {!bulkRunning ? (
            <button
              onClick={downloadAll}
              disabled={allDone}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground active:scale-95 transition-smooth disabled:opacity-50"
            >
              <DownloadCloud className="w-4 h-4" />
              {allDone ? "All Saved" : "Download All"}
            </button>
          ) : (
            <button
              onClick={stopAll}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-destructive text-destructive-foreground active:scale-95 transition-smooth"
            >
              <Pause className="w-4 h-4" />
              Stop
            </button>
          )}
        </div>
        {bulkRunning && <Progress value={totalProgress} className="h-2" />}
      </div>

      {/* Per-book progress */}
      <div className="space-y-2">
        {HADITH_BOOKS.map((book) => {
          const bp = bookProgress[book.id] || { status: "idle", progress: 0, editionsDone: 0 };
          return (
            <div key={book.id} className="rounded-xl bg-card border border-border px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{book.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {bp.status === "done" && "Saved offline ✅"}
                    {bp.status === "downloading" && `Downloading edition ${bp.editionsDone + 1}/3...`}
                    {bp.status === "error" && "Failed — tap to retry"}
                    {bp.status === "idle" && "Not downloaded"}
                  </p>
                </div>
                <div className="shrink-0 ml-2">
                  {bp.status === "done" && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  {bp.status === "downloading" && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                  {bp.status === "error" && (
                    <button onClick={() => downloadBook(book)} className="active:scale-90 transition-smooth">
                      <XCircle className="w-5 h-5 text-destructive" />
                    </button>
                  )}
                  {bp.status === "idle" && !bulkRunning && (
                    <button onClick={() => downloadBook(book)} className="active:scale-90 transition-smooth">
                      <Download className="w-5 h-5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
              {bp.status === "downloading" && <Progress value={bp.progress} className="h-1.5 mt-1" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HadithDownloadManager;
