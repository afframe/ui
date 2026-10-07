# Package structure

Structure of `@afframe/ui`: folders, entry points and what ships in the package.

## Source

```
src/
├── index.ts               # the public entry: components and AfframeProvider
├── icons.ts               # @afframe/ui/icons
├── pictograms.ts          # @afframe/ui/pictograms
├── tokens.ts              # @afframe/ui/tokens
├── labs/<package>.ts      # Carbon Labs exports, one 'use client' module per Labs package
├── components/<Name>/     # Afframe-owned components and extras, or docs-only folders for re-exported components
├── format/                # business formatting: amounts, numbers, dates, date-range presets (server-safe)
├── theme/                 # useAfframeTheme and useCarbonTheme ('use client')
├── messages.ts            # resolveMessages, for each component's messages prop (ADR 0014)
├── provider/              # AfframeProvider
└── styles/                # Sass entries for styles.css and charts.css
```

A component folder holds everything for that component, as in Carbon:

| File                     | What                                                                                          |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| `<Name>.tsx`             | the component                                                                                 |
| `<Name>.stories.tsx`     | stories (not shipped)                                                                         |
| `<Name>.mdx`             | docs page (copied from Carbon or IBM Products and extended, or written in the same structure) |
| `<Name>.test.tsx`        | tests (not shipped); `*.test.ts` for code without JSX                                         |
| `<Name>.visual.test.tsx` | visual tests of Afframe-owned components (not shipped)                                        |
| `messages.ts`            | the component's messages type and English defaults, when they need their own file             |
| `_<name>.scss`           | styles, using Carbon tokens only                                                              |
| `index.ts`               | the folder's exports                                                                          |

Only Afframe-owned components get a full folder. A Carbon, IBM Products or Labs component that Afframe does not change is re-exported from `src/index.ts` as it is; its copied docs page and stories (`<Name>.mdx`, `<Name>.stories.tsx`) sit in a docs-only `src/components/<Name>/` folder. Docs-only folders: more than 70 Carbon components, the IBM Products components, the Labs components (UIShellLabs, WhatsNew, FirstTimeOrientation, Calendar, TagInput, TextHighlighter, ThemeSettings, Processing, Resizer), and the foundation pages `Icons`, `Pictograms`, `Plex` and `Tokens`.

Folders with code:

| Folder                 | What                                                                                                 | Label     |
| ---------------------- | ---------------------------------------------------------------------------------------------------- | --------- |
| `DataGrid`             | data grid on TanStack Table (`@tanstack/react-table`, `@tanstack/react-virtual`) and Carbon          | `afframe` |
| `FilterPanel`          | filter panel and filter flyout, controlled                                                           | `afframe` |
| `ControlledDatePicker` | Carbon's classic `DatePicker` with a controlled `open` prop, through its flatpickr instance          | `afframe` |
| `Amount`               | an amount formatted by `src/format`, server-safe                                                     | `afframe` |
| `AmountInput`          | money field on Carbon `NumberInput`                                                                  | `afframe` |
| `Charts`               | Carbon Charts (`@carbon/charts-react`) by IBM's names, themed by `useCarbonTheme`                    | `extras`  |
| `ECharts`              | `EChart`, a thin ECharts wrapper (`echarts/core`) with the Carbon theme (`@carbon/echarts-theme`)    | `extras`  |
| `AIChat`               | IBM's AI chat (`@carbon/ai-chat`) by IBM's names                                                     | `extras`  |
| `CreateModal`          | create form in a Carbon `Modal`                                                                      | `afframe` |
| `CreateSidePanel`      | create form in IBM Products' `SidePanel`                                                             | `afframe` |
| `EditSidePanel`        | edit form in IBM Products' `SidePanel`                                                               | `afframe` |
| `EditTearsheet`        | edit form in IBM Products' `Tearsheet` (`preview__Tearsheet`), with `EditTearsheetForm`              | `afframe` |
| `EditFullPage`         | edit form on a page, with a sticky action bar                                                        | `afframe` |
| `RemoveModal`          | delete or remove confirmation, optionally by typing the name                                         | `afframe` |
| `ImportModal`          | file or URL import, with its own file type and size checks                                           | `afframe` |
| `ExportModal`          | export with a file name, format and optional password                                                | `afframe` |
| `APIKeyModal`          | name and generate an API key, shown once; rename in edit mode                                        | `afframe` |
| `StatusIndicator`      | status on Carbon's preview `IconIndicator` and `ShapeIndicator`, server-safe                         | `afframe` |
| `DescriptionList`      | key and value list on Carbon's `StructuredList`, server-safe                                         | `afframe` |
| `AccentTag`            | clickable Carbon `OperationalTag` with a tooltip and a coloured strip, sizes `md` (default) and `lg` | `afframe` |
| `EnvironmentSwitcher`  | header action named by the current environment, with a panel of radio buttons to switch it           | `afframe` |
| `HelpMenu`             | header help action with a panel of links and actions (Carbon `HeaderPanel` and `Switcher`)           | `afframe` |
| `LogoutTile`           | signed-in user tile with the log-out action, for a header profile panel                              | `afframe` |
| `LogoutBanner`         | session ending and signed-out banner on Carbon's `ActionableNotification`                            | `afframe` |
| `ChatElements`         | chart renderer for `user_defined` items of IBM's AI chat, also usable alone                          | `afframe` |

Two internal folders hold shared code and are not exported, have no `index.ts` and no docs page: `CreateEditFlow` (the create and edit flow behind the five create and edit components: dirty state, the discard dialog, the focus trap) and `ModalParts` (shared pieces of the four modals: pending and error state, initial focus and focus return, common messages).

`src/components/HelpMenu/useHeaderPanel.ts` is internal too: the open state and focus handling of the two header actions, `HelpMenu` and `EnvironmentSwitcher`. Only its `HeaderPanelActionProps` type is exported, through the `HelpMenu` index. `EnvironmentSwitcher` imports its values from that file, the one shipped import of another family's file outside the chat element engines. `src/components/LogoutBanner/storyShells.tsx` holds the story scaffolds of the four header components (a Carbon `Header` and the Labs shell); it is stories-only, imports the `src/index.ts` barrel and ships nothing.

The formatting docs page is `src/format/Formatting.mdx`.

Story titles of Afframe components: a family shares a group (`Components/Create and Edit/*`, `Components/Modals/*`, `Components/UI Shell/Afframe/*`, `Components/Chat Elements/*`), every other component sits flat under `Components/<Name>`, and the name is the component name in words (`Components/Data Grid`, `Components/Modals/API Key Modal`).

Every docs page is marked with where its component comes from: `carbon`, `ibm-products`, `labs`, `extras` or `afframe`. The stories file sets it as a Storybook tag (sidebar badge and tag filter), and the page shows it under the title with `<SourceLabel name="..." />` from `.storybook/`.

## Entry points

| Import                   | Contents                                                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@afframe/ui`            | every component (Carbon re-exports, IBM Products, Labs, extras such as charts, ECharts, AI chat and the data grid, Afframe components) and `AfframeProvider` |
| `@afframe/ui/icons`      | Carbon's icons (`@carbon/icons-react`) with Carbon's names                                                                                                   |
| `@afframe/ui/pictograms` | Carbon's pictograms (`@carbon/pictograms-react`) with Carbon's names                                                                                         |
| `@afframe/ui/tokens`     | Carbon's JavaScript token values (`@carbon/themes`, `@carbon/motion`) with Carbon's names; the same tokens are CSS variables in `styles.css`                 |
| `@afframe/ui/format`     | the formatting functions of `src/format/` alone, for server code and scripts that should not load the component entry                                        |
| `@afframe/ui/styles.css` | the compiled stylesheet: Carbon, IBM Products, Labs and Afframe styles with the v12 flags on; themes `light`, `dark`, `system`                               |
| `@afframe/ui/charts.css` | the Carbon Charts styles; an app that renders Carbon Charts imports it after `styles.css`                                                                    |

TypeScript types ship with the package. ESM only. Components have one entry, and there is no server entry for them: Carbon's `es/index.js` already starts with "use client" and `src/index.ts` has no directive, so server-safe code stays usable on the server.

## Client and server-safe modules

| Module                                                                                                                                                                                                                                                                                                                                                                                            | Kind                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `src/format/`, `src/messages.ts`, `src/components/{Amount,StatusIndicator,DescriptionList}/`                                                                                                                                                                                                                                                                                                      | server-safe: no directive, no hooks, no browser globals |
| `src/components/{DataGrid,FilterPanel,AmountInput,Charts,ECharts,AIChat}/`, `src/components/{CreateModal,CreateSidePanel,EditSidePanel,EditTearsheet,EditFullPage}/`, `src/components/{RemoveModal,ImportModal,ExportModal,APIKeyModal,AccentTag,ControlledDatePicker}/`, `src/components/{EnvironmentSwitcher,HelpMenu,LogoutTile,LogoutBanner,ChatElements}/`, `src/theme/use-afframe-theme.ts` | `'use client'`, one module per family                   |

In a client family every component file starts with `'use client'`, not only `index.ts`, and `index.ts` uses named re-exports only. The internal `CreateEditFlow` and `ModalParts` files are client code too and ship only inside the families that import them. Shipped code never imports the `src/index.ts` barrel (a circular import), a `src/labs/` module or a `@carbon-labs/*` package (Labs JavaScript would ship on every route), and does not import the client module of another family, so a route that uses one extra does not ship the others. The header components (`EnvironmentSwitcher`, `HelpMenu`, `LogoutTile`, `LogoutBanner`) therefore work in Carbon's `Header` and in the Labs shell without importing Labs. Charts and ECharts load statically with their module; `AIChat` loads `@carbon/ai-chat` with `import()` in the browser, because the library defines custom elements when it loads, and takes its values from `@carbon/ai-chat/server`.

The heavy families `Charts`, `ECharts`, `DataGrid` and `AIChat` never import one another, and `AIChat` never imports `ChatElements`. `ChatElements` is the one exception: it renders Charts and ECharts, and imports each only through that family's `index.js`, with `import()` when an element first renders, so a route that imports it ships neither until a message needs one. From `AIChat` it takes types only; it never imports `DataGrid`.

tsdown inlines a module that only re-exports, and its directive with it. Each family `index.ts` and `src/theme/use-afframe-theme.ts` is therefore its own entry in `tsdown.config.ts`, and `check:pack` asserts `'use client'` on every family file that `dist/index.js` imports. The server-safe folders are not entries: tsdown inlines their re-export `index.ts`, so `check:pack` requires each one's component file (for example `dist/components/StatusIndicator/StatusIndicator.js`) and fails if any of their files starts with `'use client'`.

`check:pack` keeps its lists in `scripts/check-pack.mjs`: `clientFamilies` (the client families above, written out), `serverFamilies` (`Amount`, `StatusIndicator`, `DescriptionList`), `heavyFamilies` with `chatElementEngines` (the rule above) and `shellFamilies` (the header components); the Labs modules it derives from `src/labs/`. A new client family goes into `tsdown.config.ts` and `clientFamilies`; a new server-safe one goes into `serverFamilies` only.

`src/labs/` re-exports the Carbon Labs components, one module per Labs package (for example `src/labs/ui-shell.ts`, `src/labs/whats-new.ts`), each starting with `'use client'`, because no Labs package marks its own modules; without it a React server component could not import them. One module per package keeps a Next.js route that uses one Labs component from shipping the JavaScript of the other Labs packages (`scripts/check-example.mjs` checks it). `src/index.ts` re-exports each module, and `examples/nextjs` renders a Labs component from a server component. Labs names stay IBM's. Where one clashes with a Carbon name, Carbon keeps the name and the Labs export ends in `Labs`: `SideNavLabs`, `SideNavItemsLabs`, `SideNavLinkLabs`, `SideNavMenuLabs`, `SideNavMenuItemLabs` and `HeaderContainerLabs`. The Labs side navigation parts work only as a set. Values exported from the client modules reach a server component only as client references: `themeSets` is plain data and is exported from `src/index.ts` instead, and a server component passes `SIDE_NAV_TYPE` values as strings (`'default'`, `'rail'`, `'panel'`). `Profile` is a namespace: render `Profile.Root` and its parts from a client component.

## Styles

`src/styles/index.scss` (`styles.css`) loads Carbon once, then the other packages, then each Afframe component's `_<name>.scss`. `src/styles/charts.scss` (`charts.css`) compiles Carbon Charts' Sass on its own, after `_charts-component-tokens.scss` registers the Carbon component tokens `styles.css` registers, so the theme blocks Charts writes on `.cds--chart-holder` stay complete. An app that renders charts must import `@afframe/ui/charts.css`. Never load Charts' Sass after IBM Products in one compile: IBM Products' ConditionBuilder Sass reassigns the `$colors` map of `@carbon/colors`, which Charts reads when it loads.

## What ships

`files` in `package.json` is limited to `dist/` and the licence texts:

```
dist/
├── index.js, icons.js, ...  # per-file ESM, 'use client' kept on client modules
├── index.d.ts, ...          # declarations from tsc
├── styles.css               # opens with a licence banner
├── charts.css               # Carbon Charts styles, with a licence banner
└── fonts/                   # IBM Plex WOFF2, with OFL-1.1
LICENSES/
```

The root `LICENSE` is a symlink, which npm and pnpm do not pack; the texts ship in `LICENSES/`. No stories, tests, fixtures or examples ship. A pre-publish check on the packed tarball proves it.

## Outside the package

- `docs/registry.json` and `docs/registry.md`: every public export, generated by `pnpm registry` (`scripts/registry.mjs`) from `src/index.ts`, the subpath entries and `src/components`. `families` holds one entry per Afframe or extras module and per subpath, with folder, docs page, story title, exports and types; `upstream` holds one entry per Carbon, IBM Products and Labs value, with kind (component, hook, namespace or util, from the loaded value), source, import path, runtime, status and a docs page only when a folder has exactly its name. `pnpm registry --check`, part of `pnpm preflight`, fails on drift, on an Afframe folder without stories, test, visual test, docs page or export, and on an export whose module or docs page does not exist.
- `scripts/`: the CSS build, the packed-tarball and example checks, the licence-label check and the registry.
- `.storybook/`: Storybook config, the theme toolbar, the source label, and story templates copied from Carbon (`.storybook/templates/`), and static story assets served from the root (`.storybook/public/`).
- `storybook-static/`: Storybook build output, not committed.
- `examples/nextjs/`: example app with its own `package.json`, not a workspace member. The release checks install the packed tarball into it and build it, as a real consumer would.
