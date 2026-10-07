import { act, cleanup, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Header, HeaderGlobalBar, HeaderName } from '../../index.js';
import { AfframeProvider } from '../../provider/AfframeProvider.js';
import { EnvironmentSwitcher } from './EnvironmentSwitcher.js';
import type {
  EnvironmentOption,
  EnvironmentSwitcherProps,
} from './EnvironmentSwitcher.js';

const settleAnimations = () =>
  Promise.allSettled(
    document
      .getAnimations()
      .filter(
        (animation) => animation.effect?.getTiming().iterations !== Infinity
      )
      .map((animation) => animation.finished)
  );

afterEach(async () => {
  await settleAnimations();
  cleanup();
});

const environments: EnvironmentOption[] = [
  { id: 'dev', label: 'Development' },
  { id: 'staging', label: 'Staging', description: 'Data copied nightly' },
  { id: 'prod', label: 'Live', production: true },
];

type PageProps = Partial<EnvironmentSwitcherProps>;

function Page({ onChange, ...props }: PageProps) {
  const [value, setValue] = useState('staging');
  return (
    <AfframeProvider>
      <Header aria-label="Afframe">
        <HeaderName href="#" prefix="Afframe">
          Ledger
        </HeaderName>
        <HeaderGlobalBar>
          <EnvironmentSwitcher
            environments={environments}
            value={value}
            onChange={(id) => {
              onChange?.(id);
              setValue(id);
            }}
            {...props}
          />
        </HeaderGlobalBar>
      </Header>
      <main style={{ paddingBlockStart: '4rem' }}>
        <button type="button">After</button>
      </main>
    </AfframeProvider>
  );
}

const action = (name = /^Environment: /) =>
  screen.getByLabelText(name, { selector: 'button' });
const radio = (name: RegExp) =>
  screen.getByRole<HTMLInputElement>('radio', { name });
const until = (check: () => void) => vi.waitFor(check, { timeout: 2000 });

test.each(['click', '{Enter}', ' '])(
  'opens by %s, focus moves to the checked radio',
  async (how) => {
    const onOpenChange = vi.fn();
    render(<Page onOpenChange={onOpenChange} />);
    const button = action();
    expect(button).toHaveAccessibleName('Environment: Staging');
    expect(button).toHaveTextContent('Staging');
    const panelId = button.getAttribute('aria-controls') ?? '';
    expect(document.getElementById(panelId)).not.toBeNull();
    expect(button).toHaveAttribute('aria-expanded', 'false');
    if (how === 'click') await userEvent.click(button);
    else {
      button.focus();
      await userEvent.keyboard(how);
    }
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
    await until(() => expect(radio(/Staging/)).toHaveFocus());
    expect(radio(/Staging/)).toBeChecked();
  }
);

test('panel: a named fieldset of radios, out of the tab order when closed', async () => {
  render(<Page />);
  action().focus();
  await userEvent.tab();
  expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  expect(
    screen.getByRole('group', { name: 'Environments' })
  ).toBeInTheDocument();
});

test('arrows move the selection without switching; Enter switches once, closes, returns focus and announces', async () => {
  const onChange = vi.fn();
  render(<Page onChange={onChange} />);
  await userEvent.click(action());
  await until(() => expect(radio(/Staging/)).toHaveFocus());
  await userEvent.keyboard('{ArrowDown}');
  expect(radio(/Live/)).toHaveFocus();
  expect(radio(/Live/)).toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
  expect(action()).toHaveAttribute('aria-expanded', 'true');
  await userEvent.keyboard('{Enter}');
  expect(onChange).toHaveBeenCalledExactlyOnceWith('prod');
  expect(action(/Live/)).toHaveAttribute('aria-expanded', 'false');
  expect(action(/Live/)).toHaveFocus();
  expect(screen.getByRole('status')).toHaveTextContent('Switched to Live');
});

test('Space commits the focused radio', async () => {
  const onChange = vi.fn();
  render(<Page onChange={onChange} />);
  await userEvent.click(action());
  await until(() => expect(radio(/Staging/)).toHaveFocus());
  await userEvent.keyboard('{ArrowUp} ');
  expect(onChange).toHaveBeenCalledExactlyOnceWith('dev');
  expect(action(/Development/)).toHaveFocus();
});

test('a click on an environment switches; on the current one only closes', async () => {
  const onChange = vi.fn();
  render(<Page onChange={onChange} />);
  await userEvent.click(action());
  await userEvent.click(screen.getByText('Data copied nightly'));
  expect(onChange).not.toHaveBeenCalled();
  expect(action()).toHaveAttribute('aria-expanded', 'false');
  await userEvent.click(action());
  await userEvent.click(screen.getByText('Development'));
  expect(onChange).toHaveBeenCalledExactlyOnceWith('dev');
  expect(action(/Development/)).toHaveFocus();
});

test('a draft is dropped on close: reopening starts from the current environment', async () => {
  render(<Page />);
  await userEvent.click(action());
  await until(() => expect(radio(/Staging/)).toHaveFocus());
  await userEvent.keyboard('{ArrowDown}{Escape}');
  expect(action()).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  await until(() => expect(radio(/Staging/)).toHaveFocus());
  expect(radio(/Staging/)).toBeChecked();
});

test('Escape closes once and returns focus; outside click and focus leaving close', async () => {
  const onOpenChange = vi.fn();
  render(<Page onOpenChange={onOpenChange} />);
  await userEvent.click(action());
  await until(() => expect(radio(/Staging/)).toHaveFocus());
  onOpenChange.mockClear();
  await userEvent.keyboard('{Escape}');
  expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  expect(action()).toHaveFocus();
  await userEvent.click(action());
  await userEvent.click(screen.getByRole('button', { name: 'After' }));
  expect(action()).toHaveAttribute('aria-expanded', 'false');
  await userEvent.click(action());
  await until(() => expect(radio(/Staging/)).toHaveFocus());
  await userEvent.tab();
  expect(action()).toHaveAttribute('aria-expanded', 'false');
});

test('Shift+Tab back to the action keeps the panel open; Escape there closes once', async () => {
  const onOpenChange = vi.fn();
  render(<Page onOpenChange={onOpenChange} />);
  await userEvent.click(action());
  await until(() => expect(radio(/Staging/)).toHaveFocus());
  await userEvent.tab({ shift: true });
  expect(action()).toHaveFocus();
  expect(action()).toHaveAttribute('aria-expanded', 'true');
  onOpenChange.mockClear();
  await userEvent.keyboard('{Escape}');
  expect(action()).toHaveAttribute('aria-expanded', 'false');
  expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  expect(action()).toHaveFocus();
});

test('a new value while open replaces the draft', async () => {
  const onChange = vi.fn();
  let setOutside: (id: string) => void = () => undefined;
  function Outside() {
    const [value, setValue] = useState('staging');
    setOutside = setValue;
    return (
      <EnvironmentSwitcher
        environments={environments}
        value={value}
        onChange={onChange}
        defaultOpen
      />
    );
  }
  render(<Outside />);
  radio(/Staging/).focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(radio(/Live/)).toBeChecked();
  await act(async () => setOutside('dev'));
  expect(radio(/Development/)).toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});

test('a click without pointer events (script, screen reader) switches', () => {
  const onChange = vi.fn();
  render(<Page onChange={onChange} defaultOpen />);
  radio(/Live/).click();
  expect(onChange).toHaveBeenCalledExactlyOnceWith('prod');
  expect(action(/Live/)).toHaveAttribute('aria-expanded', 'false');
});

test('controlled open', async () => {
  const onOpenChange = vi.fn();
  function Controlled() {
    const [open, setOpen] = useState(false);
    return (
      <Page
        open={open}
        onOpenChange={(next) => {
          onOpenChange(next);
          setOpen(next);
        }}
      />
    );
  }
  render(<Controlled />);
  await userEvent.click(action());
  expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
  expect(action()).toHaveAttribute('aria-expanded', 'true');
  cleanup();
  render(<Page open={false} onOpenChange={() => undefined} />);
  await userEvent.click(action());
  expect(action()).toHaveAttribute('aria-expanded', 'false');
});

test('production environment carries a text tag', () => {
  render(<Page defaultOpen />);
  expect(radio(/Live/)).toHaveAccessibleName('Live Production');
  expect(
    screen.getByText('Production').closest('.cds--tag--red')
  ).not.toBeNull();
});

test('disabled: the panel opens, nothing can be chosen', async () => {
  const onChange = vi.fn();
  render(<Page disabled onChange={onChange} />);
  await userEvent.click(action());
  expect(action()).toHaveAttribute('aria-expanded', 'true');
  expect(radio(/Live/)).toBeDisabled();
  await userEvent.click(screen.getByText('Live'), { force: true });
  expect(onChange).not.toHaveBeenCalled();
});

test('focus is not obscured by the fixed header', async () => {
  render(<Page />);
  await userEvent.click(action());
  await until(() => expect(radio(/Staging/)).toHaveFocus());
  await settleAnimations();
  const label = radio(/Staging/).labels?.[0];
  if (!label) throw new Error('no label');
  const box = label.getBoundingClientRect();
  const hit = document.elementFromPoint(
    box.left + box.width / 2,
    box.top + box.height / 2
  );
  expect(label.contains(hit)).toBe(true);
});

test('messages replace every English string', async () => {
  render(
    <Page
      defaultOpen
      messages={{
        label: 'X-panel',
        panelHeading: 'X-heading',
        currentEnvironment: (label) => `X-current-${label}`,
        productionTag: 'X-prod',
        switched: (label) => `X-switched-${label}`,
      }}
    />
  );
  const button = action(/^X-current-Staging$/);
  expect(screen.getByRole('region', { name: 'X-panel' })).toBeVisible();
  expect(screen.getByRole('group', { name: 'X-heading' })).toBeVisible();
  expect(radio(/Live/)).toHaveAccessibleName('Live X-prod');
  radio(/Development/).focus();
  await userEvent.keyboard('{Enter}');
  expect(screen.getByRole('status')).toHaveTextContent(
    'X-switched-Development'
  );
  expect(button).toBeVisible();
});

test('content mode renders only the group and leaves Escape to its container', async () => {
  const onKeyDown = vi.fn();
  const onChange = vi.fn();
  render(
    <AfframeProvider>
      <div onKeyDown={(event) => onKeyDown(event.key)}>
        <EnvironmentSwitcher
          environments={environments}
          value="staging"
          onChange={onChange}
          presentation="content"
          defaultOpen={false}
        />
      </div>
    </AfframeProvider>
  );
  expect(screen.queryByRole('button')).toBeNull();
  expect(screen.queryByRole('region')).toBeNull();
  expect(document.querySelector('[aria-expanded]')).toBeNull();
  expect(document.querySelector('.cds--header-panel')).toBeNull();
  expect(screen.getByRole('group', { name: 'Environments' })).toBeVisible();
  await userEvent.tab();
  expect(screen.getByRole('radio', { name: /Staging/ })).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  expect(onKeyDown).toHaveBeenLastCalledWith('Escape');
  await userEvent.keyboard('{ArrowUp}{Enter}');
  expect(onChange).toHaveBeenCalledExactlyOnceWith('dev');
  expect(screen.getByRole('radio', { name: /Development/ })).toHaveFocus();
});
