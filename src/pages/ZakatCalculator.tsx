import React, { useState, useEffect } from "react";
import { ArrowLeft, Calculator, Download, Plus, X } from "lucide-react";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface GoldEntry {
  id: string;
  carat: "22" | "24" | "18";
  grams: string;
}

interface SilverEntry {
  id: string;
  grams: string;
}

const NISAB_SILVER_GRAMS = 612.36;
const ZAKAT_RATE = 0.025;

const ZakatCalculator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [manualGold22, setManualGold22] = useState("7150");
  const [manualSilver, setManualSilver] = useState("95");
  
  const [goldEntries, setGoldEntries] = useState<GoldEntry[]>([
    { id: "1", carat: "22", grams: "" }
  ]);
  const [silverEntries, setSilverEntries] = useState<SilverEntry[]>([
    { id: "1", grams: "" }
  ]);
  
  const [cashValue, setCashValue] = useState("");
  const [otherAssets, setOtherAssets] = useState("");
  const [liabilities, setLiabilities] = useState("");
  
  const [zakatResult, setZakatResult] = useState<{
    totalAssets: number;
    netAssets: number;
    nisabValue: number;
    zakatDue: number;
    isEligible: boolean;
  } | null>(null);

  const gold22Rate = parseFloat(manualGold22) || 7150;
  const gold24Rate = Math.round(gold22Rate / 0.916);
  const gold18Rate = Math.round(gold22Rate * (18/22));
  const silverRate = parseFloat(manualSilver) || 95;

  const getGoldRate = (carat: string) => {
    switch (carat) {
      case "24": return gold24Rate;
      case "22": return gold22Rate;
      case "18": return gold18Rate;
      default: return gold22Rate;
    }
  };

  const addGoldEntry = () => {
    setGoldEntries([...goldEntries, { id: Date.now().toString(), carat: "22", grams: "" }]);
  };

  const removeGoldEntry = (id: string) => {
    if (goldEntries.length > 1) {
      setGoldEntries(goldEntries.filter(e => e.id !== id));
    }
  };

  const updateGoldEntry = (id: string, field: "carat" | "grams", value: string) => {
    setGoldEntries(goldEntries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const addSilverEntry = () => {
    setSilverEntries([...silverEntries, { id: Date.now().toString(), grams: "" }]);
  };

  const removeSilverEntry = (id: string) => {
    if (silverEntries.length > 1) {
      setSilverEntries(silverEntries.filter(e => e.id !== id));
    }
  };

  const updateSilverEntry = (id: string, grams: string) => {
    setSilverEntries(silverEntries.map(e => e.id === id ? { ...e, grams } : e));
  };

  const calculateTotalGold = () => {
    return goldEntries.reduce((sum, entry) => {
      const grams = parseFloat(entry.grams) || 0;
      return sum + (grams * getGoldRate(entry.carat));
    }, 0);
  };

  const calculateTotalSilver = () => {
    return silverEntries.reduce((sum, entry) => {
      const grams = parseFloat(entry.grams) || 0;
      return sum + (grams * silverRate);
    }, 0);
  };

  const calculateZakat = () => {
    const goldInRupees = calculateTotalGold();
    const silverInRupees = calculateTotalSilver();
    const cash = parseFloat(cashValue) || 0;
    const other = parseFloat(otherAssets) || 0;
    const debts = parseFloat(liabilities) || 0;

    const totalAssets = goldInRupees + silverInRupees + cash + other;
    const netAssets = totalAssets - debts;
    const nisabValue = NISAB_SILVER_GRAMS * silverRate;

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
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const exportToPDF = () => {
    if (!zakatResult) {
      toast({ title: "Calculate first" });
      return;
    }

    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(18);
    doc.setTextColor(6, 78, 59);
    doc.text("Zakat Calculation", pw / 2, 25, { align: "center" });
    
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(new Date().toLocaleDateString('en-IN'), pw / 2, 32, { align: "center" });
    
    let y = 50;
    doc.setFontSize(10);
    doc.setTextColor(0);
    
    doc.text(`Gold 22K: ₹${gold22Rate}/gm | Silver: ₹${silverRate}/gm`, 20, y);
    y += 15;
    
    goldEntries.forEach((e, i) => {
      if (e.grams) {
        doc.text(`Gold ${e.carat}K: ${e.grams}g = ₹${Math.round(parseFloat(e.grams) * getGoldRate(e.carat)).toLocaleString()}`, 20, y);
        y += 6;
      }
    });
    
    silverEntries.forEach((e) => {
      if (e.grams) {
        doc.text(`Silver: ${e.grams}g = ₹${Math.round(parseFloat(e.grams) * silverRate).toLocaleString()}`, 20, y);
        y += 6;
      }
    });
    
    if (cashValue) { doc.text(`Cash: ₹${cashValue}`, 20, y); y += 6; }
    if (otherAssets) { doc.text(`Other: ₹${otherAssets}`, 20, y); y += 6; }
    if (liabilities) { doc.text(`Debts: ₹${liabilities}`, 20, y); y += 6; }
    
    y += 10;
    doc.setDrawColor(200);
    doc.line(20, y, pw - 20, y);
    y += 10;
    
    doc.text(`Total: ₹${zakatResult.totalAssets.toLocaleString()}`, 20, y); y += 6;
    doc.text(`Net: ₹${zakatResult.netAssets.toLocaleString()}`, 20, y); y += 6;
    doc.text(`Nisab: ₹${zakatResult.nisabValue.toLocaleString()}`, 20, y); y += 12;
    
    doc.setFontSize(14);
    doc.setTextColor(6, 78, 59);
    doc.text(`Zakat: ₹${zakatResult.zakatDue.toLocaleString()}`, 20, y);
    
    doc.save(`Zakat_${new Date().toISOString().split('T')[0]}.pdf`);
    toast({ title: "PDF saved" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Zakat Calculator</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Rates */}
        <div className="flex gap-2">
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground mb-1">Gold 22K ₹/gm</p>
            <Input
              type="number"
              value={manualGold22}
              onChange={(e) => setManualGold22(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground mb-1">Silver ₹/gm</p>
            <Input
              type="number"
              value={manualSilver}
              onChange={(e) => setManualSilver(e.target.value)}
              className="h-9"
            />
          </div>
        </div>
        
        <div className="flex gap-2 text-[10px] text-muted-foreground">
          <span className="px-2 py-1 bg-muted rounded">24K: ₹{gold24Rate}</span>
          <span className="px-2 py-1 bg-muted rounded">22K: ₹{gold22Rate}</span>
          <span className="px-2 py-1 bg-muted rounded">18K: ₹{gold18Rate}</span>
        </div>

        {/* Gold */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">🥇 Gold</p>
            <button onClick={addGoldEntry} className="text-xs text-primary flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          {goldEntries.map((entry, i) => (
            <div key={entry.id} className="flex gap-2 items-center">
              <Select value={entry.carat} onValueChange={(v) => updateGoldEntry(entry.id, "carat", v)}>
                <SelectTrigger className="w-20 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="22">22K</SelectItem>
                  <SelectItem value="24">24K</SelectItem>
                  <SelectItem value="18">18K</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="grams"
                value={entry.grams}
                onChange={(e) => updateGoldEntry(entry.id, "grams", e.target.value)}
                className="flex-1 h-9"
              />
              {entry.grams && (
                <span className="text-xs text-muted-foreground w-20 text-right">
                  {formatCurrency(parseFloat(entry.grams) * getGoldRate(entry.carat))}
                </span>
              )}
              {goldEntries.length > 1 && (
                <button onClick={() => removeGoldEntry(entry.id)} className="p-1 text-muted-foreground hover:text-destructive">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Silver */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">🥈 Silver</p>
            <button onClick={addSilverEntry} className="text-xs text-primary flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          {silverEntries.map((entry) => (
            <div key={entry.id} className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="grams"
                value={entry.grams}
                onChange={(e) => updateSilverEntry(entry.id, e.target.value)}
                className="flex-1 h-9"
              />
              {entry.grams && (
                <span className="text-xs text-muted-foreground w-20 text-right">
                  {formatCurrency(parseFloat(entry.grams) * silverRate)}
                </span>
              )}
              {silverEntries.length > 1 && (
                <button onClick={() => removeSilverEntry(entry.id)} className="p-1 text-muted-foreground hover:text-destructive">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Cash & Others */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">💵 Cash & Assets</p>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Cash ₹"
              value={cashValue}
              onChange={(e) => setCashValue(e.target.value)}
              className="h-9"
            />
            <Input
              type="number"
              placeholder="Other Assets ₹"
              value={otherAssets}
              onChange={(e) => setOtherAssets(e.target.value)}
              className="h-9"
            />
          </div>
          <Input
            type="number"
            placeholder="Debts/Liabilities ₹"
            value={liabilities}
            onChange={(e) => setLiabilities(e.target.value)}
            className="h-9"
          />
        </div>

        <Button onClick={calculateZakat} className="w-full h-11">
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Zakat
        </Button>

        {/* Result */}
        {zakatResult && (
          <div className={`rounded-xl p-4 space-y-3 ${zakatResult.isEligible ? "bg-primary/10 border border-primary/30" : "bg-muted"}`}>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span>{formatCurrency(zakatResult.totalAssets)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net</span>
                <span>{formatCurrency(zakatResult.netAssets)}</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Nisab</span>
              <span>{formatCurrency(zakatResult.nisabValue)}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="font-semibold">Zakat (2.5%)</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(zakatResult.zakatDue)}</span>
            </div>
            <Button onClick={exportToPDF} variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </div>
        )}

        {/* Nisab Info */}
        <p className="text-[10px] text-muted-foreground text-center">
          Nisab: 87.48g Gold or 612.36g Silver | Zakat: 2.5%
        </p>
      </div>
    </div>
  );
};

export default ZakatCalculator;
