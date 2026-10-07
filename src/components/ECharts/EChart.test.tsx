import { act, render, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { EChart } from './EChart.js';
import type { ECElementEvent } from 'echarts/core';
import type { EChartInstance, EChartOption } from './EChart.js';

const option: EChartOption = {
  animation: false,
  xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [12, 18, 9] }],
};

afterEach(() => {
  delete document.documentElement.dataset.afframeTheme;
});

function live(ref: { current: EChartInstance | null }): EChartInstance {
  if (!ref.current) throw new Error('no ECharts instance');
  return ref.current;
}

function renderChart(props: Partial<Parameters<typeof EChart>[0]> = {}) {
  const ref = createRef<EChartInstance | null>();
  const result = render(
    <EChart
      option={option}
      ref={ref}
      style={{ width: 400, height: 300 }}
      {...props}
    />
  );
  return { ...result, ref };
}

test('renders a canvas chart in its container', () => {
  const { container, ref } = renderChart();
  const box = container.querySelector('[data-afframe-extra="echarts"]');
  expect(box?.getAttribute('_echarts_instance_')).toBeTruthy();
  expect(box?.querySelector('canvas')).not.toBeNull();
  expect(ref.current?.getDom()).toBe(box);
});

test('turns on the aria description unless the option sets aria', () => {
  const { ref, rerender } = renderChart();
  expect(ref.current?.getDom().getAttribute('aria-label')).toBeTruthy();
  rerender(
    <EChart option={{ ...option, aria: { enabled: false } }} ref={ref} />
  );
  expect(ref.current?.getOption()['aria']).toMatchObject({ enabled: false });
});

test('follows the data-afframe-theme switch', async () => {
  const { ref } = renderChart();
  const chart = live(ref);
  const setTheme = vi.spyOn(chart, 'setTheme');
  act(() => {
    document.documentElement.dataset.afframeTheme = 'dark';
  });
  await waitFor(() => expect(setTheme).toHaveBeenLastCalledWith('carbon-g100'));
  act(() => {
    document.documentElement.dataset.afframeTheme = 'light';
  });
  await waitFor(() =>
    expect(setTheme).toHaveBeenLastCalledWith('carbon-white')
  );
  expect(ref.current).toBe(chart);
});

test('notMerge replaces the option', () => {
  const { ref, rerender } = renderChart();
  const lineOnly: EChartOption = {
    animation: false,
    xAxis: { type: 'category', data: ['Q1'] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: [1] }],
  };
  rerender(<EChart option={lineOnly} notMerge ref={ref} />);
  const series = ref.current?.getOption()['series'] as { type: string }[];
  expect(series.map((s) => s.type)).toEqual(['line']);
});

// A partial event; only the handler wiring is under test.
const clickEvent = { name: 'Q1' } as unknown as ECElementEvent;

test('binds and unbinds onEvents', () => {
  const click = vi.fn();
  const { ref, rerender } = renderChart({ onEvents: { click } });
  live(ref).trigger('click', clickEvent);
  expect(click).toHaveBeenCalledTimes(1);
  rerender(<EChart option={option} ref={ref} onEvents={{}} />);
  live(ref).trigger('click', clickEvent);
  expect(click).toHaveBeenCalledTimes(1);
});

test('resizes with its container', async () => {
  const { ref } = renderChart();
  const resize = vi.spyOn(live(ref), 'resize');
  const box = live(ref).getDom();
  // Let the observer's first notification (after observe) pass.
  await new Promise((done) => requestAnimationFrame(() => setTimeout(done)));
  resize.mockClear();
  box.style.width = '200px';
  await waitFor(() => expect(resize).toHaveBeenCalled());
  expect(box.querySelector('canvas')?.style.width).toBe('200px');
});

test('disposes on unmount', () => {
  const { ref, unmount } = renderChart();
  const chart = live(ref);
  unmount();
  expect(chart.isDisposed()).toBe(true);
  expect(ref.current).toBeNull();
});

test('unmounting with onEvents logs no ECharts warning', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  const { unmount } = renderChart({ onEvents: { click: vi.fn() } });
  unmount();
  expect(warn).not.toHaveBeenCalled();
  warn.mockRestore();
});
