// 16-line Indo-Pak Mushaf (Taj Company style) data
// This mushaf has ruku markers and is commonly used in South Asian countries

export const TOTAL_PAGES_INDIAN = 559;

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
  startPage: number;
  endPage: number;
}

export const INDIAN_JUZ_DATA: IndianJuzInfo[] = [
  { number: 1, name: "آلم", startPage: 1, endPage: 18 },
  { number: 2, name: "سيقول", startPage: 19, endPage: 36 },
  { number: 3, name: "تلك الرسل", startPage: 37, endPage: 54 },
  { number: 4, name: "لن تنالوا", startPage: 55, endPage: 72 },
  { number: 5, name: "والمحصنات", startPage: 73, endPage: 90 },
  { number: 6, name: "لا يحب الله", startPage: 91, endPage: 108 },
  { number: 7, name: "وإذا سمعوا", startPage: 109, endPage: 126 },
  { number: 8, name: "ولو أننا", startPage: 127, endPage: 145 },
  { number: 9, name: "قال الملأ", startPage: 146, endPage: 163 },
  { number: 10, name: "واعلموا", startPage: 164, endPage: 181 },
  { number: 11, name: "يعتذرون", startPage: 182, endPage: 199 },
  { number: 12, name: "وما من دابة", startPage: 200, endPage: 217 },
  { number: 13, name: "وما أبرئ", startPage: 218, endPage: 235 },
  { number: 14, name: "ربما", startPage: 236, endPage: 253 },
  { number: 15, name: "سبحان الذي", startPage: 254, endPage: 271 },
  { number: 16, name: "قال ألم", startPage: 272, endPage: 289 },
  { number: 17, name: "اقترب للناس", startPage: 290, endPage: 307 },
  { number: 18, name: "قد أفلح", startPage: 308, endPage: 325 },
  { number: 19, name: "وقال الذين", startPage: 326, endPage: 344 },
  { number: 20, name: "أمن خلق", startPage: 345, endPage: 362 },
  { number: 21, name: "اتل ما أوحي", startPage: 363, endPage: 380 },
  { number: 22, name: "ومن يقنت", startPage: 381, endPage: 398 },
  { number: 23, name: "وما لي", startPage: 399, endPage: 416 },
  { number: 24, name: "فمن أظلم", startPage: 417, endPage: 434 },
  { number: 25, name: "إليه يرد", startPage: 435, endPage: 452 },
  { number: 26, name: "حم", startPage: 453, endPage: 470 },
  { number: 27, name: "قال فما خطبكم", startPage: 471, endPage: 488 },
  { number: 28, name: "قد سمع الله", startPage: 489, endPage: 506 },
  { number: 29, name: "تبارك الذي", startPage: 507, endPage: 526 },
  { number: 30, name: "عم يتساءلون", startPage: 527, endPage: 559 },
];
