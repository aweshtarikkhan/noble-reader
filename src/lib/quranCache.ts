// Shared IndexedDB cache for Quran page images
import { Capacitor } from "@capacitor/core";

const DB_NAME = "quran_pages_cache";
const STORE_NAME = "pages";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getCachedPage(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function setCachedPage(key: string, dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(dataUrl, key);
  } catch {
    // silently fail
  }
}

export async function isPageCached(key: string): Promise<boolean> {
  const cached = await getCachedPage(key);
  return cached !== null;
}

/**
 * Convert ArrayBuffer to base64 string using chunked approach
 * to avoid call stack limits with large files
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    for (let j = 0; j < chunk.length; j++) {
      binary += String.fromCharCode(chunk[j]);
    }
  }
  return btoa(binary);
}

/**
 * Download image as data URL.
 * On native Capacitor: uses CapacitorHttp (bypasses CORS).
 * On web: uses fetch (may fail due to CORS for some sources).
 */
export async function downloadImageAsDataUrl(url: string): Promise<string | null> {
  try {
    if (Capacitor.isNativePlatform()) {
      // Use Capacitor HTTP plugin - no CORS restrictions
      const { CapacitorHttp } = await import("@capacitor/core");
      const response = await CapacitorHttp.get({
        url,
        responseType: "arraybuffer",
      });

      if (response.status !== 200) return null;

      // response.data is base64 string when responseType is arraybuffer
      const base64 = response.data;
      // Detect content type from URL
      const isJp2 = url.includes(".jp2");
      const isPng = url.includes(".png");
      const contentType = isJp2 ? "image/jpeg" : isPng ? "image/png" : "image/jpeg";
      return `data:${contentType};base64,${base64}`;
    } else {
      // Web: try fetch (may fail due to CORS)
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    }
  } catch {
    return null;
  }
}

/**
 * Try to cache an image from an <img> element using canvas.
 * This only works if the image was loaded without CORS restrictions
 * (i.e., without crossOrigin="anonymous") - the canvas will be tainted
 * but we catch the error gracefully.
 */
export async function cacheImageFromElement(
  img: HTMLImageElement,
  key: string
): Promise<boolean> {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    ctx.drawImage(img, 0, 0);
    const dataUrl = canvas.toDataURL("image/webp", 0.8);
    await setCachedPage(key, dataUrl);
    return true;
  } catch {
    // Canvas tainted by CORS - can't cache from element
    return false;
  }
}

export async function getCachedCount(prefix: string, total: number): Promise<number> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      let count = 0;
      const req = store.openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          if ((cursor.key as string).startsWith(prefix)) count++;
          cursor.continue();
        } else {
          resolve(count);
        }
      };
      req.onerror = () => resolve(0);
    });
  } catch {
    return 0;
  }
}

export async function clearCache(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
  } catch {
    // silently fail
  }
}
