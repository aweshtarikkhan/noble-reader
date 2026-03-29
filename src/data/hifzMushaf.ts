// 15-line Colored Tajweed Hifz Mushaf from Archive.org
// Source: https://archive.org/details/quran_202301
// 644 total leaves, first 8 are cover/intro. Quran page 1 = leaf index 8.
// Uses BookReader image API to convert JP2 → JPEG on the fly.

const SERVER = "ia801605.us.archive.org";
const DIR = "/10/items/quran_202301";
const ZIP = "Quran_jp2.zip";
const FILE_PREFIX = "Quran_jp2/Quran_";

// Quran page 1 starts at leaf 8 (0-indexed file Quran_0008.jp2)
const LEAF_OFFSET = 8;

function leafFileName(quranPage: number): string {
  const leafNum = quranPage + LEAF_OFFSET - 1;
  return `${FILE_PREFIX}${String(leafNum).padStart(4, "0")}.jp2`;
}

/**
 * Get hifz page image URL (high quality, scale=2 ~400KB per page)
 */
export function getHifzPageImage(page: number): string {
  return `https://${SERVER}/BookReader/BookReaderImages.php?zip=${DIR}/${ZIP}&file=${leafFileName(page)}&id=quran_202301&scale=2&rotate=0`;
}

/**
 * Fallback: GitHub QuranHub tajweed images
 */
export function getHifzPageImageFallback(page: number): string {
  return `https://raw.githubusercontent.com/QuranHub/quran-pages-images/main/easyquran.com/hafs-tajweed/${page}.jpg`;
}

/**
 * Second fallback: jahedev repo
 */
export function getHifzPageImageFallback2(page: number): string {
  const padded = String(page).padStart(3, "0");
  return `https://raw.githubusercontent.com/jahedev/tajweed-quran-pages/master/hafs/tajweed-${padded}.jpg`;
}

export const TOTAL_PAGES_HIFZ = 604;
