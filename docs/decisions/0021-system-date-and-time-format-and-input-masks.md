# 21. System date and time format and input masks

Date: 2026-10-15

## Status

Accepted. Amends [ADR 0004](0004-scope-core-products-labs-extras.md) (the date and time pickers are wrapped), [ADR 0014](0014-overridable-strings-through-a-messages-prop.md) (formatting defaults) and [ADR 0020](0020-own-formatters-beside-carbon-datetimeformat.md) (the date layout comes from the setting).

## Context

Afframe shows and takes dates in one shape, but the shape was spread over hard-coded story props and a Czech branch of `formatDate` with a literal `.` separator. Carbon's pickers default to `m/d/Y`, and nothing helps a person type a date: no separators are inserted, `1.1.2026` is not padded, and flatpickr's lenient parser rolls `31.02.2026` over to March. Carbon's `TimePicker` defaults to 12-hour input.

## Decision

- The setting is two compile-time constants in `src/format/defaults.ts`: `defaultDateFormat` and `defaultTimeFormat`. There is no provider setting: `formatDate` is server-safe and cannot read a React context. Changing the format is a package change and a release. A field overrides it with the picker's `dateFormat`, a `formatDate` call with `format`.
- Grammar: a date format has `dd`, `mm` and `yyyy` once each, in any order, joined by one separator character; a time format is 24-hour `hh:mm` or `hh:mm:ss`. `src/format/pattern.ts` (server-safe, in `@afframe/ui/format`) parses both and translates them to the flatpickr `dateFormat`, the placeholder and the input `pattern` attribute. It parses the constants when it loads, so a typo fails at once.
- `formatDate` and `formatDateRange` lay out numeric dates in the setting for the default Czech locale only; an explicitly passed other locale keeps Intl's output. Czech 24-hour times pad the hour (`09:05`). Seconds print only when the caller asks for them.
- Afframe wrappers under Carbon's names apply the setting and a typing mask: `DatePicker`, `FluidDatePicker`, `TimePicker` and `FluidTimePicker`; `ControlledDatePicker` builds on Afframe's `DatePicker`. A wrapper wraps the picker, not `DatePickerInput`: Carbon recognises its input by identity, so the wrapper clones Carbon's inputs with the mask props. Every wrapper takes `inputMask={false}` to get Carbon's behaviour back. `preview__DatePicker` gets only the system format and its placeholder: Carbon's preview ignores typed text, and Afframe's own components use the stable `DatePicker` until v12 (ADR 0004). Its docs stay in `src/components/DatePicker/`.
- The date pickers pass flatpickr a strict `parseDate`: a complete, zero-padded, calendar-valid date, or nothing. An invalid date (`31.02.2026`, an incomplete one, or one outside `minDate`, `maxDate`, `enable` or `disable`) keeps its text on blur, on Enter and in a range end, and marks the field invalid with an Afframe message (ADR 0014), overridable; the wrapper stops flatpickr and Carbon from clearing it. When the app held a date for that field, the picker calls `onChange` once with the date gone, so a controlled app drops the old date. When a controlled app empties a filled `value`, the inputs empty too; taking the picker's own empty `onChange` keeps the text. A value that is already empty gives no signal, so an app resets kept text by remounting the picker with a new `key`.
- Time fields are 24-hour by default everywhere (`hourCycle="h23"`); a field sets `hourCycle="h12"` for 12-hour input. Seconds are a per-field `seconds` prop, not a second constant.
- The mask runs on `beforeinput`: separators are inserted while typing, a first digit above a part's maximum is padded (`4` gives `04`), a typed separator pads a one-digit part (`1.` gives `01.`), stray separators are ignored, and an out-of-range two-digit part (`13` as a month) is not accepted. Paste, IME and autofill are normalised in `onChange`. `useInputMask` is exported for fields an app builds itself.
- Carbon Labs `Calendar` stays out: it is inline, takes no typing, and shows dates through Intl options.

## Options not chosen

- A runtime setting on `AfframeProvider`: server-rendered `formatDate` cannot read it, so it would be a second source that can disagree. A context with `defaults.ts` as its fallback can be added later without a breaking change.
- Wrappers on `DatePickerInput`: they fail Carbon's identity check and lose `datePickerType`.
- A hook-only recipe with no wrappers: every field would have to remember it.
- Carbon's `pattern` and `maxLength` alone: they validate after typing and insert nothing.
- A lenient parser that clamps the day: it silently changes what the person typed.
- Clearing an invalid date on blur (flatpickr's behaviour): the person loses the text.

## Consequences

- One constant re-aligns placeholders, masks, picker parsing and Czech `formatDate` output.
- `formatDate` output for Czech times changes from `9:05` to `09:05`.
- The wrappers depend on Carbon internals: the child-cloning branches of `DatePicker`, props reaching the `<input>`, flatpickr's blur and Enter, the flatpickr instance on the start input (`_flatpickr`), and the blur handler on a range end. Each Carbon update re-checks them (`docs/guides/updating-carbon.md`). `parseDate` goes away with flatpickr in Carbon v12 (Temporal internals); then only the parser changes.
- When v12 moves the stable `DatePicker` onto Temporal, the mask and the kept text move with it: Temporal's default overflow constrains `31.02` to `28.02` instead of rejecting it, so the strict parser stays in front of it.
