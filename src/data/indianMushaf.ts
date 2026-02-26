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
  { number: 8, name: "ولو أننا", startPage: 129, endPage: 147 },
  { number: 9, name: "قال الملأ", startPage: 148, endPage: 165 },
  { number: 10, name: "واعلموا", startPage: 166, endPage: 183 },
  { number: 11, name: "يعتذرون", startPage: 184, endPage: 201 },
  { number: 12, name: "وما من دابة", startPage: 202, endPage: 219 },
  { number: 13, name: "وما أبرئ", startPage: 220, endPage: 237 },
  { number: 14, name: "ربما", startPage: 238, endPage: 255 },
  { number: 15, name: "سبحان الذي", startPage: 256, endPage: 273 },
  { number: 16, name: "قال ألم", startPage: 274, endPage: 291 },
  { number: 17, name: "اقترب للناس", startPage: 292, endPage: 309 },
  { number: 18, name: "قد أفلح", startPage: 310, endPage: 327 },
  { number: 19, name: "وقال الذين", startPage: 328, endPage: 346 },
  { number: 20, name: "أمن خلق", startPage: 347, endPage: 364 },
  { number: 21, name: "اتل ما أوحي", startPage: 365, endPage: 382 },
  { number: 22, name: "ومن يقنت", startPage: 383, endPage: 400 },
  { number: 23, name: "وما لي", startPage: 401, endPage: 418 },
  { number: 24, name: "فمن أظلم", startPage: 419, endPage: 436 },
  { number: 25, name: "إليه يرد", startPage: 437, endPage: 454 },
  { number: 26, name: "حم", startPage: 455, endPage: 472 },
  { number: 27, name: "قال فما خطبكم", startPage: 473, endPage: 490 },
  { number: 28, name: "قد سمع الله", startPage: 491, endPage: 508 },
  { number: 29, name: "تبارك الذي", startPage: 509, endPage: 528 },
  { number: 30, name: "عم يتساءلون", startPage: 529, endPage: 559 },
];
