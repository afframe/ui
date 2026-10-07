# 11. Licence: PolyForm Noncommercial, Apache-2.0 for Carbon parts

Date: 2026-10-05

Amended: 2026-10-07

## Status

Accepted

## Context

Afframe UI is source-available, not open source. It copies and derives material from Carbon (docs, stories, styles), which IBM licenses under Apache-2.0. Apache-2.0 requires keeping the licence and notices and marking modified files.

## Decision

The PolyForm Noncommercial License 1.0.0 governs the project. Carbon-derived parts stay under Apache-2.0. Licence texts live in `LICENSES/` in the REUSE layout: `LICENSES/PolyForm-Noncommercial-1.0.0.txt` and `LICENSES/Apache-2.0.txt`. Copied stories and styles keep IBM's header; copied `.mdx` pages, which upstream ships without a header, get IBM's copyright and SPDX lines added. Every copied file says when it was modified. Carbon, IBM Products and Carbon Labs publish no NOTICE file at the copied tags (Carbon v11.117.0, IBM Products 2.100.0 and the Carbon Labs package tags each page links to), so none is carried.

In `.mdx`, the header lines are `//` comments directly after the last `import` line of the first import block. reuse parses JSX `{/* */}` one-liners only under some Python hash seeds, so those pages fell back to `REUSE.toml` at random. Afframe-written pages declare their own licence in the same place. CI runs `reuse lint --json` through `scripts/check-licence-labels.mjs`: a page whose licence comes from `REUSE.toml`, or whose source label disagrees with its licence, fails the build.

The package ships both licence texts in `LICENSES/` and the OFL-1.1 text with the fonts; the root `LICENSE` is a symlink, which npm and pnpm do not pack. `dist/styles.css` opens with a `/*!` banner naming IBM's Apache-2.0 styles, Afframe's PolyForm additions and the OFL-1.1 fonts. The IBM Plex fonts are redistributed unmodified: the OFL reserves the name "Plex", so subset or re-encoded fonts would have to drop it.

## Consequences

Every copied file needs its header checked in review; for `.mdx` pages the CI check does it. Outside pull requests are closed by the maintainer.
