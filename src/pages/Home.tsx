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
  { icon: "📖", iconBg: "bg-primary/20", title: "16 Line Quran", description: "Indo-Pak Mushaf", path: "/indian-mushaf" },
  { icon: "🌐", iconBg: "bg-secondary/20", title: "Translation", description: "English & Urdu", path: "/translation" },
  { icon: "📋", iconBg: "bg-primary/20", title: "Read by Surah", description: "114 Surahs", path: "/surah" },
  { icon: "📕", iconBg: "bg-destructive/20", title: "Complete Quran", description: "604 Pages", path: "/read-quran" },
  { icon: "📚", iconBg: "bg-primary/20", title: "Para / Juz", description: "30 Paras", path: "/para" },
  { icon: "🕌", iconBg: "bg-secondary/20", title: "Namaz Times", description: "Sehri & Iftar", path: "/prayer-times" },
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
      <div className="grid grid-cols-2 gap-2.5">
        {MENU_ITEMS.map((item, i) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-card border border-gold/10 hover:border-gold/30 transition-smooth shadow-gold hover:shadow-gold-lg text-center animate-fade-in group active:scale-90 active:shadow-none"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className={`w-11 h-11 rounded-lg ${item.iconBg} flex items-center justify-center text-2xl mb-2 group-active:scale-110 transition-smooth`}>
              {item.icon}
            </div>
            <h3 className="font-semibold text-foreground text-xs leading-tight">{item.title}</h3>
            <p className="text-[9px] text-muted-foreground mt-0.5">{item.description}</p>
          </button>
        ))}
      </div>

      {/* Support Link */}
      <button
        onClick={() => navigate("/donate")}
        className="w-full mt-6 py-3 rounded-2xl bg-card border border-gold/10 hover:border-gold/30 transition-smooth text-center animate-fade-in"
        style={{ animationDelay: `${MENU_ITEMS.length * 0.07 + 0.1}s` }}
      >
        <p className="text-xs text-muted-foreground">
          💝 If you enjoy using this app, a small contribution helps support future updates
        </p>
      </button>
    </div>
  );
};

export default Home;
