export function BurgerIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.5 4.4 2.8 11.2c-1 .4-1 1-.2 1.3l4.8 1.5 1.8 5.5c.3.8.2 1.1.9 1.1.4 0 .6-.2.9-.5l2.6-2.5 5.4 4c1 .6 1.7.3 2-.9l2.4-14.2c.3-1.3-.5-1.9-1.9-1.4Z"
      />
    </svg>
  );
}

export function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path
        d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
