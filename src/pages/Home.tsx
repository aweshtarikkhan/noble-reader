import React from "react";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  path: string;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: "📖", iconBg: "bg-primary/20", title: "15 Line Quran (Saudi)", description: "Read page by page in traditional 15-line Mushaf format", path: "/mushaf" },
  { icon: "🕌", iconBg: "bg-emerald/20", title: "16 Line Quran (Indian)", description: "Indo-Pak style with Ruku markers • 16-line Mushaf", path: "/indian-mushaf" },
  { icon: "🌐", iconBg: "bg-secondary/20", title: "Line by Line Translation", description: "Arabic with English & Urdu translations (Tarjuma)", path: "/translation" },
  { icon: "📗", iconBg: "bg-emerald/20", title: "Tafseer Reader", description: "Translation + Tafseer in Roman Urdu (Surah / Ayat mode)", path: "/tafseer-reader" },
  { icon: "📋", iconBg: "bg-primary/20", title: "Read by Surah", description: "Browse all 114 Surahs of the Holy Quran", path: "/surah" },
  { icon: "📕", iconBg: "bg-destructive/20", title: "Read Complete Quran", description: "Complete Quran Shareef - all 604 Mushaf pages", path: "/read-quran" },
  { icon: "📚", iconBg: "bg-primary/20", title: "Read by Para / Juz", description: "Browse all 30 Paras of the Holy Quran", path: "/para" },
  { icon: "🕌", iconBg: "bg-secondary/20", title: "Sehri / Iftar & Calendar", description: "Prayer times, Islamic calendar & Ramadan timings", path: "/prayer-times" },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6">
      {/* Bismillah */}
      <div className="text-center mb-8 animate-fade-in">
        <p className="font-arabic text-3xl text-gold leading-relaxed">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        <p className="text-muted-foreground text-sm mt-2">Choose your reading mode</p>
      </div>

      {/* Menu Cards */}
      <div className="flex flex-col gap-3">
        {MENU_ITEMS.map((item, i) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-gold/10 hover:border-gold/30 transition-smooth shadow-gold hover:shadow-gold-lg text-left animate-fade-in group"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center text-2xl shrink-0`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
            </div>
            <span className="text-muted-foreground group-hover:text-gold transition-smooth">›</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
