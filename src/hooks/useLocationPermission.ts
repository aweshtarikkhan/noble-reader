import { useEffect, useState } from "react";

export function useLocationPermission() {
  const [granted, setGranted] = useState(false);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    const alreadyAsked = localStorage.getItem("location-permission-asked");
    if (alreadyAsked) {
      setAsked(true);
      return;
    }

    const requestPermissions = async () => {
      // Request location permission
      try {
        const { Geolocation } = await import("@capacitor/geolocation");
        const result = await Geolocation.requestPermissions();
        setGranted(result.location === "granted");
      } catch {
        try {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              () => setGranted(true),
              () => setGranted(false),
              { timeout: 10000 }
            );
          }
        } catch {
          setGranted(false);
        }
      }

      // Request file storage permission (Android)
      try {
        const { Filesystem } = await import("@capacitor/filesystem");
        // Requesting permissions triggers the native dialog on Android
        await (Filesystem as any).requestPermissions?.();
      } catch {
        // Not on native or already granted - ignore
      }

      setAsked(true);
      localStorage.setItem("location-permission-asked", "true");
    };

    const timer = setTimeout(requestPermissions, 1500);
    return () => clearTimeout(timer);
  }, []);

  return { granted, asked };
}
