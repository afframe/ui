/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, argType for the removed light prop dropped, unique labels per layer in the layer stories (a11y), source tag, inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import { ExpandableSearch, Search, SearchSkeleton } from '../../index.js';
import mdx from './Search.mdx';

// Stories pass their own id.
type SearchStoryArgs = Omit<ComponentProps<typeof Search>, 'id'> & {
  defaultWidth: number;
};

export default {
  title: 'Components/Search',
  component: Search,
  tags: ['carbon'],
  args: {
    closeButtonLabelText: 'Clear search input',
    disabled: false,
    defaultWidth: 800,
    labelText: 'Site search',
    placeholder: 'Placeholder text',
    size: 'md',
    type: 'search',
  },
  argTypes: {
    defaultWidth: {
      control: { type: 'range', min: 300, max: 800, step: 50 },
    },
    closeButtonLabelText: {
      control: {
        type: 'text',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    defaultValue: {
      control: {
        type: 'text',
      },
    },
    labelText: {
      control: {
        type: 'text',
      },
    },
    placeholder: {
      control: {
        type: 'text',
      },
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: {
        type: 'select',
      },
    },
    value: {
      control: {
        type: 'text',
      },
    },
  },
  subcomponents: {
    ExpandableSearch,
    SearchSkeleton,
  },
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['id'],
    },
  },
} satisfies Meta<SearchStoryArgs>;

const defaultParameters = {
  controls: {
    exclude: ['isExpanded', 'renderIcon', 'role'],
  },
};

const expandableParameters = {
  controls: {
    exclude: ['renderIcon', 'role'],
  },
};

export const Expandable: StoryFn<SearchStoryArgs> = ({
  defaultWidth,
  ...searchArgs
}) => (
  <div style={{ marginTop: 'var(--cds-spacing-06)', width: defaultWidth }}>
    <ExpandableSearch id="search-expandable-1" {...searchArgs} />
  </div>
);
Expandable.parameters = { ...expandableParameters };

export const _WithLayer: StoryFn<SearchStoryArgs> = ({
  defaultWidth,
  ...searchArgs
}) => (
  <WithLayer>
    {(layer) => (
      <div style={{ width: defaultWidth }}>
        <Search
          id={`search-${layer}`}
          {...searchArgs}
          labelText={`${searchArgs.labelText} (layer ${layer})`}
        />
      </div>
    )}
  </WithLayer>
);
_WithLayer.parameters = { ...defaultParameters };

export const ExpandableWithLayer: StoryFn<SearchStoryArgs> = ({
  defaultWidth,
  ...searchArgs
}) => (
  <WithLayer>
    {(layer) => (
      <div style={{ marginTop: 'var(--cds-spacing-06)', width: defaultWidth }}>
        <ExpandableSearch
          id={`search-expandable-${layer}`}
          {...searchArgs}
          labelText={`${searchArgs.labelText} (layer ${layer})`}
        />
      </div>
    )}
  </WithLayer>
);
ExpandableWithLayer.parameters = { ...expandableParameters };

export const Default: StoryFn<SearchStoryArgs> = ({
  defaultWidth,
  ...searchArgs
}) => (
  <div style={{ width: defaultWidth }}>
    <Search id="search-default-1" {...searchArgs} />
  </div>
);
Default.parameters = { ...defaultParameters };

export const Skeleton: StoryFn<
  Required<Pick<SearchStoryArgs, 'size' | 'defaultWidth'>>
> = ({ size, defaultWidth }) => (
  <div style={{ width: defaultWidth }}>
    <SearchSkeleton size={size} />
  </div>
);
Skeleton.argTypes = {
  size: {
    description: 'Specify the size of the SearchSkeleton',
  },
};
Skeleton.parameters = {
  controls: {
    include: ['size', 'defaultWidth'],
  },
};
