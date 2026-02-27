import React, { createContext, useContext, useState, useEffect } from "react";

export type AppLanguage = "en" | "ur" | "hi";

type Translations = Record<string, Record<AppLanguage, string>>;

const T: Translations = {
  // Navigation
  "nav.home": { en: "Home", ur: "ہوم", hi: "होम" },
  "nav.quran": { en: "Quran", ur: "قرآن", hi: "क़ुरआन" },
  "nav.continue": { en: "Continue", ur: "جاری", hi: "जारी" },
  "nav.audio": { en: "Audio", ur: "آڈیو", hi: "ऑडियो" },
  "nav.namaz": { en: "Namaz", ur: "نماز", hi: "नमाज़" },

  // Header
  "header.holyQuran": { en: "The Holy Quran", ur: "قرآن مجید", hi: "पवित्र क़ुरआन" },

  // Quick Tools
  "tool.readQuran": { en: "Read Quran", ur: "قرآن پڑھیں", hi: "क़ुरआन पढ़ें" },
  "tool.translation": { en: "Translation", ur: "ترجمہ", hi: "अनुवाद" },
  "tool.audioQuran": { en: "Audio Quran", ur: "آڈیو قرآن", hi: "ऑडियो क़ुरआन" },
  "tool.bookmarks": { en: "Bookmarks", ur: "بک مارکس", hi: "बुकमार्क" },
  "tool.namaz": { en: "Namaz", ur: "نماز", hi: "नमाज़" },
  "tool.qibla": { en: "Qibla", ur: "قبلہ", hi: "क़िबला" },
  "tool.duas": { en: "Duas", ur: "دعائیں", hi: "दुआएं" },
  "tool.hadith": { en: "Hadith", ur: "حدیث", hi: "हदीस" },

  // Home
  "home.quickTools": { en: "Quick Tools", ur: "فوری ٹولز", hi: "त्वरित उपकरण" },
  "home.dailyAyah": { en: "Daily Ayah", ur: "آج کی آیت", hi: "आज की आयत" },
  "home.dailyHadith": { en: "Daily Hadith", ur: "آج کی حدیث", hi: "आज की हदीस" },
  "home.upcomingPrayer": { en: "Upcoming Prayer", ur: "آنے والی نماز", hi: "आगामी नमाज़" },
  "home.remaining": { en: "remaining", ur: "باقی", hi: "शेष" },
  "home.share": { en: "SHARE", ur: "شیئر", hi: "शेयर" },
  "home.support": { en: "💝 Support Future Updates", ur: "💝 مستقبل کی اپ ڈیٹس کی حمایت کریں", hi: "💝 भविष्य के अपडेट का समर्थन करें" },
  "home.supportDesc": { en: "Your small contribution keeps this app free for everyone", ur: "آپ کا چھوٹا سا تعاون اس ایپ کو سب کے لیے مفت رکھتا ہے", hi: "आपका छोटा योगदान इस ऐप को सबके लिए मुफ़्त रखता है" },
  "home.azanAt": { en: "AZAN AT", ur: "اذان", hi: "अज़ान" },
  "home.silentMode": { en: "Silent Mode", ur: "خاموش موڈ", hi: "साइलेंट मोड" },
  "home.soundOn": { en: "Sound On", ur: "آواز آن", hi: "आवाज़ चालू" },

  // Settings / Profile
  "settings.title": { en: "Settings", ur: "ترتیبات", hi: "सेटिंग्स" },
  "settings.profile": { en: "Profile", ur: "پروفائل", hi: "प्रोफ़ाइल" },
  "settings.language": { en: "App Language", ur: "ایپ کی زبان", hi: "ऐप भाषा" },
  "settings.theme": { en: "Theme", ur: "تھیم", hi: "थीम" },
  "settings.dark": { en: "Dark", ur: "ڈارک", hi: "डार्क" },
  "settings.light": { en: "Light", ur: "لائٹ", hi: "लाइट" },
  "settings.auto": { en: "Auto", ur: "خودکار", hi: "ऑटो" },
  "settings.name": { en: "Your Name", ur: "آپ کا نام", hi: "आपका नाम" },
  "settings.readingProgress": { en: "Reading Progress", ur: "پڑھنے کی پیشرفت", hi: "पढ़ने की प्रगति" },
  "settings.totalBookmarks": { en: "Total Bookmarks", ur: "کل بک مارکس", hi: "कुल बुकमार्क" },
  "settings.favDuas": { en: "Pinned Duas", ur: "پن کی گئی دعائیں", hi: "पिन की गई दुआएं" },
  "settings.savedHadith": { en: "Saved Hadith Books", ur: "محفوظ حدیث کتابیں", hi: "सहेजी गई हदीस किताबें" },

  // Pages
  "page.surahReading": { en: "Surah Reading", ur: "سورۃ کی تلاوت", hi: "सूरह पाठ" },
  "page.surahs": { en: "Surahs", ur: "سورتیں", hi: "सूरतें" },
  "page.readQuran": { en: "Read Quran", ur: "قرآن پڑھیں", hi: "क़ुरआन पढ़ें" },
  "page.bookmarks": { en: "Bookmarks", ur: "بک مارکس", hi: "बुकमार्क" },
  "page.qibla": { en: "Qibla Direction", ur: "قبلہ کی سمت", hi: "क़िबला दिशा" },
  "page.duas": { en: "Duas", ur: "دعائیں", hi: "दुआएं" },
  "page.quranAudio": { en: "Quran Audio", ur: "قرآن آڈیو", hi: "क़ुरआन ऑडियो" },
  "page.paraReading": { en: "Para Reading", ur: "پارہ پڑھنا", hi: "पारा पढ़ना" },
  "page.para": { en: "Para / Juz", ur: "پارہ / جز", hi: "पारा / जुज़" },
  "page.prayerTimes": { en: "Prayer Times", ur: "نماز کے اوقات", hi: "नमाज़ के समय" },
  "page.azaanSettings": { en: "Azaan Settings", ur: "اذان کی ترتیبات", hi: "अज़ान सेटिंग्स" },
  "page.translation": { en: "Translation", ur: "ترجمہ", hi: "अनुवाद" },
  "page.tafseer": { en: "Tafseer", ur: "تفسیر", hi: "तफ़सीर" },
  "page.donate": { en: "Support Us", ur: "ہماری مدد کریں", hi: "हमारा सहयोग करें" },
  "page.hadith": { en: "Hadith", ur: "حدیث", hi: "हदीस" },
  "page.settings": { en: "Settings", ur: "ترتیبات", hi: "सेटिंग्स" },
};

type I18nContextType = {
  lang: AppLanguage;
  setLang: (l: AppLanguage) => void;
  t: (key: string) => string;
  isRTL: boolean;
};

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
  isRTL: false,
});

export const useI18n = () => useContext(I18nContext);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<AppLanguage>(() =>
    (localStorage.getItem("app_lang") as AppLanguage) || "en"
  );

  const setLang = (l: AppLanguage) => {
    setLangState(l);
    localStorage.setItem("app_lang", l);
  };

  const t = (key: string): string => {
    return T[key]?.[lang] || T[key]?.en || key;
  };

  const isRTL = lang === "ur";

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
};
