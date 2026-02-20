import React, { useEffect, useState } from "react";
import { QuranAPI } from "@/lib/quranApi";
import LoadingSpinner from "@/components/LoadingSpinner";

const HIJRI_MONTHS = [
  "مُحَرَّم", "صَفَر", "رَبِيع الأَوَّل", "رَبِيع الثَّانِي",
  "جُمَادَى الأُولَى", "جُمَادَى الآخِرَة", "رَجَب", "شَعْبَان",
  "رَمَضَان", "شَوَّال", "ذُو القَعْدَة", "ذُو الحِجَّة"
];

const PrayerTimes: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [school, setSchool] = useState(() => parseInt(localStorage.getItem("prayer-school") || "1"));
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    localStorage.setItem("prayer-school", String(school));
    setLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const method = school === 1 ? 1 : 3;
          const result = await QuranAPI.getPrayerTimes(pos.coords.latitude, pos.coords.longitude, method, school);
          setData(result);
        } catch {
          setError("Failed to load prayer times");
        }
        setLoading(false);
      },
      () => {
        setError("Location access denied. Please enable location.");
        setLoading(false);
      }
    );
  }, [school]);

  // Countdown timer
  useEffect(() => {
    if (!data?.timings) return;
    const timer = setInterval(() => {
      const now = new Date();
      const maghribStr = data.timings.Maghrib;
      const [h, m] = maghribStr.split(":").map(Number);
      const target = new Date();
      target.setHours(h, m, 0, 0);
      const diff = target.getTime() - now.getTime();
      if (diff > 0) {
        const hrs = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setCountdown(`${hrs}h ${mins}m ${secs}s`);
      } else {
        setCountdown("Iftar time passed");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [data]);

  const prayers = data?.timings
    ? [
        { name: "Fajr", time: data.timings.Fajr, icon: "🌙" },
        { name: "Sunrise", time: data.timings.Sunrise, icon: "🌅" },
        { name: "Dhuhr", time: data.timings.Dhuhr, icon: "☀️" },
        { name: "Asr", time: data.timings.Asr, icon: "🌤" },
        { name: "Maghrib", time: data.timings.Maghrib, icon: "🌇" },
        { name: "Isha", time: data.timings.Isha, icon: "🌃" },
      ]
    : [];

  const hijri = data?.date?.hijri;
  const gregorian = data?.date?.gregorian;

  return (
    <div className="px-4 py-4">
      {/* Madhab toggle */}
      <div className="flex bg-card rounded-xl p-1 border border-gold/10 mb-4 animate-fade-in">
        <button
          onClick={() => setSchool(1)}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-smooth ${school === 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Hanafi
        </button>
        <button
          onClick={() => setSchool(0)}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-smooth ${school === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Shafi
        </button>
      </div>

      {loading && <LoadingSpinner message="Detecting location..." />}
      {error && (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-destructive mb-3">{error}</p>
          <button onClick={() => window.location.reload()} className="text-gold text-sm underline">Retry</button>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-4 animate-fade-in">
          {/* Hijri Date */}
          {hijri && (
            <div className="p-4 rounded-2xl bg-card border border-gold/10 shadow-gold text-center">
              <p className="font-arabic text-2xl text-gold">
                {hijri.day} {HIJRI_MONTHS[parseInt(hijri.month.number) - 1] || hijri.month.ar} {hijri.year}
              </p>
              {gregorian && (
                <p className="text-xs text-muted-foreground mt-1">
                  {gregorian.weekday.en}, {gregorian.day} {gregorian.month.en} {gregorian.year}
                </p>
              )}
            </div>
          )}

          {/* Sehri / Iftar */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-card border border-gold/10 text-center">
              <p className="text-xs text-muted-foreground">Sehri (Fajr)</p>
              <p className="text-xl font-bold text-foreground mt-1">{data.timings.Fajr}</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-secondary/20 text-center">
              <p className="text-xs text-muted-foreground">Iftar (Maghrib)</p>
              <p className="text-xl font-bold text-foreground mt-1">{data.timings.Maghrib}</p>
            </div>
          </div>

          {countdown && (
            <div className="text-center p-3 rounded-xl bg-surface border border-gold/10">
              <p className="text-xs text-muted-foreground">Time until Iftar</p>
              <p className="text-lg font-bold text-gold">{countdown}</p>
            </div>
          )}

          {/* Prayer grid */}
          <div className="space-y-2">
            {prayers.map((p) => (
              <div key={p.name} className="flex items-center justify-between p-3 rounded-xl bg-card border border-gold/5">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{p.icon}</span>
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                </div>
                <span className="text-sm text-gold font-semibold">{p.time?.split(" ")[0]}</span>
              </div>
            ))}
          </div>

          {/* Location */}
          {data.meta?.timezone && (
            <p className="text-center text-xs text-muted-foreground">
              📍 {data.meta.timezone}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PrayerTimes;
