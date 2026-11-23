import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import data from '../data/puzzles.json';
import { TYPES } from '../lib/types.js';
import { getProgress, markSolved, resetPuzzle, saveState } from '../lib/progress.js';
import Crossword from '../components/players/Crossword.jsx';
import WordSearch from '../components/players/WordSearch.jsx';
import Sudoku from '../components/players/Sudoku.jsx';
import Codeword from '../components/players/Codeword.jsx';
import { Arrow, Check } from '../components/Icons.jsx';

const PLAYERS = { crossword: Crossword, filword: WordSearch, sudoku: Sudoku, codeword: Codeword };

export default function PuzzlePage() {
  const { id } = useParams();
  return <PuzzleView key={id} id={id} />;
}

function PuzzleView({ id }) {
  const index = data.puzzles.findIndex((p) => p.id === id);
  const puzzle = data.puzzles[index];

  const [solved, setSolved] = useState(() => !!getProgress(id)?.solved);
  const [saved, setSaved] = useState(() => getProgress(id)?.state || null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (puzzle) document.title = `${puzzle.title} — Puzzle Book`;
    return () => {
      document.title = 'Puzzle Book — онлайн-збірка головоломок';
    };
  }, [puzzle]);

  if (!puzzle) {
    return (
      <div className="page">
        <div className="shell">
          <div className="missing">
            <h1>Такої головоломки немає</h1>
            <p>Можливо, посилання застаріло.</p>
            <Link className="btn" to="/">
              До книжки <Arrow className="btn-arrow" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const meta = TYPES[puzzle.type];
  const Player = PLAYERS[puzzle.type];
  const next = data.puzzles[(index + 1) % data.puzzles.length];

  const handleSolved = () => {
    markSolved(puzzle.id);
    setSolved(true);
  };

  const handleReset = () => {
    resetPuzzle(puzzle.id);
    setSaved(null);
    setSolved(false);
    setResetKey((key) => key + 1);
  };

  return (
    <div className="page">
      <div className="shell puzzle-shell">
        <div className="puzzle-top">
          <Link className="backlink" to="/">
            <span aria-hidden="true">←</span> До книжки
          </Link>
          <span className="topbar-note">Think. Solve. Repeat.</span>
        </div>

        <header className="puzzle-head">
          <div>
            <div className="puzzle-eyebrow">
              <span className={`badge ${meta.tone}`}>{meta.short}</span>
              <span className="puzzle-diff">{puzzle.difficulty}</span>
              <span className="puzzle-meta">{puzzle.meta}</span>
            </div>
            <h1>{puzzle.title}</h1>
          </div>
          <div className="puzzle-tools">
            {solved ? (
              <span className="solved-chip">
                <Check className="state-check" /> Розв’язано
              </span>
            ) : (
              <button type="button" className="btn small ghost" onClick={handleReset}>
                Почати заново
              </button>
            )}
          </div>
        </header>

        {solved && (
          <div className="solved-banner">
            <span>Готово! Головоломку розв’язано.</span>
            <Link className="btn small" to={`/puzzle/${next.id}`}>
              Наступна: {next.title} <Arrow className="btn-arrow" />
            </Link>
          </div>
        )}

        <section className="player">
          <Player
            key={resetKey}
            puzzle={puzzle}
            saved={saved}
            solved={solved}
            onChange={(state) => saveState(puzzle.id, state)}
            onSolved={handleSolved}
          />
        </section>

        <nav className="puzzle-nav">
          <Link className="btn small ghost" to="/">
            ← Уся книжка
          </Link>
          <Link className="btn small ghost" to={`/puzzle/${next.id}`}>
            {next.title} <Arrow className="btn-arrow" />
          </Link>
        </nav>
      </div>
    </div>
  );
}
