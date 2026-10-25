# 25. Carbon barrel cost accepted

Date: 2026-10-25

## Status

Accepted

## Context

`@carbon/react` has no `exports` map, and its root module `es/index.js` starts with `"use client"` and `import "./feature-flags.js"` and is listed in `sideEffects`. A bundler cannot drop what a client import of the root does not use, so the first client import of `@carbon/react`, Afframe's or the app's own, ships the whole barrel. IBM Products imports the `@carbon/react` root in 174 of its `es/*.js` files and adds its own barrel. Afframe's `DataGrid`, `EditTearsheet`, `FilterPanel` and the create and edit dialogs use IBM Products.

`es/feature-flags.js` also sets Carbon's own flag defaults: it calls `merge()` from `@carbon/feature-flags` with `enable-css-custom-properties` and `enable-css-grid` on, while `@carbon/feature-flags` alone defaults both to off. A build that bypasses the barrel loses them without an error, and `Grid` falls back to the flex grid.

Measured with `@carbon/react` 1.119.0 and `@carbon/ibm-products` 2.101.0: a copy of `examples/nextjs` installing the packed tarball, Next.js 16.4.1, `next build` and `next start`. Size is the sum of each route's `<script src>` chunks (gzip level 9, the `noModule` polyfill left out), compared with an empty page without Afframe from the same build (131.8 KB gzip; 129.6 KB with webpack and `optimizePackageImports`).

| Route                                                   | Turbopack, gzip | webpack, gzip | webpack with `optimizePackageImports`, gzip |
| ------------------------------------------------------- | --------------- | ------------- | ------------------------------------------- |
| `AfframeProvider` only                                  | +233 KB         | +1054 KB      | +7 KB                                       |
| Provider and an IBM Products component                  | +540 KB         | +1054 KB      | +56 KB                                      |
| App importing `Button` from the root, no Afframe        | +233 KB         | +232 KB       | +19 KB                                      |
| Deep imports of `GlobalTheme`, `FeatureFlags`, `Button` | +30 KB          | +29 KB        | +20 KB                                      |

- Under Turbopack the barrel is one shared chunk of 746 KB raw, 233 KB gzip, with the same hash on every route: it downloads once per deploy, and a later page adds 0 KB for it. After it, a Carbon, Afframe or Labs component adds 0.3 to 3 KB.
- `experimental.optimizePackageImports` for `@afframe/ui`, `@carbon/react` and `@carbon/ibm-products` gives byte-identical chunks under Turbopack, also for the app's own root import. A consumer cannot change this by config.
- CPU at 4x throttle in Chromium, median of 5 loads: the provider adds about 70 ms of script time and 19 ms of Total Blocking Time over the empty page, a page with an IBM Products component about 144 ms and 45 ms. Both stay within the Core Web Vitals "good" range.
- Under webpack with `optimizePackageImports`, a headless check of the provider, `Button` and IBM Products routes showed no console errors after hydration and a working `Button`; no other behaviour was checked.

## Decision

- Accept the one shared Carbon chunk. Afframe keeps re-exporting Carbon from the `@carbon/react` root (ADR 0001).
- The supported bundler is Turbopack, the Next.js 16 default (`next build` without `--webpack`). `optimizePackageImports` is not needed.
- No per-component client modules in Afframe.
- `AfframeProvider` imports `@carbon/react/es/feature-flags.js` itself, so Carbon's flag defaults hold under any bundler that reaches the provider without the barrel. `check:pack` fails if the built provider loses that import.

## Options not chosen

- Per-component client modules with deep imports: about 203 KB gzip less, on the first page only and only on routes without IBM Products; Carbon has no `exports` map, so every Carbon update can move the paths, the flag defaults need their own import first, and it breaks "re-exported as they are" (ADR 0001).
- `optimizePackageImports`: no effect under Turbopack.
- webpack with `optimizePackageImports`: the smallest result, but not the Next.js 16 default, every consumer has to configure it, only a hydration check was run, and it bypasses the barrel and its flag defaults.
- Plain webpack: about 1 MB gzip on every route with the provider.

## Consequences

- The first page of an Afframe app loads about 233 KB gzip of Carbon, about 540 KB with an IBM Products component; later pages load it from cache.
- Plain Carbon apps that import from the root pay the same, so the cost is Carbon's, not added by Afframe.
- Consumers on webpack are not supported; the provider still keeps Carbon's flag defaults there.

Check again on:

- a Carbon major version;
- IBM Products components moving into Carbon core (ADR 0005);
- a Next.js release that changes how Turbopack handles side-effect barrels or `optimizePackageImports`.
