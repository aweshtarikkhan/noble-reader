import React, { useState, useCallback, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  AZAAN_OPTIONS,
  PRAYER_NAMES,
  loadAzaanSettings,
  saveAzaanSettings,
  type AzaanSettings as AzaanSettingsType,
  type PrayerName,
} from "@/data/azaanOptions";
import { stopAzaan } from "@/hooks/useAzaanScheduler";

const AzaanSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AzaanSettingsType>(loadAzaanSettings);
  const [previewPlaying, setPreviewPlaying] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [permStatus, setPermStatus] = useState({ notification: "", location: "" });

  const update = useCallback((partial: Partial<AzaanSettingsType>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveAzaanSettings(next);
      return next;
    });
  }, []);

  const togglePrayer = useCallback((prayer: PrayerName) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        enabledPrayers: { ...prev.enabledPrayers, [prayer]: !prev.enabledPrayers[prayer] },
      };
      saveAzaanSettings(next);
      return next;
    });
  }, []);

  const setManualTime = useCallback((prayer: PrayerName, time: string) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        manualTimings: { ...prev.manualTimings, [prayer]: time },
      };
      saveAzaanSettings(next);
      return next;
    });
  }, []);

  // Check permission status (read-only, no prompts)
  const checkPermissions = useCallback(async () => {
    let notif = "default";
    if ("Notification" in window) {
      notif = Notification.permission;
    }
    let loc = "prompt";
    try {
      const result = await navigator.permissions.query({ name: "geolocation" as PermissionName });
      loc = result.state;
    } catch {}
    setPermStatus({ notification: notif, location: loc });
  }, []);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  // MUST be called directly from a click handler (user gesture)
  const handleGrantPermissions = async () => {
    // 1. Notification — must be in direct click handler
    if ("Notification" in window && Notification.permission !== "granted") {
      try {
        await Notification.requestPermission();
      } catch (e) {
        console.warn("Notification permission error:", e);
      }
    }

    // 2. Geolocation — triggers browser prompt
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => console.log("Location granted"),
        (err) => console.warn("Location denied:", err),
        { timeout: 10000 }
      );
    }

    // 3. Capacitor permissions (for APK)
    try {
      const { Geolocation } = await import("@capacitor/geolocation");
      await Geolocation.requestPermissions();
    } catch {
      // Not running in Capacitor, ignore
    }

    // 4. Try to play a silent audio to unlock audio context (user gesture required)
    try {
      const silentAudio = new Audio();
      silentAudio.volume = 0.01;
      silentAudio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
      await silentAudio.play();
      silentAudio.pause();
    } catch {}

    // Re-check after a delay
    setTimeout(() => checkPermissions(), 1000);
  };

  // Preview azaan — called directly from click
  const previewAzaan = (id: string) => {
    // Stop current
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.currentTime = 0;
    }
    if (previewPlaying === id) {
      setPreviewPlaying(null);
      setPreviewAudio(null);
      return;
    }
    const option = AZAAN_OPTIONS.find((a) => a.id === id);
    if (!option) return;

    const audio = new Audio(option.url);
    audio.volume = settings.volume;
    audio.crossOrigin = "anonymous";

    // Play directly in user gesture
    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch((err) => {
        console.error("Audio play failed:", err);
        // Retry with user interaction already established
      });
    }

    audio.onended = () => {
      setPreviewPlaying(null);
      setPreviewAudio(null);
    };
    audio.onerror = (e) => {
      console.error("Audio load error:", e);
      setPreviewPlaying(null);
      setPreviewAudio(null);
    };
    setPreviewPlaying(id);
    setPreviewAudio(audio);
  };

  const handleToggleEnabled = (checked: boolean) => {
    update({ enabled: checked });
    if (checked) {
      // Request permissions directly in user gesture
      handleGrantPermissions();
    } else {
      stopAzaan();
    }
  };

  return (
    <div className="px-4 py-4 space-y-5 animate-fade-in">
      {/* Master toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-gold/10 shadow-gold">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Azaan Alerts</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Play Azaan at prayer times</p>
        </div>
        <Switch checked={settings.enabled} onCheckedChange={handleToggleEnabled} />
      </div>

      {settings.enabled && (
        <>
          {/* Permissions Status */}
          <div className="p-4 rounded-2xl bg-card border border-gold/10 space-y-2">
            <p className="text-xs text-muted-foreground font-semibold mb-2">Permissions</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground">🔔 Notifications</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                permStatus.notification === "granted"
                  ? "bg-secondary/20 text-secondary"
                  : permStatus.notification === "denied"
                  ? "bg-destructive/20 text-destructive"
                  : "bg-primary/20 text-gold"
              }`}>
                {permStatus.notification === "granted" ? "Allowed" : permStatus.notification === "denied" ? "Blocked — open settings" : "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground">📍 Location</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                permStatus.location === "granted"
                  ? "bg-secondary/20 text-secondary"
                  : permStatus.location === "denied"
                  ? "bg-destructive/20 text-destructive"
                  : "bg-primary/20 text-gold"
              }`}>
                {permStatus.location === "granted" ? "Allowed" : permStatus.location === "denied" ? "Blocked — open settings" : "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground">🔊 Audio</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/20 text-secondary">
                Ready
              </span>
            </div>
            {(permStatus.notification !== "granted" || permStatus.location !== "granted") && (
              <button
                onClick={handleGrantPermissions}
                className="w-full mt-2 py-2.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground transition-smooth active:scale-95"
              >
                🔐 Grant Required Permissions
              </button>
            )}
            {permStatus.notification === "denied" && (
              <p className="text-xs text-destructive mt-1">
                Notifications are blocked. Please enable them from your browser/app settings.
              </p>
            )}
          </div>

          {/* Test Sound */}
          <button
            onClick={() => {
              const option = AZAAN_OPTIONS.find((a) => a.id === settings.selectedAzaanId);
              if (!option) return;
              if (previewAudio) {
                previewAudio.pause();
                previewAudio.currentTime = 0;
                setPreviewPlaying(null);
                setPreviewAudio(null);
                return;
              }
              const audio = new Audio(option.url);
              audio.volume = settings.volume;
              audio.play().catch(console.error);
              audio.onended = () => { setPreviewPlaying(null); setPreviewAudio(null); };
              setPreviewPlaying(option.id);
              setPreviewAudio(audio);
            }}
            className="w-full py-3 rounded-xl bg-secondary/20 border border-secondary/20 text-sm font-medium text-secondary transition-smooth active:scale-95"
          >
            {previewAudio ? "⏸ Stop Test" : "🔊 Test Current Azaan Sound"}
          </button>

          {/* Volume */}
          <div className="p-4 rounded-2xl bg-card border border-gold/10">
            <p className="text-xs text-muted-foreground mb-3">Volume</p>
            <div className="flex items-center gap-3">
              <span className="text-sm">🔈</span>
              <Slider
                value={[settings.volume * 100]}
                onValueChange={([v]) => update({ volume: v / 100 })}
                max={100}
                step={5}
                className="flex-1"
              />
              <span className="text-sm">🔊</span>
            </div>
          </div>

          {/* Azaan selection */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground px-1">Choose Azaan Style</p>
            {AZAAN_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => update({ selectedAzaanId: option.id })}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-smooth text-left ${
                  settings.selectedAzaanId === option.id
                    ? "bg-primary/10 border-primary/30"
                    : "bg-card border-gold/5 hover:border-gold/15"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    settings.selectedAzaanId === option.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {settings.selectedAzaanId === option.id ? "✓" : "♪"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{option.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {option.style} • {option.muezzin}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    previewAzaan(option.id);
                  }}
                  className="px-2 py-1 rounded-lg bg-muted text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  {previewPlaying === option.id ? "⏸ Stop" : "▶ Play"}
                </button>
              </button>
            ))}
          </div>

          {/* Per-prayer toggles & manual timing */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground px-1">Prayer Settings</p>
            {PRAYER_NAMES.map((prayer) => (
              <div
                key={prayer}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-gold/5"
              >
                <Switch
                  checked={settings.enabledPrayers[prayer]}
                  onCheckedChange={() => togglePrayer(prayer)}
                  className="scale-90"
                />
                <span className="text-sm font-medium text-foreground flex-1">{prayer}</span>
                <input
                  type="time"
                  value={settings.manualTimings[prayer]}
                  onChange={(e) => setManualTime(prayer, e.target.value)}
                  placeholder="Auto"
                  className="bg-muted text-foreground text-xs px-2 py-1 rounded-lg border border-gold/10 w-24 text-center"
                />
              </div>
            ))}
            <p className="text-xs text-muted-foreground px-1 italic">
              Set time manually or leave blank for auto (location-based)
            </p>
          </div>

          {/* Info */}
          <div className="p-3 rounded-xl bg-surface border border-gold/10">
            <p className="text-xs text-muted-foreground leading-relaxed">
              ℹ️ Azaan will play at prayer times. Use the volume button on your device to stop.
              Notifications will alert you even when you're on another page.
              For background playback when the app is closed, build the native APK with Capacitor.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AzaanSettingsPage;
