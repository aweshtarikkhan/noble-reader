import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Globe, List, Book, Layers, Clock } from "lucide-react";

interface PrayerTime {
  name: string;
  time: string;
}

const QUICK_TOOLS = [
  { icon: BookOpen, title: "16 Line", path: "/indian-mushaf" },
  { icon: Globe, title: "Translation", path: "/translation" },
  { icon: List, title: "Surah", path: "/surah" },
  { icon: Book, title: "Full Quran", path: "/read-quran" },
  { icon: Layers, title: "Para / Juz", path: "/para" },
  { icon: Clock, title: "Namaz", path: "/prayer-times" },
];

const DAILY_AYAHS = [
  { surah: "Surah Ash-Sharh [94:5]", arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا", translation: '"For indeed, with hardship [will be] ease."' },
  { surah: "Surah Al-Baqarah [2:286]", arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا", translation: '"Allah does not burden a soul beyond that it can bear."' },
  { surah: "Surah Al-Imran [3:139]", arabic: "وَلَا تَهِنُوا۟ وَلَا تَحْزَنُوا۟ وَأَنتُمُ ٱلْأَعْلَوْنَ", translation: '"Do not weaken and do not grieve, for you are superior."' },
  { surah: "Surah Ar-Ra'd [13:28]", arabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ", translation: '"Verily, in the remembrance of Allah do hearts find rest."' },
  { surah: "Surah Al-Ankabut [29:69]", arabic: "وَٱلَّذِينَ جَـٰهَدُوا۟ فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا", translation: '"Those who strive for Us, We will guide them to Our ways."' },
];

const getIslamicDate = () => {
  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    return formatter.format(new Date());
  } catch {
    return "";
  }
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyAyah] = useState(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return DAILY_AYAHS[dayOfYear % DAILY_AYAHS.length];
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const islamicDate = getIslamicDate();
  const gregorianDate = currentTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="px-4 py-5 space-y-6">
      {/* Date Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <p className="text-sm font-semibold text-foreground">{islamicDate}</p>
          <p className="text-[11px] text-muted-foreground">{gregorianDate}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Prayer Banner */}
      <button
        onClick={() => navigate("/prayer-times")}
        className="w-full rounded-2xl p-5 text-left animate-fade-in active:scale-[0.98] transition-smooth"
        style={{
          animationDelay: "0.05s",
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--secondary) / 0.1))",
          border: "1px solid hsl(var(--gold) / 0.2)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Upcoming Prayer</p>
          <span className="text-[10px] bg-primary/20 text-gold px-2.5 py-1 rounded-full font-semibold">
            View Times →
          </span>
        </div>
        <p className="font-arabic text-2xl text-gold mb-1">🕌 Prayer Times</p>
        <p className="text-xs text-muted-foreground">Tap to view Sehri, Iftar & Namaz times</p>
      </button>

      {/* Quick Tools */}
      <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <h2 className="text-sm font-semibold text-foreground mb-3">Quick Tools</h2>
        <div className="grid grid-cols-3 gap-3">
          {QUICK_TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.path}
                onClick={() => navigate(tool.path)}
                className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl bg-card border border-gold/10 hover:border-gold/30 transition-smooth active:scale-90 active:shadow-none shadow-gold group animate-fade-in"
                style={{ animationDelay: `${0.12 + i * 0.05}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center group-active:scale-110 transition-smooth">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <span className="text-[11px] font-medium text-foreground">{tool.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Ayah */}
      <div
        className="rounded-2xl overflow-hidden animate-fade-in"
        style={{ animationDelay: "0.35s" }}
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-primary/15 border border-gold/15 rounded-t-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gold">Daily Ayah</span>
          <span className="text-[10px] font-semibold text-gold">{dailyAyah.surah}</span>
        </div>
        <div className="px-4 py-6 bg-card border border-t-0 border-gold/10 rounded-b-2xl text-center space-y-4">
          <p className="font-arabic text-2xl leading-[2.2] text-arabic" dir="rtl">
            {dailyAyah.arabic}
          </p>
          <p className="text-sm italic text-muted-foreground leading-relaxed">
            {dailyAyah.translation}
          </p>
        </div>
      </div>

      {/* Support Link */}
      <button
        onClick={() => navigate("/donate")}
        className="w-full py-3 rounded-2xl bg-card border border-gold/10 hover:border-gold/30 transition-smooth text-center animate-fade-in active:scale-95"
        style={{ animationDelay: "0.4s" }}
      >
        <p className="text-xs text-muted-foreground">
          💝 Support future updates with a small contribution
        </p>
      </button>
    </div>
  );
};

export default Home;
