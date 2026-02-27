import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, BellOff, Volume2, VolumeX } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAzaanScheduler } from "@/hooks/useAzaanScheduler";
import {
  loadAzaanSettings,
  saveAzaanSettings,
  PRAYER_NAMES,
  type PrayerName,
} from "@/data/azaanOptions";
import { useSharedLocation } from "@/hooks/useSharedLocation";

const HIJRI_MONTHS = [
  "مُحَرَّم", "صَفَر", "رَبِيع الأَوَّل", "رَبِيع الثَّانِي",
  "جُمَادَى الأُولَى", "جُمَادَى الآخِرَة", "رَجَب", "شَعْبَان",
  "رَمَضَان", "شَوَّال", "ذُو القَعْدَة", "ذُو الحِجَّة"
];

const PRAYER_ICONS: Record<string, string> = {
  Fajr: "🌙", Sunrise: "🌅", Dhuhr: "☀️", Asr: "🌤", Maghrib: "🌇", Isha: "🌃",
};

const PrayerTimes: React.FC = () => {
  const navigate = useNavigate();
  const { location, loading, error } = useSharedLocation();
  const [countdown, setCountdown] = useState("");
  const [settings, setSettings] = useState(loadAzaanSettings);

  const data = location?.prayerData || null;
  const cityName = location?.city || "";

  useAzaanScheduler(data?.timings || null);

  const updateSettings = useCallback((prayer: PrayerName, field: "enabledPrayers" | "enabledNotifications", value: boolean) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        [field]: { ...prev[field], [prayer]: value },
      };
      saveAzaanSettings(next);
      return next;
    });
  }, []);

  const requestPermissionsIfNeeded = async () => {
    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display !== "granted") {
        await LocalNotifications.requestPermissions();
      }
    } catch {
      if ("Notification" in window && Notification.permission !== "granted") {
        try { await Notification.requestPermission(); } catch {}
      }
    }
  };

  const handleNotificationToggle = async (prayer: PrayerName, checked: boolean) => {
    if (checked) {
      await requestPermissionsIfNeeded();
    }
    updateSettings(prayer, "enabledNotifications", checked);
  };

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
        setCountdown("");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [data]);

  const prayers = data?.timings
    ? [
        { name: "Fajr" as PrayerName, time: data.timings.Fajr, icon: "🌙" },
        { name: "Dhuhr" as PrayerName, time: data.timings.Dhuhr, icon: "☀️" },
        { name: "Asr" as PrayerName, time: data.timings.Asr, icon: "🌤" },
        { name: "Maghrib" as PrayerName, time: data.timings.Maghrib, icon: "🌇" },
        { name: "Isha" as PrayerName, time: data.timings.Isha, icon: "🌃" },
      ]
    : [];

  const extraTimings = data?.timings
    ? [{ name: "Sunrise", time: data.timings.Sunrise, icon: "🌅" }]
    : [];

  const hijri = React.useMemo(() => {
    if (!data?.date?.hijri || !data?.timings?.Maghrib) return data?.date?.hijri;
    const now = new Date();
    const [mH, mM] = data.timings.Maghrib.split(":").map(Number);
    const maghrib = new Date();
    maghrib.setHours(mH, mM, 0, 0);
    if (now < maghrib) {
      const h = { ...data.date.hijri };
      const day = parseInt(h.day) - 1;
      if (day >= 1) return { ...h, day: String(day) };
    }
    return data.date.hijri;
  }, [data]);
  const gregorian = data?.date?.gregorian;

  return (
    <div className="px-4 py-4">
      {loading && !data && <LoadingSpinner message="Detecting location..." />}
      {error && !data && (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-destructive mb-3">{error}</p>
          <button onClick={() => window.location.reload()} className="text-gold text-sm underline">Retry</button>
        </div>
      )}

      {data && (
        <div className="space-y-4 animate-fade-in">
          {/* Hijri Date */}
          {hijri && (
            <div className="p-4 rounded-2xl bg-card border border-gold/10 shadow-gold text-center">
              <p className="font-arabic text-2xl text-gold">
                {hijri.day}, {HIJRI_MONTHS[parseInt(hijri.month.number) - 1] || hijri.month.ar}, {hijri.year}
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

          {/* Sunrise */}
          {extraTimings.map((p) => (
            <div key={p.name} className="flex items-center justify-between p-3 rounded-xl bg-card border border-gold/5">
              <div className="flex items-center gap-3">
                <span className="text-lg">{p.icon}</span>
                <span className="text-sm font-medium text-foreground">{p.name}</span>
              </div>
              <span className="text-sm text-gold font-semibold">{p.time?.split(" ")[0]}</span>
            </div>
          ))}

          {/* Prayer times with sound & notification toggles */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground px-1 font-semibold">Prayer Times</p>
            {prayers.map((p) => (
              <div key={p.name} className="p-3 rounded-xl bg-card border border-gold/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{p.icon}</span>
                    <span className="text-sm font-medium text-foreground">{p.name}</span>
                  </div>
                  <span className="text-sm text-gold font-semibold">{p.time?.split(" ")[0]}</span>
                </div>

                {settings.enabled && (
                  <div className="flex items-center gap-4 pl-9">
                    {/* Sound toggle */}
                    <div className="flex items-center gap-1.5">
                      {settings.enabledPrayers[p.name] ? (
                        <Volume2 className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                      <span className="text-[11px] text-muted-foreground">Sound</span>
                      <Switch
                        checked={settings.enabledPrayers[p.name]}
                        onCheckedChange={(v) => updateSettings(p.name, "enabledPrayers", v)}
                        className="scale-75"
                      />
                    </div>

                    {/* Notification toggle */}
                    <div className="flex items-center gap-1.5">
                      {settings.enabledNotifications?.[p.name] !== false ? (
                        <Bell className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <BellOff className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                      <span className="text-[11px] text-muted-foreground">Notify</span>
                      <Switch
                        checked={settings.enabledNotifications?.[p.name] !== false}
                        onCheckedChange={(v) => handleNotificationToggle(p.name, v)}
                        className="scale-75"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Azaan Settings Link */}
          <button
            onClick={() => navigate("/azaan-settings")}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-card border border-gold/10 hover:border-gold/30 transition-smooth"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🔔</span>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Azaan Settings</p>
                <p className="text-xs text-muted-foreground">
                  {settings.enabled ? "ON — Tap to configure style & volume" : "OFF — Tap to enable"}
                </p>
              </div>
            </div>
            <span className="text-muted-foreground">›</span>
          </button>

          {/* Location */}
          {(cityName || data.meta?.timezone) && (
            <p className="text-center text-xs text-muted-foreground">
              📍 {cityName}{cityName && data.meta?.timezone ? ` • ${data.meta.timezone}` : data.meta?.timezone || ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PrayerTimes;
