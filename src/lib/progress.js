const KEY = 'puzzle-book:progress:v1';

function readAll() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(all) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable — puzzles still playable for this visit */
  }
}

export function getProgress(id) {
  return readAll()[id] || null;
}

export function saveState(id, state) {
  const all = readAll();
  all[id] = { ...(all[id] || {}), state, updatedAt: Date.now() };
  writeAll(all);
}

export function markSolved(id) {
  const all = readAll();
  all[id] = { ...(all[id] || {}), solved: true, updatedAt: Date.now() };
  writeAll(all);
}

export function resetPuzzle(id) {
  const all = readAll();
  delete all[id];
  writeAll(all);
}

export function progressSummary() {
  const all = readAll();
  const solved = Object.values(all).filter((entry) => entry.solved).length;
  return { solved, entries: all };
}
