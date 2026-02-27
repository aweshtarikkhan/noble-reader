import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Languages, Clock, PlayCircle, Settings } from "lucide-react";
import ExitDialog from "./ExitDialog";
import { useBackHandler } from "@/hooks/useBackHandler";
import { getBookmarks } from "@/lib/bookmarks";
import { useI18n } from "@/lib/i18n";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const { showExitDialog, confirmExit, cancelExit, handleBack } = useBackHandler();
  const { t } = useI18n();

  const NAV_ITEMS = [
    { path: "/", icon: Home, label: t("nav.home") },
    { path: "/read-quran", icon: BookOpen, label: t("nav.quran") },
    { path: "__continue__", icon: PlayCircle, label: t("nav.continue") },
    { path: "/translation", icon: Languages, label: t("nav.translation") },
    { path: "/prayer-times", icon: Clock, label: t("nav.namaz") },
  ];

  const getTitle = () => {
    const p = location.pathname;
    if (p.startsWith("/surah-read")) return t("page.surahReading");
    if (p.startsWith("/surah")) return t("page.surahs");
    if (p.startsWith("/indian-mushaf")) return t("page.readQuran");
    if (p.startsWith("/mushaf")) return t("page.readQuran");
    if (p.startsWith("/read-quran")) return t("page.readQuran");
    if (p.startsWith("/bookmarks")) return t("page.bookmarks");
    if (p.startsWith("/qibla")) return t("page.qibla");
    if (p.startsWith("/duas")) return t("page.duas");
    if (p.startsWith("/quran-audio")) return t("page.quranAudio");
    if (p.startsWith("/islamic-calendar")) return t("page.islamicCalendar");
    if (p.startsWith("/para-read")) return t("page.paraReading");
    if (p.startsWith("/para")) return t("page.para");
    if (p.startsWith("/prayer-times")) return t("page.prayerTimes");
    if (p.startsWith("/azaan-settings")) return t("page.azaanSettings");
    if (p.startsWith("/translation")) return t("page.translation");
    if (p.startsWith("/tafseer-read")) return t("page.tafseer");
    if (p.startsWith("/tafseer-reader")) return t("page.tafseer");
    if (p.startsWith("/donate")) return t("page.donate");
    if (p.startsWith("/hadith")) return t("page.hadith");
    if (p.startsWith("/settings")) return t("page.settings");
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
                <p className="text-[10px] text-muted-foreground">{t("header.holyQuran")}</p>
              </div>
            ) : (
              <h1 className="text-base font-semibold text-foreground">{getTitle()}</h1>
            )}
          </div>
          <button
            onClick={() => navigate("/settings")}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-card transition-smooth hover:bg-muted active:scale-90"
            aria-label="Settings"
          >
            <Settings size={18} className="text-primary" />
          </button>
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
