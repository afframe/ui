import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { EngineSlot, lazyEngine } from './engine.js';

test('a failed engine load shows the error block; the next mount loads again', async () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  let calls = 0;
  const engine = lazyEngine(async () => {
    calls += 1;
    if (calls === 1) throw new Error('chunk failed');
    return function Loaded({ label }: { label: string }) {
      return <p>{label}</p>;
    };
  });
  const view = (
    <EngineSlot
      engine={engine}
      loadErrorTitle="LOAD FAILED"
      renderErrorTitle="DRAW FAILED"
      loadingLabel="LOADING">
      <engine.Engine label="LOADED" />
    </EngineSlot>
  );
  const first = render(view);
  expect(first.container.textContent).toBe('LOADING');
  expect(await screen.findByText('LOAD FAILED')).toBeVisible();
  first.unmount();
  render(view);
  expect(await screen.findByText('LOADED')).toBeVisible();
  expect(calls).toBe(2);
  error.mockRestore();
});
