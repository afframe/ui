# Testing

Everything in this repo is tested; nothing test-related ships to consumers. Decision: ADR 0009.

| Layer                | Tool                                                                      | Covers                                                                                                                                                                                                                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit and interaction | Vitest browser mode + Testing Library                                     | Afframe-owned components, `AfframeProvider`, helpers                                                                                                                                                                                                                                                                                                                |
| Accessibility        | Storybook a11y addon (axe), run as tests by `@storybook/addon-vitest`     | every story                                                                                                                                                                                                                                                                                                                                                         |
| Visual               | Vitest browser mode screenshots of Storybook stories, baselines committed | Afframe-owned components, `light` and `dark`, and a focus state where one exists                                                                                                                                                                                                                                                                                    |
| Types                | `tsc --noEmit`                                                            | the whole source                                                                                                                                                                                                                                                                                                                                                    |
| Lint and format      | ESLint, Stylelint with `stylelint-plugin-carbon-tokens`, Prettier         | code and styles; tokens-only styling                                                                                                                                                                                                                                                                                                                                |
| Package              | packed-tarball check                                                      | no stories, tests or fixtures in the tarball; every `exports` target ships and loads; `'use client'` kept on client modules; no Labs imports in component code; heavy extras do not import one another, and the chat elements reach their engines only through each family's index                                                                                  |
| Consumer             | `examples/nextjs` builds against the packed tarball                       | install, CSS and fonts, provider, server rendering, Labs and extras JavaScript only on the route that uses it: `/chat` ships the AI chat alone, `/shell` renders the header components (`LogoutTile` in its link form from a server component) with no Labs or extras JavaScript, `/chat-elements` loads the Carbon Charts and ECharts engines only as async chunks |

## Running

```sh
pnpm exec playwright install chromium --only-shell
pnpm test
```

Install the browser once. `pnpm test` builds `dist/styles.css` and `dist/charts.css`, then runs `vitest run`. Every test runs in headless Chromium through Playwright at the viewport set in `vitest.config.ts`. To run one project: `pnpm exec vitest run --project unit`. A local run of `unit` and `storybook` takes under a minute (254 test files, 1,295 tests in 45 s on 2026-10-07). The `visual` project runs only with `CI` set, in the release checks: its baselines are rendered on the CI runner, and font rendering differs on other machines.

| Project     | Runs                                                         | Fails on                                     |
| ----------- | ------------------------------------------------------------ | -------------------------------------------- |
| `unit`      | `src/**/*.test.{ts,tsx}`, with `styles.css` and `charts.css` | a failed assertion                           |
| `storybook` | every story, as a test                                       | a render error or an accessibility violation |
| `visual`    | `src/**/*.visual.test.tsx`                                   | a screenshot that differs from its baseline  |

## Rules

- Tests sit next to the component (`<Name>.test.tsx`, `<Name>.visual.test.tsx`).
- Carbon, IBM Products and Labs components re-exported as they are need no Afframe unit tests; they render in Storybook, so the a11y check still runs on them.
- Every included component renders under the v12 flags in Storybook; a visible break is recorded in `docs/feature-flags.md`.
- `src/provider/AfframeProvider.test.tsx` proves the v12 render: the v12 flag is on in React, a Carbon `TextInput` gets the v12 field style from `styles.css`, and the dark theme applies.
- `src/provider/LabsStyles.test.tsx` proves that Labs CSS in `styles.css` leaves Carbon components and plain HTML as Carbon styles them: Carbon `SideNav`, a plain `del` and the `DatePicker` selected day, next to the Labs `SideNav`, `TextHighlighter` and `Calendar` with their Labs look.

## Accessibility

The a11y addon runs with `test: 'error'`, so any violation fails the `storybook` project. A known upstream violation is switched off for one story by rule id and recorded in `docs/feature-flags.md`:

```ts
parameters: {
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
},
```

A story that needs a Carbon flag changed (for example v11 behaviour for one component) sets it with a `FeatureFlags` decorator on that story and gets a row there too.

Never set `test: 'todo'` for a whole story.

Afframe-owned stories (tag `afframe`) also check axe's `target-size` rule (WCAG 2.5.8), which axe-core leaves off by default. They spread `afframeA11y` from `.storybook/afframeA11y.ts` into `parameters`; a `beforeEach` in `.storybook/preview.tsx` fails any story tagged `afframe` without it. Never set your own `a11y.config.rules` on an `afframe` story: the array replaces the shared parameter and the guard fails. Afframe-owned stories have no exceptions; fix the CSS instead.

## Dependency pre-bundling

`vitest.config.ts` lists dependencies in `optimizeDeps.include` (for example `react-dom`, `storybook/actions`, the extras libraries). Vite found them late otherwise, reloaded the browser mid-run and failed whole test files. Add a dependency there when a run shows the same reload.

## Visual baselines

Visual tests call `toMatchScreenshot` on composed stories. They cover every Afframe-owned component and `AfframeProvider`, in light and dark, plus one focus state in light for each component with a focusable part (all but `Amount` and `AfframeProvider`; the test focuses a named element, so the screenshot is deterministic). `ChatChart` has no tab stop, so its focus test checks that one Tab leaves the story and focus stays on the page body. The internal `CreateEditFlow`, `ModalParts` and `useHeaderPanel` are covered through the components that use them. No Chromatic.

Baselines live in `src/<dir>/__screenshots__/<file>/<name>-chromium-linux.png` and are committed. Only the Linux renders count, since the release checks render them on the Linux runner in `.github/workflows/release-checks.yml`; macOS and Windows renders are gitignored.

To update a baseline:

1. Push the change and run the release checks on the branch: `gh workflow run release-checks.yml --ref <branch>`. When the `visual` job fails, it reruns `vitest run --project visual --update`.
2. Download the artifacts: `screenshots` holds the new baselines, `vitest-attachments` holds the reference, actual and diff images.
3. Review the diff, then commit the new Linux files.

A Playwright, Chromium or runner image update shifts pixels across many baselines; regenerate them the same way.

## CI

The `test` jobs of CI (`.github/workflows/ci.yml`) run the `unit` and `storybook` projects on every PR and push to `main`, split in two shards (`test (1/2)`, `test (2/2)`). Playwright browsers are cached between runs. The `visual` job of `.github/workflows/release-checks.yml` runs the `visual` project on a `v*` tag and by hand. Dependabot groups the Storybook packages (`storybook`) and Vitest and Playwright (`test`); `.github/dependabot.yml` lists every group.

Types, lint and format run separately in `pnpm preflight`, locally and in CI.
