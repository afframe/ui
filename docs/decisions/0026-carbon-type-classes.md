# 26. Carbon type classes in styles.css

Date: 2026-10-31

## Status

Accepted. Amends [ADR 0006](0006-compiled-css-light-dark-plex.md).

## Context

Consumers have no Sass (ADR 0006), so Carbon's `type-style()` mixin is out of their reach. `styles.css` carried each type style only as four custom properties (`--cds-heading-03-font-size` and the rest), which own markup had to set one by one. Carbon's docs and the agents that read them name Carbon's type classes (`cds--type-heading-03`), which `@carbon/type` emits with its `type-classes` mixin and `@carbon/styles` does not include.

## Decision

`styles.css` carries the full output of `@carbon/type`'s `type-classes` mixin, as Carbon emits it: 73 classes (font families, font weights, italic and every type style, fluid ones with their media queries). Nothing is filtered out, so the stylesheet matches upstream, alias and older names included. `src/styles/_type-classes.scss` emits them.

The classes sit before every other rule of the stylesheet, Carbon's reset included. A type class and a Carbon or IBM Products component rule often have equal specificity, one class; the later component rule wins, so a type class set on a component element does not change the component. Against Carbon's `h1` to `h6` and `p` defaults a type class wins by specificity, a class over an element, so it styles own headings and paragraphs. Some components style plain elements inside them (`.cds--modal-content>p`, `.cds--accordion__content>p`); there the component rule is more specific and wins.

The consuming guide gets a Typography section with the roles Carbon's components use each style for. It is part of "Use it", so it reaches `dist/agents.md` ([ADR 0024](0024-agent-guide-in-the-package.md)).

## Consequences

One class applies a type style, and fluid styles grow with the viewport, which the custom properties cannot do. `styles.css` grows by 24,321 bytes, about 1.8 kB gzip. The older and alias classes ship because Carbon ships them, not as a compatibility layer of Afframe's ([ADR 0023](0023-no-compatibility-layers-before-users.md)); the guide points to the current names. Consumers still must not override `.cds--` classes. A Carbon update can change the classes or their place in the output: `docs/guides/updating-carbon.md` lists the recheck, and `scripts/check-pack.mjs` checks the placement.
