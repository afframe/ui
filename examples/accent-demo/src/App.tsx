import { Button, Toggle } from '@afframe/ui';
import { demos } from './Demos';
import { useEffect, useState } from 'react';

const SEED = ['#0f62fe', '#8a3ffc', '#007d79'];
const load = <T,>(k: string, d: T): T => {
  try {
    return JSON.parse(localStorage.getItem(k) ?? '') as T;
  } catch {
    return d;
  }
};

function lum(hex: string) {
  const c = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
}
const contrastWhite = (hex: string) => 1.05 / (lum(hex) + 0.05);

const rel = (hex: string, dl: number, alpha?: string) =>
  `oklch(from ${hex} calc(l + ${dl}) c h${alpha ? ` / ${alpha}` : ''})`;

function applyAccent(hex: string, dark: boolean) {
  const s = document.documentElement.style;
  const text = dark ? rel(hex, 0.15) : hex; // link / focus / borders on the page background
  const vars: Record<string, string> = {
    '--cds-interactive': hex,
    '--cds-button-primary': hex,
    '--cds-button-primary-hover': rel(hex, -0.08),
    '--cds-button-primary-active': rel(hex, -0.16),
    '--cds-link-primary': text,
    '--cds-link-primary-hover': rel(hex, dark ? 0.08 : -0.08),
    '--cds-focus': text,
    '--cds-border-interactive': text,
    '--cds-icon-interactive': text,
    '--cds-background-brand': hex,
    '--cds-interactive-hover': rel(hex, -0.08),
    '--cds-highlight': dark
      ? rel(hex, -0.3)
      : `oklch(from ${hex} 0.92 calc(c * 0.3) h)`,
  };
  for (const [k, v] of Object.entries(vars)) s.setProperty(k, v);
}

export function App() {
  const [colours, setColours] = useState<string[]>(() => load('accents', SEED));
  const [sel, setSel] = useState<string>(() => load('accent', SEED[0]!));
  const [dark, setDark] = useState<boolean>(() => load('dark', false));
  const [pick, setPick] = useState('#da1e28');

  useEffect(() => {
    document.documentElement.dataset.afframeTheme = dark ? 'dark' : 'light';
    applyAccent(sel, dark);
    localStorage.setItem('accents', JSON.stringify(colours));
    localStorage.setItem('accent', JSON.stringify(sel));
    localStorage.setItem('dark', JSON.stringify(dark));
  }, [colours, sel, dark]);

  const low = contrastWhite(sel) < 4.5;

  return (
    <>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 24px',
          background: 'var(--cds-layer-01)',
          borderBottom: '1px solid var(--cds-border-subtle)',
          flexWrap: 'wrap',
        }}>
        <strong>Accent demo</strong>
        <div style={{ display: 'flex', gap: 8 }}>
          {colours.map((c) => (
            <button
              key={c}
              title={c}
              aria-label={c}
              aria-pressed={c === sel}
              onClick={() => setSel(c)}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: c,
                cursor: 'pointer',
                border:
                  c === sel
                    ? '3px solid var(--cds-text-primary)'
                    : '1px solid var(--cds-border-strong)',
              }}
            />
          ))}
        </div>
        <input
          type="color"
          value={pick}
          onChange={(e) => setPick(e.target.value)}
          aria-label="New colour"
        />
        <Button
          size="sm"
          kind="tertiary"
          onClick={() => {
            if (!colours.includes(pick)) setColours([...colours, pick]);
            setSel(pick);
          }}>
          Add colour
        </Button>
        {low && (
          <span style={{ color: 'var(--cds-text-error)', fontSize: 12 }}>
            Contrast with white text is {contrastWhite(sel).toFixed(1)}:1 (below
            4.5:1)
          </span>
        )}
        <span style={{ marginInlineStart: 'auto' }}>
          <Toggle
            id="theme"
            size="sm"
            labelText=""
            labelA="Light"
            labelB="Dark"
            toggled={dark}
            onToggle={setDark}
            aria-label="Dark mode"
          />
        </span>
      </header>

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          padding: 24,
          maxWidth: 900,
        }}>
        {[true, false].map((f) => (
          <section key={String(f)}>
            <h2 style={{ marginBlockEnd: 16 }}>
              {f ? 'Follows accent' : 'Does not follow accent'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {demos
                .filter((d) => d.follows === f)
                .map((d) => (
                  <div key={d.id} data-demo={d.id}>
                    {d.node}
                  </div>
                ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
