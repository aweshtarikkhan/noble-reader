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

    // Ask for location permission on first launch
    const requestPermission = async () => {
      try {
        // For Capacitor native
        if ((window as any).Capacitor?.Plugins?.Geolocation) {
          const result = await (window as any).Capacitor.Plugins.Geolocation.requestPermissions();
          setGranted(result.location === "granted");
        } else if (navigator.geolocation) {
          // For PWA/browser
          navigator.geolocation.getCurrentPosition(
            () => setGranted(true),
            () => setGranted(false),
            { timeout: 10000 }
          );
        }
      } catch {
        setGranted(false);
      } finally {
        setAsked(true);
        localStorage.setItem("location-permission-asked", "true");
      }
    };

    // Small delay to let app render first
    const timer = setTimeout(requestPermission, 1500);
    return () => clearTimeout(timer);
  }, []);

  return { granted, asked };
}
