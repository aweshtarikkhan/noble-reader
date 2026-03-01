import localforage from "localforage";
import type { SectionData } from "@/lib/hadithApi";

const store = localforage.createInstance({ name: "hadith_offline" });

const bookKey = (bookId: string) => `book_${bookId}`;

export interface OfflineBookData {
  arabic: SectionData;
  english: SectionData;
  urdu: SectionData;
  savedAt: number;
}

export async function saveHadithBookOffline(
  bookId: string,
  arabic: SectionData,
  english: SectionData,
  urdu: SectionData
): Promise<void> {
  await store.setItem(bookKey(bookId), {
    arabic,
    english,
    urdu,
    savedAt: Date.now(),
  } as OfflineBookData);
}

export async function getHadithBookOffline(bookId: string): Promise<OfflineBookData | null> {
  return store.getItem<OfflineBookData>(bookKey(bookId));
}

export async function isBookSavedOffline(bookId: string): Promise<boolean> {
  const data = await store.getItem(bookKey(bookId));
  return !!data;
}

export async function getOfflineBookIds(): Promise<string[]> {
  const keys = await store.keys();
  return keys.filter((k) => k.startsWith("book_")).map((k) => k.replace("book_", ""));
}

export async function removeBookOffline(bookId: string): Promise<void> {
  await store.removeItem(bookKey(bookId));
}
