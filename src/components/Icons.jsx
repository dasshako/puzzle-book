export function Squiggle({ className = '', color = '#3F6B3F' }) {
  return (
    <svg className={className} viewBox="0 0 120 40" fill="none" aria-hidden="true">
      <path
        d="M4 26c10-16 20-16 28 0s18 16 28 0 18-16 28 0 14 10 24 2"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Sparkle({ className = '', color = '#F7E27C' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M20 2c1.8 8.2 4 12.2 9 14.5 3.2 1.5 6.4 2.3 9 3.5-6 1.8-10 3.8-12.4 8-1.8 3-3.2 6-5.6 10-1.6-5.4-3.6-9.4-7.6-12-2.6-1.7-5.6-2.9-9.4-4.2 6-1.8 10-4 12.4-8.2 1.8-3.2 3.2-6.6 4.6-11.6z"
        fill={color}
        stroke="#17140F"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Pencil({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M31 7l10 10-24 24H7V31L31 7z"
        fill="#C3E2ED"
        stroke="#17140F"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M27 11l10 10" stroke="#17140F" strokeWidth="2.5" />
      <path d="M7 41l6-16 10 10-16 6z" fill="#F7E27C" stroke="#17140F" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export function Arrow({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12.5l5.2 5.2L20 6.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
