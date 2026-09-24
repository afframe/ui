> **Pre-verification draft, kept as evidence.** `round4/V4-recommendation.md` verifies it and overrides it where they differ.

# C: How Carbon builds and ships its packages

Scope: `@carbon/react` 1.117.0, `@carbon/styles` 1.116.0, `@carbon/ibm-products` 2.99.0,
`@carbon/ibm-products-styles` 2.95.0, `@carbon-labs/react-ui-shell` 0.106.0.
Sources: unpacked tarballs in `.context/research/pkg/`, `npm view --json`, `npm pack`,
and `gh api` reads of `carbon-design-system/carbon` and `carbon-design-system/ibm-products`
at `main`/latest tag content.

## 1. Source language share (src/, via `gh api git/trees`)

`carbon-design-system/carbon`, `packages/react/src/` (1685 tree entries):
456 `.js`, 363 `.tsx`, 204 `.ts`, 202 `.mdx`, 3 `.jsx`. Code files only
(js+jsx+ts+tsx=1026): TS share 55% (567/1026), JS share 45%.

`carbon-design-system/ibm-products`, `packages/ibm-products/src/` (1687 entries):
404 `.jsx`, 348 `.tsx`, 200 `.js`, 135 `.ts`, 148 `.scss`, 86 `.mdx`. Code files
(1087): TS share 44% (483/1087), JS/JSX share 56%. Both repos are mid-migration
to TypeScript; React is majority-TS, IBM Products is still majority-JS/JSX.

`.d.ts` production: not `tsc --emitDeclarationOnly` on the whole build. Both
`packages/react/tasks/build.js` and `packages/ibm-products/tasks/build.js` call
the TypeScript compiler API directly (`ts.createProgram` + `program.emit()`
with `declaration: true, emitDeclarationOnly: true`) against a **separate**
`tsconfig.declarations.json`, emitting once into `es/`, then copy every
`*.d.ts`(`.map`) file from `es/` into `lib/` with a small Node script
(`copyDeclarations`). This gives ESM and CJS output trees matching `.d.ts`
parity without running the type-emit twice. Evidence: `gh api
repos/carbon-design-system/carbon/contents/packages/react/tasks/build.js` and
`repos/carbon-design-system/ibm-products/contents/packages/ibm-products/tasks/build.js`.

For JS-only source files that lack a hand-written declaration, `tsc` still
emits `.d.ts` because `allowJs`/`checkJs` config picks them up (both repos are
mixed-language and the declaration tsconfig covers `src/**`); this file did
not independently re-derive tsconfig contents to confirm `allowJs`, so treat
that detail as (unverified).

## 2. Build tool and config

Both `@carbon/react` and `@carbon/ibm-products` build with **tsdown**
(rolldown-based bundler), not Babel/webpack/plain tsc, invoked from a custom
Node script (`tasks/build.js`), not from `package.json` scripts directly:

- `@carbon/react` build script (`package.json:36`): `"build": "yarn clean && node tasks/build-styles.js && node tasks/build.js"`.
- `@carbon/ibm-products` build script: `"build": "run-s clean build-all"` where
  `build-all` runs `build:js` = `"node tasks/build.js"` in parallel with
  `build:carbon`/`build:css`/`build:scss` (styles are just copied in from the
  sibling `ibm-products-styles` package, see section 4).

`tasks/build.js` in both repos runs tsdown twice per package, once per format:

```js
const formats = [
  { type: 'esm', directory: 'es' },
  { type: 'cjs', directory: 'lib' },
];
```

with `unbundle: true` (tsdown's `preserveModules` equivalent, so subpath
imports like `@carbon/react/es/internal/useEvent` keep working), `dts: false`
(declarations handled separately, see section 1), `platform: 'browser'`, and
`target: 'es2020'` for `@carbon/react` (comment: "Keep ES2020 for Jest/SSR
compatibility") and `'es2022'` for `@carbon/ibm-products`. Both scripts build
an `external` allow-list from `package.json` `peerDependencies` +
`dependencies` (+ `devDependencies` for react) so nothing outside the package
itself is bundled, except `@carbon/react` explicitly force-bundles
`es-toolkit` (`internals = ['es-toolkit']`) and `@carbon/ibm-products` force-
bundles `@carbon/ibm-products-utilities` ("Filter out
@carbon/ibm-products-utilities to embed it at build time"). Both scripts also
run a `patchCjsDefaultInterop` pass over the emitted `lib/` tree to fix a
known tsdown CJS default-export interop bug.

`@carbon/styles` has no JS build step of its own; its only build script is
`"build": "yarn clean && node tasks/build-css.js"`, a Sass+PostCSS compile
(section 4).

`@carbon-labs/react-ui-shell` builds via a shared script,
`"build": "node ../../../tasks/build.js"` (repo-root `tasks/build.js`),
producing the same `es/`+`lib/` split; its output tree shows the same
`_virtual`, `node_modules` (inlined helper) and per-component-folder layout as
`@carbon/react`, indicating the Carbon Labs repo reuses very similar tooling
to core Carbon rather than plain Rollup/Babel.

## 3. Output layout, package.json fields, module format, "use client"

All examined packages ship `es/` (ESM) + `lib/` (CJS), matching per-file
trees (verified by directory listing of the unpacked tarballs), except
`@carbon-labs/react-ui-shell` which uses the same `es/`/`lib/` pair but
exposes them through an `exports` map instead of `main`/`module`.

`@carbon/react` package.json (`.context/research/pkg/carbon-react-1.117.0/package/package.json`):
`"main": "lib/index.js"`, `"module": "es/index.js"`, `"types": "lib/index.d.ts"`,
`"sass": "index.scss"`, no `"exports"` field, no `"type"` field (so CJS is the
default resolution and `module`/consumers rely on bundler-specific `module`
field support, not Node's `exports` conditions). `"sideEffects"` is an
explicit array (`es/index.js`, `lib/index.js`, `src/index.js`,
`feature-flags.js` variants, `index.scss`, `**/*.scss`, `**/*.css`) rather
than `true`/`false`, i.e. Carbon marks almost everything as a side-effectful
entry, which limits tree-shaking granularity to what's not listed.

`@carbon/ibm-products` package.json mirrors this: `main`/`module`/`types`
fields, no `exports`, `sideEffects` array covering `**/*.css`, `**/*.scss`,
and one JS utils file.

`@carbon-labs/react-ui-shell` package.json (from `npm pack`) differs: `"type":
"module"`, and a real conditional `exports` map:
```json
"exports": {
  ".": { "import": "./es/index.js", "require": "./lib/index.js" },
  "./es/*": "./es/*", "./lib/*": "./lib/*", "./scss/*": "./scss/*"
}
```
This is a newer, more modern Node `exports`-based dual package versus the
older `main`/`module` convention still used by core `@carbon/react` and
`@carbon/ibm-products`. Note: this package's published `dependencies` only
list `@ibm/telemetry-js`; it declares **no** `peerDependencies` on `react` or
`@carbon/react` at all (confirmed by both `npm view --json` and the tarball
`package.json`) - likely relies on the consumer already having those from the
core Carbon packages. Flag this as worth re-checking before depending on it: (unverified beyond what's in the published manifest - could be an omission).

`"use client"` directive placement: checked by `grep -rl "use client"` across
each unpacked `lib/` and `es/` tree.
- `@carbon/react`: exactly 1 match in `lib/index.js` and 1 in `es/index.js`
  (line 8, at the top of the entry file only) - not per-component file.
- `@carbon/ibm-products`: 0 matches anywhere in `lib/` (87 component
  directories checked) - no `"use client"` directive at all in this package's
  build output.
- `@carbon-labs/react-ui-shell`: 0 matches in `es/`/`lib/`.

Target/format: ESM (`es/`) and CJS (`lib/`) both produced from the same
tsdown invocation pair, `unbundle: true` preserves per-file module structure
(not a single bundled chunk), target `es2020`/`es2022` (not further
down-transpiled to es5).

## 4. Dependencies vs peerDependencies, bundling

`@carbon/react` (`packages/react/package.json`): `peerDependencies` = react,
react-dom, react-is, sass. `dependencies` include `@carbon/feature-flags`,
`@carbon/icons-react`, `@carbon/layout`, `@carbon/motion`, **`@carbon/styles`**,
`@carbon/utilities`, plus non-Carbon libs (floating-ui, downshift, motion,
tabbable, etc). So within `@carbon/react` itself, `@carbon/styles` is a
regular dependency, not a peer - Carbon does NOT ask consumers to separately
install `@carbon/styles` alongside `@carbon/react`.

`@carbon/ibm-products` (`packages/ibm-products/package.json`):
`peerDependencies` = `@carbon/grid`, `@carbon/layout`, `@carbon/motion`,
**`@carbon/react`**, `@carbon/themes`, `@carbon/type`, react, react-dom,
react-is. `dependencies` include **`@carbon/ibm-products-styles`**,
`@carbon/feature-flags`, `@carbon/telemetry`, `@carbon/utilities`,
`@carbon/utilities-react`, plus non-Carbon libs (`@dnd-kit/*`, `react-table`,
`react-window`, etc). So `@carbon/react` (the core component/runtime
dependency) IS a peer dependency, confirming the "does not bundle Carbon"
framing for the main React runtime - but `@carbon/ibm-products-styles` (the
matching stylesheet package) is an ordinary `dependency`, auto-installed
with `@carbon/ibm-products`, not a peer the consumer chooses separately.

Nothing is bundled into the JS output beyond the two explicit exceptions
noted in section 2 (`es-toolkit` for `@carbon/react`, `@carbon/ibm-products-utilities`
for `@carbon/ibm-products`); every other `dependencies`/`peerDependencies`
entry is passed through `getExternalPatterns()` and marked external to
tsdown, so it stays a real `require`/`import` at runtime.

Verdict on brief claim 1: **confirmed with a nuance.** Core Carbon packages
(`@carbon/react`, `@carbon/grid`, `@carbon/layout`, `@carbon/motion`,
`@carbon/themes`, `@carbon/type`) are peer dependencies of `@carbon/ibm-products`
and are not bundled into its JS output. But the matching styles package,
`@carbon/ibm-products-styles`, is a regular `dependency` (auto-pulled in),
not a peer - so "Carbon packages are peer dependencies" needs to be scoped to
the component-runtime packages, not the styles package.

## 5. Styles: Sass source + prebuilt CSS, v11/v12, prefix, ibm-products-styles split

Both `es`+`lib` are JS output; styles ship separately and are unrelated to
the tsdown build. All four packages ship BOTH raw `.scss` and prebuilt `.css`:

- `@carbon/styles` `files`: `["css", "scss", "index.scss", "telemetry.yml"]`;
  unpacked tarball contains `css/styles.css`, `css/styles.min.css`, and a full
  `scss/` tree. Build script: `"build": "yarn clean && node tasks/build-css.js"`.
- `@carbon/ibm-products` `files`: `["css", "es", "lib", "scss", "flags.js", ...]`;
  unpacked tarball `css/` has 6 CSS variants (`index.css`,
  `index-full-carbon.css`, `index-without-carbon.css`,
  `index-without-carbon-released-only.css`, each plus `.min.css`) and a
  `carbon.css`/`config.css`/`config-dev.css` set, each with source maps.
  `scripts.build:carbon` compiles a Storybook-only `carbon.scss`; the CSS in
  `css/` other than `carbon.css`/`config*.css` is copied in from the sibling
  `ibm-products-styles` package (`build:css`: `copyfiles
  '../ibm-products-styles/css/**/*.*' ./ -u 2`), not compiled directly in
  `ibm-products`.
- `@carbon/ibm-products-styles` (`packages/ibm-products-styles/package.json`)
  is where the actual CSS variants are compiled, via plain Sass CLI, not the
  `sass` npm API with any flag override:
  ```
  "build:css-dev": "sass -q --quiet-deps --style=expanded --load-path node_modules --load-path ../../node_modules scss:css",
  "build:css-min": "sass -q --quiet-deps --style=compressed --load-path node_modules --load-path ../../node_modules scss/index.scss:css/index.min.css scss/index-full-carbon.scss:css/index-full-carbon.min.css scss/index-without-carbon.scss:css/index-without-carbon.min.css scss/index-without-carbon-released-only.scss:css/index-without-carbon-released-only.min.css"
  ```
  `scss/index.scss` = "Index with minimal Carbon styles, only the styles of
  Carbon components used by our components" (forwards `index-with-carbon`);
  `scss/index-without-carbon.scss` forwards the IBM-Products-only component
  styles and omits the bundled Carbon component styles, for consumers who
  already load `@carbon/styles`/`@carbon/react` CSS separately and want to
  avoid duplicate Carbon rules. `index-full-carbon`/`index-without-carbon` are
  therefore the two ends of "how much of Carbon's own component CSS gets
  duplicated into the IBM Products bundle," not a v11/v12 split.

**v11 vs v12 in the prebuilt CSS**: `packages/styles/tasks/build-css.js`
(fetched from `carbon-design-system/carbon` main) compiles `styles.css`/
`styles.min.css` from:
```js
const entrypoint = `
  @use '../index.scss' with (
    $use-akamai-cdn: true,
    $fonts: ( ... ),
  );
`;
const { css } = sass.compileString(entrypoint, { loadPaths });
```
There is no `@use '@carbon/styles/scss/feature-flags' with ($feature-flags:
('enable-v12-release': true))` override anywhere in this script - the
prebuilt CSS is compiled with Carbon's default flag state, and Carbon's own
`docs/working-with-v12.md` states the v12 flag "defaults to `false` so normal
v11 usage stays unchanged." `@carbon/ibm-products-styles`'s `sass` CLI
invocations shown above likewise pass no feature-flag override. Carbon's
official Next.js example (`examples/nextjs`, `src/scss/styles.scss`) also
`@use`s `@carbon/react/scss/*` modules with no v12 flag. This is direct,
converging evidence for claim 3.

Verdict on brief claim 3: **confirmed.** IBM's/Carbon's precompiled CSS
(`styles.min.css`, and the `ibm-products-styles`/`ibm-products` `css/*`
variants) is built with the v12 flag off (v11-styled); full v12 requires a
consumer-side Sass compile of `@carbon/react/scss` (or `@carbon/styles/scss`)
with:
```scss
@use '@carbon/styles/scss/feature-flags' with (
  $feature-flags: ( 'enable-v12-release': true )
);
```
placed before `@use '@carbon/styles';` (source: Carbon's own
`.storybook-v12/main.ts` Vite Sass config, quoted in
`docs/working-with-v12.md`, and `docs/guides/sass.md`'s general feature-flag
`with`/`enable()` syntax).

**IBM Products and v12**: a `gh api search/code` query for
`enableV12Release` scoped to `carbon-design-system/ibm-products` returned no
hits, and the `@carbon/ibm-products` README's "Package prefix"/"Canary
components" sections make no mention of the v12 release flag. IBM Products
2.99.0 does not itself configure or require `enable-v12-release`; a consumer
combining `@carbon/react` (v12 flag on) with `@carbon/ibm-products` styles
would need to opt IBM Products component Sass into the same flag state
themselves if/when IBM Products' own styles start branching on it - this
repo's build scripts give no evidence IBM Products styles currently branch on
`enable-v12-release` at all. Mark this as (unverified) beyond "no reference
found in the repo."

**Prefix handling (`cds` / `c4p`)**: `@carbon/styles` default `$prefix` is
`cds` (`docs/guides/sass.md` config table). `@carbon/ibm-products` defaults
to `c4p` for CSS selectors and JS settings (`packages/ibm-products/README.md`
"Package prefix" section). To change it, README instructs setting
`pkg.prefix = 'tst'` from `@carbon/ibm-products/es/settings` before any
component renders, and passing `$pkg-prefix: 'tst'` when `@use`-ing
`@carbon/ibm-products/scss` (whole-library) or
`@carbon/ibm-products/scss/config` (per-component imports). This is
independent of the Carbon `$prefix` variable (`cds`).

**How consumers are told to import styles**: `@carbon/ibm-products/README.md`
"Installing" section: install `@carbon/ibm-products`, then
`import '@carbon/ibm-products/css/index.min.css';` in `index.js` (prebuilt
CSS route) - that README does not show the Sass-compile route as the primary
instruction, only the prefix section mentions `@use`-ing the `scss` entry
points. `@carbon/ibm-products-styles/README.md` says the CSS can also be
loaded independently of the JS package, and to see the core `ibm-products`
README for prefix instructions.

Verdict on brief claim 2: **confirmed.** All four packages (`@carbon/styles`,
`@carbon/react` - via `@carbon/styles`, `@carbon/ibm-products`,
`@carbon/ibm-products-styles`) ship both an `scss/` source tree and a
prebuilt `css/` tree in their published `files` list and unpacked tarballs.

## 6. Recommended consumer setup (Next.js / Vite)

Next.js: `carbon-design-system/carbon` repo's own `examples/nextjs`
(`next.config.js`) sets only:
```js
const nextConfig = {
  reactStrictMode: true,
  turbopack: { root: __dirname },
  sassOptions: { quietDeps: true },
};
```
No `transpilePackages` entry for `@carbon/react` is present in that example's
`next.config.js` - a `gh api search/code` for `transpilePackages` scoped to
`carbon-design-system/carbon` returned no hits, so Carbon's own example does
not show it as required (unverified whether some consumer setups still need
it for other bundling reasons; not corroborated in Carbon's own repo).
`sass` is a `devDependency` in that example (`^1.93.2`), consistent with
`@carbon/react`'s `peerDependencies.sass: "^1.33.0"` (optional-style, since
`@carbon/styles` also lists `sass` as an optional peer via
`peerDependenciesMeta.sass.optional: true`).

Vite/Sass config (`docs/guides/sass.md`, "Config variables" table): set
`$font-path: '@ibm/plex'` "When using Vite" (the default `~@ibm/plex` is a
webpack-style tilde alias that Vite's Sass resolver does not understand).
General optimization guidance: `@use '@carbon/styles/scss/<path>'` per-module
imports to avoid pulling in the full stylesheet, and keep `@use
'@carbon/styles';` (or the feature-flags/config `@use`) as the last `@use` in
the entry file since Sass modules can only be configured once.

## 7. Claim verdicts summary

1. **Confirmed with nuance.** `@carbon/ibm-products` ships both `es/` (ESM)
   and `lib/` (CJS) with matching `.d.ts` trees, `types: "lib/index.d.ts"`.
   Core Carbon runtime packages (`@carbon/react`, `@carbon/grid`,
   `@carbon/layout`, `@carbon/motion`, `@carbon/themes`, `@carbon/type`) are
   `peerDependencies`, not bundled. Correction: `@carbon/ibm-products-styles`
   (the CSS package) is a regular `dependency` of `@carbon/ibm-products`, not
   a peer - "Carbon packages are peer dependencies" is true for the
   component runtime but not for the styles package.
2. **Confirmed.** `@carbon/styles`, `@carbon/react` (via `@carbon/styles`),
   `@carbon/ibm-products`, and `@carbon/ibm-products-styles` all ship both
   `scss/` source and prebuilt `css/` in their published `files` arrays and
   unpacked tarballs (verified directory listings).
3. **Confirmed.** `packages/styles/tasks/build-css.js` and
   `packages/ibm-products-styles/package.json`'s `sass` CLI build scripts
   compile with no v12 feature-flag override; Carbon's own
   `docs/working-with-v12.md` states `enable-v12-release` "defaults to
   `false` so normal v11 usage stays unchanged," and shows the exact `@use
   '@carbon/styles/scss/feature-flags' with ($feature-flags: (...))` snippet
   consumers need for a full v12 Sass compile.
4. **Confirmed.** `@tanstack/react-table@9.2.4` (`latest` dist-tag) has
   `"type": "module"` and an `exports` map whose entries (`.`, `./legacy`,
   `./flex-render`, `./static-functions`, `./experimental-worker-plugin`) are
   all plain `.js` paths with no `require` condition; the unpacked tarball's
   `dist/` directory contains only `.js` files, no `.cjs`.

Unverified items called out inline above: whether `allowJs`/`checkJs`
produces `.d.ts` for the remaining plain-JS source files in each package;
whether `@carbon-labs/react-ui-shell`'s missing `react`/`@carbon/react`
`peerDependencies` is intentional; whether IBM Products component Sass
currently branches on `enable-v12-release` anywhere not surfaced by the
`search/code` query used; whether `transpilePackages` is needed in some
Next.js setups despite its absence from Carbon's own example.
