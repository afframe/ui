# Accent demo (experimental)

A throwaway demo of a user-chosen primary colour on top of `@afframe/ui`. It is not part of the package and not a design decision yet.

## Run

```sh
IBM_TELEMETRY_DISABLED=true pnpm build   # at the repo root, so dist/ exists
cd examples/accent-demo
IBM_TELEMETRY_DISABLED=true pnpm install
pnpm dev                                 # http://localhost:5199/
```

## How it works

`src/App.tsx` keeps saved colours and the selected one in localStorage. The selected colour is written as `--cds-*` custom properties inline on `<html>`, which wins over Carbon's theme selectors. Hover, active and dark shades come from CSS relative colours (`oklch(from <colour> ...)`). Which components follow the accent and which tokens the others read: `NOTES.md`. Screenshots: `screenshots/`.

## Open decisions for the real feature

| Option                           | How                                                                                                        | Consequence                                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| A. Presets from Carbon's palette | Sass emits token sets per `data-afframe-accent` on `<html>`, using Carbon palette steps for light and dark | No flash, SSR safe, contrast correct by construction; a fixed set of colours         |
| B. Any colour                    | `AfframeProvider` sets `--cds-*` from one colour, shades derived in CSS (this demo)                        | Any brand colour; needs a contrast check against `text-on-color` and own dark shades |

Either one is new public API and needs an ADR amending ADR 0006. Also to decide: whether toggle, checkbox, radio, slider, selected tile and tertiary button follow the accent (they read other tokens today), and Carbon Charts, which uses its own palette.
