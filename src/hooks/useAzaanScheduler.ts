import { useEffect, useRef, useCallback } from "react";
import {
  loadAzaanSettings,
  AZAAN_OPTIONS,
  PRAYER_NAMES,
  type PrayerName,
} from "@/data/azaanOptions";

let currentAudio: HTMLAudioElement | null = null;

export function stopAzaan() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

function playAzaan(azaanId: string, volume: number) {
  // Check silent mode
  if (localStorage.getItem("silent_mode") === "true") return;

  stopAzaan();
  const option = AZAAN_OPTIONS.find((a) => a.id === azaanId);
  if (!option) return;
  const audio = new Audio(option.url);
  audio.volume = volume;
  audio.play().catch((err) => {
    console.warn("Azaan auto-play blocked:", err);
  });
  currentAudio = audio;
  audio.onended = () => {
    currentAudio = null;
  };
}

async function requestNotificationPermission(): Promise<boolean> {
  // Try Capacitor LocalNotifications first
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    const result = await LocalNotifications.requestPermissions();
    if (result.display === "granted") return true;
  } catch {}

  // Fallback to web Notification API
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

function showWebNotification(prayerName: string) {
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(`${prayerName} Azaan`, {
        body: `It's time for ${prayerName} prayer 🕌`,
        icon: "/favicon.ico",
        tag: `azaan-${prayerName}`,
        requireInteraction: true,
      });
    } catch {}
  }
}

/**
 * Schedule native local notifications for all enabled prayer times.
 * These fire even when the app is closed or phone is offline.
 */
async function scheduleNativeNotifications(prayerTimings: Record<string, string>) {
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");

    // Check permission
    const perm = await LocalNotifications.checkPermissions();
    if (perm.display !== "granted") {
      const req = await LocalNotifications.requestPermissions();
      if (req.display !== "granted") return;
    }

    // Cancel all existing scheduled notifications
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }

    const settings = loadAzaanSettings();
    if (!settings.enabled) return;

    const notifications: any[] = [];
    const now = new Date();

    PRAYER_NAMES.forEach((prayer, index) => {
      if (!settings.enabledPrayers[prayer]) return;

      const timeStr = settings.manualTimings[prayer] || prayerTimings[prayer];
      if (!timeStr) return;

      const cleanTime = timeStr.split(" ")[0];
      const [hours, minutes] = cleanTime.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) return;

      // Schedule for today
      const todayTarget = new Date(now);
      todayTarget.setHours(hours, minutes, 0, 0);

      if (todayTarget > now) {
        notifications.push({
          id: 1000 + index,
          title: `${prayer} Azaan 🕌`,
          body: `It's time for ${prayer} prayer. May Allah accept your prayers.`,
          schedule: { at: todayTarget },
          sound: "adhan-makkah.mp3",
          smallIcon: "ic_stat_icon_config_sample",
          iconColor: "#CE7553",
          ongoing: false,
          autoCancel: true,
        });
      }

      // Schedule for tomorrow (so notifications work for next day too)
      const tomorrowTarget = new Date(now);
      tomorrowTarget.setDate(tomorrowTarget.getDate() + 1);
      tomorrowTarget.setHours(hours, minutes, 0, 0);

      notifications.push({
        id: 2000 + index,
        title: `${prayer} Azaan 🕌`,
        body: `It's time for ${prayer} prayer. May Allah accept your prayers.`,
        schedule: { at: tomorrowTarget },
        sound: "adhan-makkah.mp3",
        smallIcon: "ic_stat_icon_config_sample",
        iconColor: "#CE7553",
        ongoing: false,
        autoCancel: true,
      });
    });

    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
      console.log(`Scheduled ${notifications.length} azan notifications`);
    }
  } catch (err) {
    console.warn("Native notifications not available:", err);
  }
}

export { requestNotificationPermission };

export function useAzaanScheduler(prayerTimings: Record<string, string> | null) {
  const firedRef = useRef<Set<string>>(new Set());
  const scheduledRef = useRef(false);

  // Schedule native notifications whenever prayer timings change
  useEffect(() => {
    if (!prayerTimings || scheduledRef.current) return;
    scheduledRef.current = true;
    scheduleNativeNotifications(prayerTimings);
  }, [prayerTimings]);

  // Re-schedule daily at midnight
  useEffect(() => {
    if (!prayerTimings) return;

    const rescheduleAtMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const ms = midnight.getTime() - now.getTime();
      return setTimeout(() => {
        scheduledRef.current = false;
        scheduleNativeNotifications(prayerTimings);
        firedRef.current.clear();
        rescheduleAtMidnight();
      }, ms);
    };

    const timer = rescheduleAtMidnight();
    return () => clearTimeout(timer);
  }, [prayerTimings]);

  const checkAndPlay = useCallback(() => {
    if (!prayerTimings) return;
    const settings = loadAzaanSettings();
    if (!settings.enabled) return;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    for (const prayer of PRAYER_NAMES) {
      if (!settings.enabledPrayers[prayer]) continue;

      const time = settings.manualTimings[prayer] || prayerTimings[prayer];
      if (!time) continue;

      const cleanTime = time.split(" ")[0];
      const key = `${prayer}-${cleanTime}-${now.toDateString()}`;

      if (cleanTime === currentTime && !firedRef.current.has(key)) {
        firedRef.current.add(key);
        playAzaan(settings.selectedAzaanId, settings.volume);
        showWebNotification(prayer);
      }
    }
  }, [prayerTimings]);

  useEffect(() => {
    if (!prayerTimings) return;

    const interval = setInterval(checkAndPlay, 15000);
    checkAndPlay();

    return () => clearInterval(interval);
  }, [prayerTimings, checkAndPlay]);

  // Listen for volume button to stop azaan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "AudioVolumeDown" ||
        e.key === "AudioVolumeUp" ||
        e.key === "AudioVolumeMute" ||
        e.key === "VolumeDown" ||
        e.key === "VolumeUp"
      ) {
        stopAzaan();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
