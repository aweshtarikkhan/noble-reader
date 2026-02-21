import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Languages, List, BookCopy, MapPin, Share2, PlayCircle, ListOrdered, Building, Clock, LocateFixed } from "lucide-react";
import { QuranAPI } from "@/lib/quranApi";

const QUICK_TOOLS = [
  { icon: ListOrdered, title: "16 line", path: "/indian-mushaf" },
  { icon: Languages, title: "Translation", path: "/translation" },
  { icon: List, title: "By Surah", path: "/surah" },
  { icon: BookOpen, title: "Full Quraan", path: "/read-quran" },
  { icon: BookCopy, title: "Para/Zuz", path: "/para" },
  { icon: Clock, title: "Namaz", path: "/prayer-times" },
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
    // Indian Barelvi calendar runs ~1 day behind islamic-civil
    // Subtract 1 day from current date before formatting
    const now = new Date();
    const adjusted = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-civil', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    return formatter.format(adjusted);
  } catch {
    return "";
  }
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cityName, setCityName] = useState("Detecting...");
  const [prayerTimings, setPrayerTimings] = useState<Record<string, string> | null>(null);
  const [dailyAyah] = useState(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return DAILY_AYAHS[dayOfYear % DAILY_AYAHS.length];
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const detectLocation = () => {
    setCityName("Detecting...");
    if (!navigator.geolocation) {
      setCityName("Not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const [result, city] = await Promise.all([
            QuranAPI.getPrayerTimes(pos.coords.latitude, pos.coords.longitude, 1, 1),
            QuranAPI.reverseGeocode(pos.coords.latitude, pos.coords.longitude),
          ]);
          setPrayerTimings(result.timings);
          setCityName(city);
        } catch {
          setCityName("Unknown");
        }
      },
      () => setCityName("Location denied")
    );
  };

  // Fetch real prayer times and location on mount
  useEffect(() => {
    detectLocation();
  }, []);

  const islamicDate = getIslamicDate();
  const gregorianDate = currentTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  // Calculate upcoming prayer dynamically
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
    // All prayers passed, next is Fajr tomorrow
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
          <p className="text-sm font-bold text-foreground">{cityName}</p>
          <button onClick={detectLocation} className="active:scale-90 transition-smooth" aria-label="Detect location">
            <LocateFixed className="w-4 h-4 text-primary" />
          </button>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-foreground">{islamicDate}</p>
          <p className="text-[11px] text-muted-foreground">{gregorianDate}</p>
        </div>
      </div>

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
              ATHAN AT {upcoming.time}
            </span>
          </div>

          <p className="text-3xl font-bold text-white mb-1">{upcoming.name}</p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] text-white/60 flex items-center gap-1">
              🔕 Silent Mode
            </span>
            <div className="w-9 h-5 bg-white/20 rounded-full relative">
              <div className="w-4 h-4 bg-white/50 rounded-full absolute top-0.5 left-0.5" />
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
        <div className="grid grid-cols-3 gap-4">
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
            <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-smooth">
              <Share2 className="w-4 h-4" />
              SHARE
            </button>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-smooth">
              <PlayCircle className="w-4 h-4" />
              LISTEN
            </button>
          </div>
        </div>
      </div>

      {/* Support Link */}
      <button
        onClick={() => navigate("/donate")}
        className="w-full py-3 rounded-2xl bg-card border border-primary/10 hover:border-primary/30 transition-smooth text-center active:scale-95"
      >
        <p className="text-xs text-muted-foreground">
          💝 Support future updates with a small contribution
        </p>
      </button>
    </div>
  );
};

export default Home;
