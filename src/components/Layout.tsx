import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/", icon: "🏠", label: "Home" },
  { path: "/mushaf", icon: "📖", label: "Mushaf" },
  { path: "/para", icon: "📚", label: "Para" },
  { path: "/prayer-times", icon: "🕌", label: "Namaz" },
  { path: "/translation", icon: "🌐", label: "Tarjuma" },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const getTitle = () => {
    const p = location.pathname;
    if (p.startsWith("/surah-read")) return "Surah Reading";
    if (p.startsWith("/surah")) return "Surahs";
    if (p.startsWith("/mushaf")) return "Mushaf";
    if (p.startsWith("/para-read")) return "Para Reading";
    if (p.startsWith("/para")) return "Para / Juz";
    if (p.startsWith("/prayer-times")) return "Prayer Times";
    if (p.startsWith("/translation")) return "Translation";
    if (p.startsWith("/tafseer-read")) return "Tafseer";
    if (p.startsWith("/tafseer-reader")) return "Tafseer Reader";
    if (p.startsWith("/read-quran")) return "Complete Quran";
    return "";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative z-10">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-gold safe-top">
        <div className="flex items-center h-[60px] px-4">
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="mr-3 w-8 h-8 flex items-center justify-center rounded-lg bg-card transition-smooth hover:bg-muted"
            >
              <span className="text-foreground">←</span>
            </button>
          )}
          <div className="flex-1 text-center">
            {isHome ? (
              <div>
                <h1 className="font-arabic text-xl text-gold leading-tight">القرآن الكريم</h1>
                <p className="text-xs text-muted-foreground">The Holy Quran</p>
              </div>
            ) : (
              <h1 className="text-base font-semibold text-foreground">{getTitle()}</h1>
            )}
          </div>
          {!isHome && <div className="w-8" />}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pt-[calc(60px+env(safe-area-inset-top,0px))] pb-[calc(64px+env(safe-area-inset-bottom,0px))]">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-gold safe-bottom">
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-smooth ${
                  isActive ? "text-gold scale-110" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
