import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, MapPin, Moon, Star, Globe } from "lucide-react";
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

const GREGORIAN_MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const GREGORIAN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
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
  "3-23": { en: "Pakistan Day", ur: "یوم پاکستان", hi: "पाकिस्तान दिवस" },
  "5-1": { en: "Labour Day", ur: "یوم مزدور", hi: "मज़दूर दिवस" },
  "8-14": { en: "Pakistan Independence Day", ur: "یوم آزادی پاکستان", hi: "पाकिस्तान स्वतंत्रता दिवस" },
  "8-15": { en: "India Independence Day", ur: "یوم آزادی بھارت", hi: "भारत स्वतंत्रता दिवस" },
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
  if (["IN", "PK", "BD"].includes(cc)) return { method: 1, adjustment: 0, label: "Karachi" };
  if (["US", "CA"].includes(cc)) return { method: 2, adjustment: 0, label: "ISNA" };
  if (["EG", "SD", "SY"].includes(cc)) return { method: 5, adjustment: 0, label: "Egyptian" };
  if (["AE", "QA", "KW", "BH", "OM"].includes(cc)) return { method: 8, adjustment: 0, label: "Gulf" };
  if (["TR"].includes(cc)) return { method: 13, adjustment: 0, label: "Diyanet" };
  if (["MY", "SG", "ID", "BN"].includes(cc)) return { method: 3, adjustment: 0, label: "MWL" };
  return { method: 3, adjustment: 0, label: "MWL" };
}

function getHijriMonthName(month: number, lang: string): string {
  if (lang === "ur" || lang === "hi") return HIJRI_MONTHS_AR[month - 1] || "";
  return HIJRI_MONTHS[month - 1] || "";
}

interface HijriDayData {
  hijriDay: number;
  gregorianDay: number;
  gregorianMonth: number;
  gregorianYear: number;
  weekday: number; // 0=Sun
}

const IslamicCalendar: React.FC = () => {
  const { t, lang } = useI18n();
  const { location } = useSharedLocation();
  const [countryCode, setCountryCode] = useState<string>("");
  const [detecting, setDetecting] = useState(true);

  // Current Hijri month/year for navigation
  const [hMonth, setHMonth] = useState<number>(0);
  const [hYear, setHYear] = useState<number>(0);
  const [todayHijriDay, setTodayHijriDay] = useState<number>(0);
  const [todayHijriMonth, setTodayHijriMonth] = useState<number>(0);
  const [todayHijriYear, setTodayHijriYear] = useState<number>(0);
  const [todayGregorian, setTodayGregorian] = useState<string>("");

  const [calendarDays, setCalendarDays] = useState<HijriDayData[]>([]);
  const [loading, setLoading] = useState(false);

  const [userAdjust, setUserAdjust] = useState<number>(() => {
    const saved = localStorage.getItem("hijri_user_adjust");
    return saved ? parseInt(saved) : 0;
  });

  const config = useMemo(() => getRegionalConfig(countryCode), [countryCode]);

  const handleUserAdjust = (val: number) => {
    setUserAdjust(val);
    localStorage.setItem("hijri_user_adjust", String(val));
  };

  // Auto-detect country
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

  // Get today's Hijri date and set initial month
  useEffect(() => {
    if (detecting) return;
    const fetchToday = async () => {
      try {
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, "0");
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const yyyy = now.getFullYear();
        const res = await fetch(`https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}`);
        const data = await res.json();
        if (data.code === 200) {
          const h = data.data.hijri;
          const hd = parseInt(h.day) + userAdjust;
          const hm = parseInt(h.month.number);
          const hy = parseInt(h.year);
          
          // Handle month overflow/underflow from adjustment
          const monthDays = h.month.days ? parseInt(h.month.days) : 30;
          let adjustedDay = hd;
          let adjustedMonth = hm;
          let adjustedYear = hy;
          if (adjustedDay < 1) {
            adjustedMonth = hm - 1;
            if (adjustedMonth < 1) { adjustedMonth = 12; adjustedYear = hy - 1; }
            adjustedDay = 30 + hd; // approximate
          } else if (adjustedDay > monthDays) {
            adjustedMonth = hm + 1;
            if (adjustedMonth > 12) { adjustedMonth = 1; adjustedYear = hy + 1; }
            adjustedDay = adjustedDay - monthDays;
          }
          
          setTodayHijriDay(adjustedDay);
          setTodayHijriMonth(adjustedMonth);
          setTodayHijriYear(adjustedYear);
          setTodayGregorian(`${now.getDate()} ${GREGORIAN_MONTHS[now.getMonth()]} ${now.getFullYear()}`);
          if (hMonth === 0) {
            setHMonth(adjustedMonth);
            setHYear(adjustedYear);
          }
        }
      } catch {}
    };
    fetchToday();
  }, [detecting, userAdjust]);

  // Fetch calendar for the current Hijri month using hToGCalendar
  useEffect(() => {
    if (hMonth === 0 || hYear === 0) return;
    const fetchHijriMonth = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.aladhan.com/v1/hToGCalendar/${hMonth}/${hYear}?adjustment=${totalAdjustment}`);
        const data = await res.json();
        if (data.code === 200) {
          const days: HijriDayData[] = data.data.map((item: any) => {
            const gDate = new Date(
              parseInt(item.gregorian.year),
              parseInt(item.gregorian.month.number) - 1,
              parseInt(item.gregorian.day)
            );
            return {
              hijriDay: parseInt(item.hijri.day),
              gregorianDay: parseInt(item.gregorian.day),
              gregorianMonth: parseInt(item.gregorian.month.number),
              gregorianYear: parseInt(item.gregorian.year),
              weekday: gDate.getDay(),
            };
          });
          setCalendarDays(days);
        }
      } catch {}
      setLoading(false);
    };
    fetchHijriMonth();
  }, [hMonth, hYear, totalAdjustment]);

  const prevMonth = () => {
    if (hMonth <= 1) { setHMonth(12); setHYear(y => y - 1); }
    else setHMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (hMonth >= 12) { setHMonth(1); setHYear(y => y + 1); }
    else setHMonth(m => m + 1);
  };

  const weekdays = lang === "ur" ? WEEKDAYS_UR : lang === "hi" ? WEEKDAYS_HI : WEEKDAYS_EN;

  // Build grid with leading empty cells
  const calendarGrid = useMemo(() => {
    if (calendarDays.length === 0) return [];
    const firstWeekday = calendarDays[0].weekday;
    const grid: (HijriDayData | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) grid.push(null);
    for (const day of calendarDays) grid.push(day);
    return grid;
  }, [calendarDays]);

  // Events for this Hijri month
  const monthEvents = useMemo(() => {
    const events: { hijriDay: number; label: string; type: "islamic" | "gregorian"; gLabel?: string }[] = [];

    // Islamic events
    for (const [key, val] of Object.entries(IMPORTANT_DATES)) {
      const [hm, hd] = key.split("-").map(Number);
      if (hm === hMonth) {
        events.push({ hijriDay: hd, label: val[lang] || val.en, type: "islamic" });
      }
    }

    // Gregorian events that fall in this hijri month
    for (const day of calendarDays) {
      const gKey = `${day.gregorianMonth}-${day.gregorianDay}`;
      const gEvent = GREGORIAN_IMPORTANT_DATES[gKey];
      if (gEvent) {
        events.push({
          hijriDay: day.hijriDay,
          label: gEvent[lang] || gEvent.en,
          type: "gregorian",
          gLabel: `${day.gregorianDay} ${GREGORIAN_MONTHS_SHORT[day.gregorianMonth - 1]}`,
        });
      }
    }

    events.sort((a, b) => a.hijriDay - b.hijriDay);
    return events;
  }, [hMonth, calendarDays, lang]);

  const importantHijriDays = new Set(monthEvents.map(e => e.hijriDay));

  // Gregorian month range for subtitle
  const gRange = useMemo(() => {
    if (calendarDays.length === 0) return "";
    const first = calendarDays[0];
    const last = calendarDays[calendarDays.length - 1];
    const fStr = `${first.gregorianDay} ${GREGORIAN_MONTHS_SHORT[first.gregorianMonth - 1]} ${first.gregorianYear}`;
    const lStr = `${last.gregorianDay} ${GREGORIAN_MONTHS_SHORT[last.gregorianMonth - 1]} ${last.gregorianYear}`;
    return `${fStr} — ${lStr}`;
  }, [calendarDays]);

  // Check if a day is today
  const isToday = (day: HijriDayData) => {
    const now = new Date();
    return day.gregorianDay === now.getDate() &&
      day.gregorianMonth === now.getMonth() + 1 &&
      day.gregorianYear === now.getFullYear();
  };

  // Detect gregorian month changes within the hijri month
  const gMonthChangeDays = useMemo(() => {
    const changes = new Map<number, string>(); // hijriDay -> gMonth name
    let prevGMonth = 0;
    for (const day of calendarDays) {
      if (day.gregorianMonth !== prevGMonth) {
        if (prevGMonth !== 0) {
          changes.set(day.hijriDay, GREGORIAN_MONTHS_SHORT[day.gregorianMonth - 1]);
        }
        prevGMonth = day.gregorianMonth;
      }
    }
    return changes;
  }, [calendarDays]);

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
      {todayHijriDay > 0 && (
        <div className="bg-card rounded-2xl border border-border p-4 text-center animate-fade-in">
          <Moon className="w-7 h-7 text-primary mx-auto mb-1.5" />
          <p className="font-arabic text-xl text-primary mb-0.5">
            {todayHijriDay} {getHijriMonthName(todayHijriMonth, lang)} {todayHijriYear} {t("calendar.ah")}
          </p>
          <p className="text-[11px] text-muted-foreground">{todayGregorian}</p>
          {location?.city && (
            <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3" /> {location.city}
            </p>
          )}
        </div>
      )}

      {/* Month Navigation - Hijri Primary */}
      <div className="flex items-center justify-between bg-card rounded-xl border border-border p-2">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-muted transition-all active:scale-95">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="text-center">
          <p className="text-base font-bold text-foreground">
            {getHijriMonthName(hMonth, lang)} {hYear} {t("calendar.ah")}
          </p>
          {gRange && <p className="text-[10px] text-muted-foreground">{gRange}</p>}
        </div>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted transition-all active:scale-95">
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card rounded-2xl border border-border p-2">
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {weekdays.map((d) => (
            <div key={d} className="text-center text-[9px] font-bold text-muted-foreground py-1">{d}</div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-0.5">
            {calendarGrid.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;
              const today = isToday(day);
              const isImportant = importantHijriDays.has(day.hijriDay);
              const isFriday = day.weekday === 5;
              const gMonthLabel = gMonthChangeDays.get(day.hijriDay);

              return (
                <div
                  key={`hday-${day.hijriDay}`}
                  className={`relative flex flex-col items-center justify-center rounded-lg transition-all ${
                    gMonthLabel ? "h-[4.2rem]" : "h-14"
                  } ${
                    today
                      ? "bg-primary text-primary-foreground font-bold"
                      : isImportant
                      ? "bg-primary/15 text-primary font-semibold"
                      : isFriday
                      ? "text-primary/70"
                      : "text-foreground"
                  }`}
                >
                  {/* Gregorian month change label */}
                  {gMonthLabel && (
                    <span className={`text-[6px] leading-none font-bold ${
                      today ? "text-primary-foreground/80" : "text-primary/60"
                    }`}>
                      {gMonthLabel}
                    </span>
                  )}
                  {/* Hijri day - PROMINENT */}
                  <span className={`text-sm font-bold leading-tight ${
                    today ? "text-primary-foreground" : ""
                  }`}>
                    {day.hijriDay}
                  </span>
                  {/* Gregorian day - small */}
                  <span className={`text-[8px] leading-tight ${
                    today ? "text-primary-foreground/60" : "text-muted-foreground"
                  }`}>
                    {day.gregorianDay} {GREGORIAN_MONTHS_SHORT[day.gregorianMonth - 1]}
                  </span>
                  {isImportant && !today && (
                    <Star className="w-1.5 h-1.5 text-primary absolute top-0.5 right-0.5 fill-primary" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Events */}
      {monthEvents.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-3">
          <h3 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            {t("calendar.importantDates")}
          </h3>
          <div className="space-y-1.5">
            {monthEvents.map((ev, idx) => {
              const dayData = calendarDays.find(d => d.hijriDay === ev.hijriDay);
              return (
                <div key={`${ev.hijriDay}-${idx}`} className="flex items-center gap-2 p-1.5 rounded-lg bg-primary/5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    ev.type === "islamic" ? "bg-primary/20" : "bg-muted"
                  }`}>
                    <span className="text-[10px] font-bold text-primary">{ev.hijriDay}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-tight truncate">{ev.label}</p>
                    <p className="text-[9px] text-muted-foreground">
                      {ev.hijriDay} {getHijriMonthName(hMonth, lang)}
                      {dayData && (
                        <span className="ml-1 text-muted-foreground/60">
                          • {dayData.gregorianDay} {GREGORIAN_MONTHS_SHORT[dayData.gregorianMonth - 1]}
                        </span>
                      )}
                      {ev.type === "islamic" && <span className="ml-1">☪</span>}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default IslamicCalendar;
