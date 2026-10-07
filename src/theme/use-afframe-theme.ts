'use client';
import { useSyncExternalStore } from 'react';

export type AfframeColorScheme = 'light' | 'dark';
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

function getSnapshot(): AfframeColorScheme {
  const theme = document.documentElement.dataset.afframeTheme;
  if (theme === 'dark') return 'dark';
  if (theme === 'system') {
    return window.matchMedia(darkQuery).matches ? 'dark' : 'light';
  }
  return 'light';
}

function getServerSnapshot(): AfframeColorScheme {
  return 'light';
}

/** The page's colour scheme: `light` on the server and the first client render. */
export function useAfframeTheme(): AfframeColorScheme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** The Carbon theme for the page's colour scheme: light is `white`, dark is `g100`. */
export function useCarbonTheme(): AfframeCarbonTheme {
  return useAfframeTheme() === 'dark' ? 'g100' : 'white';
}
