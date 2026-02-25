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
  { number: 1, name: "آلم", startPage: 1, endPage: 21 },
  { number: 2, name: "سيقول", startPage: 22, endPage: 39 },
  { number: 3, name: "تلك الرسل", startPage: 40, endPage: 57 },
  { number: 4, name: "لن تنالوا", startPage: 58, endPage: 75 },
  { number: 5, name: "والمحصنات", startPage: 76, endPage: 93 },
  { number: 6, name: "لا يحب الله", startPage: 94, endPage: 111 },
  { number: 7, name: "وإذا سمعوا", startPage: 112, endPage: 129 },
  { number: 8, name: "ولو أننا", startPage: 130, endPage: 148 },
  { number: 9, name: "قال الملأ", startPage: 149, endPage: 166 },
  { number: 10, name: "واعلموا", startPage: 167, endPage: 184 },
  { number: 11, name: "يعتذرون", startPage: 185, endPage: 202 },
  { number: 12, name: "وما من دابة", startPage: 203, endPage: 220 },
  { number: 13, name: "وما أبرئ", startPage: 221, endPage: 238 },
  { number: 14, name: "ربما", startPage: 239, endPage: 256 },
  { number: 15, name: "سبحان الذي", startPage: 257, endPage: 274 },
  { number: 16, name: "قال ألم", startPage: 275, endPage: 292 },
  { number: 17, name: "اقترب للناس", startPage: 293, endPage: 310 },
  { number: 18, name: "قد أفلح", startPage: 311, endPage: 328 },
  { number: 19, name: "وقال الذين", startPage: 329, endPage: 347 },
  { number: 20, name: "أمن خلق", startPage: 348, endPage: 365 },
  { number: 21, name: "اتل ما أوحي", startPage: 366, endPage: 383 },
  { number: 22, name: "ومن يقنت", startPage: 384, endPage: 401 },
  { number: 23, name: "وما لي", startPage: 402, endPage: 419 },
  { number: 24, name: "فمن أظلم", startPage: 420, endPage: 437 },
  { number: 25, name: "إليه يرد", startPage: 438, endPage: 455 },
  { number: 26, name: "حم", startPage: 456, endPage: 473 },
  { number: 27, name: "قال فما خطبكم", startPage: 474, endPage: 491 },
  { number: 28, name: "قد سمع الله", startPage: 492, endPage: 509 },
  { number: 29, name: "تبارك الذي", startPage: 510, endPage: 529 },
  { number: 30, name: "عم يتساءلون", startPage: 530, endPage: 559 },
];
