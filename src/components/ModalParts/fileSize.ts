'use client';
import { formatNumber } from '../../format/index.js';

const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte'] as const;

/** File size in decimal units (1 kB = 1000 bytes), for example "1,5 MB" in cs-CZ. */
export function formatFileSize(bytes: number, locale?: string): string {
  let value = bytes;
  let unit = 0;
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000;
    unit += 1;
  }
  return formatNumber(value, {
    style: 'unit',
    unit: units[unit],
    maximumFractionDigits: unit === 0 ? 0 : 1,
    ...(locale === undefined ? {} : { locale }),
  });
}
