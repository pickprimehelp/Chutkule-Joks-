import { useEffect, useState } from 'react';
import { ThemeMode } from '../types';

const THEME_STORAGE_KEY = 'chutkule_theme_mode_v1';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved && ['dark', 'light', 'amoled'].includes(saved)) {
        return saved;
      }
      return 'dark'; // default user-friendly dark mode
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.remove('dark', 'light', 'amoled', 'bg-slate-900', 'bg-slate-50', 'bg-black');
    body.classList.remove('bg-slate-900', 'bg-slate-50', 'bg-black', 'text-slate-100', 'text-slate-900', 'text-neutral-100');

    if (theme === 'dark') {
      root.classList.add('dark', 'bg-slate-900');
      body.classList.add('bg-slate-900', 'text-slate-100');
    } else if (theme === 'amoled') {
      root.classList.add('dark', 'amoled', 'bg-black');
      body.classList.add('bg-black', 'text-neutral-100');
    } else {
      root.classList.add('light', 'bg-slate-50');
      body.classList.add('bg-slate-50', 'text-slate-900');
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const cycleTheme = () => {
    setTheme((current) => {
      if (current === 'dark') return 'amoled';
      if (current === 'amoled') return 'light';
      return 'dark';
    });
  };

  return {
    theme,
    setTheme,
    cycleTheme,
    isDark: theme === 'dark' || theme === 'amoled',
    isAmoled: theme === 'amoled',
  };
}
