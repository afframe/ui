/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; FluidFilterableMultiSelect replaced by FluidMultiSelect isFilterable (not exported); duplicate disabled arg removed; unsupported skeleton props removed; label added to ComboBox and filterable MultiSelect; FileUploader role="button" removed (a11y); AILabel story styles from AILabel/ailabel-story.css, inline spacing as Carbon spacing tokens, spaced en-dashes in option and label text replaced with colons; business example data, error linked by aria-describedby on invalid text inputs. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { View, FolderOpen, Folders } from '../../icons.js';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  Checkbox,
  ComposedModal,
  FileUploader,
  FluidComboBox,
  FluidComboBoxSkeleton,
  FluidDatePicker,
  FluidDatePickerInput,
  FluidDatePickerSkeleton,
  FluidDropdown,
  FluidDropdownSkeleton,
  FluidForm,
  FluidMultiSelect,
  FluidMultiSelectSkeleton,
  FluidNumberInput,
  FluidNumberInputSkeleton,
  FluidPasswordInput,
  FluidSearch,
  FluidSearchSkeleton,
  FluidSelect,
  FluidSelectSkeleton,
  FluidTextArea,
  FluidTextAreaSkeleton,
  FluidTextInput,
  FluidTextInputSkeleton,
  FormGroup,
  IconButton,
  ModalBody,
  ModalFooter,
  ModalHeader,
  RadioButton,
  RadioButtonGroup,
  SelectItem,
  Stack,
  type FluidFormProps,
} from '../../index.js';
import { paymentTermItems } from '../../../.storybook/exampleData';
import mdx from './FluidForm.mdx';
import '../AILabel/ailabel-story.css';

interface FluidFormArgs extends FluidFormProps {
  skeleton?: boolean;
  showInModal?: boolean;
  aiLabel?: boolean;
  revertActive?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  invalidText?: string;
  warn?: boolean;
  warnText?: string;
}

export default {
  title: 'Components/Fluid Inputs/FluidForm',
  tags: ['carbon'],
  component: FluidForm,
  parameters: {
    docs: {
      page: mdx,
    },
  },
  args: {
    skeleton: false,
    aiLabel: false,
    revertActive: false,
    showInModal: false,
    disabled: false,
    readOnly: false,
    invalid: false,
    invalidText: 'Error message.',
    warn: false,
    warnText: 'Warning message.',
  },
  argTypes: {
    skeleton: {
      control: { type: 'boolean' },
      description: 'Render all form inputs as skeleton loaders simultaneously',
    },
    aiLabel: {
      table: { disable: true },
    },
    revertActive: {
      table: { disable: true },
    },
    showInModal: {
      control: { type: 'boolean' },
      description:
        'Render the entire form inside a ComposedModal with a trigger button',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Specify whether the fluid form inputs should be disabled',
    },
    readOnly: {
      control: { type: 'boolean' },
      description: 'Specify whether the fluid form inputs should be read-only',
    },
    invalid: {
      control: { type: 'boolean' },
      description:
        'Specify whether the fluid form inputs are in an invalid state',
    },
    invalidText: {
      control: { type: 'text' },
      description: 'Provide the text for the invalid state',
    },
    warn: {
      control: { type: 'boolean' },
      description:
        'Specify whether the fluid form inputs should display a warning',
    },
    warnText: {
      control: { type: 'text' },
      description: 'Provide the text for the warning state',
    },
  },
} satisfies Meta<FluidFormArgs>;

interface Item {
  id: string;
  text: string;
  disabled?: boolean;
}

// Each list keeps one disabled item and one long label, like Carbon's lists.
const workspaceItems: Item[] = [
  { id: 'finance', text: 'Finance' },
  { id: 'sales', text: 'Sales' },
  { id: 'operations', text: 'Operations' },
  { id: 'archive', text: 'Archive', disabled: true },
  {
    id: 'client-services',
    text: 'Client services and account management for key customers',
  },
];

const memberItems: Item[] = [
  { id: 'alex-morgan', text: 'Alex Morgan' },
  { id: 'sam-rivera', text: 'Sam Rivera' },
  { id: 'jordan-lee', text: 'Jordan Lee' },
  { id: 'taylor-kim', text: 'Taylor Kim', disabled: true },
  { id: 'casey-novak', text: 'Casey Novak, Lakeside Furniture' },
];

const tagItems: Item[] = [
  { id: 'urgent', text: 'Urgent' },
  { id: 'recurring', text: 'Recurring' },
  { id: 'disputed', text: 'Disputed' },
];

const formRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--cds-spacing-05)',
};

const formColStyle: CSSProperties = {
  flex: '1 1 12rem',
  minWidth: 0,
};

const dateRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--cds-spacing-05)',
  alignItems: 'flex-start',
};

const dateRangeColStyle: CSSProperties = {
  flex: '0 1 auto',
};

const dateSimpleColStyle: CSSProperties = {
  flex: '0 1 auto',
};

const formShellStyle: CSSProperties = {
  width: '100%',
  maxWidth: '600px',
  minWidth: 0,
};

// `required` and `pattern` are missing from FluidPasswordInputProps in Carbon 11.118.0.
const passwordRules = {
  required: true,
  pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{12,}',
};

export const Default: StoryFn<FluidFormArgs> = (args) => {
  const {
    skeleton,
    showInModal,
    aiLabel,
    revertActive = false,
    disabled = false,
    readOnly = false,
    invalid = false,
    invalidText = '',
    warn = false,
    warnText = '',
  } = args;

  const [modalOpen, setModalOpen] = useState(false);

  const decorator = aiLabel ? (
    <AILabel
      className="ai-label-container"
      align="bottom-left"
      revertActive={revertActive}>
      <AILabelContent>
        <div>
          <p className="secondary">AI Explained</p>
          <h2 className="ai-label-heading">84%</h2>
          <p className="secondary bold">Confidence score</p>
          <p className="secondary">
            Lorem ipsum dolor sit amet, di os consectetur adipisicing elit, sed
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
  ) : undefined;

  const sharedProps = {
    disabled,
    readOnly,
    invalid,
    invalidText,
    warn,
    warnText,
    ...(decorator ? { decorator } : {}),
  };

  // TextInput-based fields link their error only through aria-errormessage;
  // see the FluidTextInput page. Spread only while invalid.
  const describedByError = (id: string) =>
    invalid ? { 'aria-describedby': `${id}-error-msg` } : {};

  const formContent = skeleton ? (
    <FluidForm aria-label="New project">
      <Stack gap={5}>
        <FluidSearchSkeleton />
        <div style={formRowStyle}>
          <div style={formColStyle}>
            <FluidTextInputSkeleton />
          </div>
          <div style={formColStyle}>
            <FluidTextInputSkeleton />
          </div>
        </div>
        <div style={formRowStyle}>
          <div style={formColStyle}>
            <FluidDropdownSkeleton />
          </div>
          <div style={formColStyle}>
            <FluidComboBoxSkeleton />
          </div>
        </div>
        <FluidMultiSelectSkeleton />
        <div style={formRowStyle}>
          <div style={{ flex: '2 1 16rem', minWidth: 0 }}>
            <FluidDatePickerSkeleton datePickerType="range" />
          </div>
          <div style={{ flex: '1 1 8rem', minWidth: 0 }}>
            <FluidDatePickerSkeleton datePickerType="simple" />
          </div>
        </div>
        <div style={formRowStyle}>
          <div style={formColStyle}>
            <FluidNumberInputSkeleton />
          </div>
          <div style={formColStyle}>
            <FluidSelectSkeleton />
          </div>
        </div>
        <FluidDropdownSkeleton />
        <FluidMultiSelectSkeleton />
        <FluidTextAreaSkeleton />
        <FluidTextInputSkeleton />
        <FluidTextInputSkeleton />
      </Stack>
    </FluidForm>
  ) : (
    <FluidForm aria-label="New project">
      <Stack gap={5}>
        <FluidSearch
          id="search-members"
          labelText="Search members"
          placeholder="e.g. Alex Morgan"
          disabled={disabled}
        />

        <div style={formRowStyle}>
          <div style={formColStyle}>
            <FluidTextInput
              id="project-name"
              labelText="Project name"
              placeholder="e.g. Website redesign"
              {...sharedProps}
              {...describedByError('project-name')}
            />
          </div>
          <div style={formColStyle}>
            <FluidTextInput
              id="project-id"
              labelText="Project ID"
              placeholder="e.g. website-redesign"
              {...sharedProps}
              {...describedByError('project-id')}
            />
          </div>
        </div>

        <div style={formRowStyle}>
          <div style={formColStyle}>
            <FluidDropdown
              id="workspace"
              titleText="Workspace"
              initialSelectedItem={workspaceItems[0]}
              label="Select workspace"
              items={workspaceItems}
              itemToString={(item: unknown) =>
                item ? (item as Item).text : ''
              }
              {...sharedProps}
            />
          </div>
          <div style={formColStyle}>
            <FluidComboBox
              id="project-lead"
              onChange={() => {}}
              items={memberItems}
              itemToString={(item: unknown) =>
                item ? (item as Item).text : ''
              }
              titleText="Project lead"
              label="Project lead"
              placeholder="Search members"
              {...sharedProps}
            />
          </div>
        </div>

        <FluidMultiSelect
          id="team-members"
          titleText="Team members"
          label="Select members"
          items={memberItems}
          itemToString={(item: unknown) => (item ? (item as Item).text : '')}
          selectionFeedback="top-after-reopen"
          {...sharedProps}
        />

        <div style={dateRowStyle}>
          <div style={dateRangeColStyle}>
            <FluidDatePicker
              {...{ datePickerType: 'range' }}
              readOnly={readOnly}>
              <FluidDatePickerInput
                id="start-date"
                placeholder="mm/dd/yyyy"
                labelText="Start date"
                {...sharedProps}
              />
              <FluidDatePickerInput
                id="end-date"
                placeholder="mm/dd/yyyy"
                labelText="End date"
                {...sharedProps}
              />
            </FluidDatePicker>
          </div>
          <div style={dateSimpleColStyle}>
            <FluidDatePicker
              {...{ datePickerType: 'simple' }}
              readOnly={readOnly}>
              <FluidDatePickerInput
                id="deadline"
                placeholder="mm/dd/yyyy"
                labelText="Deadline"
                {...sharedProps}
              />
            </FluidDatePicker>
          </div>
        </div>

        <div style={formRowStyle}>
          <div style={formColStyle}>
            <FluidNumberInput
              id="budget"
              label="Budget"
              min={0}
              max={10000000}
              defaultValue={5000}
              step={500}
              iconDescription="Adjust budget"
              {...sharedProps}
            />
          </div>
          <div style={formColStyle}>
            <FluidSelect
              id="currency"
              labelText="Currency"
              defaultValue="czk"
              {...sharedProps}>
              <SelectItem value="czk" text="CZK: Czech koruna" />
              <SelectItem value="eur" text="EUR: Euro" />
              <SelectItem value="usd" text="USD: US dollar" />
              <SelectItem value="gbp" text="GBP: British pound" />
              <SelectItem value="pln" text="PLN: Polish zloty" />
            </FluidSelect>
          </div>
        </div>

        <RadioButtonGroup
          name="project-visibility"
          defaultSelected="private"
          legendText="Visibility"
          helperText="Who can see and access this project."
          disabled={disabled}
          readOnly={readOnly}>
          <RadioButton
            value="private"
            id="vis-private"
            labelText="Private: only invited members"
          />
          <RadioButton
            value="internal"
            id="vis-internal"
            labelText="Internal: everyone in the org"
          />
          <RadioButton
            value="public"
            id="vis-public"
            labelText="Public: anyone with the link"
          />
        </RadioButtonGroup>

        <FluidDropdown
          id="payment-terms"
          titleText="Payment terms"
          initialSelectedItem={paymentTermItems[3]}
          label="Select payment terms"
          items={paymentTermItems}
          itemToString={(item: unknown) => (item ? (item as Item).text : '')}
          {...sharedProps}
        />

        <FluidMultiSelect
          isFilterable
          id="tags"
          titleText="Tags"
          label="Tags"
          {...{ placeholder: 'Filter' }}
          items={tagItems}
          itemToString={(item: unknown) => (item ? (item as Item).text : '')}
          selectionFeedback="top-after-reopen"
          {...sharedProps}
        />

        <FormGroup legendText="Features">
          <Checkbox
            id="feat-issues"
            labelText="Issue tracking"
            defaultChecked
            disabled={disabled}
          />
          <Checkbox
            id="feat-wiki"
            labelText="Wiki"
            defaultChecked
            disabled={disabled}
          />
          <Checkbox
            id="feat-ci"
            labelText="CI / CD pipeline"
            disabled={disabled}
          />
          <Checkbox
            id="feat-releases"
            labelText="Releases"
            disabled={disabled}
          />
        </FormGroup>

        <FluidTextArea
          id="project-description"
          labelText="Description"
          placeholder="What is this project about?"
          rows={4}
          {...sharedProps}
        />

        <FluidTextInput
          id="repo-url"
          labelText="Repository URL"
          placeholder="https://github.com/org/repo"
          {...sharedProps}
          {...describedByError('repo-url')}
        />

        <FluidPasswordInput
          id="repo-password"
          labelText="Password"
          placeholder="Enter password"
          {...passwordRules}
          disabled={disabled}
          readOnly={readOnly}
          invalid={invalid}
          invalidText="Use at least 12 characters with an uppercase letter, a lowercase letter and a number."
          {...describedByError('repo-password')}
          warn={warn}
          warnText={warnText}
        />

        <FormGroup legendText="Project assets">
          <FileUploader
            id="file-assets"
            labelDescription="Max 25 MB per file."
            buttonLabel="Add files"
            buttonKind="primary"
            size="md"
            filenameStatus="edit"
            accept={['.pdf', '.png', '.jpg', '.fig', '.sketch']}
            multiple={true}
            disabled={disabled}
            iconDescription="Remove file"
            name=""
          />
        </FormGroup>

        <Button
          type="submit"
          onClick={() => showInModal && setModalOpen(false)}>
          Create project
        </Button>
      </Stack>
    </FluidForm>
  );

  if (showInModal) {
    return (
      <>
        <Button onClick={() => setModalOpen(true)}>Open form</Button>
        <ComposedModal open={modalOpen} onClose={() => setModalOpen(false)}>
          <ModalHeader title="Create project" />
          <ModalBody hasScrollingContent>
            <div style={{ padding: 'var(--cds-spacing-05)' }}>
              {formContent}
            </div>
          </ModalBody>
          <ModalFooter
            primaryButtonText="Create project"
            secondaryButtonText="Cancel"
            onRequestClose={() => setModalOpen(false)}
            onRequestSubmit={() => setModalOpen(false)}>
            {null}
          </ModalFooter>
        </ComposedModal>
      </>
    );
  }

  return <div style={formShellStyle}>{formContent}</div>;
};

Default.args = {
  showInModal: false,
};

Default.argTypes = {
  showInModal: {
    control: { type: 'boolean' },
    description:
      'Render the entire form inside a ComposedModal with a trigger button',
  },
};
