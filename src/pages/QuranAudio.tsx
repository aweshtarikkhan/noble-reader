import React, { useState, useRef, useEffect, useCallback } from "react";
import { SURAHS } from "@/data/surahs";
import { Play, Pause, SkipBack, SkipForward, Loader2, Gauge } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { DR_ISRAR_AUDIO_MAP, DR_ISRAR_BASE_URL } from "@/data/drIsrarAudioMap";
import { FATEH_MUHAMMAD_AUDIO_MAP, FATEH_MUHAMMAD_BASE_URL } from "@/data/fatehMuhammadAudioMap";

type AudioMode = "quran" | "translation";

interface Reciter { id: string; name: string; server: string; subfolder: string; }
interface TranslationAuthor { id: string; name: string; language: string; }

const RECITERS: Reciter[] = [
  { id: "mishary", name: "Mishary Rashid Alafasy", server: "server8", subfolder: "afs" },
];

const URDU_TRANSLATORS: TranslationAuthor[] = [
  { id: "fateh", name: "Fateh Muhammad Jalandhari", language: "Urdu" },
  { id: "drisrar", name: "Dr. Israr Ahmad (Bayan ul Quran)", language: "Urdu" },
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
  return "";
};

const QuranAudio: React.FC = () => {
  const { toast } = useToast();
  const { t } = useI18n();

  // Load saved state
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingPlayRef = useRef(false);
  const pendingSeekRef = useRef<number | null>(savedState?.time || null);

  const reciter = RECITERS.find((r) => r.id === selectedReciter) || RECITERS[0];
  const translator = URDU_TRANSLATORS.find((t) => t.id === selectedTranslator) || URDU_TRANSLATORS[0];
  const surah = SURAHS.find((s) => s.number === selectedSurah)!;
  const audioSrc = audioMode === "quran" ? getQuranAudioUrl(reciter.server, reciter.subfolder, selectedSurah) : getTranslationAudioUrl(translator.id, selectedSurah);

  // Save state periodically
  useEffect(() => {
    const saveState = () => {
      const state = {
        audioMode,
        surah: selectedSurah,
        reciter: selectedReciter,
        translator: selectedTranslator,
        time: audioRef.current?.currentTime || 0,
        speed: playbackSpeed
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    };

    const interval = setInterval(saveState, 2000);
    window.addEventListener("beforeunload", saveState);
    document.addEventListener("visibilitychange", saveState);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", saveState);
      document.removeEventListener("visibilitychange", saveState);
      saveState();
    };
  }, [audioMode, selectedSurah, selectedReciter, selectedTranslator, playbackSpeed]);

  // Setup Media Session for notification controls
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: surah.englishName,
        artist: audioMode === "quran" ? reciter.name : translator.name,
        album: "Quran",
        artwork: [{ src: "/favicon.ico", sizes: "192x192", type: "image/png" }]
      });

      navigator.mediaSession.setActionHandler("play", () => {
        audioRef.current?.play();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        audioRef.current?.pause();
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        if (selectedSurah > 1) {
          pendingPlayRef.current = isPlaying;
          setSelectedSurah(prev => prev - 1);
        }
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        if (selectedSurah < 114) {
          pendingPlayRef.current = isPlaying;
          setSelectedSurah(prev => prev + 1);
        }
      });
    }
  }, [surah, audioMode, reciter, translator, selectedSurah, isPlaying]);

  useEffect(() => { 
    const audio = new Audio(); 
    audio.preload = "auto"; 
    audioRef.current = audio; 
    return () => { audio.pause(); audio.src = ""; audio.load(); }; 
  }, []);

  useEffect(() => {
    const audio = audioRef.current; if (!audio) return;
    setIsPlaying(false); setIsLoading(true); setProgress(0); setCurrentTime(0); setDuration(0);
    audio.pause(); audio.src = audioSrc; audio.playbackRate = playbackSpeed; audio.load();
    
    const onCanPlay = () => { 
      setIsLoading(false); 
      setDuration(audio.duration || 0); 
      audio.playbackRate = playbackSpeed;
      
      // Seek to saved position if available
      if (pendingSeekRef.current !== null && pendingSeekRef.current > 0) {
        audio.currentTime = pendingSeekRef.current;
        pendingSeekRef.current = null;
      }
      
      if (pendingPlayRef.current) { 
        pendingPlayRef.current = false; 
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false)); 
      } 
    };
    const onTimeUpdate = () => { setCurrentTime(audio.currentTime); setDuration(audio.duration || 0); setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0); };
    const onEnded = () => { setIsPlaying(false); if (selectedSurah < 114) { pendingPlayRef.current = true; setSelectedSurah(prev => prev + 1); } };
    const onError = () => { setIsLoading(false); setIsPlaying(false); toast({ title: t("common.error"), description: "Could not load audio.", variant: "destructive" }); };
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => { setIsLoading(false); setIsPlaying(true); };
    const onPause = () => setIsPlaying(false);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    audio.addEventListener("canplay", onCanPlay); audio.addEventListener("timeupdate", onTimeUpdate); audio.addEventListener("ended", onEnded); audio.addEventListener("error", onError); audio.addEventListener("waiting", onWaiting); audio.addEventListener("playing", onPlaying); audio.addEventListener("pause", onPause); audio.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => { audio.removeEventListener("canplay", onCanPlay); audio.removeEventListener("timeupdate", onTimeUpdate); audio.removeEventListener("ended", onEnded); audio.removeEventListener("error", onError); audio.removeEventListener("waiting", onWaiting); audio.removeEventListener("playing", onPlaying); audio.removeEventListener("pause", onPause); audio.removeEventListener("loadedmetadata", onLoadedMetadata); };
  }, [audioSrc, selectedSurah, toast, t, playbackSpeed]);

  const togglePlay = useCallback(() => { 
    const audio = audioRef.current; 
    if (!audio) return; 
    if (isPlaying) {
      audio.pause();
    } else { 
      setIsLoading(true); 
      audio.play().then(() => setIsPlaying(true)).catch(() => { 
        setIsPlaying(false); 
        toast({ title: t("common.error"), variant: "destructive" }); 
      }).finally(() => setIsLoading(false)); 
    } 
  }, [isPlaying, toast, t]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { 
    const audio = audioRef.current; 
    if (!audio || !audio.duration) return; 
    const val = parseFloat(e.target.value); 
    const time = (val / 100) * audio.duration; 
    audio.currentTime = time; 
    setProgress(val); 
    setCurrentTime(time); 
  }, []);

  const handlePrev = useCallback(() => { 
    if (selectedSurah > 1) { 
      pendingPlayRef.current = isPlaying; 
      pendingSeekRef.current = null;
      setSelectedSurah(prev => prev - 1); 
    } 
  }, [selectedSurah, isPlaying]);

  const handleNext = useCallback(() => { 
    if (selectedSurah < 114) { 
      pendingPlayRef.current = isPlaying; 
      pendingSeekRef.current = null;
      setSelectedSurah(prev => prev + 1); 
    } 
  }, [selectedSurah, isPlaying]);

  const selectSurah = useCallback((num: number) => { 
    pendingPlayRef.current = true; 
    pendingSeekRef.current = null;
    setSelectedSurah(num); 
  }, []);

  const changeSpeed = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  }, []);

  const formatTime = (t: number) => { 
    if (!t || isNaN(t)) return "0:00"; 
    const m = Math.floor(t / 60); 
    const s = Math.floor(t % 60); 
    return `${m}:${s.toString().padStart(2, "0")}`; 
  };

  const filteredSurahs = SURAHS.filter((s) => s.englishName.toLowerCase().includes(search.toLowerCase()) || s.name.includes(search) || String(s.number).includes(search));

  return (
    <div className="flex flex-col h-full">
      {/* Fixed player - with proper top offset for header */}
      <div className="fixed left-0 right-0 z-30 bg-background px-4 pt-2 pb-2" style={{ top: "calc(56px + env(safe-area-inset-top, 20px))" }}>
        {/* Compact Audio Player */}
        <div className="bg-card rounded-xl border border-border p-2 animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            {/* Controls */}
            <div className="flex items-center gap-1">
              <button onClick={handlePrev} disabled={selectedSurah <= 1} className="p-1 rounded-full hover:bg-muted transition-smooth disabled:opacity-30">
                <SkipBack className="w-4 h-4 text-foreground" />
              </button>
              <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center transition-smooth active:scale-95" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" /> : isPlaying ? <Pause className="w-4 h-4 text-primary-foreground" /> : <Play className="w-4 h-4 text-primary-foreground ml-0.5" />}
              </button>
              <button onClick={handleNext} disabled={selectedSurah >= 114} className="p-1 rounded-full hover:bg-muted transition-smooth disabled:opacity-30">
                <SkipForward className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Progress */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="font-arabic text-xs text-primary truncate">{surah.name}</p>
                <p className="text-[10px] text-foreground truncate">{surah.englishName}</p>
              </div>
              <input type="range" min="0" max="100" step="0.1" value={progress} onChange={handleSeek} className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary" />
              <div className="flex justify-between">
                <span className="text-[8px] text-muted-foreground">{formatTime(currentTime)}</span>
                <span className="text-[8px] text-muted-foreground">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Speed control */}
            <div className="relative">
              <button 
                onClick={() => setShowSpeedMenu(!showSpeedMenu)} 
                className="flex items-center gap-0.5 px-1.5 py-1 rounded-lg bg-muted hover:bg-muted/80 transition-smooth"
              >
                <Gauge className="w-3 h-3 text-muted-foreground" />
                <span className="text-[9px] font-medium text-foreground">{playbackSpeed}x</span>
              </button>
              
              {showSpeedMenu && (
                <div className="absolute right-0 bottom-full mb-1 bg-card border border-border rounded-lg shadow-lg p-1 z-50">
                  {PLAYBACK_SPEEDS.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => changeSpeed(speed)}
                      className={`block w-full px-3 py-1.5 text-xs text-left rounded transition-smooth ${playbackSpeed === speed ? "bg-primary/20 text-primary font-medium" : "text-foreground hover:bg-muted"}`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content with padding for fixed player */}
      <div className="flex-1 overflow-y-auto px-4 pb-4" style={{ paddingTop: "85px" }}>
        {/* Mode Toggle */}
        <div className="flex bg-card rounded-xl p-1 border border-border mb-3 animate-fade-in">
          <button onClick={() => setAudioMode("quran")} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${audioMode === "quran" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t("audio.quranAudio")}</button>
          <button onClick={() => setAudioMode("translation")} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${audioMode === "translation" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t("audio.urduTranslation")}</button>
        </div>

        {/* Translator Selection - collapsible, only for translation mode */}
        {audioMode === "translation" && (
          <div className="bg-card rounded-xl border border-border mb-3 animate-fade-in overflow-hidden">
            <button 
              onClick={() => setShowTranslatorList(!showTranslatorList)} 
              className="w-full flex items-center justify-between p-3"
            >
              <p className="text-xs font-medium text-foreground">{t("audio.selectTranslator")}</p>
              <span className={`text-muted-foreground text-xs transition-transform ${showTranslatorList ? "rotate-180" : ""}`}>▼</span>
            </button>
            {showTranslatorList && (
              <div className="flex flex-col gap-1.5 px-3 pb-3">
                {URDU_TRANSLATORS.map((t) => (
                  <button key={t.id} onClick={() => { setSelectedTranslator(t.id); setShowTranslatorList(false); }} className={`text-left px-3 py-2 rounded-lg text-xs transition-smooth ${selectedTranslator === t.id ? "bg-primary/20 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}>{t.name} ({t.language})</button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search and Surah List */}
        <input type="text" placeholder={t("audio.searchSurah")} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-smooth mb-3 text-sm" />
        <div className="flex flex-col gap-1.5">
          {filteredSurahs.map((s) => (
            <button key={s.number} onClick={() => selectSurah(s.number)} className={`flex items-center gap-3 p-3 rounded-xl border transition-smooth text-left ${selectedSurah === s.number ? "bg-primary/10 border-primary/30" : "bg-card border-border hover:border-primary/20"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selectedSurah === s.number ? "bg-primary text-primary-foreground" : "bg-primary/20"}`}><span className={`text-xs font-bold ${selectedSurah === s.number ? "" : "text-primary"}`}>{s.number}</span></div>
              <div className="flex-1 min-w-0"><div className="flex items-center justify-between"><span className="font-medium text-sm text-foreground">{s.englishName}</span><span className="font-arabic text-primary text-sm">{s.name}</span></div></div>
              {selectedSurah === s.number && isPlaying && <div className="flex gap-0.5 items-end h-4"><div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "60%" }} /><div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "100%", animationDelay: "0.2s" }} /><div className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: "40%", animationDelay: "0.4s" }} /></div>}
            </button>
          ))}
        </div>
      </div>

      {/* Click outside to close speed menu */}
      {showSpeedMenu && (
        <div className="fixed inset-0 z-20" onClick={() => setShowSpeedMenu(false)} />
      )}
    </div>
  );
};

export default QuranAudio;
