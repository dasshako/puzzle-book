export const BOOK_PRICE = 376;
export const BOOK_OLD_PRICE = 470;

const STORAGE_KEY = 'puzzle-book:preorders';

export function savePreorder(order) {
  const record = {
    ...order,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...list, record]));
  } catch {
    // localStorage can be unavailable (private mode) — the order still confirms in the UI
  }

  return record;
}
