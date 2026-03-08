import localforage from "localforage";

const audioStore = localforage.createInstance({
  name: "quran_audio_cache",
  storeName: "audio_files",
});

const CACHE_KEY_PREFIX = "audio_";

function getCacheKey(mode: string, id: string, surahNum: number): string {
  return `${CACHE_KEY_PREFIX}${mode}_${id}_${surahNum}`;
}

/**
 * Check if a surah audio is cached
 */
export async function isAudioCached(mode: string, id: string, surahNum: number): Promise<boolean> {
  try {
    const key = getCacheKey(mode, id, surahNum);
    const data = await audioStore.getItem(key);
    return !!data;
  } catch {
    return false;
  }
}

/**
 * Get cached audio as a blob URL
 */
export async function getCachedAudioUrl(mode: string, id: string, surahNum: number): Promise<string | null> {
  try {
    const key = getCacheKey(mode, id, surahNum);
    const blob = await audioStore.getItem<Blob>(key);
    if (blob) {
      return URL.createObjectURL(blob);
    }
  } catch {}
  return null;
}

/**
 * Download and cache audio for a surah
 */
export async function downloadAndCacheAudio(
  url: string,
  mode: string,
  id: string,
  surahNum: number,
  onProgress?: (loaded: number, total: number) => void
): Promise<boolean> {
  try {
    const key = getCacheKey(mode, id, surahNum);

    // Check if already cached
    const existing = await audioStore.getItem(key);
    if (existing) return true;

    const response = await fetch(url);
    if (!response.ok) return false;

    const contentLength = response.headers.get("content-length");
    const total = contentLength ? parseInt(contentLength) : 0;

    if (!response.body) {
      // Fallback: no streaming support
      const blob = await response.blob();
      await audioStore.setItem(key, blob);
      return true;
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      onProgress?.(loaded, total);
    }

    const blob = new Blob(chunks, { type: "audio/mpeg" });
    await audioStore.setItem(key, blob);
    return true;
  } catch {
    return false;
  }
}

/**
 * Remove cached audio for a surah
 */
export async function removeCachedAudio(mode: string, id: string, surahNum: number): Promise<void> {
  const key = getCacheKey(mode, id, surahNum);
  await audioStore.removeItem(key);
}

/**
 * Get count of cached surahs for a mode/id combination
 */
export async function getCachedAudioCount(mode: string, id: string): Promise<number> {
  try {
    const prefix = `${CACHE_KEY_PREFIX}${mode}_${id}_`;
    const keys = await audioStore.keys();
    return keys.filter((k) => k.startsWith(prefix)).length;
  } catch {
    return 0;
  }
}

/**
 * Get set of cached surah numbers for a mode/id
 */
export async function getCachedSurahSet(mode: string, id: string): Promise<Set<number>> {
  try {
    const prefix = `${CACHE_KEY_PREFIX}${mode}_${id}_`;
    const keys = await audioStore.keys();
    const nums = new Set<number>();
    for (const k of keys) {
      if (k.startsWith(prefix)) {
        const num = parseInt(k.replace(prefix, ""));
        if (!isNaN(num)) nums.add(num);
      }
    }
    return nums;
  } catch {
    return new Set();
  }
}
