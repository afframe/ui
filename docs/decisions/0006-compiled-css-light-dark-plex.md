# 6. Compiled CSS, light and dark themes, IBM Plex

Date: 2026-09-24

## Status

Accepted. Amended by [ADR 0015](0015-carbon-charts-css-in-its-own-file.md): Carbon Charts CSS ships separately as `charts.css`. Amended by [ADR 0018](0018-carbon-v11-without-v12-flags.md): the stylesheet compiles without the v12 flags, so the look is v11.

## Context

Carbon's styles are Sass. Afframe sets opt-in flags, prefixes, themes and font paths in the Sass build, so it stays. If consumers compiled Carbon Sass themselves, each would have to repeat that configuration, and a second Sass configuration fails to compile.

## Decision

Afframe UI compiles one stylesheet and ships it: `@afframe/ui/styles.css`, covering Carbon, IBM Products and Afframe styles with Afframe's flags. Consumers do not use Sass. Prefixes stay `cds` and `c4p`. Two themes, `light` and `dark`, plus `system`, which follows the OS. The app sets `data-afframe-theme` on `<html>` in its server-rendered markup and the CSS does the rest, so the theme does not flash and needs no script. IBM Plex fonts (OFL-1.1) ship inside the package and are referenced by relative URLs.

The look is Carbon v11 as IBM ships it. Afframe visual changes go through Carbon's tokens in the Sass theme.

## Consequences

Consumers import one CSS file and use Carbon tokens as CSS variables (`var(--cds-spacing-05)`) in their own styles. They must not override `.cds--` or `.c4p--` classes. Brand changes are a token change in this repo, not a consumer concern.
