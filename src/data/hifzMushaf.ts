// 15-line Colored Tajweed Hifz Mushaf (604 pages, same as Saudi/Madani layout)
// Source: QuranHub (GitHub) with jahedev fallback

const PRIMARY_BASE = "https://raw.githubusercontent.com/QuranHub/quran-pages-images/main/easyquran.com/hafs-tajweed";
const FALLBACK_BASE = "https://raw.githubusercontent.com/jahedev/tajweed-quran-pages/master/hafs";

export function getHifzPageImage(page: number): string {
  return `${PRIMARY_BASE}/${page}.jpg`;
}

export function getHifzPageImageFallback(page: number): string {
  const padded = String(page).padStart(3, "0");
  return `${FALLBACK_BASE}/tajweed-${padded}.jpg`;
}

export const TOTAL_PAGES_HIFZ = 604;
