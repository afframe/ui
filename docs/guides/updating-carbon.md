# Updating Carbon

Carbon, IBM Products, Carbon Labs and the other upstream packages are exact dependencies of `@afframe/ui` (ADR 0003). Updates arrive as Dependabot PRs.

## Dependabot

- Runs on a regular schedule. On-demand updates (security fixes, needed features) are normal PRs with the same review.
- Carbon updates are grouped into one PR: `@carbon/*`, `@carbon-labs/*` and `@ibm/*` (such as `@ibm/plex`). The extras packages have their own group, `extras` (see Extras packages). `.github/dependabot.yml` lists every group.
- Stable versions only. No `v12-alpha` or other pre-release versions (ADR 0002).
- Dependabot ignores `typescript` major updates (`.github/dependabot.yml`, ADR 0010).
- Every install in CI runs with `IBM_TELEMETRY_DISABLED=true`.

## Reviewing an update PR

1. CI passes (unit and accessibility tests), and the release checks pass on the PR branch (`gh workflow run release-checks.yml --ref <branch>`): visual tests, the package check and the example app build.
2. Check that IBM Products' peer range still accepts the new `@carbon/react`.
3. Check `docs/feature-flags.md`: new v12 flags to turn on, workarounds a fix makes unnecessary.
4. Check copied Carbon docs and stories for upstream changes (ADR 0008). A newly copied `.mdx` page gets IBM's SPDX lines as `//` comments directly after its imports (`docs/developer-handbook.md`).
5. On an IBM Products update: check the copied IBM Products docs and stories for upstream changes, and the canary list (`pkg.component` in the `AfframeProvider` module) for components that became gated or no longer are. Move `@carbon/ibm-products-styles` to the version released with it: both carry the same `gitHead` (`npm view <package>@<version> gitHead`).
6. On a Carbon Labs update: compile the updated Labs Sass and compare it with the old version. A new or changed rule on a `cds--` class, a `flatpickr-` class or a plain element (`mark`, `del`, `ins` and the like) also styles Carbon components or plain HTML. Extend the Afframe overrides after the Labs `@use` lines in `src/styles/index.scss`, and the Labs versions named in their comments. `src/provider/LabsStyles.test.tsx` covers the known cases.
7. On a `@carbon/react` update: move or drop the local patch (Local patches).
8. The maintainer approves and merges. Nothing merges automatically.

## Local patches

`patches/` holds pnpm patches, listed under `patchedDependencies` in `pnpm-workspace.yaml`. A patch applies only to installs of this repo: it changes what the tests and Storybook run, not the published package, so apps that install `@afframe/ui` get the unpatched upstream code.

- `@carbon/react` 1.117.0, `usePresence`: Carbon awaits the exit animations of a presence-enabled component (`Modal`, `ComposedModal` under `enable-presence`) with `Promise.all(...).finally(...)` and no `catch`. Unmounting the component during its exit animation cancels the animation and leaves an unhandled `AbortError`. The patch adds `.catch(() => {})` before `.finally` in `lib/internal/usePresence.js` and `es/internal/usePresence.js`. `src/components/Modal/ModalPresence.test.tsx` fails without it. Apps that use `@afframe/ui` still see the error in the console until Carbon ships the fix ([carbon#23659](https://github.com/carbon-design-system/carbon/issues/23659)). IBM Products 2.100.0 has the same code in its own Tearsheet `usePresence` ([ibm-products#9944](https://github.com/carbon-design-system/ibm-products/issues/9944)), which the patch does not cover, so the `EditTearsheet` tests still let exit animations end before they unmount.

pnpm keys a patch to an exact version. `allowUnusedPatches` in `pnpm-workspace.yaml` lets an update install with the patch unused, and `ModalPresence.test.tsx` then fails if the new version still has the bug. On a `@carbon/react` update, check whether the new version fixes the bug: if it does, remove the patch file and its `patchedDependencies` entry; if not, recreate the patch for the new version (`pnpm patch @carbon/react@<version>`, apply the same change, `pnpm patch-commit`).

## Upstream pages not copied

Carbon's docs and stories are copied from `packages/react` at the pinned tag, except these. Check the list when an update adds or removes upstream pages.

| Upstream folder or file                                                                                                                                                                                                                | Reason                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/` ActionSet, BigNumber, Coachmark, EditInPlace, FullPageError, Guidebanner, InterstitialScreen, NotificationsPanel, OptionsTile, Resizer, ScrollGradient, SidePanel, TagOverflow, Tearsheet, TruncatedText, UserAvatar | Moving from IBM Products into core in v12 and not in the published v11 package; their pages are copied from IBM Products (Resizer from Carbon Labs, see Carbon Labs pages). ActionSet and OptionsTile are not part of Afframe UI (ADR 0005) |
| `src/components/` Card, Dialog, Layout, LayoutDirection, Text, ClassPrefix, IdPrefix                                                                                                                                                   | Not part of Afframe UI                                                                                                                                                                                                                      |
| `src/components/OverflowMenuV2`, `ModalWrapper` (with `migration.mdx`), `PageHeader`, `Pagination/experimental`                                                                                                                        | Deprecated, or an alias of a copied component                                                                                                                                                                                               |
| `src/components/**/docs/*.mdx`                                                                                                                                                                                                         | Overview pages; Carbon's own Storybook skips them too                                                                                                                                                                                       |
| `src/components/HideAtBreakpoint`                                                                                                                                                                                                      | Sass helper; Afframe UI ships compiled CSS only                                                                                                                                                                                             |
| `src/components/OverflowHandler`                                                                                                                                                                                                       | Needs `@carbon/utilities`, which is not a dependency                                                                                                                                                                                        |
| `.storybook/Welcome`, `.storybook/Preview`                                                                                                                                                                                             | Carbon's own Storybook pages                                                                                                                                                                                                                |
| `.storybook-v12/stories/Motion`                                                                                                                                                                                                        | Stories for Carbon's v12 Storybook only                                                                                                                                                                                                     |
| `src/components/Plex` Arabic, Devanagari, Hebrew and Thai stories                                                                                                                                                                      | those Plex families are not shipped; Arabic and Hebrew are right-to-left (ADR 0012)                                                                                                                                                         |

## IBM Products pages not copied

IBM Products' docs and stories are copied from `packages/ibm-products/src/components` at tag `@carbon/ibm-products@2.100.0`, except these. Check the list when an update adds or removes upstream pages.

| Upstream folder or file                                                                                                                                                                                                                                               | Reason                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `PageHeader` outside `next/`                                                                                                                                                                                                                                          | legacy PageHeader; Afframe `PageHeader` is the `next/` one (`preview__PageHeader`)                                             |
| `Tearsheet` outside `next/` (Tearsheet, TearsheetNarrow, TearsheetPresence, TearsheetShell)                                                                                                                                                                           | stable Tearsheet; Afframe `Tearsheet` is the `next/` one (`preview__Tearsheet`), with `variant="narrow"` and presence built in |
| `Coachmark` outside `next/`, CoachmarkFixed, CoachmarkStack                                                                                                                                                                                                           | the deprecated `previewCandidate__Coachmark*`; Afframe `Coachmark` is the `next/` one (`preview__Coachmark`)                   |
| `EmptyStates/EmptyStateV2.stories.jsx`                                                                                                                                                                                                                                | EmptyStateV2 is not exported                                                                                                   |
| `*.internal.stories.jsx`                                                                                                                                                                                                                                              | IBM's internal stories                                                                                                         |
| Create\*, Edit\* except EditInPlace, Datagrid, DataSpreadsheet, FilterPanel, DelimitedList, DescriptionList, APIKeyModal, ExportModal, ImportModal, RemoveModal, HTTPErrors, Nav, Saving, StatusIcon, StatusIndicator, StringFormatter, UserProfileImage, WebTerminal | deprecated in IBM Products (ADR 0004)                                                                                          |
| AboutModal, ActionBar, OptionsTile                                                                                                                                                                                                                                    | not part of Afframe UI                                                                                                         |
| DecoratorDualButton, DecoratorLink, DecoratorSingleButton, DragAndDrop                                                                                                                                                                                                | not exported by Afframe UI                                                                                                     |
| FeatureFlags                                                                                                                                                                                                                                                          | IBM's flag API is re-exported as `preview__FeatureFlags`; `docs/feature-flags.md` covers it                                    |

## Carbon Labs pages

Labs docs and stories are copied from `packages/react/src/components/<Dir>/__stories__/` in the carbon-labs repository, at each package's own tag, `@carbon-labs/<package>@<version>`. Each version is the one in `package.json`.

| Package                                     | Version | Docs folder (`src/components/`) |
| ------------------------------------------- | ------- | ------------------------------- |
| `@carbon-labs/react-ui-shell`               | 0.106.0 | UIShellLabs                     |
| `@carbon-labs/react-whats-new`              | 0.28.0  | WhatsNew                        |
| `@carbon-labs/react-first-time-orientation` | 0.21.0  | FirstTimeOrientation            |
| `@carbon-labs/react-calendar`               | 0.11.0  | Calendar                        |
| `@carbon-labs/react-tag-input`              | 0.6.0   | TagInput                        |
| `@carbon-labs/react-text-highlighter`       | 0.23.0  | TextHighlighter                 |
| `@carbon-labs/react-theme-settings`         | 0.30.0  | ThemeSettings                   |
| `@carbon-labs/react-processing`             | 0.21.0  | Processing                      |
| `@carbon-labs/react-resizer`                | 0.25.0  | Resizer                         |

## Labs packages not included

Check the list on each Labs release.

| Package                                | Reason                                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `@carbon-labs/react-animated-header`   | global theme CSS and IBM brand assets                                                                  |
| `@carbon-labs/react-registration-flow` | only the wrapper is published                                                                          |
| `@carbon-labs/react-style-picker`      | cannot be installed                                                                                    |
| `@carbon-labs/react-plane-stack-3d`    | React 18 only                                                                                          |
| `@carbon-labs/react-date-picker`       | the core `DatePicker` replaces it                                                                      |
| `@carbon-labs/react-split-panel`       | deprecated                                                                                             |
| `@carbon-labs/react-example-button`    | scaffold                                                                                               |
| `@carbon-labs/mdx-components`          | no use in the package                                                                                  |
| `@carbon-labs/vscode-snippets`         | no use in the package; install it in your own editor if you want it                                    |
| `@carbon-labs/ai-chat`                 | web components; `@carbon/ai-chat` renders the chat; per-element coverage: the `ChatElements` docs page |

`@carbon-labs/react-first-time-orientation` has no entry point, so `src/labs/first-time-orientation.ts` imports it from `es/index.js`. Switch to the bare import when the package gets one.

Several Labs packages re-export with extension-less paths in `es/index.d.ts`, so their types are `any` under `moduleResolution: nodenext`. The modules in `src/labs/` therefore import ui-shell, theme-settings and processing from their `es/components/*.js` files, and take the whats-new, first-time-orientation and `Profile` types from the matching `.d.ts` files. After a Labs update, check that these paths still exist (`pnpm build` and `pnpm typecheck` fail if not) and switch back to the bare imports when the packages fix their type entries.

The element by element comparison of `@carbon-labs/ai-chat` with `@carbon/ai-chat` lives on the `ChatElements` docs page (`src/components/ChatElements/ChatElements.mdx`, section "Comparison with Carbon Labs AI chat"). Re-run it when `@carbon/ai-chat` or `@carbon-labs/ai-chat` updates, and update the page.

After a Labs update, also check that `@carbon-labs/utilities` still matches what the Labs packages need, and that the `'use client'` check in `check:pack` still passes (no Labs package marks its own modules). The Labs overrides in `src/styles/index.scss` tell the Labs side nav from Carbon's by `role="navigation"` on its `nav`; recheck that marker, since a Carbon `SideNav` given that role gets the Labs look.

## Extras packages

The extras are exact dependencies too, updated in the `extras` Dependabot group:

| Package                                            | Used by                                  |
| -------------------------------------------------- | ---------------------------------------- |
| `@carbon/charts`, `@carbon/charts-react`           | `Charts`, and Charts CSS in `charts.css` |
| `echarts`, `@carbon/echarts-theme`                 | `ECharts`                                |
| `@carbon/ai-chat`, `@carbon/web-components`        | `AIChat`                                 |
| `@tanstack/react-table`, `@tanstack/react-virtual` | `DataGrid`                               |

On an update:

1. Move `@carbon/charts` and `@carbon/charts-react` together, to the same version. Check that the Charts Sass still compiles into `charts.css` (`docs/package-structure.md`), that `src/styles/_charts-component-tokens.scss` still lists the Carbon component tokens `styles.css` registers, and that the `.cds--btn` rule count of `styles.css` and `charts.css` does not jump (a second Carbon compile; `charts.css` has one, Charts' own).
2. `@carbon/ai-chat` peers a `@carbon/web-components` range; keep `@carbon/web-components` inside it.
3. `DataGrid` reads a TanStack Table internal (`_features`) to detect which features a table has; a TanStack update can rename it, so run the `DataGrid` tests and stories after each update.
4. `scripts/check-example.mjs` finds each library's JavaScript by a marker string: `cds--cc--` (Carbon Charts), `_echarts_instance_` (ECharts), `afframe-data-grid` (the data grid), `cds-aichat-react` and `conversational_search` (AI chat). The absence checks on `/`, `/dark`, `/system`, `/labs`, `/afframe`, `/chat`, `/shell` and `/chat-elements` still pass if a marker disappears upstream; the presence checks catch it: on `/extras`, `conversational_search` on `/chat` and `/chat-elements`, every marker somewhere in the build output, and the lazy-chunk check on `/chat-elements`. That last check looks for the chunk file names in the route's client JavaScript, as Turbopack writes them; a change in the Next.js bundler or its chunk layout can break it. After an update, grep each new package for its marker and replace one that is gone.
5. When a run reloads the browser mid-test, add the new dependency to `optimizeDeps.include` in `vitest.config.ts` (`docs/testing.md`).

## Moving to Carbon v12

When Carbon v12 is stable:

1. Move `@carbon/react`, `@carbon/styles` and related packages to v12, and IBM Products to the version that supports it.
2. Remove the v12 flags from `AfframeProvider` and the Sass build.
3. Switch the migrated components from IBM Products' `preview__` and `previewCandidate__` exports to Carbon core behind the same Afframe names (ADR 0005), and remove the IBM Products canary settings from the `AfframeProvider` module.
4. Run Carbon's codemods (`@carbon/upgrade`) where they apply.
5. Move the extras with Carbon: `@carbon/ai-chat` 2.x, which needs `@carbon/web-components` 3, and a Carbon Charts version that supports v12 (carbon-charts issue #2098). Drop the v12 `OverflowMenu` flag that `DataGrid` row actions set locally.
6. Move the Afframe components off their IBM Products and preview imports: `StatusIndicator` uses Carbon's `preview__IconIndicator` and `preview__ShapeIndicator`, `EditTearsheet` uses IBM Products' `preview__Tearsheet`, and `CreateSidePanel` and `EditSidePanel` use IBM Products' `SidePanel`. Take the stable names when they land in core, and rerun those components' tests, play tests and visual tests.
7. Recheck the header workarounds. `HelpMenu` and `EnvironmentSwitcher` render Carbon's `HeaderPanel` with `addFocusListeners={false}`, because in controlled mode its focus listeners close twice, reopen on a click on the action and never return focus; `HelpMenu` wraps `Switcher` in its own element, because `HeaderPanel`'s outside-click handler runs only for a direct `Switcher` child; `SwitcherItem`'s types lack `as`, `id` and `aria-describedby`. `LogoutBanner` sets `enableFocusWrapWithoutSentinels` locally on its `ActionableNotification`, which otherwise adds two tabbable focus sentinels. Drop each when v12 makes it unnecessary, and check that `HeaderGlobalAction`, `HeaderPanel`, `Switcher`, `SwitcherItem` and `SwitcherDivider` keep their names.
8. Recheck `renderChatElement` against `@carbon/ai-chat` 2.x, since it relies on `renderUserDefinedResponse` and the `RenderUserDefinedState` type, and re-run the chat element comparison (above).
9. Recheck the dialog workarounds once `enable-dialog-element` is default (`docs/feature-flags.md`): the own initial focus of the modals and the create and edit components, and the Tab wrap of CreateModal, EditTearsheet and the discard dialog. Drop one when Carbon or Chromium no longer needs it.
10. Update the ADRs and docs this changes.

The deprecated IBM Products components that Afframe replaces (CreateModal, CreateSidePanel, EditSidePanel, EditTearsheet, EditFullPage, RemoveModal, ImportModal, ExportModal, APIKeyModal, StatusIcon, StatusIndicator, DescriptionList) are not imported by Afframe code. IBM marks them deprecated with no removal version in 2.100.0; when an update removes them, only the excluded-pages table above changes.
