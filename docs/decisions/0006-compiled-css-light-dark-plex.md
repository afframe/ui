# 6. Compiled CSS, light and dark themes, IBM Plex

Date: 2026-09-24

## Status

Accepted. Amended by [ADR 0015](0015-carbon-charts-css-in-its-own-file.md): Carbon Charts CSS ships separately as `charts.css`.

## Context

Carbon's styles are Sass. v12 styling compiles only from Sass with the v12 flag set; Carbon's precompiled CSS is v11-styled. If consumers compiled Carbon Sass themselves, each would have to repeat the flags, prefixes and font paths, and a second Sass configuration fails to compile.

## Decision

Afframe UI compiles one stylesheet and ships it: `@afframe/ui/styles.css`, covering Carbon, IBM Products and Afframe styles with the v12 flags on. Consumers do not use Sass. Prefixes stay `cds` and `c4p`. Two themes, `light` and `dark`, the two themes v12 ships, plus `system`, which follows the OS. The app sets `data-afframe-theme` on `<html>` in its server-rendered markup and the CSS does the rest, so the theme does not flash and needs no script. IBM Plex fonts (OFL-1.1) ship inside the package and are referenced by relative URLs.

The look is native v12 as IBM ships it (rounded corners, full-border fields). Afframe visual changes go through Carbon's tokens in the Sass theme.

## Consequences

Consumers import one CSS file and use Carbon tokens as CSS variables (`var(--cds-spacing-05)`) in their own styles. They must not override `.cds--` or `.c4p--` classes. Brand changes are a token change in this repo, not a consumer concern.
