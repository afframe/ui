/**
 * Copyright IBM Corp. 2022, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: labelText added to the TextInput in the expandable stories (story markup fix for the a11y label rule), TypeScript, components and icons from @afframe/ui, source tag, styles from tile-story.css, inner WithFeatureFlags decorator removed (flags are on globally), inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ReactNode } from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
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
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import './tile-story.css';

type TileStoryArgs = {
  decorator?: ReactNode;
  light?: boolean;
  clicked?: boolean;
  disabled?: boolean;
  expanded?: boolean;
  hasRoundedCorners?: boolean;
  href?: string;
  selected?: boolean;
  tileCollapsedIconText?: string;
  tileExpandedIconText?: string;
  title?: string;
};

// RadioTile forwards style to its label but does not declare it in its props.
const radioTileGap = { style: { marginBottom: 'var(--cds-spacing-03)' } };

export default {
  title: 'Components/Tile/Feature Flag',
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
} satisfies Meta<TileStoryArgs>;

const previewClassname = 'preview-tile';

export const Clickable: StoryFn<TileStoryArgs> = (args) => {
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
  disabled: false,
};

Clickable.argTypes = {
  disabled: {
    control: {
      type: 'boolean',
    },
  },
};

export const ClickableWithLayer: StoryFn = () => {
  return (
    <WithLayer>
      {(layer) => (
        <div className={previewClassname}>
          <ClickableTile
            id={`clickable-tile-${layer}`}
            href="https://www.carbondesignsystem.com/">
            Clickable Tile
          </ClickableTile>
        </div>
      )}
    </WithLayer>
  );
};

export const Selectable: StoryFn<TileStoryArgs> = (args) => {
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
  disabled: false,
};

Selectable.argTypes = {
  disabled: {
    control: {
      type: 'boolean',
    },
  },
};

export const MultiSelect: StoryFn<TileStoryArgs> = (args) => {
  return (
    <div
      role="group"
      aria-label="selectable tiles"
      className={previewClassname}>
      <SelectableTile id="selectable-tile-1" name="tiles" {...args}>
        Option 1
      </SelectableTile>
      <SelectableTile id="selectable-tile-2" name="tiles" {...args}>
        Option 2
      </SelectableTile>
      <SelectableTile id="selectable-tile-3" name="tiles" {...args}>
        Option 3
      </SelectableTile>
    </div>
  );
};

MultiSelect.args = {
  disabled: false,
};

MultiSelect.argTypes = {
  disabled: {
    control: {
      type: 'boolean',
    },
  },
};

export const Radio: StoryFn<TileStoryArgs> = (args) => {
  return (
    <div className={previewClassname}>
      <TileGroup legend="Radio Tile Group" name="radio tile group">
        <RadioTile
          id="radio-tile-1"
          value="radio-tile-1"
          {...radioTileGap}
          {...args}>
          Option 1
        </RadioTile>
        <RadioTile
          id="radio-tile-2"
          value="radio-tile-2"
          {...radioTileGap}
          {...args}>
          Option 2
        </RadioTile>
        <RadioTile id="radio-tile-3" value="radio-tile-3" {...args} disabled>
          Option 3
        </RadioTile>
      </TileGroup>
    </div>
  );
};

Radio.args = {
  disabled: false,
};

Radio.argTypes = {
  disabled: {
    control: {
      type: 'boolean',
    },
  },
};

export const RadioWithLayer: StoryFn = () => {
  return (
    <WithLayer>
      {(layer) => (
        <div className={previewClassname}>
          <TileGroup
            legend="Radio Tile Group"
            name={`radio-tile-group-${layer}`}>
            <RadioTile
              id={`radio-tile-${layer}-1`}
              value={`radio-tile-${layer}-1`}
              {...radioTileGap}>
              Option 1
            </RadioTile>
            <RadioTile
              id={`radio-tile-${layer}-2`}
              value={`radio-tile-${layer}-2`}>
              Option 2
            </RadioTile>
          </TileGroup>
        </div>
      )}
    </WithLayer>
  );
};

export const Expandable: StoryFn = () => (
  <div style={{ width: '400px' }} className={previewClassname}>
    <ExpandableTile
      id="expandable-tile-1"
      tileCollapsedIconText="Interact to Expand tile"
      tileExpandedIconText="Interact to Collapse tile">
      <TileAboveTheFoldContent>
        <div style={{ height: '200px' }}>Above the fold content here</div>
      </TileAboveTheFoldContent>
      <TileBelowTheFoldContent>
        <div style={{ height: '400px' }}>Below the fold content here</div>
      </TileBelowTheFoldContent>
    </ExpandableTile>
  </div>
);

export const ExpandableWithInteractive: StoryFn = () => (
  <div style={{ width: '400px' }} className={previewClassname}>
    <ExpandableTile
      id="expandable-tile-1"
      tileCollapsedIconText="Interact to Expand tile"
      tileExpandedIconText="Interact to Collapse tile">
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

export const ExpandableWithLayer: StoryFn = () => {
  return (
    <WithLayer>
      {(layer) => (
        <div style={{ width: '400px' }} className={previewClassname}>
          <ExpandableTile
            id={`expandable-tile-${layer}`}
            tileCollapsedIconText="Interact to Expand tile"
            tileExpandedIconText="Interact to Collapse tile">
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

export const _WithAILabel: StoryObj<TileStoryArgs> = {
  argTypes: {
    hasRoundedCorners: {
      control: {
        type: 'boolean',
      },
    },
    decorator: {
      description:
        '**Experimental**: Provide a `decorator` component to be rendered inside the component',
    },
  },
  render: (args) => (
    <div className="ai-label-selectable-tile-container ai-label-preview-radio-tile-container">
      <TileGroup
        defaultSelected="default-selected"
        legend="Radio Tile Group - Feature Flags enabled"
        name="radio tile group two"
        {...args}>
        <RadioTile
          className="ai-label-radio-tile"
          id="radio-tile-4"
          value="standard"
          decorator={aiLabel}
          {...args}>
          Option 1
        </RadioTile>
        <RadioTile
          className="ai-label-radio-tile"
          id="radio-tile-5"
          value="default-selected"
          decorator={aiLabel}
          {...args}>
          Option 2
        </RadioTile>
        <RadioTile
          className="ai-label-radio-tile"
          id="radio-tile-6"
          value="selected"
          decorator={aiLabel}
          {...args}>
          Option 3
        </RadioTile>
      </TileGroup>
    </div>
  ),
};
