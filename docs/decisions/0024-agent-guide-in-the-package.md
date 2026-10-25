# 24. Agent guide in the package

Date: 2026-10-19

Amended: 2026-10-25

## Status

Accepted, amended 2026-10-25 (sidebar order, source of each family)

## Context

Coding agents build UI in the repos that install `@afframe/ui`. The installed package carried only JavaScript, types and the README. The registry, the docs pages, Storybook and the consumer guide stay in this repo, so an agent in a consumer repo saw what exists but not the import and server/client rules or the names Afframe changes from upstream (`Tearsheet` for IBM's `preview__Tearsheet`, `SideNavLabs` for the Labs `SideNav`). Agents that follow upstream docs or the Carbon MCP then write upstream names or direct `@carbon/*` imports.

## Decision

The package ships one agent guide, `dist/agents.md`. `pnpm registry` generates it as `docs/agent-guide.md` (not `docs/agents.md`, which macOS treats as `docs/AGENTS.md`, an instruction file for this repo) from the sections "Wire it once" and "Use it" of `docs/guides/consuming.md`, quoted so the rules live in one file, and from the export registry: the renamed upstream exports, the Afframe families with source, runtime and exports, so an agent sees which ones Afframe owns, and every Carbon, IBM Products and Labs value, in Storybook's sidebar order (ADR 0019). `pnpm registry --check` fails on drift, `pnpm build` copies it into `dist/` and `check:pack` requires it. The consumer guide gives a short block for the consumer repo's `AGENTS.md` that points agents to it.

## Options not chosen

- Ship `registry.json` alone: a 120 KB export list with no rules and no upstream names.
- An MCP server: every agent environment has to configure it, and it has to find out which version each repo runs.
- A public Storybook: one version only, and fetch-based agent tools read rendered pages poorly (reopens ADR 0016).
- Per-component agent pages, the Storybook chooser tables as data, recipes: deferred. Revisit the chooser tables when agents pick the wrong component for a task twice, per-component pages when agents misuse a component's wiring after reading its types; recipes stay out of the package (ADR 0004).

## Consequences

- An agent reads about 24 KB that matches the installed version, offline.
- The guide's sections "Wire it once" and "Use it" are agent-facing text too; renaming their headings fails `pnpm registry`.
- Docs pages are not shipped: agents use the `.d.ts` files for props and the upstream docs under the upstream names.
