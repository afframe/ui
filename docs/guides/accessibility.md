# Accessibility

Target: WCAG 2.2 AA for Afframe-owned components (ADR 0009).

## Who covers what

- Carbon and IBM Products components re-exported as they are keep Carbon's accessibility. Carbon follows the IBM Accessibility Checklist, based on WCAG AA.
- Afframe-owned components (wrappers, new components, compositions) meet WCAG 2.2 AA in full, including criteria Carbon does not cover, such as 2.5.8 Target Size (Minimum) and 2.4.11 Focus Not Obscured (Minimum).

## Checks

- The Storybook a11y addon runs on every story.
- Afframe-owned stories (tag `afframe`) also run axe's `target-size` rule (2.5.8) on every story, and a guard in `.storybook/preview.tsx` fails a story that leaves it off. These stories never set their own a11y rules and have no exceptions (`docs/testing.md`).
- Where an Afframe-owned component has a sticky part (DataGrid sticky headers and columns, the action bars of CreateSidePanel, EditSidePanel, EditTearsheet and EditFullPage), a play test focuses a control under it and checks that the control is what is painted at its centre (2.4.11).
- Each Afframe-owned component's docs page states its keyboard and screen-reader behaviour.
- Visual tests cover each Afframe-owned component in `light` and `dark`, and a focus state where it has a focusable part.

## Rules for Afframe-owned components

- Build on Carbon components; keep their roles, labels and keyboard handling.
- Every user-facing string, including accessible names, is overridable (ADR 0012).
- Colour comes from Carbon tokens only, so contrast follows Carbon's themes.
