import { render, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import type { CSSProperties } from 'react';
import { expect, test } from 'vitest';
import { useHeaderOffset } from './useHeaderOffset.js';

function Page({
  header,
  headerKey,
}: {
  header: CSSProperties | null;
  headerKey?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useHeaderOffset(ref, true, '.test-header');
  return (
    <>
      {header && (
        <div
          key={headerKey}
          className="test-header"
          style={{ position: 'fixed', ...header }}
        />
      )}
      <div ref={ref} data-testid="panel" />
    </>
  );
}

const offset = (panel: HTMLElement) =>
  panel.style.getPropertyValue('--afframe-side-panel-offset');

test.each<[string, CSSProperties, number | 'viewport']>([
  ['a header in view', { top: 0, height: 40 }, 40],
  ['a header scrolled away', { top: -100, height: 40 }, 0],
  [
    'a header taller than the viewport',
    { top: 0, height: '200vh' },
    'viewport',
  ],
])('useHeaderOffset clamps to the viewport: %s', (_, header, bottom) => {
  const { getByTestId } = render(<Page header={header} />);
  const px = bottom === 'viewport' ? window.innerHeight : bottom;
  expect(offset(getByTestId('panel'))).toBe(`${px}px`);
});

test('useHeaderOffset follows a header mounted or replaced later as it resizes', async () => {
  const { getByTestId, rerender } = render(<Page header={null} />);
  const panel = getByTestId('panel');
  expect(offset(panel)).toBe('0px');
  rerender(<Page header={{ top: 0, height: 40 }} headerKey="a" />);
  window.dispatchEvent(new Event('resize'));
  await waitFor(() => expect(offset(panel)).toBe('40px'));
  rerender(<Page header={{ top: 0, height: 60 }} headerKey="a" />);
  await waitFor(() => expect(offset(panel)).toBe('60px'));
  rerender(<Page header={{ top: 0, height: 60 }} headerKey="b" />);
  await waitFor(() => expect(offset(panel)).toBe('60px'));
  rerender(<Page header={{ top: 0, height: 80 }} headerKey="b" />);
  await waitFor(() => expect(offset(panel)).toBe('80px'));
});
