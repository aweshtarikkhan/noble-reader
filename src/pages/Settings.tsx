import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Languages, Sun, Moon, Monitor, Camera, BookOpen, Bookmark, Heart, BookMarked } from "lucide-react";
import { useI18n, type AppLanguage } from "@/lib/i18n";
import { getBookmarks } from "@/lib/bookmarks";
import { useToast } from "@/hooks/use-toast";

type ThemeMode = "dark" | "light" | "auto";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { lang, setLang, t } = useI18n();

  const [name, setName] = useState(() => localStorage.getItem("user_name") || "");
  const [avatar, setAvatar] = useState(() => localStorage.getItem("user_avatar") || "");
  const [themeMode, setThemeMode] = useState<ThemeMode>(() =>
    (localStorage.getItem("theme_mode") as ThemeMode) || "dark"
  );

  // Stats
  const bookmarks = getBookmarks();
  const pinnedDuas = JSON.parse(localStorage.getItem("dua_pins") || "[]").length;
  const savedHadithBooks = JSON.parse(localStorage.getItem("hadith_saved_books") || "[]").length;

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    let isDark: boolean;

    if (mode === "auto") {
      const hour = new Date().getHours();
      isDark = hour < 6 || hour >= 18; // Dark from 6 PM to 6 AM
    } else {
      isDark = mode === "dark";
    }

    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", isDark ? "dark" : "light");
    localStorage.setItem("theme_mode", mode);
  };

  useEffect(() => {
    applyTheme(themeMode);

    if (themeMode === "auto") {
      const interval = setInterval(() => applyTheme("auto"), 60000);
      return () => clearInterval(interval);
    }
  }, [themeMode]);

  const handleTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    applyTheme(mode);
  };

  const handleSaveName = () => {
    localStorage.setItem("user_name", name);
    toast({ title: "Saved!", description: "Profile name updated" });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatar(dataUrl);
      localStorage.setItem("user_avatar", dataUrl);
      toast({ title: "Saved!", description: "Profile photo updated" });
    };
    reader.readAsDataURL(file);
  };

  const LANGUAGES: { id: AppLanguage; label: string; native: string }[] = [
    { id: "en", label: "English", native: "English" },
    { id: "ur", label: "Urdu", native: "اردو" },
    { id: "hi", label: "Hindi", native: "हिंदी" },
  ];

  const THEMES: { id: ThemeMode; icon: React.ReactNode; label: string }[] = [
    { id: "dark", icon: <Moon className="w-4 h-4" />, label: t("settings.dark") },
    { id: "light", icon: <Sun className="w-4 h-4" />, label: t("settings.light") },
    { id: "auto", icon: <Monitor className="w-4 h-4" />, label: t("settings.auto") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="active:scale-90 transition-smooth">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">{t("settings.title")}</h1>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Profile */}
        <div className="rounded-2xl bg-card border border-border p-4 space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> {t("settings.profile")}
          </h2>
          <div className="flex items-center gap-4">
            <label className="relative cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-primary/50" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Camera className="w-3 h-3 text-primary-foreground" />
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
            <div className="flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSaveName}
                placeholder={t("settings.name")}
                className="w-full text-sm bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Languages className="w-4 h-4 text-primary" /> {t("settings.language")}
          </h2>
          <div className="flex gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-smooth ${
                  lang === l.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <span className="block">{l.native}</span>
                <span className="block text-[9px] opacity-70">{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sun className="w-4 h-4 text-primary" /> {t("settings.theme")}
          </h2>
          <div className="flex gap-2">
            {THEMES.map((th) => (
              <button
                key={th.id}
                onClick={() => handleTheme(th.id)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-smooth flex flex-col items-center gap-1.5 ${
                  themeMode === th.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {th.icon}
                {th.label}
              </button>
            ))}
          </div>
          {themeMode === "auto" && (
            <p className="text-[10px] text-muted-foreground text-center">
              {lang === "ur" ? "شام 6 بجے سے صبح 6 بجے تک ڈارک، باقی لائٹ" : lang === "hi" ? "शाम 6 से सुबह 6 तक डार्क, बाकी लाइट" : "Dark 6 PM – 6 AM, Light otherwise"}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" /> {t("settings.readingProgress")}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center py-3 rounded-xl bg-muted/50">
              <Bookmark className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{bookmarks.length}</p>
              <p className="text-[9px] text-muted-foreground">{t("settings.totalBookmarks")}</p>
            </div>
            <div className="text-center py-3 rounded-xl bg-muted/50">
              <Heart className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{pinnedDuas}</p>
              <p className="text-[9px] text-muted-foreground">{t("settings.favDuas")}</p>
            </div>
            <div className="text-center py-3 rounded-xl bg-muted/50">
              <BookMarked className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{savedHadithBooks}</p>
              <p className="text-[9px] text-muted-foreground">{t("settings.savedHadith")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
