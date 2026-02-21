export interface AzaanOption {
  id: string;
  name: string;
  style: string;
  muezzin: string;
  url: string;
}

export const AZAAN_OPTIONS: AzaanOption[] = [
  {
    id: "makkah-1",
    name: "Makkah Azaan",
    style: "Arabic (Haram)",
    muezzin: "Sheikh Ali Ahmed Mulla",
    url: "https://cdn.aladhan.com/audio/adhans/1.mp3",
  },
  {
    id: "madinah-1",
    name: "Madinah Azaan",
    style: "Arabic (Nabawi)",
    muezzin: "Al-Masjid an-Nabawi",
    url: "https://cdn.aladhan.com/audio/adhans/2.mp3",
  },
  {
    id: "alaqsa",
    name: "Al-Aqsa Azaan",
    style: "Arabic (Al-Aqsa)",
    muezzin: "Al-Masjid Al-Aqsa",
    url: "https://cdn.aladhan.com/audio/adhans/3.mp3",
  },
  {
    id: "egypt",
    name: "Egyptian Azaan",
    style: "Arabic (Egypt)",
    muezzin: "Egyptian Style",
    url: "https://cdn.aladhan.com/audio/adhans/4.mp3",
  },
  {
    id: "indopak-1",
    name: "Indo-Pak Azaan",
    style: "Indo-Pak",
    muezzin: "Traditional Indo-Pak",
    url: "https://cdn.aladhan.com/audio/adhans/5.mp3",
  },
  {
    id: "mishary",
    name: "Mishary Rashid",
    style: "Arabic (Kuwait)",
    muezzin: "Mishary Rashid Alafasy",
    url: "https://cdn.aladhan.com/audio/adhans/6.mp3",
  },
  {
    id: "turkish",
    name: "Turkish Azaan",
    style: "Turkish",
    muezzin: "Turkish Style",
    url: "https://cdn.aladhan.com/audio/adhans/7.mp3",
  },
];

export const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
export type PrayerName = typeof PRAYER_NAMES[number];

export interface AzaanSettings {
  enabled: boolean;
  selectedAzaanId: string;
  enabledPrayers: Record<PrayerName, boolean>;
  manualTimings: Record<PrayerName, string>; // empty = auto
  volume: number;
}

export const DEFAULT_AZAAN_SETTINGS: AzaanSettings = {
  enabled: false,
  selectedAzaanId: "makkah-1",
  enabledPrayers: {
    Fajr: true,
    Dhuhr: true,
    Asr: true,
    Maghrib: true,
    Isha: true,
  },
  manualTimings: {
    Fajr: "",
    Dhuhr: "",
    Asr: "",
    Maghrib: "",
    Isha: "",
  },
  volume: 1,
};

export function loadAzaanSettings(): AzaanSettings {
  try {
    const stored = localStorage.getItem("azaan-settings");
    if (stored) return { ...DEFAULT_AZAAN_SETTINGS, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_AZAAN_SETTINGS;
}

export function saveAzaanSettings(settings: AzaanSettings) {
  localStorage.setItem("azaan-settings", JSON.stringify(settings));
}
