# 13. No releases until the plan is finished

Date: 2026-10-05

## Status

Superseded by [ADR 0016](0016-first-release-before-carbon-v12.md).

## Context

Release planning, interim versions and deadlines add process before there is anything worth releasing.

## Decision

Nothing is published while the work plan runs: no interim versions, no automatic publishing from `main`, no deadlines. The plan is the first goal. When it is finished and merged, the first normal release is made, and apps install normal releases from then on.

## Consequences

Consumers cannot install the package until the first release. During the work, the example app installs the locally packed tarball. The release process (versioning, changelog, publishing to GitHub Packages) is set up when the plan is finished. Storybook is built in CI as an artifact and has no public deploy; anyone who uses the package runs it from the repo.
