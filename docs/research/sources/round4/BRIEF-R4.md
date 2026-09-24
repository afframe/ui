# Round 4 brief: build output (D4) and style delivery (D5)

Afframe UI (github.com/afframe/ui, public, PolyForm NC) is a React component package on IBM Carbon, published to GitHub Packages and installed by several Afframe repos. Decided: React only; one package; full native Carbon v12 via `@carbon/react` 1.117.0 + `<FeatureFlags enableV12Release>` + Sass compiled with `$feature-flags: ('enable-v12-release': true)` (IBM's prebuilt `styles.min.css` is v11-styled); IBM Products 2.99.0, Carbon Labs, TanStack Table v9 (ESM only), @carbon/ai-chat; source of 16 v12 components copied from carbon main (Apache-2.0 notices ship); Storybook not hosted; Carbon's native test stack.

Open questions:
- D4 build output: language (TypeScript / JS), module format (ESM only / ESM + CJS), Carbon as peer dependency or bundled, build tool.
- D5 style delivery: ship Sass source / compiled CSS / both.

Claims already told to Hleb that must be CONFIRMED or CORRECTED from primary evidence:
1. IBM Products ships TypeScript types, both ESM (`es/`) and CommonJS (`lib/`), and does not bundle Carbon (Carbon packages are peer dependencies).
2. Carbon and IBM Products ship styles both as Sass source and as precompiled CSS.
3. IBM's precompiled CSS is v11-styled; full v12 needs a Sass compile with the flag.
4. TanStack Table v9 is ESM only.

Evidence available locally: unpacked tarballs <npm pack>/ (carbon-react-1.117.0, carbon-ibm-products-2.99.0, carbon-styles-1.116.0), installed node_modules at <npm pack>/rt/node_modules and <sass-check>/node_modules (sass, @carbon/styles, @carbon/ibm-products-styles, @carbon/react). `gh` is authenticated (repos carbon-design-system/carbon, ibm-products, carbon-labs; hlebtkachenko/analytics). `npm pack`/`npm view` work.

Rules: primary sources (repo code, package.json, build configs, CI workflows, official docs); never Russian-language sources or .ru/.рф domains; cite file path:line or URL for every claim; mark "(unverified)"; English; no em-dash character; write only your own output file. Receipt under 1,500 characters: status, file, key findings, unverified.
