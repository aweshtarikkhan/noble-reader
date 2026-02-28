import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, MapPin, Moon, Star, Globe, Calendar, Sun } from "lucide-react";
import { useSharedLocation } from "@/hooks/useSharedLocation";
import { useI18n } from "@/lib/i18n";
import { QuranAPI } from "@/lib/quranApi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

// Gregorian important dates: "month-day" format
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

const getHijriMonth = async (month: number, year: number, adjustment: number): Promise<{ gregorian: string; gregorianShort: string; hijriDay: number; weekday: number }[]> => {
  try {
    const res = await fetch(`https://api.aladhan.com/v1/hToGCalendar/${month}/${year}?adjustment=${adjustment}`);
    const data = await res.json();
    if (data.code === 200) {
      return data.data.map((item: any) => {
        const g = item.gregorian;
        const gDate = new Date(`${g.year}-${g.month.number}-${g.day}`);
        return {
          gregorian: `${g.day} ${g.month.en} ${g.year}`,
          gregorianShort: `${g.day} ${g.month.en.substring(0, 3)}`,
          hijriDay: parseInt(item.hijri.day),
          weekday: gDate.getDay(),
        };
      });
    }
  } catch {}
  return [];
};

const getHomeStyleHijriDate = (): HijriDate | null => {
  try {
    const now = new Date();
    const adjusted = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-civil", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    const parts = formatter.formatToParts(adjusted);
    const day = parseInt(parts.find((p) => p.type === "day")?.value || "0", 10);
    const month = parseInt(parts.find((p) => p.type === "month")?.value || "0", 10);
    const year = parseInt(parts.find((p) => p.type === "year")?.value || "0", 10);

    if (!day || !month || !year) return null;
    return { day, month, year, monthName: HIJRI_MONTHS[month - 1] || "" };
  } catch {
    return null;
  }
};

// Gregorian calendar helpers
function getGregorianDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function getGregorianFirstDayOfWeek(month: number, year: number): number {
  return new Date(year, month - 1, 1).getDay();
}

const IslamicCalendar: React.FC = () => {
  const { t, lang } = useI18n();
  const { location } = useSharedLocation();
  const [countryCode, setCountryCode] = useState<string>("");
  const [detecting, setDetecting] = useState(true);
  const [currentHijri, setCurrentHijri] = useState<HijriDate | null>(null);
  const [viewMonth, setViewMonth] = useState(0);
  const [viewYear, setViewYear] = useState(0);
  const [monthDays, setMonthDays] = useState<{ gregorian: string; gregorianShort: string; hijriDay: number; weekday: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("islamic");

  // Gregorian state
  const now = new Date();
  const [gMonth, setGMonth] = useState(now.getMonth() + 1); // 1-12
  const [gYear, setGYear] = useState(now.getFullYear());

  const config = useMemo(() => getRegionalConfig(countryCode), [countryCode]);

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
      const homeStyleToday = getHomeStyleHijriDate();
      if (homeStyleToday) {
        setCurrentHijri(homeStyleToday);
        setViewMonth(homeStyleToday.month);
        setViewYear(homeStyleToday.year);
        return;
      }
      const today = await getHijriFromApi(new Date(), config.adjustment);
      if (today) {
        setCurrentHijri(today);
        setViewMonth(today.month);
        setViewYear(today.year);
      }
    };
    fetchToday();
  }, [detecting, config.adjustment]);

  // Load month data
  useEffect(() => {
    if (!viewMonth || !viewYear) return;
    setLoading(true);
    getHijriMonth(viewMonth, viewYear, config.adjustment).then((days) => {
      setMonthDays(days);
      setLoading(false);
    });
  }, [viewMonth, viewYear, config.adjustment]);

  const prevMonth = () => {
    if (viewMonth <= 1) { setViewMonth(12); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth >= 12) { setViewMonth(1); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const prevGMonth = () => {
    if (gMonth <= 1) { setGMonth(12); setGYear(y => y - 1); }
    else setGMonth(m => m - 1);
  };

  const nextGMonth = () => {
    if (gMonth >= 12) { setGMonth(1); setGYear(y => y + 1); }
    else setGMonth(m => m + 1);
  };

  const weekdays = lang === "ur" ? WEEKDAYS_UR : lang === "hi" ? WEEKDAYS_HI : WEEKDAYS_EN;
  const monthName = lang === "ur" || lang === "hi" ? HIJRI_MONTHS_AR[viewMonth - 1] : HIJRI_MONTHS[viewMonth - 1];

  const { calendarGrid, gregorianMap } = useMemo(() => {
    if (monthDays.length === 0) return { calendarGrid: [], gregorianMap: new Map<number, string>() };
    const firstDayWeekday = monthDays[0]?.weekday ?? 0;
    const grid: (number | null)[] = [];
    const gMap = new Map<number, string>();
    for (let i = 0; i < firstDayWeekday; i++) grid.push(null);
    monthDays.forEach((d) => {
      grid.push(d.hijriDay);
      gMap.set(d.hijriDay, d.gregorianShort);
    });
    return { calendarGrid: grid, gregorianMap: gMap };
  }, [monthDays]);

  const todayDay = currentHijri && viewMonth === currentHijri.month && viewYear === currentHijri.year ? currentHijri.day : null;

  const monthEvents = useMemo(() => {
    const events: { day: number; label: string }[] = [];
    for (const [key, val] of Object.entries(IMPORTANT_DATES)) {
      const [m, d] = key.split("-").map(Number);
      if (m === viewMonth) {
        events.push({ day: d, label: val[lang] || val.en });
      }
    }
    return events;
  }, [viewMonth, lang]);

  const importantDays = new Set(monthEvents.map(e => e.day));

  // Gregorian calendar grid
  const gCalendarGrid = useMemo(() => {
    const daysInMonth = getGregorianDaysInMonth(gMonth, gYear);
    const firstDay = getGregorianFirstDayOfWeek(gMonth, gYear);
    const grid: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) grid.push(null);
    for (let d = 1; d <= daysInMonth; d++) grid.push(d);
    return grid;
  }, [gMonth, gYear]);

  const gTodayDay = now.getMonth() + 1 === gMonth && now.getFullYear() === gYear ? now.getDate() : null;

  const gMonthEvents = useMemo(() => {
    const events: { day: number; label: string }[] = [];
    for (const [key, val] of Object.entries(GREGORIAN_IMPORTANT_DATES)) {
      const [m, d] = key.split("-").map(Number);
      if (m === gMonth) {
        events.push({ day: d, label: val[lang] || val.en });
      }
    }
    return events;
  }, [gMonth, lang]);

  const gImportantDays = new Set(gMonthEvents.map(e => e.day));

  if (detecting) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">{t("calendar.today")}...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Regional Method Badge */}
      <div className="flex items-center justify-center gap-2 animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
          <Globe className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-medium text-primary">
            {config.label}
            {countryCode && <span className="ml-1 opacity-60">({countryCode})</span>}
          </span>
        </div>
      </div>

      {/* Today's Date Card */}
      {currentHijri && (
        <div className="bg-card rounded-2xl border border-border p-5 text-center animate-fade-in">
          <Moon className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="font-arabic text-2xl text-primary mb-1">
            {currentHijri.day} {lang === "ur" || lang === "hi" ? HIJRI_MONTHS_AR[currentHijri.month - 1] : HIJRI_MONTHS[currentHijri.month - 1]} {currentHijri.year} {t("calendar.ah")}
          </p>
          <p className="text-xs text-muted-foreground mb-1">
            {now.getDate()} {GREGORIAN_MONTHS[now.getMonth()]} {now.getFullYear()}
          </p>
          <p className="text-[10px] text-muted-foreground">{t("calendar.today")} • {config.label}</p>
          {location?.city && (
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3" /> {location.city}
            </p>
          )}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="islamic" className="gap-1.5 text-xs">
            <Moon className="w-3.5 h-3.5" />
            {lang === "ur" ? "اسلامی تقویم" : lang === "hi" ? "इस्लामी कैलेंडर" : "Islamic"}
          </TabsTrigger>
          <TabsTrigger value="gregorian" className="gap-1.5 text-xs">
            <Sun className="w-3.5 h-3.5" />
            {lang === "ur" ? "عیسوی تقویم" : lang === "hi" ? "ग्रेगोरियन कैलेंडर" : "Gregorian"}
          </TabsTrigger>
        </TabsList>

        {/* Islamic Calendar Tab */}
        <TabsContent value="islamic" className="space-y-4 mt-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between bg-card rounded-xl border border-border p-3">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-muted transition-smooth active:scale-95">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="text-center">
              <p className="text-base font-bold text-foreground">{monthName}</p>
              <p className="text-[10px] text-muted-foreground">{viewYear} {t("calendar.ah")}</p>
            </div>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-muted transition-smooth active:scale-95">
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-card rounded-2xl border border-border p-3">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekdays.map((d) => (
                <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
              ))}
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {calendarGrid.map((day, i) => {
                  if (day === null) return <div key={`empty-${i}`} />;
                  const isToday = day === todayDay;
                  const isImportant = importantDays.has(day);
                  const isFriday = (i % 7) === 5;
                  return (
                    <div
                      key={`day-${day}`}
                      className={`relative flex flex-col items-center justify-center h-12 rounded-lg transition-smooth ${
                        isToday
                          ? "bg-primary text-primary-foreground font-bold"
                          : isImportant
                          ? "bg-primary/15 text-primary font-semibold"
                          : isFriday
                          ? "text-primary/70"
                          : "text-foreground"
                      }`}
                    >
                      <span className="text-sm font-medium leading-tight">{day}</span>
                      <span className={`text-[7px] leading-tight ${isToday ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {gregorianMap.get(day)?.split(" ")[0]}
                      </span>
                      {isImportant && !isToday && (
                        <Star className="w-2 h-2 text-primary absolute top-0.5 right-0.5 fill-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Islamic Important Dates */}
          {monthEvents.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-primary fill-primary" />
                {t("calendar.importantDates")}
              </h3>
              <div className="space-y-2">
                {monthEvents.map((ev) => (
                  <div key={ev.day} className="flex items-center gap-3 p-2 rounded-lg bg-primary/5">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{ev.day}</span>
                    </div>
                    <span className="text-sm text-foreground">{ev.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Gregorian Calendar Tab */}
        <TabsContent value="gregorian" className="space-y-4 mt-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between bg-card rounded-xl border border-border p-3">
            <button onClick={prevGMonth} className="p-2 rounded-lg hover:bg-muted transition-smooth active:scale-95">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="text-center">
              <p className="text-base font-bold text-foreground">{GREGORIAN_MONTHS[gMonth - 1]}</p>
              <p className="text-[10px] text-muted-foreground">{gYear}</p>
            </div>
            <button onClick={nextGMonth} className="p-2 rounded-lg hover:bg-muted transition-smooth active:scale-95">
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Gregorian Calendar Grid */}
          <div className="bg-card rounded-2xl border border-border p-3">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekdays.map((d) => (
                <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {gCalendarGrid.map((day, i) => {
                if (day === null) return <div key={`gempty-${i}`} />;
                const isToday = day === gTodayDay;
                const isImportant = gImportantDays.has(day);
                const isSunday = (i % 7) === 0;
                return (
                  <div
                    key={`gday-${day}`}
                    className={`relative flex flex-col items-center justify-center h-12 rounded-lg transition-smooth ${
                      isToday
                        ? "bg-primary text-primary-foreground font-bold"
                        : isImportant
                        ? "bg-primary/15 text-primary font-semibold"
                        : isSunday
                        ? "text-destructive/70"
                        : "text-foreground"
                    }`}
                  >
                    <span className="text-sm font-medium leading-tight">{day}</span>
                    {isImportant && !isToday && (
                      <Star className="w-2 h-2 text-primary absolute top-0.5 right-0.5 fill-primary" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gregorian Important Dates */}
          {gMonthEvents.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {lang === "ur" ? "اہم تاریخیں" : lang === "hi" ? "महत्वपूर्ण तिथियाँ" : "Important Dates"}
              </h3>
              <div className="space-y-2">
                {gMonthEvents.map((ev) => (
                  <div key={ev.day} className="flex items-center gap-3 p-2 rounded-lg bg-primary/5">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{ev.day}</span>
                    </div>
                    <span className="text-sm text-foreground">{ev.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IslamicCalendar;
