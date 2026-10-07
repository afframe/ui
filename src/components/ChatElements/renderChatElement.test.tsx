import type { RenderUserDefinedState } from '@carbon/ai-chat';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { chatElementTypes, isChatChartData } from './payloads.js';
import { renderChatElement } from './renderChatElement.js';

const payloads = {
  'afframe-chart': {
    chart_type: 'pie',
    summary: 'A 1.',
    data: [{ group: 'A', value: 1 }],
  },
};

const item = (user_defined: Record<string, unknown>) =>
  ({
    messageItem: { response_type: 'user_defined', user_defined },
  }) as unknown as RenderUserDefinedState;

const streaming = (user_defined: Record<string, unknown>) =>
  ({
    partialItems: [{ response_type: 'user_defined', user_defined }],
  }) as unknown as RenderUserDefinedState;

test.each(chatElementTypes)('dispatches %s', async (type) => {
  render(
    <>
      {renderChatElement(item({ user_defined_type: type, ...payloads[type] }))}
    </>
  );
  expect(
    await screen.findByRole('figure', {}, { timeout: 10000 })
  ).toBeVisible();
});

test('returns null for other items and for types left out of `elements`', () => {
  expect(renderChatElement(item({ user_defined_type: 'app-map' }))).toBeNull();
  // The table, code and carousel types are gone: @carbon/ai-chat renders
  // them natively.
  for (const type of ['afframe-table', 'afframe-code', 'afframe-carousel']) {
    expect(
      renderChatElement(item({ user_defined_type: type, code: 'x' }))
    ).toBeNull();
    expect(
      renderChatElement(streaming({ user_defined_type: type }))
    ).toBeNull();
  }
  expect(renderChatElement(item({ invoice: 1 }))).toBeNull();
  expect(renderChatElement({} as RenderUserDefinedState)).toBeNull();
  expect(
    renderChatElement(
      item({
        user_defined_type: 'afframe-chart',
        ...payloads['afframe-chart'],
      }),
      undefined,
      { elements: [] }
    )
  ).toBeNull();
  expect(
    renderChatElement(streaming({ user_defined_type: 'app-map' }))
  ).toBeNull();
});

test('streaming: a busy skeleton with the loading message', () => {
  const { container } = render(
    <>
      {renderChatElement(
        streaming({ user_defined_type: 'afframe-chart' }),
        undefined,
        { messages: { chart: { loading: 'LOADING' } } }
      )}
    </>
  );
  expect(container.querySelector('[aria-busy="true"]')?.textContent).toBe(
    'LOADING'
  );
});

test('an invalid payload renders the error block, never the raw data', () => {
  render(
    <>
      {renderChatElement(
        item({
          user_defined_type: 'afframe-chart',
          summary: 'S',
          data: 'secret',
        }),
        undefined,
        { messages: { chart: { invalid: (type) => `INVALID ${type}` } } }
      )}
    </>
  );
  expect(screen.getByText('INVALID afframe-chart')).toBeVisible();
  expect(document.body.textContent).not.toContain('secret');
});

test('guards accept good shapes and reject bad ones', () => {
  expect(isChatChartData(payloads['afframe-chart'])).toBe(true);
  expect(isChatChartData({ engine: 'echarts', summary: 'S', option: {} })).toBe(
    true
  );
  expect(isChatChartData({ engine: 'echarts', summary: 'S' })).toBe(false);
  expect(isChatChartData({ ...payloads['afframe-chart'], summary: ' ' })).toBe(
    false
  );
  expect(
    isChatChartData({ ...payloads['afframe-chart'], chart_type: 'radar' })
  ).toBe(false);
  expect(
    isChatChartData({
      ...payloads['afframe-chart'],
      data: [{ group: 'A', value: '1' }],
    })
  ).toBe(false);
});

test('chart groups and keys with markup are rejected', () => {
  const chart = payloads['afframe-chart'];
  expect(
    isChatChartData({ ...chart, data: [{ group: '<b>A</b>', value: 1 }] })
  ).toBe(false);
  expect(
    isChatChartData({
      ...chart,
      data: [{ group: 'A', key: 'Q1 <img src=x>', value: 1 }],
    })
  ).toBe(false);
  expect(
    isChatChartData({ ...chart, data: [{ group: 'A > B', value: 1 }] })
  ).toBe(false);
});

test.each(chatElementTypes)(
  'a %s payload cannot set component props',
  (type) => {
    const { container } = render(
      <>
        {renderChatElement(
          item({
            user_defined_type: type,
            ...payloads[type],
            className: 'x-injected',
            messages: { loading: 'x-injected' },
          })
        )}
      </>
    );
    expect(container.querySelector('.x-injected')).toBeNull();
    expect(container.textContent).not.toContain('x-injected');
  }
);
