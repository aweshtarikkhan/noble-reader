import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Languages, List, BookCopy, MapPin, Share2, Clock, LocateFixed, Compass, Search, Building, BellOff, Bell, Headphones, Bookmark, HandHeart } from "lucide-react";
import { useSharedLocation } from "@/hooks/useSharedLocation";
import CitySearchDialog from "@/components/CitySearchDialog";
import { useToast } from "@/hooks/use-toast";

const QUICK_TOOLS = [
  { icon: BookOpen, title: "Read Quran", path: "/read-quran" },
  { icon: Languages, title: "Translation", path: "/translation" },
  { icon: List, title: "By Surah", path: "/surah" },
  { icon: BookCopy, title: "Para/Juz", path: "/para" },
  { icon: Headphones, title: "Audio Quran", path: "/quran-audio" },
  { icon: Bookmark, title: "Bookmarks", path: "/bookmarks" },
  { icon: HandHeart, title: "Duas", path: "/duas" },
  { icon: Clock, title: "Namaz", path: "/prayer-times" },
  { icon: Compass, title: "Qibla", path: "/qibla" },
];

const DAILY_AYAHS = [
  { surah: "Surah Ash-Sharh [94:5]", arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا", translation: '"For indeed, with hardship [will be] ease."' },
  { surah: "Surah Al-Baqarah [2:286]", arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا", translation: '"Allah does not burden a soul beyond that it can bear."' },
  { surah: "Surah Al-Imran [3:139]", arabic: "وَلَا تَهِنُوا۟ وَلَا تَحْزَنُوا۟ وَأَنتُمُ ٱلْأَعْلَوْنَ", translation: '"Do not weaken and do not grieve, for you are superior."' },
  { surah: "Surah Ar-Ra'd [13:28]", arabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ", translation: '"Verily, in the remembrance of Allah do hearts find rest."' },
  { surah: "Surah Al-Ankabut [29:69]", arabic: "وَٱلَّذِينَ جَـٰهَدُوا۟ فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا", translation: '"Those who strive for Us, We will guide them to Our ways."' },
];

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const getIslamicDate = () => {
  try {
    const now = new Date();
    const adjusted = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-civil', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    const parts = formatter.formatToParts(adjusted);
    const day = parts.find(p => p.type === 'day')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const year = parts.find(p => p.type === 'year')?.value || '';
    return `${day} ${month} ${year}`;
  } catch {
    return "";
  }
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { location, detect, setManualLocation } = useSharedLocation();
  const [citySearchOpen, setCitySearchOpen] = useState(false);
  const [silentMode, setSilentMode] = useState(() => localStorage.getItem("silent_mode") === "true");
  const [dailyAyah] = useState(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return DAILY_AYAHS[dayOfYear % DAILY_AYAHS.length];
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSilent = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newVal = !silentMode;
    setSilentMode(newVal);
    localStorage.setItem("silent_mode", String(newVal));
    toast({
      title: newVal ? "🔕 Silent Mode On" : "🔔 Sound Mode On",
      description: newVal ? "Azan notifications will be silent" : "Azan notifications will play sound",
    });
  };

  const handleShare = async () => {
    const text = `${dailyAyah.arabic}\n\n${dailyAyah.translation}\n\n— ${dailyAyah.surah}\n\nNoble Quran Reader`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Daily Ayah", text });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
        toast({ title: "Copied!", description: "Ayah copied to clipboard" });
      } catch {
        toast({ title: "Share not supported", description: "Could not share on this device", variant: "destructive" });
      }
    }
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

      <CitySearchDialog
        open={citySearchOpen}
        onOpenChange={setCitySearchOpen}
        onSelect={(lat, lng, city) => setManualLocation(lat, lng, city)}
      />

      {/* Prayer Banner Card */}
      <button
        onClick={() => navigate("/prayer-times")}
        className="w-full rounded-2xl p-5 text-left active:scale-[0.98] transition-smooth relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #064e3b, #0f3d2e, #052e22)",
        }}
      >
        <div className="absolute right-4 top-4 opacity-20">
          <Building className="w-20 h-20 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-white/80 font-medium">Upcoming Prayer</p>
            <span className="text-[11px] bg-primary text-white px-3 py-1 rounded-full font-bold">
              AZAN AT {upcoming.time}
            </span>
          </div>

          <p className="text-3xl font-bold text-white mb-1">{upcoming.name}</p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] text-white/60 flex items-center gap-1">
              {silentMode ? <BellOff className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
              {silentMode ? "Silent Mode" : "Sound On"}
            </span>
            <div
              onClick={toggleSilent}
              className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${silentMode ? "bg-primary" : "bg-white/20"}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${silentMode ? "left-[18px]" : "left-0.5"}`} />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <p className="text-4xl font-bold text-primary font-mono tracking-wider">{upcoming.countdown}</p>
            <p className="text-sm text-white/60">remaining</p>
          </div>

          <div className="flex justify-between border-t border-white/10 pt-3">
            {prayerList.map((p) => {
              const isActive = p.name === upcoming.name;
              return (
                <div key={p.name} className="text-center">
                  <p className={`text-[11px] mb-0.5 ${isActive ? "text-primary font-bold" : "text-white/50"}`}>
                    {p.name}
                  </p>
                  <p className={`text-sm ${isActive ? "text-primary font-bold" : "text-white/80"}`}>
                    {p.time}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </button>

      {/* Quick Tools */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Quick Tools</h2>
        <div className="grid grid-cols-2 gap-4">
          {QUICK_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.path}
                onClick={() => navigate(tool.path)}
                className="flex flex-col items-center gap-2.5 py-4 px-2 rounded-2xl bg-card active:scale-90 transition-smooth"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground">{tool.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Ayah */}
      <div className="rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-primary/15">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">Daily Ayah</span>
          <span className="text-[11px] font-semibold text-primary">{dailyAyah.surah}</span>
        </div>
        <div className="px-5 py-8 bg-card text-center space-y-5">
          <p className="font-arabic text-3xl leading-[2.2] text-foreground" dir="rtl">
            {dailyAyah.arabic}
          </p>
          <p className="text-sm italic text-muted-foreground leading-relaxed">
            {dailyAyah.translation}
          </p>
          <div className="flex items-center justify-center gap-6 pt-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 active:scale-95 transition-smooth px-4 py-2 rounded-xl bg-primary/10"
            >
              <Share2 className="w-4 h-4" />
              SHARE
            </button>
          </div>
        </div>
      </div>

      {/* Support Link - Highlighted */}
      <button
        onClick={() => navigate("/donate")}
        className="w-full py-4 rounded-2xl border-2 border-primary/30 hover:border-primary/50 transition-smooth text-center active:scale-95 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--primary) / 0.15))",
        }}
      >
        <p className="text-sm font-semibold text-primary">
          💝 Support Future Updates
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Your small contribution keeps this app free for everyone
        </p>
      </button>
    </div>
  );
};

export default Home;
