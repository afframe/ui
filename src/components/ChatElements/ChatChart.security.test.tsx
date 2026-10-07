import { render, screen } from '@testing-library/react';
import { getInstanceByDom } from 'echarts/core';
import type { EChartsType } from 'echarts/core';
import { afterEach, expect, test, vi } from 'vitest';
import { ChatChart } from './ChatChart.js';

const payload = (option: Record<string, unknown>) =>
  ({
    engine: 'echarts',
    title: 'Orders',
    summary: 'Orders per day.',
    animations: false,
    option,
  }) as const;

const series = [{ type: 'bar', data: [1, 2] }];
const axes = {
  xAxis: { type: 'category', data: ['Mon', 'Tue'] },
  yAxis: { type: 'value' },
};
const markup = '<img src="x-attack" data-attack="1">';

async function chart(): Promise<EChartsType> {
  const figure = await screen.findByRole(
    'figure',
    { name: 'Orders' },
    { timeout: 10000 }
  );
  let instance: EChartsType | undefined;
  await vi.waitFor(() => {
    const element = figure.querySelector<HTMLElement>(
      '[data-afframe-extra="echarts"]'
    );
    instance = element ? getInstanceByDom(element) : undefined;
    expect(instance?.getOption()).toBeTruthy();
  });
  return instance as EChartsType;
}

interface Node {
  style?: { text?: unknown };
  trigger: (event: string) => void;
  childrenRef?: () => Node[];
}

// Clicks every canvas text element that draws `text`, as a user would.
function clickText(instance: EChartsType, text: string) {
  let clicked = 0;
  const visit = (node: Node) => {
    if (node.style?.text === text) {
      node.trigger('click');
      clicked += 1;
    }
    node.childrenRef?.().forEach(visit);
  };
  (instance.getZr().storage.getRoots() as unknown as Node[]).forEach(visit);
  return clicked;
}

function showTip(instance: EChartsType) {
  instance.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: 0 });
}

const injected = () => document.querySelector('[data-attack]');

afterEach(() => {
  vi.restoreAllMocks();
});

test.each([
  ['link', { text: 'Click', link: 'javascript:alert(1)', target: 'self' }],
  [
    'sublink',
    {
      text: 'T',
      subtext: 'Click',
      sublink: 'javascript:alert(1)',
      subtarget: 'blank',
    },
  ],
])('a title %s never opens a window', async (_name, title) => {
  const open = vi
    .spyOn(window, 'open')
    .mockReturnValue({ location: {} } as unknown as Window);
  render(<ChatChart {...payload({ title, ...axes, series })} />);
  const instance = await chart();
  expect(clickText(instance, 'Click')).toBeGreaterThan(0);
  expect(open).not.toHaveBeenCalled();
});

const htmlTooltip = {
  renderMode: 'html',
  trigger: 'item',
  formatter: markup,
};

test.each([
  ['top level', { tooltip: htmlTooltip, ...axes, series }],
  ['array', { tooltip: [htmlTooltip], ...axes, series }],
  ['baseOption', { baseOption: { tooltip: htmlTooltip, ...axes, series } }],
  [
    'media',
    {
      ...axes,
      series,
      media: [{ option: { tooltip: htmlTooltip } }],
    },
  ],
  [
    'timeline options',
    {
      baseOption: { timeline: { data: ['a'] }, ...axes, series },
      options: [{ tooltip: htmlTooltip }],
    },
  ],
  [
    'series tooltip',
    {
      tooltip: { trigger: 'item' },
      ...axes,
      series: [{ ...series[0], tooltip: htmlTooltip }],
    },
  ],
])('a %s HTML tooltip inserts no markup', async (_name, option) => {
  render(<ChatChart {...payload(option)} />);
  const instance = await chart();
  showTip(instance);
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(injected()).toBeNull();
});

test('rich text, image symbols and background images are dropped', async () => {
  render(
    <ChatChart
      {...payload({
        backgroundColor: { image: 'x-attack-bg', repeat: 'repeat' },
        ...axes,
        series: [
          {
            type: 'line',
            data: [1, 2],
            symbol: 'image://x-attack-symbol',
            label: { show: true, formatter: '{a|x}', rich: { a: {} } },
          },
        ],
      })}
    />
  );
  const option = (await chart()).getOption() as Record<string, unknown>;
  const text = JSON.stringify(option);
  expect(text).not.toContain('x-attack');
  // ECharts fills its own defaults; the payload's label is gone.
  expect(text).not.toContain('{a|x}');
});

test('an option ECharts cannot draw shows the error block; a sibling chart still renders', async () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  render(
    <>
      <ChatChart
        {...payload({ series: [{ type: 'line', data: [1, 2] }] })}
        title="Broken"
      />
      <ChatChart {...payload({ ...axes, series })} />
    </>
  );
  expect(
    await screen.findByText('This content could not be shown.', undefined, {
      timeout: 10000,
    })
  ).toBeVisible();
  expect(screen.queryByRole('figure', { name: 'Broken' })).toBeNull();
  await chart();
  error.mockRestore();
});
