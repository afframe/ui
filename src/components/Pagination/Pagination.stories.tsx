/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, userEvent from storybook/test, totalItems omitted instead of set to undefined, NumberInput gets no size for xs (it has no xs size), em-dash in a comment replaced, reasons on the unused-vars eslint-disable lines, source tag, inline spacing as Carbon spacing tokens, story names unified, WithRenderPageSelect shown, Chromatic parameters and the review TODO removed, Skeleton story and PaginationSkeleton subcomponent added. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { userEvent } from 'storybook/test';
import { NumberInput, Pagination, PaginationSkeleton } from '../../index.js';
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
  subcomponents: { PaginationSkeleton },
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
  play: async ({ canvasElement }) => {
    const nextButton = canvasElement.querySelector(
      '.cds--pagination__button--forward'
    );
    if (nextButton) {
      await userEvent.hover(nextButton);
    }
  },
};

export const Multiple: StoryFn<typeof Pagination> = (args) => {
  return (
    <div>
      <Pagination {...args} />
      <Pagination {...args} />
    </div>
  );
};

export const WithCustomPageSizesLabel: StoryFn<typeof Pagination> = (args) => {
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

WithCustomPageSizesLabel.parameters = {
  controls: {
    exclude: ['pageSizes'],
  },
};

export const UnknownPages: StoryFn<typeof Pagination> = (args) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- props left out of the spread
  const { pageInputDisabled, pagesUnknown, totalItems, ...rest } = args;

  return (
    <div>
      <Pagination {...rest} pagesUnknown />
    </div>
  );
};

UnknownPages.parameters = {
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

WithRenderPageSelect.parameters = {
  controls: {
    exclude: ['renderPageSelect'],
  },
};

// The meta args belong to Pagination, so the skeleton takes none of them.
export const Skeleton: StoryFn = () => <PaginationSkeleton />;

Skeleton.parameters = {
  controls: { disable: true },
};
