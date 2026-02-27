const BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";

export type HadithBook = {
  id: string;
  name: string;
  arabicEdition: string;
  englishEdition: string;
  urduEdition: string;
};

export const HADITH_BOOKS: HadithBook[] = [
  { id: "bukhari", name: "Sahih al-Bukhari", arabicEdition: "ara-bukhari", englishEdition: "eng-bukhari", urduEdition: "urd-bukhari" },
  { id: "muslim", name: "Sahih Muslim", arabicEdition: "ara-muslim", englishEdition: "eng-muslim", urduEdition: "urd-muslim" },
  { id: "nasai", name: "Sunan al-Nasa'i", arabicEdition: "ara-nasai", englishEdition: "eng-nasai", urduEdition: "urd-nasai" },
  { id: "abudawud", name: "Sunan Abu Dawood", arabicEdition: "ara-abudawud", englishEdition: "eng-abudawud", urduEdition: "urd-abudawud" },
  { id: "tirmidhi", name: "Jami` at-Tirmidhi", arabicEdition: "ara-tirmidhi", englishEdition: "eng-tirmidhi", urduEdition: "urd-tirmidhi" },
  { id: "ibnmajah", name: "Sunan Ibn Majah", arabicEdition: "ara-ibnmajah", englishEdition: "eng-ibnmajah", urduEdition: "urd-ibnmajah" },
];

export type HadithEntry = {
  hadithnumber: number;
  arabicnumber: number;
  text: string;
  grades: { name: string; grade: string }[];
  reference: { book: number; hadith: number };
};

export type SectionData = {
  metadata: {
    name: string;
    section: Record<string, string>;
    section_detail: Record<string, { hadithnumber_first: number; hadithnumber_last: number }>;
  };
  hadiths: HadithEntry[];
};

// Simple in-memory + localStorage cache
const memoryCache: Record<string, any> = {};

const getCached = (key: string): any => {
  if (memoryCache[key]) return memoryCache[key];
  try {
    const stored = localStorage.getItem(`hadith_cache_${key}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      memoryCache[key] = parsed;
      return parsed;
    }
  } catch { /* ignore */ }
  return null;
};

const setCache = (key: string, data: any) => {
  memoryCache[key] = data;
  try {
    localStorage.setItem(`hadith_cache_${key}`, JSON.stringify(data));
  } catch { /* storage full, just use memory */ }
};

async function fetchJSON(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  return res.json();
}

export async function fetchBookSections(edition: string): Promise<SectionData> {
  const cacheKey = `sections_${edition}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Fetch section 1 to get metadata with all section names
  const data = await fetchJSON(`${BASE}/editions/${edition}/sections/1.min.json`);
  setCache(cacheKey, data);
  return data;
}

export async function fetchSection(edition: string, sectionNo: number): Promise<SectionData> {
  const cacheKey = `section_${edition}_${sectionNo}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const data = await fetchJSON(`${BASE}/editions/${edition}/sections/${sectionNo}.min.json`);
  setCache(cacheKey, data);
  return data;
}

export async function fetchHadith(edition: string, hadithNo: number): Promise<SectionData> {
  const cacheKey = `hadith_${edition}_${hadithNo}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const data = await fetchJSON(`${BASE}/editions/${edition}/${hadithNo}.min.json`);
  setCache(cacheKey, data);
  return data;
}

export async function fetchFullBook(edition: string): Promise<SectionData> {
  const cacheKey = `full_${edition}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const data = await fetchJSON(`${BASE}/editions/${edition}.min.json`);
  setCache(cacheKey, data);
  return data;
}

// Clear cache for a specific book
export function clearBookCache(bookId: string) {
  const keys = Object.keys(localStorage).filter(k => k.includes(bookId));
  keys.forEach(k => localStorage.removeItem(k));
  Object.keys(memoryCache).filter(k => k.includes(bookId)).forEach(k => delete memoryCache[k]);
}
