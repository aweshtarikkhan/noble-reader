import React, { useState, useRef, useEffect, useCallback } from "react";
import { SURAHS } from "@/data/surahs";
import { Play, Pause, SkipBack, SkipForward, Volume2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { DR_ISRAR_AUDIO_MAP, DR_ISRAR_BASE_URL } from "@/data/drIsrarAudioMap";

type AudioMode = "quran" | "translation";

interface Reciter { id: string; name: string; server: string; subfolder: string; }
interface TranslationAuthor { id: string; name: string; language: string; }

const RECITERS: Reciter[] = [
  { id: "mishary", name: "Mishary Rashid Alafasy", server: "server8", subfolder: "afs" },
];

const URDU_TRANSLATORS: TranslationAuthor[] = [
  { id: "drisrar", name: "Dr. Israr Ahmad (Bayan ul Quran)", language: "Urdu" },
];

const getQuranAudioUrl = (server: string, subfolder: string, surahNum: number) =>
  `https://${server}.mp3quran.net/${subfolder}/${String(surahNum).padStart(3, "0")}.mp3`;

const getTranslationAudioUrl = (translatorId: string, surahNum: number) => {
  if (translatorId === "drisrar") {
    const fileName = DR_ISRAR_AUDIO_MAP[surahNum];
    return fileName ? `${DR_ISRAR_BASE_URL}${fileName}` : "";
  }
  return "";
};

const QuranAudio: React.FC = () => {
  const { toast } = useToast();
  const { t } = useI18n();
  const [audioMode, setAudioMode] = useState<AudioMode>("quran");
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0].id);
  const [selectedTranslator, setSelectedTranslator] = useState(URDU_TRANSLATORS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [search, setSearch] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingPlayRef = useRef(false);

  const reciter = RECITERS.find((r) => r.id === selectedReciter) || RECITERS[0];
  const translator = URDU_TRANSLATORS.find((t) => t.id === selectedTranslator) || URDU_TRANSLATORS[0];
  const surah = SURAHS.find((s) => s.number === selectedSurah)!;
  const audioSrc = audioMode === "quran" ? getQuranAudioUrl(reciter.server, reciter.subfolder, selectedSurah) : getTranslationAudioUrl(translator.server, translator.subfolder, selectedSurah);

  useEffect(() => { const audio = new Audio(); audio.preload = "auto"; audioRef.current = audio; return () => { audio.pause(); audio.src = ""; audio.load(); }; }, []);

  useEffect(() => {
    const audio = audioRef.current; if (!audio) return;
    setIsPlaying(false); setIsLoading(true); setProgress(0); setCurrentTime(0); setDuration(0);
    audio.pause(); audio.src = audioSrc; audio.load();
    const onCanPlay = () => { setIsLoading(false); setDuration(audio.duration || 0); if (pendingPlayRef.current) { pendingPlayRef.current = false; audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false)); } };
    const onTimeUpdate = () => { setCurrentTime(audio.currentTime); setDuration(audio.duration || 0); setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0); };
    const onEnded = () => { setIsPlaying(false); if (selectedSurah < 114) { pendingPlayRef.current = true; setSelectedSurah(prev => prev + 1); } };
    const onError = () => { setIsLoading(false); setIsPlaying(false); toast({ title: t("common.error"), description: "Could not load audio.", variant: "destructive" }); };
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => { setIsLoading(false); setIsPlaying(true); };
    const onPause = () => setIsPlaying(false);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    audio.addEventListener("canplay", onCanPlay); audio.addEventListener("timeupdate", onTimeUpdate); audio.addEventListener("ended", onEnded); audio.addEventListener("error", onError); audio.addEventListener("waiting", onWaiting); audio.addEventListener("playing", onPlaying); audio.addEventListener("pause", onPause); audio.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => { audio.removeEventListener("canplay", onCanPlay); audio.removeEventListener("timeupdate", onTimeUpdate); audio.removeEventListener("ended", onEnded); audio.removeEventListener("error", onError); audio.removeEventListener("waiting", onWaiting); audio.removeEventListener("playing", onPlaying); audio.removeEventListener("pause", onPause); audio.removeEventListener("loadedmetadata", onLoadedMetadata); };
  }, [audioSrc, selectedSurah, toast, t]);

  const togglePlay = useCallback(() => { const audio = audioRef.current; if (!audio) return; if (isPlaying) audio.pause(); else { setIsLoading(true); audio.play().then(() => setIsPlaying(true)).catch(() => { setIsPlaying(false); toast({ title: t("common.error"), variant: "destructive" }); }).finally(() => setIsLoading(false)); } }, [isPlaying, toast, t]);
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const audio = audioRef.current; if (!audio || !audio.duration) return; const val = parseFloat(e.target.value); const time = (val / 100) * audio.duration; audio.currentTime = time; setProgress(val); setCurrentTime(time); }, []);
  const handlePrev = useCallback(() => { if (selectedSurah > 1) { pendingPlayRef.current = isPlaying; setSelectedSurah(prev => prev - 1); } }, [selectedSurah, isPlaying]);
  const handleNext = useCallback(() => { if (selectedSurah < 114) { pendingPlayRef.current = isPlaying; setSelectedSurah(prev => prev + 1); } }, [selectedSurah, isPlaying]);
  const selectSurah = useCallback((num: number) => { pendingPlayRef.current = true; setSelectedSurah(num); }, []);
  const formatTime = (t: number) => { if (!t || isNaN(t)) return "0:00"; const m = Math.floor(t / 60); const s = Math.floor(t % 60); return `${m}:${s.toString().padStart(2, "0")}`; };
  const filteredSurahs = SURAHS.filter((s) => s.englishName.toLowerCase().includes(search.toLowerCase()) || s.name.includes(search) || String(s.number).includes(search));

  return (
    <div className="px-4 py-4">
      <div className="flex bg-card rounded-xl p-1 border border-border mb-4 animate-fade-in">
        <button onClick={() => setAudioMode("quran")} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${audioMode === "quran" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t("audio.quranAudio")}</button>
        <button onClick={() => setAudioMode("translation")} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${audioMode === "translation" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t("audio.urduTranslation")}</button>
      </div>
      <div className="bg-card rounded-2xl border border-border p-4 mb-4 animate-fade-in">
        <div className="text-center mb-3">
          <p className="font-arabic text-2xl text-primary mb-1">{surah.name}</p>
          <p className="text-sm font-medium text-foreground">{surah.englishName}</p>
          <p className="text-[10px] text-muted-foreground">{surah.translation} • {surah.ayahs} {t("audio.ayahs")}</p>
        </div>
        <div className="mb-3">
          <input type="range" min="0" max="100" step="0.1" value={progress} onChange={handleSeek} className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary" />
          <div className="flex justify-between mt-1"><span className="text-[10px] text-muted-foreground">{formatTime(currentTime)}</span><span className="text-[10px] text-muted-foreground">{formatTime(duration)}</span></div>
        </div>
        <div className="flex items-center justify-center gap-6">
          <button onClick={handlePrev} disabled={selectedSurah <= 1} className="p-2 rounded-full hover:bg-muted transition-smooth disabled:opacity-30"><SkipBack className="w-5 h-5 text-foreground" /></button>
          <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-primary flex items-center justify-center transition-smooth active:scale-95" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-6 h-6 text-primary-foreground animate-spin" /> : isPlaying ? <Pause className="w-6 h-6 text-primary-foreground" /> : <Play className="w-6 h-6 text-primary-foreground ml-0.5" />}
          </button>
          <button onClick={handleNext} disabled={selectedSurah >= 114} className="p-2 rounded-full hover:bg-muted transition-smooth disabled:opacity-30"><SkipForward className="w-5 h-5 text-foreground" /></button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-2"><Volume2 className="w-3 h-3 inline mr-1" />{audioMode === "quran" ? reciter.name : translator.name}</p>
      </div>
      <div className="bg-card rounded-xl border border-border p-3 mb-4 animate-fade-in">
        <p className="text-xs font-medium text-foreground mb-2">{audioMode === "quran" ? t("audio.selectReciter") : t("audio.selectTranslator")}</p>
        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
          {audioMode === "quran" ? RECITERS.map((r) => (
            <button key={r.id} onClick={() => setSelectedReciter(r.id)} className={`text-left px-3 py-2 rounded-lg text-xs transition-smooth ${selectedReciter === r.id ? "bg-primary/20 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}>{r.name}</button>
          )) : URDU_TRANSLATORS.map((t) => (
            <button key={t.id} onClick={() => setSelectedTranslator(t.id)} className={`text-left px-3 py-2 rounded-lg text-xs transition-smooth ${selectedTranslator === t.id ? "bg-primary/20 text-primary font-medium" : "text-muted-foreground hover:bg-muted"}`}>{t.name} ({t.language})</button>
          ))}
        </div>
      </div>
      <div className="animate-fade-in">
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
    </div>
  );
};

export default QuranAudio;
