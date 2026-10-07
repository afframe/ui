/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, ComposedModal parts and form parts from @afframe/ui, icons from @afframe/ui/icons, `size: null` arg dropped (no size is the default), ModalFooter gets children={null} (its type requires children), source tag, inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  ComposedModal,
  Dropdown,
  IconButton,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MultiSelect,
  Select,
  SelectItem,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
  TextInput,
} from '../../index.js';
import type {
  ComposedModalProps,
  ModalFooterProps,
  ModalHeaderProps,
} from '../../index.js';
import { View, FolderOpen, Folders } from '../../icons.js';
import mdx from './ComposedModal.mdx';

// Header and footer controls; the meta args give each one a value.
interface ComposedModalStoryControls {
  label: NonNullable<ModalHeaderProps['label']>;
  title: ModalHeaderProps['title'];
  iconDescription: NonNullable<ModalHeaderProps['iconDescription']>;
  primaryButtonText: NonNullable<ModalFooterProps['primaryButtonText']>;
  secondaryButtonText: NonNullable<ModalFooterProps['secondaryButtonText']>;
  primaryButtonDisabled: boolean;
  loadingStatus: NonNullable<ModalFooterProps['loadingStatus']>;
  loadingDescription: NonNullable<ModalFooterProps['loadingDescription']>;
  loadingIconDescription: NonNullable<
    ModalFooterProps['loadingIconDescription']
  >;
}

type ComposedModalStoryArgs = Omit<
  Partial<ComposedModalProps>,
  keyof ComposedModalStoryControls
> &
  ComposedModalStoryControls;

interface ModalStateProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const sharedControls = {
  controls: {
    exclude: [
      'containerClassName',
      'launcherButtonRef',
      'selectorPrimaryFocus',
      'selectorsFloatingMenus',
    ],
  },
};

export default {
  title: 'Components/ComposedModal',
  tags: ['carbon'],
  component: ComposedModal,
  subcomponents: {
    ModalHeader,
    ModalBody,
    ModalFooter,
  },
  parameters: {
    docs: {
      page: mdx,
    },
    ...sharedControls,
  },
  argTypes: {
    danger: { control: 'boolean' },
    isFullWidth: { control: 'boolean' },
    size: { control: 'radio', options: ['xs', 'sm', 'md', 'lg'] },
    preventCloseOnClickOutside: { control: 'boolean' },
    'aria-label': { control: 'text' },
    selectorPrimaryFocus: { control: 'text' },
    label: { control: 'text' },
    title: { control: 'text' },
    iconDescription: { control: 'text' },
    primaryButtonText: { control: 'text' },
    secondaryButtonText: { control: 'text' },
    primaryButtonDisabled: { control: 'boolean' },
    loadingStatus: {
      control: 'select',
      options: ['inactive', 'active', 'finished', 'error'],
    },
    loadingDescription: { control: 'text' },
    loadingIconDescription: { control: 'text' },
    onClose: { action: 'onClose' },
    onKeyDown: { action: 'onKeyDown' },
  },
  args: {
    danger: false,
    isFullWidth: false,
    preventCloseOnClickOutside: false,
    'aria-label': 'Composed Modal',
    label: 'Account resources',
    title: 'Add a custom domain',
    iconDescription: 'Close the modal',
    primaryButtonText: 'Add',
    secondaryButtonText: 'Cancel',
    primaryButtonDisabled: false,
    loadingStatus: 'inactive',
    loadingDescription: 'Deleting...',
    loadingIconDescription: 'Loading',
  },
} satisfies Meta;

export const Default: StoryFn<ComposedModalStoryArgs> = (args) => {
  const [open, setOpen] = useState(true);
  const {
    iconDescription = 'Close the modal',
    label = 'Account resources',
    title = 'Add a custom domain',
    primaryButtonText = 'Add',
    secondaryButtonText = 'Cancel',
    primaryButtonDisabled = false,
    loadingStatus = 'inactive',
    loadingDescription,
    loadingIconDescription,
    ...modalArgs
  } = args;
  return (
    <>
      <Button onClick={() => setOpen(true)}>Launch composed modal</Button>
      <ComposedModal {...modalArgs} open={open} onClose={() => setOpen(false)}>
        <ModalHeader
          label={label}
          title={title}
          iconDescription={iconDescription}
        />
        <ModalBody>
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
        </ModalBody>
        <ModalFooter
          primaryButtonText={primaryButtonText}
          secondaryButtonText={secondaryButtonText}
          primaryButtonDisabled={primaryButtonDisabled}
          loadingStatus={loadingStatus}
          loadingDescription={loadingDescription}
          loadingIconDescription={loadingIconDescription}
          children={null}
        />
      </ComposedModal>
    </>
  );
};

export const FullWidth: StoryFn<ComposedModalStoryArgs> = (args) => {
  const [open, setOpen] = useState(true);
  const {
    iconDescription = 'Close the modal',
    label = 'An example of a modal with no padding',
    title = 'Full Width Modal',
    primaryButtonText = 'Add',
    secondaryButtonText = 'Cancel',
    primaryButtonDisabled = false,
    loadingStatus = 'inactive',
    loadingDescription,
    loadingIconDescription,
    ...modalArgs
  } = args;
  return (
    <>
      <Button onClick={() => setOpen(true)}>Launch composed modal</Button>
      <ComposedModal
        {...modalArgs}
        open={open}
        onClose={() => setOpen(false)}
        isFullWidth>
        <ModalHeader
          label={label}
          title={title}
          iconDescription={iconDescription}
        />
        <ModalBody>
          <StructuredListWrapper>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head noWrap>
                  Column A
                </StructuredListCell>
                <StructuredListCell head noWrap>
                  Column B
                </StructuredListCell>
                <StructuredListCell head noWrap>
                  Column C
                </StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              <StructuredListRow>
                <StructuredListCell noWrap>Row 1</StructuredListCell>
                <StructuredListCell>Row 1</StructuredListCell>
                <StructuredListCell>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  dui magna, finibus id tortor sed, aliquet bibendum augue.
                  Aenean posuere sem vel euismod dignissim. Nulla ut cursus
                  dolor. Pellentesque vulputate nisl a porttitor interdum.
                </StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell noWrap>Row 2</StructuredListCell>
                <StructuredListCell>Row 2</StructuredListCell>
                <StructuredListCell>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  dui magna, finibus id tortor sed, aliquet bibendum augue.
                  Aenean posuere sem vel euismod dignissim. Nulla ut cursus
                  dolor. Pellentesque vulputate nisl a porttitor interdum.
                </StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell noWrap>Row 3</StructuredListCell>
                <StructuredListCell>Row 3</StructuredListCell>
                <StructuredListCell>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  dui magna, finibus id tortor sed, aliquet bibendum augue.
                  Aenean posuere sem vel euismod dignissim. Nulla ut cursus
                  dolor. Pellentesque vulputate nisl a porttitor interdum.
                </StructuredListCell>
              </StructuredListRow>
            </StructuredListBody>
          </StructuredListWrapper>
        </ModalBody>
        <ModalFooter
          primaryButtonText={primaryButtonText}
          secondaryButtonText={secondaryButtonText}
          primaryButtonDisabled={primaryButtonDisabled}
          loadingStatus={loadingStatus}
          loadingDescription={loadingDescription}
          loadingIconDescription={loadingIconDescription}
          children={null}
        />
      </ComposedModal>
    </>
  );
};

FullWidth.args = {
  isFullWidth: true,
  label: 'An example of a modal with no padding',
  title: 'Full Width Modal',
};
FullWidth.argTypes = {
  isFullWidth: {
    control: 'boolean',
    table: {
      readonly: true,
    },
  },
};

export const PassiveModal: StoryFn<ComposedModalStoryArgs> = (args) => {
  const [open, setOpen] = useState(true);
  const {
    iconDescription = 'Close the modal',
    label,
    title = 'You have been successfully signed out',
    ...modalArgs
  } = args;
  return (
    <>
      <Button onClick={() => setOpen(true)}>Launch composed modal</Button>
      <ComposedModal {...modalArgs} open={open} onClose={() => setOpen(false)}>
        <ModalHeader
          label={label}
          title={title}
          iconDescription={iconDescription}
        />
        <ModalBody />
      </ComposedModal>
    </>
  );
};

PassiveModal.args = {
  title: 'You have been successfully signed out',
};
PassiveModal.parameters = {
  controls: {
    include: [
      'aria-label',
      'preventCloseOnClickOutside',
      'size',
      'title',
      'iconDescription',
    ],
  },
};

export const WithStateManager: StoryFn<ComposedModalStoryArgs> = (args) => {
  const button = useRef<HTMLButtonElement>(null);
  const {
    iconDescription = 'Close the modal',
    label = 'Account resources',
    title = 'Add a custom domain',
    primaryButtonText = 'Add',
    secondaryButtonText = 'Cancel',
    primaryButtonDisabled = false,
    loadingStatus = 'inactive',
    loadingDescription,
    loadingIconDescription,
    ...modalArgs
  } = args;

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
  return (
    <ModalStateManager
      renderLauncher={({ setOpen }) => (
        <Button ref={button} onClick={() => setOpen(true)}>
          Launch composed modal
        </Button>
      )}>
      {({ open, setOpen }) => (
        <ComposedModal
          {...modalArgs}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          launcherButtonRef={button}>
          <ModalHeader
            label={label}
            title={title}
            iconDescription={iconDescription}
          />
          <ModalBody>
            <p style={{ marginBottom: 'var(--cds-spacing-05)' }}>
              Custom domains direct requests for your apps in this Cloud Foundry
              organization to a URL that you own. A custom domain can be a
              shared domain, a shared subdomain, or a shared domain and host.
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
          </ModalBody>
          <ModalFooter
            primaryButtonText={primaryButtonText}
            secondaryButtonText={secondaryButtonText}
            primaryButtonDisabled={primaryButtonDisabled}
            loadingStatus={loadingStatus}
            loadingDescription={loadingDescription}
            loadingIconDescription={loadingIconDescription}
            children={null}
          />
        </ComposedModal>
      )}
    </ModalStateManager>
  );
};

export const WithScrollingContent: StoryFn<ComposedModalStoryArgs> = (args) => {
  const [open, setOpen] = useState(true);
  const {
    iconDescription = 'Close the modal',
    label = 'Account resources',
    title = 'Add a custom domain',
    primaryButtonText = 'Add',
    secondaryButtonText = 'Cancel',
    primaryButtonDisabled = false,
    loadingStatus = 'inactive',
    loadingDescription,
    loadingIconDescription,
    ...modalArgs
  } = args;
  return (
    <>
      <Button onClick={() => setOpen(true)}>Launch composed modal</Button>
      <ComposedModal {...modalArgs} open={open} onClose={() => setOpen(false)}>
        <ModalHeader
          label={label}
          title={title}
          iconDescription={iconDescription}
        />
        <ModalBody hasScrollingContent>
          <p style={{ marginBottom: 'var(--cds-spacing-05)' }}>
            Custom domains direct requests for your apps in this Cloud Foundry
            organization to a URL that you own. A custom domain can be a shared
            domain, a shared subdomain, or a shared domain and host.
          </p>
          <p style={{ marginBottom: 'var(--cds-spacing-05)' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            eu nibh odio. Nunc a consequat est, id porttitor sapien. Proin vitae
            leo vitae orci tincidunt auctor eget eget libero. Ut tincidunt
            ultricies fringilla. Aliquam erat volutpat. Aenean arcu odio,
            elementum vel vehicula vitae, porttitor ac lorem. Sed viverra elit
            ac risus tincidunt fermentum. Ut sollicitudin nibh id risus ornare
            ornare. Etiam gravida orci ut lectus dictum, quis ultricies felis
            mollis. Mauris nec commodo est, nec faucibus nibh. Nunc commodo ante
            quis pretium consectetur. Ut ac nisl vitae mi mattis vulputate a at
            elit. Nullam porttitor ex eget mi feugiat mattis. Nunc non sodales
            magna. Proin ornare tellus quis hendrerit egestas. Donec pharetra
            leo nec molestie sollicitudin.{' '}
          </p>
          <TextInput
            data-modal-primary-focus
            id="text-input-1"
            labelText="Domain name"
            placeholder="e.g. github.com"
            style={{ marginBottom: 'var(--cds-spacing-05)' }}
          />
          <div style={{ marginBottom: 'var(--cds-spacing-05)' }}>
            <Select id="select-1" defaultValue="us-south" labelText="Region">
              <SelectItem value="us-south" text="US South" />
              <SelectItem value="us-east" text="US East" />
            </Select>
          </div>
          <Dropdown
            id="drop"
            label="Dropdown"
            titleText="Dropdown"
            items={[
              { id: 'one', label: 'one', name: 'one' },
              { id: 'two', label: 'two', name: 'two' },
            ]}
            style={{ marginBottom: 'var(--cds-spacing-05)' }}
          />
          <MultiSelect
            id="test"
            label="Multiselect"
            titleText="Multiselect"
            items={[
              {
                id: 'downshift-1-item-0',
                text: 'Option 1',
              },
              {
                id: 'downshift-1-item-1',
                text: 'Option 2',
              },
            ]}
            itemToString={(item) => (item ? item.text : '')}
          />
        </ModalBody>
        <ModalFooter
          primaryButtonText={primaryButtonText}
          secondaryButtonText={secondaryButtonText}
          primaryButtonDisabled={primaryButtonDisabled}
          loadingStatus={loadingStatus}
          loadingDescription={loadingDescription}
          loadingIconDescription={loadingIconDescription}
          children={null}
        />
      </ComposedModal>
    </>
  );
};

export const WithInlineLoading: StoryFn<ComposedModalStoryArgs> = (args) => {
  const [open, setOpen] = useState(true);
  const [status, setStatus] =
    useState<ComposedModalStoryControls['loadingStatus']>('inactive');
  const [description, setDescription] = useState('Submitting...');
  const {
    iconDescription = 'Close the modal',
    label = 'Account resources',
    title = 'Add a custom domain',
    primaryButtonText = 'Add',
    secondaryButtonText = 'Cancel',
    primaryButtonDisabled = false,
    loadingIconDescription,
    ...modalArgs
  } = args;

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

    setDescription('Submitted!');
    setStatus('finished');
  };

  const resetStatus = () => {
    setStatus('inactive');
    setDescription('Submitting...');
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Launch composed modal</Button>
      <ComposedModal {...modalArgs} open={open} onClose={() => setOpen(false)}>
        <ModalHeader
          label={label}
          title={title}
          iconDescription={iconDescription}
        />
        <ModalBody>
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
        </ModalBody>
        <ModalFooter
          primaryButtonText={primaryButtonText}
          secondaryButtonText={secondaryButtonText}
          primaryButtonDisabled={primaryButtonDisabled}
          loadingStatus={status}
          loadingDescription={description}
          loadingIconDescription={loadingIconDescription}
          onRequestSubmit={submit}
          onLoadingSuccess={resetStatus}
          children={null}
        />
      </ComposedModal>
    </>
  );
};

WithInlineLoading.parameters = {
  controls: {
    exclude: [
      'loadingStatus',
      'loadingDescription',
      'loadingIconDescription',
      'containerClassName',
      'launcherButtonRef',
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

export const _withAILabel: StoryObj<ComposedModalStoryArgs> = {
  args: {
    label: 'Account resources',
    title: 'Add a custom domain',
    primaryButtonText: 'Save',
  },
  parameters: {
    ...sharedControls,
  },
  argTypes: {
    label: { control: 'text' },
    title: { control: 'text' },
    primaryButtonText: { control: 'text' },
    onClose: { action: 'onClose' },
    onKeyDown: { action: 'onKeyDown' },
  },
  render: (args) => {
    const [open, setOpen] = useState(true);
    const {
      iconDescription = 'Close the modal',
      label = 'Account resources',
      title = 'Add a custom domain',
      primaryButtonText = 'Save',
      secondaryButtonText = 'Cancel',
      primaryButtonDisabled = false,
      loadingStatus = 'inactive',
      loadingDescription,
      loadingIconDescription,
      ...modalArgs
    } = args;
    return (
      <div className="ai-label-modal">
        <Button onClick={() => setOpen(true)}>Launch composed modal</Button>
        <ComposedModal
          {...modalArgs}
          open={open}
          onClose={() => setOpen(false)}
          decorator={aiLabel}>
          <ModalHeader
            label={label}
            title={title}
            iconDescription={iconDescription}
          />
          <ModalBody>
            <p style={{ marginBottom: 'var(--cds-spacing-05)' }}>
              Custom domains direct requests for your apps in this Cloud Foundry
              organization to a URL that you own. A custom domain can be a
              shared domain, a shared subdomain, or a shared domain and host.
            </p>
            <p style={{ marginBottom: 'var(--cds-spacing-05)' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              eu nibh odio. Nunc a consequat est, id porttitor sapien. Proin
              vitae leo vitae orci tincidunt auctor eget eget libero. Ut
              tincidunt ultricies fringilla. Aliquam erat volutpat. Aenean arcu
              odio, elementum vel vehicula vitae, porttitor ac lorem. Sed
              viverra elit ac risus tincidunt fermentum. Ut sollicitudin nibh id
              risus ornare ornare. Etiam gravida orci ut lectus dictum, quis
              ultricies felis mollis. Mauris nec commodo est, nec faucibus nibh.
              Nunc commodo ante quis pretium consectetur. Ut ac nisl vitae mi
              mattis vulputate a at elit. Nullam porttitor ex eget mi feugiat
              mattis. Nunc non sodales magna. Proin ornare tellus quis hendrerit
              egestas. Donec pharetra leo nec molestie sollicitudin.
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
            <p style={{ marginBlock: 'var(--cds-spacing-05)' }}>
              Custom domains direct requests for your apps in this Cloud Foundry
              organization to a URL that you own. A custom domain can be a
              shared domain, a shared subdomain, or a shared domain and host.
            </p>
            <TextInput
              data-modal-primary-focus
              id="text-input-1"
              labelText="Domain name"
              placeholder="e.g. github.com"
              style={{ marginBottom: 'var(--cds-spacing-05)' }}
            />
          </ModalBody>

          <ModalFooter
            primaryButtonText={primaryButtonText}
            secondaryButtonText={secondaryButtonText}
            primaryButtonDisabled={primaryButtonDisabled}
            loadingStatus={loadingStatus}
            loadingDescription={loadingDescription}
            loadingIconDescription={loadingIconDescription}
            children={null}
          />
        </ComposedModal>
      </div>
    );
  },
};
