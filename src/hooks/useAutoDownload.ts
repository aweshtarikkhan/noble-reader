import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { getCachedPage, setCachedPage, downloadImageAsDataUrl, getCachedCount } from "@/lib/quranCache";
import { getCacheKey, type QuranStyle } from "@/components/QuranPageView";
import { TOTAL_PAGES_INDIAN, getIndianPageImageSources } from "@/data/indianMushaf";
import { TOTAL_PAGES } from "@/data/surahs";
import { QuranAPI } from "@/lib/quranApi";

/**
 * Hook that auto-downloads all Quran pages to IndexedDB cache on app startup.
 * Only runs on native platforms (Capacitor) where CORS is not an issue.
 * Downloads IndoPak pages first (default), then Saudi pages.
 */
export function useAutoDownload() {
  const [indopakProgress, setIndopakProgress] = useState(0);
  const [saudiProgress, setSaudiProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const abortRef = useRef(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // Auto-download on native platforms
    if (Capacitor.isNativePlatform()) {
      startAutoDownload();
    }
  }, []);

  const startAutoDownload = async () => {
    setIsDownloading(true);
    abortRef.current = false;

    // Download IndoPak first
    await downloadStyle("indopak", TOTAL_PAGES_INDIAN, setIndopakProgress);
    
    if (!abortRef.current) {
      // Then download Saudi
      await downloadStyle("saudi", TOTAL_PAGES, setSaudiProgress);
    }

    setIsDownloading(false);
  };

  const downloadStyle = async (
    style: QuranStyle,
    totalPages: number,
    setProgress: (n: number) => void
  ) => {
    for (let i = 1; i <= totalPages; i++) {
      if (abortRef.current) break;

      const key = getCacheKey(style, i);
      const existing = await getCachedPage(key);
      if (existing) {
        setProgress(i);
        continue;
      }

      // Get all source URLs for this page
      const sources =
        style === "indopak"
          ? getIndianPageImageSources(i)
          : QuranAPI.getMushafPageImageSources(i);

      let dataUrl: string | null = null;
      for (const url of sources) {
        dataUrl = await downloadImageAsDataUrl(url);
        if (dataUrl) break;
      }

      if (dataUrl) {
        await setCachedPage(key, dataUrl);
      }

      setProgress(i);

      // Small delay to not overwhelm the device
      if (i % 10 === 0) {
        await new Promise((r) => setTimeout(r, 100));
      }
    }
  };

  const stopDownload = () => {
    abortRef.current = true;
  };

  return {
    indopakProgress,
    saudiProgress,
    isDownloading,
    stopDownload,
    startAutoDownload,
  };
}
