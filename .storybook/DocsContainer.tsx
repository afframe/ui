import { DocsContainer } from '@storybook/addon-docs/blocks';
import type { DocsContainerProps } from '@storybook/addon-docs/blocks';
import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { create } from 'storybook/theming';
import { useColorScheme } from '../src/index.js';
import type { AfframeTheme } from '../src/index.js';
import { g100, white } from '../src/tokens.js';

// Storybook's theming runs colours through polished, which cannot read CSS
// variables, so the docs themes take Carbon's token values.
const fontBase =
  "'IBM Plex Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
const fontCode = "'IBM Plex Mono', Menlo, 'DejaVu Sans Mono', monospace";
const docsTheme = (base: 'light' | 'dark', tokens: typeof white) =>
  create({
    base,
    fontBase,
    fontCode,
    colorPrimary: tokens.interactive,
    colorSecondary: tokens.linkPrimary,
    appBg: tokens.background,
    appContentBg: tokens.background,
    appPreviewBg: tokens.background,
    appBorderColor: tokens.borderSubtle01,
    appBorderRadius: 0,
    textColor: tokens.textPrimary,
    textMutedColor: tokens.textSecondary,
    textInverseColor: tokens.textInverse,
    barBg: tokens.layer01,
    barTextColor: tokens.textSecondary,
    barSelectedColor: tokens.interactive,
    inputBg: tokens.field01,
    inputBorder: tokens.borderStrong01,
    inputTextColor: tokens.textPrimary,
  });
const themes = {
  light: docsTheme('light', white),
  dark: docsTheme('dark', g100),
};

type GlobalsEvent = { globals?: { theme?: AfframeTheme } };

// The store is not in Storybook's public types, and MDX-only pages have no
// story context to read the toolbar value from. A change in its shape falls
// back to light.
function currentTheme(context: DocsContainerProps['context']): AfframeTheme {
  const { store } = context as unknown as {
    store?: { userGlobals?: { get?(): { theme?: AfframeTheme } | undefined } };
  };
  // The value can come from a crafted ?globals= link; only known themes reach
  // the iframe URL.
  const theme = store?.userGlobals?.get?.()?.theme;
  return theme === 'dark' || theme === 'system' ? theme : 'light';
}

// Canvases with `inline: false` render iframe.html in their own iframe, which
// gets no toolbar globals. Storybook builds that URL from PREVIEW_URL and keeps
// its query, so new iframes open in the current theme.
function setIframeTheme(theme: AfframeTheme) {
  (globalThis as { PREVIEW_URL?: string }).PREVIEW_URL =
    `iframe.html?globals=theme:${theme}`;
}

/**
 * Docs pages follow the theme toolbar: sets `data-afframe-theme` (MDX-only
 * pages render no story, so the story decorator never runs there), passes the
 * theme to iframe canvases and picks the light or dark docs theme.
 */
export function ThemedDocsContainer({
  context,
  children,
}: PropsWithChildren<DocsContainerProps>) {
  const [theme, setTheme] = useState(() => currentTheme(context));
  document.documentElement.dataset.afframeTheme = theme;
  setIframeTheme(theme);
  useEffect(() => {
    const update = ({ globals }: GlobalsEvent) => {
      if (globals?.theme) setTheme(globals.theme);
    };
    context.channel.on(GLOBALS_UPDATED, update);
    context.channel.on(SET_GLOBALS, update);
    // Globals set between the first render and these listeners.
    setTheme(currentTheme(context));
    return () => {
      context.channel.off(GLOBALS_UPDATED, update);
      context.channel.off(SET_GLOBALS, update);
    };
  }, [context]);
  // Iframes that already loaded keep their URL, so a toolbar change reaches
  // them through their own document.
  useEffect(() => {
    for (const frame of document.querySelectorAll('iframe')) {
      const root = frame.contentDocument?.documentElement;
      if (root) root.dataset.afframeTheme = theme;
    }
  }, [theme]);
  return (
    <DocsContainer context={context} theme={themes[useColorScheme()]}>
      {children}
    </DocsContainer>
  );
}
