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
  stopAzaan();
  const option = AZAAN_OPTIONS.find((a) => a.id === azaanId);
  if (!option) return;
  const audio = new Audio(option.url);
  audio.volume = volume;
  audio.play().catch((err) => {
    console.warn("Azaan auto-play blocked:", err);
    // Show notification even if audio is blocked
  });
  currentAudio = audio;
  audio.onended = () => {
    currentAudio = null;
  };
}

async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

function showNotification(prayerName: string) {
  if (Notification.permission === "granted") {
    try {
      new Notification(`${prayerName} Azaan`, {
        body: `It's time for ${prayerName} prayer`,
        icon: "/favicon.ico",
        tag: `azaan-${prayerName}`,
        requireInteraction: true,
      });
    } catch {}
  }
}

export function useAzaanScheduler(prayerTimings: Record<string, string> | null) {
  const firedRef = useRef<Set<string>>(new Set());

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

      // Normalize time (remove timezone info like "(IST)")
      const cleanTime = time.split(" ")[0];
      const key = `${prayer}-${cleanTime}-${now.toDateString()}`;

      if (cleanTime === currentTime && !firedRef.current.has(key)) {
        firedRef.current.add(key);
        playAzaan(settings.selectedAzaanId, settings.volume);
        showNotification(prayer);
      }
    }
  }, [prayerTimings]);

  useEffect(() => {
    if (!prayerTimings) return;

    // Check every 15 seconds
    const interval = setInterval(checkAndPlay, 15000);
    checkAndPlay();

    // Reset fired set at midnight
    const resetAtMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const ms = midnight.getTime() - now.getTime();
      setTimeout(() => {
        firedRef.current.clear();
        resetAtMidnight();
      }, ms);
    };
    resetAtMidnight();

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
