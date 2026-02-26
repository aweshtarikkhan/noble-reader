import React, { useState, useEffect, useCallback, useContext, createContext } from "react";
import { QuranAPI } from "@/lib/quranApi";

const CACHE_KEY = "shared_location_data";

export interface LocationData {
  lat: number;
  lng: number;
  city: string;
  timings: Record<string, string>;
  prayerData: any;
  date: string;
}

export function getCachedLocation(): LocationData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LocationData;
    if (parsed.date === new Date().toDateString()) return parsed;
    return { ...parsed, date: "" };
  } catch {
    return null;
  }
}

function saveLocation(data: LocationData) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  localStorage.setItem("cached_location_data", JSON.stringify({
    lat: data.lat, lng: data.lng, city: data.city,
    timings: data.timings, date: data.date,
  }));
}

async function fetchLocationData(lat: number, lng: number): Promise<LocationData> {
  const [prayerResult, city] = await Promise.all([
    QuranAPI.getPrayerTimes(lat, lng, 1, 1),
    QuranAPI.reverseGeocode(lat, lng),
  ]);
  const data: LocationData = {
    lat, lng, city,
    timings: prayerResult.timings,
    prayerData: prayerResult,
    date: new Date().toDateString(),
  };
  saveLocation(data);
  return data;
}

interface LocationContextValue {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  detect: (force?: boolean) => void;
}

const LocationContext = createContext<LocationContextValue>({
  location: null, loading: true, error: null, detect: () => {},
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(async (force = false) => {
    if (!force) {
      const cached = getCachedLocation();
      if (cached && cached.date === new Date().toDateString()) {
        setLocation(cached);
        setLoading(false);
        return;
      }
      if (cached && cached.lat && cached.lng) {
        setLocation(cached);
        setLoading(false);
        try {
          const fresh = await fetchLocationData(cached.lat, cached.lng);
          setLocation(fresh);
        } catch { }
        return;
      }
    }

    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    try {
      const { Geolocation } = await import("@capacitor/geolocation");
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 15000 });
      const data = await fetchLocationData(pos.coords.latitude, pos.coords.longitude);
      setLocation(data);
      setLoading(false);
      return;
    } catch { }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await fetchLocationData(pos.coords.latitude, pos.coords.longitude);
          setLocation(data);
        } catch {
          setError("Failed to load data");
        }
        setLoading(false);
      },
      () => {
        setError("Location permission denied");
        setLoading(false);
      },
      { timeout: 15000 }
    );
  }, []);

  useEffect(() => {
    detect(false);
  }, [detect]);

  return React.createElement(LocationContext.Provider, { value: { location, loading, error, detect } }, children);
};

export function useSharedLocation() {
  return useContext(LocationContext);
}
