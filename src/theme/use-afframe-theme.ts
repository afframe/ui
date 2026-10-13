'use client';
import { useSyncExternalStore } from 'react';

/** Value of the `data-afframe-theme` attribute the consumer sets on `<html>`. */
export type AfframeTheme = 'light' | 'dark' | 'system';
/** The colour scheme the page shows: `system` resolved to light or dark. */
export type ColorScheme = 'light' | 'dark';
/** The Carbon theme for a colour scheme. */
export type AfframeCarbonTheme = 'white' | 'g100';

const darkQuery = '(prefers-color-scheme: dark)';

// Follows `data-afframe-theme` on <html>; `system` follows the media query.
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-afframe-theme'],
  });
  const media = window.matchMedia(darkQuery);
  media.addEventListener('change', onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener('change', onChange);
  };
}

function getSnapshot(): ColorScheme {
  const theme = document.documentElement.dataset.afframeTheme;
  if (theme === 'dark') return 'dark';
  if (theme === 'system') {
    return window.matchMedia(darkQuery).matches ? 'dark' : 'light';
  }
  return 'light';
}

function getServerSnapshot(): ColorScheme {
  return 'light';
}

/** The page's colour scheme: `light` on the server and the first client render. */
export function useColorScheme(): ColorScheme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** The Carbon theme for the page's colour scheme: light is `white`, dark is `g100`. */
export function useCarbonTheme(): AfframeCarbonTheme {
  return useColorScheme() === 'dark' ? 'g100' : 'white';
}
