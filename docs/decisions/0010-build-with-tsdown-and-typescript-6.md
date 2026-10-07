# 10. Build with tsdown and TypeScript 6.0.3

Date: 2026-10-05

## Status

Accepted

## Context

TypeScript 7 exposes no classic compiler API. typescript-eslint and the Storybook docgen plugin do not support it yet. Carbon builds its packages with tsdown.

## Decision

- TypeScript 6.0.3 only. Move to TypeScript 7 when the tooling supports it. Dependabot ignores `typescript` major updates until the move to TypeScript 7.
- tsdown builds the JavaScript: ESM only, per-file output, `'use client'` kept on client modules.
- `tsc` emits the type declarations.
- Sass compiles `styles.css` (ADR 0006).

## Consequences

One TypeScript version for type checks, lint and docs. The TypeScript 7 move is a later, separate change.
