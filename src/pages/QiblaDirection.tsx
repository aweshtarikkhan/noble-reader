import React, { useState, useEffect, useRef } from "react";
import { Compass, LocateFixed, AlertCircle } from "lucide-react";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function calculateQibla(lat: number, lng: number): number {
  const phiK = (KAABA_LAT * Math.PI) / 180;
  const lambdaK = (KAABA_LNG * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180;
  const qibla =
    (180 / Math.PI) *
    Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
    );
  return (qibla + 360) % 360;
}

const QiblaDirection: React.FC = () => {
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [compassError, setCompassError] = useState<string | null>(null);
  const [city, setCity] = useState("Detecting...");
  const compassRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Try cached location first
    try {
      const cached = localStorage.getItem("cached_location_data");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.lat && parsed.lng) {
          setQiblaAngle(calculateQibla(parsed.lat, parsed.lng));
          setCity(parsed.city || "Unknown");
          return;
        }
      }
    } catch {}

    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const angle = calculateQibla(latitude, longitude);
        setQiblaAngle(angle);
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`;
          const res = await fetch(url, { headers: { "Accept-Language": "en" } });
          const data = await res.json();
          const addr = data.address;
          setCity(addr?.city || addr?.town || addr?.village || "Unknown");
        } catch {
          setCity("Unknown");
        }
      },
      () => setLocationError("Location permission denied. Please allow location access.")
    );
  }, []);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        // For iOS webkitCompassHeading is more accurate
        const heading = (e as any).webkitCompassHeading ?? (360 - e.alpha);
        setCompassHeading(heading);
        setCompassError(null);
      }
    };

    // iOS 13+ requires permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((state: string) => {
          if (state === "granted") {
            window.addEventListener("deviceorientation", handleOrientation, true);
          } else {
            setCompassError("Compass permission denied");
          }
        })
        .catch(() => setCompassError("Compass not available"));
    } else {
      window.addEventListener("deviceorientation", handleOrientation, true);
      // Check if compass data comes in after 3 seconds
      const timeout = setTimeout(() => {
        setCompassError("Point your device using the angle shown below. Compass sensor not detected on this device.");
      }, 3000);
      const checkHandler = (e: DeviceOrientationEvent) => {
        if (e.alpha !== null) {
          clearTimeout(timeout);
          setCompassError(null);
        }
      };
      window.addEventListener("deviceorientation", checkHandler, { once: true });
      return () => {
        window.removeEventListener("deviceorientation", handleOrientation, true);
        clearTimeout(timeout);
      };
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  const needleRotation = qiblaAngle !== null ? qiblaAngle - compassHeading : 0;

  return (
    <div className="px-4 py-6 flex flex-col items-center min-h-[70vh]">
      <div className="text-center mb-6 animate-fade-in">
        <h2 className="text-lg font-bold text-foreground mb-1">Qibla Direction</h2>
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          <LocateFixed className="w-4 h-4 text-primary" /> {city}
        </p>
      </div>

      {locationError ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center animate-fade-in">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <p className="text-sm text-muted-foreground max-w-xs">{locationError}</p>
        </div>
      ) : qiblaAngle === null ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Compass */}
          <div className="relative w-72 h-72 mb-6 animate-fade-in" ref={compassRef}>
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-2 rounded-full border border-primary/10" />

            {/* Direction labels */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">N</div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-muted-foreground">S</div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">E</div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">W</div>

            {/* Compass rotating disc */}
            <div
              className="absolute inset-6 rounded-full transition-transform duration-200"
              style={{ transform: `rotate(${-compassHeading}deg)` }}
            >
              {/* Tick marks */}
              {Array.from({ length: 72 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-0 origin-bottom"
                  style={{
                    transform: `translateX(-50%) rotate(${i * 5}deg)`,
                    height: "50%",
                  }}
                >
                  <div
                    className={`w-px mx-auto ${
                      i % 18 === 0 ? "h-3 bg-primary" : i % 6 === 0 ? "h-2 bg-primary/50" : "h-1 bg-muted-foreground/30"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Qibla needle */}
            <div
              className="absolute inset-8 rounded-full flex items-center justify-center transition-transform duration-200"
              style={{ transform: `rotate(${needleRotation}deg)` }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="text-lg">🕋</div>
                <div className="w-0.5 h-16 bg-primary rounded-full" />
              </div>
            </div>

            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-primary shadow-lg" />
            </div>
          </div>

          {/* Info */}
          <div className="text-center space-y-2 animate-fade-in">
            <p className="text-2xl font-bold text-foreground">{Math.round(qiblaAngle)}°</p>
            <p className="text-xs text-muted-foreground">Qibla direction from North</p>
            {compassError && (
              <p className="text-xs text-muted-foreground/70 max-w-xs mt-2">{compassError}</p>
            )}
          </div>

          <div className="mt-8 px-4 py-3 rounded-xl bg-card border border-primary/10 max-w-xs text-center animate-fade-in">
            <p className="text-xs text-muted-foreground">
              🕋 Face the direction of the Kaaba indicator for Qibla. On mobile, the compass rotates automatically.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default QiblaDirection;
