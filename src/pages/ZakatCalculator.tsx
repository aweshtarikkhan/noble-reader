import React, { useState, useEffect } from "react";
import { Calculator, Download, Plus, Trash2, FileText, Clock, X, Share2, Eye, ChevronDown, Globe } from "lucide-react";
import jsPDF from "jspdf";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import localforage from "localforage";

import { Capacitor } from "@capacitor/core";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import InAppPdfViewer from "@/components/InAppPdfViewer";

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
    lastUpdated: "Manual Rates"
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
  
  // Other Zakat Assets state
  const [showOtherZakat, setShowOtherZakat] = useState(false);
  const [cropValue, setCropValue] = useState("");
  const [irrigationType, setIrrigationType] = useState<"rainfed" | "irrigated">("rainfed");
  const [goatCount, setGoatCount] = useState("");
  const [cowCount, setCowCount] = useState("");
  const [camelCount, setCamelCount] = useState("");
  const [businessInventory, setBusinessInventory] = useState("");
  const [rentalIncome, setRentalIncome] = useState("");
  
  const [storagePermission, setStoragePermission] = useState<"unknown" | "granted" | "denied">("unknown");

  // Download history
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("zakat_download_history");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [pdfViewer, setPdfViewer] = useState<{ open: boolean; base64: string; title: string }>({
    open: false,
    base64: "",
    title: "",
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

  const addToHistory = async (item: DownloadHistoryItem, pdfBase64: string) => {
    // Always save to localforage
    await localforage.setItem(`zakat_pdf_${item.id}`, pdfBase64).catch(console.error);

    // On native, also save to Directory.Data (always accessible, no permission needed)
    if (Capacitor.isNativePlatform()) {
      try {
        const saved = await Filesystem.writeFile({
          path: `zakat_pdfs/${item.fileName}`,
          data: pdfBase64,
          directory: Directory.Data,
          recursive: true,
        });
        item.uri = saved.uri;
      } catch (e) {
        console.warn("Directory.Data save failed:", e);
      }
    }

    const updated = [item, ...downloadHistory].slice(0, 50);
    saveHistory(updated);
  };

  const removeFromHistory = async (id: string) => {
    const item = downloadHistory.find(h => h.id === id);
    // Clean up stored files
    localforage.removeItem(`zakat_pdf_${id}`).catch(console.error);
    if (Capacitor.isNativePlatform() && item) {
      try {
        await Filesystem.deleteFile({
          path: `zakat_pdfs/${item.fileName}`,
          directory: Directory.Data,
        });
      } catch {}
    }
    saveHistory(downloadHistory.filter(h => h.id !== id));
  };

  const clearHistory = async () => {
    for (const h of downloadHistory) {
      localforage.removeItem(`zakat_pdf_${h.id}`).catch(console.error);
      if (Capacitor.isNativePlatform()) {
        try {
          await Filesystem.deleteFile({
            path: `zakat_pdfs/${h.fileName}`,
            directory: Directory.Data,
          });
        } catch {}
      }
    }
    saveHistory([]);
    toast({ title: "🗑️ History cleared" });
  };

  const closePdfViewer = () => {
    setPdfViewer({ open: false, base64: "", title: "" });
  };

  const openPdfInAppViewer = (base64: string, title: string) => {
    setPdfViewer({ open: true, base64, title });
  };

  const getBase64FromHistory = async (item: DownloadHistoryItem): Promise<string | null> => {
    const base64: string | null = await localforage.getItem(`zakat_pdf_${item.id}`);
    if (base64) return base64;

    if (Capacitor.isNativePlatform()) {
      // Try reading from internal app storage
      try {
        const fileData = await Filesystem.readFile({
          path: `zakat_pdfs/${item.fileName}`,
          directory: Directory.Data,
        });
        if (typeof fileData.data === "string") return fileData.data;
      } catch {}

      // Legacy fallback: try old URI
      if (item.uri) {
        try {
          const fileData = await Filesystem.readFile({ path: item.uri });
          if (typeof fileData.data === "string") return fileData.data;
        } catch {}
      }
    }

    return null;
  };

  const openHistoryFile = async (item: DownloadHistoryItem) => {
    try {
      const base64 = await getBase64FromHistory(item);
      if (!base64) {
        toast({ title: "⚠️ PDF not found", description: "This entry is old. Clear and re-download." });
        removeFromHistory(item.id);
        return;
      }

      openPdfInAppViewer(base64, item.displayName);
    } catch {
      toast({ title: "❌ Could not open PDF" });
    }
  };

  const shareHistoryFile = async (item: DownloadHistoryItem) => {
    try {
      const base64 = await getBase64FromHistory(item);
      if (!base64) {
        toast({ title: "⚠️ PDF not found", description: "This entry is old. Clear and re-download." });
        return;
      }

      if (Capacitor.isNativePlatform()) {
        // Write temp file and use native Share plugin
        try {
          const tempFile = await Filesystem.writeFile({
            path: `share_${item.fileName}`,
            data: base64,
            directory: Directory.Cache,
          });
          await Share.share({
            title: `Zakat Report - ${item.displayName}`,
            files: [tempFile.uri],
          });
        } catch (e: any) {
          if (e?.message?.includes("canceled") || e?.message?.includes("cancelled")) return;
          throw e;
        }
      } else {
        // Web fallback
        const byteChars = atob(base64);
        const byteArray = new Uint8Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const file = new File([blob], item.fileName, { type: "application/pdf" });

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: `Zakat Report - ${item.displayName}`, files: [file] });
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = item.fileName;
          a.click();
          URL.revokeObjectURL(url);
          toast({ title: "📄 PDF downloaded for sharing" });
        }
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        toast({ title: "❌ Share failed" });
      }
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
      lastUpdated: "Manual Rates"
    });
  };

  useEffect(() => {
    updateRatesFromManual();
  }, [manualGold22, manualSilver]);


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

  const calculateAgriZakat = () => {
    const crop = parseFloat(cropValue) || 0;
    if (crop <= 0) return 0;
    return crop * (irrigationType === "rainfed" ? 0.10 : 0.05);
  };

  const getGoatZakatText = (count: number): string => {
    if (count < 40) return "";
    if (count <= 120) return "→ 1 goat/sheep";
    if (count <= 200) return "→ 2 goats/sheep";
    if (count <= 399) return "→ 3 goats/sheep";
    return `→ ${Math.floor(count / 100)} goats/sheep`;
  };

  const getCowZakatText = (count: number): string => {
    if (count < 30) return "";
    if (count <= 39) return "→ 1 calf (1 yr)";
    if (count <= 59) return "→ 1 cow (2 yr)";
    return "→ 2 calves (1 yr each)";
  };

  const getCamelZakatText = (count: number): string => {
    if (count < 5) return "";
    if (count <= 9) return "→ 1 sheep/goat";
    if (count <= 14) return "→ 2 sheep/goats";
    if (count <= 19) return "→ 3 sheep/goats";
    if (count <= 24) return "→ 4 sheep/goats";
    if (count <= 35) return "→ 1 she-camel (1 yr)";
    return "→ See detailed nisab tables";
  };

  const calculateZakat = () => {
    const goldInRupees = calculateGoldTotal();
    const silverInRupees = calculateSilverTotal();
    const cash = parseFloat(cashValue) || 0;
    const other = parseFloat(otherAssets) || 0;
    const debts = parseFloat(liabilities) || 0;
    const business = showOtherZakat ? (parseFloat(businessInventory) || 0) : 0;
    const rental = showOtherZakat ? (parseFloat(rentalIncome) || 0) : 0;

    const totalAssets = goldInRupees + silverInRupees + cash + other + business + rental;
    const netAssets = totalAssets - debts;
    const nisabValue = NISAB_SILVER_GRAMS * rates.silver;
    const isEligible = netAssets >= nisabValue;
    const zakatOnWealth = isEligible ? netAssets * ZAKAT_RATE : 0;
    const agriZakat = showOtherZakat ? calculateAgriZakat() : 0;
    const zakatDue = zakatOnWealth + agriZakat;

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
    doc.text("Gold & Silver Rates", 20, y);
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

    if (showOtherZakat) {
      const business = parseFloat(businessInventory) || 0;
      const rental = parseFloat(rentalIncome) || 0;
      if (business > 0) {
        doc.text(`Business Inventory: Rs ${business.toLocaleString('en-IN')}`, 25, y);
        y += 6;
      }
      if (rental > 0) {
        doc.text(`Rental Income: Rs ${rental.toLocaleString('en-IN')}`, 25, y);
        y += 6;
      }
      const crop = parseFloat(cropValue) || 0;
      if (crop > 0) {
        const agriRate = irrigationType === "rainfed" ? "10% (Ushr)" : "5% (Nisf Ushr)";
        doc.text(`Crop Value: Rs ${crop.toLocaleString('en-IN')} — ${agriRate}`, 25, y);
        y += 6;
        doc.text(`Agricultural Zakat: Rs ${Math.round(calculateAgriZakat()).toLocaleString('en-IN')}`, 25, y);
        y += 6;
      }
      const goats = parseInt(goatCount) || 0;
      if (goats > 0) {
        doc.text(`Goats/Sheep: ${goats} ${getGoatZakatText(goats)}`, 25, y);
        y += 6;
      }
      const cows = parseInt(cowCount) || 0;
      if (cows > 0) {
        doc.text(`Cows/Buffalo: ${cows} ${getCowZakatText(cows)}`, 25, y);
        y += 6;
      }
      const camels = parseInt(camelCount) || 0;
      if (camels > 0) {
        doc.text(`Camels: ${camels} ${getCamelZakatText(camels)}`, 25, y);
        y += 6;
      }
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
      try {
        const base64Data = doc.output("datauristring").split(",")[1];
        const historyItem: DownloadHistoryItem = {
          id: Date.now().toString(),
          fileName,
          displayName,
          date: dateStr,
          zakatAmount: zakatResult.zakatDue,
        };

        await addToHistory(historyItem, base64Data);

        toast({
          title: "✅ PDF Saved",
          description: `Opened in app as "${displayName}"`,
        });
        openPdfInAppViewer(base64Data, displayName);

        // Also try saving to public Downloads (optional, best-effort)
        try {
          await Filesystem.writeFile({
            path: `Download/${fileName}`,
            data: base64Data,
            directory: Directory.ExternalStorage,
            recursive: true,
          });
        } catch {
          // Public copy failed - that's fine, internal copy is saved
        }
      } catch (err: any) {
        console.error("PDF save error:", err);
        toast({
          title: "❌ PDF save failed",
          description: "Please try again.",
        });
      }
    } else {
      const pdfBase64 = doc.output('datauristring').split(',')[1];
      doc.save(fileName);
      addToHistory({
        id: Date.now().toString(),
        fileName,
        displayName,
        date: dateStr,
        zakatAmount: zakatResult.zakatDue,
      }, pdfBase64);
      toast({ title: t("zakat.pdfDownloaded"), description: `Saved as "${displayName}"` });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-2 pb-24">

      <div className="px-4 py-6 space-y-6">
        {/* Gold & Silver Rates */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">📊 {t("zakat.goldSilverRates")}</CardTitle>
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

        {/* Other Zakat Assets Toggle */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">🔄 {t("zakat.otherZakatAssets")}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">{t("zakat.enableOtherAssets")}</p>
              </div>
              <Switch checked={showOtherZakat} onCheckedChange={setShowOtherZakat} />
            </div>
          </CardHeader>
          {showOtherZakat && (
            <CardContent className="space-y-6 pt-0">
              {/* Agricultural Zakat */}
              <div className="space-y-3 p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-semibold">{t("zakat.agriculture")}</p>
                <div>
                  <Label className="text-xs">{t("zakat.cropValue")}</Label>
                  <Input
                    type="number"
                    placeholder={t("zakat.enterAmount")}
                    value={cropValue}
                    onChange={(e) => setCropValue(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">{t("zakat.irrigationType")}</Label>
                  <Select value={irrigationType} onValueChange={(v: "rainfed" | "irrigated") => setIrrigationType(v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rainfed">{t("zakat.rainfed")}</SelectItem>
                      <SelectItem value="irrigated">{t("zakat.irrigated")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {cropValue && parseFloat(cropValue) > 0 && (
                  <div className="text-sm font-medium text-primary">
                    Zakat: {formatCurrency(parseFloat(cropValue) * (irrigationType === "rainfed" ? 0.10 : 0.05))}
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground">{t("zakat.agriZakatNote")}</p>
              </div>

              {/* Livestock Zakat */}
              <div className="space-y-3 p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-semibold">{t("zakat.livestock")}</p>
                
                {/* Goats/Sheep */}
                <div>
                  <Label className="text-xs">{t("zakat.goatCount")}</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={goatCount}
                    onChange={(e) => setGoatCount(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">{t("zakat.goatNisab")}</p>
                  {parseInt(goatCount) >= 40 && (
                    <p className="text-xs font-medium text-primary mt-1">{getGoatZakatText(parseInt(goatCount))}</p>
                  )}
                  <div className="text-[10px] text-muted-foreground mt-1 space-y-0.5">
                    <p>{t("zakat.goat40")}</p>
                    <p>{t("zakat.goat121")}</p>
                    <p>{t("zakat.goat201")}</p>
                    <p>{t("zakat.goat400")}</p>
                  </div>
                </div>

                {/* Cows/Buffalo */}
                <div className="pt-2 border-t border-border">
                  <Label className="text-xs">{t("zakat.cowCount")}</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={cowCount}
                    onChange={(e) => setCowCount(e.target.value)}
                    className="mt-1"
                  />
                  {parseInt(cowCount) >= 30 && (
                    <p className="text-xs font-medium text-primary mt-1">{getCowZakatText(parseInt(cowCount))}</p>
                  )}
                  <div className="text-[10px] text-muted-foreground mt-1 space-y-0.5">
                    <p>{t("zakat.cow30")}</p>
                    <p>{t("zakat.cow40")}</p>
                    <p>{t("zakat.cow60")}</p>
                  </div>
                </div>

                {/* Camels */}
                <div className="pt-2 border-t border-border">
                  <Label className="text-xs">{t("zakat.camelCount")}</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={camelCount}
                    onChange={(e) => setCamelCount(e.target.value)}
                    className="mt-1"
                  />
                  {parseInt(camelCount) >= 5 && (
                    <p className="text-xs font-medium text-primary mt-1">{getCamelZakatText(parseInt(camelCount))}</p>
                  )}
                  <div className="text-[10px] text-muted-foreground mt-1 space-y-0.5">
                    <p>{t("zakat.camel5")}</p>
                    <p>{t("zakat.camel10")}</p>
                    <p>{t("zakat.camel25")}</p>
                  </div>
                </div>
              </div>

              {/* Business & Rental */}
              <div className="space-y-3 p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-semibold">{t("zakat.businessInventory")}</p>
                <div>
                  <Label className="text-xs">{t("zakat.businessValue")}</Label>
                  <Input
                    type="number"
                    placeholder={t("zakat.enterAmount")}
                    value={businessInventory}
                    onChange={(e) => setBusinessInventory(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">{t("zakat.rentalValue")}</Label>
                  <Input
                    type="number"
                    placeholder={t("zakat.enterAmount")}
                    value={rentalIncome}
                    onChange={(e) => setRentalIncome(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">{t("zakat.businessRentalNote")}</p>
              </div>
            </CardContent>
          )}
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

        {/* Download History */}
        {downloadHistory.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Download History
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={clearHistory} className="h-7 text-xs text-destructive hover:text-destructive">
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {downloadHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    onClick={() => openHistoryFile(item)}
                  >
                    <FileText className="w-5 h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.displayName}</p>
                      <p className="text-xs text-muted-foreground">{item.date} • Zakat: ₹{item.zakatAmount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openHistoryFile(item)}
                      className="p-1.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary"
                      title="View PDF"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => shareHistoryFile(item)}
                      className="p-1.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary"
                      title="Share PDF"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeFromHistory(item.id)}
                      className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {pdfViewer.open && pdfViewer.base64 && (
          <div className="fixed inset-0 z-[100] bg-background flex flex-col">
            <InAppPdfViewer
              pdfBase64={pdfViewer.base64}
              title={pdfViewer.title}
              onClose={closePdfViewer}
              onShare={() => {
                const item = downloadHistory.find(h => h.displayName === pdfViewer.title);
                if (item) shareHistoryFile(item);
              }}
            />
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-2 p-4 bg-muted/50 rounded-xl">
          <p className="font-semibold text-foreground">ℹ️ {t("zakat.nisabInfo")}:</p>
          <p>• {t("zakat.goldNisab")}</p>
          <p>• {t("zakat.silverNisab")}</p>
          <p>• {t("zakat.zakatRate")}</p>
          <p className="pt-2 text-[10px]">{t("zakat.silverNisabNote")}</p>
        </div>

        {/* Quran & Hadith References */}
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{t("zakat.references")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="general">
                <AccordionTrigger className="text-xs font-medium py-2">{t("zakat.refGeneral")}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p><strong>Surah Al-Baqarah 2:43</strong></p>
                    <p>"And establish prayer and give Zakah and bow with those who bow [in worship]."</p>
                    <p className="text-right font-arabic">"اور نماز قائم کرو اور زکوٰۃ ادا کرو اور رکوع کرنے والوں کے ساتھ رکوع کرو۔"</p>
                    <p className="italic">Aur namaaz qaayam karo aur zakaat ada karo aur ruku karne walon ke saath ruku karo.</p>
                    <p className="mt-2"><strong>Surah At-Tawbah 9:103</strong></p>
                    <p>"Take from their wealth a charity by which you purify them and cause them increase."</p>
                    <p className="text-right font-arabic">"ان کے مالوں میں سے صدقہ لو جس سے تم انہیں پاک کرو اور ان کو بڑھاؤ۔"</p>
                    <p className="italic">Unke maalon mein se sadqa lo jis se tum unhe paak karo aur unko badhaao.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="goldsilver">
                <AccordionTrigger className="text-xs font-medium py-2">{t("zakat.refGoldSilver")}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p><strong>Surah At-Tawbah 9:34</strong></p>
                    <p>"And those who hoard gold and silver and spend it not in the way of Allah — give them tidings of a painful punishment."</p>
                    <p className="text-right font-arabic">"اور جو لوگ سونا اور چاندی جمع کرکے رکھتے ہیں اور اسے اللہ کی راہ میں خرچ نہیں کرتے انہیں دردناک عذاب کی خبر دے دو۔"</p>
                    <p className="italic">Aur jo log sona aur chandi jama karke rakhte hain aur use Allah ki raah mein kharch nahi karte unhe dardnaak azaab ki khabar de do.</p>
                    <p className="mt-2"><strong>Sahih Muslim 979</strong></p>
                    <p>The Prophet ﷺ said: "There is no owner of gold or silver who does not pay Zakat on it, except that plates of fire will be heated for him on the Day of Judgment."</p>
                    <p className="text-right font-arabic">نبی ﷺ نے فرمایا: "سونے اور چاندی کا کوئی مالک جو اس کی زکوٰۃ ادا نہ کرے، قیامت کے دن اس کے لیے آگ کی تختیاں گرم کی جائیں گی۔"</p>
                    <p className="italic">Nabi ﷺ ne farmaya: "Sone aur chandi ka koi maalik jo us ki zakaat ada na kare, Qayamat ke din us ke liye aag ki takhtiyan garm ki jaayengi."</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="wealth">
                <AccordionTrigger className="text-xs font-medium py-2">{t("zakat.refWealth")}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p><strong>Surah Al-Baqarah 2:267</strong></p>
                    <p>"O you who have believed, spend from the good things which you have earned and from that which We have produced for you from the earth."</p>
                    <p className="text-right font-arabic">"اے ایمان والو! جو پاکیزہ چیزیں تم نے کمائی ہیں اور جو ہم نے تمہارے لیے زمین سے نکالا ہے اس میں سے خرچ کرو۔"</p>
                    <p className="italic">Aye imaan walo! Jo paakiza cheezein tum ne kamaai hain aur jo hum ne tumhare liye zameen se nikaala hai us mein se kharch karo.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="agriculture">
                <AccordionTrigger className="text-xs font-medium py-2">{t("zakat.refAgriculture")}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p><strong>Surah Al-An'am 6:141</strong></p>
                    <p>"...and give its due [Zakah] on the day of its harvest."</p>
                    <p className="text-right font-arabic">"...اور فصل کاٹنے کے دن اس کا حق (زکوٰۃ) ادا کرو۔"</p>
                    <p className="italic">...aur fasal kaatne ke din us ka haq (zakaat) ada karo.</p>
                    <p className="mt-2"><strong>Sahih Bukhari 1483</strong></p>
                    <p>The Prophet ﷺ said: "On that which is watered by rain or springs, one-tenth (10%). On that which is watered by irrigation, half of one-tenth (5%)."</p>
                    <p className="text-right font-arabic">نبی ﷺ نے فرمایا: "بارش یا چشمے کے پانی سے سینچی ہوئی فصل میں دسواں حصہ (10%) اور سینچائی کے پانی سے سینچی ہوئی فصل میں بیسواں حصہ (5%) زکوٰۃ ہے۔"</p>
                    <p className="italic">Nabi ﷺ ne farmaya: "Baarish ya chashme ke paani se sinchi hui fasal mein daswaan hissa (10%) aur sinchai ke paani se sinchi hui fasal mein beeswaan hissa (5%) zakaat hai."</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="livestock">
                <AccordionTrigger className="text-xs font-medium py-2">{t("zakat.refLivestock")}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p><strong>Sahih Bukhari 1454</strong></p>
                    <p>Abu Bakr (RA) narrated the detailed zakat rates on camels, cattle, and sheep as instructed by the Prophet ﷺ.</p>
                    <p className="text-right font-arabic">ابوبکر (رضی اللہ عنہ) نے نبی ﷺ کی ہدایت کے مطابق اونٹوں، گائے اور بکریوں کی زکوٰۃ کی تفصیلی شرحیں بیان کیں۔</p>
                    <p className="italic">Abu Bakr (RA) ne Nabi ﷺ ki hidaayat ke mutaabiq ounton, gaaye aur bakriyon ki zakaat ki tafseeli sharhein bayaan keen.</p>
                    <p className="mt-2"><strong>Abu Dawud 1572</strong></p>
                    <p>Detailed nisab and zakat amounts for livestock including sheep, cattle, and camels.</p>
                    <p className="text-right font-arabic">بکریوں، گائے اور اونٹوں سمیت مویشیوں کے نصاب اور زکوٰۃ کی مقدار کی تفصیل۔</p>
                    <p className="italic">Bakriyon, gaaye aur ounton samait maweshiyon ke nisaab aur zakaat ki miqdaar ki tafseel.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="trade">
                <AccordionTrigger className="text-xs font-medium py-2">{t("zakat.refTrade")}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p><strong>Abu Dawud 1562</strong></p>
                    <p>Samurah ibn Jundub said: "The Prophet ﷺ used to order us to give Sadaqah (Zakat) from what we prepared for trade."</p>
                    <p className="text-right font-arabic">سمرہ بن جندب نے کہا: "نبی ﷺ ہمیں حکم دیتے تھے کہ جو مال ہم تجارت کے لیے تیار کرتے ہیں اس میں سے صدقہ (زکوٰۃ) ادا کریں۔"</p>
                    <p className="italic">Samurah bin Jundub ne kaha: "Nabi ﷺ hamein hukm dete the ke jo maal hum tijarat ke liye tayyar karte hain us mein se sadqa (zakaat) ada karein."</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ZakatCalculator;
