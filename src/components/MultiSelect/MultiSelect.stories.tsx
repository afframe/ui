/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript (ignored label prop dropped from FilterableWithAILabel), components and icons from @afframe/ui, AI label story styles as plain CSS, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import '../AILabel/ailabel-story.css';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  ButtonSet,
  FilterableMultiSelect,
  IconButton,
  MultiSelect,
} from '../../index.js';
import type {
  FilterableMultiSelectProps,
  MultiSelectProps,
} from '../../index.js';
import { FolderOpen, Folders, View } from '../../icons.js';
import mdx from './MultiSelect.mdx';

interface Item {
  id: string;
  text: string;
  disabled?: boolean;
  isSelectAll?: boolean;
}

interface CustomSearchItem {
  id: string;
  text: string;
  searchTerms: string[];
}

type StoryArgs = Partial<MultiSelectProps<Item>>;
type FilterableArgs = Partial<FilterableMultiSelectProps<Item>>;
type CustomSearchArgs = Partial<FilterableMultiSelectProps<CustomSearchItem>>;
type InputValueChange = Parameters<
  NonNullable<
    FilterableMultiSelectProps<CustomSearchItem>['onInputValueChange']
  >
>[0];

export default {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  subcomponents: {
    FilterableMultiSelect,
  },
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    light: {
      table: {
        disable: true,
      },
    },
    selectionFeedback: {
      options: ['top', 'fixed', 'top-after-reopen'],
      control: { type: 'select' },
    },
    direction: {
      options: ['top', 'bottom'],
      control: { type: 'radio' },
    },
    type: {
      options: ['inline', 'default'],
      control: { type: 'radio' },
    },
    titleText: {
      control: {
        type: 'text',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    hideLabel: {
      control: {
        type: 'boolean',
      },
    },
    helperText: {
      control: {
        type: 'text',
      },
    },
    invalid: {
      control: {
        type: 'boolean',
      },
    },
    warn: {
      control: {
        type: 'boolean',
      },
    },
    warnText: {
      control: {
        type: 'text',
      },
    },
    invalidText: {
      control: {
        type: 'text',
      },
    },
    label: {
      control: {
        type: 'text',
      },
    },
    clearSelectionDescription: {
      control: {
        type: 'text',
      },
    },
    useTitleInItem: {
      control: {
        type: 'boolean',
      },
    },
    clearSelectionText: {
      control: {
        type: 'text',
      },
    },
    readOnly: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: [
        'filterItems',
        'translateWithId',
        'titleText',
        'open',
        'selectedItems',
        'itemToString',
        'itemToElement',
        'locale',
        'items',
        'id',
        'initialSelectedItems',
        'sortItems',
        'compareItems',
        'downshiftProps',
      ],
    },
  },
  tags: ['carbon'],
} satisfies Meta<typeof MultiSelect>;

const items: Item[] = [
  {
    id: 'downshift-1-item-0',
    text: 'Option 1',
  },
  {
    id: 'downshift-1-item-1',
    text: 'Option 2',
  },
  {
    id: 'downshift-1-item-2',
    text: 'Option 3 - a disabled item',
    disabled: true,
  },
  {
    id: 'downshift-1-item-3',
    text: 'Option 4',
  },
  {
    id: 'downshift-1-item-4',
    text: 'An example option that is really long to show what should be done to handle long text',
  },
  {
    id: 'downshift-1-item-5',
    text: 'Option 5',
  },
];

const customSearchItems: CustomSearchItem[] = [
  {
    id: 'custom-search-item-0',
    text: 'Apple',
    searchTerms: ['fruit', 'red'],
  },
  {
    id: 'custom-search-item-1',
    text: 'Orange',
    searchTerms: ['fruit', 'orange'],
  },
  {
    id: 'custom-search-item-2',
    text: 'Broccoli',
    searchTerms: ['vegetable', 'green'],
  },
];

function preserveCustomSearchResults(items: readonly CustomSearchItem[]) {
  return items as CustomSearchItem[];
}

const sharedArgs = {
  size: 'md',
  autoAlign: false,
  type: 'default',
  titleText: 'Label',
  disabled: false,
  hideLabel: false,
  invalid: false,
  warn: false,
  open: false,
  helperText: 'This is helper text',
  warnText: 'Warning message goes here',
  invalidText: 'Error message goes here',
  label: 'This is a label',
  clearSelectionDescription: 'Total items selected: ',
  useTitleInItem: false,
  clearSelectionText: 'To clear selection, press Delete or Backspace,',
} as const;

const filterableArgTypes = {
  placeholder: {
    control: {
      type: 'text',
    },
    description:
      'Generic `placeholder` that will be used as the textual representation of what this field is for',
    table: {
      type: { summary: 'string' },
    },
  },
} as const;
export const Default: StoryFn<StoryArgs> = (args) => {
  const items: Item[] = [
    {
      id: 'downshift-1-item-0',
      text: 'Option 1',
    },
    {
      id: 'downshift-1-item-1',
      text: 'Option 2',
    },
    {
      id: 'downshift-1-item-2',
      text: 'Option 3 - a disabled item',
      disabled: true,
    },
    {
      id: 'downshift-1-item-3',
      text: 'Option 4',
    },
    {
      id: 'downshift-1-item-4',
      text: 'An example option that is really long to show what should be done to handle long text',
    },
    {
      id: 'downshift-1-item-5',
      text: 'Option 5',
    },
  ];
  return (
    <div
      style={{
        width: 300,
      }}>
      <MultiSelect
        label="Multiselect Label"
        id="carbon-multiselect-example"
        titleText="Multiselect title"
        helperText="This is helper text"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
        selectionFeedback="top-after-reopen"
        {...args}
      />
    </div>
  );
};

Default.args = { ...sharedArgs };

export const WithInitialSelectedItems: StoryFn<StoryArgs> = (args) => {
  const items: Item[] = [
    {
      id: 'downshift-1-item-0',
      text: 'Option 1',
    },
    {
      id: 'downshift-1-item-1',
      text: 'Option 2',
    },
    {
      id: 'downshift-1-item-2',
      text: 'Option 3 - a disabled item',
      disabled: true,
    },
    {
      id: 'downshift-1-item-3',
      text: 'Option 4',
    },
    {
      id: 'downshift-1-item-4',
      text: 'An example option that is really long to show what should be done to handle long text',
    },
    {
      id: 'downshift-1-item-5',
      text: 'Option 5',
    },
  ];
  return (
    <div
      style={{
        width: 300,
      }}>
      <MultiSelect
        label="Multiselect Label"
        id="carbon-multiselect-example-2"
        titleText="Multiselect title"
        helperText="This is helper text"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
        initialSelectedItems={[items[0] as Item, items[1] as Item]}
        selectionFeedback="top-after-reopen"
        {...args}
      />
    </div>
  );
};

WithInitialSelectedItems.args = { ...sharedArgs };

export const Filterable: StoryFn<FilterableArgs> = (args) => {
  const items: Item[] = [
    {
      id: 'downshift-1-item-0',
      text: 'Option 1',
    },
    {
      id: 'downshift-1-item-1',
      text: 'Option 2',
    },
    {
      id: 'downshift-1-item-2',
      text: 'Option 3 - a disabled item',
      disabled: true,
    },
    {
      id: 'downshift-1-item-3',
      text: 'Option 4',
    },
    {
      id: 'downshift-1-item-4',
      text: 'An example option that is really long to show what should be done to handle long text',
    },
    {
      id: 'downshift-1-item-5',
      text: 'Option 5',
    },
  ];

  return (
    <div
      style={{
        width: 300,
      }}>
      <FilterableMultiSelect
        id="carbon-multiselect-example-3"
        titleText="FilterableMultiSelect title"
        helperText="This is helper text"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
        selectionFeedback="top-after-reopen"
        {...args}
      />
    </div>
  );
};

Filterable.args = { ...sharedArgs };

export const FilterableWithSelectAll: StoryFn<FilterableArgs> = (args) => {
  return (
    <div
      style={{
        width: 300,
      }}>
      <FilterableMultiSelect
        id="carbon-multiselect-example-3"
        titleText="FilterableMultiSelect title"
        helperText="This is helper text"
        items={itemsWithSelectAll}
        itemToString={(item) => (item ? item.text : '')}
        selectionFeedback="top-after-reopen"
        {...args}
      />
    </div>
  );
};

FilterableWithSelectAll.args = { ...sharedArgs };

FilterableWithSelectAll.argTypes = {
  ...filterableArgTypes,
};
FilterableWithSelectAll.parameters = {
  controls: {
    exclude: ['label'],
  },
};
Filterable.argTypes = {
  ...filterableArgTypes,
  onChange: {
    action: 'onChange',
  },
  onMenuChange: {
    action: 'onMenuChange',
  },
};
Filterable.parameters = {
  controls: {
    exclude: ['label'],
  },
};

export const FilterableWithCustomSearch: StoryFn<CustomSearchArgs> = (args) => {
  const [searchResults, setSearchResults] = useState(customSearchItems);

  function handleInputValueChange(changes: InputValueChange) {
    action('onInputValueChange')(changes);
    const query = changes.inputValue?.trim().toLocaleLowerCase();

    setSearchResults(
      query
        ? customSearchItems.filter((item) => {
            return item.searchTerms.some((term) => term.includes(query));
          })
        : customSearchItems
    );
  }

  return (
    <div style={{ width: 300 }}>
      <FilterableMultiSelect
        {...args}
        id="carbon-multiselect-custom-search"
        titleText="Filter by category or color"
        helperText='Try searching for "fruit" or "green"'
        items={searchResults}
        itemToString={(item) => (item ? item.text : '')}
        filterItems={preserveCustomSearchResults}
        onInputValueChange={handleInputValueChange}
      />
    </div>
  );
};

FilterableWithCustomSearch.args = { ...sharedArgs };
FilterableWithCustomSearch.argTypes = {
  ...filterableArgTypes,
};
FilterableWithCustomSearch.parameters = {
  controls: {
    exclude: ['label'],
  },
};

export const WithLayerMultiSelect: StoryFn<StoryArgs> = (args) => (
  <WithLayer>
    {(layer) => (
      <div style={{ width: 300 }}>
        <MultiSelect
          label="Multiselect Label"
          id={`carbon-multiselect-example-${layer}`}
          titleText="Multiselect title"
          helperText="This is helper text"
          items={items}
          itemToString={(item) => (item ? item.text : '')}
          selectionFeedback="top-after-reopen"
          {...args}
        />
      </div>
    )}
  </WithLayer>
);
WithLayerMultiSelect.args = { ...sharedArgs };
export const _FilterableWithLayer: StoryFn<FilterableArgs> = (args) => (
  <WithLayer>
    {(layer) => (
      <div style={{ width: 300 }}>
        <FilterableMultiSelect
          id={`carbon-multiselect-example-${layer}`}
          titleText="Multiselect title"
          helperText="This is helper text"
          items={items}
          itemToString={(item) => (item ? item.text : '')}
          selectionFeedback="top-after-reopen"
          {...args}
        />
      </div>
    )}
  </WithLayer>
);

_FilterableWithLayer.args = { ...sharedArgs };

_FilterableWithLayer.argTypes = {
  ...filterableArgTypes,
};
_FilterableWithLayer.parameters = {
  controls: {
    exclude: ['label'],
  },
};
export const _Controlled: StoryFn<StoryArgs> = (args) => {
  const [selectedItems, setSelectedItems] = useState(
    items.filter((item) => item.id === 'downshift-1-item-0')
  );

  const onSelectionChanged = (value: Item[]) => {
    action('changed items')(value);
    setSelectedItems(value);
  };

  return (
    <div style={{ width: 300 }}>
      <MultiSelect
        id="carbon-multiselect-example-controlled"
        titleText="Multiselect title"
        label="Multiselect label"
        items={items}
        selectedItems={selectedItems}
        onChange={(data: { selectedItems: Item[] }) =>
          onSelectionChanged(data.selectedItems)
        }
        itemToString={(item) => (item ? item.text : '')}
        selectionFeedback="top-after-reopen"
        {...args}
      />
      <br />
      <ButtonSet>
        <Button
          id="all"
          onClick={() =>
            setSelectedItems(items.filter((item) => !item.disabled))
          }>
          Select all
        </Button>
        <Button
          id="clear"
          kind="secondary"
          onClick={() => setSelectedItems([])}>
          Clear
        </Button>
      </ButtonSet>
    </div>
  );
};

_Controlled.args = { ...sharedArgs };
const itemsWithSelectAll: Item[] = [
  {
    id: 'downshift-1-item-0',
    text: 'Editor',
  },
  {
    id: 'downshift-1-item-1',
    text: 'Owner',
  },
  {
    id: 'downshift-1-item-2',
    text: 'Uploader',
  },
  {
    id: 'downshift-1-item-3',
    text: 'Reader - a disabled item',
    disabled: true,
  },
  {
    id: 'select-all',
    text: 'All roles',
    isSelectAll: true,
  },
];

export const SelectAll: StoryFn<StoryArgs> = (args) => {
  const [label, setLabel] = useState('Choose options');

  const onChange = (value: { selectedItems: Item[] }) => {
    if (value.selectedItems.length == 1) {
      setLabel('Option selected');
    } else if (value.selectedItems.length > 1) {
      setLabel('Options selected');
    } else {
      setLabel('Choose options');
    }
  };

  return (
    <div style={{ width: 300 }}>
      <MultiSelect
        label={label}
        id="carbon-multiselect-example"
        titleText="Multiselect title"
        helperText="This is helper text"
        items={itemsWithSelectAll}
        itemToString={(item) => (item ? item.text : '')}
        selectionFeedback="top-after-reopen"
        onChange={onChange}
        {...args}
      />
    </div>
  );
};

SelectAll.args = { ...sharedArgs };

const aiLabel = (
  <AILabel className="ai-label-container">
    <AILabelContent>
      <div>
        <p className="secondary">AI Explained</p>
        <h2 className="ai-label-heading">84%</h2>
        <p className="secondary bold">Confidence score</p>
        <p className="secondary">
          Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.
        </p>
        <hr />
        <p className="secondary">Model type</p>
        <p className="bold">Foundation model</p>
      </div>
      <AILabelActions>
        <IconButton kind="ghost" label="View">
          <View />
        </IconButton>
        <IconButton kind="ghost" label="Open Folder">
          <FolderOpen />
        </IconButton>
        <IconButton kind="ghost" label="Folders">
          <Folders />
        </IconButton>
        <Button>View details</Button>
      </AILabelActions>
    </AILabelContent>
  </AILabel>
);

export const withAILabel: StoryFn<StoryArgs> = (args) => (
  <div style={{ width: 400 }}>
    <MultiSelect
      label="Multiselect Label"
      id="carbon-multiselect-example"
      titleText="Multiselect title"
      helperText="This is helper text"
      items={items}
      itemToString={(item) => (item ? item.text : '')}
      selectionFeedback="top-after-reopen"
      decorator={aiLabel}
      {...args}
    />
  </div>
);

withAILabel.args = { ...sharedArgs };
export const FilterableWithAILabel: StoryFn<FilterableArgs> = (args) => (
  <div style={{ width: 400 }}>
    <FilterableMultiSelect
      id="carbon-multiselect-example"
      titleText="Multiselect title"
      helperText="This is helper text"
      items={items}
      itemToString={(item) => (item ? item.text : '')}
      selectionFeedback="top-after-reopen"
      decorator={aiLabel}
      {...args}
    />
  </div>
);

FilterableWithAILabel.args = { ...sharedArgs };
FilterableWithAILabel.argTypes = {
  ...filterableArgTypes,
};
FilterableWithAILabel.parameters = {
  controls: {
    exclude: ['label'],
  },
};
export const ExperimentalAutoAlign: StoryFn<StoryArgs> = (args) => {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    ref?.current?.scrollIntoView({ block: 'center', inline: 'center' });
  });
  return (
    <div style={{ width: '5000px', height: '5000px' }}>
      <div
        style={{
          position: 'absolute',
          top: '2500px',
          left: '2500px',
          width: 300,
        }}>
        <MultiSelect
          label="Multiselect Label"
          id="carbon-multiselect-example"
          titleText="Multiselect title"
          helperText="This is helper text"
          items={items}
          itemToString={(item) => (item ? item.text : '')}
          selectionFeedback="top-after-reopen"
          ref={ref}
          autoAlign
          {...args}
        />
      </div>
    </div>
  );
};

ExperimentalAutoAlign.argTypes = {
  autoAlign: {
    control: false,
  },
};

ExperimentalAutoAlign.args = { ...sharedArgs, autoAlign: true };

export const SelectAllWithDynamicItems: StoryFn<StoryArgs> = (args) => {
  const [label, setLabel] = useState('Choose options');
  const [items, setItems] = useState(itemsWithSelectAll);

  const onChange = (value: { selectedItems: Item[] }) => {
    if (value.selectedItems.length == 1) {
      setLabel('Option selected');
    } else if (value.selectedItems.length > 1) {
      setLabel('Options selected');
    } else {
      setLabel('Choose options');
    }
  };

  function addItems() {
    setItems((prevItems) => {
      const now = Date.now();
      return [
        ...prevItems,
        {
          id: `item-added-via-button-1${now}`,
          text: `item-added-via-button-1${now}`,
        },
        {
          id: `item-added-via-button-2${now}`,
          text: `item-added-via-button-2${now}`,
        },
      ];
    });
  }

  return (
    <div style={{ width: 300 }}>
      <MultiSelect
        label={label}
        id="carbon-multiselect-example"
        titleText="Multiselect title"
        helperText="This is helper text"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
        selectionFeedback="top-after-reopen"
        onChange={onChange}
        {...args}
      />
      <Button onClick={addItems}>Add 2 items to the list</Button>
    </div>
  );
};

SelectAllWithDynamicItems.args = { ...sharedArgs };
