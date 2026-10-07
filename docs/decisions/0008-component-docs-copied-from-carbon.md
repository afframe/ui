# 8. Component docs copied from Carbon and extended

Date: 2026-10-05

## Status

Accepted

## Context

Carbon and IBM Products already document their components (MDX docs pages and stories). Rewriting them would cost time and drift from upstream. Afframe's own components need docs that read the same way.

## Decision

Copy Carbon's and IBM Products' docs and stories for the components Afframe UI carries, then add Afframe's own content (usage notes, defaults, accessibility notes). Docs for Afframe's own components are written from scratch in a short structure: H1, source label and one source link, a short intro, the canvas, props, and keyboard and screen-reader behaviour. They leave out Carbon's "Overview" and "Feedback" boilerplate. Storybook carries the docs, docs page first for each component, as Carbon's Storybook does.

`docs/` in this repo holds what does not belong to one component: decisions, guides and topic files, laid out like Carbon's `docs/`.

## Consequences

Copied docs and stories are Carbon-derived and stay under Apache-2.0 with their notices (ADR 0011). Updating Carbon includes checking the copied docs for upstream changes.
