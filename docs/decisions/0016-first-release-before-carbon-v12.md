# 16. First release before Carbon v12

Date: 2026-10-07

## Status

Accepted. Supersedes [ADR 0013](0013-no-releases-until-the-plan-is-finished.md).

## Context

ADR 0013 held every release until the work plan was finished, and the last open item, the move to Carbon v12, waits for IBM to ship v12 as stable. The package is usable on stable Carbon v11 with the v12 flags on (ADR 0002), and apps need an installable version now.

## Decision

Releases are made from `afframe/ui`. They are published to GitHub Packages under the `@afframe` scope from a `v*` version tag, by `.github/workflows/release.yml`. The move to Carbon v12 (issue #2) is a later release.

## Consequences

- Apps install released versions instead of the packed tarball.
- The release steps live in `docs/developer-handbook.md`; the release sets the version and removes `private` from `package.json`.
- Storybook is still built in CI as an artifact and has no public deploy; anyone who uses the package runs it from the repo.
