// Browsers compile the input `pattern` attribute with the `v` flag, where
// escaping a character that is not syntax (`\-`) is an error that drops the
// constraint, so only syntax characters are escaped.
/** Escapes the regular expression syntax characters in `text`. */
export const escapeRegExp = (text: string) =>
  text.replaceAll(/[\\^$.*+?()[\]{}|/]/g, String.raw`\$&`);
