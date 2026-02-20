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

    const requestPermission = async () => {
      try {
        // Try Capacitor Geolocation first
        const { Geolocation } = await import("@capacitor/geolocation");
        const result = await Geolocation.requestPermissions();
        setGranted(result.location === "granted");
      } catch {
        // Fallback to browser API
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
      } finally {
        setAsked(true);
        localStorage.setItem("location-permission-asked", "true");
      }
    };

    const timer = setTimeout(requestPermission, 1500);
    return () => clearTimeout(timer);
  }, []);

  return { granted, asked };
}
