import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { ChatChart } from './ChatChart.js';
import type { ChatChartData } from './payloads.js';

const bar: ChatChartData = {
  chart_type: 'bar',
  title: 'Revenue',
  summary: 'Prague 2,000, Brno 1,400.',
  data: [
    { group: 'Prague', value: 2000 },
    { group: 'Brno', value: 1400 },
  ],
};

// First in the file: React.lazy shows its fallback only until the engine
// module has loaded once.
test('loads Carbon Charts lazily: the skeleton first, then the figure', async () => {
  const { container } = render(<ChatChart {...bar} animations={false} />);
  const busy = container.querySelector('[aria-busy="true"]');
  expect(busy).toHaveTextContent('Loading');
  expect(screen.queryByRole('figure')).toBeNull();
  const figure = await screen.findByRole(
    'figure',
    { name: 'Revenue' },
    { timeout: 10000 }
  );
  expect(figure).toHaveAccessibleDescription('Prague 2,000, Brno 1,400.');
  expect(figure.querySelector('svg')).not.toBeNull();
  expect(container.querySelector('[aria-busy="true"]')).toBeNull();
});

test('loads ECharts lazily and draws the option on a canvas', async () => {
  const { container } = render(
    <ChatChart
      engine="echarts"
      title="Orders"
      summary="Orders peaked on Wednesday."
      option={{
        animation: false,
        xAxis: { type: 'category', data: ['Mon', 'Tue'] },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', data: [1, 2] }],
      }}
    />
  );
  expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
  const figure = await screen.findByRole(
    'figure',
    { name: 'Orders' },
    { timeout: 10000 }
  );
  await expect
    .poll(() => figure.querySelector('canvas'), { timeout: 10000 })
    .not.toBeNull();
  // The figure names the chart; ECharts' generated description is off.
  expect(
    figure.querySelector('[data-afframe-extra="echarts"]')
  ).not.toHaveAttribute('aria-label');
});

test.each(['line', 'area', 'scatter', 'pie', 'donut'] as const)(
  'draws a %s chart',
  async (type) => {
    render(
      <ChatChart
        chart_type={type}
        summary="Summary"
        animations={false}
        data={[
          { group: 'A', key: 'Q1', value: 1 },
          { group: 'A', key: 'Q2', value: 2 },
        ]}
      />
    );
    const figure = await screen.findByRole('figure', { name: 'Chart' });
    await expect
      .poll(() => figure.querySelector('svg'), { timeout: 10000 })
      .not.toBeNull();
  }
);

test('an invalid payload shows the error block and no chart', () => {
  const invalid = { ...bar, summary: '' };
  render(<ChatChart {...invalid} />);
  expect(screen.getByText('This content could not be shown.')).toBeVisible();
  expect(screen.queryByRole('figure')).toBeNull();
});

test('messages override every string', async () => {
  // `loading` is covered by the streaming tests (the engine is cached here).
  render(
    <ChatChart
      {...bar}
      title={undefined as unknown as string}
      animations={false}
      messages={{
        loading: 'LOADING',
        invalid: (type) => `INVALID ${type}`,
        chartLabel: (title) => `CHART ${title ?? 'none'}`,
      }}
    />
  );
  expect(
    await screen.findByRole('figure', { name: 'CHART none' })
  ).toBeVisible();
  render(
    <ChatChart
      {...bar}
      chart_type={'radar' as 'bar'}
      messages={{ invalid: (type) => `INVALID ${type}` }}
    />
  );
  expect(screen.getByText('INVALID afframe-chart')).toBeVisible();
});

test('a Carbon Charts title never carries markup, encoded or not', async () => {
  const title = 'R&D &lt;img src=x&gt; <b>bold</b>';
  render(<ChatChart {...bar} title={title} animations={false} />);
  await screen.findByRole('figure', { name: title }, { timeout: 10000 });
  const heading = await screen.findByRole('heading', { name: /R&D/ });
  // A truncated title reaches the Carbon Charts tooltip as textContent.
  expect(heading.children).toHaveLength(0);
  expect(heading.textContent).not.toMatch(/[<>]/);
});
