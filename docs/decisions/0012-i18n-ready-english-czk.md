# 12. i18n-ready, English, left-to-right, CZK

Date: 2026-10-05

## Status

Accepted. Refined by [ADR 0014](0014-overridable-strings-through-a-messages-prop.md).

## Context

Afframe products may need other languages later. Carbon components accept translated strings through props; Afframe components add their own strings.

## Decision

Every user-facing string in Afframe-owned components is overridable and translatable. English is the only language for now. Left-to-right only, no RTL. Number and currency formatting defaults to CZK.

## Consequences

Translations can be added later without touching components. No RTL testing is needed.
