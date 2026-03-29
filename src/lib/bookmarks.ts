export interface Bookmark {
  id: string;
  page: number;
  style: "indopak" | "saudi" | "hifz";
  context: string; // e.g. "Complete Quran", "Para 5", "Surah Al-Baqara"
  mode: "complete" | "para" | "surah";
  paraNum?: number;
  surahNum?: number;
  createdAt: number;
  label?: string;
}

const STORAGE_KEY = "quran_bookmarks";

export function getBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addBookmark(bookmark: Omit<Bookmark, "id" | "createdAt">): Bookmark {
  const bookmarks = getBookmarks();
  // Remove duplicate for same page+style+mode
  const filtered = bookmarks.filter(
    (b) => !(b.page === bookmark.page && b.style === bookmark.style && b.mode === bookmark.mode)
  );
  const newBookmark: Bookmark = {
    ...bookmark,
    id: `${bookmark.style}_${bookmark.mode}_${bookmark.page}_${Date.now()}`,
    createdAt: Date.now(),
  };
  filtered.unshift(newBookmark);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return newBookmark;
}

export function removeBookmark(id: string): void {
  const bookmarks = getBookmarks().filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function isPageBookmarked(page: number, style: "indopak" | "saudi", mode: "complete" | "para" | "surah"): boolean {
  return getBookmarks().some((b) => b.page === page && b.style === style && b.mode === mode);
}

export function toggleBookmark(bookmark: Omit<Bookmark, "id" | "createdAt">): boolean {
  const existing = getBookmarks().find(
    (b) => b.page === bookmark.page && b.style === bookmark.style && b.mode === bookmark.mode
  );
  if (existing) {
    removeBookmark(existing.id);
    return false; // removed
  } else {
    addBookmark(bookmark);
    return true; // added
  }
}

export function getBookmarksByMode(mode: "complete" | "para" | "surah"): Bookmark[] {
  return getBookmarks().filter((b) => b.mode === mode);
}

export function clearAllBookmarks(): void {
  localStorage.removeItem(STORAGE_KEY);
}
