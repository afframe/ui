import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, fn, waitFor } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { ArrowsHorizontal } from '../../icons.js';
import {
  Button,
  HeaderPopover,
  HeaderPopoverButton,
  HeaderPopoverContent,
} from '../../index.js';
import { HelpMenu } from '../HelpMenu/HelpMenu.js';
import {
  CarbonShell,
  headerPanelArgTypes,
  LabsShell,
} from '../HeaderPanelParts/storyShells.js';
import { EnvironmentSwitcher } from './EnvironmentSwitcher.js';
import type {
  EnvironmentOption,
  EnvironmentSwitcherProps,
} from './EnvironmentSwitcher.js';
import mdx from './EnvironmentSwitcher.mdx';

// The props of the default `'panel'` presentation. Story args are typed as
// the whole union, so the panel stories narrow them.
type PanelProps = Extract<EnvironmentSwitcherProps, { presentation?: 'panel' }>;

const environments: EnvironmentOption[] = [
  { id: 'dev', label: 'Development' },
  { id: 'staging', label: 'Staging', description: 'Data copied nightly' },
  { id: 'prod', label: 'Live', production: true },
];

// Holds the current environment like an app would.
function Stateful(props: EnvironmentSwitcherProps) {
  const [value, setValue] = useState(props.value);
  return (
    <EnvironmentSwitcher
      {...props}
      value={value}
      onChange={(id) => {
        props.onChange(id);
        setValue(id);
      }}
    />
  );
}

const meta = {
  title: 'Components/UI Shell/EnvironmentSwitcher',
  component: EnvironmentSwitcher,
  tags: ['afframe'],
  args: {
    environments: environments.slice(0, 2),
    value: 'staging',
    onChange: action('onChange'),
    onOpenChange: action('onOpenChange'),
    defaultOpen: true,
  },
  argTypes: headerPanelArgTypes,
  render: (args) => <CarbonShell actions={<Stateful {...args} />} />,
  parameters: {
    ...afframeA11y,
    layout: 'fullscreen',
    docs: { page: mdx, story: { inline: false, height: '20rem' } },
  },
} satisfies Meta<typeof EnvironmentSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: /Staging/ })).toBeChecked();
  },
};

export const WithProduction: Story = {
  args: { environments },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('radio', { name: /Live/ })
    ).toHaveAccessibleName('Live Production');
  },
};

// The panel opens, but no environment can be chosen.
export const Disabled: Story = {
  args: { disabled: true, onChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const development = canvas.getByRole('radio', { name: /Development/ });
    await expect(development).toBeDisabled();
    await userEvent.click(development);
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(canvas.getByRole('radio', { name: /Staging/ })).toBeChecked();
  },
};

// The default action works in the Labs header bar as it is; renderAction
// swaps in a ghost button like the Labs header's menu buttons.
// The trigger shows the current environment from the app's state.
function LabsTrigger(props: PanelProps) {
  const [value, setValue] = useState(props.value);
  const current = props.environments.find((option) => option.id === value);
  return (
    <EnvironmentSwitcher
      {...props}
      value={value}
      onChange={(id) => {
        props.onChange(id);
        setValue(id);
      }}
      renderAction={
        <Button kind="ghost" size="lg" renderIcon={ArrowsHorizontal}>
          {`Environment: ${current?.label ?? value}`}
        </Button>
      }
    />
  );
}

export const InLabsShell: Story = {
  args: { environments, defaultOpen: false },
  render: (args) => (
    <LabsShell actions={<LabsTrigger {...(args as PanelProps)} />} />
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', {
      name: 'Environment: Staging',
    });
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(canvas.getByRole('radio', { name: /Staging/ })).toHaveFocus()
    );
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
  },
};

// Two header actions, one open panel: the page holds which one is open.
function TwoActions(props: PanelProps) {
  const [openPanel, setOpenPanel] = useState<'environment' | 'help' | null>(
    null
  );
  const toggle = (panel: 'environment' | 'help') => (open: boolean) =>
    setOpenPanel((current) =>
      open ? panel : current === panel ? null : current
    );
  return (
    <CarbonShell
      actions={
        <>
          <Stateful
            {...props}
            open={openPanel === 'environment'}
            onOpenChange={toggle('environment')}
          />
          <HelpMenu
            items={[{ id: 'docs', label: 'Documentation', href: '#docs' }]}
            open={openPanel === 'help'}
            onOpenChange={toggle('help')}
          />
        </>
      }
    />
  );
}

export const OnePanelAtATime: Story = {
  args: { defaultOpen: false },
  render: (args) => <TwoActions {...(args as PanelProps)} />,
  play: async ({ canvas, userEvent }) => {
    const environment = canvas.getByLabelText('Environment: Staging', {
      selector: 'button',
    });
    const help = canvas.getByLabelText('Help', { selector: 'button' });
    await userEvent.click(environment);
    await expect(environment).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(help);
    await expect(help).toHaveAttribute('aria-expanded', 'true');
    await expect(environment).toHaveAttribute('aria-expanded', 'false');
  },
};

// Content mode inside a Labs HeaderPopover: the popover owns open state,
// outside press, Escape and focus return; the switcher renders only the list.
export const InHeaderPopover: Story = {
  args: { environments, presentation: 'content', onChange: fn() },
  // Only the props content mode takes: the meta's open state args stay out.
  render: ({ environments, value, onChange }) => (
    <LabsShell
      actions={
        <HeaderPopover align="bottom-end" className="story-environment-popover">
          <HeaderPopoverButton align="bottom-end" label="Switch environment">
            <ArrowsHorizontal size={20} />
          </HeaderPopoverButton>
          <HeaderPopoverContent>
            <Stateful
              presentation="content"
              environments={environments}
              value={value}
              onChange={onChange}
            />
          </HeaderPopoverContent>
        </HeaderPopover>
      }
    />
  ),
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    // HeaderPopoverButton sets no aria-expanded; the open class shows state.
    const popover = canvasElement.querySelector(
      '.story-environment-popover'
    ) as HTMLElement;
    const trigger = popover.querySelector('button') as HTMLButtonElement;
    const radio = (name: RegExp) => canvas.getByRole('radio', { name });
    await userEvent.click(trigger);
    await expect(popover).toHaveClass('cds--popover--open');
    // The popover does not move focus in: Tab enters the group.
    await userEvent.tab();
    await expect(radio(/Staging/)).toHaveFocus();
    // Arrows move the selection only.
    await userEvent.keyboard('{ArrowDown}');
    await expect(radio(/Live/)).toHaveFocus();
    await expect(radio(/Live/)).toBeChecked();
    await expect(args.onChange).not.toHaveBeenCalled();
    // Enter, Space and a click switch; the popover stays open.
    await userEvent.keyboard('{Enter}');
    await expect(args.onChange).toHaveBeenLastCalledWith('prod');
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Switched to Live'
    );
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard(' ');
    await expect(args.onChange).toHaveBeenLastCalledWith('staging');
    await userEvent.click(radio(/Development/));
    await expect(args.onChange).toHaveBeenLastCalledWith('dev');
    await expect(args.onChange).toHaveBeenCalledTimes(3);
    await expect(popover).toHaveClass('cds--popover--open');
    // A moved selection is dropped when focus leaves: Escape reaches the
    // popover, which closes and focuses its button.
    await userEvent.keyboard('{ArrowDown}');
    await expect(radio(/Staging/)).toBeChecked();
    await userEvent.keyboard('{Escape}');
    await expect(popover).not.toHaveClass('cds--popover--open');
    await expect(trigger).toHaveFocus();
    // The closed popover hides the list; the current one is checked again.
    await expect(
      canvas.getByRole('radio', { name: /Development/, hidden: true })
    ).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(3);
  },
};

export const Dark: Story = {
  tags: ['!dev', '!autodocs'],
  globals: { theme: 'dark' },
};
