# 9. Testing stack and accessibility target

Date: 2026-10-05

## Status

Accepted

## Context

Everything in this repo must be tested, and nothing test-related may ship to consumers. Carbon's own components are tested upstream; Afframe adds wrappers, new components and a combined build. Carbon follows the IBM Accessibility Checklist (based on WCAG AA) and does not cover every WCAG 2.2 criterion.

## Decision

- Unit and interaction tests: Vitest with Testing Library.
- Accessibility checks: the Storybook a11y addon on every story, run as tests by addon-vitest; violations fail.
- Visual tests: Vitest browser mode (Playwright, Chromium) screenshots of Storybook stories, baselines committed, no Chromatic. For Afframe-owned components, in light and dark.
- Accessibility target: WCAG 2.2 AA for Afframe-owned components. Carbon components re-exported as is keep Carbon's own accessibility.

Detail: `docs/testing.md` and `docs/guides/accessibility.md`.

## Consequences

Test effort goes where Afframe owns the code. Criteria Carbon does not cover (for example target size and focus not obscured) are Afframe's to meet and test in its own components. The build strips stories and tests, and a pre-publish check proves the tarball holds none.
