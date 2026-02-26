import React, { useState, useEffect, useRef, useCallback } from "react";
import { LocateFixed, AlertCircle } from "lucide-react";
import { useSharedLocation } from "@/hooks/useSharedLocation";

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
  const { location, error: locError } = useSharedLocation();
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [hasCompass, setHasCompass] = useState(false);
  const [compassError, setCompassError] = useState<string | null>(null);
  const [needsIOSPermission, setNeedsIOSPermission] = useState(false);
  const headingRef = useRef(0);
  const rafRef = useRef<number>();

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.alpha !== null) {
      const heading = (e as any).webkitCompassHeading ?? (360 - e.alpha);
      headingRef.current = heading;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setCompassHeading(headingRef.current);
          setHasCompass(true);
          setCompassError(null);
          rafRef.current = undefined;
        });
      }
    }
  }, []);

  // Derive qibla from shared location
  useEffect(() => {
    if (location && location.lat && location.lng) {
      setQiblaAngle(calculateQibla(location.lat, location.lng));
    }
  }, [location]);

  // Start compass
  useEffect(() => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      setNeedsIOSPermission(true);
      return;
    }

    window.addEventListener("deviceorientation", handleOrientation, true);
    const timeout = setTimeout(() => {
      setCompassError("Compass sensor not detected. Use the angle shown below to find Qibla direction manually.");
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
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleOrientation]);

  const requestIOSPermission = async () => {
    try {
      const state = await (DeviceOrientationEvent as any).requestPermission();
      if (state === "granted") {
        setNeedsIOSPermission(false);
        window.addEventListener("deviceorientation", handleOrientation, true);
      } else {
        setCompassError("Compass permission denied");
        setNeedsIOSPermission(false);
      }
    } catch {
      setCompassError("Compass not available");
      setNeedsIOSPermission(false);
    }
  };

  const discRotation = -compassHeading;

  return (
    <div className="px-4 py-6 flex flex-col items-center min-h-[70vh]">
      <div className="text-center mb-6 animate-fade-in">
        <h2 className="text-lg font-bold text-foreground mb-1">Qibla Direction</h2>
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          <LocateFixed className="w-4 h-4 text-primary" /> {location?.city || "Detecting..."}
        </p>
      </div>

      {locError ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center animate-fade-in">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <p className="text-sm text-muted-foreground max-w-xs">{locError}</p>
        </div>
      ) : qiblaAngle === null ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {needsIOSPermission && (
            <button
              onClick={requestIOSPermission}
              className="mb-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium animate-fade-in"
            >
              Enable Compass
            </button>
          )}

          <div className="relative w-72 h-72 mb-6 animate-fade-in">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45 rounded-sm z-10" />

            <div
              className="absolute inset-2 rounded-full transition-transform duration-150 ease-out"
              style={{ transform: `rotate(${discRotation}deg)` }}
            >
              <div className="absolute inset-0 rounded-full bg-card border border-primary/10" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-destructive z-10">N</div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-muted-foreground z-10">S</div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground z-10">E</div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground z-10">W</div>

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
                      i === 0 ? "h-3 bg-destructive" :
                      i % 18 === 0 ? "h-3 bg-primary" :
                      i % 6 === 0 ? "h-2 bg-primary/50" :
                      "h-1 bg-muted-foreground/30"
                    }`}
                  />
                </div>
              ))}

              <div
                className="absolute inset-4 rounded-full"
                style={{ transform: `rotate(${qiblaAngle}deg)` }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="text-lg drop-shadow-md">🕋</div>
                  <div className="w-0.5 h-14 bg-gradient-to-b from-primary to-primary/20 rounded-full" />
                </div>
              </div>

              <div className="absolute inset-4 rounded-full">
                <div className="absolute top-1 left-1/2 -translate-x-1/2">
                  <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-destructive" />
                </div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-3 h-3 rounded-full bg-primary shadow-lg" />
            </div>
          </div>

          <div className="text-center space-y-2 animate-fade-in">
            <p className="text-2xl font-bold text-foreground">{Math.round(qiblaAngle)}°</p>
            <p className="text-xs text-muted-foreground">Qibla bearing from North</p>
            {hasCompass && (
              <p className="text-xs text-muted-foreground/70">Compass heading: {Math.round(compassHeading)}°</p>
            )}
            {compassError && (
              <p className="text-xs text-muted-foreground/70 max-w-xs mt-2">{compassError}</p>
            )}
          </div>

          <div className="mt-8 px-4 py-3 rounded-xl bg-card border border-primary/10 max-w-xs text-center animate-fade-in">
            <p className="text-xs text-muted-foreground">
              🕋 The Kaaba icon points toward Qibla. On mobile, the compass rotates automatically. Keep your device flat for best accuracy.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default QiblaDirection;
