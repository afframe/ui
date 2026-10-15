/**
 * Copyright IBM Corp. 2022, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: labelText added to the TextInput in the expandable stories (story markup fix for the a11y label rule), TypeScript, components and icons from @afframe/ui, source tag, styles from tile-story.css, inner WithFeatureFlags decorator removed (`enable-tile-contrast` is on globally; the v12 tile icon flags stay off, ADR 0018), inline spacing as Carbon spacing tokens, story names unified, expandable story wrappers capped at the screen width, example data from the Afframe glossary (plans, AI label text). Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { action } from 'storybook/actions';
import type { ArgTypes, Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { FolderOpen, Folders, View } from '../../icons.js';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  ClickableTile,
  ExpandableTile,
  IconButton,
  Layer,
  RadioTile,
  SelectableTile,
  TextInput,
  Tile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
  TileGroup,
} from '../../index.js';
import type {
  ClickableTileProps,
  ExpandableTileProps,
  RadioTileProps,
  SelectableTileProps,
  TileGroupProps,
} from '../../index.js';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import './tile-story.css';

// RadioTile forwards style to its label but does not declare it in its props.
const radioTileGap = { style: { marginBottom: 'var(--cds-spacing-03)' } };

export default {
  title: 'Components/Tile/Feature Flags',
  component: Tile,
  tags: ['carbon', '!autodocs'],
  subcomponents: {
    ClickableTile,
    SelectableTile,
    ExpandableTile,
    RadioTile,
    TileGroup,
    TileAboveTheFoldContent,
    TileBelowTheFoldContent,
  },
  argTypes: {
    light: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Tile>;

const previewClassname = 'preview-tile';

const clickableArgs: ClickableTileProps = {
  clicked: false,
  disabled: false,
  href: 'https://www.carbondesignsystem.com/',
  light: false,
  rel: '',
  title: '',
  onClick: action('onClick'),
  onKeyDown: action('onKeyDown'),
};

const clickableArgTypes: Partial<ArgTypes<ClickableTileProps>> = {
  clicked: {
    control: 'boolean',
  },
  disabled: {
    control: 'boolean',
  },
  href: {
    control: 'text',
  },
  light: {
    control: 'boolean',
  },
  rel: {
    control: 'text',
  },
  title: {
    control: 'text',
  },
  onClick: {
    action: 'onClick',
  },
  onKeyDown: {
    action: 'onKeyDown',
  },
};

const clickableControls = Object.keys(clickableArgTypes);

const selectableArgs: SelectableTileProps = {
  disabled: false,
  light: false,
  selected: false,
  tabIndex: 0,
  title: 'Selectable tile',
  onChange: action('onChange'),
  onClick: action('onClick'),
  onKeyDown: action('onKeyDown'),
};

const selectableArgTypes: Partial<ArgTypes<SelectableTileProps>> = {
  disabled: {
    control: 'boolean',
  },
  light: {
    control: 'boolean',
  },
  selected: {
    control: 'boolean',
  },
  tabIndex: {
    control: 'number',
  },
  title: {
    control: 'text',
  },
  onChange: {
    action: 'onChange',
  },
  onClick: {
    action: 'onClick',
  },
  onKeyDown: {
    action: 'onKeyDown',
  },
};

const selectableControls = Object.keys(selectableArgTypes);

type RadioStoryArgs = TileGroupProps<RadioTileProps['value']>;

const radioArgs: RadioStoryArgs = {
  disabled: false,
  legend: 'Plan',
  name: 'radio tile group',
  required: false,
  valueSelected: 'radio-tile-2',
  onChange: action('onChange'),
};

const radioArgTypes: Partial<ArgTypes<RadioStoryArgs>> = {
  disabled: {
    control: 'boolean',
  },
  legend: {
    control: 'text',
  },
  name: {
    control: 'text',
  },
  required: {
    control: 'boolean',
  },
  valueSelected: {
    control: 'select',
    options: ['radio-tile-1', 'radio-tile-2', 'radio-tile-3'],
  },
  onChange: {
    action: 'onChange',
  },
};

const radioControls = Object.keys(radioArgTypes);

const expandableArgs: ExpandableTileProps = {
  expanded: false,
  light: false,
  tileCollapsedIconText: 'Interact to expand tile',
  tileCollapsedLabel: '',
  tileExpandedIconText: 'Interact to collapse tile',
  tileExpandedLabel: '',
  tileMaxHeight: 0,
  tilePadding: 0,
  onClick: action('onClick'),
  onKeyUp: action('onKeyUp'),
};

const expandableArgTypes: Partial<ArgTypes<ExpandableTileProps>> = {
  expanded: {
    control: 'boolean',
  },
  light: {
    control: 'boolean',
  },
  tileCollapsedIconText: {
    control: 'text',
  },
  tileCollapsedLabel: {
    control: 'text',
  },
  tileExpandedIconText: {
    control: 'text',
  },
  tileExpandedLabel: {
    control: 'text',
  },
  tileMaxHeight: {
    control: 'number',
  },
  tilePadding: {
    control: 'number',
  },
  onClick: {
    action: 'onClick',
  },
  onKeyUp: {
    action: 'onKeyUp',
  },
};

const expandableControls = Object.keys(expandableArgTypes);

export const Clickable: StoryFn<ClickableTileProps> = (args) => {
  return (
    <div className={previewClassname}>
      <ClickableTile
        id="clickable-tile-1"
        href="https://www.carbondesignsystem.com/"
        {...args}>
        Clickable Tile
      </ClickableTile>
    </div>
  );
};

Clickable.args = {
  ...clickableArgs,
};

Clickable.argTypes = clickableArgTypes;

Clickable.parameters = {
  controls: {
    include: clickableControls,
  },
};

export const ClickableWithLayer: StoryFn<ClickableTileProps> = (args) => {
  return (
    <WithLayer>
      {(layer) => (
        <div className={previewClassname}>
          <ClickableTile id={`clickable-tile-${layer}`} {...args}>
            Clickable Tile
          </ClickableTile>
        </div>
      )}
    </WithLayer>
  );
};

ClickableWithLayer.args = {
  ...clickableArgs,
};

ClickableWithLayer.argTypes = clickableArgTypes;

ClickableWithLayer.parameters = {
  controls: {
    include: clickableControls,
  },
};

export const Selectable: StoryFn<SelectableTileProps> = (args) => {
  return (
    <div className={previewClassname}>
      <SelectableTile
        id="selectable-tile-1"
        name="tiles"
        value="selectable"
        {...args}>
        Selectable
      </SelectableTile>
    </div>
  );
};

Selectable.args = {
  ...selectableArgs,
};

Selectable.argTypes = selectableArgTypes;

Selectable.parameters = {
  controls: {
    include: selectableControls,
  },
};

export const MultiSelect: StoryFn<SelectableTileProps> = (args) => {
  return (
    <div
      role="group"
      aria-label="selectable tiles"
      className={previewClassname}>
      <SelectableTile id="selectable-tile-1" name="tiles" {...args}>
        Starter
      </SelectableTile>
      <SelectableTile id="selectable-tile-2" name="tiles" {...args}>
        Business
      </SelectableTile>
      <SelectableTile id="selectable-tile-3" name="tiles" {...args}>
        Enterprise
      </SelectableTile>
    </div>
  );
};

MultiSelect.args = {
  ...selectableArgs,
};

MultiSelect.argTypes = selectableArgTypes;

MultiSelect.parameters = {
  controls: {
    include: selectableControls,
  },
};

export const Radio: StoryFn<RadioStoryArgs> = (args) => {
  return (
    <div className={previewClassname}>
      <TileGroup {...args}>
        <RadioTile id="radio-tile-1" value="radio-tile-1" {...radioTileGap}>
          Starter
        </RadioTile>
        <RadioTile id="radio-tile-2" value="radio-tile-2" {...radioTileGap}>
          Business
        </RadioTile>
        <RadioTile id="radio-tile-3" value="radio-tile-3" disabled>
          Enterprise
        </RadioTile>
      </TileGroup>
    </div>
  );
};

Radio.args = {
  ...radioArgs,
};

Radio.argTypes = radioArgTypes;

Radio.parameters = {
  controls: {
    include: radioControls,
  },
};

export const RadioWithLayer: StoryFn<RadioStoryArgs> = (args) => {
  return (
    <WithLayer>
      {(layer) => (
        <div className={previewClassname}>
          <TileGroup {...args}>
            <RadioTile
              id={`radio-tile-${layer}-1`}
              value="radio-tile-1"
              {...radioTileGap}>
              Starter
            </RadioTile>
            <RadioTile id={`radio-tile-${layer}-2`} value="radio-tile-2">
              Business
            </RadioTile>
          </TileGroup>
        </div>
      )}
    </WithLayer>
  );
};

RadioWithLayer.args = {
  ...radioArgs,
};

RadioWithLayer.argTypes = {
  ...radioArgTypes,
  valueSelected: {
    ...radioArgTypes.valueSelected,
    options: ['radio-tile-1', 'radio-tile-2'],
  },
};

RadioWithLayer.parameters = {
  controls: {
    include: radioControls,
  },
};

export const Expandable: StoryFn<ExpandableTileProps> = (args) => (
  <div
    style={{ width: '400px', maxWidth: '100%' }}
    className={previewClassname}>
    <ExpandableTile id="expandable-tile-1" {...args}>
      <TileAboveTheFoldContent>
        <div style={{ height: '200px' }}>Above the fold content here</div>
      </TileAboveTheFoldContent>
      <TileBelowTheFoldContent>
        <div style={{ height: '400px' }}>Below the fold content here</div>
      </TileBelowTheFoldContent>
    </ExpandableTile>
  </div>
);

Expandable.args = {
  ...expandableArgs,
};

Expandable.argTypes = expandableArgTypes;

Expandable.parameters = {
  controls: {
    include: expandableControls,
  },
};

export const ExpandableWithInteractive: StoryFn<ExpandableTileProps> = (
  args
) => (
  <div
    style={{ width: '400px', maxWidth: '100%' }}
    className={previewClassname}>
    <ExpandableTile id="expandable-tile-1" {...args}>
      <TileAboveTheFoldContent>
        <div style={{ height: '200px', width: '200px' }}>
          Above the fold content here
          <div style={{ paddingTop: 'var(--cds-spacing-05)' }}>
            <Button>Example</Button>
          </div>
        </div>
      </TileAboveTheFoldContent>
      <TileBelowTheFoldContent>
        <div style={{ height: '200px', width: '200px' }}>
          Below the fold content here
          <TextInput
            id="test2"
            labelText="Text input label"
            invalidText="A valid value is required"
          />
        </div>
      </TileBelowTheFoldContent>
    </ExpandableTile>
  </div>
);

ExpandableWithInteractive.args = {
  ...expandableArgs,
};

ExpandableWithInteractive.argTypes = expandableArgTypes;

ExpandableWithInteractive.parameters = {
  controls: {
    include: expandableControls,
  },
};

export const ExpandableWithLayer: StoryFn<ExpandableTileProps> = (args) => {
  return (
    <WithLayer>
      {(layer) => (
        <div
          style={{ width: '400px', maxWidth: '100%' }}
          className={previewClassname}>
          <ExpandableTile id={`expandable-tile-${layer}`} {...args}>
            <TileAboveTheFoldContent>
              <div style={{ height: '100px', width: '200px' }}>
                Above the fold content here
              </div>
            </TileAboveTheFoldContent>
            <TileBelowTheFoldContent>
              <div style={{ height: '200px', width: '200px' }}>
                Below the fold content here
                <Layer>
                  <TextInput
                    id={`expandable-tile-${layer}-input`}
                    labelText="Text input label"
                    invalidText="A valid value is required"
                  />
                </Layer>
              </div>
            </TileBelowTheFoldContent>
          </ExpandableTile>
        </div>
      )}
    </WithLayer>
  );
};

ExpandableWithLayer.args = {
  ...expandableArgs,
};

ExpandableWithLayer.argTypes = expandableArgTypes;

ExpandableWithLayer.parameters = {
  controls: {
    include: expandableControls,
  },
};

const aiLabel = (
  <AILabel className="ai-label-container">
    <AILabelContent>
      <div>
        <p className="secondary">AI Explained</p>
        <h2 className="ai-label-heading">84%</h2>
        <p className="secondary bold">Confidence score</p>
        <p className="secondary">
          Amounts suggested from the last 12 months of invoices.
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

export const WithAILabel: StoryObj<{ hasRoundedCorners?: boolean }> = {
  args: {
    hasRoundedCorners: false,
  },
  argTypes: {
    hasRoundedCorners: {
      control: 'boolean',
    },
  },
  parameters: {
    controls: {
      include: ['hasRoundedCorners'],
    },
  },
  render: (args) => (
    <div className="ai-label-selectable-tile-container ai-label-preview-radio-tile-container">
      <TileGroup
        defaultSelected="default-selected"
        legend="Plan"
        name="radio tile group two"
        {...args}>
        <RadioTile
          className="ai-label-radio-tile"
          id="radio-tile-4"
          value="standard"
          decorator={aiLabel}
          {...args}>
          Starter
        </RadioTile>
        <RadioTile
          className="ai-label-radio-tile"
          id="radio-tile-5"
          value="default-selected"
          decorator={aiLabel}
          {...args}>
          Business
        </RadioTile>
        <RadioTile
          className="ai-label-radio-tile"
          id="radio-tile-6"
          value="selected"
          decorator={aiLabel}
          {...args}>
          Enterprise
        </RadioTile>
      </TileGroup>
    </div>
  ),
};
