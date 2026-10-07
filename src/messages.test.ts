import { expect, test } from 'vitest';
import { resolveMessages } from './messages.js';

interface Messages {
  title: string;
  count: (count: number) => string;
}

const defaults: Messages = {
  title: 'Filters',
  count: (count) => `${count} results`,
};

test('returns the defaults when no messages are given', () => {
  expect(resolveMessages(defaults)).toBe(defaults);
});

test('overrides only the defined keys', () => {
  const count = (value: number) => `${value} výsledků`;
  const resolved = resolveMessages(defaults, { count });
  expect(resolved).toEqual({ title: 'Filters', count });
  expect(resolved).not.toBe(defaults);
  expect(defaults.count(2)).toBe('2 results');
});

test('skips keys set to undefined', () => {
  const messages = { title: undefined } as unknown as Partial<Messages>;
  expect(resolveMessages(defaults, messages).title).toBe('Filters');
});
