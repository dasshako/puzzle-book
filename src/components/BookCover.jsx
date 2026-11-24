import { Pencil, Squiggle, Sparkle } from './Icons.jsx';

const WORD = [
  ['P', '#C3E2ED'],
  ['U', '#F7E27C'],
  ['Z', '#F7C9C3'],
  ['Z', '#CFE3C4'],
  ['L', '#DCC9F2'],
  ['E', '#F7E27C'],
];

const WORD_TWO = [
  ['B', '#C3E2ED'],
  ['O', '#F7C9C3'],
  ['O', '#CFE3C4'],
  ['K', '#DCC9F2'],
];

export default function BookCover() {
  return (
    <div className="cover-wrap">
      <div className="cover-badge">онлайн</div>
      <div className="cover">
        <div className="cover-top">
          <span>забава</span>
          <span className="cover-top-dot" />
        </div>

        <div className="cover-middle">
          <div className="cover-title" aria-label="Puzzle Book">
            <span className="cover-line">
              {WORD.map(([letter, color], i) => (
                <span key={i} style={{ color }}>
                  {letter}
                </span>
              ))}
            </span>
            <span className="cover-line">
              {WORD_TWO.map(([letter, color], i) => (
                <span key={i} style={{ color }}>
                  {letter}
                </span>
              ))}
            </span>
          </div>
          <div className="cover-sub">
            <span>кросворди</span>
            <span>філворди</span>
            <span>судоку</span>
            <span>кейворди</span>
          </div>
        </div>

        <div className="cover-bottom">
          <span className="cover-note">Think. Solve. Repeat.</span>
          <Pencil className="cover-pencil" />
        </div>

        <Sparkle className="cover-sparkle" />
        <Squiggle className="cover-squiggle" color="#F7E27C" />
      </div>
    </div>
  );
}
