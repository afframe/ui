# 20. Own formatters beside Carbon's dateTimeFormat

Date: 2026-10-15

Amended: 2026-10-15

## Status

Accepted, amended by [ADR 0021](0021-system-date-and-time-format-and-input-masks.md): the Czech date layout comes from the system date format. Builds on [ADR 0014](0014-overridable-strings-through-a-messages-prop.md) and the 2026-10-15 amendment of [ADR 0004](0004-scope-core-products-labs-extras.md).

## Context

ADR 0004 now brings in `@carbon/utilities`, whose `dateTimeFormat` formats absolute dates and times, relative times ("3 minutes ago") and durations with the browser's Intl APIs. Afframe already has its own date formatters in `src/format/` (`formatDate`, `formatDateRange` and the civil date helpers), with the defaults of ADR 0014: locale `cs-CZ`, time zone `Europe/Prague`.

`dateTimeFormat` returns Intl's output as it is. It has no default locale or time zone (it falls back to the runtime's), no civil `YYYY-MM-DD` dates, and in Czech it prints `7. 10. 2026`, where Afframe's business dates are `07.10.2026`. `relative.format` reads the clock when it runs, so the server and the browser can render different strings.

## Decision

- `src/format/` stays as it is and remains the way to show business dates (documents, ledgers, tables, filters).
- `dateTimeFormat` is re-exported unchanged from `@carbon/utilities`, by Carbon's name, from `@afframe/ui`. It is not in `@afframe/ui/format`, which holds only Afframe's server-safe formatters.
- Use `dateTimeFormat.relative` and `dateTimeFormat.duration` for relative times and durations, in client code, with an explicit `locale`.
- The Formatting page says which function to use for what; the `Utilities/dateTimeFormat` page is IBM's copied page.

## Amendment 2026-10-15: layout from the setting

Afframe's policy is no longer a literal `dd.mm.yyyy` in `formatDate`: Czech numeric dates follow `defaultDateFormat` and Czech times pad the hour to match `defaultTimeFormat` ([ADR 0021](0021-system-date-and-time-format-and-input-masks.md)). Other locales still print as Intl does.

## Options not chosen

- Wrap `dateTimeFormat` with Afframe's defaults: a second API for the same job, and still no civil dates or `dd.mm.yyyy`.
- Replace `src/format/` dates with `dateTimeFormat`: Czech dates would print `7. 10. 2026`, and the defaults would come from the runtime.
- Ask Carbon to print `dd.mm.yyyy`: it is Afframe's policy, not the CLDR format Carbon follows.

## Consequences

Two date APIs sit in one package; the Formatting page keeps them apart. A server-safe relative time formatter (one that takes "now" as an argument) can be added to `src/format/` later, when a server component needs one.
