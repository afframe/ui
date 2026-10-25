# 4. Scope: Carbon core, IBM Products, Labs and extras

Date: 2026-10-05

Amended: 2026-10-18, 2026-10-25

## Status

Accepted. Amended by [ADR 0018](0018-carbon-v11-without-v12-flags.md): the render checks run without the v12 flags. Amended 2026-10-15: Carbon's utilities. Amended by [ADR 0021](0021-system-date-and-time-format-and-input-masks.md): the date and time pickers are wrapped. Amended by [ADR 0022](0022-filtering-follows-tanstack-carbon.md): the filter panel follows Carbon's tanstack-carbon examples. Amended 2026-10-25: `preview__DatePicker` is removed; it has a stable twin, so the rule above leaves it out.

## Context

The carbon-design-system organisation publishes far more than one product needs: other frameworks, deprecated and archived packages, marketing components, experiments. Afframe UI should carry everything useful for React business apps and nothing else. Labs and the extras are what make the UI more than raw Carbon.

## Decision

In scope:

- Carbon core (`@carbon/react`): every stable component group, plus preview components that have no stable twin (`preview__IconIndicator`, `preview__ShapeIndicator`), and the opt-in non-v12 flags listed in `docs/feature-flags.md`. Carbon's stable `DatePicker` ships as an Afframe wrapper under Carbon's name, with the date and time pickers that [ADR 0021](0021-system-date-and-time-format-and-input-masks.md) lists; Afframe-owned components use the stable `DatePicker` until v12, when it gets the Temporal internals (carbon #22427).
- Tokens, icons and pictograms (`@carbon/themes` and the other token packages, `@carbon/icons-react`, `@carbon/pictograms-react`).
- IBM Products (`@carbon/ibm-products`): the non-deprecated components (the deprecated `CreateFullPage`, `CreateTearsheet` and `Saving` are dropped), including the onboarding set, AddSelect, ConditionBuilder, ScrollGradient and the selected preview and preview-candidate components.
- Carbon Labs: every live Labs React package, except `@carbon-labs/react-style-picker` (cannot be installed), `@carbon-labs/react-plane-stack-3d` (React 18 only), `@carbon-labs/react-date-picker` (replaced by the core `DatePicker`), `@carbon-labs/react-animated-header` (global theme CSS and IBM brand assets), `@carbon-labs/react-registration-flow` (only its wrapper is published), `@carbon-labs/react-split-panel` (deprecated), `@carbon-labs/react-example-button` (scaffold), `@carbon-labs/mdx-components` and `@carbon-labs/vscode-snippets` (no use in the package). Each exclusion is rechecked on a Labs release.
- Extras: Carbon Charts, Apache ECharts with `@carbon/echarts-theme`, `@carbon/ai-chat`, a data grid on TanStack Table with Carbon DataTable styling (built feature by feature), business formatting.
- Afframe improvements where Carbon has gaps (filter panel, see [ADR 0022](0022-filtering-follows-tanstack-carbon.md); create and edit dialogs, status indicator, description list and similar).

Out: other frameworks, deprecated and archived packages, marketing sections, dead Labs experiments, Figma and other design-tool parity, and new pages, sections and templates (built later, only when a real use needs one).

## Amendment 2026-10-15: Carbon's utilities

IBM Products' Storybook documents helpers that IBM Products does not export: they come from Carbon's `@carbon/utilities` and `@carbon/utilities-react`. The maintainer wants them, so both packages are in scope as exact dependencies, pinned to the versions released with `@carbon/react` (same `gitHead`):

- `@carbon/utilities`: `createOverflowHandler` (with its `OverflowHandler` and `OverflowHandlerOptions` types), `dateTimeFormat` (see [ADR 0020](0020-own-formatters-beside-carbon-datetimeformat.md)) and `makeDraggable`.
- `@carbon/utilities-react`: the step flow, `StepProvider`, `StepGroup`, `useStepContext` and the `StepContextType` type.

Out: `initCarousel`, which the maintainer left out, and the rest of both packages (`AddSelectData`, which Afframe already exports from IBM Products, `datePartsOrder`, the document language helpers, `@internationalized/number`, `useNoInteractiveChildren`). IBM's `useOverflowItems` hook is internal to IBM Products and to Carbon; `createOverflowHandler` is the public helper that does the same job.

## Amendment 2026-10-15: date and time pickers

[ADR 0021](0021-system-date-and-time-format-and-input-masks.md) replaces "re-exported as they are" for the date and time pickers: they become Afframe wrappers under Carbon's names that apply the system date and time format and a typing mask (ADR 0021 lists them). Their inputs, selects and skeletons stay Carbon re-exports. Labs `Calendar` stays as it is.

## Consequences

The package is large, so tree-shaking (ADR 0001) matters. Labs packages are all 0.x and change often; each one needs a render check under the v12 flags. Every new optional item or new page is approved by the maintainer one by one.
