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
      // 1. Notification permission
      try {
        const { LocalNotifications } = await import("@capacitor/local-notifications");
        await LocalNotifications.requestPermissions();
      } catch {
        if ("Notification" in window && Notification.permission === "default") {
          try { await Notification.requestPermission(); } catch {}
        }
      }

      // 2. Location permission
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

      // 3. File storage permission (Android)
      try {
        const { Filesystem } = await import("@capacitor/filesystem");
        await (Filesystem as any).requestPermissions?.();
      } catch {}

      setAsked(true);
      localStorage.setItem("location-permission-asked", "true");
    };

    const timer = setTimeout(requestPermissions, 1500);
    return () => clearTimeout(timer);
  }, []);

  return { granted, asked };
}
