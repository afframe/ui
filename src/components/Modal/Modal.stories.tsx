/**
 * Copyright IBM Corp. 2016, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Modal and form parts from @afframe/ui, icons from @afframe/ui/icons, unused Popover imports and state dropped, ComboBox gets its required onChange, the second withAILabel launcher dropped (it called an undefined setter), TextArea gets an id so its label applies, source tag, inline spacing as Carbon spacing tokens, story names unified, prop descriptions from Carbon's prop docs, Default with neutral business data, its launcher ref and an initial field, Danger and Passive story names. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  Dropdown,
  IconButton,
  Modal,
  MultiSelect,
  Select,
  SelectItem,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
  TextArea,
  TextInput,
} from '../../index.js';
import type { ModalProps } from '../../index.js';
import { View, FolderOpen, Folders } from '../../icons.js';
import mdx from './Modal.mdx';
import { autofocus } from '../../../.storybook/autofocus.js';

type ModalStoryArgs = Partial<ModalProps> & { numberOfButtons?: string };

const buttons = {
  'One (1)': '1',
  'Two (2)': '2',
  'Three (3)': '3',
};

export default {
  title: 'Components/Modal',
  tags: ['carbon'],
  component: Modal,
  parameters: {
    docs: {
      page: mdx,
    },
  },
  // Carbon's prop docs, written out: the generated props table misses most of
  // Modal's props (carbon#19624).
  argTypes: {
    alert: {
      description:
        'Specify whether the Modal is displaying an alert, error or warning; should go hand in hand with the danger prop.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    'aria-label': {
      control: 'text',
      description: 'Required props for the accessibility label of the header',
      table: { type: { summary: 'string' } },
    },
    children: {
      description: 'Provide the contents of your Modal',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      description:
        'Specify an optional className to be applied to the modal root node',
      table: { type: { summary: 'string' } },
    },
    closeButtonLabel: {
      description:
        'Specify label for the close button of the modal; defaults to close',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Close'" },
      },
    },
    danger: {
      description: 'Specify whether the Modal is for dangerous actions',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    dangerDescription: {
      control: 'text',
      description:
        'Specify the message read by screen readers for the danger primary button. Defaults to an empty string; provide localized text to opt in.',
      table: { type: { summary: 'string' } },
    },
    decorator: {
      description:
        'Experimental: Provide a decorator component to be rendered inside the `Modal` component',
      table: { type: { summary: 'ReactNode' } },
    },
    hasScrollingContent: {
      description: 'Specify whether the modal contains scrolling content',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    id: {
      description: 'Specify the DOM element ID of the top-level node.',
      table: { type: { summary: 'string' } },
    },
    isFullWidth: {
      description:
        'Specify whether or not the Modal content should have any inner padding.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    launcherButtonRef: {
      description: 'Provide a ref to return focus to once the modal is closed.',
      table: { type: { summary: 'RefObject<HTMLElement | null>' } },
    },
    loadingDescription: {
      description: 'Specify the description for the loading text',
      table: { type: { summary: 'string' } },
    },
    loadingIconDescription: {
      description: 'Specify the description for the loading text',
      table: { type: { summary: 'string' } },
    },
    loadingStatus: {
      description: 'Specify loading status',
      table: {
        type: { summary: "'inactive' | 'active' | 'finished' | 'error'" },
        defaultValue: { summary: "'inactive'" },
      },
    },
    modalAriaLabel: {
      description:
        'Specify a label to be read by screen readers on the modal root node',
      table: { type: { summary: 'string' } },
    },
    modalHeading: {
      control: 'text',
      description: 'Specify the content of the modal header title.',
      table: { type: { summary: 'ReactNode' } },
    },
    modalLabel: {
      control: 'text',
      description: 'Specify the content of the modal header label.',
      table: { type: { summary: 'ReactNode' } },
    },
    onKeyDown: {
      action: 'onKeyDown',
      description: 'Specify a handler for keypresses. Deprecated: unused.',
      table: { type: { summary: 'React.KeyboardEventHandler<HTMLElement>' } },
    },
    onLoadingSuccess: {
      description:
        'Specify an optional handler to be invoked when loading is successful',
      table: { type: { summary: '() => void' } },
    },
    onRequestClose: {
      description:
        'Specify a handler for closing modal. The handler should care of closing modal, e.g. changing `open` prop.',
      table: { type: { summary: 'React.ReactEventHandler<HTMLElement>' } },
    },
    onRequestSubmit: {
      action: 'onRequestSubmit',
      description:
        'Specify a handler for "submitting" modal. The handler should care of closing modal, e.g. changing `open` prop, if necessary.',
      table: { type: { summary: 'React.ReactEventHandler<HTMLElement>' } },
    },
    onSecondarySubmit: {
      description:
        'Specify a handler for the secondary button. Useful if separate handler from `onRequestClose` is desirable',
      table: { type: { summary: 'React.ReactEventHandler<HTMLElement>' } },
    },
    open: {
      description: 'Specify whether the Modal is currently open',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    passiveModal: {
      description: 'Specify whether the modal should be button-less',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    preventCloseOnClickOutside: {
      control: 'boolean',
      description: 'Prevent closing on click outside of modal',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    primaryButtonDisabled: {
      description: 'Specify whether the Button should be disabled, or not',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    primaryButtonText: {
      control: 'text',
      description: 'Specify the text for the primary button',
      table: { type: { summary: 'ReactNode' } },
    },
    secondaryButtonText: {
      description: 'Specify the text for the secondary button',
      table: { type: { summary: 'ReactNode' } },
    },
    secondaryButtons: {
      description: 'Specify an array of config objects for secondary buttons',
      table: { type: { summary: 'ModalSecondaryButton[]' } },
    },
    selectorPrimaryFocus: {
      description:
        'Specify a CSS selector that matches the DOM element that should be focused when the Modal opens',
      table: { type: { summary: 'string' } },
    },
    selectorsFloatingMenus: {
      description:
        'Specify CSS selectors that match DOM elements working as floating menus. Focusing on those elements won\'t trigger "focus-wrap" behavior',
      table: { type: { summary: 'string[]' } },
    },
    shouldSubmitOnEnter: {
      description: 'Specify if Enter key should be used as "submit" action',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      description: 'Specify the size variant.',
      table: {
        type: { summary: "'xs' | 'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    numberOfButtons: {
      description: 'Count of Footer Buttons',
      options: Object.keys(buttons),
      mapping: buttons,
      control: {
        type: 'inline-radio',
        labels: Object.keys(buttons),
      },
    },
  },
} satisfies Meta<ModalStoryArgs>;

const modalFooter = (numberOfButtons?: string): Partial<ModalProps> => {
  const secondaryButtons = () => {
    switch (numberOfButtons) {
      case '1':
        return {
          secondaryButtons: [],
        };
      case '2':
        return {
          secondaryButtonText: 'Cancel',
        };
      case '3':
        return {
          secondaryButtons: [
            {
              buttonText: 'Keep both',
              onClick: action('onClick'),
            },
            {
              buttonText: 'Rename',
              onClick: action('onClick'),
            },
          ],
        };
      default:
        return null;
    }
  };
  return {
    ...secondaryButtons(),
  };
};

interface ModalStateProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const sharedParameters = {
  controls: {
    exclude: [
      'id',
      'launcherButtonRef',
      'secondaryButtons',
      'secondaryButtonText',
      'selectorPrimaryFocus',
      'selectorsFloatingMenus',
    ],
  },
};

export const Default: StoryFn<ModalStoryArgs> = ({
  numberOfButtons,
  ...args
}) => {
  const [open, setOpen] = useState(true);
  const launcher = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={launcher} onClick={() => setOpen(true)}>
        Launch modal
      </Button>
      <Modal
        launcherButtonRef={launcher}
        onRequestClose={(e) => {
          action('onRequestClose')(e);
          setOpen(false);
        }}
        modalHeading="Add a supplier"
        primaryButtonText="Add"
        secondaryButtonText="Cancel"
        aria-label="Modal content"
        open={open}
        {...args}
        {...modalFooter(numberOfButtons)}>
        <p style={{ marginBottom: 'var(--cds-spacing-07)' }}>
          Suppliers appear in purchase orders and incoming invoices. You can
          change their details later.
        </p>
        <TextInput
          data-modal-primary-focus
          ref={autofocus}
          id="text-input-1"
          labelText="Company name"
          placeholder="For example, Northwind Supplies Ltd"
          style={{ marginBottom: 'var(--cds-spacing-06)' }}
        />
        <div style={{ marginBottom: 'var(--cds-spacing-06)' }}>
          <Select id="select-1" defaultValue="30" labelText="Payment terms">
            <SelectItem value="14" text="14 days" />
            <SelectItem value="30" text="30 days" />
          </Select>
        </div>
        <div style={{ marginBottom: 'var(--cds-spacing-06)' }}>
          <ComboBox
            allowCustomValue
            autoAlign={true}
            id="carbon-combobox"
            items={['Materials', 'Services', 'Logistics']}
            onChange={action('onChange')}
            titleText="Category (Example of Floating UI)"
          />
        </div>
        <div style={{ marginBottom: 'var(--cds-spacing-06)' }}>
          <Dropdown
            autoAlign={true}
            id="default"
            titleText="Currency (Example of Floating UI)"
            label="Choose a currency"
            items={[
              {
                id: 'option-0',
                text: 'EUR',
              },
              {
                id: 'option-1',
                text: 'USD',
              },
              {
                id: 'option-2',
                text: 'GBP',
              },
            ]}
            itemToString={(item) => (item ? item.text : '')}
          />
        </div>
        <div style={{ marginBottom: 'var(--cds-spacing-06)' }}>
          <MultiSelect
            id="test"
            label="Choose channels"
            titleText="Order channels"
            autoAlign
            items={[
              {
                id: 'downshift-1-item-0',
                text: 'Email',
              },
              {
                id: 'downshift-1-item-1',
                text: 'Supplier portal',
              },
              {
                id: 'downshift-1-item-2',
                text: 'EDI',
              },
            ]}
            itemToString={(item) => (item ? item.text : '')}
          />
        </div>
        <CheckboxGroup legendText="Terms">
          <Checkbox
            id="checkbox-label-1"
            labelText="The supplier accepts our purchase terms."
          />
        </CheckboxGroup>
      </Modal>
    </>
  );
};

Default.argTypes = {
  onSecondarySubmit: {
    action: 'onSecondarySubmit',
  },
};

Default.parameters = { ...sharedParameters };

export const FullWidth: StoryFn<ModalStoryArgs> = ({
  numberOfButtons,
  ...args
}) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Launch modal</Button>
      <Modal
        open={open}
        onRequestClose={() => setOpen(false)}
        isFullWidth
        modalHeading="Full width modal"
        modalLabel="An example of a modal with no padding"
        primaryButtonText="Add"
        secondaryButtonText="Cancel"
        {...args}
        {...modalFooter(numberOfButtons)}>
        <StructuredListWrapper
          style={{ marginBottom: 'var(--cds-spacing-09)' }}>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head noWrap>
                Default size
              </StructuredListCell>
              <StructuredListCell head noWrap>
                Features
              </StructuredListCell>
              <StructuredListCell head noWrap>
                Pricing
              </StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            <StructuredListRow>
              <StructuredListCell noWrap>Lite</StructuredListCell>
              <StructuredListCell>2 vCPUs | 4GB RAM</StructuredListCell>
              <StructuredListCell>$0.12 USD / hourly</StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell noWrap>Graduated tier</StructuredListCell>
              <StructuredListCell>2 vCPUs | 8GB RAM</StructuredListCell>
              <StructuredListCell>$0.13 USD / hourly</StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
              <StructuredListCell noWrap>Premium</StructuredListCell>
              <StructuredListCell>4 vCPUs | 10GB RAM</StructuredListCell>
              <StructuredListCell>$0.20 USD / hourly</StructuredListCell>
            </StructuredListRow>
          </StructuredListBody>
        </StructuredListWrapper>
      </Modal>
    </>
  );
};

FullWidth.parameters = { ...sharedParameters };

export const Danger: StoryFn<ModalStoryArgs> = ({
  numberOfButtons,
  ...args
}) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Launch modal</Button>
      <Modal
        open={open}
        onRequestClose={() => setOpen(false)}
        danger
        modalHeading="Are you sure you want to delete this custom domain?"
        modalLabel="Account resources"
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        {...args}
        {...modalFooter(numberOfButtons)}>
        <p>
          Check for dependencies on the domain before deletion. For instance, if
          the domain is used as a primary domain for users or if it's associated
          with critical applications or services, those connections will need to
          be removed or reconfigured first.
        </p>
      </Modal>
    </>
  );
};

Danger.parameters = { ...sharedParameters };

export const WithScrollingContent: StoryFn<ModalStoryArgs> = ({
  numberOfButtons,
  ...args
}) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Launch modal</Button>
      <Modal
        open={open}
        onRequestClose={() => setOpen(false)}
        hasScrollingContent
        modalHeading="Add a custom domain"
        modalLabel="Account resources"
        primaryButtonText="Add"
        secondaryButtonText="Cancel"
        {...args}
        {...modalFooter(numberOfButtons)}>
        <p style={{ marginBottom: 'var(--cds-spacing-05)' }}>
          Custom domains direct requests for your apps in this Cloud Foundry
          organization to a URL that you own. A custom domain can be a shared
          domain, a shared subdomain, or a shared domain and host.
        </p>
        <p style={{ marginBottom: 'var(--cds-spacing-07)' }}>
          Domain mappings provide the URL route to your Code Engine application
          or function within a project. With Code Engine, these mappings are
          automatically created, by default, whenever you deploy an application
          or create a function. However, you can map your own custom domain to a
          Code Engine application or function. This option routes requests from
          your custom URL to your application or function. You can use the Code
          Engine CLI.
        </p>
        <div style={{ marginBottom: 'var(--cds-spacing-06)' }}>
          <TextInput
            data-modal-primary-focus
            id="text-input-1"
            labelText="Domain name"
            placeholder="For example, GitHub.com"
          />
        </div>
        <div style={{ marginBottom: 'var(--cds-spacing-06)' }}>
          <Select id="select-1" defaultValue="us-south" labelText="Region">
            <SelectItem value="us-south" text="US South" />
            <SelectItem value="us-east" text="US East" />
          </Select>
        </div>
        <div style={{ marginBottom: 'var(--cds-spacing-06)' }}>
          <ComboBox
            allowCustomValue
            autoAlign={true}
            id="carbon-combobox"
            items={['Viewer', 'Editor', 'Manager']}
            onChange={action('onChange')}
            titleText="Permissions (Example of Floating UI)"
          />
        </div>
        <MultiSelect
          id="test"
          label="Choose options"
          titleText="Mapping domain"
          autoAlign
          items={[
            {
              id: 'downshift-1-item-0',
              text: 'Cloud Foundry',
            },
            {
              id: 'downshift-1-item-1',
              text: 'Kubernetes Ingress',
            },
            {
              id: 'downshift-1-item-2',
              text: 'VPC Load Balancer',
            },
          ]}
          itemToString={(item) => (item ? item.text : '')}
        />
      </Modal>
    </>
  );
};

WithScrollingContent.parameters = { ...sharedParameters };

export const WithStateManager: StoryFn<ModalStoryArgs> = ({
  numberOfButtons,
  ...args
}) => {
  /**
   * Simple state manager for modals.
   */
  const ModalStateManager = ({
    renderLauncher: LauncherContent,
    children: ModalContent,
  }: {
    renderLauncher?: ComponentType<ModalStateProps>;
    children?: ComponentType<ModalStateProps>;
  }) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        {!ModalContent || typeof document === 'undefined'
          ? null
          : createPortal(
              <ModalContent open={open} setOpen={setOpen} />,
              document.body
            )}
        {LauncherContent && <LauncherContent open={open} setOpen={setOpen} />}
      </>
    );
  };

  const button = useRef<HTMLButtonElement>(null);

  return (
    <ModalStateManager
      renderLauncher={({ setOpen }) => (
        <Button ref={button} onClick={() => setOpen(true)}>
          Launch modal
        </Button>
      )}>
      {({ open, setOpen }) => (
        <Modal
          launcherButtonRef={button}
          modalHeading="Add a custom domain"
          modalLabel="Account resources"
          primaryButtonText="Add"
          secondaryButtonText="Cancel"
          open={open}
          onRequestClose={() => setOpen(false)}
          {...args}
          {...modalFooter(numberOfButtons)}>
          <p style={{ marginBottom: 'var(--cds-spacing-05)' }}>
            Custom domains direct requests for your apps in this Cloud Foundry
            organization to a URL that you own. A custom domain can be a shared
            domain, a shared subdomain, or a shared domain and host.
          </p>
          <TextInput
            data-modal-primary-focus
            id="text-input-1"
            labelText="Domain name"
            placeholder="e.g. github.com"
            style={{ marginBottom: 'var(--cds-spacing-05)' }}
          />
          <Select id="select-1" defaultValue="us-south" labelText="Region">
            <SelectItem value="us-south" text="US South" />
            <SelectItem value="us-east" text="US East" />
          </Select>
        </Modal>
      )}
    </ModalStateManager>
  );
};

WithStateManager.parameters = { ...sharedParameters };

export const Passive: StoryFn<ModalStoryArgs> = ({
  numberOfButtons,
  ...args
}) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Launch modal</Button>
      <Modal
        open={open}
        onRequestClose={() => setOpen(false)}
        passiveModal
        modalHeading="You are now signed out."
        {...args}
        {...modalFooter(numberOfButtons)}
      />
    </>
  );
};

Passive.parameters = {
  controls: {
    include: [
      'aria-label',
      'closeButtonLabel',
      'hasScrollingContent',
      'isFullWidth',
      'modalAriaLabel',
      'modalHeading',
      'modalLabel',
      'open',
      'preventCloseOnClickOutside',
      'size',
    ],
  },
};

export const WithInlineLoading: StoryFn<ModalStoryArgs> = (args) => {
  const [status, setStatus] =
    useState<NonNullable<ModalProps['loadingStatus']>>('inactive');
  const [description, setDescription] = useState('Deleting...');

  const fakePromise = () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  const submit = async () => {
    setStatus('active');

    await fakePromise();

    setDescription('Deleted!');
    setStatus('finished');
  };

  const resetStatus = () => {
    setStatus('inactive');
    setDescription('Deleting...');
  };

  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Launch modal</Button>
      <Modal
        open={open}
        danger
        modalHeading="Are you sure you want to delete this custom domain?"
        modalLabel="Account resources"
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        loadingStatus={status}
        loadingDescription={description}
        {...args}
        onRequestClose={() => setOpen(false)}
        onRequestSubmit={submit}
        onLoadingSuccess={resetStatus}
      />
    </>
  );
};

WithInlineLoading.parameters = {
  controls: {
    exclude: [
      'loadingStatus',
      'loadingDescription',
      'numberOfButtons',
      'id',
      'launcherButtonRef',
      'secondaryButtons',
      'secondaryButtonText',
      'selectorPrimaryFocus',
      'selectorsFloatingMenus',
    ],
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

export const WithAILabel: StoryObj<ModalStoryArgs> = {
  render: ({ numberOfButtons, ...args }) => {
    const [open, setOpen] = useState(true);
    return (
      <div className="ai-label-modal">
        <Button onClick={() => setOpen(true)}>Launch modal</Button>
        <Modal
          open={open}
          onRequestClose={() => setOpen(false)}
          modalHeading="Add a custom domain"
          modalLabel="Account resources"
          primaryButtonText="Add"
          secondaryButtonText="Cancel"
          decorator={aiLabel}
          {...args}
          {...modalFooter(numberOfButtons)}>
          <p style={{ marginBottom: 'var(--cds-spacing-07)' }}>
            Custom domains direct requests for your apps in this Cloud Foundry
            organization to a URL that you own. A custom domain can be a shared
            domain, a shared subdomain, or a shared domain and host.
          </p>
          <TextInput
            data-modal-primary-focus
            id="text-input-1"
            labelText="Domain name"
            placeholder="For example, GitHub.com"
            style={{ marginBottom: 'var(--cds-spacing-06)' }}
          />
          <div style={{ marginBottom: 'var(--cds-spacing-06)' }}>
            <Select id="select-1" defaultValue="us-south" labelText="Region">
              <SelectItem value="us-south" text="US South" />
              <SelectItem value="us-east" text="US East" />
            </Select>
          </div>
          <TextArea
            id="text-area-1"
            labelText="Comments"
            style={{ height: '80px' }}
          />
        </Modal>
      </div>
    );
  },
};
WithAILabel.parameters = { ...sharedParameters };
