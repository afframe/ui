import { render, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, expect, test } from 'vitest';
import { ChartTheme, ScaleTypes, SimpleBarChart } from './index.js';
import type { BarChartOptions } from './index.js';

const data = [
  { group: 'Q1', value: 12 },
  { group: 'Q2', value: 18 },
];
const options: BarChartOptions = {
  title: 'Revenue',
  axes: {
    left: { mapsTo: 'value' },
    bottom: { mapsTo: 'group', scaleType: ScaleTypes.LABELS },
  },
  animations: false,
  height: '200px',
};

afterEach(() => {
  delete document.documentElement.dataset.afframeTheme;
});

function holder(container: HTMLElement) {
  return container.querySelector('.cds--chart-holder');
}

test('renders an IBM chart with the light theme by default', async () => {
  const ref =
    createRef<
      InstanceType<typeof import('@carbon/charts-react').SimpleBarChart>
    >();
  const { container } = render(
    <SimpleBarChart data={data} options={options} ref={ref} />
  );
  await waitFor(() =>
    expect(holder(container)?.getAttribute('data-carbon-theme')).toBe('white')
  );
  expect(container.querySelector('.cds--cc--chart-wrapper')).not.toBeNull();
  expect(ref.current?.chart).toBeDefined();
});

test('follows the data-afframe-theme switch', async () => {
  const { container } = render(
    <SimpleBarChart data={data} options={options} />
  );
  await waitFor(() =>
    expect(holder(container)?.getAttribute('data-carbon-theme')).toBe('white')
  );
  document.documentElement.dataset.afframeTheme = 'dark';
  await waitFor(() =>
    expect(holder(container)?.getAttribute('data-carbon-theme')).toBe('g100')
  );
  document.documentElement.dataset.afframeTheme = 'light';
  await waitFor(() =>
    expect(holder(container)?.getAttribute('data-carbon-theme')).toBe('white')
  );
});

test('an explicit options.theme wins', async () => {
  document.documentElement.dataset.afframeTheme = 'dark';
  const { container } = render(
    <SimpleBarChart
      data={data}
      options={{ ...options, theme: ChartTheme.G10 }}
    />
  );
  await waitFor(() =>
    expect(holder(container)?.getAttribute('data-carbon-theme')).toBe('g10')
  );
});
