import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Languages, List, BookCopy, MapPin, Share2, Clock, LocateFixed, Compass, Search, Building, BellOff, Bell, Calendar, Bookmark, HandHeart, BookMarked } from "lucide-react";
import { useSharedLocation } from "@/hooks/useSharedLocation";
import CitySearchDialog from "@/components/CitySearchDialog";
import { useToast } from "@/hooks/use-toast";
import { DAILY_HADITHS } from "@/data/hadith";
import { shareAsImage } from "@/lib/shareAsImage";
import { useI18n } from "@/lib/i18n";

const DAILY_AYAHS = [
  { surah: "Surah Ash-Sharh [94:5]", arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا", english: "For indeed, with hardship will be ease.", urdu: "بے شک مشکل کے ساتھ آسانی ہے۔", romanUrdu: "Be shak mushkil ke saath aasaani hai." },
  { surah: "Surah Al-Baqarah [2:286]", arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا", english: "Allah does not burden a soul beyond that it can bear.", urdu: "اللہ کسی جان کو اس کی طاقت سے زیادہ تکلیف نہیں دیتا۔", romanUrdu: "Allah kisi jaan ko us ki taaqat se zyada takleef nahi deta." },
  { surah: "Surah Al-Imran [3:139]", arabic: "وَلَا تَهِنُوا۟ وَلَا تَحْزَنُوا۟ وَأَنتُمُ ٱلْأَعْلَوْنَ", english: "Do not weaken and do not grieve, for you are superior.", urdu: "کمزور نہ ہو اور غمگین نہ ہو، تم ہی غالب رہو گے۔", romanUrdu: "Kamzor na ho aur ghamgeen na ho, tum hi ghaalib raho ge." },
  { surah: "Surah Ar-Ra'd [13:28]", arabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ", english: "Verily, in the remembrance of Allah do hearts find rest.", urdu: "آگاہ رہو کہ اللہ کے ذکر سے دلوں کو سکون ملتا ہے۔", romanUrdu: "Aagaah raho ke Allah ke zikr se dilon ko sukoon milta hai." },
  { surah: "Surah Al-Ankabut [29:69]", arabic: "وَٱلَّذِينَ جَـٰهَدُوا۟ فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا", english: "Those who strive for Us, We will guide them to Our ways.", urdu: "اور جو لوگ ہماری راہ میں کوشش کرتے ہیں ہم انہیں اپنے راستے دکھا دیتے ہیں۔", romanUrdu: "Aur jo log hamari raah mein koshish karte hain hum unhein apne raaste dikha dete hain." },
];

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const getIslamicDate = () => {
  try {
    const now = new Date();
    const adjusted = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-civil', { day: 'numeric', month: 'long', year: 'numeric' });
    const parts = formatter.formatToParts(adjusted);
    const day = parts.find(p => p.type === 'day')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const year = parts.find(p => p.type === 'year')?.value || '';
    return `${day} ${month} ${year}`;
  } catch { return ""; }
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useI18n();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { location, detect, setManualLocation } = useSharedLocation();
  const [citySearchOpen, setCitySearchOpen] = useState(false);
  const [silentMode, setSilentMode] = useState(() => localStorage.getItem("silent_mode") === "true");
  const [dailyAyah] = useState(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return DAILY_AYAHS[dayOfYear % DAILY_AYAHS.length];
  });

  const [ayahLang, setAyahLang] = useState<"english" | "urdu" | "romanUrdu">(() =>
    (localStorage.getItem("ayah_lang") as any) || "english"
  );

  const [hadithLang, setHadithLang] = useState<"english" | "urdu" | "romanUrdu">(() =>
    (localStorage.getItem("hadith_lang") as any) || "english"
  );

  const dailyHadith = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return DAILY_HADITHS[dayOfYear % DAILY_HADITHS.length];
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const QUICK_TOOLS = [
    { icon: BookOpen, title: t("tool.readQuran"), path: "/read-quran" },
    { icon: Languages, title: t("tool.translation"), path: "/translation" },
    { icon: Calendar, title: t("tool.islamicCalendar"), path: "/islamic-calendar" },
    { icon: Bookmark, title: t("tool.bookmarks"), path: "/bookmarks" },
    { icon: Clock, title: t("tool.namaz"), path: "/prayer-times" },
    { icon: Compass, title: t("tool.qibla"), path: "/qibla" },
    { icon: HandHeart, title: t("tool.duas"), path: "/duas" },
    { icon: BookMarked, title: t("tool.hadith"), path: "/hadith" },
  ];

  const toggleSilent = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newVal = !silentMode;
    setSilentMode(newVal);
    localStorage.setItem("silent_mode", String(newVal));
    toast({ title: newVal ? "🔕 Silent Mode On" : "🔔 Sound Mode On" });
  };

  const handleShareAyah = () => {
    shareAsImage([
      { text: dailyAyah.arabic, font: "bold 30px serif", color: "#d4a843", align: "right" },
      { text: "", font: "14px sans-serif", color: "transparent" },
      { text: dailyAyah.urdu, font: "22px serif", color: "#c8dfd0", align: "right" },
      { text: "", font: "10px sans-serif", color: "transparent" },
      { text: dailyAyah.english, font: "16px sans-serif", color: "#a8c8b0" },
      { text: "", font: "10px sans-serif", color: "transparent" },
      { text: dailyAyah.romanUrdu, font: "italic 14px sans-serif", color: "#8ab89a" },
      { text: "", font: "14px sans-serif", color: "transparent" },
      { text: `📖 ${dailyAyah.surah}`, font: "13px sans-serif", color: "rgba(255,255,255,0.45)", align: "left" },
    ], "#064e3b", 800, toast);
  };

  const handleShareHadith = () => {
    shareAsImage([
      { text: dailyHadith.arabic, font: "bold 28px serif", color: "#d4a843", align: "right" },
      { text: "", font: "14px sans-serif", color: "transparent" },
      { text: dailyHadith.urdu, font: "22px serif", color: "#c8dfd0", align: "right" },
      { text: "", font: "10px sans-serif", color: "transparent" },
      { text: dailyHadith.english, font: "16px sans-serif", color: "#a8c8b0" },
      { text: "", font: "10px sans-serif", color: "transparent" },
      { text: dailyHadith.romanUrdu, font: "italic 14px sans-serif", color: "#8ab89a" },
      { text: "", font: "14px sans-serif", color: "transparent" },
      { text: `📖 ${dailyHadith.reference}`, font: "13px sans-serif", color: "rgba(255,255,255,0.45)", align: "left" },
      { text: `— ${dailyHadith.narrator}`, font: "italic 13px sans-serif", color: "rgba(255,255,255,0.45)", align: "right" },
    ], "#064e3b", 800, toast);
  };

  const cityName = location?.city || "Detecting...";
  const prayerTimings = location?.timings || null;
  const islamicDate = getIslamicDate();
  const gregorianDate = currentTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  const getUpcomingPrayer = () => {
    if (!prayerTimings) return { name: "Loading...", time: "--:--", countdown: "00:00:00" };
    const now = currentTime;
    for (const name of PRAYER_ORDER) {
      const timeStr = prayerTimings[name];
      if (!timeStr) continue;
      const [h, m] = timeStr.split(":").map(Number);
      const target = new Date(now);
      target.setHours(h, m, 0, 0);
      if (now < target) {
        const diff = target.getTime() - now.getTime();
        const hh = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const mm = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const ss = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        return { name, time: timeStr.split(" ")[0], countdown: `${hh}:${mm}:${ss}` };
      }
    }
    const fajrStr = prayerTimings.Fajr;
    if (fajrStr) {
      const [h, m] = fajrStr.split(":").map(Number);
      const target = new Date(now);
      target.setDate(target.getDate() + 1);
      target.setHours(h, m, 0, 0);
      const diff = target.getTime() - now.getTime();
      const hh = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const mm = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const ss = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      return { name: "Fajr", time: fajrStr.split(" ")[0], countdown: `${hh}:${mm}:${ss}` };
    }
    return { name: "Fajr", time: "--:--", countdown: "00:00:00" };
  };

  const upcoming = getUpcomingPrayer();
  const prayerList = PRAYER_ORDER.map((name) => ({
    name,
    time: prayerTimings?.[name]?.split(" ")[0] || "--:--",
  }));

  return (
    <div className="px-4 py-4 space-y-6">
      {/* Location & Date Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <button onClick={() => setCitySearchOpen(true)} className="text-sm font-bold text-foreground flex items-center gap-1">
            {cityName}
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button onClick={() => detect(true)} className="active:scale-90 transition-smooth" aria-label="Detect location">
            <LocateFixed className="w-4 h-4 text-primary" />
          </button>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-foreground">{islamicDate}</p>
          <p className="text-[11px] text-muted-foreground">{gregorianDate}</p>
        </div>
      </div>

      <CitySearchDialog open={citySearchOpen} onOpenChange={setCitySearchOpen} onSelect={(lat, lng, city) => setManualLocation(lat, lng, city)} />

      {/* Prayer Banner */}
      <button
        onClick={() => navigate("/prayer-times")}
        className="w-full rounded-2xl p-5 text-left active:scale-[0.98] transition-smooth relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #064e3b, #0f3d2e, #052e22)" }}
      >
        <div className="absolute right-4 top-4 opacity-20">
          <Building className="w-20 h-20 text-white" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-white/80 font-medium">{t("home.upcomingPrayer")}</p>
            <span className="text-[11px] bg-primary text-white px-3 py-1 rounded-full font-bold">{t("home.azanAt")} {upcoming.time}</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{upcoming.name}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] text-white/60 flex items-center gap-1">
              {silentMode ? <BellOff className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
              {silentMode ? t("home.silentMode") : t("home.soundOn")}
            </span>
            <div onClick={toggleSilent} className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${silentMode ? "bg-primary" : "bg-white/20"}`}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${silentMode ? "left-[18px]" : "left-0.5"}`} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-6">
            <p className="text-4xl font-bold text-primary font-mono tracking-wider">{upcoming.countdown}</p>
            <p className="text-sm text-white/60">{t("home.remaining")}</p>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-3">
            {prayerList.map((p) => {
              const isActive = p.name === upcoming.name;
              return (
                <div key={p.name} className="text-center">
                  <p className={`text-[11px] mb-0.5 ${isActive ? "text-primary font-bold" : "text-white/50"}`}>{p.name}</p>
                  <p className={`text-sm ${isActive ? "text-primary font-bold" : "text-white/80"}`}>{p.time}</p>
                </div>
              );
            })}
          </div>
        </div>
      </button>

      {/* Quick Tools */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">{t("home.quickTools")}</h2>
        <div className="grid grid-cols-2 gap-4">
          {QUICK_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <button key={tool.path} onClick={() => navigate(tool.path)} className="flex flex-col items-center gap-3 py-5 px-3 rounded-2xl bg-card border border-primary/10 active:scale-95 transition-smooth">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground text-center leading-tight">{tool.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Ayah */}
      <div className="rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-primary/15">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">{t("home.dailyAyah")}</span>
          <div className="flex gap-1">
            {(["english", "urdu", "romanUrdu"] as const).map((l) => (
              <button key={l} onClick={() => { setAyahLang(l); localStorage.setItem("ayah_lang", l); }}
                className={`text-[9px] px-2 py-0.5 rounded-full font-medium transition-smooth ${ayahLang === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {l === "english" ? "EN" : l === "urdu" ? "UR" : "RU"}
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 py-6 bg-card space-y-4">
          <p className="text-[10px] text-primary font-semibold text-center">{dailyAyah.surah}</p>
          <p className="font-arabic text-3xl leading-[2.2] text-foreground text-center" dir="rtl">{dailyAyah.arabic}</p>
          <p className={`text-sm leading-relaxed text-muted-foreground ${ayahLang === "urdu" ? "text-right font-urdu" : ""}`} dir={ayahLang === "urdu" ? "rtl" : "ltr"}>{dailyAyah[ayahLang]}</p>
          <div className="flex items-center justify-center pt-2">
            <button onClick={handleShareAyah} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 active:scale-95 transition-smooth px-4 py-2 rounded-xl bg-primary/10">
              <Share2 className="w-4 h-4" /> {t("home.share")}
            </button>
          </div>
        </div>
      </div>

      {/* Daily Hadith */}
      <div className="rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-primary/15">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">{t("home.dailyHadith")}</span>
          <div className="flex gap-1">
            {(["english", "urdu", "romanUrdu"] as const).map((l) => (
              <button key={l} onClick={() => { setHadithLang(l); localStorage.setItem("hadith_lang", l); }}
                className={`text-[9px] px-2 py-0.5 rounded-full font-medium transition-smooth ${hadithLang === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {l === "english" ? "EN" : l === "urdu" ? "UR" : "RU"}
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 py-6 bg-card space-y-4">
          <p className="font-arabic text-xl leading-[2.2] text-foreground text-center" dir="rtl">{dailyHadith.arabic}</p>
          <p className={`text-sm leading-relaxed text-muted-foreground ${hadithLang === "urdu" ? "text-right font-urdu" : ""}`} dir={hadithLang === "urdu" ? "rtl" : "ltr"}>{dailyHadith[hadithLang]}</p>
          <div className="flex items-center justify-between pt-1">
            <p className="text-[10px] text-primary/70 font-medium">📖 {dailyHadith.reference}</p>
            <p className="text-[10px] text-muted-foreground italic">— {dailyHadith.narrator}</p>
          </div>
          <div className="flex items-center justify-center pt-1">
            <button onClick={handleShareHadith} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 active:scale-95 transition-smooth px-4 py-2 rounded-xl bg-primary/10">
              <Share2 className="w-4 h-4" /> {t("home.share")}
            </button>
          </div>
        </div>
      </div>

      {/* Support */}
      <button onClick={() => navigate("/donate")} className="w-full py-4 rounded-2xl border-2 border-primary/30 hover:border-primary/50 transition-smooth text-center active:scale-95 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--primary) / 0.15))" }}>
        <p className="text-sm font-semibold text-primary">{t("home.support")}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{t("home.supportDesc")}</p>
      </button>
    </div>
  );
};

export default Home;
