/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript (ignored label prop dropped from FilterableWithAILabel), components and icons from @afframe/ui, AI label story styles as plain CSS, source tag, story names unified, payment term example data, state stories. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { WithLayer as WithLayerTemplate } from '../../../.storybook/templates/WithLayer/index.js';
import { paymentTermItems } from '../../../.storybook/exampleData.js';
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

const items: Item[] = paymentTermItems;

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
  titleText: 'Payment terms offered',
  disabled: false,
  hideLabel: false,
  invalid: false,
  warn: false,
  open: false,
  helperText: 'Customers can pick any of these on the invoice',
  warnText: 'Customers usually pick the longest term offered.',
  invalidText: 'Choose at least one payment term.',
  label: 'Choose payment terms',
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
  return (
    <div
      style={{
        width: 300,
      }}>
      <MultiSelect
        label="Choose payment terms"
        id="carbon-multiselect-example"
        titleText="Payment terms offered"
        helperText="Customers can pick any of these on the invoice"
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
  return (
    <div
      style={{
        width: 300,
      }}>
      <MultiSelect
        label="Choose payment terms"
        id="carbon-multiselect-example-2"
        titleText="Payment terms offered"
        helperText="Customers can pick any of these on the invoice"
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
  return (
    <div
      style={{
        width: 300,
      }}>
      <FilterableMultiSelect
        id="carbon-multiselect-example-3"
        titleText="Payment terms offered"
        helperText="Customers can pick any of these on the invoice"
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
        titleText="Payment terms offered"
        helperText="Customers can pick any of these on the invoice"
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

export const WithLayer: StoryFn<StoryArgs> = (args) => (
  <WithLayerTemplate>
    {(layer) => (
      <div style={{ width: 300 }}>
        <MultiSelect
          label="Choose payment terms"
          id={`carbon-multiselect-example-${layer}`}
          titleText="Payment terms offered"
          helperText="Customers can pick any of these on the invoice"
          items={items}
          itemToString={(item) => (item ? item.text : '')}
          selectionFeedback="top-after-reopen"
          {...args}
        />
      </div>
    )}
  </WithLayerTemplate>
);
WithLayer.args = { ...sharedArgs };
export const FilterableWithLayer: StoryFn<FilterableArgs> = (args) => (
  <WithLayerTemplate>
    {(layer) => (
      <div style={{ width: 300 }}>
        <FilterableMultiSelect
          id={`carbon-multiselect-example-${layer}`}
          titleText="Payment terms offered"
          helperText="Customers can pick any of these on the invoice"
          items={items}
          itemToString={(item) => (item ? item.text : '')}
          selectionFeedback="top-after-reopen"
          {...args}
        />
      </div>
    )}
  </WithLayerTemplate>
);

FilterableWithLayer.args = { ...sharedArgs };

FilterableWithLayer.argTypes = {
  ...filterableArgTypes,
};
FilterableWithLayer.parameters = {
  controls: {
    exclude: ['label'],
  },
};
export const Controlled: StoryFn<StoryArgs> = (args) => {
  const [selectedItems, setSelectedItems] = useState(
    items.filter((item) => item.id === 'net-30')
  );

  const onSelectionChanged = (value: Item[]) => {
    action('changed items')(value);
    setSelectedItems(value);
  };

  return (
    <div style={{ width: 300 }}>
      <MultiSelect
        id="carbon-multiselect-example-controlled"
        titleText="Payment terms offered"
        label="Choose payment terms"
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

Controlled.args = { ...sharedArgs };
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
        titleText="Payment terms offered"
        helperText="Customers can pick any of these on the invoice"
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

export const WithAILabel: StoryFn<StoryArgs> = (args) => (
  <div style={{ width: 400 }}>
    <MultiSelect
      label="Choose payment terms"
      id="carbon-multiselect-example"
      titleText="Payment terms offered"
      helperText="Customers can pick any of these on the invoice"
      items={items}
      itemToString={(item) => (item ? item.text : '')}
      selectionFeedback="top-after-reopen"
      decorator={aiLabel}
      {...args}
    />
  </div>
);

WithAILabel.args = { ...sharedArgs };
export const FilterableWithAILabel: StoryFn<FilterableArgs> = (args) => (
  <div style={{ width: 400 }}>
    <FilterableMultiSelect
      id="carbon-multiselect-example"
      titleText="Payment terms offered"
      helperText="Customers can pick any of these on the invoice"
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
export const AutoAlign: StoryFn<StoryArgs> = (args) => {
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
          label="Choose payment terms"
          id="carbon-multiselect-example"
          titleText="Payment terms offered"
          helperText="Customers can pick any of these on the invoice"
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

AutoAlign.argTypes = {
  autoAlign: {
    control: false,
  },
};

AutoAlign.args = { ...sharedArgs, autoAlign: true };

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
        titleText="Payment terms offered"
        helperText="Customers can pick any of these on the invoice"
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

export const Disabled: StoryFn<StoryArgs> = Default.bind({});
Disabled.args = { ...sharedArgs, disabled: true };
// Carbon greys out disabled text below 4.5:1. WCAG 1.4.3 exempts inactive
// components, but axe checks the helper text anyway.
Disabled.parameters = {
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
};

export const ReadOnly: StoryFn<StoryArgs> = WithInitialSelectedItems.bind({});
ReadOnly.args = { ...sharedArgs, readOnly: true };

// Carbon 1.118 gives the error text no id, links nothing to it and sets no
// aria-invalid; MultiSelect takes no extra props to fix it from outside.
// Upstream issue drafted, not filed.
export const Invalid: StoryFn<StoryArgs> = Default.bind({});
Invalid.args = { ...sharedArgs, invalid: true };

export const Warning: StoryFn<StoryArgs> = WithInitialSelectedItems.bind({});
Warning.args = { ...sharedArgs, warn: true };
