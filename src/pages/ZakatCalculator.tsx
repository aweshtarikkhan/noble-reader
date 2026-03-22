import React, { useState, useEffect, useCallback } from "react";
import { Calculator, Download, Plus, Trash2, RefreshCw, FileText, Clock, X } from "lucide-react";
import jsPDF from "jspdf";
import { Filesystem, Directory } from "@capacitor/filesystem";

import { Capacitor } from "@capacitor/core";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

interface DownloadHistoryItem {
  id: string;
  fileName: string;
  displayName: string;
  date: string;
  zakatAmount: number;
  uri?: string; // native file URI
}

interface GoldRates {
  gold22ct: number;
  gold24ct: number;
  gold18ct: number;
  silver: number;
  lastUpdated: string;
}

interface GoldEntry {
  id: string;
  inputType: "grams" | "rupees";
  carat: "22" | "24" | "18";
  value: string;
}

interface SilverEntry {
  id: string;
  inputType: "grams" | "rupees";
  value: string;
}

const NISAB_GOLD_GRAMS = 87.48;
const NISAB_SILVER_GRAMS = 612.36;
const ZAKAT_RATE = 0.025;

const ZakatCalculator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useI18n();
  
  const [rates, setRates] = useState<GoldRates>({
    gold24ct: 16364,
    gold22ct: 15000,
    gold18ct: 12273,
    silver: 278,
    lastUpdated: "Chennai Rates (Editable)"
  });
  
  const [manualGold22, setManualGold22] = useState("15000");
  const [manualSilver, setManualSilver] = useState("278");
  
  const [goldEntries, setGoldEntries] = useState<GoldEntry[]>([
    { id: "1", inputType: "grams", carat: "22", value: "" }
  ]);
  
  const [silverEntries, setSilverEntries] = useState<SilverEntry[]>([
    { id: "1", inputType: "grams", value: "" }
  ]);
  
  const [cashValue, setCashValue] = useState("");
  const [otherAssets, setOtherAssets] = useState("");
  const [liabilities, setLiabilities] = useState("");
  const [userName, setUserName] = useState("");
  const [fetchingRates, setFetchingRates] = useState(false);
  const [storagePermission, setStoragePermission] = useState<"unknown" | "granted" | "denied">("unknown");

  // Download history
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("zakat_download_history");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const saveHistory = (history: DownloadHistoryItem[]) => {
    setDownloadHistory(history);
    localStorage.setItem("zakat_download_history", JSON.stringify(history));
  };

  const getNextUnknownName = () => {
    const unknowns = downloadHistory.filter(h => h.displayName.startsWith("Unknown-"));
    const nums = unknowns.map(h => parseInt(h.displayName.replace("Unknown-", "")) || 0);
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `Unknown-${String(next).padStart(2, "0")}`;
  };

  const addToHistory = (item: DownloadHistoryItem) => {
    const updated = [item, ...downloadHistory].slice(0, 50);
    saveHistory(updated);
  };

  const removeFromHistory = (id: string) => {
    saveHistory(downloadHistory.filter(h => h.id !== id));
  };

  const clearHistory = () => {
    saveHistory([]);
    toast({ title: "🗑️ History cleared" });
  };

  const openHistoryFile = async (item: DownloadHistoryItem) => {
    if (Capacitor.isNativePlatform() && item.uri) {
      window.open(item.uri, '_system');
    } else {
      toast({ title: "📄 " + item.displayName, description: `Zakat: ₹${item.zakatAmount.toLocaleString('en-IN')} — ${item.date}` });
    }
  };

  // Check storage permission on mount (native only)
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    Filesystem.checkPermissions().then((status) => {
      setStoragePermission(status.publicStorage === "granted" ? "granted" : "denied");
    }).catch(() => setStoragePermission("unknown"));
  }, []);

  const requestStoragePermission = async () => {
    try {
      const result = await Filesystem.requestPermissions();
      const granted = result.publicStorage === "granted";
      setStoragePermission(granted ? "granted" : "denied");
      if (granted) {
        toast({ title: "✅ Storage permission granted!" });
      } else {
        toast({ title: "❌ Permission denied", description: "App settings se manually allow karein." });
      }
    } catch {
      setStoragePermission("denied");
    }
  };

  const [zakatResult, setZakatResult] = useState<{
    totalAssets: number;
    netAssets: number;
    nisabValue: number;
    zakatDue: number;
    isEligible: boolean;
  } | null>(null);

  const updateRatesFromManual = () => {
    const gold22 = parseFloat(manualGold22) || 15000;
    const silver = parseFloat(manualSilver) || 278;
    const gold24 = Math.round(gold22 / 0.916);
    const gold18 = Math.round(gold22 * (18/22));
    
    setRates({
      gold24ct: gold24,
      gold22ct: gold22,
      gold18ct: gold18,
      silver: silver,
      lastUpdated: "Chennai Rates (Manual)"
    });
  };

  useEffect(() => {
    updateRatesFromManual();
  }, [manualGold22, manualSilver]);

  const fetchLiveRates = useCallback(async () => {
    setFetchingRates(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-gold-rates");
      if (error) throw error;
      if (data?.success && data.rates) {
        const r = data.rates;
        setManualGold22(String(r.gold22ct));
        setManualSilver(String(r.silver));
        setRates({
          gold24ct: r.gold24ct,
          gold22ct: r.gold22ct,
          gold18ct: r.gold18ct,
          silver: r.silver,
          lastUpdated: `Live - ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
        });
        toast({ title: "✅ Live Rates Fetched!", description: `Gold 22K: ₹${r.gold22ct}/gm | Silver: ₹${r.silver}/gm` });
      } else {
        throw new Error(data?.error || "Failed to fetch rates");
      }
    } catch (err: any) {
      console.error("Failed to fetch live rates:", err);
      toast({ title: "❌ Failed to fetch rates", description: "Using manual rates. Try again later." });
    } finally {
      setFetchingRates(false);
    }
  }, [toast]);

  const getGoldRateByCarat = (carat: "22" | "24" | "18") => {
    switch (carat) {
      case "24": return rates.gold24ct;
      case "22": return rates.gold22ct;
      case "18": return rates.gold18ct;
      default: return rates.gold22ct;
    }
  };

  const addGoldEntry = () => {
    setGoldEntries([...goldEntries, { id: Date.now().toString(), inputType: "grams", carat: "22", value: "" }]);
  };

  const removeGoldEntry = (id: string) => {
    if (goldEntries.length > 1) {
      setGoldEntries(goldEntries.filter(e => e.id !== id));
    }
  };

  const updateGoldEntry = (id: string, field: keyof GoldEntry, value: string) => {
    setGoldEntries(goldEntries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const addSilverEntry = () => {
    setSilverEntries([...silverEntries, { id: Date.now().toString(), inputType: "grams", value: "" }]);
  };

  const removeSilverEntry = (id: string) => {
    if (silverEntries.length > 1) {
      setSilverEntries(silverEntries.filter(e => e.id !== id));
    }
  };

  const updateSilverEntry = (id: string, field: keyof SilverEntry, value: string) => {
    setSilverEntries(silverEntries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const calculateGoldTotal = () => {
    return goldEntries.reduce((total, entry) => {
      if (!entry.value) return total;
      const rate = getGoldRateByCarat(entry.carat);
      if (entry.inputType === "grams") {
        return total + (parseFloat(entry.value) * rate);
      }
      return total + parseFloat(entry.value);
    }, 0);
  };

  const calculateSilverTotal = () => {
    return silverEntries.reduce((total, entry) => {
      if (!entry.value) return total;
      if (entry.inputType === "grams") {
        return total + (parseFloat(entry.value) * rates.silver);
      }
      return total + parseFloat(entry.value);
    }, 0);
  };

  const calculateZakat = () => {
    const goldInRupees = calculateGoldTotal();
    const silverInRupees = calculateSilverTotal();
    const cash = parseFloat(cashValue) || 0;
    const other = parseFloat(otherAssets) || 0;
    const debts = parseFloat(liabilities) || 0;

    const totalAssets = goldInRupees + silverInRupees + cash + other;
    const netAssets = totalAssets - debts;
    const nisabValue = NISAB_SILVER_GRAMS * rates.silver;
    const isEligible = netAssets >= nisabValue;
    const zakatDue = isEligible ? netAssets * ZAKAT_RATE : 0;

    setZakatResult({
      totalAssets: Math.round(totalAssets),
      netAssets: Math.round(netAssets),
      nisabValue: Math.round(nisabValue),
      zakatDue: Math.round(zakatDue),
      isEligible
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const ensureAndroidStoragePermission = async () => {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "android") {
      return true;
    }

    try {
      const currentPermission = await Filesystem.checkPermissions();
      if (currentPermission.publicStorage === "granted") {
        return true;
      }

      const requestedPermission = await Filesystem.requestPermissions();
      if (requestedPermission.publicStorage === "granted") {
        return true;
      }

      toast({
        title: "❌ Storage permission needed",
        description: "Downloads folder mein PDF save karne ke liye permission allow karein.",
      });
      return false;
    } catch (permissionError) {
      console.error("Storage permission check failed:", permissionError);
      toast({
        title: "❌ Permission check failed",
        description: "Storage permission check nahi ho paayi. Dobara try karein.",
      });
      return false;
    }
  };

  const exportToPDF = async () => {
    if (!zakatResult) {
      toast({ title: t("zakat.calculateFirst"), description: t("zakat.calculateFirstDesc") });
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(20);
    doc.setTextColor(6, 78, 59);
    doc.text("Zakat Calculation Report", pageWidth / 2, 25, { align: "center" });
    
    if (userName.trim()) {
      doc.setFontSize(12);
      doc.setTextColor(60);
      doc.text(`Name: ${userName.trim()}`, pageWidth / 2, 33, { align: "center" });
    }

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth / 2, userName.trim() ? 40 : 33, { align: "center" });
    
    doc.setDrawColor(6, 78, 59);
    doc.line(20, userName.trim() ? 46 : 40, pageWidth - 20, userName.trim() ? 46 : 40);
    
    let y = 55;
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Gold & Silver Rates (Chennai)", 20, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Gold 22K: Rs ${rates.gold22ct}/gm`, 25, y);
    doc.text(`Gold 24K: Rs ${rates.gold24ct}/gm`, 100, y);
    y += 6;
    doc.text(`Gold 18K: Rs ${rates.gold18ct}/gm`, 25, y);
    doc.text(`Silver: Rs ${rates.silver}/gm`, 100, y);
    y += 15;
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Assets Summary", 20, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(80);
    
    const goldTotal = calculateGoldTotal();
    if (goldTotal > 0) {
      doc.text(`Gold (${goldEntries.length} items): Rs ${Math.round(goldTotal).toLocaleString('en-IN')}`, 25, y);
      y += 6;
    }
    
    const silverTotal = calculateSilverTotal();
    if (silverTotal > 0) {
      doc.text(`Silver (${silverEntries.length} items): Rs ${Math.round(silverTotal).toLocaleString('en-IN')}`, 25, y);
      y += 6;
    }
    
    if (cashValue) {
      doc.text(`Cash: Rs ${cashValue}`, 25, y);
      y += 6;
    }
    
    if (otherAssets) {
      doc.text(`Other Assets: Rs ${otherAssets}`, 25, y);
      y += 6;
    }
    
    if (liabilities) {
      doc.text(`Liabilities/Debts: Rs ${liabilities}`, 25, y);
      y += 6;
    }
    
    y += 10;
    
    doc.setDrawColor(200);
    doc.line(20, y, pageWidth - 20, y);
    y += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Zakat Calculation", 20, y);
    y += 10;
    
    doc.setFontSize(10);
    doc.text(`Total Assets:`, 25, y);
    doc.text(`Rs ${zakatResult.totalAssets.toLocaleString('en-IN')}`, pageWidth - 25, y, { align: "right" });
    y += 7;
    
    doc.text(`Net Assets (after debts):`, 25, y);
    doc.text(`Rs ${zakatResult.netAssets.toLocaleString('en-IN')}`, pageWidth - 25, y, { align: "right" });
    y += 7;
    
    doc.text(`Nisab Threshold (Silver):`, 25, y);
    doc.text(`Rs ${zakatResult.nisabValue.toLocaleString('en-IN')}`, pageWidth - 25, y, { align: "right" });
    y += 12;
    
    doc.setDrawColor(6, 78, 59);
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(20, y, pageWidth - 40, 25, 3, 3, 'FD');
    
    doc.setFontSize(12);
    doc.setTextColor(6, 78, 59);
    doc.text("Zakat Payable (2.5%):", 30, y + 10);
    doc.setFontSize(16);
    doc.text(`Rs ${zakatResult.zakatDue.toLocaleString('en-IN')}`, pageWidth - 30, y + 16, { align: "right" });
    
    y += 35;
    
    if (!zakatResult.isEligible) {
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text("Note: Net assets are below Nisab threshold. Zakat is not obligatory.", 20, y);
    }
    
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Generated by Noble Quran Reader - Zakat Calculator", pageWidth / 2, 280, { align: "center" });
    
    const displayName = userName.trim() || getNextUnknownName();
    const safeName = displayName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `Zakat_${safeName}_${new Date().toISOString().split('T')[0]}.pdf`;
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    if (Capacitor.isNativePlatform()) {
      const hasStoragePermission = await ensureAndroidStoragePermission();
      if (!hasStoragePermission) return;

      try {
        const base64Data = doc.output('datauristring').split(',')[1];

        const savedFile = await Filesystem.writeFile({
          path: `Download/${fileName}`,
          data: base64Data,
          directory: Directory.ExternalStorage,
          recursive: true,
        });

        addToHistory({
          id: Date.now().toString(),
          fileName,
          displayName,
          date: dateStr,
          zakatAmount: zakatResult.zakatDue,
          uri: savedFile.uri,
        });

        toast({
          title: "✅ PDF Downloaded!",
          description: `Saved as "${displayName}"`,
        });

        window.open(savedFile.uri, '_system');
      } catch (storageErr: any) {
        console.warn("ExternalStorage failed, trying Cache fallback:", storageErr);

        try {
          const base64Data = doc.output('datauristring').split(',')[1];
          const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache,
          });

          addToHistory({
            id: Date.now().toString(),
            fileName,
            displayName,
            date: dateStr,
            zakatAmount: zakatResult.zakatDue,
            uri: savedFile.uri,
          });

          toast({
            title: "✅ PDF Ready!",
            description: "Opening PDF...",
          });

          window.open(savedFile.uri, '_system');
        } catch (cacheErr: any) {
          console.error("PDF save error:", cacheErr);
          toast({
            title: "❌ PDF save failed",
            description: "Storage permission/settings check karke dobara try karein.",
          });
        }
      }
    } else {
      doc.save(fileName);
      addToHistory({
        id: Date.now().toString(),
        fileName,
        displayName,
        date: dateStr,
        zakatAmount: zakatResult.zakatDue,
      });
      toast({ title: t("zakat.pdfDownloaded"), description: `Saved as "${displayName}"` });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-2 pb-24">

      <div className="px-4 py-6 space-y-6">
        {/* Chennai Rates */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">📊 {t("zakat.goldSilverRates")}</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchLiveRates} 
                disabled={fetchingRates}
                className="h-8 text-xs"
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${fetchingRates ? 'animate-spin' : ''}`} />
                {fetchingRates ? "Fetching..." : "Live Rates"}
              </Button>
            </div>
            {rates.lastUpdated.includes("Live") && (
              <p className="text-xs text-green-500 mt-1">🟢 {rates.lastUpdated}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{t("zakat.goldRate")}</Label>
                <Input
                  type="number"
                  value={manualGold22}
                  onChange={(e) => setManualGold22(e.target.value)}
                  placeholder="15000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">{t("zakat.silverRate")}</Label>
                <Input
                  type="number"
                  value={manualSilver}
                  onChange={(e) => setManualSilver(e.target.value)}
                  placeholder="278"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-primary/10 text-center">
                <p className="text-muted-foreground">24K</p>
                <p className="font-bold text-foreground">₹{rates.gold24ct}/gm</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10 text-center">
                <p className="text-muted-foreground">22K</p>
                <p className="font-bold text-foreground">₹{rates.gold22ct}/gm</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10 text-center">
                <p className="text-muted-foreground">18K</p>
                <p className="font-bold text-foreground">₹{rates.gold18ct}/gm</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Permission Status (Native only) */}
        {Capacitor.isNativePlatform() && (
          <div className={`flex items-center justify-between p-3 rounded-lg border ${
            storagePermission === "granted" 
              ? "border-green-500/30 bg-green-500/10" 
              : storagePermission === "denied"
              ? "border-destructive/30 bg-destructive/10"
              : "border-muted bg-muted/50"
          }`}>
            <div className="flex items-center gap-2 text-sm">
              <span>{storagePermission === "granted" ? "🟢" : storagePermission === "denied" ? "🔴" : "⚪"}</span>
              <span className="text-foreground font-medium">
                Storage Permission: {storagePermission === "granted" ? "Allowed" : storagePermission === "denied" ? "Denied" : "Unknown"}
              </span>
            </div>
            {storagePermission !== "granted" && (
              <Button variant="outline" size="sm" onClick={requestStoragePermission} className="h-7 text-xs">
                Allow
              </Button>
            )}
          </div>
        )}

        {/* Gold Input - Multiple Entries */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                🥇 {t("zakat.gold")} (سونا)
              </CardTitle>
              <Button variant="outline" size="sm" onClick={addGoldEntry} className="h-8">
                <Plus className="w-4 h-4 mr-1" /> {t("common.add")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {goldEntries.map((entry, index) => (
              <div key={entry.id} className="p-3 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{t("common.item")} {index + 1}</span>
                  {goldEntries.length > 1 && (
                    <button onClick={() => removeGoldEntry(entry.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">{t("zakat.inputType")}</Label>
                    <Select value={entry.inputType} onValueChange={(v) => updateGoldEntry(entry.id, "inputType", v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grams">{t("zakat.grams")}</SelectItem>
                        <SelectItem value="rupees">{t("zakat.rupees")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">{t("zakat.carat")}</Label>
                    <Select value={entry.carat} onValueChange={(v) => updateGoldEntry(entry.id, "carat", v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="22">22K</SelectItem>
                        <SelectItem value="24">24K</SelectItem>
                        <SelectItem value="18">18K</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">{t("zakat.value")} ({entry.inputType === "grams" ? t("zakat.grams") : "₹"})</Label>
                  <Input
                    type="number"
                    placeholder={entry.inputType === "grams" ? t("zakat.enterWeight") : t("zakat.enterValue")}
                    value={entry.value}
                    onChange={(e) => updateGoldEntry(entry.id, "value", e.target.value)}
                    className="mt-1"
                  />
                  {entry.inputType === "grams" && entry.value && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ≈ {formatCurrency(parseFloat(entry.value) * getGoldRateByCarat(entry.carat))}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {goldEntries.some(e => e.value) && (
              <div className="text-sm font-medium text-right">
                {t("zakat.totalGold")}: {formatCurrency(calculateGoldTotal())}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Silver Input - Multiple Entries */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                🥈 {t("zakat.silver")} (چاندی)
              </CardTitle>
              <Button variant="outline" size="sm" onClick={addSilverEntry} className="h-8">
                <Plus className="w-4 h-4 mr-1" /> {t("common.add")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {silverEntries.map((entry, index) => (
              <div key={entry.id} className="p-3 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{t("common.item")} {index + 1}</span>
                  {silverEntries.length > 1 && (
                    <button onClick={() => removeSilverEntry(entry.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div>
                  <Label className="text-xs">{t("zakat.inputType")}</Label>
                  <Select value={entry.inputType} onValueChange={(v) => updateSilverEntry(entry.id, "inputType", v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grams">{t("zakat.grams")}</SelectItem>
                      <SelectItem value="rupees">{t("zakat.rupees")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">{t("zakat.value")} ({entry.inputType === "grams" ? t("zakat.grams") : "₹"})</Label>
                  <Input
                    type="number"
                    placeholder={entry.inputType === "grams" ? t("zakat.enterWeight") : t("zakat.enterValue")}
                    value={entry.value}
                    onChange={(e) => updateSilverEntry(entry.id, "value", e.target.value)}
                    className="mt-1"
                  />
                  {entry.inputType === "grams" && entry.value && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ≈ {formatCurrency(parseFloat(entry.value) * rates.silver)}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {silverEntries.some(e => e.value) && (
              <div className="text-sm font-medium text-right">
                {t("zakat.totalSilver")}: {formatCurrency(calculateSilverTotal())}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cash & Other Assets */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">💵 {t("zakat.cashAssets")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">👤 {t("zakat.yourName") || "Your Name"} ({t("common.optional") || "Optional"})</Label>
              <Input
                type="text"
                placeholder="Enter your name (optional)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">{t("zakat.cashInHand")} (نقد رقم)</Label>
              <Input
                type="number"
                placeholder={t("zakat.enterAmount")}
                value={cashValue}
                onChange={(e) => setCashValue(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">{t("zakat.otherAssets")}</Label>
              <Input
                type="number"
                placeholder={t("zakat.enterAmount")}
                value={otherAssets}
                onChange={(e) => setOtherAssets(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">{t("zakat.liabilities")} (قرض)</Label>
              <Input
                type="number"
                placeholder={t("zakat.enterAmount")}
                value={liabilities}
                onChange={(e) => setLiabilities(e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Calculate Button */}
        <Button onClick={calculateZakat} className="w-full h-12 text-base font-semibold">
          <Calculator className="w-5 h-5 mr-2" />
          {t("zakat.calculate")}
        </Button>

        {/* Results */}
        {zakatResult && (
          <Card className={`border-2 ${zakatResult.isEligible ? "border-primary bg-primary/5" : "border-muted"}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-center">
                {zakatResult.isEligible ? `💰 ${t("zakat.zakatDue")}` : `ℹ️ ${t("zakat.belowNisab")}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("zakat.totalAssets")}</span>
                <span className="font-medium">{formatCurrency(zakatResult.totalAssets)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("zakat.netAssets")}</span>
                <span className="font-medium">{formatCurrency(zakatResult.netAssets)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("zakat.nisabThreshold")}</span>
                <span className="font-medium">{formatCurrency(zakatResult.nisabValue)}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{t("zakat.zakatPayable")}</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(zakatResult.zakatDue)}
                  </span>
                </div>
              </div>
              {!zakatResult.isEligible && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  {t("zakat.belowNisabDesc")}
                </p>
              )}
              <Button onClick={exportToPDF} variant="outline" className="w-full mt-4">
                <Download className="w-4 h-4 mr-2" />
                {t("zakat.downloadPDF")}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-2 p-4 bg-muted/50 rounded-xl">
          <p className="font-semibold text-foreground">ℹ️ {t("zakat.nisabInfo")}:</p>
          <p>• {t("zakat.goldNisab")}</p>
          <p>• {t("zakat.silverNisab")}</p>
          <p>• {t("zakat.zakatRate")}</p>
          <p className="pt-2 text-[10px]">{t("zakat.silverNisabNote")}</p>
        </div>
      </div>
    </div>
  );
};

export default ZakatCalculator;
