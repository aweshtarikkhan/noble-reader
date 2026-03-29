// 15-line Colored Tajweed Hifz Mushaf (604 pages, same as Saudi/Madani layout)
// Source: easyquran.com (Hafs An Asim, color-coded tajweed rules)

const HIFZ_BASE = "https://easyquran.com/wp-content/uploads/2022/09";

export function getHifzPageImage(page: number): string {
  return `${HIFZ_BASE}/${page}-scaled.jpg`;
}

// Fallback via raw GitHub (jahedev/tajweed-quran-pages repo)
const GITHUB_BASE = "https://raw.githubusercontent.com/jahedev/tajweed-quran-pages/master/images/hafs";

export function getHifzPageImageFallback(page: number): string {
  return `${GITHUB_BASE}/${page}.jpg`;
}

// Total pages same as Saudi mushaf
export const TOTAL_PAGES_HIFZ = 604;
