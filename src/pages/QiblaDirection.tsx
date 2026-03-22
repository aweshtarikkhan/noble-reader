import React, { useState, useEffect, useRef, useCallback } from "react";
import { AlertCircle, Navigation, RotateCw, Smartphone, RefreshCw } from "lucide-react";
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
  const y = Math.sin(dLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLambda);
  return (((toDeg(Math.atan2(y, x))) % 360) + 360) % 360;
}

/**
 * Robust compass heading from device orientation.
 * Works in any phone position: flat, upright, tilted, landscape, etc.
 */
function computeCompassHeading(alpha: number, beta: number, gamma: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;

  const a = toRad(alpha);
  const b = toRad(beta);
  const g = toRad(gamma);

  // Build the full ZXY rotation matrix from Euler angles
  const cA = Math.cos(a), sA = Math.sin(a);
  const cB = Math.cos(b), sB = Math.sin(b);
  const cG = Math.cos(g), sG = Math.sin(g);

  // Rotation matrix R = Rz(alpha) * Rx(beta) * Ry(gamma)
  // We need to find where the device's top (positive Y axis) projects
  // onto the horizontal (Earth XY) plane to get compass heading.
  //
  // The device Y-axis in Earth frame:
  // Vy_earth_x = cA * sG * cB + sA * sB   ... actually let's use the
  // well-known W3C formula for compass heading with full tilt compensation.

  // Method: compute the device's projection of North onto the screen plane.
  // This is more robust than projecting device Y onto Earth horizontal.

  // Earth's North vector in device frame:
  // Nx_dev = cA * cG + sA * sB * sG
  // Ny_dev = sA * cG - cA * sB * sG  (not needed)
  // Using the standard formula from W3C DeviceOrientation spec:

  // Compass heading = atan2(
  //   cos(alpha)*sin(gamma) + sin(alpha)*sin(beta)*cos(gamma),
  //   sin(alpha)*sin(gamma) - cos(alpha)*sin(beta)*cos(gamma)
  // )
  // But this has known sign issues. Use the definitive Google Chrome formula:

  const Vx = -cA * sG - sA * sB * cG;
  const Vy = -sA * sG + cA * sB * cG;

  // Check if values are usable (avoid NaN from degenerate cases)
  if (Math.abs(Vx) < 1e-10 && Math.abs(Vy) < 1e-10) {
    // Device is perfectly flat - fall back to alpha directly
    return alpha;
  }

  let heading = Math.atan2(Vx, Vy) * (180 / Math.PI);

  // Normalize to 0-360
  heading = ((heading % 360) + 360) % 360;

  return heading;
}

/**
 * Smooth angle using circular interpolation (handles 0/360 wraparound).
 */
function smoothAngle(current: number, target: number, factor: number = 0.15): number {
  let diff = target - current;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return (((current + diff * factor) % 360) + 360) % 360;
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

/**
 * Try to get location from multiple sources with retries.
 */
async function getLocationRobust(): Promise<{ lat: number; lng: number } | null> {
  // Try Capacitor first
  try {
    const { Geolocation } = await import("@capacitor/geolocation");
    try {
      await Geolocation.requestPermissions();
    } catch {}
    const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 20000 });
    if (pos?.coords) return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch {}

  // Try high accuracy browser geolocation
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) { reject(new Error("no geo")); return; }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true, timeout: 15000, maximumAge: 60000,
      });
    });
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch {}

  // Try low accuracy as last resort
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) { reject(new Error("no geo")); return; }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false, timeout: 30000, maximumAge: 300000,
      });
    });
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch {}

  return null;
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
  const [retrying, setRetrying] = useState(false);

  const smoothHeadingRef = useRef(0);
  const rafRef = useRef<number>();
  const sampleCountRef = useRef(0);
  const latestHeadingRef = useRef(0);
  const headingBufferRef = useRef<number[]>([]);
  const hasCompassRef = useRef(false);
  const useAbsoluteRef = useRef(false);
  const mountedRef = useRef(true);

  // Robust location fetcher with retry
  const fetchLocation = useCallback(async () => {
    setLocationError(null);
    setRetrying(true);
    try {
      const loc = await getLocationRobust();
      if (!mountedRef.current) return;
      if (loc) {
        setQiblaAngle(calculateQiblaBearing(loc.lat, loc.lng));
        setDistance(distanceToKaaba(loc.lat, loc.lng));
        setLocationError(null);
      } else {
        setLocationError("Location permission denied or unavailable. Please enable location access.");
      }
    } catch {
      if (mountedRef.current) {
        setLocationError("Could not get location. Please check your settings.");
      }
    } finally {
      if (mountedRef.current) setRetrying(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchLocation();
    return () => { mountedRef.current = false; };
  }, [fetchLocation]);

  // Stable orientation handler
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    try {
      if (e.alpha === null && (e as any).webkitCompassHeading === undefined) return;

      let heading: number;

      if ((e as any).webkitCompassHeading !== undefined) {
        // iOS - direct compass heading
        heading = (e as any).webkitCompassHeading as number;
        if ((e as any).webkitCompassAccuracy !== undefined) {
          setAccuracy((e as any).webkitCompassAccuracy);
        }
      } else {
        // Android / other - compute from euler angles
        const alpha = e.alpha ?? 0;
        const beta = e.beta ?? 0;
        const gamma = e.gamma ?? 0;

        // Validate inputs - reject garbage values
        if (!isFinite(alpha) || !isFinite(beta) || !isFinite(gamma)) return;

        heading = computeCompassHeading(alpha, beta, gamma);

        // Sanity check output
        if (!isFinite(heading) || heading < 0 || heading > 360) return;
      }

      // Circular mean buffer for smoothing
      const buffer = headingBufferRef.current;
      buffer.push(heading);
      if (buffer.length > 8) buffer.shift();

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
          smoothHeadingRef.current = smoothAngle(smoothHeadingRef.current, latestHeadingRef.current, 0.2);
          setCompassHeading(smoothHeadingRef.current);
          rafRef.current = undefined;
        });
      }
    } catch {
      // Silently ignore any sensor errors - don't crash the UI
    }
  }, []);

  // Set up orientation listeners
  useEffect(() => {
    // Check if DeviceOrientationEvent exists at all
    if (typeof DeviceOrientationEvent === "undefined") {
      setCompassError("Compass not supported on this device/browser.");
      setCalibrating(false);
      return;
    }

    // iOS permission check
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      setNeedsIOSPermission(true);
      return;
    }

    let usingAbsolute = false;
    const absoluteHandler = (e: DeviceOrientationEvent) => {
      try {
        if (!usingAbsolute) {
          usingAbsolute = true;
          useAbsoluteRef.current = true;
          window.removeEventListener("deviceorientation", handleOrientation, true);
        }
        handleOrientation(e);
      } catch {}
    };

    // Listen to both - prefer absolute (true north)
    try {
      window.addEventListener("deviceorientationabsolute" as any, absoluteHandler, true);
    } catch {}
    try {
      window.addEventListener("deviceorientation", handleOrientation, true);
    } catch {}

    const timeout = setTimeout(() => {
      if (!hasCompassRef.current) {
        setCompassError("Compass sensor not detected. Use a mobile device with compass sensor.");
        setCalibrating(false);
      }
    }, 6000);

    return () => {
      try { window.removeEventListener("deviceorientationabsolute" as any, absoluteHandler, true); } catch {}
      try { window.removeEventListener("deviceorientation", handleOrientation, true); } catch {}
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleOrientation]);

  // iOS permission request
  const requestIOSPermission = async () => {
    try {
      const state = await (DeviceOrientationEvent as any).requestPermission();
      if (state === "granted") {
        setNeedsIOSPermission(false);
        try {
          window.addEventListener("deviceorientationabsolute" as any, (e: any) => {
            useAbsoluteRef.current = true;
            handleOrientation(e);
          }, true);
        } catch {}
        try {
          window.addEventListener("deviceorientation", handleOrientation, true);
        } catch {}
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
          <button
            onClick={fetchLocation}
            disabled={retrying}
            className="mt-3 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${retrying ? "animate-spin" : ""}`} />
            {retrying ? "Trying..." : "Retry Location"}
          </button>
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

            {/* Fixed top marker */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45 rounded-sm z-10" />

            {/* Rotating compass disc */}
            <div
              className="absolute inset-2 rounded-full"
              style={{
                transform: `rotate(${discRotation}deg)`,
                transition: "transform 0.08s linear",
              }}
            >
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
                      i === 0 ? "h-3 bg-destructive"
                        : i % 18 === 0 ? "h-3 bg-primary"
                        : i % 6 === 0 ? "h-2 bg-primary/50"
                        : "h-1 bg-muted-foreground/30"
                    }`}
                  />
                </div>
              ))}

              {/* Qibla needle */}
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
                {useAbsoluteRef.current && " (True North)"}
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
          <div className="mt-8 px-4 py-3 rounded-xl bg-card border border-border max-w-xs text-center animate-fade-in space-y-2">
            <p className="text-xs text-muted-foreground">{t("qibla.keepDeviceFlat")}</p>
            <div className="border-t border-border pt-2">
              <p className="text-[10px] text-amber-500/90 leading-relaxed">
                ⚠️ Direction mein error ho sakta hai mobile ki position ki wajah se. Best result ke liye mobile ko flat (seedha) rakhein. Ye sirf ek estimate hai, 100% accurate nahi ho sakta.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QiblaDirection;
