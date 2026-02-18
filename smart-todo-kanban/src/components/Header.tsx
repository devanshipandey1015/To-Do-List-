import type { Theme } from '../lib/storage';

export interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  theme: Theme;
  onThemeToggle: () => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  theme,
  onThemeToggle,
}: HeaderProps) {
  return (
    <header className="app-header">
      <h1 className="app-title">Smart Todo Kanban</h1>
      <div className="header-actions">
        <div className="search-wrap">
          <span className="search-icon" aria-hidden>
            ⌕
          </span>
          <input
            type="search"
            className="search-input"
            placeholder="Search tasks…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search tasks by title or description"
          />
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={onThemeToggle}
          aria-label={
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
