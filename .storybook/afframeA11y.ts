// Afframe-owned stories (tag `afframe`) turn on axe's target-size rule
// (WCAG 2.5.8), which axe-core leaves off by default. Spread into
// `parameters`; preview.tsx fails a story tagged `afframe` without it.
export const afframeA11y = {
  a11y: { config: { rules: [{ id: 'target-size', enabled: true }] } },
} as const;
