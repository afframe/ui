# Decisions

This directory holds the [architecture decision records](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) (ADRs) of Afframe UI: the decisions that shape the package's structure, dependencies, interfaces and way of working. The format follows Carbon's `docs/decisions/` and Michael Nygard's article.

## Principles

- The maintainer makes the decisions. An ADR records a decision once it is made.
- ADRs are numbered in sequence; numbers are never reused.
- A reversed decision stays: mark it superseded and link the old and new ADRs both ways.
- Each ADR is short: context, decision, consequences, in full sentences.

## Adding a decision

1. Copy `0000-template.md` to the next number with a short title in the file name.
2. Fill it in and open a PR.

## Index

| ADR                                                         | Decision                                                     | Status                                                                                                                     |
| ----------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| [0001](0001-one-package-built-on-carbon.md)                 | One package built on Carbon React, one import path           | Accepted                                                                                                                   |
| [0002](0002-stable-carbon-with-v12-flags.md)                | Stable Carbon v11 with the v12 feature flags on              | Superseded by [0018](0018-carbon-v11-without-v12-flags.md)                                                                 |
| [0003](0003-upstream-as-exact-dependencies.md)              | Upstream packages as exact regular dependencies              | Accepted                                                                                                                   |
| [0004](0004-scope-core-products-labs-extras.md)             | Scope: Carbon core, IBM Products, Labs and extras            | Accepted, amended by [0018](0018-carbon-v11-without-v12-flags.md)                                                          |
| [0005](0005-migrated-components-via-ibm-products.md)        | Migrated components through IBM Products                     | Accepted, amended by [0017](0017-ibm-declarations-for-untyped-exports.md) and [0018](0018-carbon-v11-without-v12-flags.md) |
| [0006](0006-compiled-css-light-dark-plex.md)                | Compiled CSS, light and dark themes, IBM Plex                | Accepted, amended by [0018](0018-carbon-v11-without-v12-flags.md)                                                          |
| [0007](0007-telemetry-off.md)                               | IBM Telemetry off                                            | Accepted                                                                                                                   |
| [0008](0008-component-docs-copied-from-carbon.md)           | Component docs copied from Carbon and extended               | Accepted, amended 2026-10-13, 2026-10-15                                                                                   |
| [0009](0009-testing-and-accessibility.md)                   | Testing stack and accessibility target                       | Accepted                                                                                                                   |
| [0010](0010-build-with-tsdown-and-typescript-6.md)          | Build with tsdown and TypeScript 6.0.3                       | Accepted                                                                                                                   |
| [0011](0011-licence.md)                                     | Licence: PolyForm Noncommercial, Apache-2.0 for Carbon parts | Accepted, amended 2026-10-13                                                                                               |
| [0012](0012-i18n-ready-english-czk.md)                      | i18n-ready, English, left-to-right, CZK                      | Accepted                                                                                                                   |
| [0013](0013-no-releases-until-the-plan-is-finished.md)      | No releases until the plan is finished                       | Superseded by [0016](0016-first-release-before-carbon-v12.md)                                                              |
| [0014](0014-overridable-strings-through-a-messages-prop.md) | Overridable strings through a messages prop                  | Accepted, amended 2026-10-13                                                                                               |
| [0015](0015-carbon-charts-css-in-its-own-file.md)           | Carbon Charts CSS in its own file                            | Accepted                                                                                                                   |
| [0016](0016-first-release-before-carbon-v12.md)             | First release before Carbon v12                              | Accepted                                                                                                                   |
| [0017](0017-ibm-declarations-for-untyped-exports.md)        | IBM's declarations for untyped IBM Products exports          | Accepted                                                                                                                   |
| [0018](0018-carbon-v11-without-v12-flags.md)                | Carbon v11 without the v12 feature flags                     | Accepted                                                                                                                   |
| [0019](0019-storybook-taxonomy.md)                          | Storybook taxonomy                                           | Accepted, amended 2026-10-13                                                                                               |
