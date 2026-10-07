/** Merges a component's English defaults with the caller's overrides (`messages?: Partial<<Name>Messages>`). */
export function resolveMessages<M extends object>(
  defaults: M,
  messages?: Partial<M>
): M {
  if (messages === undefined) return defaults;
  const resolved = { ...defaults };
  for (const key of Object.keys(messages) as (keyof M)[]) {
    const value = messages[key];
    if (value !== undefined) resolved[key] = value as M[keyof M];
  }
  return resolved;
}
