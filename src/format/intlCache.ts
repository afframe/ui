// Intl formatters are slow to build; tables and presets call them thousands of
// times, so each option set is built once.
// ponytail: cleared when full, an LRU if apps use many option sets.
export function intlCache<O, F>(
  Format: new (locale: string, options: O) => F
): (locale: string, options: O) => F {
  const formats = new Map<string, F>();
  return (locale, options) => {
    const key = `${locale}|${JSON.stringify(options)}`;
    let format = formats.get(key);
    if (!format) {
      if (formats.size >= 100) formats.clear();
      format = new Format(locale, options);
      formats.set(key, format);
    }
    return format;
  };
}
