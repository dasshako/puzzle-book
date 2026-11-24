export const BOOK_PRICE = 376;
export const BOOK_OLD_PRICE = 470;

// Куди надходять передзамовлення. Сервіс formsubmit.co не потребує акаунта чи ключа:
// перший лист містить одноразове підтвердження адреси.
export const PREORDER_EMAIL = import.meta.env.VITE_PREORDER_EMAIL || 'dasha.kozlovska.00@gmail.com';

export function sendPreorder(order) {
  if (!PREORDER_EMAIL) throw new Error('not-configured');

  const body = new URLSearchParams({
    _subject: `Передзамовлення Puzzle Book — ${order.name}`,
    _template: 'table',
    _captcha: 'false',
    'Ім’я': order.name,
    'Контакт': order.contact,
    'Доставка': order.delivery,
    'Кількість': String(order.qty),
    'Сума': `${order.total} грн`,
    'Коментар': order.comment || '—',
  });

  // Не чекаємо на відповідь: на перше замовлення сервіс надсилає лист
  // підтвердження адреси й відповідає дуже повільно, тож запит іде у фоні.
  fetch(`https://formsubmit.co/ajax/${PREORDER_EMAIL}`, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    keepalive: true,
  }).catch(() => {});
}
