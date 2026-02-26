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
  { number: 1, name: "آلم", startPage: 1, endPage: 20 },
  { number: 2, name: "سيقول", startPage: 21, endPage: 38 },
  { number: 3, name: "تلك الرسل", startPage: 39, endPage: 56 },
  { number: 4, name: "لن تنالوا", startPage: 57, endPage: 74 },
  { number: 5, name: "والمحصنات", startPage: 75, endPage: 92 },
  { number: 6, name: "لا يحب الله", startPage: 93, endPage: 110 },
  { number: 7, name: "وإذا سمعوا", startPage: 111, endPage: 128 },
  { number: 8, name: "ولو أننا", startPage: 129, endPage: 146 },
  { number: 9, name: "قال الملأ", startPage: 147, endPage: 164 },
  { number: 10, name: "واعلموا", startPage: 165, endPage: 182 },
  { number: 11, name: "يعتذرون", startPage: 183, endPage: 200 },
  { number: 12, name: "وما من دابة", startPage: 201, endPage: 218 },
  { number: 13, name: "وما أبرئ", startPage: 219, endPage: 236 },
  { number: 14, name: "ربما", startPage: 237, endPage: 254 },
  { number: 15, name: "سبحان الذي", startPage: 255, endPage: 272 },
  { number: 16, name: "قال ألم", startPage: 273, endPage: 290 },
  { number: 17, name: "اقترب للناس", startPage: 291, endPage: 308 },
  { number: 18, name: "قد أفلح", startPage: 309, endPage: 326 },
  { number: 19, name: "وقال الذين", startPage: 327, endPage: 344 },
  { number: 20, name: "أمن خلق", startPage: 345, endPage: 362 },
  { number: 21, name: "اتل ما أوحي", startPage: 363, endPage: 380 },
  { number: 22, name: "ومن يقنت", startPage: 381, endPage: 398 },
  { number: 23, name: "وما لي", startPage: 399, endPage: 416 },
  { number: 24, name: "فمن أظلم", startPage: 417, endPage: 434 },
  { number: 25, name: "إليه يرد", startPage: 435, endPage: 452 },
  { number: 26, name: "حم", startPage: 453, endPage: 470 },
  { number: 27, name: "قال فما خطبكم", startPage: 471, endPage: 488 },
  { number: 28, name: "قد سمع الله", startPage: 489, endPage: 508 },
  { number: 29, name: "تبارك الذي", startPage: 509, endPage: 528 },
  { number: 30, name: "عم يتساءلون", startPage: 529, endPage: 559 },
];
