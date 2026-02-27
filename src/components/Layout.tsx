import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Headphones, Clock, PlayCircle } from "lucide-react";
import ExitDialog from "./ExitDialog";
import ThemeToggle from "./ThemeToggle";
import { useBackHandler } from "@/hooks/useBackHandler";
import { getBookmarks } from "@/lib/bookmarks";

const NAV_ITEMS = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/read-quran", icon: BookOpen, label: "Quran" },
  { path: "__continue__", icon: PlayCircle, label: "Continue" },
  { path: "/quran-audio", icon: Headphones, label: "Audio" },
  { path: "/prayer-times", icon: Clock, label: "Namaz" },
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
    if (p.startsWith("/indian-mushaf")) return "Read Quran";
    if (p.startsWith("/mushaf")) return "Read Quran";
    if (p.startsWith("/read-quran")) return "Read Quran";
    if (p.startsWith("/bookmarks")) return "Bookmarks";
    if (p.startsWith("/qibla")) return "Qibla Direction";
    if (p.startsWith("/duas")) return "Duas";
    if (p.startsWith("/quran-audio")) return "Quran Audio";
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
            const isContinue = item.path === "__continue__";
            const isActive = isContinue
              ? false
              : location.pathname === item.path || 
                (item.path !== "/" && location.pathname.startsWith(item.path));
            
            const handleClick = () => {
              if (isContinue) {
                const bookmarks = getBookmarks();
                if (bookmarks.length > 0) {
                  const last = bookmarks[0];
                  if (last.mode === "complete") {
                    navigate(`/mushaf?page=${last.page}&style=${last.style === "indopak" ? "indopak" : "saudi"}`);
                  } else if (last.mode === "para" && last.paraNum) {
                    navigate(`/para-read/${last.paraNum}?page=${last.page}&style=${last.style}`);
                  } else if (last.mode === "surah" && last.surahNum) {
                    navigate(`/surah-read/${last.surahNum}?page=${last.page}&style=${last.style}`);
                  } else {
                    navigate("/bookmarks");
                  }
                } else {
                  navigate("/bookmarks");
                }
              } else {
                navigate(item.path);
              }
            };

            return (
              <button
                key={item.path}
                onClick={handleClick}
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
