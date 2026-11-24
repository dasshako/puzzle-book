export const BOOK_PRICE = 376;
export const BOOK_OLD_PRICE = 470;

// Куди надходять передзамовлення. Сервіс formsubmit.co не потребує акаунта чи ключа:
// перший лист містить одноразове підтвердження адреси.
export const PREORDER_EMAIL = import.meta.env.VITE_PREORDER_EMAIL || '';

export async function sendPreorder(order) {
  if (!PREORDER_EMAIL) throw new Error('not-configured');

  const response = await fetch(`https://formsubmit.co/ajax/${PREORDER_EMAIL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: `Передзамовлення Puzzle Book — ${order.name}`,
      _template: 'table',
      _captcha: 'false',
      'Ім’я': order.name,
      'Контакт': order.contact,
      'Доставка': order.delivery,
      'Кількість': order.qty,
      'Сума': `${order.total} грн`,
      'Коментар': order.comment || '—',
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success === 'false') throw new Error('send-failed');

  return result;
}
