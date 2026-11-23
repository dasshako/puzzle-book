import { useMemo, useRef, useState } from 'react';

const LETTER = /^[А-ЯІЇЄҐ]$/;

export default function Crossword({ puzzle, saved, onChange, onSolved, solved }) {
  const { rows, cols, layout, entries } = puzzle;
  const [values, setValues] = useState(() => saved?.values || {});
  const [active, setActive] = useState(() => ({ r: entries[0].row, c: entries[0].col }));
  const [dir, setDir] = useState(entries[0].dir);
  const [wrong, setWrong] = useState({});
  const refs = useRef({});
  const locked = !!solved;

  const activeEntry = useMemo(() => {
    if (!active) return null;
    const cell = layout[active.r]?.[active.c];
    if (!cell) return null;
    const id = cell[dir] ?? cell[dir === 'across' ? 'down' : 'across'];
    return id == null ? null : entries[id];
  }, [active, dir, layout, entries]);

  function entryCells(entry) {
    const cells = [];
    for (let i = 0; i < entry.len; i += 1) {
      cells.push(
        entry.dir === 'across' ? { r: entry.row, c: entry.col + i } : { r: entry.row + i, c: entry.col }
      );
    }
    return cells;
  }

  function entryAt(r, c, d = dir) {
    const cell = layout[r]?.[c];
    if (!cell) return null;
    const id = cell[d] ?? cell[d === 'across' ? 'down' : 'across'];
    return id == null ? null : entries[id];
  }

  function focusCell({ r, c }) {
    setActive({ r, c });
    requestAnimationFrame(() => refs.current[`${r}-${c}`]?.focus());
  }

  function focusEntry(entry) {
    setDir(entry.dir);
    const cells = entryCells(entry);
    const target = cells.find((cell) => !values[`${cell.r}-${cell.c}`]) || cells[0];
    setActive({ r: entry.row, c: entry.col });
    requestAnimationFrame(() => refs.current[`${target.r}-${target.c}`]?.focus());
  }

  function isComplete(next) {
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const cell = layout[r][c];
        if (cell && next[`${r}-${c}`] !== cell.a) return false;
      }
    }
    return true;
  }

  function advance(r, c, next) {
    const entry = entryAt(r, c);
    if (!entry) return;
    const cells = entryCells(entry);
    const idx = cells.findIndex((cell) => cell.r === r && cell.c === c);
    for (let i = idx + 1; i < cells.length; i += 1) {
      if (!next[`${cells[i].r}-${cells[i].c}`]) return focusCell(cells[i]);
    }
    for (let i = 0; i < cells.length; i += 1) {
      if (!next[`${cells[i].r}-${cells[i].c}`]) return focusCell(cells[i]);
    }
    if (idx + 1 < cells.length) focusCell(cells[idx + 1]);
  }

  function handleInput(r, c, raw, event) {
    if (locked) return;
    const ch = raw.slice(-1).toUpperCase();
    if (ch && !LETTER.test(ch)) {
      event.target.value = values[`${r}-${c}`] || '';
      return;
    }
    const next = { ...values };
    if (ch) next[`${r}-${c}`] = ch;
    else delete next[`${r}-${c}`];
    setValues(next);
    onChange({ values: next });
    if (wrong[`${r}-${c}`]) {
      setWrong((w) => {
        const copy = { ...w };
        delete copy[`${r}-${c}`];
        return copy;
      });
    }
    if (ch) {
      if (isComplete(next)) onSolved();
      else advance(r, c, next);
    }
  }

  function handleKey(event, r, c) {
    if (locked) return;
    const key = `${r}-${c}`;
    if (event.key === 'Backspace' && !values[key]) {
      const entry = entryAt(r, c);
      if (!entry) return;
      const cells = entryCells(entry);
      const idx = cells.findIndex((cell) => cell.r === r && cell.c === c);
      if (idx > 0) {
        const prev = cells[idx - 1];
        const next = { ...values };
        delete next[`${prev.r}-${prev.c}`];
        setValues(next);
        onChange({ values: next });
        focusCell(prev);
      }
      event.preventDefault();
      return;
    }
    const moves = {
      ArrowRight: { r: 0, c: 1 },
      ArrowLeft: { r: 0, c: -1 },
      ArrowDown: { r: 1, c: 0 },
      ArrowUp: { r: -1, c: 0 },
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      let nr = r + move.r;
      let nc = c + move.c;
      while (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !layout[nr][nc]) {
        nr += move.r;
        nc += move.c;
      }
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        setDir(move.c !== 0 ? 'across' : 'down');
        focusCell({ r: nr, c: nc });
      }
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      const list = entries;
      const currentIdx = activeEntry ? list.indexOf(activeEntry) : -1;
      focusEntry(list[(currentIdx + 1) % list.length]);
    }
  }

  function check() {
    const marks = {};
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const cell = layout[r][c];
        const value = values[`${r}-${c}`];
        if (cell && value && value !== cell.a) marks[`${r}-${c}`] = true;
      }
    }
    setWrong(marks);
    if (isComplete(values)) onSolved();
  }

  function clearAll() {
    setValues({});
    setWrong({});
    onChange({ values: {} });
  }

  const entryDone = (entry) => entryCells(entry).every((cell) => values[`${cell.r}-${cell.c}`] === layout[cell.r][cell.c].a);

  return (
    <div className="cw-wrap">
      <div className="cw-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((__, c) => {
            const cell = layout[r][c];
            const key = `${r}-${c}`;
            if (!cell) return <div className="cw-cell block" key={key} />;
            const inEntry = activeEntry
              ? activeEntry.dir === 'across'
                ? r === activeEntry.row && c >= activeEntry.col && c < activeEntry.col + activeEntry.len
                : c === activeEntry.col && r >= activeEntry.row && r < activeEntry.row + activeEntry.len
              : false;
            const classes = ['cw-cell'];
            if (inEntry) classes.push('entry');
            if (active && active.r === r && active.c === c) classes.push('active');
            if (wrong[key]) classes.push('wrong');
            if (locked) classes.push('done');
            return (
              <div
                className={classes.join(' ')}
                key={key}
                onClick={() => {
                  if (active && active.r === r && active.c === c && cell.across != null && cell.down != null) {
                    setDir((d) => (d === 'across' ? 'down' : 'across'));
                  } else {
                    setActive({ r, c });
                  }
                }}
              >
                {cell.n > 0 && <span className="cw-num">{cell.n}</span>}
                <input
                  ref={(el) => {
                    refs.current[key] = el;
                  }}
                  value={values[key] || ''}
                  onChange={(event) => handleInput(r, c, event.target.value, event)}
                  onKeyDown={(event) => handleKey(event, r, c)}
                  onFocus={() => setActive({ r, c })}
                  readOnly={locked}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label={`Клітинка ${r + 1}, ${c + 1}`}
                />
              </div>
            );
          })
        )}
      </div>

      <aside className="clues">
        {['across', 'down'].map((direction) => (
          <div className="clue-group" key={direction}>
            <h4>{direction === 'across' ? 'По горизонталі' : 'По вертикалі'}</h4>
            {entries
              .filter((entry) => entry.dir === direction)
              .sort((a, b) => a.number - b.number)
              .map((entry) => (
                <button
                  type="button"
                  key={entry.id}
                  className={`clue${activeEntry === entry ? ' active' : ''}${entryDone(entry) ? ' done' : ''}`}
                  onClick={() => focusEntry(entry)}
                >
                  <b>{entry.number}</b>
                  <span>{entry.clue}</span>
                </button>
              ))}
          </div>
        ))}

        <div className="player-tools">
          <button type="button" className="btn small" onClick={check} disabled={locked}>
            Перевірити
          </button>
          <button type="button" className="btn small ghost" onClick={clearAll} disabled={locked}>
            Очистити
          </button>
        </div>
      </aside>
    </div>
  );
}
