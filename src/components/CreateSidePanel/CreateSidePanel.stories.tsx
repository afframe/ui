import type { Meta, StoryObj } from '@storybook/react-vite';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { Content, Header, HeaderName } from '../../index.js';
import {
  exampleCustomer,
  flowHarnessArgTypes,
  flowRender,
  flowStories,
} from '../FlowParts/storyForm.js';
import type { FlowHarnessArgs } from '../FlowParts/storyForm.js';
import { CreateSidePanel } from './CreateSidePanel.js';
import type { CreateSidePanelProps } from './CreateSidePanel.js';
import mdx from './CreateSidePanel.mdx';

const meta = {
  title: 'Components/Create and Edit/CreateSidePanel',
  component: CreateSidePanel,
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    layout: 'fullscreen',
    docs: { page: mdx, story: { inline: false, iframeHeight: 640 } },
  },
  argTypes: flowHarnessArgTypes,
  args: {
    open: true,
    title: 'New customer',
    description: 'Customers appear in the invoice form once created.',
    onClose: () => undefined,
    onSubmit: (): void => undefined,
  },
  render: flowRender(CreateSidePanel, 'create-side-panel', 'New customer'),
} satisfies Meta<CreateSidePanelProps & FlowHarnessArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

const stories = flowStories('Create', 14, exampleCustomer.name);

export const Default: Story = {};

export const WithError: Story = stories.WithError;

export const Dirty: Story = stories.Dirty;

export const Submitting: Story = stories.Submitting;

export const LongForm: Story = stories.LongForm;

/** With a UI Shell header the panel starts at the header's measured bottom edge. */
export const UnderPageHeader: Story = {
  decorators: [
    (Story) => (
      <>
        <Header aria-label="Afframe">
          <HeaderName href="#" prefix="Afframe">
            Invoices
          </HeaderName>
        </Header>
        <Content>
          <Story />
        </Content>
      </>
    ),
  ],
};

export const Dark: Story = {
  ...Default,
  tags: ['!dev', '!autodocs'],
  globals: { theme: 'dark' },
};
