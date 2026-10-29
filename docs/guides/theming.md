# Theming

How Carbon v11 theming works and how `@afframe/ui` applies it. For maintainers and agents who change colours, type, shape or density in this repo. Consumer use (the `data-afframe-theme` attribute, the hooks, a theme switcher): the Theming docs page (`src/theme/Theming.mdx`).

## The token model

Carbon has five kinds of colour values.

| Kind             | What it is                                                                                                                                                                                                                                                                                         | Where                                                       |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Palette          | Fixed colours such as `$blue-60`, hover shades included. Sass and JavaScript only, never `--cds-*` properties.                                                                                                                                                                                     | `@carbon/colors`                                            |
| Theme tokens     | Four maps, `white`, `g10`, `g90`, `g100`, of role tokens (`background`, `layer-01`, `text-primary`, `interactive`, `focus`, `support-error`, the `ai-*` set and so on). Each map also carries the spacing and type tokens. Carbon ships four; Afframe uses `white` (light) and `g100` (dark) only. | `@carbon/themes/scss/generated/_themes.scss`                |
| Component tokens | Per-theme colours of five groups: button, notification, tag, status, content switcher. Carbon Charts adds its own group.                                                                                                                                                                           | `_tokens.scss` in each component folder of `@carbon/styles` |
| Layer aliases    | Unnumbered tokens (`--cds-layer`, `--cds-field`, `--cds-border-subtle`) that point at the numbered theme tokens of the current layer. `Layer` re-points them with `.cds--layer-one/two/three`.                                                                                                     | `@carbon/styles/scss/_layer.scss`, `layer/_layer-sets.scss` |
| Zones            | Classes `.cds--white`, `.cds--g10`, `.cds--g90`, `.cds--g100` that re-emit only the colour tokens and `color-scheme` of one stock map on an element, not spacing or type. Carbon's `Theme` component renders them.                                                                                 | `@carbon/styles/scss/_zone.scss`                            |

Facts that follow from the model:

- `button-primary` is a component token, not the theme token `interactive`. Changing `interactive` does not recolour primary buttons.
- Hover, active and selected colours are explicit values in the maps, not computed. Every colour needs its own hover, active and on-colour pair, in both themes.
- In component Sass a token is a reference: `theme.$background` compiles to `var(--cds-background, #ffffff)`. The fallback is the white value at compile time and applies only where no token is declared.
- `@carbon/themes`' `theme()` mixin writes one map as `--cds-*` properties, type tokens as `--cds-<token>-<property>`. The `@carbon/styles` wrapper adds `color-scheme`, a forced-colours block and the level-1 layer aliases.

## Runtime and compile time

Only some values reach Carbon components as runtime custom properties. The rest compile to fixed values inside `styles.css`.

| Value                                          | Runtime `--cds-*` read by Carbon components | Notes                                                                                                               |
| ---------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Theme colour tokens                            | Yes                                         |                                                                                                                     |
| Component tokens                               | Yes                                         | Resolved per theme at compile time, see the traps                                                                   |
| Layer aliases                                  | Yes                                         |                                                                                                                     |
| Type size, weight, line height, letter spacing | Yes                                         | Through Carbon's `type-style()` mixin; fluid type compiles to media queries                                         |
| Font family of code and quotation tokens       | Yes                                         | Only `code-01/02` (Plex Mono) and `quotation-01/02` (Plex Serif) carry one                                          |
| Body font family                               | No                                          | The `<body>` reset sets it from Sass `$font-families`; components inherit it or compile the stack in                |
| Layout size and density                        | Yes                                         | `--cds-layout-size-height-*`, `--cds-layout-density-padding-inline-*`, read by about 20 control and form components |
| Spacing                                        | No                                          | `--cds-spacing-*` exist on `:root` for your own CSS; Carbon components compile `$spacing-*` to rem                  |
| Sizes and heights                              | No                                          | Literal rem in component Sass                                                                                       |
| Radius                                         | No, with three exceptions                   | See Shape                                                                                                           |
| Motion                                         | No                                          | Literal durations and easings; `@afframe/ui/tokens` has the values for JavaScript                                   |
| Palette colours                                | No                                          |                                                                                                                     |

Values Sass computes from a token are fixed too: Carbon's AI skeleton colour and the hover shades of the chart data palettes.

There is no `--cds-body-01-font-family` and no generic `--cds-font-family`.

### Shape

The `$border-radius-*` variables of `@carbon/layout` exist, but every Carbon rule that reads them sits behind `enable-v12-release`, which is off ([ADR 0018](../decisions/0018-carbon-v11-without-v12-flags.md)). In v11 the visible corners are literals or 0, and IBM Products and Labs use fixed values as well. The runtime hooks are:

- `--cds-button-radius` and `--cds-button-radius-ss/se/es/ee`, read by every element styled with Carbon's button mixin; unset, buttons are square (Button docs page);
- `--cds-popover-border-radius` (default 2px);
- the AI chat `corners` setting and its `--cds-aichat-border-radius*` properties.

## How `styles.css` applies the theme

Carbon writes no theme tokens on `:root`. On `:root` it writes only `color-scheme`, the level-1 layer aliases and the layout size and density tokens; the theme maps are emitted on the zone classes. `src/styles/index.scss` therefore writes them itself:

- `:where(:root)` gets `theme.theme(themes.$white)`, with zero specificity;
- `:root[data-afframe-theme='dark']` gets `themes.$g100`, and so does `:root[data-afframe-theme='system']` inside `@media (prefers-color-scheme: dark)`;
- the dark block also sets the Labs TrialCountdown gradient, which Labs keys to Carbon's theme classes.

Both blocks pass the stock maps, so the component tokens resolve to their per-theme values. Each block writes the colour tokens, the spacing and type properties, the layer aliases, `color-scheme`, the forced-colours mapping and the registered component tokens. A zone class on a descendant (`.cds--g10`) still overrides the page theme there.

`src/styles/charts.scss` is a separate compile into `charts.css`. It registers the same five component-token groups (`src/styles/_charts-component-tokens.scss`) and then compiles Carbon Charts. It shares no Sass configuration with `index.scss`, so any Sass setting meant for charts must be repeated there.

## Where each surface gets its theme

| Surface       | Theme source                                                                                                                                                                                                                                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Carbon        | The `--cds-*` properties on `:root`, zones and layer classes. `AfframeProvider` passes `useCarbonTheme()` to `GlobalTheme`, which only sets React context.                                                                                                                                                            |
| IBM Products  | Carbon's tokens, spacing and type mixins, compiled from `index-without-carbon`. It also has palette and hex colours of its own (HTTPErrors, InlineTip, Coachmark, Guidebanner, ConditionBuilder, UserAvatar). Guidebanner re-emits stock `g100` on itself.                                                            |
| Carbon Labs   | Carbon's tokens where a package styles colour, under the `clabs` prefix. Processing draws its strokes with palette colours, so they ignore the theme.                                                                                                                                                                 |
| Carbon Charts | `.cds--chart-holder` re-emits the full stock `white` map, and `g10`, `g90` or `g100` from `data-carbon-theme`, which our wrapper sets from `useCarbonTheme()` unless `options.theme` is given. Data palettes are `--cds-charts-*` properties built from `@carbon/colors` at compile time. Per chart: `options.color`. |
| ECharts       | JavaScript themes `carbon-white` and `carbon-g100` from `@carbon/echarts-theme`, picked from `useCarbonTheme()`. The package bundles its own, older copy of `@carbon/themes` and `@carbon/colors`. The canvas reads no CSS, and the font stack is hard-coded Plex.                                                    |
| AI chat       | Shadow DOM. Custom properties inherit into it, so the chat takes the page's `--cds-*` tokens unless `injectCarbonTheme` is set (our wrapper does not set it). Own layer: `--cds-aichat-*` properties, `layout.customProperties` (keys with `$` set any `--cds-*` token inside the chat) and `corners`.                |

`@afframe/ui/tokens` exports `@carbon/themes` and `@carbon/motion` unchanged: the stock values, whatever `styles.css` renders. The Tokens docs page reads its value columns from those exports.

## What a change in this repo can reach

- **Colours**: theme tokens reach Carbon, IBM Products, Labs and AI chat at runtime, if every place that emits a theme sees the new values: the `:root` blocks, the zones, Guidebanner and `charts.scss`. Primary, secondary and tertiary buttons, tags, notifications, status and the content switcher need their component tokens changed as well. Not reached: ECharts (needs its own JavaScript theme), `@afframe/ui/tokens`, the `var()` fallbacks, palette-coded spots and the chart data palettes.
- **Density**: the layout size and density tokens change Carbon's controls at runtime. IBM Products, Labs, Charts and AI chat mostly use fixed sizes.
- **Typeface**: `$font-families` is a compile-time Sass map, replaced whole and set before `@carbon/type` loads. It changes the body reset, the compiled stacks and the code and quotation tokens. It also needs `@font-face` rules, a change to `scripts/build-css.mjs` (which copies the Plex files) and the font licence, and a repeat in `charts.scss`. ECharts and AI chat keep Plex. Carbon's line heights, letter spacing and fixed heights are tuned to Plex, so another face changes text fit everywhere.
- **Spacing and motion**: compile-time Sass (`$spacing-*`, `$duration-*` and the easings are `!default`). A change shifts every Carbon component; Labs, our own CSS and the chart libraries keep their own values.
- **Radius**: only the three hooks above respond while `enable-v12-release` is off.

## Traps

- **Component-token matching.** `@carbon/themes` picks a component token's per-theme value with `matches()`, which is true only when every key of a stock map has the identical value in the active map. A map merged from a stock map with one changed value matches none, so every component token falls back to its white value: a dark theme gets light-theme buttons, tags and notifications, with no error. Zones and `get-var` use the same test.
- **Places that re-emit stock themes.** Zones (`Theme`), `.cds--chart-holder` and Guidebanner write stock tokens on their own element, so a `:root`-only change is undone inside them.
- **Specificity.** Light is `:where(:root)`, `(0,0,0)`; dark is `:root[data-afframe-theme='dark']`, `(0,2,0)`. A `--cds-*` override on `:root` beats light and loses to dark. On any selector, an override is undone inside zones and chart holders and does not reach compiled values, so consumers do not redefine `--cds-*`.
- **Layers.** `layer-01..03`, `field-01..03` and `border-subtle-00..03` must stay distinct per level, each with its hover, active and selected values; the aliases depend on all three levels.
- **Contrast.** Carbon's pairs meet WCAG. Every changed colour needs checking on all three layers, in both themes and in forced-colours mode, where Carbon maps icon, link, focus and selected tokens to system colours. `docs/feature-flags.md` lists the stock values that are already borderline.
- **Dark parity.** Every light change needs its `g100` counterpart: theme, component, AI and chart tokens and the TrialCountdown gradient.
- **Visual baselines.** Every change except density moves most baselines; a typeface change moves all of them.

Sources: Carbon's [Sass theme docs](https://github.com/carbon-design-system/carbon/blob/main/packages/styles/docs/sass.md), [`@carbon/themes` Sass docs](https://github.com/carbon-design-system/carbon/blob/main/packages/themes/docs/sass.md) and the installed `@carbon/themes`, `@carbon/styles` and `@carbon/type` sources.
