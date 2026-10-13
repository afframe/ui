import { render } from '@testing-library/react';
import type { Ref } from 'react';
import { expect, test } from 'vitest';
import { useObjectRef } from './refs.js';

function Box({ boxRef }: { boxRef: Ref<HTMLDivElement> }) {
  const object = useObjectRef(boxRef);
  return <div ref={object} data-testid="box" />;
}

test('useObjectRef moves the node to a new consumer ref and clears the old one', () => {
  const calls: [string, HTMLDivElement | null][] = [];
  const inline = (name: string) => (node: HTMLDivElement | null) => {
    calls.push([name, node]);
  };
  const { rerender, getByTestId } = render(<Box boxRef={inline('first')} />);
  const box = getByTestId('box');
  expect(calls).toEqual([['first', box]]);
  rerender(<Box boxRef={inline('second')} />);
  expect(calls).toEqual([
    ['first', box],
    ['first', null],
    ['second', box],
  ]);
  const object = { current: null as HTMLDivElement | null };
  rerender(<Box boxRef={object} />);
  expect(calls.at(-1)).toEqual(['second', null]);
  expect(object.current).toBe(box);
});
