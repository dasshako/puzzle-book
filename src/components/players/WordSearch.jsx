import { useMemo, useState } from 'react';

export default function WordSearch({ puzzle, saved, onChange, onSolved, solved }) {
  const { size, grid, words } = puzzle;
  const [found, setFound] = useState(() => saved?.found || []);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [miss, setMiss] = useState(false);

  const placements = useMemo(() => {
    const map = new Map();
    for (const word of words) {
      const cells = [];
      for (let i = 0; i < word.word.length; i += 1) {
        cells.push(`${word.row + word.dr * i}-${word.col + word.dc * i}`);
      }
      map.set(word.word, cells);
    }
    return map;
  }, [words]);

  const foundCells = useMemo(() => {
    const set = new Set();
    found.forEach((word) => (placements.get(word) || []).forEach((cell) => set.add(cell)));
    return set;
  }, [found, placements]);

  const selection = useMemo(() => {
    if (!start || !end) return new Set();
    const dr = Math.sign(end.r - start.r);
    const dc = Math.sign(end.c - start.c);
    if (dr !== 0 && dc !== 0 && Math.abs(end.r - start.r) !== Math.abs(end.c - start.c)) return new Set();
    const length = Math.max(Math.abs(end.r - start.r), Math.abs(end.c - start.c)) + 1;
    const set = new Set();
    for (let i = 0; i < length; i += 1) set.add(`${start.r + dr * i}-${start.c + dc * i}`);
    return set;
  }, [start, end]);

  function pathWord(a, b) {
    const dr = Math.sign(b.r - a.r);
    const dc = Math.sign(b.c - a.c);
    if (dr !== 0 && dc !== 0 && Math.abs(b.r - a.r) !== Math.abs(b.c - a.c)) return null;
    const length = Math.max(Math.abs(b.r - a.r), Math.abs(b.c - a.c)) + 1;
    let text = '';
    for (let i = 0; i < length; i += 1) text += grid[a.r + dr * i][a.c + dc * i];
    return text;
  }

  function evaluate(a, b) {
    const text = pathWord(a, b);
    if (!text || text.length < 2) return;
    const reversed = [...text].reverse().join('');
    const hit = words.find(
      (word) => !found.includes(word.word) && (word.word === text || word.word === reversed)
    );
    if (!hit) {
      setMiss(true);
      window.setTimeout(() => setMiss(false), 500);
      return;
    }
    const next = [...found, hit.word];
    setFound(next);
    onChange({ found: next });
    if (next.length === words.length) onSolved();
  }

  function onDown(r, c) {
    if (solved) return;
    if (start && (start.r !== r || start.c !== c)) {
      evaluate(start, { r, c });
      setStart(null);
      setEnd(null);
      return;
    }
    if (start && start.r === r && start.c === c) {
      setStart(null);
      setEnd(null);
      return;
    }
    setStart({ r, c });
    setEnd({ r, c });
  }

  function onEnter(r, c) {
    if (start && !solved) setEnd({ r, c });
  }

  function onUp() {
    if (start && end && (start.r !== end.r || start.c !== end.c)) {
      evaluate(start, end);
      setStart(null);
      setEnd(null);
    }
  }

  function clearAll() {
    setFound([]);
    setStart(null);
    setEnd(null);
    onChange({ found: [] });
  }

  return (
    <div className="ws-wrap">
      <div
        className={`ws-grid${miss ? ' miss' : ''}`}
        style={{ '--n': size }}
        onPointerUp={onUp}
        onPointerLeave={() => {
          if (start && end && (start.r !== end.r || start.c !== end.c)) {
            evaluate(start, end);
            setStart(null);
            setEnd(null);
          }
        }}
      >
        {grid.map((row, r) =>
          row.map((letter, c) => {
            const key = `${r}-${c}`;
            const classes = ['ws-cell'];
            if (selection.has(key)) classes.push('sel');
            else if (foundCells.has(key)) classes.push('found');
            return (
              <div
                key={key}
                className={classes.join(' ')}
                role="gridcell"
                aria-label={letter}
                onPointerDown={(event) => {
                  event.preventDefault();
                  onDown(r, c);
                }}
                onPointerEnter={() => onEnter(r, c)}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>

      <aside className="ws-side">
        <h4>Слова</h4>
        <div className="ws-list">
          {words.map((word) => (
            <span key={word.word} className={`ws-word${found.includes(word.word) ? ' done' : ''}`}>
              {word.word.toLowerCase()}
            </span>
          ))}
        </div>
        <p className="player-hint">Тягніть від першої до останньої літери — або клікніть початок і кінець.</p>
        <div className="player-tools">
          <button type="button" className="btn small ghost" onClick={clearAll} disabled={solved}>
            Очистити
          </button>
        </div>
      </aside>
    </div>
  );
}
