import { expect, test } from 'vitest';
import { formatFileSize } from './fileSize.js';

test.each([
  [999, '999 byte'],
  [1500, '1.5 kB'],
  [999_960, '1 MB'],
  [999_940, '999.9 kB'],
  [2_500_000, '2.5 MB'],
])('%i bytes reads %s', (bytes, text) => {
  expect(formatFileSize(bytes, 'en-US')).toBe(text);
});
