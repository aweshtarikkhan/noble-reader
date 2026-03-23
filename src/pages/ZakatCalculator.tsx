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
  const [refLang, setRefLang] = useState<"en" | "ur" | "roman">("en");
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
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">{t("zakat.references")}</CardTitle>
            <div className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              {(["en", "ur", "roman"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setRefLang(l)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    refLang === l
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {l === "en" ? "EN" : l === "ur" ? "اردو" : "Roman"}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="general">
                <AccordionTrigger className="text-xs font-medium py-2">{t("zakat.refGeneral")}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-xs text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground">📖 Surah Al-Baqarah 2:43</p>
                      {refLang === "en" && <p>"And establish prayer and give Zakah and bow with those who bow [in worship]."</p>}
                      {refLang === "ur" && <p className="text-right font-arabic leading-relaxed">"اور نماز قائم کرو اور زکوٰۃ ادا کرو اور رکوع کرنے والوں کے ساتھ رکوع کرو۔"</p>}
                      {refLang === "roman" && <p className="italic">"Aur namaaz qaayam karo aur zakaat ada karo aur ruku karne walon ke saath ruku karo."</p>}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">📖 Surah At-Tawbah 9:103</p>
                      {refLang === "en" && <p>"Take from their wealth a charity by which you purify them and cause them increase."</p>}
                      {refLang === "ur" && <p className="text-right font-arabic leading-relaxed">"ان کے مالوں میں سے صدقہ لو جس سے تم انہیں پاک کرو اور ان کو بڑھاؤ۔"</p>}
                      {refLang === "roman" && <p className="italic">"Unke maalon mein se sadqa lo jis se tum unhe paak karo aur unko badhaao."</p>}
                    </div>
                    <div className="bg-muted/50 rounded p-2 border-l-2 border-primary/40">
                      <p className="font-semibold text-foreground text-[11px] mb-1">📜 {refLang === "en" ? "Historical Context" : refLang === "ur" ? "تاریخی واقعہ" : "Taareekhi Waqiya"}</p>
                      {refLang === "en" && <p>When Abu Bakr (RA) became Caliph, some tribes refused to pay Zakat. He declared: "By Allah, I will fight anyone who differentiates between Salah and Zakat. Zakat is the right due on wealth. By Allah, if they withhold even a young goat that they used to pay to the Prophet ﷺ, I will fight them for it." (Sahih Bukhari 1400). This incident shows that Zakat is as obligatory as Salah itself.</p>}
                      {refLang === "ur" && <p className="text-right font-arabic leading-relaxed">جب ابوبکر صدیق (رضی اللہ عنہ) خلیفہ بنے تو کچھ قبائل نے زکوٰۃ دینے سے انکار کر دیا۔ آپ نے فرمایا: "اللہ کی قسم! میں ہر اس شخص سے لڑوں گا جو نماز اور زکوٰۃ میں فرق کرے۔ زکوٰۃ مال کا حق ہے۔ اللہ کی قسم! اگر وہ ایک بکری کا بچہ بھی روکیں جو وہ نبی ﷺ کو دیا کرتے تھے، تو میں ان سے اس کے لیے جنگ کروں گا۔" (صحیح بخاری 1400)۔ یہ واقعہ ثابت کرتا ہے کہ زکوٰۃ نماز کی طرح فرض ہے۔</p>}
                      {refLang === "roman" && <p className="italic">Jab Abu Bakr Siddiq (RA) khalifa bane to kuch qabaail ne zakaat dene se inkaar kar diya. Aap ne farmaya: "Allah ki qasam! Main har us shakhs se ladunga jo namaaz aur zakaat mein farq kare. Zakaat maal ka haq hai. Allah ki qasam! Agar woh ek bakri ka bachcha bhi rokein jo woh Nabi ﷺ ko diya karte the, to main un se us ke liye jang karunga." (Sahih Bukhari 1400). Yeh waqiya saabit karta hai ke zakaat namaaz ki tarah farz hai.</p>}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="goldsilver">
                <AccordionTrigger className="text-xs font-medium py-2">{t("zakat.refGoldSilver")}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-xs text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground">📖 Surah At-Tawbah 9:34</p>
                      {refLang === "en" && <p>"And those who hoard gold and silver and spend it not in the way of Allah — give them tidings of a painful punishment."</p>}
                      {refLang === "ur" && <p className="text-right font-arabic leading-relaxed">"اور جو لوگ سونا اور چاندی جمع کرکے رکھتے ہیں اور اسے اللہ کی راہ میں خرچ نہیں کرتے انہیں دردناک عذاب کی خبر دے دو۔"</p>}
                      {refLang === "roman" && <p className="italic">"Aur jo log sona aur chandi jama karke rakhte hain aur use Allah ki raah mein kharch nahi karte unhe dardnaak azaab ki khabar de do."</p>}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">📚 Sahih Muslim 979</p>
                      {refLang === "en" && <p>The Prophet ﷺ said: "There is no owner of gold or silver who does not pay Zakat on it, except that plates of fire will be heated for him on the Day of Judgment. His sides, forehead and back will be branded with them."</p>}
                      {refLang === "ur" && <p className="text-right font-arabic leading-relaxed">نبی ﷺ نے فرمایا: "سونے اور چاندی کا کوئی مالک جو اس کی زکوٰۃ ادا نہ کرے، قیامت کے دن اس کے لیے آگ کی تختیاں گرم کی جائیں گی اور ان سے اس کے پہلو، پیشانی اور پیٹھ کو داغا جائے گا۔"</p>}
                      {refLang === "roman" && <p className="italic">Nabi ﷺ ne farmaya: "Sone aur chandi ka koi maalik jo us ki zakaat ada na kare, Qayamat ke din us ke liye aag ki takhtiyan garm ki jaayengi aur un se us ke pehlu, peshaani aur peeth ko daagha jayega."</p>}
                    </div>
                    <div className="bg-muted/50 rounded p-2 border-l-2 border-primary/40">
                      <p className="font-semibold text-foreground text-[11px] mb-1">📜 {refLang === "en" ? "Incident" : refLang === "ur" ? "واقعہ" : "Waqiya"}</p>
                      {refLang === "en" && <p>Tha'labah ibn Hatib (RA) asked the Prophet ﷺ to pray that Allah give him wealth. The Prophet ﷺ warned him, but he insisted. When he became wealthy, he started missing prayers and refused to pay Zakat, saying "This is like Jizyah!" Allah then revealed Surah At-Tawbah 9:75-77 about those who break their promise to Allah regarding charity. (Tafseer Ibn Kathir)</p>}
                      {refLang === "ur" && <p className="text-right font-arabic leading-relaxed">ثعلبہ بن حاطب (رضی اللہ عنہ) نے نبی ﷺ سے دعا کی درخواست کی کہ اللہ انہیں مالدار بنائے۔ نبی ﷺ نے انہیں خبردار کیا لیکن وہ اصرار کرتے رہے۔ جب مالدار ہوئے تو نمازیں چھوڑنے لگے اور زکوٰۃ دینے سے انکار کر دیا اور کہا "یہ تو جزیہ جیسا ہے!" تب اللہ نے سورۃ التوبہ 9:75-77 نازل فرمائی ان لوگوں کے بارے میں جو صدقے کے معاملے میں اللہ سے وعدہ توڑتے ہیں۔ (تفسیر ابن کثیر)</p>}
                      {refLang === "roman" && <p className="italic">Tha'labah bin Hatib (RA) ne Nabi ﷺ se dua ki darkhwast ki ke Allah unhe maaldaar banaye. Nabi ﷺ ne unhe khabardaar kiya lekin woh israar karte rahe. Jab maaldaar hue to namaazein chhodne lage aur zakaat dene se inkaar kar diya aur kaha "Yeh to jizyah jaisa hai!" Tab Allah ne Surah At-Tawbah 9:75-77 naazil farmai un logon ke baare mein jo sadqe ke maamle mein Allah se waada todte hain. (Tafseer Ibn Kathir)</p>}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="wealth">
                <AccordionTrigger className="text-xs font-medium py-2">{t("zakat.refWealth")}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-xs text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground">📖 Surah Al-Baqarah 2:267</p>
                      {refLang === "en" && <p>"O you who have believed, spend from the good things which you have earned and from that which We have produced for you from the earth. And do not aim toward the defective therefrom, spending [from that] while you would not take it [yourself] except with closed eyes."</p>}
                      {refLang === "ur" && <p className="text-right font-arabic leading-relaxed">"اے ایمان والو! جو پاکیزہ چیزیں تم نے کمائی ہیں اور جو ہم نے تمہارے لیے زمین سے نکالا ہے اس میں سے خرچ کرو۔ اور خراب چیزیں خرچ کرنے کا ارادہ نہ کرو جنہیں تم خود آنکھیں بند کیے بغیر نہ لو۔"</p>}
                      {refLang === "roman" && <p className="italic">"Aye imaan walo! Jo paakiza cheezein tum ne kamaai hain aur jo hum ne tumhare liye zameen se nikaala hai us mein se kharch karo. Aur kharaab cheezein kharch karne ka iraada na karo jinhe tum khud aankhein band kiye baghair na lo."</p>}
                    </div>
                    <div className="bg-muted/50 rounded p-2 border-l-2 border-primary/40">
                      <p className="font-semibold text-foreground text-[11px] mb-1">📜 {refLang === "en" ? "Context & Explanation" : refLang === "ur" ? "سیاق و سباق" : "Siyaaq o Sabaaq"}</p>
                      {refLang === "en" && <p>This verse was revealed when some Companions would give low-quality dates as Zakat. Allah commanded that only good quality wealth should be spent in His path. The scholars explain this means Zakat should be calculated on all forms of wealth including cash savings, bank deposits, and investments — not just gold and silver. (Tafseer Al-Qurtubi)</p>}
                      {refLang === "ur" && <p className="text-right font-arabic leading-relaxed">یہ آیت اس وقت نازل ہوئی جب بعض صحابہ خراب کھجوریں زکوٰۃ میں دیتے تھے۔ اللہ نے حکم دیا کہ صرف اچھے مال اللہ کی راہ میں خرچ کرو۔ علماء بیان کرتے ہیں کہ اس کا مطلب ہے کہ زکوٰۃ کا حساب ہر طرح کے مال پر ہے جن میں نقد بچت، بینک جمع اور سرمایہ کاری شامل ہے — صرف سونا چاندی نہیں۔ (تفسیر القرطبی)</p>}
                      {refLang === "roman" && <p className="italic">Yeh aayat us waqt naazil hui jab baaz Sahaba kharaab khajurein zakaat mein dete the. Allah ne hukm diya ke sirf achhe maal Allah ki raah mein kharch karo. Ulama bayaan karte hain ke is ka matlab hai ke zakaat ka hisaab har tarah ke maal par hai jin mein naqd bachat, bank jama aur sarmaaya kaari shaamil hai — sirf sona chandi nahi. (Tafseer Al-Qurtubi)</p>}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="agriculture">
                <AccordionTrigger className="text-xs font-medium py-2">{t("zakat.refAgriculture")}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-xs text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground">📖 Surah Al-An'am 6:141</p>
                      {refLang === "en" && <p>"He it is who produces gardens trellised and untrellised, and date palms, and crops of different shape and taste, and olives, and pomegranates... Eat of their fruit when they ripen, and give its due [Zakah] on the day of its harvest."</p>}
                      {refLang === "ur" && <p className="text-right font-arabic leading-relaxed">"وہی ہے جس نے باغ پیدا کیے چھپروں والے اور بغیر چھپروں والے، کھجور کے درخت اور مختلف ذائقوں کی فصلیں، زیتون اور انار... جب پھل لگیں تو کھاؤ اور فصل کاٹنے کے دن اس کا حق (زکوٰۃ) ادا کرو۔"</p>}
                      {refLang === "roman" && <p className="italic">"Wohi hai jis ne baagh paida kiye chhapron wale aur baghair chhapron wale, khajur ke darakht aur mukhtalif zaiqon ki faslein, zaitun aur anaar... Jab phal lagein to khaao aur fasal kaatne ke din us ka haq (zakaat) ada karo."</p>}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">📚 Sahih Bukhari 1483</p>
                      {refLang === "en" && <p>The Prophet ﷺ said: "On that which is watered by rain, springs, or natural moisture — one-tenth (10% / Ushr). On that which is watered by irrigation — half of one-tenth (5% / Nisf Ushr)."</p>}
                      {refLang === "ur" && <p className="text-right font-arabic leading-relaxed">نبی ﷺ نے فرمایا: "جو فصل بارش، چشمے یا قدرتی نمی سے سینچی جائے — اس میں دسواں حصہ (10% / عشر)۔ اور جو سینچائی کے ذریعے سینچی جائے — اس میں بیسواں حصہ (5% / نصف عشر)۔"</p>}
                      {refLang === "roman" && <p className="italic">Nabi ﷺ ne farmaya: "Jo fasal baarish, chashme ya qudrati nami se sinchi jaye — us mein daswaan hissa (10% / Ushr). Aur jo sinchai ke zariye sinchi jaye — us mein beeswaan hissa (5% / Nisf Ushr)."</p>}
                    </div>
                    <div className="bg-muted/50 rounded p-2 border-l-2 border-primary/40">
                      <p className="font-semibold text-foreground text-[11px] mb-1">📜 {refLang === "en" ? "Why the Difference?" : refLang === "ur" ? "فرق کیوں؟" : "Farq kyun?"}</p>
                      {refLang === "en" && <p>The wisdom behind 10% vs 5% is that rain-fed farming has lower costs (Allah provides the water freely), so the farmer gives more. Irrigated farming requires the farmer to spend on wells, canals, and labor, so the zakat rate is halved to ease his burden. This shows Islam's consideration for the farmer's effort and expenses. (Fiqh As-Sunnah, Sayyid Sabiq)</p>}
                      {refLang === "ur" && <p className="text-right font-arabic leading-relaxed">10% اور 5% میں فرق کی حکمت یہ ہے کہ بارانی کھیتی میں خرچ کم ہوتا ہے (اللہ مفت پانی دیتا ہے) تو کسان زیادہ دیتا ہے۔ سینچائی والی کھیتی میں کسان کنوئیں، نہریں اور مزدوری پر خرچ کرتا ہے، اس لیے زکوٰۃ کی شرح آدھی ہے تاکہ اس پر بوجھ کم ہو۔ یہ اسلام کی کسان کی محنت اور اخراجات کی رعایت ظاہر کرتا ہے۔ (فقہ السنۃ، سید سابق)</p>}
                      {refLang === "roman" && <p className="italic">10% aur 5% mein farq ki hikmat yeh hai ke baarani kheti mein kharch kam hota hai (Allah muft paani deta hai) to kisaan zyada deta hai. Sinchai wali kheti mein kisaan kunwein, nahrein aur mazdoori par kharch karta hai, is liye zakaat ki sharah aadhi hai taake us par bojh kam ho. Yeh Islam ki kisaan ki mehnat aur akhraajaat ki riaayat zaahir karta hai. (Fiqh As-Sunnah, Sayyid Sabiq)</p>}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="livestock">
                <AccordionTrigger className="text-xs font-medium py-2">{t("zakat.refLivestock")}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-xs text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground">📚 Sahih Bukhari 1454</p>
                      {refLang === "en" && <p>Abu Bakr (RA) narrated the detailed zakat rates on camels, cattle, and sheep as instructed by the Prophet ﷺ. This is one of the most comprehensive hadiths on livestock zakat, specifying exact numbers for each tier.</p>}
                      {refLang === "ur" && <p className="text-right font-arabic leading-relaxed">ابوبکر (رضی اللہ عنہ) نے نبی ﷺ کی ہدایت کے مطابق اونٹوں، گائے اور بکریوں کی زکوٰۃ کی تفصیلی شرحیں بیان کیں۔ یہ مویشیوں کی زکوٰۃ پر سب سے جامع احادیث میں سے ہے جس میں ہر درجے کے لیے صحیح تعداد بتائی گئی ہے۔</p>}
                      {refLang === "roman" && <p className="italic">Abu Bakr (RA) ne Nabi ﷺ ki hidaayat ke mutaabiq ounton, gaaye aur bakriyon ki zakaat ki tafseeli sharhein bayaan keen. Yeh maweshiyon ki zakaat par sab se jaami ahaadees mein se hai jis mein har darje ke liye sahih tadaad bataai gayi hai.</p>}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">📚 Abu Dawud 1572</p>
                      {refLang === "en" && <p>Detailed nisab and zakat amounts for livestock including sheep, cattle, and camels with specific thresholds.</p>}
                      {refLang === "ur" && <p className="text-right font-arabic leading-relaxed">بکریوں، گائے اور اونٹوں سمیت مویشیوں کے نصاب اور زکوٰۃ کی مقدار مخصوص حدود کے ساتھ تفصیل سے بیان کی گئی۔</p>}
                      {refLang === "roman" && <p className="italic">Bakriyon, gaaye aur ounton samait maweshiyon ke nisaab aur zakaat ki miqdaar makhsoos hudood ke saath tafseel se bayaan ki gayi.</p>}
                    </div>
                    <div className="bg-muted/50 rounded p-2 border-l-2 border-primary/40">
                      <p className="font-semibold text-foreground text-[11px] mb-1">📜 {refLang === "en" ? "Incident — Warning for Not Paying" : refLang === "ur" ? "واقعہ — زکوٰۃ نہ دینے کا انجام" : "Waqiya — Zakaat Na Dene Ka Anjaam"}</p>
                      {refLang === "en" && <p>The Prophet ﷺ said: "Whoever owns camels, cattle, or sheep and does not pay their Zakat — on the Day of Judgment, those animals will come in their largest and fattest form and will gore him with their horns and trample him with their hooves. Every time the last one passes, the first will return, until judgment is passed among the people." (Sahih Bukhari 1460, Sahih Muslim 987)</p>}
                      {refLang === "ur" && <p className="text-right font-arabic leading-relaxed">نبی ﷺ نے فرمایا: "جس کے پاس اونٹ، گائے یا بکریاں ہوں اور وہ ان کی زکوٰۃ ادا نہ کرے — قیامت کے دن وہ جانور سب سے بڑی اور موٹی شکل میں آئیں گے اور اپنے سینگوں سے اسے ماریں گے اور کھروں سے روندیں گے۔ جب آخری جانور گزر جائے تو پہلا واپس آ جائے گا، یہاں تک کہ لوگوں کے درمیان فیصلہ ہو جائے۔" (صحیح بخاری 1460، صحیح مسلم 987)</p>}
                      {refLang === "roman" && <p className="italic">Nabi ﷺ ne farmaya: "Jis ke paas oont, gaaye ya bakriyan hon aur woh un ki zakaat ada na kare — Qayamat ke din woh jaanwar sab se badi aur moti shakl mein aayenge aur apne seenghon se use maarenge aur khuron se rondenge. Jab aakhri jaanwar guzar jaye to pehla waapas aa jayega, yahan tak ke logon ke darmiyaan faisla ho jaye." (Sahih Bukhari 1460, Sahih Muslim 987)</p>}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="trade">
                <AccordionTrigger className="text-xs font-medium py-2">{t("zakat.refTrade")}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-xs text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground">📚 Abu Dawud 1562</p>
                      {refLang === "en" && <p>Samurah ibn Jundub (RA) said: "The Prophet ﷺ used to order us to give Sadaqah (Zakat) from what we prepared for trade." This is the primary hadith establishing Zakat on business inventory and trade goods at 2.5%.</p>}
                      {refLang === "ur" && <p className="text-right font-arabic leading-relaxed">سمرہ بن جندب (رضی اللہ عنہ) نے کہا: "نبی ﷺ ہمیں حکم دیتے تھے کہ جو مال ہم تجارت کے لیے تیار کرتے ہیں اس میں سے صدقہ (زکوٰۃ) ادا کریں۔" یہ بنیادی حدیث ہے جو کاروباری مال اور تجارتی سامان پر 2.5% زکوٰۃ ثابت کرتی ہے۔</p>}
                      {refLang === "roman" && <p className="italic">Samurah bin Jundub (RA) ne kaha: "Nabi ﷺ hamein hukm dete the ke jo maal hum tijarat ke liye tayyar karte hain us mein se sadqa (zakaat) ada karein." Yeh bunyaadi hadees hai jo kaarobaari maal aur tijarati saamaan par 2.5% zakaat saabit karti hai.</p>}
                    </div>
                    <div className="bg-muted/50 rounded p-2 border-l-2 border-primary/40">
                      <p className="font-semibold text-foreground text-[11px] mb-1">📜 {refLang === "en" ? "Scholarly Explanation" : refLang === "ur" ? "علمی وضاحت" : "Ilmi Wazaahat"}</p>
                      {refLang === "en" && <p>Imam Abu Hanifa, Imam Shafi'i, Imam Malik, and Imam Ahmad — all four major Imams of Fiqh — agree that Zakat is obligatory on trade goods. The merchant should calculate the market value of all goods at the end of the year and pay 2.5% Zakat if it exceeds the nisab. This includes shop inventory, raw materials, and any goods purchased with the intention of resale. (Al-Mughni, Ibn Qudamah)</p>}
                      {refLang === "ur" && <p className="text-right font-arabic leading-relaxed">امام ابو حنیفہ، امام شافعی، امام مالک اور امام احمد — چاروں بڑے فقہی ائمہ — اس بات پر متفق ہیں کہ تجارتی مال پر زکوٰۃ واجب ہے۔ تاجر کو سال کے آخر میں تمام مال کی مارکیٹ ویلیو لگانی چاہیے اور اگر وہ نصاب سے زیادہ ہو تو 2.5% زکوٰۃ ادا کرنی چاہیے۔ اس میں دکان کا سامان، خام مال اور وہ تمام اشیاء شامل ہیں جو دوبارہ فروخت کی نیت سے خریدی گئی ہوں۔ (المغنی، ابن قدامہ)</p>}
                      {refLang === "roman" && <p className="italic">Imam Abu Hanifa, Imam Shafi'i, Imam Malik aur Imam Ahmad — chaaron bade fiqhi aimma — is baat par muttafiq hain ke tijarati maal par zakaat waajib hai. Taajir ko saal ke aakhir mein tamaam maal ki market value lagani chahiye aur agar woh nisaab se zyada ho to 2.5% zakaat ada karni chahiye. Is mein dukaan ka saamaan, khaam maal aur woh tamaam ashyaa shaamil hain jo dobaara farokht ki niyyat se khareedi gayi hon. (Al-Mughni, Ibn Qudamah)</p>}
                    </div>
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
