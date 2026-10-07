# 7. IBM Telemetry off

Date: 2026-09-24

## Status

Accepted

## Context

Almost every Carbon package (every `@carbon/*` package, `@ibm/plex`, most Labs packages) runs `ibmtelemetry` as a `postinstall` script. It reports repo, dependency and usage data to IBM when the install runs in CI or in a container. Nothing ships in the runtime bundle.

## Decision

Telemetry is off in this repo and in every consumer repo:

- `IBM_TELEMETRY_DISABLED=true` (this exact lowercase string) on every install: locally, in every CI job and in every container build.
- Under pnpm, `strictDepBuilds: false` in `pnpm-workspace.yaml`. Install scripts stay blocked; only the hard failure (`ERR_PNPM_IGNORED_BUILDS`) goes away. pnpm then writes the blocked packages under `allowBuilds` as undecided; setting each to `false` keeps the file stable. npm and yarn users rely on `IBM_TELEMETRY_DISABLED=true`.

Evidence: 21 of 22 `@carbon/*` and `@ibm/plex` packages run `ibmtelemetry` on postinstall. Checked on pnpm 12.9.1 on 2026-10-05: the default fails with `ERR_PNPM_IGNORED_BUILDS`, an `allowBuilds` wildcard does not match, and `strictDepBuilds: false` passes. A dependency cannot ship this setting.

## Consequences

Afframe UI cannot switch telemetry off for a consumer; each consumer repo carries the same settings (`docs/guides/consuming.md`). Blocking install scripts also blocks `@carbon-labs/vscode-snippets`, whose install script copies editor snippets.
