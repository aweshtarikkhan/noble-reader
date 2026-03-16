import React, { useState, useRef, useEffect, useCallback } from "react";
import { SURAHS } from "@/data/surahs";
import { Play, Pause, SkipBack, SkipForward, Loader2, Gauge, Download, CheckCircle2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { DR_ISRAR_AUDIO_MAP, DR_ISRAR_BASE_URL } from "@/data/drIsrarAudioMap";
import { FATEH_MUHAMMAD_AUDIO_MAP, FATEH_MUHAMMAD_BASE_URL } from "@/data/fatehMuhammadAudioMap";
import {
  isAudioCached,
  getCachedAudioUrl,
  downloadAndCacheAudio,
  getCachedSurahSet,
  getAudioStorageUsage,
} from "@/lib/audioCache";

type AudioMode = "quran" | "translation";




interface Reciter { id: string; name: string; server: string; subfolder: string; }
interface TranslationAuthor { id: string; name: string; language: string; }

const RECITERS: Reciter[] = [
  { id: "mishary", name: "Mishary Rashid Alafasy", server: "server8", subfolder: "afs" },
];

const URDU_TRANSLATORS: TranslationAuthor[] = [
  { id: "fateh", name: "Fateh Muhammad Jalandhari", language: "Urdu" },
  { id: "drisrar", name: "Dr. Israr Ahmad (Bayan ul Quran)", language: "Urdu" },
  { id: "minshawi", name: "Mohammed Al-Minshawi (Urdu Translation)", language: "Urdu" },
];

const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];
const STORAGE_KEY = "quran_audio_state";

const getQuranAudioUrl = (server: string, subfolder: string, surahNum: number) =>
  `https://${server}.mp3quran.net/${subfolder}/${String(surahNum).padStart(3, "0")}.mp3`;

const getTranslationAudioUrl = (translatorId: string, surahNum: number) => {
  if (translatorId === "fateh") {
    const fileName = FATEH_MUHAMMAD_AUDIO_MAP[surahNum];
    return fileName ? `${FATEH_MUHAMMAD_BASE_URL}${encodeURIComponent(fileName)}?download=1` : "";
  }
  if (translatorId === "drisrar") {
    const fileName = DR_ISRAR_AUDIO_MAP[surahNum];
    return fileName ? `${DR_ISRAR_BASE_URL}${encodeURIComponent(fileName)}` : "";
  }
  if (translatorId === "minshawi") {
    return `https://archive.org/download/mohammed_alminshawi_urdu_translation_mp3_quran/${String(surahNum).padStart(3, "0")}.mp3`;
  }
  return "";
};

const QuranAudio: React.FC = () => {
  const { toast } = useToast();
  const { t } = useI18n();

  const getSavedState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  };

  const savedState = getSavedState();

  const [audioMode, setAudioMode] = useState<AudioMode>(savedState?.audioMode || "quran");
  const [selectedSurah, setSelectedSurah] = useState(savedState?.surah || 1);
  const [selectedReciter, setSelectedReciter] = useState(savedState?.reciter || RECITERS[0].id);
  const [selectedTranslator, setSelectedTranslator] = useState(savedState?.translator || URDU_TRANSLATORS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [search, setSearch] = useState("");
  const [playbackSpeed, setPlaybackSpeed] = useState(savedState?.speed || 1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showTranslatorList, setShowTranslatorList] = useState(false);
  const [showPanjSurah, setShowPanjSurah] = useState(false);
  const [playingPanjSurah, setPlayingPanjSurah] = useState<number | null>(null);
  const [showAyatulKursi, setShowAyatulKursi] = useState(false);
  const [playingAyatulKursi, setPlayingAyatulKursi] = useState<string | null>(null);
  const [showAyatulKursiDurooos, setShowAyatulKursiDurooos] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingPlayRef = useRef(false);
  const pendingSeekRef = useRef<number | null>(savedState?.time || null);

  // Download state
  const [cachedSurahs, setCachedSurahs] = useState<Set<number>>(new Set());
  const [downloadingSurah, setDownloadingSurah] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadTotal, setDownloadTotal] = useState(0);
  const [batchDownloading, setBatchDownloading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [storageUsage, setStorageUsage] = useState(0);
  const abortBatchRef = useRef(false);
  const blobUrlRef = useRef<string | null>(null);

  const reciter = RECITERS.find((r) => r.id === selectedReciter) || RECITERS[0];
  const translator = URDU_TRANSLATORS.find((t) => t.id === selectedTranslator) || URDU_TRANSLATORS[0];
  const surah = SURAHS.find((s) => s.number === selectedSurah)!;

  const currentModeId = audioMode === "quran" ? reciter.id : translator.id;

  const getAudioUrl = useCallback((surahNum: number) => {
    return audioMode === "quran"
      ? getQuranAudioUrl(reciter.server, reciter.subfolder, surahNum)
      : getTranslationAudioUrl(translator.id, surahNum);
  }, [audioMode, reciter, translator]);

  const audioSrc = getAudioUrl(selectedSurah);

  // Load cached surah set and storage usage when mode/id changes
  const refreshStorageUsage = useCallback(() => {
    getAudioStorageUsage().then(setStorageUsage);
  }, []);

  useEffect(() => {
    getCachedSurahSet(audioMode, currentModeId).then(setCachedSurahs);
    refreshStorageUsage();
  }, [audioMode, currentModeId, refreshStorageUsage]);

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  // Save state periodically
  useEffect(() => {
    const saveState = () => {
      const state = {
        audioMode, surah: selectedSurah, reciter: selectedReciter,
        translator: selectedTranslator, time: audioRef.current?.currentTime || 0, speed: playbackSpeed,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    };
    const interval = setInterval(saveState, 2000);
    window.addEventListener("beforeunload", saveState);
    document.addEventListener("visibilitychange", saveState);
    return () => { clearInterval(interval); window.removeEventListener("beforeunload", saveState); document.removeEventListener("visibilitychange", saveState); saveState(); };
  }, [audioMode, selectedSurah, selectedReciter, selectedTranslator, playbackSpeed]);

  // Media Session
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: surah.englishName,
        artist: audioMode === "quran" ? reciter.name : translator.name,
        album: "Quran",
        artwork: [{ src: "/favicon.ico", sizes: "192x192", type: "image/png" }],
      });
      navigator.mediaSession.setActionHandler("play", () => audioRef.current?.play());
      navigator.mediaSession.setActionHandler("pause", () => audioRef.current?.pause());
      navigator.mediaSession.setActionHandler("previoustrack", () => { if (selectedSurah > 1) { pendingPlayRef.current = isPlaying; setSelectedSurah((p) => p - 1); } });
      navigator.mediaSession.setActionHandler("nexttrack", () => { if (selectedSurah < 114) { pendingPlayRef.current = isPlaying; setSelectedSurah((p) => p + 1); } });
    }
  }, [surah, audioMode, reciter, translator, selectedSurah, isPlaying]);

  useEffect(() => { const audio = new Audio(); audio.preload = "auto"; audioRef.current = audio; return () => { audio.pause(); audio.src = ""; audio.load(); }; }, []);

  // Load audio - prefer cached version
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying(false); setIsLoading(true); setProgress(0); setCurrentTime(0); setDuration(0);
    audio.pause();

    // Revoke old blob URL
    if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null; }

    const loadAudio = async () => {
      // Try cached first
      const cachedUrl = await getCachedAudioUrl(audioMode, currentModeId, selectedSurah);
      if (cachedUrl) {
        blobUrlRef.current = cachedUrl;
        audio.src = cachedUrl;
      } else {
        audio.src = audioSrc;
      }
      audio.playbackRate = playbackSpeed;
      audio.load();
    };
    loadAudio();

    const onCanPlay = () => {
      setIsLoading(false); setDuration(audio.duration || 0); audio.playbackRate = playbackSpeed;
      if (pendingSeekRef.current !== null && pendingSeekRef.current > 0) { audio.currentTime = pendingSeekRef.current; pendingSeekRef.current = null; }
      if (pendingPlayRef.current) { pendingPlayRef.current = false; audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false)); }
    };
    const onTimeUpdate = () => { setCurrentTime(audio.currentTime); setDuration(audio.duration || 0); setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0); };
    const onEnded = () => { setIsPlaying(false); if (selectedSurah < 114) { pendingPlayRef.current = true; setSelectedSurah((p) => p + 1); } };
    const onError = () => { setIsLoading(false); setIsPlaying(false); toast({ title: t("common.error"), description: "Could not load audio.", variant: "destructive" }); };
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => { setIsLoading(false); setIsPlaying(true); };
    const onPause = () => setIsPlaying(false);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);

    audio.addEventListener("canplay", onCanPlay); audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded); audio.addEventListener("error", onError);
    audio.addEventListener("waiting", onWaiting); audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause); audio.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => {
      audio.removeEventListener("canplay", onCanPlay); audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded); audio.removeEventListener("error", onError);
      audio.removeEventListener("waiting", onWaiting); audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause); audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [audioSrc, selectedSurah, audioMode, currentModeId, playbackSpeed, toast, t]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current; if (!audio) return;
    if (isPlaying) { audio.pause(); } else {
      setIsLoading(true); audio.play().then(() => setIsPlaying(true)).catch(() => { setIsPlaying(false); toast({ title: t("common.error"), variant: "destructive" }); }).finally(() => setIsLoading(false));
    }
  }, [isPlaying, toast, t]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current; if (!audio || !audio.duration) return;
    const val = parseFloat(e.target.value); const time = (val / 100) * audio.duration;
    audio.currentTime = time; setProgress(val); setCurrentTime(time);
  }, []);

  const handlePrev = useCallback(() => { if (selectedSurah > 1) { pendingPlayRef.current = isPlaying; pendingSeekRef.current = null; setSelectedSurah((p) => p - 1); } }, [selectedSurah, isPlaying]);
  const handleNext = useCallback(() => { if (selectedSurah < 114) { pendingPlayRef.current = isPlaying; pendingSeekRef.current = null; setSelectedSurah((p) => p + 1); } }, [selectedSurah, isPlaying]);
  const selectSurah = useCallback((num: number) => { pendingPlayRef.current = true; pendingSeekRef.current = null; setSelectedSurah(num); setPlayingPanjSurah(null); }, []);
  const changeSpeed = useCallback((speed: number) => { setPlaybackSpeed(speed); if (audioRef.current) audioRef.current.playbackRate = speed; setShowSpeedMenu(false); }, []);

  const formatTime = (t: number) => { if (!t || isNaN(t)) return "0:00"; const m = Math.floor(t / 60); const s = Math.floor(t % 60); return `${m}:${s.toString().padStart(2, "0")}`; };

  // Download single surah
  const downloadSurah = useCallback(async (surahNum: number) => {
    const url = getAudioUrl(surahNum);
    if (!url) return;
    setDownloadingSurah(surahNum);
    setDownloadProgress(0); setDownloadTotal(0);

    const success = await downloadAndCacheAudio(url, audioMode, currentModeId, surahNum, (loaded, total) => {
      setDownloadProgress(loaded); setDownloadTotal(total);
    });

    if (success) {
      setCachedSurahs((prev) => new Set([...prev, surahNum]));
      refreshStorageUsage();
      toast({ title: "✅ Downloaded", description: `Surah ${surahNum} saved offline` });
    } else {
      toast({ title: t("common.error"), description: "Download failed", variant: "destructive" });
    }
    setDownloadingSurah(null);
  }, [audioMode, currentModeId, getAudioUrl, toast, t, refreshStorageUsage]);

  // Download all surahs
  const downloadAll = useCallback(async () => {
    setBatchDownloading(true); setBatchProgress(0); abortBatchRef.current = false;

    for (let i = 1; i <= 114; i++) {
      if (abortBatchRef.current) break;
      if (cachedSurahs.has(i)) { setBatchProgress(i); continue; }

      const url = getAudioUrl(i);
      if (!url) { setBatchProgress(i); continue; }

      setDownloadingSurah(i);
      const success = await downloadAndCacheAudio(url, audioMode, currentModeId, i);
      if (success) {
        setCachedSurahs((prev) => new Set([...prev, i]));
      }
      setBatchProgress(i);
      setDownloadingSurah(null);

      // Refresh storage every 10 surahs
      if (i % 10 === 0) refreshStorageUsage();

      // Small delay
      if (i % 5 === 0) await new Promise((r) => setTimeout(r, 200));
    }

    setBatchDownloading(false); setDownloadingSurah(null);
    refreshStorageUsage();
    if (!abortBatchRef.current) {
      toast({ title: "✅ All downloaded!", description: "All surahs saved offline" });
    }
  }, [audioMode, currentModeId, cachedSurahs, getAudioUrl, toast, refreshStorageUsage]);

  const stopBatchDownload = useCallback(() => { abortBatchRef.current = true; }, []);

  const filteredSurahs = SURAHS.filter((s) => s.englishName.toLowerCase().includes(search.toLowerCase()) || s.name.includes(search) || String(s.number).includes(search));

  const downloadedCount = cachedSurahs.size;

  return (
    <div className="flex flex-col h-full">
      {/* Fixed player */}
      <div className="fixed left-0 right-0 z-30 bg-background px-4 pt-2 pb-2" style={{ top: "calc(56px + env(safe-area-inset-top, 20px))" }}>
        <div className="bg-card rounded-xl border border-border p-2 animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button onClick={handlePrev} disabled={selectedSurah <= 1} className="p-1 rounded-full hover:bg-muted transition-smooth disabled:opacity-30"><SkipBack className="w-4 h-4 text-foreground" /></button>
              <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center transition-smooth active:scale-95" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" /> : isPlaying ? <Pause className="w-4 h-4 text-primary-foreground" /> : <Play className="w-4 h-4 text-primary-foreground ml-0.5" />}
              </button>
              <button onClick={handleNext} disabled={selectedSurah >= 114} className="p-1 rounded-full hover:bg-muted transition-smooth disabled:opacity-30"><SkipForward className="w-4 h-4 text-foreground" /></button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="font-arabic text-xs text-primary truncate">{surah.name}</p>
                <p className="text-[10px] text-foreground truncate">{surah.englishName}</p>
                {cachedSurahs.has(selectedSurah) && <span className="text-green-500 text-[8px]">●</span>}
              </div>
              <input type="range" min="0" max="100" step="0.1" value={progress} onChange={handleSeek} className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary" />
              <div className="flex justify-between"><span className="text-[8px] text-muted-foreground">{formatTime(currentTime)}</span><span className="text-[8px] text-muted-foreground">{formatTime(duration)}</span></div>
            </div>
            <div className="relative">
              <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} className="flex items-center gap-0.5 px-1.5 py-1 rounded-lg bg-muted hover:bg-muted/80 transition-smooth">
                <Gauge className="w-3 h-3 text-muted-foreground" /><span className="text-[9px] font-medium text-foreground">{playbackSpeed}x</span>
              </button>
              {showSpeedMenu && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg p-1 z-50">
                  {PLAYBACK_SPEEDS.map((speed) => (
                    <button key={speed} onClick={() => changeSpeed(speed)} className={`block w-full px-3 py-1.5 text-xs text-left rounded transition-smooth ${playbackSpeed === speed ? "bg-primary/20 text-primary font-medium" : "text-foreground hover:bg-muted"}`}>{speed}x</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4" style={{ paddingTop: "85px" }}>
        {/* Mode Toggle */}
        <div className="flex bg-card rounded-xl p-1 border border-border mb-3 animate-fade-in">
          <button onClick={() => setAudioMode("quran")} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${audioMode === "quran" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t("audio.quranAudio")}</button>
          <button onClick={() => setAudioMode("translation")} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${audioMode === "translation" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t("audio.urduTranslation")}</button>
        </div>

        {/* Translator Selection */}
        {audioMode === "translation" && (
          <div className="bg-card rounded-xl border border-border mb-3 animate-fade-in overflow-hidden">
            <button onClick={() => setShowTranslatorList(!showTranslatorList)} className="w-full flex items-center justify-between p-3">
              <p className="text-xs font-medium text-foreground">{t("audio.selectTranslator")}</p>
              <span className={`text-muted-foreground text-xs transition-transform ${showTranslatorList ? "rotate-180" : ""}`}>▼</span>
            </button>
            {showTranslatorList && (
              <div className="flex flex-col gap-1.5 px-3 pb-3">
                {URDU_TRANSLATORS.map((tr) => (
                  <button key={tr.id} onClick={() => { setSelectedTranslator(tr.id); setShowTranslatorList(false); }} className={`text-left px-3 py-2 rounded-lg text-xs transition-smooth ${selectedTranslator === tr.id ? "bg-primary/20 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}>{tr.name} ({tr.language})</button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Download Bar */}
        <div className="bg-card rounded-xl border border-border p-3 mb-3 animate-fade-in">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">
                📥 {downloadedCount}/114 offline
              </span>
            </div>
            {batchDownloading ? (
              <button onClick={stopBatchDownload} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium">
                <X className="w-3 h-3" /> Stop
              </button>
            ) : downloadedCount >= 114 ? (
              <span className="flex items-center gap-1 text-xs text-primary font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> All saved
              </span>
            ) : (
              <button onClick={downloadAll} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                <Download className="w-3 h-3" /> Download All
              </button>
            )}
          </div>
          {storageUsage > 0 && (
            <p className="text-[10px] text-muted-foreground mb-2">
              💾 Storage used: {storageUsage >= 1024 * 1024 * 1024
                ? `${(storageUsage / (1024 * 1024 * 1024)).toFixed(2)} GB`
                : storageUsage >= 1024 * 1024
                  ? `${(storageUsage / (1024 * 1024)).toFixed(1)} MB`
                  : `${Math.round(storageUsage / 1024)} KB`}
            </p>
          )}
          {/* Progress bar */}
          {batchDownloading && (
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(batchProgress / 114) * 100}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground text-center">
                {batchProgress}/114 • {downloadingSurah ? `Surah ${downloadingSurah}...` : ""}
              </p>
            </div>
          )}
          {!batchDownloading && downloadingSurah !== null && (
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all animate-pulse" style={{ width: downloadTotal > 0 ? `${(downloadProgress / downloadTotal) * 100}%` : "50%" }} />
              </div>
              <p className="text-[10px] text-muted-foreground text-center">
                Downloading Surah {downloadingSurah}...
                {downloadTotal > 0 && ` ${Math.round(downloadProgress / 1024)}KB / ${Math.round(downloadTotal / 1024)}KB`}
              </p>
            </div>
          )}
        </div>

        {/* Ayatul Kursi Section */}
        <div className="bg-card rounded-xl border border-border mb-3 animate-fade-in overflow-hidden">
          <button onClick={() => setShowAyatulKursi(!showAyatulKursi)} className="w-full flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛡️</span>
              <div>
                <p className="text-xs font-semibold text-foreground text-left">Ayatul Kursi</p>
                <p className="text-[10px] text-muted-foreground">آیت الکرسی • Recitation & Tafseer</p>
              </div>
            </div>
            <span className={`text-muted-foreground text-xs transition-transform ${showAyatulKursi ? "rotate-180" : ""}`}>▼</span>
          </button>
          {showAyatulKursi && (
            <div className="flex flex-col gap-1 px-3 pb-3">
              {/* Ayatul Kursi with English Meaning */}
              <button
                onClick={() => {
                  const audio = audioRef.current;
                  if (!audio) return;
                  setPlayingAyatulKursi("english");
                  setPlayingPanjSurah(null);
                  audio.pause();
                  audio.src = "https://archive.org/download/20170527QuraanTafseerAyatulKursi/20170527_QuraanTafseerAyatulKursi.mp3";
                  audio.load();
                  audio.play().then(() => setIsPlaying(true)).catch(() => {});
                  if ("mediaSession" in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({ title: "Ayatul Kursi - English Tafseer", artist: "Maulana Anwar", album: "Ayatul Kursi" });
                  }
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${playingAyatulKursi === "english" ? "bg-primary/10 border border-primary/30" : "hover:bg-muted border border-transparent"}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${playingAyatulKursi === "english" ? "bg-primary text-primary-foreground" : "bg-primary/20"}`}>
                  <span className={`text-[10px] font-bold ${playingAyatulKursi === "english" ? "" : "text-primary"}`}>EN</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">Ayatul Kursi - English Meaning</span>
                  <p className="text-[10px] text-muted-foreground">Maulana Anwar • 38:44</p>
                </div>
                {playingAyatulKursi === "english" && isPlaying && (
                  <div className="flex gap-0.5 items-end h-4 shrink-0">
                    <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "60%" }} />
                    <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "100%", animationDelay: "0.2s" }} />
                    <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "40%", animationDelay: "0.4s" }} />
                  </div>
                )}
              </button>

              {/* Ayatul Kursi Urdu - First Dars */}
              <button
                onClick={() => {
                  const audio = audioRef.current;
                  if (!audio) return;
                  setPlayingAyatulKursi("urdu");
                  setPlayingPanjSurah(null);
                  audio.pause();
                  audio.src = "https://archive.org/download/tafseerayatulkursi/Dars01%20Ayatul%20Kursi%20Ahmiyat%20wo%20Fazilat%20Shaikh%20Abu%20Rizwan%20Mohammadi%20Salafi%20Hafizahullah%2019_05_2020.mp3";
                  audio.load();
                  audio.play().then(() => setIsPlaying(true)).catch(() => {});
                  if ("mediaSession" in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({ title: "Ayatul Kursi - Urdu Tafseer", artist: "Shaikh Abu Rizwan Mohammadi", album: "Tafseer Ayatul Kursi" });
                  }
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${playingAyatulKursi === "urdu" ? "bg-primary/10 border border-primary/30" : "hover:bg-muted border border-transparent"}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${playingAyatulKursi === "urdu" ? "bg-primary text-primary-foreground" : "bg-primary/20"}`}>
                  <span className={`text-[10px] font-bold ${playingAyatulKursi === "urdu" ? "" : "text-primary"}`}>اُ</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">Ayatul Kursi - Urdu Tafseer</span>
                  <p className="text-[10px] text-muted-foreground">Shaikh Abu Rizwan Mohammadi Salafi</p>
                </div>
                {playingAyatulKursi === "urdu" && isPlaying && (
                  <div className="flex gap-0.5 items-end h-4 shrink-0">
                    <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "60%" }} />
                    <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "100%", animationDelay: "0.2s" }} />
                    <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "40%", animationDelay: "0.4s" }} />
                  </div>
                )}
              </button>

              {/* Tafseer Ayatul Kursi Durooos - Expandable */}
              <div className="mt-1 bg-muted/30 rounded-xl overflow-hidden">
                <button onClick={() => setShowAyatulKursiDurooos(!showAyatulKursiDurooos)} className="w-full flex items-center justify-between px-3 py-2">
                  <div>
                    <p className="text-xs font-medium text-foreground text-left">📚 Tafseer Ayatul Kursi - Complete Durooos</p>
                    <p className="text-[10px] text-muted-foreground">Shaikh Abu Rizwan Mohammadi • 40 Dars</p>
                  </div>
                  <span className={`text-muted-foreground text-xs transition-transform ${showAyatulKursiDurooos ? "rotate-180" : ""}`}>▼</span>
                </button>
                {showAyatulKursiDurooos && (
                  <div className="flex flex-col gap-1 px-2 pb-2 max-h-72 overflow-y-auto">
                    {AYATUL_KURSI_DUROOOS.map((dars) => (
                      <button
                        key={dars.id}
                        onClick={() => {
                          const audio = audioRef.current;
                          if (!audio) return;
                          setPlayingAyatulKursi(dars.id);
                          setPlayingPanjSurah(null);
                          audio.pause();
                          audio.src = dars.url;
                          audio.load();
                          audio.play().then(() => setIsPlaying(true)).catch(() => {});
                          if ("mediaSession" in navigator) {
                            navigator.mediaSession.metadata = new MediaMetadata({ title: dars.title, artist: "Shaikh Abu Rizwan Mohammadi", album: "Tafseer Ayatul Kursi" });
                          }
                        }}
                        className={`flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-all ${playingAyatulKursi === dars.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted border border-transparent"}`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold ${playingAyatulKursi === dars.id ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"}`}>
                          {dars.num}
                        </div>
                        <span className="text-xs text-foreground flex-1 min-w-0 truncate">{dars.title}</span>
                        {playingAyatulKursi === dars.id && isPlaying && (
                          <div className="flex gap-0.5 items-end h-3 shrink-0">
                            <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "60%" }} />
                            <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "100%", animationDelay: "0.2s" }} />
                            <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "40%", animationDelay: "0.4s" }} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Panj Surah Section */}
        <div className="bg-card rounded-xl border border-border mb-3 animate-fade-in overflow-hidden">
          <button onClick={() => setShowPanjSurah(!showPanjSurah)} className="w-full flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📖</span>
              <div>
                <p className="text-xs font-semibold text-foreground text-left">Panj Surah</p>
                <p className="text-[10px] text-muted-foreground">پنج سورہ • 5 Surahs • Hafiz Fahad Shah</p>
              </div>
            </div>
            <span className={`text-muted-foreground text-xs transition-transform ${showPanjSurah ? "rotate-180" : ""}`}>▼</span>
          </button>
          {showPanjSurah && (
            <div className="flex flex-col gap-1 px-3 pb-3">
              {PANJ_SURAHS.map((ps) => (
                <button
                  key={ps.id}
                  onClick={() => {
                    const audio = audioRef.current;
                    if (!audio) return;
                    setPlayingPanjSurah(ps.id);
                    audio.pause();
                    audio.src = `${PANJ_SURAH_BASE}${ps.file}`;
                    audio.load();
                    audio.play().then(() => setIsPlaying(true)).catch(() => {});
                    if ("mediaSession" in navigator) {
                      navigator.mediaSession.metadata = new MediaMetadata({
                        title: ps.name,
                        artist: "Hafiz Fahad Shah - Panj Surah",
                        album: "Panj Surah",
                      });
                    }
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    playingPanjSurah === ps.id
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted border border-transparent"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    playingPanjSurah === ps.id ? "bg-primary text-primary-foreground" : "bg-primary/20"
                  }`}>
                    <span className={`text-[10px] font-bold ${playingPanjSurah === ps.id ? "" : "text-primary"}`}>{ps.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{ps.name}</span>
                      <span className="font-arabic text-primary text-sm">{ps.nameAr}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{ps.duration}</p>
                  </div>
                  {playingPanjSurah === ps.id && isPlaying && (
                    <div className="flex gap-0.5 items-end h-4 shrink-0">
                      <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "60%" }} />
                      <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "100%", animationDelay: "0.2s" }} />
                      <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "40%", animationDelay: "0.4s" }} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <input type="text" placeholder={t("audio.searchSurah")} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-smooth mb-3 text-sm" />

        {/* Surah List */}
        <div className="flex flex-col gap-1.5">
          {filteredSurahs.map((s) => {
            const isCached = cachedSurahs.has(s.number);
            const isDownloadingThis = downloadingSurah === s.number;

            return (
              <div key={s.number} className={`flex items-center gap-2 p-3 rounded-xl border transition-smooth ${selectedSurah === s.number ? "bg-primary/10 border-primary/30" : "bg-card border-border hover:border-primary/20"}`}>
                <button onClick={() => selectSurah(s.number)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selectedSurah === s.number ? "bg-primary text-primary-foreground" : "bg-primary/20"}`}>
                    <span className={`text-xs font-bold ${selectedSurah === s.number ? "" : "text-primary"}`}>{s.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-foreground">{s.englishName}</span>
                      <span className="font-arabic text-primary text-sm">{s.name}</span>
                    </div>
                  </div>
                </button>

                {/* Download / cached indicator */}
                {isCached ? (
                  <span className="text-green-500 shrink-0"><CheckCircle2 className="w-4 h-4" /></span>
                ) : isDownloadingThis ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); downloadSurah(s.number); }}
                    disabled={batchDownloading}
                    className="p-1 rounded-lg hover:bg-muted transition-smooth shrink-0 disabled:opacity-30"
                  >
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}

                {selectedSurah === s.number && isPlaying && (
                  <div className="flex gap-0.5 items-end h-4 shrink-0">
                    <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "60%" }} />
                    <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "100%", animationDelay: "0.2s" }} />
                    <div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "40%", animationDelay: "0.4s" }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showSpeedMenu && <div className="fixed inset-0 z-20" onClick={() => setShowSpeedMenu(false)} />}
    </div>
  );
};

export default QuranAudio;
