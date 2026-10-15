/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, AI label story styles as plain CSS, source tag, story names unified, payment term example data, prop descriptions from Carbon's type definitions, titleText control, state stories. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useState } from 'react';
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
  ComboBox,
  IconButton,
} from '../../index.js';
import type { ComboBoxProps } from '../../index.js';
import { FolderOpen, Folders, View } from '../../icons.js';
import mdx from './ComboBox.mdx';

interface Item {
  id: string;
  text: string;
  disabled?: boolean;
}

type ItemArgs = Partial<ComboBoxProps<Item>>;
type StringArgs = Partial<ComboBoxProps<string>> &
  Pick<ComboBoxProps<string>, 'onChange'>;

const items: Item[] = paymentTermItems;
const itemTexts = paymentTermItems
  .filter((item) => !item.disabled)
  .map((item) => item.text);

export default {
  title: 'Components/ComboBox',
  component: ComboBox,
  // Docgen lists only a few ComboBox props (cause not found; Dropdown's types
  // have the same shape and fill in), so the main ones are listed here with
  // Carbon 1.118's descriptions.
  argTypes: {
    allowCustomValue: {
      control: 'boolean',
      description:
        'Specify whether or not the ComboBox should allow a value that is not in the list to be entered in the input',
      table: { type: { summary: 'boolean' } },
    },
    autoAlign: {
      control: 'boolean',
      description:
        '**Experimental**: Will attempt to automatically align the floating element to avoid collisions with the viewport and being clipped by ancestor elements. Requires React v17+',
      table: { type: { summary: 'boolean' } },
    },
    decorator: {
      description:
        '**Experimental**: Provide a `decorator` component to be rendered inside the `ComboBox` component',
      table: { type: { summary: 'ReactNode' } },
    },
    direction: {
      control: 'select',
      options: ['top', 'bottom'],
      description:
        'Specify the direction of the combobox dropdown. Can be either top or bottom.',
      table: { type: { summary: "'top' | 'bottom'" } },
    },
    disabled: {
      control: 'boolean',
      description: 'Specify if the control should be disabled, or not',
      table: { type: { summary: 'boolean' } },
    },
    downshiftProps: {
      description:
        "Additional props passed to Downshift. **Use with caution:** anything you define here overrides the components' internal handling of that prop. Downshift APIs and internals are subject to change, and in some cases they can not be shimmed by Carbon to shield you from potentially breaking changes.",
      table: { type: { summary: 'Partial<UseComboboxProps<ItemType>>' } },
    },
    downshiftActions: {
      description:
        'Provide a ref that will be mutated to contain an object of downshift action functions. These can be called to change the internal state of the downshift useCombobox hook. **Use with caution:** calling these actions modifies the internal state of downshift. It may conflict with or override the state management used within Combobox. Downshift APIs and internals are subject to change, and in some cases they can not be shimmed by Carbon to shield you from potentially breaking changes.',
      table: {
        type: {
          summary: 'RefObject<UseComboboxActions<ItemType> | undefined>',
        },
      },
    },
    helperText: {
      control: 'text',
      description:
        'Provide helper text that is used alongside the control label for additional help',
      table: { type: { summary: 'ReactNode' } },
    },
    initialSelectedItem: {
      description:
        'Allow users to pass in an arbitrary item or a string (in case their items are an array of strings) from their collection that are pre-selected',
      table: { type: { summary: 'ItemType' } },
    },
    invalid: {
      control: 'boolean',
      description: 'Specify if the currently selected value is invalid.',
      table: { type: { summary: 'boolean' } },
    },
    invalidText: {
      control: 'text',
      description: 'Message which is displayed if the value is invalid.',
      table: { type: { summary: 'ReactNode' } },
    },
    itemToElement: {
      description:
        'Renders an item as a custom React node instead of a string.',
      table: { type: { summary: '((item: ItemType) => ReactNode) | null' } },
    },
    itemToString: {
      description:
        'Helper function passed to downshift that allows the library to render a given item to a string label. By default, it extracts the `label` field from a given item to serve as the item label in the list',
      table: { type: { summary: 'ItemToStringHandler<ItemType>' } },
    },
    items: {
      description:
        'We try to stay as generic as possible here to allow individuals to pass in a collection of whatever kind of data structure they prefer',
      table: { type: { summary: 'ItemType[]' } },
    },
    onChange: {
      action: 'onChange',
      description:
        '`onChange` is a utility for this controlled component to communicate to a consuming component when a specific dropdown item is selected. `({ selectedItem }) => void`',
      table: { type: { summary: '(data: OnChangeData<ItemType>) => void' } },
    },
    onInputChange: {
      action: 'onInputChange',
      description:
        'Callback function to notify consumer when the text input changes. This provides support to change available items based on the text. `(inputText) => void`',
      table: { type: { summary: '(inputText: string) => void' } },
    },
    onToggleClick: {
      action: 'onToggleClick',
      description:
        'Callback function that fires when the combobox menu toggle is clicked `(evt) => void`',
      table: {
        type: { summary: '(evt: MouseEvent<HTMLButtonElement>) => void' },
      },
    },
    placeholder: {
      control: 'text',
      description:
        'Used to provide a placeholder text node before a user enters any input. This is only present if the control has no items selected',
      table: { type: { summary: 'string' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether or not the component is read-only',
      table: { type: { summary: 'boolean' } },
    },
    selectedItem: {
      description: 'For full control of the selection',
      table: { type: { summary: 'ItemType | null' } },
    },
    shouldFilterItem: {
      description:
        'Specify your own filtering logic by passing in a `shouldFilterItem` function that takes in the current input and an item and passes back whether or not the item should be filtered. this prop will be ignored if `typeahead` prop is enabled',
      table: {
        type: {
          summary:
            '(input: { item: ItemType; itemToString: ItemToStringHandler<ItemType>; inputValue: string | null }) => boolean',
        },
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description:
        'Specify the size of the ListBox. Currently supports either `xs`, `sm`, `md` or `lg` as an option.',
      table: { type: { summary: 'ListBoxSize' } },
    },
    titleText: {
      control: 'text',
      description:
        'Provide text to be used in a `<label>` element that is tied to the combobox via ARIA attributes.',
      table: { type: { summary: 'ReactNode' } },
    },
    typeahead: {
      control: 'boolean',
      description:
        '**Experimental**: will enable autocomplete and typeahead for the input field',
      table: { type: { summary: 'boolean' } },
    },
    warn: {
      control: 'boolean',
      description: 'Specify whether the control is currently in warning state',
      table: { type: { summary: 'boolean' } },
    },
    warnText: {
      control: 'text',
      description:
        'Provide the text that is displayed when the control is in warning state',
      table: { type: { summary: 'ReactNode' } },
    },
    inputProps: {
      description:
        "Specify native input attributes to place on the `<input>`, like maxLength. These are passed to downshift's getInputProps() and will override the internal input props. https://github.com/downshift-js/downshift?tab=readme-ov-file#getinputprops",
      table: { type: { summary: 'InputHTMLAttributes<HTMLInputElement>' } },
    },

    light: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: [
        'aria-label',
        'id',
        'downshiftProps',
        'initialSelectedItem',
        'items',
        'itemToElement',
        'itemToString',
        'selectedItem',
        'shouldFilterItem',
        'translateWithId',
        'type',
      ],
    },
  },
  tags: ['carbon'],
} satisfies Meta<typeof ComboBox>;

const sharedArgs = {
  titleText: 'Payment terms',
  helperText: 'Applies to new invoices for this customer',
  placeholder: 'Choose payment terms',
  invalidText: 'Choose payment terms.',
  warnText: "Longer than this customer's usual terms.",
} satisfies ItemArgs;

const sharedArgTypes = {
  onChange: {
    action: 'onChange',
  },
  onToggleClick: {
    action: 'clicked',
  },
  invalidText: {
    control: 'text',
  },
  warnText: {
    control: 'text',
  },
} as const;

export const Default: StoryFn<ItemArgs> = (args) => {
  return (
    <div style={{ width: 300 }}>
      <ComboBox
        id="carbon-combobox"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
        onChange={action('onChange')}
        {...args}
      />
    </div>
  );
};

Default.args = { ...sharedArgs };
Default.argTypes = { ...sharedArgTypes };

export const AllowCustomValue: StoryFn<StringArgs> = (args) => {
  const filterItems = (
    menu: Parameters<NonNullable<ComboBoxProps<string>['shouldFilterItem']>>[0]
  ) => {
    return menu?.item
      ?.toLowerCase()
      .includes(String(menu?.inputValue?.toLowerCase()));
  };
  return (
    <div style={{ width: 300 }}>
      <ComboBox
        allowCustomValue
        shouldFilterItem={filterItems}
        id="carbon-combobox"
        items={itemTexts}
        {...args}
      />
    </div>
  );
};

AllowCustomValue.args = { ...sharedArgs };
AllowCustomValue.argTypes = { ...sharedArgTypes };

export const AutocompleteWithTypeahead: StoryFn<StringArgs> = (args) => {
  return (
    <div style={{ width: 300 }}>
      <ComboBox id="carbon-combobox" items={itemTexts} {...args} typeahead />
    </div>
  );
};

AutocompleteWithTypeahead.args = { ...sharedArgs };
AutocompleteWithTypeahead.argTypes = {
  ...sharedArgTypes,
  onChange: { action: 'onChange' },
};

export const AutoAlign: StoryFn<ItemArgs> = (args) => (
  <div style={{ width: 400 }}>
    <div style={{ height: 300 }}></div>
    <ComboBox
      onChange={() => {}}
      id="carbon-combobox"
      items={items}
      itemToString={(item) => (item ? item.text : '')}
      autoAlign={true}
      {...args}
    />
    <div style={{ height: 800 }}></div>
  </div>
);

AutoAlign.args = { ...sharedArgs };
AutoAlign.argTypes = { ...sharedArgTypes };

export const WithLayer: StoryFn<ItemArgs> = (args) => (
  <WithLayerTemplate>
    {(layer) => (
      <div style={{ width: 300 }}>
        <ComboBox
          onChange={() => {}}
          id={`carbon-combobox-${layer}`}
          items={items}
          itemToString={(item) => (item ? item.text : '')}
          {...args}
        />
      </div>
    )}
  </WithLayerTemplate>
);

WithLayer.args = { ...sharedArgs };
WithLayer.argTypes = { ...sharedArgTypes };

export const WithAILabel: StoryFn<ItemArgs> = (args) => {
  const aiLabel = (
    <AILabel className="ai-label-container">
      <AILabelContent>
        <div>
          <p className="secondary">AI Explained</p>
          <h2 className="ai-label-heading">84%</h2>
          <p className="secondary bold">Confidence score</p>
          <p className="secondary">
            Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.
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
  return (
    <div style={{ width: 300 }}>
      <ComboBox
        onChange={action('onChange')}
        id="carbon-combobox"
        items={items}
        itemToString={(item) => (item ? item.text : '')}
        decorator={aiLabel}
        {...args}
      />
    </div>
  );
};

WithAILabel.args = { ...sharedArgs };
WithAILabel.argTypes = { ...sharedArgTypes };

export const Controlled: StoryFn<ItemArgs> = (args) => {
  const options = items.filter((item) => !item.disabled).slice(0, 3);
  const [value, setValue] = useState<Item | null>(options[0] ?? null);
  const onChange = ({
    selectedItem,
  }: {
    selectedItem: Item | null | undefined;
  }) => {
    setValue(selectedItem ?? null);
  };

  return (
    <div>
      <ComboBox
        {...args}
        onChange={onChange}
        id="carbon-combobox"
        items={options}
        selectedItem={value}
        itemToString={(item) => (item ? item.text : '')}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Button onClick={() => setValue(null)}>Clear</Button>
        {options.map((option) => (
          <Button key={option.id} onClick={() => setValue(option)}>
            {option.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

Controlled.args = { ...sharedArgs };
Controlled.argTypes = { ...sharedArgTypes };

export const Disabled: StoryFn<ItemArgs> = Default.bind({});
Disabled.args = { ...sharedArgs, disabled: true };
Disabled.argTypes = Default.argTypes;
// Carbon greys out disabled text below 4.5:1. WCAG 1.4.3 exempts inactive
// components, but axe checks the helper text anyway.
Disabled.parameters = {
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
};

export const ReadOnly: StoryFn<ItemArgs> = Default.bind({});
ReadOnly.args = {
  ...sharedArgs,
  readOnly: true,
  initialSelectedItem: items[3] as Item,
};
ReadOnly.argTypes = Default.argTypes;

// Carbon 1.118 links the error text but sets no aria-invalid. ComboBox spreads
// rest props on its input, so the story passes it. Upstream issue drafted, not
// filed.
export const Invalid: StoryFn<ItemArgs> = Default.bind({});
Invalid.args = { ...sharedArgs, invalid: true, 'aria-invalid': true };
Invalid.argTypes = Default.argTypes;

export const Warning: StoryFn<ItemArgs> = Default.bind({});
Warning.args = {
  ...sharedArgs,
  warn: true,
  initialSelectedItem: items[5] as Item,
};
Warning.argTypes = Default.argTypes;
