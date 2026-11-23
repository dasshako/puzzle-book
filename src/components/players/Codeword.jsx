import { useMemo, useRef, useState } from 'react';

const LETTER = /^[А-ЯІЇЄҐ]$/;

export default function Codeword({ puzzle, saved, onChange, onSolved, solved }) {
  const { rows, cols, layout, key } = puzzle;

  const givenMapping = useMemo(() => {
    const map = {};
    layout.forEach((row) =>
      row.forEach((cell) => {
        if (cell && cell.given) map[cell.n] = cell.given;
      })
    );
    return map;
  }, [layout]);

  const numbers = useMemo(() => {
    const set = new Set();
    layout.forEach((row) =>
      row.forEach((cell) => {
        if (cell) set.add(cell.n);
      })
    );
    return [...set].sort((a, b) => a - b);
  }, [layout]);

  const [mapping, setMapping] = useState(() => ({ ...(saved?.mapping || {}), ...givenMapping }));
  const [active, setActive] = useState(null);
  const [wrong, setWrong] = useState({});
  const inputs = useRef({});

  function isComplete(next) {
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const cell = layout[r][c];
        if (cell && next[cell.n] !== key[cell.n]) return false;
      }
    }
    return true;
  }

  function setLetter(n, raw, event) {
    if (solved || givenMapping[n]) return;
    const letter = raw.slice(-1).toUpperCase();
    if (letter && !LETTER.test(letter)) {
      if (event) event.target.value = mapping[n] || '';
      return;
    }
    const next = { ...mapping };
    if (!letter) {
      delete next[n];
    } else {
      for (const other of Object.keys(next)) {
        if (Number(other) !== n && next[other] === letter) delete next[other];
      }
      next[n] = letter;
    }
    setMapping(next);
    onChange({ mapping: next });
    if (wrong[n]) {
      setWrong((w) => {
        const copy = { ...w };
        delete copy[n];
        return copy;
      });
    }
    if (letter) {
      if (isComplete(next)) {
        onSolved();
        return;
      }
      const nextEmpty = numbers.find((num) => !next[num] && !givenMapping[num]);
      if (nextEmpty) requestAnimationFrame(() => inputs.current[nextEmpty]?.focus());
    }
  }

  function check() {
    const marks = {};
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const cell = layout[r][c];
        if (cell && mapping[cell.n] && mapping[cell.n] !== key[cell.n]) marks[cell.n] = true;
      }
    }
    setWrong(marks);
    if (isComplete(mapping)) onSolved();
  }

  function clearAll() {
    setMapping({ ...givenMapping });
    setWrong({});
    onChange({ mapping: { ...givenMapping } });
  }

  return (
    <div className="cw2-wrap">
      <div className="cw2-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {layout.map((row, r) =>
          row.map((cell, c) => {
            const cellKey = `${r}-${c}`;
            if (!cell) return <div className="cw2-cell block" key={cellKey} />;
            const letter = cell.given || mapping[cell.n] || '';
            const classes = ['cw2-cell'];
            if (cell.given) classes.push('given');
            if (active === cell.n) classes.push('active');
            if (wrong[cell.n]) classes.push('wrong');
            if (solved) classes.push('done');
            return (
              <div
                key={cellKey}
                className={classes.join(' ')}
                onClick={() => {
                  setActive(cell.n);
                  inputs.current[cell.n]?.focus();
                }}
                role="gridcell"
                aria-label={`Номер ${cell.n}${letter ? `, літера ${letter}` : ''}`}
              >
                <span className="cw2-num">{cell.n}</span>
                <span className="cw2-letter">{letter}</span>
              </div>
            );
          })
        )}
      </div>

      <aside className="cw2-side">
        <h4>Ключ літер</h4>
        <div className="cw2-key">
          {numbers.map((n) => (
            <label key={n} className={`key-box${active === n ? ' active' : ''}${givenMapping[n] ? ' given' : ''}`}>
              <span>{n}</span>
              <input
                ref={(el) => {
                  inputs.current[n] = el;
                }}
                value={givenMapping[n] || mapping[n] || ''}
                onChange={(event) => setLetter(n, event.target.value, event)}
                onFocus={() => setActive(n)}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && !mapping[n] && !givenMapping[n]) {
                    const idx = numbers.indexOf(n);
                    if (idx > 0) {
                      event.preventDefault();
                      inputs.current[numbers[idx - 1]]?.focus();
                    }
                  }
                }}
                readOnly={!!givenMapping[n] || solved}
                autoComplete="off"
                spellCheck={false}
                maxLength={1}
                aria-label={`Літера для номера ${n}`}
              />
            </label>
          ))}
        </div>
        <p className="player-hint">Однакові цифри — однакові літери. Кілька літер уже відкрито.</p>
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
