# Component rubric

Each item is scored ok / fix / n/a per component. "Re-export" marks items that apply only to Afframe-owned code; for re-exports, the matching check is on docs and stories.

## Look

- Styles use Carbon tokens only (colour, spacing, type, motion); no raw values.
- Light, dark and `system` themes render correctly, including on layers 01 to 03.
- Every state is styled: default, hover, active, focus, selected, disabled, read-only, error, warning, loading, empty, skeleton.
- Sizes follow Carbon's scale (`sm`, `md`, `lg` …) where the component has sizes.
- Long text, Czech text with diacritics, large amounts and narrow widths do not break the layout.
- Spacing and alignment match the neighbouring Carbon components.

## Behaviour

- Keyboard: every action reachable; tab order and arrow keys follow the Carbon or WAI-ARIA pattern; Escape closes overlays.
- Focus: visible, moved on open, restored on close.
- Screen reader: roles, names, live regions; no axe violations.
- Controlled and uncontrolled use both work; callbacks fire once with the documented value.
- Edge cases: no data, one item, many items, slow async, errors.
- Server rendering: server-safe parts stay server-safe; `'use client'` only where needed.

## API (Afframe-owned)

- Names match Carbon conventions (`size`, `kind`, `onChange`, `open`, `onClose`, `messages`).
- One way to do each thing; no duplicate or dead props.
- `className`, `ref` and rest props pass through to the root element.
- Strings overridable through `messages` (ADR 0014); defaults in English, formats cs-CZ / CZK.
- Types exported; props documented with TSDoc.
- Component name says what it is, matches its folder, export and Storybook title.

## Variations

- A playground story with controls for every prop that matters.
- One story per meaningful variant and state, named consistently across components.
- Realistic Czech business example data.

## Docs (ADR 0008)

- Afframe-owned: H1, source label, source link, intro, canvas, props, keyboard and screen-reader behaviour.
- Re-export: copied upstream page current with the pinned version; Afframe notes where Afframe differs (flags, defaults, wrappers).
- When to use, when not, and which sibling component to use instead.
- No broken links, dead stories or leftover upstream boilerplate.

## Naming and grouping

- Storybook path follows the taxonomy (ADR 0019).
- Registry entry (`docs/registry.json`) correct: import path, runtime, docs link.
- Siblings grouped together (all fluid inputs, all empty states, all create and edit flows).

## Upkeep

- Afframe-owned: unit or interaction test, visual baselines light and dark, focus baseline where focusable.
- Upstream source pinned and linked; covered by `docs/guides/updating-carbon.md`.
- Workarounds recorded in issue #4 or `docs/feature-flags.md`, with the upstream link.
