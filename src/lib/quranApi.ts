const API_BASE = "https://api.alquran.cloud/v1";
const FAWAZ_CDN = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions";

const cache: Record<string, any> = {};

async function fetchJSON(url: string) {
  if (cache[url]) return cache[url];
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  const json = await res.json();
  const data = json.data || json;
  cache[url] = data;
  return data;
}

export const QuranAPI = {
  getPage: (num: number) => fetchJSON(`${API_BASE}/page/${num}/quran-uthmani`),
  getSurah: (num: number) => fetchJSON(`${API_BASE}/surah/${num}/quran-uthmani`),
  getSurahEdition: (num: number, edition: string) => fetchJSON(`${API_BASE}/surah/${num}/${edition}`),
  getJuz: (num: number) => fetchJSON(`${API_BASE}/juz/${num}/quran-uthmani`),

  async fetchFawazEdition(editionId: string, surahNum: number) {
    const url = `${FAWAZ_CDN}/${editionId}.min.json`;
    const data = await fetchJSON(url);
    const quranData = data.quran || data;
    const filtered = quranData.filter((v: any) => v.chapter === surahNum);
    return {
      ayahs: filtered.map((v: any) => ({
        text: v.text,
        numberInSurah: v.verse,
      })),
    };
  },

  getMushafPageImage: (num: number) =>
    `https://surahquran.com/img/pages-quran/page${String(num).padStart(3, '0')}.png`,

  getMushafPageImageFallbacks: (num: number) => [
    `https://www.mp3quran.net/api/quran_pages_arabic/${num}.png`,
    `https://raw.githubusercontent.com/niceDev0908/quran/master/static/images/pages/page${String(num).padStart(3, '0')}.png`,
  ],

  // All sources in order for download
  getMushafPageImageSources: (num: number) => [
    `https://surahquran.com/img/pages-quran/page${String(num).padStart(3, '0')}.png`,
    `https://www.mp3quran.net/api/quran_pages_arabic/${num}.png`,
    `https://raw.githubusercontent.com/niceDev0908/quran/master/static/images/pages/page${String(num).padStart(3, '0')}.png`,
  ],

  async getPrayerTimes(lat: number, lng: number, method: number = 1, school: number = 0) {
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=${method}&school=${school}`;
    return fetchJSON(url);
  },

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`;
      const res = await fetch(url, { headers: { "Accept-Language": "en" } });
      const data = await res.json();
      const addr = data.address;
      return addr?.city || addr?.town || addr?.village || addr?.county || addr?.state || "Unknown";
    } catch {
      return "Unknown";
    }
  },

  async reverseGeocodeWithCountry(lat: number, lng: number): Promise<{ city: string; countryCode: string }> {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`;
      const res = await fetch(url, { headers: { "Accept-Language": "en" } });
      const data = await res.json();
      const addr = data.address;
      const city = addr?.city || addr?.town || addr?.village || addr?.county || addr?.state || "Unknown";
      const countryCode = (addr?.country_code || "").toUpperCase();
      return { city, countryCode };
    } catch {
      return { city: "Unknown", countryCode: "" };
    }
  },
};
