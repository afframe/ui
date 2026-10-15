/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: labelText added to the TextInput in the expandable stories (story markup fix for the a11y label rule), TypeScript, components and icons from @afframe/ui, source tag, styles from a plain CSS file, inline spacing as Carbon spacing tokens, story names unified, expandable story wrappers capped at the screen width, example data from the Afframe glossary (plans, card text, AI label text). Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { action } from 'storybook/actions';
import type { ArgTypes, Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { ArrowRight, FolderOpen, Folders, Launch, View } from '../../icons.js';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  ClickableTile,
  ExpandableTile,
  IconButton,
  Link,
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
  TileProps,
} from '../../index.js';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import mdx from './Tile.mdx';
import './tile-story.css';

// RadioTile forwards style to its label but does not declare it in its props.
const radioTileGap = { style: { marginBottom: 'var(--cds-spacing-03)' } };

const tileArgs: TileProps = {
  light: false,
  onClick: action('onClick'),
};

const tileArgTypes: Partial<ArgTypes<TileProps>> = {
  light: {
    control: 'boolean',
  },
  onClick: {
    action: 'onClick',
  },
};

const tileControls = Object.keys(tileArgTypes);

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

const radioArgs: TileGroupProps<RadioTileProps['value']> = {
  disabled: false,
  legend: 'Plan',
  name: 'radio tile group',
  required: false,
  defaultSelected: 'default-selected',
  onChange: action('onChange'),
};

const radioArgTypes: Partial<
  ArgTypes<TileGroupProps<RadioTileProps['value']>>
> = {
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
  defaultSelected: {
    control: 'select',
    options: ['standard', 'default-selected', 'selected'],
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

export default {
  title: 'Components/Tile',
  component: Tile,
  tags: ['carbon'],
  subcomponents: {
    ClickableTile,
    SelectableTile,
    ExpandableTile,
    RadioTile,
    TileGroup,
    TileAboveTheFoldContent,
    TileBelowTheFoldContent,
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Tile>;

export const Default: StoryFn<TileProps> = (args) => {
  return (
    <Tile id="tile-1" {...args}>
      Default tile
      <br />
      <br />
      <Link href="https://www.carbondesignsystem.com">Link</Link>
    </Tile>
  );
};

Default.args = {
  ...tileArgs,
};

Default.argTypes = tileArgTypes;

Default.parameters = {
  controls: {
    include: tileControls,
  },
};

export const DefaultWithLayer: StoryFn<TileProps> = (args) => (
  <WithLayer>
    {(layer) => (
      <Tile id={`tile-${layer}`} {...args}>
        Default tile
        <br />
        <br />
        <Link href="https://www.carbondesignsystem.com">Link</Link>
      </Tile>
    )}
  </WithLayer>
);

DefaultWithLayer.args = {
  ...tileArgs,
};

DefaultWithLayer.argTypes = tileArgTypes;

DefaultWithLayer.parameters = {
  controls: {
    include: tileControls,
  },
};

export const Clickable: StoryFn<ClickableTileProps> = (args) => {
  return (
    <ClickableTile id="clickable-tile-1" {...args}>
      Clickable Tile
    </ClickableTile>
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

export const ClickableWithCustomIcon: StoryFn<ClickableTileProps> = (args) => {
  return (
    <ClickableTile id="clickable-tile-1" renderIcon={Launch} {...args}>
      Clickable Tile
    </ClickableTile>
  );
};

ClickableWithCustomIcon.args = {
  ...clickableArgs,
};

ClickableWithCustomIcon.argTypes = clickableArgTypes;

ClickableWithCustomIcon.parameters = {
  controls: {
    include: clickableControls,
  },
};

export const ClickableWithLayer: StoryFn<ClickableTileProps> = (args) => (
  <WithLayer>
    {(layer) => (
      <ClickableTile id={`clickable-tile-${layer}`} {...args}>
        Clickable tile
      </ClickableTile>
    )}
  </WithLayer>
);

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
    <SelectableTile id="selectable-tile-1" {...args}>
      Selectable
    </SelectableTile>
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
    <div role="group" aria-label="selectable tiles">
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

export const Radio: StoryFn<TileGroupProps<RadioTileProps['value']>> = (
  args
) => {
  return (
    <TileGroup {...args}>
      <RadioTile id="radio-tile-1" value="standard" {...radioTileGap}>
        Starter
      </RadioTile>
      <RadioTile id="radio-tile-2" value="default-selected" {...radioTileGap}>
        Business
      </RadioTile>
      <RadioTile id="radio-tile-3" value="selected">
        Enterprise
      </RadioTile>
    </TileGroup>
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

export const RadioWithLayer: StoryFn<
  TileGroupProps<RadioTileProps['value']>
> = (args) => (
  <WithLayer>
    {(layer) => (
      <TileGroup {...args} name={`${args.name} ${layer}`}>
        <RadioTile
          id={`radio-tile-${layer}-1`}
          value="standard"
          {...radioTileGap}>
          Starter
        </RadioTile>
        <RadioTile id={`radio-tile-${layer}-2`} value="default-selected">
          Business
        </RadioTile>
      </TileGroup>
    )}
  </WithLayer>
);

RadioWithLayer.args = {
  ...radioArgs,
};

RadioWithLayer.argTypes = {
  ...radioArgTypes,
  defaultSelected: {
    ...radioArgTypes.defaultSelected,
    options: ['standard', 'default-selected'],
  },
};

RadioWithLayer.parameters = {
  controls: {
    include: radioControls,
  },
};

export const Expandable: StoryFn<ExpandableTileProps> = (args) => {
  return (
    <div style={{ width: '400px', maxWidth: '100%' }}>
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
};

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
) => {
  return (
    <div style={{ width: '400px', maxWidth: '100%' }}>
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
};

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
        <div style={{ width: '400px', maxWidth: '100%' }}>
          <ExpandableTile id={`expandable-tile-${layer}`} {...args}>
            <TileAboveTheFoldContent>
              <div style={{ height: '100px' }}>Above the fold content here</div>
            </TileAboveTheFoldContent>
            <TileBelowTheFoldContent>
              <div style={{ height: '200px' }}>Below the fold content here</div>
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
    <>
      <div className="ai-label-tile-container">
        <Tile decorator={aiLabel} id="tile-1" {...args}>
          <h4>Monthly revenue</h4>
          <p>Revenue from paid invoices this month.</p>
          <div className="ai-data">
            <div className="data-container">
              <p>Paid on time</p>
              <h3>85%</h3>
            </div>
            <div className="data-container">
              <p>Overdue</p>
              <h3>16%</h3>
            </div>
          </div>
        </Tile>
        <ClickableTile
          href="https://www.carbondesignsystem.com/"
          decorator
          id="tile-click"
          renderIcon={ArrowRight}
          {...args}>
          <h4>Monthly revenue</h4>
          <p>Revenue from paid invoices this month.</p>
          <div className="ai-data">
            <div className="data-container">
              <p>Paid on time</p>
              <h3>85%</h3>
            </div>
            <div className="data-container">
              <p>Overdue</p>
              <h3>16%</h3>
            </div>
          </div>
        </ClickableTile>

        <ExpandableTile
          id="expandable-tile-1"
          tileCollapsedIconText="Interact to Expand tile"
          tileExpandedIconText="Interact to Collapse tile"
          decorator={aiLabel}
          {...args}>
          <TileAboveTheFoldContent>
            <h4>Monthly revenue</h4>
            <p>Revenue from paid invoices this month.</p>
            <div className="ai-data">
              <div className="data-container">
                <p>Paid on time</p>
                <h3>85%</h3>
              </div>
              <div className="data-container">
                <p>Overdue</p>
                <h3>16%</h3>
              </div>
            </div>
          </TileAboveTheFoldContent>
          <TileBelowTheFoldContent>
            <h6>Details</h6>
            <p>Based on invoices from the last 12 months.</p>
          </TileBelowTheFoldContent>
        </ExpandableTile>
      </div>

      <div className="ai-label-selectable-tile-container">
        <TileGroup
          defaultSelected="default-selected"
          legend="Plans"
          name="selectable tile group"
          {...args}>
          <div>
            <SelectableTile
              className="ai-label-selectable-tile"
              id="selectable-tile-1"
              decorator={aiLabel}
              {...args}>
              Starter
            </SelectableTile>
          </div>
          <div>
            <SelectableTile
              className="ai-label-selectable-tile"
              decorator={aiLabel}
              id="selectable-tile-2"
              {...args}>
              Business
            </SelectableTile>
          </div>
          <div>
            <SelectableTile
              className="ai-label-selectable-tile"
              decorator={aiLabel}
              id="selectable-tile-3"
              {...args}>
              Enterprise
            </SelectableTile>
          </div>
        </TileGroup>
      </div>
      <br />
      <br />
      <div className="ai-label-selectable-tile-container">
        <TileGroup
          defaultSelected="default-selected"
          legend="Plan"
          name="radio tile group"
          {...args}>
          <RadioTile
            className="ai-label-radio-tile"
            id="radio-tile-1"
            value="standard"
            decorator={aiLabel}
            {...args}>
            Starter
          </RadioTile>
          <RadioTile
            className="ai-label-radio-tile"
            id="radio-tile-2"
            value="default-selected"
            decorator={aiLabel}
            {...args}>
            Business
          </RadioTile>
          <RadioTile
            className="ai-label-radio-tile"
            id="radio-tile-3"
            value="selected"
            decorator={aiLabel}
            {...args}>
            Enterprise
          </RadioTile>
        </TileGroup>
        <br />
      </div>
    </>
  ),
};
