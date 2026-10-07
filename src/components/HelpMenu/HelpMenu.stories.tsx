import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { expect, waitFor } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { Book, Chat, Help } from '../../icons.js';
import {
  Button,
  HeaderPopover,
  HeaderPopoverButton,
  HeaderPopoverContent,
} from '../../index.js';
import { CarbonShell, LabsShell } from '../LogoutBanner/storyShells.js';
import { HelpMenu } from './HelpMenu.js';
import type { HelpMenuItem } from './HelpMenu.js';
import mdx from './HelpMenu.mdx';

const items: HelpMenuItem[] = [
  { id: 'docs', label: 'Documentation', href: '#docs', icon: Book },
  {
    id: 'shortcuts',
    label: 'Keyboard shortcuts',
    description: 'Keys for the ledger views',
    onSelect: action('shortcuts'),
  },
  { type: 'divider' },
  {
    id: 'contact',
    label: 'Contact support',
    onSelect: action('contact'),
    icon: Chat,
  },
];

const externalItems: HelpMenuItem[] = [
  {
    id: 'carbon',
    label: 'Carbon Design System',
    href: 'https://carbondesignsystem.com/',
    external: true,
  },
  {
    id: 'status',
    label: 'Service status',
    description: 'Opens the status page',
    href: 'https://example.com/status',
    external: true,
  },
  { type: 'divider' },
  { id: 'docs', label: 'Documentation', href: '#docs' },
];

const meta = {
  title: 'Components/UI Shell/Afframe/Help Menu',
  component: HelpMenu,
  tags: ['afframe'],
  args: { items, defaultOpen: true, onOpenChange: action('onOpenChange') },
  render: (args) => <CarbonShell actions={<HelpMenu {...args} />} />,
  parameters: {
    ...afframeA11y,
    layout: 'fullscreen',
    docs: { page: mdx, story: { inline: false, height: '20rem' } },
  },
} satisfies Meta<typeof HelpMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByLabelText('Help', { selector: 'button' })
    ).toHaveAttribute('aria-expanded', 'true');
    await expect(
      canvas.getByRole('list', { name: 'Help links' })
    ).toBeVisible();
  },
};

export const WithExternalLinks: Story = {
  args: { items: externalItems },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', {
      name: 'Carbon Design System (opens in a new tab)',
    });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  },
};

// The Labs header bar takes the default action as it is; renderAction swaps
// in a trigger with visible text.
export const InLabsShell: Story = {
  args: { defaultOpen: false },
  render: (args) => (
    <LabsShell
      actions={
        <HelpMenu
          {...args}
          renderAction={
            <Button kind="ghost" size="lg" renderIcon={Help}>
              Help
            </Button>
          }
        />
      }
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Help' });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() =>
      expect(canvas.getByRole('link', { name: 'Documentation' })).toHaveFocus()
    );
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();
  },
};

// Content mode inside a Labs HeaderPopover: the popover owns open state,
// outside press, Escape and focus return; HelpMenu renders only the list.
export const InHeaderPopover: Story = {
  args: { presentation: 'content' },
  render: (args) => (
    <LabsShell
      actions={
        <HeaderPopover align="bottom-end" className="story-help-popover">
          <HeaderPopoverButton align="bottom-end" label="Help">
            <Help size={20} />
          </HeaderPopoverButton>
          <HeaderPopoverContent>
            <HelpMenu {...args} />
          </HeaderPopoverContent>
        </HeaderPopover>
      }
    />
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    // HeaderPopoverButton sets no aria-expanded; the open class shows state.
    const popover = canvasElement.querySelector(
      '.story-help-popover'
    ) as HTMLElement;
    const trigger = popover.querySelector('button') as HTMLButtonElement;
    await userEvent.click(trigger);
    await expect(popover).toHaveClass('cds--popover--open');
    // The popover does not move focus in: Tab enters the list.
    await userEvent.tab();
    const docs = canvas.getByRole('link', { name: 'Documentation' });
    await expect(docs).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(
      canvas.getByRole('button', { name: /Keyboard shortcuts/ })
    ).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(docs).toHaveFocus();
    // Escape reaches the popover: it closes and focuses its button.
    await userEvent.keyboard('{Escape}');
    await expect(popover).not.toHaveClass('cds--popover--open');
    await expect(trigger).toHaveFocus();
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};
