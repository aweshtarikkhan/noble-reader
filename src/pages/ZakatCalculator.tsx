import React, { useState, useEffect } from "react";
import { ArrowLeft, Calculator, Loader2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface GoldRates {
  gold22ct: number;
  gold24ct: number;
  gold18ct: number;
  silver: number;
  lastUpdated: string;
}

const NISAB_GOLD_GRAMS = 87.48; // 7.5 tola
const NISAB_SILVER_GRAMS = 612.36; // 52.5 tola
const ZAKAT_RATE = 0.025; // 2.5%

const ZakatCalculator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [rates, setRates] = useState<GoldRates>({
    gold24ct: 7800,
    gold22ct: 7150,
    gold18ct: 5850,
    silver: 95,
    lastUpdated: "Chennai Rates (Editable)"
  });
  const [loadingRates, setLoadingRates] = useState(false);
  
  // Manual rate inputs
  const [manualGold22, setManualGold22] = useState("7150");
  const [manualSilver, setManualSilver] = useState("95");
  
  // Gold inputs
  const [goldInputType, setGoldInputType] = useState<"grams" | "rupees">("grams");
  const [goldCarat, setGoldCarat] = useState<"22" | "24" | "18">("22");
  const [goldValue, setGoldValue] = useState("");
  
  // Silver inputs
  const [silverInputType, setSilverInputType] = useState<"grams" | "rupees">("grams");
  const [silverValue, setSilverValue] = useState("");
  
  // Cash & other assets
  const [cashValue, setCashValue] = useState("");
  const [otherAssets, setOtherAssets] = useState("");
  const [liabilities, setLiabilities] = useState("");
  
  // Results
  const [zakatResult, setZakatResult] = useState<{
    totalAssets: number;
    netAssets: number;
    nisabValue: number;
    zakatDue: number;
    isEligible: boolean;
  } | null>(null);

  const fetchGoldRates = async () => {
    setLoadingRates(true);
    try {
      // Using a free gold rate API - GoldAPI.io alternative
      // Fallback to approximate Chennai rates if API fails
      const response = await fetch("https://api.metalpriceapi.com/v1/latest?api_key=demo&base=INR&currencies=XAU,XAG");
      
      if (response.ok) {
        const data = await response.json();
        // Convert from troy ounce to gram (1 troy oz = 31.1035 grams)
        const goldPerGram24ct = 1 / (data.rates.XAU * 31.1035);
        const silverPerGram = 1 / (data.rates.XAG * 31.1035);
        
        setRates({
          gold24ct: Math.round(goldPerGram24ct),
          gold22ct: Math.round(goldPerGram24ct * 0.916), // 22/24 purity
          gold18ct: Math.round(goldPerGram24ct * 0.75),  // 18/24 purity
          silver: Math.round(silverPerGram),
          lastUpdated: new Date().toLocaleString('en-IN')
        });
      } else {
        throw new Error("API failed");
      }
    } catch (error) {
      // Fallback to approximate Chennai rates (March 2024)
      setRates({
        gold24ct: 7200,
        gold22ct: 6600,
        gold18ct: 5400,
        silver: 85,
        lastUpdated: "Approximate rates"
      });
      toast({
        title: "Using approximate rates",
        description: "Live rates unavailable. Using approximate Chennai rates.",
      });
    }
    setLoadingRates(false);
  };

  useEffect(() => {
    fetchGoldRates();
  }, []);

  const getGoldRate = () => {
    if (!rates) return 0;
    switch (goldCarat) {
      case "24": return rates.gold24ct;
      case "22": return rates.gold22ct;
      case "18": return rates.gold18ct;
      default: return rates.gold22ct;
    }
  };

  const calculateZakat = () => {
    if (!rates) {
      toast({ title: "Please wait", description: "Rates are loading..." });
      return;
    }

    const goldRate = getGoldRate();
    const silverRate = rates.silver;

    // Calculate gold value in rupees
    let goldInRupees = 0;
    if (goldValue) {
      if (goldInputType === "grams") {
        goldInRupees = parseFloat(goldValue) * goldRate;
      } else {
        goldInRupees = parseFloat(goldValue);
      }
    }

    // Calculate silver value in rupees
    let silverInRupees = 0;
    if (silverValue) {
      if (silverInputType === "grams") {
        silverInRupees = parseFloat(silverValue) * silverRate;
      } else {
        silverInRupees = parseFloat(silverValue);
      }
    }

    const cash = parseFloat(cashValue) || 0;
    const other = parseFloat(otherAssets) || 0;
    const debts = parseFloat(liabilities) || 0;

    const totalAssets = goldInRupees + silverInRupees + cash + other;
    const netAssets = totalAssets - debts;

    // Calculate Nisab (using silver as it's lower threshold)
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Zakat Calculator</h1>
            <p className="text-xs text-muted-foreground">زکوٰۃ کیلکولیٹر</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Live Rates Card */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Live Rates (Chennai)</CardTitle>
              <Button variant="ghost" size="sm" onClick={fetchGoldRates} disabled={loadingRates}>
                <RefreshCw className={`w-4 h-4 ${loadingRates ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingRates ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : rates ? (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-primary/10">
                  <p className="text-xs text-muted-foreground">Gold 24K</p>
                  <p className="font-bold text-foreground">₹{rates.gold24ct}/gm</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <p className="text-xs text-muted-foreground">Gold 22K</p>
                  <p className="font-bold text-foreground">₹{rates.gold22ct}/gm</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <p className="text-xs text-muted-foreground">Gold 18K</p>
                  <p className="font-bold text-foreground">₹{rates.gold18ct}/gm</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <p className="text-xs text-muted-foreground">Silver</p>
                  <p className="font-bold text-foreground">₹{rates.silver}/gm</p>
                </div>
                <p className="col-span-2 text-[10px] text-muted-foreground text-right">{rates.lastUpdated}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Gold Input */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              🥇 Gold (سونا)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Input Type</Label>
                <Select value={goldInputType} onValueChange={(v) => setGoldInputType(v as "grams" | "rupees")}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grams">Grams (گرام)</SelectItem>
                    <SelectItem value="rupees">Rupees (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Carat (قیراط)</Label>
                <Select value={goldCarat} onValueChange={(v) => setGoldCarat(v as "22" | "24" | "18")}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="22">22K (Default)</SelectItem>
                    <SelectItem value="24">24K</SelectItem>
                    <SelectItem value="18">18K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Gold Value ({goldInputType === "grams" ? "grams" : "₹"})</Label>
              <Input
                type="number"
                placeholder={goldInputType === "grams" ? "Enter weight in grams" : "Enter value in rupees"}
                value={goldValue}
                onChange={(e) => setGoldValue(e.target.value)}
                className="mt-1"
              />
              {goldInputType === "grams" && goldValue && rates && (
                <p className="text-xs text-muted-foreground mt-1">
                  ≈ {formatCurrency(parseFloat(goldValue) * getGoldRate())}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Silver Input */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              🥈 Silver (چاندی)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">Input Type</Label>
              <Select value={silverInputType} onValueChange={(v) => setSilverInputType(v as "grams" | "rupees")}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grams">Grams (گرام)</SelectItem>
                  <SelectItem value="rupees">Rupees (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Silver Value ({silverInputType === "grams" ? "grams" : "₹"})</Label>
              <Input
                type="number"
                placeholder={silverInputType === "grams" ? "Enter weight in grams" : "Enter value in rupees"}
                value={silverValue}
                onChange={(e) => setSilverValue(e.target.value)}
                className="mt-1"
              />
              {silverInputType === "grams" && silverValue && rates && (
                <p className="text-xs text-muted-foreground mt-1">
                  ≈ {formatCurrency(parseFloat(silverValue) * rates.silver)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cash & Other Assets */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">💵 Cash & Other Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">Cash in Hand/Bank (نقد رقم)</Label>
              <Input
                type="number"
                placeholder="Enter amount in ₹"
                value={cashValue}
                onChange={(e) => setCashValue(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Other Assets (Business, Investments, etc.)</Label>
              <Input
                type="number"
                placeholder="Enter amount in ₹"
                value={otherAssets}
                onChange={(e) => setOtherAssets(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Liabilities/Debts (قرض)</Label>
              <Input
                type="number"
                placeholder="Enter amount in ₹"
                value={liabilities}
                onChange={(e) => setLiabilities(e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Calculate Button */}
        <Button onClick={calculateZakat} className="w-full h-12 text-base font-semibold" disabled={loadingRates}>
          <Calculator className="w-5 h-5 mr-2" />
          Calculate Zakat
        </Button>

        {/* Results */}
        {zakatResult && (
          <Card className={`border-2 ${zakatResult.isEligible ? "border-primary bg-primary/5" : "border-muted"}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-center">
                {zakatResult.isEligible ? "💰 Zakat Due" : "ℹ️ Below Nisab"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Assets</span>
                <span className="font-medium">{formatCurrency(zakatResult.totalAssets)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Net Assets (after debts)</span>
                <span className="font-medium">{formatCurrency(zakatResult.netAssets)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nisab Threshold</span>
                <span className="font-medium">{formatCurrency(zakatResult.nisabValue)}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Zakat Payable (2.5%)</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(zakatResult.zakatDue)}
                  </span>
                </div>
              </div>
              {!zakatResult.isEligible && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  Your net assets are below the Nisab threshold. Zakat is not obligatory.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-2 p-4 bg-muted/50 rounded-xl">
          <p className="font-semibold text-foreground">ℹ️ Nisab Information:</p>
          <p>• Gold Nisab: {NISAB_GOLD_GRAMS}g (7.5 tola)</p>
          <p>• Silver Nisab: {NISAB_SILVER_GRAMS}g (52.5 tola)</p>
          <p>• Zakat Rate: 2.5% of total zakatable wealth</p>
          <p className="pt-2 text-[10px]">Note: We use Silver Nisab as it results in lower threshold, benefiting more eligible recipients.</p>
        </div>
      </div>
    </div>
  );
};

export default ZakatCalculator;
