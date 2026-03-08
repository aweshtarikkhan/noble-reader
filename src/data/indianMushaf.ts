// 16-line Indo-Pak Mushaf (Taj Company style) data
// This mushaf has ruku markers and is commonly used in South Asian countries

export const TOTAL_PAGES_INDIAN = 558;

// Primary: Archive.org Taj Company 16-line Quran
export function getIndianPageImage(pageNum: number): string {
  const padded = String(pageNum).padStart(4, '0');
  return `https://ia801202.us.archive.org/BookReader/BookReaderImages.php?zip=/1/items/AlQuranAlKareem16LinesTajCompany/AlQuranAlKareem16Lines-TajCompany_jp2.zip&file=AlQuranAlKareem16Lines-TajCompany_jp2/AlQuranAlKareem16Lines-TajCompany_${padded}.jp2&id=AlQuranAlKareem16LinesTajCompany&scale=2&rotate=0`;
}

// Fallback: Alternative archive.org source
export function getIndianPageImageFallback(pageNum: number): string {
  const padded = String(pageNum + 1).padStart(4, '0');
  return `https://ia801203.us.archive.org/BookReader/BookReaderImages.php?zip=/29/items/Quran16Lines_201601/Quran%2016%20lines_jp2.zip&file=Quran%2016%20lines_jp2/Quran%2016%20lines_${padded}.jp2&id=Quran16Lines_201601&scale=2&rotate=0`;
}

// All IndoPak image sources for download (tried in order)
export function getIndianPageImageSources(pageNum: number): string[] {
  return [
    getIndianPageImage(pageNum),
    getIndianPageImageFallback(pageNum),
  ];
}

// Ruku data: each ruku with surah number, ayah number, and ruku number within that surah
// 16-line Quran Para/Juz page mapping (approximate, Taj Company edition)
export interface IndianJuzInfo {
  number: number;
  name: string;
  nameTransliteration: string;
  startPage: number;
  endPage: number;
}

export const INDIAN_JUZ_DATA: IndianJuzInfo[] = [
  { number: 1, name: "آلم", nameTransliteration: "Alif-Lam-Mim", startPage: 1, endPage: 20 },
  { number: 2, name: "سيقول", nameTransliteration: "Sayaqul", startPage: 21, endPage: 38 },
  { number: 3, name: "تلك الرسل", nameTransliteration: "Tilkal Rusul", startPage: 39, endPage: 56 },
  { number: 4, name: "لن تنالوا", nameTransliteration: "Lan Tanalu", startPage: 57, endPage: 74 },
  { number: 5, name: "والمحصنات", nameTransliteration: "Wal Muhsanat", startPage: 75, endPage: 92 },
  { number: 6, name: "لا يحب الله", nameTransliteration: "La Yuhibbullah", startPage: 93, endPage: 110 },
  { number: 7, name: "وإذا سمعوا", nameTransliteration: "Wa Iz Sami'u", startPage: 111, endPage: 128 },
  { number: 8, name: "ولو أننا", nameTransliteration: "Wa Lau Annana", startPage: 129, endPage: 146 },
  { number: 9, name: "قال الملأ", nameTransliteration: "Qalal Mala'u", startPage: 147, endPage: 164 },
  { number: 10, name: "واعلموا", nameTransliteration: "Wa'lamu", startPage: 165, endPage: 182 },
  { number: 11, name: "يعتذرون", nameTransliteration: "Ya'tazirun", startPage: 183, endPage: 200 },
  { number: 12, name: "وما من دابة", nameTransliteration: "Wa Ma Min Dabbah", startPage: 201, endPage: 218 },
  { number: 13, name: "وما أبرئ", nameTransliteration: "Wa Ma Ubarri'u", startPage: 219, endPage: 236 },
  { number: 14, name: "ربما", nameTransliteration: "Rubama", startPage: 237, endPage: 254 },
  { number: 15, name: "سبحان الذي", nameTransliteration: "Subhanalladhi", startPage: 255, endPage: 272 },
  { number: 16, name: "قال ألم", nameTransliteration: "Qala Alam", startPage: 273, endPage: 290 },
  { number: 17, name: "اقترب للناس", nameTransliteration: "Iqtaraba Lin-Nasi", startPage: 291, endPage: 308 },
  { number: 18, name: "قد أفلح", nameTransliteration: "Qad Aflaha", startPage: 309, endPage: 326 },
  { number: 19, name: "وقال الذين", nameTransliteration: "Wa Qalal-ladhina", startPage: 327, endPage: 344 },
  { number: 20, name: "أمن خلق", nameTransliteration: "Amman Khalaqa", startPage: 345, endPage: 362 },
  { number: 21, name: "اتل ما أوحي", nameTransliteration: "Utlu Ma Uhiya", startPage: 363, endPage: 380 },
  { number: 22, name: "ومن يقنت", nameTransliteration: "Wa Man Yaqnut", startPage: 381, endPage: 398 },
  { number: 23, name: "وما لي", nameTransliteration: "Wa Maliya", startPage: 399, endPage: 416 },
  { number: 24, name: "فمن أظلم", nameTransliteration: "Faman Azlamu", startPage: 417, endPage: 434 },
  { number: 25, name: "إليه يرد", nameTransliteration: "Ilaihi Yuraddu", startPage: 435, endPage: 452 },
  { number: 26, name: "حم", nameTransliteration: "Ha-Mim", startPage: 453, endPage: 470 },
  { number: 27, name: "قال فما خطبكم", nameTransliteration: "Qala Fama Khatbukum", startPage: 471, endPage: 488 },
  { number: 28, name: "قد سمع الله", nameTransliteration: "Qad Sami'allahu", startPage: 489, endPage: 508 },
  { number: 29, name: "تبارك الذي", nameTransliteration: "Tabarakalladhi", startPage: 509, endPage: 528 },
  { number: 30, name: "عم يتساءلون", nameTransliteration: "Amma Yatasa'alun", startPage: 529, endPage: 558 },
];
