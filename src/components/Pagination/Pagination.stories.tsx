/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, userEvent from storybook/test, totalItems omitted instead of set to undefined, NumberInput gets no size for xs (it has no xs size), em-dash in a comment replaced, reasons on the unused-vars eslint-disable lines, source tag, inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { userEvent } from 'storybook/test';
import { NumberInput, Pagination } from '../../index.js';
import mdx from './Pagination.mdx';

const args = {
  backwardText: 'Previous',
  backwardTextTooltipPosition: 'top',
  disabled: false,
  forwardText: 'Next',
  forwardTextTooltipPosition: 'top',
  isLastPage: false,
  itemsPerPageText: 'Items per page:',
  page: 1,
  pageInputDisabled: false,
  pageNumberText: 'Page Number',
  pageSize: 10,
  pageSizeInputDisabled: false,
  pageSizes: [10, 20, 30, 40, 50],
  pagesUnknown: false,
  size: 'md',
  totalItems: 103,
  onChange: action('onChange'),
} satisfies Meta<typeof Pagination>['args'];

const argTypes = {
  className: {
    control: false,
  },
  id: {
    control: false,
  },
  itemText: {
    control: false,
  },
  backwardText: {
    control: { type: 'text' },
  },
  backwardTextTooltipPosition: {
    options: ['top', 'right', 'bottom', 'left'],
    control: { type: 'select' },
  },
  forwardText: {
    control: { type: 'text' },
  },
  forwardTextTooltipPosition: {
    options: ['top', 'right', 'bottom', 'left'],
    control: { type: 'select' },
  },
  disabled: {
    control: { type: 'boolean' },
  },
  isLastPage: {
    control: { type: 'boolean' },
  },
  itemsPerPageText: {
    control: { type: 'text' },
  },
  onChange: {
    action: 'onChange',
  },
  page: {
    control: { type: 'number' },
  },
  pageInputDisabled: {
    control: { type: 'boolean' },
  },
  pageSize: {
    control: { type: 'number' },
  },
  pageSizes: {
    control: { type: 'object' },
  },
  pageNumberText: {
    control: { type: 'text' },
  },
  pagesUnknown: {
    control: { type: 'boolean' },
  },
  pageSizeInputDisabled: {
    control: { type: 'boolean' },
  },
  size: {
    options: ['xs', 'sm', 'md', 'lg'],
    control: { type: 'select' },
  },
  totalItems: {
    control: { type: 'number' },
  },
} satisfies Meta<typeof Pagination>['argTypes'];

export default {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['carbon'],
  argTypes,
  args,
  decorators: [
    (story) => (
      <div style={{ maxWidth: '800px', marginTop: 'var(--cds-spacing-05)' }}>
        {story()}
      </div>
    ),
  ],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Pagination>;

export const Default: StoryFn<typeof Pagination> = (args) => {
  return <Pagination {...args} />;
};

export const TooltipHover: StoryObj<typeof Pagination> = {
  tags: ['!autodocs', '!dev'],
  parameters: {
    chromatic: { delay: 100 },
  },
  play: async ({ canvasElement }) => {
    const nextButton = canvasElement.querySelector(
      '.cds--pagination__button--forward'
    );
    if (nextButton) {
      await userEvent.hover(nextButton);
    }
  },
};

export const MultiplePaginationComponents: StoryFn<typeof Pagination> = (
  args
) => {
  return (
    <div>
      <Pagination {...args} />
      <Pagination {...args} />
    </div>
  );
};

MultiplePaginationComponents.storyName = 'Multiple Pagination components';

export const PaginationWithCustomPageSizesLabel: StoryFn<typeof Pagination> = (
  args
) => {
  return (
    <div>
      <Pagination
        {...args}
        pageSizes={[
          { text: 'Ten', value: 10 },
          { text: 'Twenty', value: 20 },
          { text: 'Thirty', value: 30 },
          { text: 'Forty', value: 40 },
          { text: 'Fifty', value: 50 },
        ]}
      />
    </div>
  );
};

PaginationWithCustomPageSizesLabel.storyName =
  'Pagination with custom page sizes label';
PaginationWithCustomPageSizesLabel.parameters = {
  controls: {
    exclude: ['pageSizes'],
  },
};

export const PaginationUnknownPages: StoryFn<typeof Pagination> = (args) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- props left out of the spread
  const { pageInputDisabled, pagesUnknown, totalItems, ...rest } = args;

  return (
    <div>
      <Pagination {...rest} pagesUnknown />
    </div>
  );
};

PaginationUnknownPages.storyName = 'Unknown pages and items';
PaginationUnknownPages.parameters = {
  controls: {
    exclude: ['pageInputDisabled', 'pagesUnknown', 'totalItems'],
  },
};

export const WithoutPageSizes: StoryFn<typeof Pagination> = (args) => {
  // Omit `pageSizes` to hide the "items per page" selector. `pageSize` sets the
  // fixed page size (falls back to 10 when not provided).
  // `renderPageSelect` replaces the default page-select <Select>; returning
  // null hides it entirely.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- props left out of the spread
  const { pageSizes, ...rest } = args;

  return (
    <Pagination
      pageSize={10}
      totalItems={103}
      renderPageSelect={() => null}
      {...rest}
    />
  );
};

WithoutPageSizes.storyName = 'Without page sizes and render page select';
WithoutPageSizes.parameters = {
  controls: {
    exclude: ['pageSizes', 'itemsPerPageText', 'pageSizeInputDisabled'],
  },
};

/**
 * `renderPageSelect` lets you replace the default page-select control with
 * any React node.
 *
 * This story uses Carbon's `NumberInput` with `hideSteppers` to replace the
 * default page-select `<Select>`, illustrating how any custom control can be
 * slotted in.
 * TODO: remove after initial review ?
 */
export const WithRenderPageSelect: StoryFn<typeof Pagination> = (args) => (
  <Pagination
    totalItems={350}
    pageSizes={[10, 20, 30]}
    {...args}
    renderPageSelect={({
      currentPage,
      totalPages,
      pageSelectLabelText,
      onSetPage,
    }) => (
      <NumberInput
        hideSteppers
        id="page-select-number-input"
        label={pageSelectLabelText}
        hideLabel
        {...(args.size && args.size !== 'xs' ? { size: args.size } : {})}
        disabled={Boolean(args.disabled || args.pageInputDisabled)}
        style={{
          minInlineSize: 'unset',
          paddingInline: 'var(--cds-spacing-05)',
          inlineSize: `calc(${String(currentPage).length + 2}ch + 1rem)`,
          border: '0',
        }}
        min={1}
        max={totalPages}
        value={currentPage}
        onChange={(_e, { value }) => {
          onSetPage(value);
        }}
      />
    )}
  />
);

WithRenderPageSelect.storyName = 'With custom page select (renderPageSelect)';
WithRenderPageSelect.tags = ['!dev', '!autodocs']; // remove this to enable story
WithRenderPageSelect.parameters = {
  chromatic: { disableSnapshot: true }, // remove this to enable snapshots
  controls: {
    exclude: ['renderPageSelect'],
  },
};
