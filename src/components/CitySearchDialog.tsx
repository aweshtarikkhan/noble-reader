import React, { useState, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Loader2 } from "lucide-react";

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

interface CitySearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (lat: number, lng: number, cityName: string) => void;
}

const CitySearchDialog: React.FC<CitySearchDialogProps> = ({ open, onOpenChange, onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const searchCity = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=8&accept-language=en`;
      const res = await fetch(url, { headers: { "User-Agent": "QuranReaderApp/1.0" } });
      const data: SearchResult[] = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchCity(value), 400);
  };

  const getCityName = (r: SearchResult) => {
    const addr = r.address;
    if (!addr) return r.display_name.split(",")[0];
    const city = addr.city || addr.town || addr.village || addr.county || "";
    const state = addr.state || "";
    const country = addr.country || "";
    return [city, state, country].filter(Boolean).join(", ");
  };

  const handleSelect = (r: SearchResult) => {
    const addr = r.address;
    const shortName = addr?.city || addr?.town || addr?.village || addr?.county || addr?.state || r.display_name.split(",")[0];
    onSelect(parseFloat(r.lat), parseFloat(r.lon), shortName);
    onOpenChange(false);
    setQuery("");
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Search City / Town / Village</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Type city, town or village name..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1">
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          )}

          {!loading && results.length === 0 && query.length >= 2 && (
            <p className="text-center text-sm text-muted-foreground py-6">No results found</p>
          )}

          {!loading && results.map((r, i) => (
            <button
              key={i}
              onClick={() => handleSelect(r)}
              className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-accent/50 active:scale-[0.98] transition-all text-left"
            >
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{getCityName(r)}</p>
                <p className="text-[11px] text-muted-foreground truncate">{r.display_name}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CitySearchDialog;
