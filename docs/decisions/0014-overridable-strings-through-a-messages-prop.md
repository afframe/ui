# 14. Overridable strings through a messages prop

Date: 2026-10-07

Amended: 2026-10-13, 2026-10-15

## Status

Accepted, amended 2026-10-13 (content props) and 2026-10-15 (plain numbers at most 2 decimals). Refines [ADR 0012](0012-i18n-ready-english-czk.md).

## Context

ADR 0012 requires every user-facing string of an Afframe-owned component to be overridable. The app has no translation system yet, and Afframe components render on the server as well as in the browser.

## Decision

- Each Afframe-owned component takes `messages?: Partial<<Name>Messages>` and exports its English defaults as `default<Name>Messages`. `resolveMessages` (`src/messages.ts`) merges the defaults with the overrides.
- A message is a string, or a function when the string needs a value (for example a count).
- Messages cover accessible names, `aria-label`s, tooltips, empty and loading states, and the strings Carbon takes as props. Numbers, currencies and dates are not messages; they come from the formatters.
- Formatting defaults: locale `cs-CZ`, time zone `Europe/Prague`, currency `CZK`, amounts as numbers rounded to the currency's minor digits, other numbers to at most 2 decimals. Each is overridable per call or per component. The values live in `src/format/defaults.ts`.

## Amendment 2026-10-13: content props

Titles and descriptions are content props, not messages. They name what the component shows, so the caller always sets them and they have no English default: the nine Afframe dialogs and flows take `title` (required), `label` and `description` as props. Messages keep the fixed interface strings (buttons, accessible names, states, errors).

## Consequences

- Works in server components, with one limit: a function cannot be passed from a server component to a client component, so a server component can override only the string-valued messages of a client component. Function-valued overrides are set in a client component.
- A provider for app-wide messages can be added later without breaking components.
- Carbon's `translateWithId` stays Carbon's.
- `AmountInput` builds on Carbon `NumberInput` with `type="text"`, which Carbon marks experimental. A Carbon update can change its behaviour; check the `AmountInput` tests after each update.
