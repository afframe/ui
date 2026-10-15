/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, createOverflowHandler from @afframe/ui, carbon tag, a docs page added (Carbon's story has none and is !autodocs), the review-concern header comment dropped, the render passes the handler options in one spread, scss styles replaced by overflow-handler-story.css, em-dash in a control description replaced. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createOverflowHandler } from '../../index.js';
import type { OverflowHandler } from '../../index.js';
import mdx from './OverflowHandler.mdx';
import './overflow-handler-story.css';

interface OverflowOptions {
  itemCount: number;
  maxVisibleItems: number;
  offsetValue: number;
  gap: number;
  fixedIndex: number;
  dimension: 'width' | 'height';
}

type StoryArgs = OverflowOptions & { instanceCount: number };

export default {
  title: 'Utilities/OverflowHandler',
  tags: ['carbon'],
  parameters: {
    layout: 'padded',
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<StoryArgs>;

const ITEM_LABELS = [
  'All',
  'Dashboard',
  'Notifications',
  'Account settings',
  'Help',
  'Privacy',
  'Organization access',
  'Docs',
  'Billing and usage',
  'API',
  'Integrations',
  'Audit log',
  'OK',
  'Experimental features',
  'Sign out',
];

const labelFor = (index: number) =>
  ITEM_LABELS[(index - 1) % ITEM_LABELS.length] +
  (index > ITEM_LABELS.length
    ? ` ${Math.ceil(index / ITEM_LABELS.length)}`
    : '');

const fmt = (visible: HTMLElement[], hidden: HTMLElement[]) =>
  `visible : [${visible.map((n) => n.textContent?.trim()).join(', ')}]\n` +
  `hidden  : [${hidden.map((n) => n.textContent?.trim()).join(', ')}]`;

/**
 * A single self-contained overflow handler instance with its own state and
 * handler lifecycle. Accepts the same options as `createOverflowHandler`.
 */
function OverflowInstance({
  itemCount,
  maxVisibleItems,
  offsetValue,
  gap,
  fixedIndex,
  dimension,
}: OverflowOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // `resize` writes inline width/height. Clear them when the axis changes so
    // the horizontal/vertical class sizes apply instead of the previous drag.
    el.style.removeProperty('width');
    el.style.removeProperty('height');
  }, [dimension]);

  // Re-create the handler whenever any option changes.
  // onChange updates the offset label and log via the DOM so React does not
  // re-render the items and strip `data-hidden` attributes the handler sets.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const offsetEl = el.querySelector('[data-offset]');
    const writeLog = (text: string) => {
      if (logRef.current) {
        logRef.current.textContent = text;
      }
    };

    let hiddenLabels: string[] = [];
    const onOffsetClick = () => {
      if (hiddenLabels.length === 0) {
        return;
      }
      alert(hiddenLabels.join(', '));
    };
    offsetEl?.addEventListener('click', onOffsetClick);

    let handler: OverflowHandler | undefined;
    try {
      handler = createOverflowHandler({
        container: el,
        dimension,
        gap,
        offsetValue,
        ...(maxVisibleItems > 0 ? { maxVisibleItems } : {}),
        onChange(visible, hidden) {
          hiddenLabels = hidden.map((n) => n.textContent?.trim() ?? '');
          if (offsetEl) {
            offsetEl.textContent =
              hidden.length > 0 ? `+${hidden.length} more` : '+0 more';
          }
          writeLog(fmt(visible, hidden));
        },
      });
    } catch (err) {
      writeLog(`ERROR: ${(err as Error).message}`);
    }

    return () => {
      offsetEl?.removeEventListener('click', onOffsetClick);
      handler?.disconnect();
    };
  }, [itemCount, maxVisibleItems, offsetValue, gap, fixedIndex, dimension]);

  const isVertical = dimension === 'height';
  const containerModifier = isVertical
    ? 'overflow-handler-container-vertical'
    : 'overflow-handler-container-horizontal';

  // The `gap` control drives the CSS gap property; it cannot live in a static
  // stylesheet, so it remains as a single targeted inline style here.
  return (
    <div className="overflow-handler-instance">
      <div
        ref={ref}
        className={`overflow-handler-container ${containerModifier}${
          gap > 0 ? ' overflow-handler-show-gap' : ''
        }${offsetValue > 0 ? ' overflow-handler-show-offset-value' : ''}`}
        style={
          {
            gap,
            '--overflow-handler-gap': `${gap}px`,
            '--overflow-handler-offset-value': `${offsetValue}px`,
          } as CSSProperties
        }>
        {Array.from({ length: itemCount }, (_, i) => {
          const n = i + 1;
          const isFixed = fixedIndex > 0 && n === fixedIndex;
          return (
            <div
              key={`item${n}`}
              {...(isFixed ? { 'data-fixed': '' } : {})}
              className={`overflow-handler-item${isFixed ? ' overflow-handler-item-fixed' : ''}`}>
              {labelFor(n)}
            </div>
          );
        })}
        <button
          type="button"
          data-offset
          data-hidden
          className="overflow-handler-offset">
          +0 more
        </button>
      </div>
      <pre ref={logRef} className="overflow-handler-log" />
    </div>
  );
}

export const Default: StoryObj<StoryArgs> = {
  args: {
    instanceCount: 1,
    itemCount: 8,
    maxVisibleItems: 0,
    offsetValue: 0,
    gap: 0,
    fixedIndex: 0,
    dimension: 'width',
  },
  argTypes: {
    instanceCount: {
      control: { type: 'number', min: 1, max: 8, step: 1 },
      description: 'Number of independent handler instances to render.',
    },
    itemCount: {
      control: { type: 'number', min: 1, max: 16, step: 1 },
      description: 'Total number of items.',
    },
    maxVisibleItems: {
      control: { type: 'number', min: 0, max: 16, step: 1 },
      description: 'Hard cap on visible items (0 = no cap).',
    },
    offsetValue: {
      control: { type: 'number', min: 0, max: 200, step: 8 },
      description: 'Pixels to reserve, forces overflow earlier.',
    },
    gap: {
      control: { type: 'number', min: 0, max: 32, step: 2 },
      description: 'Column/row gap between items (px).',
    },
    fixedIndex: {
      control: { type: 'number', min: 0, max: 16, step: 1 },
      description:
        'Mark item N as data-fixed (always visible). 0 = none. E.g. 3 → Item 3 gets data-fixed. `data-fixed` can be added to multiple items.',
    },
    dimension: {
      control: { type: 'radio' },
      options: ['width', 'height'],
      description: 'Axis to measure overflow along.',
    },
  },
  render({ instanceCount, ...options }) {
    return (
      <div className="overflow-handler-demo">
        <div className="overflow-handler-legend">
          <span>
            <span className="overflow-handler-swatch overflow-handler-swatch-regular" />
            regular item
          </span>
          {options.fixedIndex > 0 && (
            <span>
              <span className="overflow-handler-swatch overflow-handler-swatch-fixed" />
              fixed item (<code>data-fixed</code>)
            </span>
          )}
          <span className="overflow-handler-legend-offset">
            <span className="overflow-handler-swatch overflow-handler-swatch-offset" />
            offset item (<code>data-offset</code>)
          </span>
          <span>
            <span className="overflow-handler-swatch overflow-handler-swatch-available" />
            available space
          </span>
          {options.gap > 0 && (
            <span>
              <span className="overflow-handler-swatch overflow-handler-swatch-gap" />
              gap
            </span>
          )}
          {options.offsetValue > 0 && (
            <span>
              <span className="overflow-handler-swatch overflow-handler-swatch-offset-value" />
              offset value
            </span>
          )}
        </div>

        {Array.from({ length: instanceCount }, (_, i) => (
          <OverflowInstance key={i} {...options} />
        ))}
      </div>
    );
  },
};
