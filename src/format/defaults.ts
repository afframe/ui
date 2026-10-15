// Business formatting defaults (ADR 0012, ADR 0014): Czech locale, CZK,
// Prague time. Every function takes an override per call.
export const defaultLocale = 'cs-CZ';
export const defaultCurrency = 'CZK';
export const defaultTimeZone = 'Europe/Prague';
export const defaultMaxFractionDigits = 2;
// The system date and time format (ADR 0021): every date field, placeholder,
// picker and Czech `formatDate` output follows it. Grammar: `pattern.ts`.
export const defaultDateFormat = 'dd.mm.yyyy';
export const defaultTimeFormat = 'hh:mm';
