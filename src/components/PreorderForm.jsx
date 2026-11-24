import { useState } from 'react';
import { Arrow } from './Icons.jsx';
import { BOOK_PRICE, sendPreorder } from '../lib/preorder.js';

const EMPTY = { name: '', contact: '', delivery: '', qty: '1', comment: '' };

function validate(values) {
  if (values.name.trim().length < 2) return 'Вкажіть ім’я та прізвище.';
  const digits = values.contact.replace(/\D/g, '');
  if (!values.contact.includes('@') && digits.length < 9) return 'Вкажіть телефон або email для зв’язку.';
  if (values.delivery.trim().length < 3) return 'Вкажіть місто та відділення Нової пошти.';
  return '';
}

export default function PreorderForm() {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const qty = Number(values.qty);
  const total = qty * BOOK_PRICE;

  function update(field) {
    return (event) => setValues((current) => ({ ...current, [field]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const problem = validate(values);
    if (problem) {
      setError(problem);
      return;
    }

    setError('');
    const placed = { ...values, name: values.name.trim(), qty, total };

    try {
      sendPreorder(placed);
      setOrder(placed);
      setValues(EMPTY);
    } catch {
      setError('Приймання передзамовлень ще не налаштоване — напишіть нам в Instagram.');
    }
  }

  if (order) {
    const firstName = order.name.split(' ')[0];
    return (
      <div className="preorder-done">
        <span className="chip green">передзамовлення прийнято</span>
        <h3>Дякуємо, {firstName}!</h3>
        <p>
          Ми зв’яжемося з вами ({order.contact}), щоб підтвердити замовлення та надіслати реквізити для оплати.
        </p>
        <p className="preorder-summary">
          {order.qty} × Puzzle Book · {order.total} грн · {order.delivery}
        </p>
        <button type="button" className="btn ghost" onClick={() => setOrder(null)}>
          Оформити ще одне
        </button>
      </div>
    );
  }

  return (
    <form className="preorder-form" onSubmit={handleSubmit} noValidate>
      <label>
        Ім’я та прізвище
        <input name="name" value={values.name} onChange={update('name')} autoComplete="name" />
      </label>

      <label>
        Телефон або email
        <input
          name="contact"
          value={values.contact}
          onChange={update('contact')}
          autoComplete="tel"
          placeholder="+380 __ ___ __ __"
        />
      </label>

      <label>
        Місто та відділення Нової пошти
        <input name="delivery" value={values.delivery} onChange={update('delivery')} />
      </label>

      <label>
        Кількість
        <select name="qty" value={values.qty} onChange={update('qty')}>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <label className="wide">
        Коментар (необов’язково)
        <textarea name="comment" value={values.comment} onChange={update('comment')} />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="preorder-submit">
        <span className="preorder-total">
          <strong>{total} грн</strong>
          <span>
            за {qty} {qty === 1 ? 'примірник' : 'примірники'}
          </span>
        </span>
        <button className="btn" type="submit">
          Підтвердити передзамовлення <Arrow className="btn-arrow" />
        </button>
      </div>

      <p className="form-note">
        Оплата — після підтвердження. Відправка з 7 грудня. Або напишіть в{' '}
        <a href="https://www.instagram.com/itszabava/" target="_blank" rel="noreferrer">
          Instagram
        </a>
        .
      </p>
    </form>
  );
}
