import React, { useState, useCallback, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { AZAAN_OPTIONS, PRAYER_NAMES, loadAzaanSettings, saveAzaanSettings, type AzaanSettings as AzaanSettingsType, type PrayerName } from "@/data/azaanOptions";
import { stopAzaan } from "@/hooks/useAzaanScheduler";
import { useI18n } from "@/lib/i18n";

const AzaanSettingsPage: React.FC = () => {
  const { t } = useI18n();
  const [settings, setSettings] = useState<AzaanSettingsType>(loadAzaanSettings);
  const [previewPlaying, setPreviewPlaying] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  const update = useCallback((partial: Partial<AzaanSettingsType>) => { setSettings((prev) => { const next = { ...prev, ...partial }; saveAzaanSettings(next); return next; }); }, []);
  const setManualTime = useCallback((prayer: PrayerName, time: string) => { setSettings((prev) => { const next = { ...prev, manualTimings: { ...prev.manualTimings, [prayer]: time } }; saveAzaanSettings(next); return next; }); }, []);

  const requestPermissionsIfNeeded = async () => {
    try { const { LocalNotifications } = await import("@capacitor/local-notifications"); const perm = await LocalNotifications.checkPermissions(); if (perm.display !== "granted") await LocalNotifications.requestPermissions(); } catch { if ("Notification" in window && Notification.permission !== "granted") { try { await Notification.requestPermission(); } catch {} } }
    try { const { Geolocation } = await import("@capacitor/geolocation"); await Geolocation.requestPermissions(); } catch { if (navigator.geolocation) navigator.geolocation.getCurrentPosition(() => {}, () => {}, { timeout: 10000 }); }
    try { const silentAudio = new Audio(); silentAudio.volume = 0.01; silentAudio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="; await silentAudio.play(); silentAudio.pause(); } catch {}
  };

  const previewAzaan = (id: string) => {
    if (previewAudio) { previewAudio.pause(); previewAudio.currentTime = 0; }
    if (previewPlaying === id) { setPreviewPlaying(null); setPreviewAudio(null); return; }
    const option = AZAAN_OPTIONS.find((a) => a.id === id); if (!option) return;
    const audio = new Audio(option.url); audio.volume = settings.volume; audio.play().catch(console.error);
    audio.onended = () => { setPreviewPlaying(null); setPreviewAudio(null); };
    audio.onerror = () => { setPreviewPlaying(null); setPreviewAudio(null); };
    setPreviewPlaying(id); setPreviewAudio(audio);
  };

  const handleToggleEnabled = (checked: boolean) => { update({ enabled: checked }); if (checked) requestPermissionsIfNeeded(); else stopAzaan(); };

  return (
    <div className="px-4 py-4 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-gold/10 shadow-gold">
        <div><h2 className="text-sm font-semibold text-foreground">{t("azaan.alerts")}</h2><p className="text-xs text-muted-foreground mt-0.5">{t("azaan.playAtPrayer")}</p></div>
        <Switch checked={settings.enabled} onCheckedChange={handleToggleEnabled} />
      </div>
      {settings.enabled && (
        <>
          <button onClick={() => { const option = AZAAN_OPTIONS.find((a) => a.id === settings.selectedAzaanId); if (!option) return; if (previewAudio) { previewAudio.pause(); previewAudio.currentTime = 0; setPreviewPlaying(null); setPreviewAudio(null); return; } const audio = new Audio(option.url); audio.volume = settings.volume; audio.play().catch(console.error); audio.onended = () => { setPreviewPlaying(null); setPreviewAudio(null); }; setPreviewPlaying(option.id); setPreviewAudio(audio); }} className="w-full py-3 rounded-xl bg-secondary/20 border border-secondary/20 text-sm font-medium text-secondary transition-smooth active:scale-95">
            {previewAudio ? t("azaan.stopTest") : t("azaan.testSound")}
          </button>
          <div className="p-4 rounded-2xl bg-card border border-gold/10">
            <p className="text-xs text-muted-foreground mb-3">{t("azaan.volume")}</p>
            <div className="flex items-center gap-3"><span className="text-sm">🔈</span><Slider value={[settings.volume * 100]} onValueChange={([v]) => update({ volume: v / 100 })} max={100} step={5} className="flex-1" /><span className="text-sm">🔊</span></div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground px-1">{t("azaan.chooseStyle")}</p>
            {AZAAN_OPTIONS.map((option) => (
              <button key={option.id} onClick={() => update({ selectedAzaanId: option.id })} className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-smooth text-left ${settings.selectedAzaanId === option.id ? "bg-primary/10 border-primary/30" : "bg-card border-gold/5 hover:border-gold/15"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${settings.selectedAzaanId === option.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{settings.selectedAzaanId === option.id ? "✓" : "♪"}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground">{option.name}</p><p className="text-xs text-muted-foreground">{option.style} • {option.muezzin}</p></div>
                <button onClick={(e) => { e.stopPropagation(); previewAzaan(option.id); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth ${previewPlaying === option.id ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{previewPlaying === option.id ? "⏹" : "▶"}</button>
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground px-1">{t("azaan.manualOverride")}</p>
            {PRAYER_NAMES.map((prayer) => (
              <div key={prayer} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-gold/5">
                <span className="text-sm font-medium text-foreground flex-1">{prayer}</span>
                <input type="time" value={settings.manualTimings[prayer]} onChange={(e) => setManualTime(prayer, e.target.value)} className="bg-muted text-foreground text-xs px-2 py-1 rounded-lg border border-gold/10 w-24 text-center" />
              </div>
            ))}
            <p className="text-xs text-muted-foreground px-1 italic">{t("azaan.manualHint")}</p>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-gold/10"><p className="text-xs text-muted-foreground leading-relaxed">{t("azaan.info")}</p></div>
        </>
      )}
    </div>
  );
};

export default AzaanSettingsPage;
