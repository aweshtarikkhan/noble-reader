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
    muezzin: "Al-Assaf",
    url: "/audio/adhan-makkah.mp3",
  },
  {
    id: "arabic-1",
    name: "Arabic Azaan",
    style: "Arabic (Classic)",
    muezzin: "Traditional Arabic",
    url: "/audio/adhan-arabic.mp3",
  },
  {
    id: "egypt",
    name: "Egyptian Azaan",
    style: "Arabic (Egypt)",
    muezzin: "Shahat",
    url: "/audio/adhan-egyptian.mp3",
  },
  {
    id: "fajr-1",
    name: "Fajr Azaan",
    style: "Fajr Special",
    muezzin: "Traditional Fajr",
    url: "/audio/adhan-fajr.mp3",
  },
  {
    id: "sami",
    name: "Sami Yusuf Style",
    style: "Indo-Pak / Modern",
    muezzin: "Sami",
    url: "/audio/adhan-sami.mp3",
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
