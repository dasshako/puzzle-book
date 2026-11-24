import { Link } from 'react-router-dom';
import data from '../data/puzzles.json';
import { TYPES, TYPE_ORDER } from '../lib/types.js';
import { progressSummary } from '../lib/progress.js';
import { Arrow, Check, Sparkle, Squiggle } from '../components/Icons.jsx';
import BookCover from '../components/BookCover.jsx';

const puzzles = data.puzzles;

function stateLabel(entry) {
  if (entry?.solved) return 'Розв’язано';
  if (entry?.state) return 'У процесі';
  return 'Не розв’язано';
}

export default function Home() {
  const { solved, entries } = progressSummary();
  const total = puzzles.length;
  const pct = total ? Math.round((solved / total) * 100) : 0;
  const next = puzzles.find((p) => !entries[p.id]?.solved) || puzzles[0];

  return (
    <div className="page">
      <div className="shell">
        <header className="topbar">
          <Link to="/" className="brand" aria-label="Puzzle Book — на головну">
            <span className="brand-word">забава</span>
            <span className="brand-tag">puzzle book</span>
          </Link>
          <div className="topbar-right">
            <span className="topbar-note">Think. Solve. Repeat.</span>
            <Link className="topnav-link" to="/book">
              Про книжку
            </Link>
          </div>
        </header>

        <section className="hero">
          <Squiggle className="deco deco-green" color="#3F6B3F" />
          <Squiggle className="deco deco-blue" color="#8CC3D8" />
          <Sparkle className="deco deco-star" />

          <div className="hero-copy">
            <p className="eyebrow">онлайн-збірка головоломок</p>
            <h1>Puzzle Book</h1>
            <p className="tagline">
              <span>Think</span>
              <i>·</i>
              <span>Solve</span>
              <i>·</i>
              <span>Repeat</span>
            </p>
            <p className="hero-lead">
              Кросворди, філворди, судоку й кейворди — усе в одному місці. Розв’язуйте потроху, повертайтеся
              будь-коли: прогрес зберігається у вашому браузері.
            </p>

            <div className="chips">
              <span className="chip blue">3 кросворди</span>
              <span className="chip pink">4 філворди</span>
              <span className="chip lav">6 судоку</span>
              <span className="chip yellow">2 кейворди</span>
            </div>

            <div className="progress-card">
              <div className="progress-top">
                <span>Ваш прогрес</span>
                <strong>
                  {solved} / {total}
                </strong>
              </div>
              <div className="bar" aria-hidden="true">
                <i style={{ width: `${pct}%` }} />
              </div>
              <Link className="btn" to={`/puzzle/${next.id}`}>
                {solved === 0 ? 'Почати розв’язувати' : solved === total ? 'Переграти книжку' : 'Продовжити'}
                <Arrow className="btn-arrow" />
              </Link>
            </div>
          </div>

          <BookCover />
        </section>

        <main className="book">
          {TYPE_ORDER.map((type) => {
            const meta = TYPES[type];
            const list = puzzles.filter((p) => p.type === type);
            const done = list.filter((p) => entries[p.id]?.solved).length;
            return (
              <section className="section" key={type}>
                <div className="section-head">
                  <div>
                    <h2>{meta.label}</h2>
                    <p className="section-note">{meta.note}</p>
                  </div>
                  <span className="section-count">
                    {done} / {list.length}
                  </span>
                </div>

                <div className="cards">
                  {list.map((p) => {
                    const entry = entries[p.id];
                    const donePuzzle = !!entry?.solved;
                    return (
                      <Link
                        key={p.id}
                        to={`/puzzle/${p.id}`}
                        className={`pcard${donePuzzle ? ' solved' : ''}`}
                      >
                        <div className="pcard-top">
                          <span className={`badge ${meta.tone}`}>{meta.short}</span>
                          <span className="pcard-diff">{p.difficulty}</span>
                        </div>
                        <h3>{p.title}</h3>
                        <p className="pcard-meta">{p.meta}</p>
                        <span className="pcard-state">
                          {donePuzzle && <Check className="state-check" />}
                          {stateLabel(entry)}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </main>

        <footer className="footer">
          <span>Зроблено з любов’ю до головоломок · забава</span>
          <span>Think. Solve. Repeat.</span>
        </footer>
      </div>
    </div>
  );
}
