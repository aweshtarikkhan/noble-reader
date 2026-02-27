import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, MapPin, Moon, Star } from "lucide-react";
import { useSharedLocation } from "@/hooks/useSharedLocation";
import { useI18n } from "@/lib/i18n";

type CalendarMethod = "indian" | "saudi";

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

interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
}

const getHijriFromApi = async (date: Date, method: CalendarMethod): Promise<HijriDate | null> => {
  try {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    // method: 1=Muslim World League, 2=ISNA, ...  For Indian we use method 1 (shia), Saudi uses Umm al-Qura (method 4)
    const apiMethod = method === "indian" ? 1 : 4;
    const adjustment = method === "indian" ? 1 : 0;
    const res = await fetch(`https://api.aladhan.com/v1/gpiToH/${dd}-${mm}-${yyyy}?adjustment=${adjustment}`);
    const data = await res.json();
    if (data.code === 200) {
      const h = data.data.hijri;
      return { day: parseInt(h.day), month: parseInt(h.month.number), year: parseInt(h.year), monthName: h.month.en };
    }
  } catch {}
  return null;
};

const getHijriMonth = async (month: number, year: number, method: CalendarMethod): Promise<{ gregorian: string; hijriDay: number; weekday: number }[]> => {
  try {
    const apiMethod = method === "indian" ? 1 : 4;
    const adjustment = method === "indian" ? 1 : 0;
    const res = await fetch(`https://api.aladhan.com/v1/hpiToG/${month}/${year}?adjustment=${adjustment}`);
    const data = await res.json();
    if (data.code === 200) {
      return data.data.map((item: any) => {
        const g = item.gregorian;
        const gDate = new Date(`${g.year}-${g.month.number}-${g.day}`);
        return {
          gregorian: `${g.day} ${g.month.en} ${g.year}`,
          hijriDay: parseInt(item.hijri.day),
          weekday: gDate.getDay(),
        };
      });
    }
  } catch {}
  return [];
};

const IslamicCalendar: React.FC = () => {
  const { t, lang } = useI18n();
  const { location } = useSharedLocation();
  const [method, setMethod] = useState<CalendarMethod>(() => {
    const saved = localStorage.getItem("calendar_method");
    if (saved === "indian" || saved === "saudi") return saved;
    return "indian";
  });
  const [currentHijri, setCurrentHijri] = useState<HijriDate | null>(null);
  const [viewMonth, setViewMonth] = useState(0);
  const [viewYear, setViewYear] = useState(0);
  const [monthDays, setMonthDays] = useState<{ gregorian: string; hijriDay: number; weekday: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Get today's hijri date
  useEffect(() => {
    const fetchToday = async () => {
      const today = await getHijriFromApi(new Date(), method);
      if (today) {
        setCurrentHijri(today);
        setViewMonth(today.month);
        setViewYear(today.year);
      }
    };
    fetchToday();
  }, [method]);

  // Load month data
  useEffect(() => {
    if (!viewMonth || !viewYear) return;
    setLoading(true);
    getHijriMonth(viewMonth, viewYear, method).then((days) => {
      setMonthDays(days);
      setLoading(false);
    });
  }, [viewMonth, viewYear, method]);

  const changeMethod = (m: CalendarMethod) => {
    setMethod(m);
    localStorage.setItem("calendar_method", m);
  };

  const prevMonth = () => {
    if (viewMonth <= 1) { setViewMonth(12); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth >= 12) { setViewMonth(1); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const weekdays = lang === "ur" ? WEEKDAYS_UR : lang === "hi" ? WEEKDAYS_HI : WEEKDAYS_EN;
  const monthName = lang === "ur" || lang === "hi" ? HIJRI_MONTHS_AR[viewMonth - 1] : HIJRI_MONTHS[viewMonth - 1];

  // Build calendar grid
  const calendarGrid = useMemo(() => {
    if (monthDays.length === 0) return [];
    const firstDayWeekday = monthDays[0]?.weekday ?? 0;
    const grid: (number | null)[] = [];
    for (let i = 0; i < firstDayWeekday; i++) grid.push(null);
    monthDays.forEach((d) => grid.push(d.hijriDay));
    return grid;
  }, [monthDays]);

  const todayDay = currentHijri && viewMonth === currentHijri.month && viewYear === currentHijri.year ? currentHijri.day : null;

  // Important dates for current month
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

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Method Toggle */}
      <div className="flex bg-card rounded-xl p-1 border border-border animate-fade-in">
        <button onClick={() => changeMethod("indian")} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${method === "indian" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
          🇮🇳 {t("calendar.indian")}
        </button>
        <button onClick={() => changeMethod("saudi")} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-smooth ${method === "saudi" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
          🇸🇦 {t("calendar.saudi")}
        </button>
      </div>

      {/* Today's Date Card */}
      {currentHijri && (
        <div className="bg-card rounded-2xl border border-border p-5 text-center animate-fade-in">
          <Moon className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="font-arabic text-2xl text-primary mb-1">
            {currentHijri.day} {lang === "ur" || lang === "hi" ? HIJRI_MONTHS_AR[currentHijri.month - 1] : HIJRI_MONTHS[currentHijri.month - 1]} {currentHijri.year} {t("calendar.ah")}
          </p>
          <p className="text-xs text-muted-foreground">{t("calendar.today")} • {method === "indian" ? t("calendar.indian") : t("calendar.saudi")}</p>
          {location?.city && (
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3" /> {location.city}
            </p>
          )}
        </div>
      )}

      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-card rounded-xl border border-border p-3 animate-fade-in">
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
      <div className="bg-card rounded-2xl border border-border p-3 animate-fade-in">
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
                  className={`relative flex items-center justify-center h-9 rounded-lg text-sm font-medium transition-smooth ${
                    isToday
                      ? "bg-primary text-primary-foreground font-bold"
                      : isImportant
                      ? "bg-primary/15 text-primary font-semibold"
                      : isFriday
                      ? "text-primary/70"
                      : "text-foreground"
                  }`}
                >
                  {day}
                  {isImportant && !isToday && (
                    <Star className="w-2 h-2 text-primary absolute top-0.5 right-0.5 fill-primary" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Important Dates */}
      {monthEvents.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-4 animate-fade-in">
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
    </div>
  );
};

export default IslamicCalendar;
