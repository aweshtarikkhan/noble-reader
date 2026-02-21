import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Layers, Clock, Languages } from "lucide-react";
import ExitDialog from "./ExitDialog";
import ThemeToggle from "./ThemeToggle";
import { useBackHandler } from "@/hooks/useBackHandler";

const NAV_ITEMS = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/indian-mushaf", icon: BookOpen, label: "Mushraf" },
  { path: "/para", icon: Layers, label: "Para" },
  { path: "/prayer-times", icon: Clock, label: "Namaz" },
  { path: "/translation", icon: Languages, label: "Tarjuma" },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const { showExitDialog, confirmExit, cancelExit, handleBack } = useBackHandler();

  const getTitle = () => {
    const p = location.pathname;
    if (p.startsWith("/surah-read")) return "Surah Reading";
    if (p.startsWith("/surah")) return "Surahs";
    if (p.startsWith("/indian-mushaf")) return "Mushaf";
    if (p.startsWith("/mushaf")) return "Mushaf";
    if (p.startsWith("/para-read")) return "Para Reading";
    if (p.startsWith("/para")) return "Para / Juz";
    if (p.startsWith("/prayer-times")) return "Prayer Times";
    if (p.startsWith("/azaan-settings")) return "Azaan Settings";
    if (p.startsWith("/translation")) return "Translation";
    if (p.startsWith("/tafseer-read")) return "Tafseer";
    if (p.startsWith("/tafseer-reader")) return "Tafseer Reader";
    if (p.startsWith("/read-quran")) return "Complete Quran";
    if (p.startsWith("/donate")) return "Support Us";
    return "";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative z-10">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-gold">
        <div 
          className="flex items-center px-4"
          style={{ 
            paddingTop: "calc(env(safe-area-inset-top, 20px) + 4px)", 
            height: "calc(56px + env(safe-area-inset-top, 20px))" 
          }}
        >
          {!isHome ? (
            <button
              onClick={() => handleBack()}
              className="mr-3 w-9 h-9 flex items-center justify-center rounded-xl bg-card transition-smooth hover:bg-muted active:scale-95"
            >
              <span className="text-foreground text-lg">←</span>
            </button>
          ) : (
            <div className="w-9" />
          )}
          <div className="flex-1 text-center">
            {isHome ? (
              <div>
                <h1 className="font-arabic text-lg text-gold leading-tight">القرآن الكريم</h1>
                <p className="text-[10px] text-muted-foreground">The Holy Quran</p>
              </div>
            ) : (
              <h1 className="text-base font-semibold text-foreground">{getTitle()}</h1>
            )}
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main 
        className="flex-1"
        style={{
          paddingTop: "calc(56px + env(safe-area-inset-top, 20px))",
          paddingBottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-gold">
        <div className="flex items-center justify-around h-[64px]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-smooth active:scale-95 relative ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
        <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} className="bg-background/95" />
      </nav>

      <ExitDialog open={showExitDialog} onConfirm={confirmExit} onCancel={cancelExit} />
    </div>
  );
};

export default Layout;
