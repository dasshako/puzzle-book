import { useMemo, useRef, useState } from 'react';


export default function Sudoku({ puzzle, saved, onChange, onSolved, solved }) {
  const initial = puzzle.puzzle;
  const solution = puzzle.solution;
  const [values, setValues] = useState(() => (saved?.values ? saved.values.map((row) => [...row]) : initial.map((row) => [...row])));
  const [selected, setSelected] = useState(null);
  const [wrong, setWrong] = useState({});
  const boardRef = useRef(null);

  const conflicts = useMemo(() => {
    const set = new Set();
    const mark = (cells) => {
      const byValue = new Map();
      for (const { r, c } of cells) {
        const value = values[r][c];
        if (!value) continue;
        if (!byValue.has(value)) byValue.set(value, []);
        byValue.get(value).push(`${r}-${c}`);
      }
      for (const list of byValue.values()) {
        if (list.length > 1) list.forEach((key) => set.add(key));
      }
    };
    for (let i = 0; i < 9; i += 1) {
      mark(Array.from({ length: 9 }, (_, j) => ({ r: i, c: j })));
      mark(Array.from({ length: 9 }, (_, j) => ({ r: j, c: i })));
      const br = Math.floor(i / 3) * 3;
      const bc = (i % 3) * 3;
      const box = [];
      for (let a = 0; a < 3; a += 1) for (let b = 0; b < 3; b += 1) box.push({ r: br + a, c: bc + b });
      mark(box);
    }
    return set;
  }, [values]);

  function isSolved(next) {
    for (let r = 0; r < 9; r += 1) {
      for (let c = 0; c < 9; c += 1) {
        if (next[r][c] !== solution[r][c]) return false;
      }
    }
    return true;
  }

  function setValue(r, c, value) {
    if (solved || initial[r][c]) return;
    const next = values.map((row) => [...row]);
    next[r][c] = value;
    setValues(next);
    onChange({ values: next });
    if (wrong[`${r}-${c}`]) {
      setWrong((w) => {
        const copy = { ...w };
        delete copy[`${r}-${c}`];
        return copy;
      });
    }
    if (value && isSolved(next)) onSolved();
  }

  function onKeyDown(event) {
    if (!selected || solved) return;
    if (/^[1-9]$/.test(event.key)) {
      event.preventDefault();
      setValue(selected.r, selected.c, Number(event.key));
      return;
    }
    if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') {
      event.preventDefault();
      setValue(selected.r, selected.c, 0);
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
      const r = Math.min(8, Math.max(0, selected.r + move.r));
      const c = Math.min(8, Math.max(0, selected.c + move.c));
      setSelected({ r, c });
    }
  }

  function check() {
    const marks = {};
    for (let r = 0; r < 9; r += 1) {
      for (let c = 0; c < 9; c += 1) {
        if (values[r][c] && values[r][c] !== solution[r][c]) marks[`${r}-${c}`] = true;
      }
    }
    setWrong(marks);
    if (isSolved(values)) onSolved();
  }

  function clearAll() {
    const next = initial.map((row) => [...row]);
    setValues(next);
    setWrong({});
    onChange({ values: next });
  }

  const remaining = useMemo(() => {
    const counts = Array(10).fill(9);
    for (let r = 0; r < 9; r += 1) {
      for (let c = 0; c < 9; c += 1) {
        if (values[r][c]) counts[values[r][c]] -= 1;
      }
    }
    return counts;
  }, [values]);

  return (
    <div className="sd-wrap">
      <div
        className="sd-grid"
        ref={boardRef}
        tabIndex={0}
        role="grid"
        aria-label="Сітка судоку"
        onKeyDown={onKeyDown}
      >
        {values.map((row, r) =>
          row.map((value, c) => {
            const key = `${r}-${c}`;
            const given = initial[r][c] !== 0;
            const classes = ['sd-cell'];
            if (given) classes.push('given');
            else if (value) classes.push('user');
            if (c === 2 || c === 5) classes.push('br');
            if (r === 2 || r === 5) classes.push('bb');
            if (selected) {
              const samePeer =
                selected.r === r ||
                selected.c === c ||
                (Math.floor(selected.r / 3) === Math.floor(r / 3) && Math.floor(selected.c / 3) === Math.floor(c / 3));
              if (samePeer) classes.push('peer');
              if (selected.r === r && selected.c === c) classes.push('selected');
            }
            if (conflicts.has(key)) classes.push('conflict');
            if (wrong[key]) classes.push('wrong');
            if (solved) classes.push('done');
            return (
              <div
                key={key}
                className={classes.join(' ')}
                role="gridcell"
                aria-label={value ? String(value) : 'порожньо'}
                onClick={() => {
                  setSelected({ r, c });
                  boardRef.current?.focus();
                }}
              >
                {value || ''}
              </div>
            );
          })
        )}
      </div>

      <aside className="sd-side">
        <div className="sd-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => selected && setValue(selected.r, selected.c, n)}
              disabled={solved || !selected || remaining[n] === 0}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            className="sd-erase"
            onClick={() => selected && setValue(selected.r, selected.c, 0)}
            disabled={solved || !selected}
          >
            ×
          </button>
        </div>
        <p className="player-hint">Виберіть клітинку й натисніть цифру. Клавіатура теж працює.</p>
        <div className="player-tools">
          <button type="button" className="btn small" onClick={check} disabled={solved}>
            Перевірити
          </button>
          <button type="button" className="btn small ghost" onClick={clearAll} disabled={solved}>
            Очистити
          </button>
        </div>
      </aside>
    </div>
  );
}
