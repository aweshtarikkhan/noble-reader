import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, MapPin, Moon, Star, Globe, Minus, Plus } from "lucide-react";
import { useSharedLocation } from "@/hooks/useSharedLocation";
import { useI18n } from "@/lib/i18n";
import { QuranAPI } from "@/lib/quranApi";

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
  "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhul Qi'dah", "Dhul Hijjah"
];

const HIJRI_MONTHS_AR = [
  "محرم", "صفر", "ربیع الاول", "ربیع الثانی",
  "جمادی الاولیٰ", "جمادی الثانی", "رجب", "شعبان",
  "رمضان", "شوال", "ذوالقعدہ", "ذوالحجہ"
];

const HIJRI_MONTHS_SHORT = [
  "Muh", "Saf", "R.Aw", "R.Th",
  "J.Ul", "J.Th", "Raj", "Sha",
  "Ram", "Shw", "DhQ", "DhH"
];

const HIJRI_MONTHS_AR_SHORT = [
  "محرم", "صفر", "ر.اول", "ر.ثانی",
  "ج.اولیٰ", "ج.ثانی", "رجب", "شعبان",
  "رمضان", "شوال", "ذ.قعدہ", "ذ.حجہ"
];

const GREGORIAN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const GREGORIAN_MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_UR = ["اتوار", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"];
const WEEKDAYS_HI = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];

const IMPORTANT_DATES: Record<string, { en: string; ur: string; hi: string }> = {
  "1-1": { en: "Islamic New Year", ur: "اسلامی نیا سال", hi: "इस्लामी नया साल" },
  "1-10": { en: "Day of Ashura", ur: "یوم عاشورہ", hi: "आशूरा का दिन" },
  "3-12": { en: "Eid Milad-un-Nabi ﷺ", ur: "عید میلاد النبی ﷺ", hi: "ईद मीलाद-उन-नबी ﷺ" },
  "7-27": { en: "Shab-e-Meraj", ur: "شب معراج", hi: "शब-ए-मेराज" },
  "8-15": { en: "Shab-e-Barat", ur: "شب برات", hi: "शब-ए-बारात" },
  "9-1": { en: "Ramadan Begins", ur: "رمضان شروع", hi: "रमज़ान शुरू" },
  "9-27": { en: "Laylat al-Qadr (est.)", ur: "شب قدر (تخمینی)", hi: "लैलतुल क़द्र (अनु.)" },
  "10-1": { en: "Eid ul-Fitr", ur: "عید الفطر", hi: "ईद-उल-फ़ित्र" },
  "12-8": { en: "Hajj Begins", ur: "حج شروع", hi: "हज शुरू" },
  "12-9": { en: "Day of Arafah", ur: "یوم عرفہ", hi: "अरफ़ा का दिन" },
  "12-10": { en: "Eid ul-Adha", ur: "عید الاضحی", hi: "ईद-उल-अज़हा" },
};

const GREGORIAN_IMPORTANT_DATES: Record<string, { en: string; ur: string; hi: string }> = {
  "1-1": { en: "New Year's Day", ur: "نیا سال", hi: "नया साल" },
  "1-26": { en: "Republic Day (India)", ur: "یوم جمہوریہ (بھارت)", hi: "गणतंत्र दिवस (भारत)" },
  "2-5": { en: "Kashmir Day", ur: "یوم کشمیر", hi: "कश्मीर दिवस" },
  "2-14": { en: "Valentine's Day", ur: "ویلنٹائن ڈے", hi: "वैलेंटाइन डे" },
  "3-8": { en: "International Women's Day", ur: "خواتین کا عالمی دن", hi: "अंतर्राष्ट्रीय महिला दिवस" },
  "3-23": { en: "Pakistan Day", ur: "یوم پاکستان", hi: "पाकिस्तान दिवस" },
  "5-1": { en: "Labour Day", ur: "یوم مزدور", hi: "मज़दूर दिवस" },
  "6-5": { en: "World Environment Day", ur: "عالمی یوم ماحولیات", hi: "विश्व पर्यावरण दिवस" },
  "8-14": { en: "Pakistan Independence Day", ur: "یوم آزادی پاکستان", hi: "पाकिस्तान स्वतंत्रता दिवस" },
  "8-15": { en: "India Independence Day", ur: "یوم آزادی بھارت", hi: "भारत स्वतंत्रता दिवस" },
  "10-2": { en: "Gandhi Jayanti", ur: "گاندھی جینتی", hi: "गांधी जयंती" },
  "11-9": { en: "Iqbal Day", ur: "یوم اقبال", hi: "इक़बाल दिवस" },
  "12-25": { en: "Quaid-e-Azam Day", ur: "یوم قائداعظم", hi: "क़ायद-ए-आज़म दिवस" },
};

interface RegionalConfig {
  method: number;
  adjustment: number;
  label: string;
}

function getRegionalConfig(countryCode: string): RegionalConfig {
  const cc = countryCode.toUpperCase();
  if (cc === "SA") return { method: 4, adjustment: 0, label: "Umm al-Qura" };
  if (["IN", "PK", "BD"].includes(cc)) return { method: 1, adjustment: -1, label: "Karachi (Hanafi)" };
  if (["US", "CA"].includes(cc)) return { method: 2, adjustment: 0, label: "ISNA" };
  if (["EG", "SD", "SY"].includes(cc)) return { method: 5, adjustment: 0, label: "Egyptian Authority" };
  if (["AE", "QA", "KW", "BH", "OM"].includes(cc)) return { method: 8, adjustment: 0, label: "Gulf Region" };
  if (["TR"].includes(cc)) return { method: 13, adjustment: 0, label: "Turkey (Diyanet)" };
  if (["MY", "SG", "ID", "BN"].includes(cc)) return { method: 3, adjustment: 0, label: "MWL (Southeast Asia)" };
  return { method: 3, adjustment: 0, label: "Muslim World League" };
}

interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
}

interface HijriDayInfo {
  day: number;
  month: number;
  year: number;
}

const getHijriFromApi = async (date: Date, adjustment: number): Promise<HijriDate | null> => {
  try {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const res = await fetch(`https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}?adjustment=${adjustment}`);
    const data = await res.json();
    if (data.code === 200) {
      const h = data.data.hijri;
      return { day: parseInt(h.day), month: parseInt(h.month.number), year: parseInt(h.year), monthName: h.month.en };
    }
  } catch {}
  return null;
};

function getGregorianDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function getGregorianFirstDayOfWeek(month: number, year: number): number {
  return new Date(year, month - 1, 1).getDay();
}

function getHijriMonthName(month: number, lang: string): string {
  if (lang === "ur" || lang === "hi") return HIJRI_MONTHS_AR[month - 1] || "";
  return HIJRI_MONTHS[month - 1] || "";
}

function getHijriMonthShort(month: number, lang: string): string {
  if (lang === "ur" || lang === "hi") return HIJRI_MONTHS_AR_SHORT[month - 1] || "";
  return HIJRI_MONTHS_SHORT[month - 1] || "";
}

const IslamicCalendar: React.FC = () => {
  const { t, lang } = useI18n();
  const { location } = useSharedLocation();
  const [countryCode, setCountryCode] = useState<string>("");
  const [detecting, setDetecting] = useState(true);
  const [currentHijri, setCurrentHijri] = useState<HijriDate | null>(null);
  const now = new Date();
  const [gMonth, setGMonth] = useState(now.getMonth() + 1);
  const [gYear, setGYear] = useState(now.getFullYear());
  const [hijriForGregorian, setHijriForGregorian] = useState<Map<number, HijriDayInfo>>(new Map());
  
  // User manual adjustment: -1, 0, +1
  const [userAdjust, setUserAdjust] = useState<number>(() => {
    const saved = localStorage.getItem("hijri_user_adjust");
    return saved ? parseInt(saved) : 0;
  });

  const config = useMemo(() => getRegionalConfig(countryCode), [countryCode]);
  
  // Total adjustment = regional + user manual
  const totalAdjustment = config.adjustment + userAdjust;

  const handleUserAdjust = (val: number) => {
    setUserAdjust(val);
    localStorage.setItem("hijri_user_adjust", String(val));
  };

  // Auto-detect country from location
  useEffect(() => {
    const detectCountry = async () => {
      const cached = localStorage.getItem("detected_country_code");
      if (cached) {
        setCountryCode(cached);
        setDetecting(false);
        return;
      }
      if (location?.lat && location?.lng) {
        try {
          const result = await QuranAPI.reverseGeocodeWithCountry(location.lat, location.lng);
          if (result.countryCode) {
            setCountryCode(result.countryCode);
            localStorage.setItem("detected_country_code", result.countryCode);
          }
        } catch {}
        setDetecting(false);
        return;
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const result = await QuranAPI.reverseGeocodeWithCountry(pos.coords.latitude, pos.coords.longitude);
              if (result.countryCode) {
                setCountryCode(result.countryCode);
                localStorage.setItem("detected_country_code", result.countryCode);
              }
            } catch {}
            setDetecting(false);
          },
          () => setDetecting(false),
          { timeout: 10000 }
        );
      } else {
        setDetecting(false);
      }
    };
    detectCountry();
  }, [location?.lat, location?.lng]);

  // Get today's hijri date
  useEffect(() => {
    if (detecting) return;
    const fetchToday = async () => {
      const now = new Date();
      const prevDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const hijri = await getHijriFromApi(prevDay, totalAdjustment);
      if (hijri) setCurrentHijri(hijri);
    };
    fetchToday();
  }, [detecting, totalAdjustment]);

  // Fetch hijri dates for each day of the gregorian month
  useEffect(() => {
    const fetchHijriForMonth = async () => {
      const daysInMonth = getGregorianDaysInMonth(gMonth, gYear);
      const map = new Map<number, HijriDayInfo>();
      try {
        const res = await fetch(`https://api.aladhan.com/v1/gToHCalendar/${gMonth}/${gYear}?adjustment=${totalAdjustment}`);
        const data = await res.json();
        if (data.code === 200) {
          const items = data.data;
          for (let idx = 0; idx < items.length; idx++) {
            const hDay = parseInt(items[idx].hijri.day);
            const hMonth = parseInt(items[idx].hijri.month.number);
            const hYear = parseInt(items[idx].hijri.year);
            const nextGDay = parseInt(items[idx].gregorian.day) + 1;
            if (nextGDay <= daysInMonth) {
              map.set(nextGDay, { day: hDay, month: hMonth, year: hYear });
            }
          }
          // For day 1: get hijri from last day of previous month
          try {
            const prevDate = new Date(gYear, gMonth - 1, 0);
            const dd = String(prevDate.getDate()).padStart(2, "0");
            const mm = String(prevDate.getMonth() + 1).padStart(2, "0");
            const yyyy = prevDate.getFullYear();
            const prevRes = await fetch(`https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}?adjustment=${totalAdjustment}`);
            const prevData = await prevRes.json();
            if (prevData.code === 200) {
              map.set(1, {
                day: parseInt(prevData.data.hijri.day),
                month: parseInt(prevData.data.hijri.month.number),
                year: parseInt(prevData.data.hijri.year),
              });
            }
          } catch {}
        }
      } catch {}
      setHijriForGregorian(map);
    };
    fetchHijriForMonth();
  }, [gMonth, gYear, totalAdjustment]);

  const prevGMonth = () => {
    if (gMonth <= 1) { setGMonth(12); setGYear(y => y - 1); }
    else setGMonth(m => m - 1);
  };

  const nextGMonth = () => {
    if (gMonth >= 12) { setGMonth(1); setGYear(y => y + 1); }
    else setGMonth(m => m + 1);
  };

  const weekdays = lang === "ur" ? WEEKDAYS_UR : lang === "hi" ? WEEKDAYS_HI : WEEKDAYS_EN;

  const gCalendarGrid = useMemo(() => {
    const daysInMonth = getGregorianDaysInMonth(gMonth, gYear);
    const firstDay = getGregorianFirstDayOfWeek(gMonth, gYear);
    const grid: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) grid.push(null);
    for (let d = 1; d <= daysInMonth; d++) grid.push(d);
    return grid;
  }, [gMonth, gYear]);

  const gTodayDay = now.getMonth() + 1 === gMonth && now.getFullYear() === gYear ? now.getDate() : null;

  // All month events (islamic + gregorian)
  const allMonthEvents = useMemo(() => {
    const events: { day: number; label: string; type: "islamic" | "gregorian"; hijriLabel?: string }[] = [];
    
    for (const [key, val] of Object.entries(GREGORIAN_IMPORTANT_DATES)) {
      const [m, d] = key.split("-").map(Number);
      if (m === gMonth) {
        events.push({ day: d, label: val[lang] || val.en, type: "gregorian" });
      }
    }

    for (const [key, val] of Object.entries(IMPORTANT_DATES)) {
      const [hm, hd] = key.split("-").map(Number);
      for (const [gDay, hijri] of hijriForGregorian.entries()) {
        if (hijri.month === hm && hijri.day === hd) {
          const hijriLabel = `${hd} ${getHijriMonthName(hm, lang)}`;
          events.push({ day: gDay, label: val[lang] || val.en, type: "islamic", hijriLabel });
        }
      }
    }

    events.sort((a, b) => a.day - b.day);
    return events;
  }, [gMonth, gYear, lang, hijriForGregorian]);

  const allImportantDays = new Set(allMonthEvents.map(e => e.day));

  // Find days where hijri month changes (day 1 of a new hijri month)
  const hijriMonthChangeDays = useMemo(() => {
    const changes = new Map<number, number>(); // gDay -> new hijri month
    for (const [gDay, hijri] of hijriForGregorian.entries()) {
      if (hijri.day === 1) {
        changes.set(gDay, hijri.month);
      }
    }
    return changes;
  }, [hijriForGregorian]);

  if (detecting) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">{t("calendar.today")}...</p>
      </div>
    );
  }

  return (
    <div className="px-3 py-3 space-y-3">
      {/* Regional + Adjustment Row */}
      <div className="flex items-center justify-between gap-2 animate-fade-in">
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 border border-primary/20 rounded-full">
          <Globe className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-medium text-primary">
            {config.label}
            {countryCode && <span className="ml-0.5 opacity-60">({countryCode})</span>}
          </span>
        </div>
        
        {/* Date Adjustment Buttons */}
        <div className="flex items-center gap-1 bg-muted rounded-full p-0.5">
          <button
            onClick={() => handleUserAdjust(-1)}
            className={`px-2 py-1 rounded-full text-[10px] font-semibold transition-all ${
              userAdjust === -1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            -1
          </button>
          <button
            onClick={() => handleUserAdjust(0)}
            className={`px-2 py-1 rounded-full text-[10px] font-semibold transition-all ${
              userAdjust === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("calendar.auto")}
          </button>
          <button
            onClick={() => handleUserAdjust(1)}
            className={`px-2 py-1 rounded-full text-[10px] font-semibold transition-all ${
              userAdjust === 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            +1
          </button>
        </div>
      </div>

      {/* Today's Date Card */}
      {currentHijri && (
        <div className="bg-card rounded-2xl border border-border p-4 text-center animate-fade-in">
          <Moon className="w-7 h-7 text-primary mx-auto mb-1.5" />
          <p className="font-arabic text-xl text-primary mb-0.5">
            {currentHijri.day} {getHijriMonthName(currentHijri.month, lang)} {currentHijri.year} {t("calendar.ah")}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {now.getDate()} {GREGORIAN_MONTHS[now.getMonth()]} {now.getFullYear()}
          </p>
          {location?.city && (
            <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3" /> {location.city}
            </p>
          )}
        </div>
      )}

      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-card rounded-xl border border-border p-2">
        <button onClick={prevGMonth} className="p-1.5 rounded-lg hover:bg-muted transition-smooth active:scale-95">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="text-center">
          <p className="text-sm font-bold text-foreground">{GREGORIAN_MONTHS[gMonth - 1]} {gYear}</p>
          {(() => {
            const firstHijri = hijriForGregorian.get(1);
            const lastDay = getGregorianDaysInMonth(gMonth, gYear);
            const lastHijri = hijriForGregorian.get(lastDay);
            if (firstHijri && lastHijri) {
              const fName = getHijriMonthName(firstHijri.month, lang);
              const lName = getHijriMonthName(lastHijri.month, lang);
              const yearStr = firstHijri.year === lastHijri.year ? `${firstHijri.year}` : `${firstHijri.year}-${lastHijri.year}`;
              return <p className="text-[10px] text-primary/70 font-medium">{fName} - {lName} {yearStr} {t("calendar.ah")}</p>;
            }
            return null;
          })()}
        </div>
        <button onClick={nextGMonth} className="p-1.5 rounded-lg hover:bg-muted transition-smooth active:scale-95">
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Calendar Grid - Hijri prominent, Gregorian small */}
      <div className="bg-card rounded-2xl border border-border p-2">
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {weekdays.map((d) => (
            <div key={d} className="text-center text-[9px] font-bold text-muted-foreground py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {gCalendarGrid.map((day, i) => {
            if (day === null) return <div key={`gempty-${i}`} />;
            const isToday = day === gTodayDay;
            const isImportant = allImportantDays.has(day);
            const isFriday = (i % 7) === 5;
            const hijri = hijriForGregorian.get(day);
            const isHijriMonthStart = hijriMonthChangeDays.has(day);
            
            return (
              <div
                key={`gday-${day}`}
                className={`relative flex flex-col items-center justify-center rounded-lg transition-smooth ${
                  isHijriMonthStart ? "h-[4.2rem]" : "h-14"
                } ${
                  isToday
                    ? "bg-primary text-primary-foreground font-bold"
                    : isImportant
                    ? "bg-primary/15 text-primary font-semibold"
                    : isFriday
                    ? "text-primary/70"
                    : "text-foreground"
                }`}
              >
                {/* Hijri month name label when month changes */}
                {isHijriMonthStart && hijri && (
                  <span className={`text-[6px] leading-none font-bold ${
                    isToday ? "text-primary-foreground/80" : "text-primary/60"
                  }`}>
                    {getHijriMonthShort(hijri.month, lang)}
                  </span>
                )}
                {/* Hijri day - PROMINENT */}
                {hijri && (
                  <span className={`text-sm font-bold leading-tight ${
                    isToday ? "text-primary-foreground" : ""
                  }`}>
                    {hijri.day}
                  </span>
                )}
                {/* Gregorian day - small */}
                <span className={`text-[8px] leading-tight ${
                  isToday ? "text-primary-foreground/60" : "text-muted-foreground"
                }`}>
                  {day} {GREGORIAN_MONTHS_SHORT[gMonth - 1]}
                </span>
                {isImportant && !isToday && (
                  <Star className="w-1.5 h-1.5 text-primary absolute top-0.5 right-0.5 fill-primary" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Combined Events */}
      {allMonthEvents.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-3">
          <h3 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            {t("calendar.importantDates")}
          </h3>
          <div className="space-y-1.5">
            {allMonthEvents.map((ev, idx) => (
              <div key={`${ev.day}-${idx}`} className="flex items-center gap-2 p-1.5 rounded-lg bg-primary/5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  ev.type === "islamic" ? "bg-primary/20" : "bg-muted"
                }`}>
                  <span className="text-[10px] font-bold text-primary">{ev.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-tight truncate">{ev.label}</p>
                  <p className="text-[9px] text-muted-foreground">
                    {ev.day} {GREGORIAN_MONTHS_SHORT[gMonth - 1]}
                    {ev.hijriLabel && <span className="ml-1 text-primary/60">• {ev.hijriLabel}</span>}
                    {ev.type === "islamic" && <span className="ml-1">☪</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IslamicCalendar;
