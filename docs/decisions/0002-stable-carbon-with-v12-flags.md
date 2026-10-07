# 2. Stable Carbon v11 with the v12 feature flags on

Date: 2026-10-05

## Status

Accepted

## Context

The newest stable Carbon React is `@carbon/react` 1.x (v11 line; 1.117.0 on 2026-10-05). Carbon v12 is published only as alphas under the `v12-alpha` npm dist-tag. Inside 1.x, v12 behaviour and styling are available through feature flags (`enable-v12-release` and the `enable-v12-*` flags). Carbon's stated intent is that a codebase running with all v12 flags on needs no changes at v12. IBM Products and `@carbon/ai-chat` peer only the v11 majors.

## Decision

Use stable `@carbon/react` v11 (1.x) and stable `@carbon/ibm-products`, with the v12 feature flags on in React and in the Sass build. No alpha or beta Carbon. Move to v12 when it is stable.

A component stays on v11 behaviour only when v12 demonstrably breaks a component we need; each case is documented in `docs/feature-flags.md`.

## Consequences

The package gets the v12 look and behaviour today on stable, installable versions. The Sass build is mandatory, because Carbon's precompiled CSS is v11-styled (see ADR 0006). `@carbon/ai-chat` must never sit under a `<feature-flags>` DOM element. The move to v12 stable is a planned piece of work: switch the dependencies, drop the flags, and move the migrated components to core (ADR 0005).
