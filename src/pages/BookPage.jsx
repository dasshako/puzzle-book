import { Link } from 'react-router-dom';
import { TYPES } from '../lib/types.js';
import { BOOK_OLD_PRICE, BOOK_PRICE } from '../lib/preorder.js';
import { Arrow, Sparkle } from '../components/Icons.jsx';
import BookCover from '../components/BookCover.jsx';
import PreorderForm from '../components/PreorderForm.jsx';

const INSIDE = [
  { type: 'crossword', count: 18, label: 'кросвордів' },
  { type: 'filword', count: 13, label: 'філвордів' },
  { type: 'sudoku', count: 26, label: 'судоку' },
  { type: 'codeword', count: 6, label: 'кейвордів' },
];

const SPECS = [
  ['Кількість сторінок', '68'],
  ['Обкладинка', 'м’яка'],
  ['Мова', 'українська'],
  ['Розмір', 'А5'],
];

export default function BookPage() {
  return (
    <div className="page">
      <div className="shell">
        <header className="topbar">
          <Link to="/" className="brand" aria-label="Puzzle Book — на головну">
            <span className="brand-word">забава</span>
            <span className="brand-tag">puzzle book</span>
          </Link>
          <nav className="topnav" aria-label="Розділи">
            <Link to="/" className="topnav-link">
              Головоломки
            </Link>
            <Link to="/book" className="topnav-link is-current" aria-current="page">
              Про книжку
            </Link>
          </nav>
        </header>

        <section className="book-hero">
          <BookCover />

          <div className="book-info">
            <p className="eyebrow">друкована збірка</p>
            <h1>Збірка головоломок Puzzle Book</h1>
            <p className="tagline">
              <span>Think</span>
              <i>·</i>
              <span>Solve</span>
              <i>·</i>
              <span>Repeat</span>
              <Sparkle className="tagline-star" />
            </p>

            <div className="price-row">
              <strong>{BOOK_PRICE} грн</strong>
              <s>{BOOK_OLD_PRICE} грн</s>
              <span className="chip pink">−20% на передзамовлення</span>
            </div>

            <p className="book-lead">
              Всередині — кросворди, філворди, судоку й кейворди, які допомагають потренувати увагу й логіку,
              знизити рівень стресу та отримати задоволення від неспішного розв’язування.
            </p>

            <ul className="book-stats">
              <li className="chip blue">18 кросвордів</li>
              <li className="chip pink">13 філвордів</li>
              <li className="chip lav">26 судоку</li>
              <li className="chip yellow">6 кейвордів</li>
              <li className="chip green">~18 годин забави</li>
            </ul>

            <div className="book-actions">
              <a className="btn" href="#preorder">
                Передзамовити <Arrow className="btn-arrow" />
              </a>
              <Link className="btn ghost" to="/">
                Спробувати онлайн
              </Link>
            </div>

            <p className="book-note">Відправка передзамовлень планується з 7 грудня.</p>

            <dl className="specs">
              {SPECS.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <h2>Що всередині</h2>
              <p className="section-note">Чотири типи головоломок — від легкої розминки до справжнього виклику.</p>
            </div>
          </div>

          <div className="cards">
            {INSIDE.map(({ type, count, label }) => {
              const meta = TYPES[type];
              return (
                <div className="pcard inside-card" key={type}>
                  <div className="pcard-top">
                    <span className={`badge ${meta.tone}`}>{meta.short}</span>
                  </div>
                  <h3>
                    <span className="inside-count">{count}</span> {label}
                  </h3>
                  <p className="pcard-meta">{meta.note}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="section preorder" id="preorder">
          <div className="section-head">
            <div>
              <h2>Передзамовити</h2>
              <p className="section-note">Залиште контакти — підтвердимо замовлення та надішлемо реквізити для оплати.</p>
            </div>
          </div>

          <div className="preorder-card">
            <PreorderForm />
          </div>
        </section>

        <section className="book-cta">
          <div>
            <h2>Спробуйте онлайн</h2>
            <p>15 головоломок уже доступні у браузері — безкоштовно, без реєстрації.</p>
          </div>
          <Link className="btn" to="/">
            До головоломок <Arrow className="btn-arrow" />
          </Link>
        </section>
      </div>

      <footer className="footer shell">
        <span>Зроблено з любов’ю до головоломок · забава</span>
        <span>Think. Solve. Repeat.</span>
      </footer>
    </div>
  );
}
