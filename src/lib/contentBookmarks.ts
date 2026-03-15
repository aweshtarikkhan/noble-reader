// Generic content bookmarking system for lectures, books, seerat, etc.

export type ContentBookmarkType = "lecture" | "book-pdf" | "book-text" | "seerat" | "seerat-roman";

export interface ContentBookmark {
  id: string;
  type: ContentBookmarkType;
  contentId: string; // e.g. series id, book id, chapter id
  itemId?: string; // e.g. specific lecture id, chapter index
  title: string;
  titleUr: string;
  subtitle?: string;
  icon: string;
  createdAt: number;
  // For navigation
  navData: Record<string, string | number>;
}

const STORAGE_KEY = "content_bookmarks";

export function getContentBookmarks(): ContentBookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addContentBookmark(bookmark: Omit<ContentBookmark, "id" | "createdAt">): ContentBookmark {
  const bookmarks = getContentBookmarks();
  // Remove duplicate for same type + contentId + itemId
  const filtered = bookmarks.filter(
    (b) => !(b.type === bookmark.type && b.contentId === bookmark.contentId && b.itemId === bookmark.itemId)
  );
  const newBookmark: ContentBookmark = {
    ...bookmark,
    id: `${bookmark.type}_${bookmark.contentId}_${bookmark.itemId || "main"}_${Date.now()}`,
    createdAt: Date.now(),
  };
  filtered.unshift(newBookmark);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return newBookmark;
}

export function removeContentBookmark(id: string): void {
  const bookmarks = getContentBookmarks().filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function isContentBookmarked(type: ContentBookmarkType, contentId: string, itemId?: string): boolean {
  return getContentBookmarks().some(
    (b) => b.type === type && b.contentId === contentId && (itemId ? b.itemId === itemId : !b.itemId)
  );
}

export function toggleContentBookmark(bookmark: Omit<ContentBookmark, "id" | "createdAt">): boolean {
  const existing = getContentBookmarks().find(
    (b) => b.type === bookmark.type && b.contentId === bookmark.contentId && b.itemId === bookmark.itemId
  );
  if (existing) {
    removeContentBookmark(existing.id);
    return false;
  } else {
    addContentBookmark(bookmark);
    return true;
  }
}

export function getContentBookmarksByType(type: ContentBookmarkType): ContentBookmark[] {
  return getContentBookmarks().filter((b) => b.type === type);
}

export function clearAllContentBookmarks(): void {
  localStorage.removeItem(STORAGE_KEY);
}
