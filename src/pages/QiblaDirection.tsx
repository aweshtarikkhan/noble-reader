import React, { useState, useEffect, useRef, useCallback } from "react";
import { AlertCircle, Navigation, RotateCw, Smartphone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

// Kaaba coordinates (precise)
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

/**
 * Calculate Qibla bearing using the great-circle (forward azimuth) formula.
 * Returns bearing in degrees from True North (0-360).
 */
function calculateQiblaBearing(lat: number, lng: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA_LAT);
  const dLambda = toRad(KAABA_LNG - lng);

  // Standard great-circle initial bearing formula
  const y = Math.sin(dLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLambda);
  const bearing = toDeg(Math.atan2(y, x));

  return ((bearing % 360) + 360) % 360;
}

/**
 * Compute compass heading from alpha/beta/gamma with tilt compensation.
 * This handles the phone being held at any angle, not just flat.
 */
function computeCompassHeading(alpha: number, beta: number, gamma: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const alphaRad = toRad(alpha);
  const betaRad = toRad(beta);
  const gammaRad = toRad(gamma);

  // Rotation matrix components for tilt compensation
  const cA = Math.cos(alphaRad);
  const sA = Math.sin(alphaRad);
  const cB = Math.cos(betaRad);
  const sB = Math.sin(betaRad);
  const cG = Math.cos(gammaRad);
  const sG = Math.sin(gammaRad);

  // Compute compass heading with tilt compensation
  // Project the device's y-axis onto the horizontal plane
  const rA = -cA * sG - sA * sB * cG;
  const rB = -sA * sG + cA * sB * cG;

  // Compass heading in degrees
  let compassHeading = toDeg(Math.atan2(rA, rB));

  // Normalize to 0-360
  compassHeading = ((compassHeading % 360) + 360) % 360;

  return compassHeading;
}

/**
 * Smooth angle using circular interpolation (handles 0/360 wraparound).
 */
function smoothAngle(current: number, target: number, factor: number = 0.2): number {
  let diff = target - current;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  let result = current + diff * factor;
  return ((result % 360) + 360) % 360;
}

/**
 * Calculate distance to Kaaba in km using Haversine formula.
 */
function distanceToKaaba(lat: number, lng: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(KAABA_LAT - lat);
  const dLon = toRad(KAABA_LNG - lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(KAABA_LAT)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const QiblaDirection: React.FC = () => {
  const { t } = useI18n();
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [hasCompass, setHasCompass] = useState(false);
  const [compassError, setCompassError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [needsIOSPermission, setNeedsIOSPermission] = useState(false);
  const [calibrating, setCalibrating] = useState(true);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const smoothHeadingRef = useRef(0);
  const rafRef = useRef<number>();
  const sampleCountRef = useRef(0);
  const latestHeadingRef = useRef(0);
  const headingBufferRef = useRef<number[]>([]);
  const hasCompassRef = useRef(false);
  const useAbsoluteRef = useRef(false);

  // Get user location
  useEffect(() => {
    let cancelled = false;
    const getLocation = async () => {
      try {
        const { Geolocation } = await import("@capacitor/geolocation");
        const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 });
        if (!cancelled) {
          const bearing = calculateQiblaBearing(pos.coords.latitude, pos.coords.longitude);
          setQiblaAngle(bearing);
          setDistance(distanceToKaaba(pos.coords.latitude, pos.coords.longitude));
        }
        return;
      } catch {}

      if (!navigator.geolocation) {
        setLocationError("Geolocation not supported");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!cancelled) {
            const bearing = calculateQiblaBearing(pos.coords.latitude, pos.coords.longitude);
            setQiblaAngle(bearing);
            setDistance(distanceToKaaba(pos.coords.latitude, pos.coords.longitude));
          }
        },
        () => {
          if (!cancelled) setLocationError("Location permission denied.");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    };
    getLocation();
    return () => { cancelled = true; };
  }, []);

  // Stable orientation handler using refs (no dependency issues)
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.alpha === null && (e as any).webkitCompassHeading === undefined) return;

    let heading: number;

    if ((e as any).webkitCompassHeading !== undefined) {
      heading = (e as any).webkitCompassHeading as number;
      if ((e as any).webkitCompassAccuracy !== undefined) {
        setAccuracy((e as any).webkitCompassAccuracy);
      }
    } else {
      heading = computeCompassHeading(e.alpha || 0, e.beta || 0, e.gamma || 0);
    }

    // Buffer for circular mean averaging
    const buffer = headingBufferRef.current;
    buffer.push(heading);
    if (buffer.length > 5) buffer.shift();

    let sinSum = 0, cosSum = 0;
    for (const h of buffer) {
      sinSum += Math.sin((h * Math.PI) / 180);
      cosSum += Math.cos((h * Math.PI) / 180);
    }
    const avgHeading = ((Math.atan2(sinSum / buffer.length, cosSum / buffer.length) * 180) / Math.PI + 360) % 360;

    latestHeadingRef.current = avgHeading;
    sampleCountRef.current++;

    if (sampleCountRef.current > 15) setCalibrating(false);

    if (!hasCompassRef.current) {
      hasCompassRef.current = true;
      setHasCompass(true);
    }
    setCompassError(null);

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        smoothHeadingRef.current = smoothAngle(smoothHeadingRef.current, latestHeadingRef.current, 0.25);
        setCompassHeading(smoothHeadingRef.current);
        rafRef.current = undefined;
      });
    }
  }, []);

  // Set up orientation listeners (stable, runs once)
  useEffect(() => {
    // Check if iOS needs permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      setNeedsIOSPermission(true);
      return;
    }

    let usingAbsolute = false;
    const absoluteHandler = (e: DeviceOrientationEvent) => {
      if (!usingAbsolute) {
        usingAbsolute = true;
        useAbsoluteRef.current = true;
        window.removeEventListener("deviceorientation", handleOrientation, true);
      }
      handleOrientation(e);
    };

    window.addEventListener("deviceorientationabsolute" as any, absoluteHandler, true);
    window.addEventListener("deviceorientation", handleOrientation, true);

    const timeout = setTimeout(() => {
      if (!hasCompassRef.current) {
        setCompassError("Compass sensor not detected. Make sure you're using a mobile device.");
        setCalibrating(false);
      }
    }, 5000);

    return () => {
      window.removeEventListener("deviceorientationabsolute" as any, absoluteHandler, true);
      window.removeEventListener("deviceorientation", handleOrientation, true);
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleOrientation]);

  // Request iOS permission
  const requestIOSPermission = async () => {
    try {
      const state = await (DeviceOrientationEvent as any).requestPermission();
      if (state === "granted") {
        setNeedsIOSPermission(false);

        // Try absolute first on iOS too
        window.addEventListener("deviceorientationabsolute" as any, (e: any) => {
          setUseAbsolute(true);
          handleOrientation(e);
        }, true);
        window.addEventListener("deviceorientation", handleOrientation, true);
      } else {
        setCompassError("Compass permission denied");
        setNeedsIOSPermission(false);
      }
    } catch {
      setCompassError("Compass not available on this device");
      setNeedsIOSPermission(false);
    }
  };

  // Calculate rotations
  const discRotation = -compassHeading;
  const needleRotation = qiblaAngle !== null ? qiblaAngle - compassHeading : 0;
  let alignDiff = needleRotation % 360;
  if (alignDiff > 180) alignDiff -= 360;
  if (alignDiff < -180) alignDiff += 360;
  const isPointingQibla = qiblaAngle !== null && hasCompass && Math.abs(alignDiff) < 5;

  return (
    <div className="px-4 py-6 flex flex-col items-center min-h-[70vh]">
      {/* Header */}
      <div className="text-center mb-4 animate-fade-in">
        <h2 className="text-lg font-bold text-foreground mb-1">{t("qibla.title")}</h2>
        <p className="text-xs text-muted-foreground">{t("qibla.pointPhone")}</p>
      </div>

      {locationError ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center animate-fade-in">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <p className="text-sm text-muted-foreground max-w-xs">{locationError}</p>
        </div>
      ) : qiblaAngle === null ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground">{t("qibla.gettingLocation")}</p>
        </div>
      ) : (
        <>
          {/* iOS Permission Button */}
          {needsIOSPermission && (
            <button
              onClick={requestIOSPermission}
              className="mb-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium animate-fade-in flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" /> {t("qibla.enableCompass")}
            </button>
          )}

          {/* Calibrating indicator */}
          {calibrating && hasCompass && (
            <div className="mb-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/50 animate-fade-in">
              <RotateCw className="w-4 h-4 text-primary animate-spin" />
              <p className="text-xs text-muted-foreground">{t("qibla.calibrating")}</p>
            </div>
          )}

          {/* Compass */}
          <div className="relative w-72 h-72 mb-6 animate-fade-in">
            {/* Outer ring */}
            <div
              className={`absolute inset-0 rounded-full border-2 transition-colors duration-300 ${
                isPointingQibla
                  ? "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  : "border-primary/20"
              }`}
            />

            {/* Fixed top marker (phone direction indicator) */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45 rounded-sm z-10" />

            {/* Rotating compass disc */}
            <div
              className="absolute inset-2 rounded-full"
              style={{
                transform: `rotate(${discRotation}deg)`,
                transition: "transform 0.08s linear",
              }}
            >
              {/* Compass background */}
              <div className="absolute inset-0 rounded-full bg-card border border-primary/10" />

              {/* Cardinal directions */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-destructive z-10">N</div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-muted-foreground z-10">S</div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground z-10">E</div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground z-10">W</div>

              {/* Tick marks */}
              {Array.from({ length: 72 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-0 origin-bottom"
                  style={{ transform: `translateX(-50%) rotate(${i * 5}deg)`, height: "50%" }}
                >
                  <div
                    className={`w-px mx-auto ${
                      i === 0
                        ? "h-3 bg-destructive"
                        : i % 18 === 0
                        ? "h-3 bg-primary"
                        : i % 6 === 0
                        ? "h-2 bg-primary/50"
                        : "h-1 bg-muted-foreground/30"
                    }`}
                  />
                </div>
              ))}

              {/* Qibla needle (rotated to qibla bearing on the disc) */}
              <div
                className="absolute inset-4 rounded-full"
                style={{ transform: `rotate(${qiblaAngle}deg)` }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="text-lg drop-shadow-md">🕋</div>
                  <div
                    className={`w-0.5 h-14 rounded-full transition-colors duration-300 ${
                      isPointingQibla
                        ? "bg-gradient-to-b from-green-500 to-green-500/20"
                        : "bg-gradient-to-b from-primary to-primary/20"
                    }`}
                  />
                </div>
              </div>

              {/* North needle */}
              <div className="absolute inset-4 rounded-full">
                <div className="absolute top-1 left-1/2 -translate-x-1/2">
                  <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-destructive" />
                </div>
              </div>
            </div>

            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div
                className={`w-3 h-3 rounded-full shadow-lg transition-colors duration-300 ${
                  isPointingQibla ? "bg-green-500" : "bg-primary"
                }`}
              />
            </div>
          </div>

          {/* Info section */}
          <div className="text-center space-y-2 animate-fade-in">
            {isPointingQibla && (
              <p className="text-sm font-bold text-green-500 animate-pulse">
                {t("qibla.facingQibla")}
              </p>
            )}
            <p className="text-2xl font-bold text-foreground">{Math.round(qiblaAngle)}°</p>
            <p className="text-xs text-muted-foreground">{t("qibla.bearing")}</p>

            {hasCompass && (
              <p className="text-xs text-muted-foreground/70">
                {t("qibla.compass")}: {Math.round(compassHeading)}°
                {useAbsolute && " (True North)"}
              </p>
            )}

            {distance !== null && (
              <p className="text-xs text-muted-foreground/70">
                🕋 {Math.round(distance).toLocaleString()} km
              </p>
            )}

            {accuracy !== null && accuracy > 15 && (
              <div className="flex items-center justify-center gap-1 mt-1">
                <Smartphone className="w-3 h-3 text-amber-500" />
                <p className="text-[10px] text-amber-500">
                  {t("qibla.calibrating")}
                </p>
              </div>
            )}

            {compassError && (
              <p className="text-xs text-muted-foreground/70 max-w-xs mt-2">{compassError}</p>
            )}
          </div>

          {/* Tips */}
          <div className="mt-8 px-4 py-3 rounded-xl bg-card border border-border max-w-xs text-center animate-fade-in">
            <p className="text-xs text-muted-foreground">{t("qibla.keepDeviceFlat")}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default QiblaDirection;
