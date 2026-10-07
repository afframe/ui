import { cleanup, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Header, HeaderGlobalBar, HeaderName } from '../../index.js';
import { AfframeProvider } from '../../provider/AfframeProvider.js';
import { HelpMenu } from './HelpMenu.js';
import type { HelpMenuItem, HelpMenuProps } from './HelpMenu.js';

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

const onShortcuts = vi.fn();
const items: HelpMenuItem[] = [
  { id: 'docs', label: 'Documentation', href: '#docs' },
  {
    id: 'shortcuts',
    label: 'Keyboard shortcuts',
    description: 'Keys for the ledger views',
    onSelect: onShortcuts,
  },
  { type: 'divider' },
  {
    id: 'status',
    label: 'Service status',
    href: 'https://example.com/status',
    external: true,
  },
];

function Page(props: Partial<HelpMenuProps>) {
  return (
    <AfframeProvider>
      <Header aria-label="Afframe">
        <HeaderName href="#" prefix="Afframe">
          Ledger
        </HeaderName>
        <HeaderGlobalBar>
          <HelpMenu items={items} {...props} />
        </HeaderGlobalBar>
      </Header>
      <main style={{ paddingBlockStart: '4rem' }}>
        <button type="button">After</button>
      </main>
    </AfframeProvider>
  );
}

const action = () => screen.getByLabelText('Help', { selector: 'button' });
const firstItem = () => screen.getByRole('link', { name: 'Documentation' });
const until = (check: () => void) => vi.waitFor(check, { timeout: 2000 });

test.each(['click', '{Enter}', ' '])(
  'opens by %s, focus moves to the first item',
  async (how) => {
    const onOpenChange = vi.fn();
    render(<Page onOpenChange={onOpenChange} />);
    const button = action();
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
    await until(() => expect(firstItem()).toHaveFocus());
  }
);

test('closed panel: items are out of the tab order', async () => {
  render(<Page />);
  action().focus();
  await userEvent.tab();
  expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
});

test('Escape closes once and returns focus to the action', async () => {
  const onOpenChange = vi.fn();
  render(<Page defaultOpen onOpenChange={onOpenChange} />);
  firstItem().focus();
  await userEvent.keyboard('{Escape}');
  expect(action()).toHaveAttribute('aria-expanded', 'false');
  expect(action()).toHaveFocus();
  expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
});

test('Shift+Tab back to the action keeps the panel open; Escape there closes once', async () => {
  const onOpenChange = vi.fn();
  render(<Page onOpenChange={onOpenChange} />);
  await userEvent.click(action());
  await until(() => expect(firstItem()).toHaveFocus());
  await userEvent.tab({ shift: true });
  expect(action()).toHaveFocus();
  expect(action()).toHaveAttribute('aria-expanded', 'true');
  onOpenChange.mockClear();
  await userEvent.keyboard('{Escape}');
  expect(action()).toHaveAttribute('aria-expanded', 'false');
  expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  expect(action()).toHaveFocus();
});

test('Shift+Tab back to the action, then Tab away from it, closes', async () => {
  render(
    <>
      <button type="button">Before</button>
      <Page />
    </>
  );
  await userEvent.click(action());
  await until(() => expect(firstItem()).toHaveFocus());
  await userEvent.tab({ shift: true });
  expect(action()).toHaveAttribute('aria-expanded', 'true');
  await userEvent.tab({ shift: true });
  expect(action()).toHaveAttribute('aria-expanded', 'false');
});

test('renderAction keeps its own ref and handlers', async () => {
  const ref = createRef<HTMLButtonElement>();
  const onKeyDown = vi.fn();
  const onClick = vi.fn();
  render(
    <Page
      renderAction={
        <button type="button" ref={ref} onKeyDown={onKeyDown} onClick={onClick}>
          Get help
        </button>
      }
    />
  );
  const trigger = screen.getByRole('button', { name: 'Get help' });
  expect(ref.current).toBe(trigger);
  await userEvent.click(trigger);
  expect(onClick).toHaveBeenCalledOnce();
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  trigger.focus();
  await userEvent.keyboard('{Escape}');
  expect(onKeyDown).toHaveBeenCalled();
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(trigger).toHaveFocus();
});

test('an external link closes and returns focus to the action', async () => {
  render(<Page />);
  const block = (event: MouseEvent) => event.preventDefault();
  document.addEventListener('click', block, true);
  try {
    await userEvent.click(action());
    await until(() => expect(firstItem()).toHaveFocus());
    await userEvent.click(screen.getByRole('link', { name: /Service status/ }));
    expect(action()).toHaveAttribute('aria-expanded', 'false');
    expect(action()).toHaveFocus();
  } finally {
    document.removeEventListener('click', block, true);
  }
});

test('a click outside closes; a click on the open action closes without reopening', async () => {
  render(<Page />);
  await userEvent.click(action());
  await userEvent.click(screen.getByRole('button', { name: 'After' }));
  expect(action()).toHaveAttribute('aria-expanded', 'false');
  await userEvent.click(action());
  expect(action()).toHaveAttribute('aria-expanded', 'true');
  await userEvent.click(action());
  expect(action()).toHaveAttribute('aria-expanded', 'false');
});

test('focus leaving the panel closes it', async () => {
  render(<Page />);
  await userEvent.click(action());
  await until(() => expect(firstItem()).toHaveFocus());
  screen.getByRole('link', { name: /Service status/ }).focus();
  await userEvent.tab();
  expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  expect(action()).toHaveAttribute('aria-expanded', 'false');
});

test('arrows move between items, skipping the divider', async () => {
  render(<Page />);
  await userEvent.click(action());
  await until(() => expect(firstItem()).toHaveFocus());
  await userEvent.keyboard('{ArrowDown}');
  expect(
    screen.getByRole('button', { name: 'Keyboard shortcuts' })
  ).toHaveFocus();
  await userEvent.keyboard('{ArrowDown}');
  expect(screen.getByRole('link', { name: /Service status/ })).toHaveFocus();
  await userEvent.keyboard('{ArrowUp}');
  expect(
    screen.getByRole('button', { name: 'Keyboard shortcuts' })
  ).toHaveFocus();
});

test('items: links, buttons, external attributes, divider', async () => {
  render(<Page defaultOpen />);
  expect(screen.getByRole('list', { name: 'Help links' })).toBeInTheDocument();
  expect(firstItem().tagName).toBe('A');
  expect(firstItem()).toHaveAttribute('href', '#docs');
  expect(firstItem()).not.toHaveAttribute('target');
  const shortcuts = screen.getByRole('button', { name: 'Keyboard shortcuts' });
  expect(shortcuts).toHaveAttribute('type', 'button');
  expect(shortcuts).toHaveAccessibleDescription('Keys for the ledger views');
  const external = screen.getByRole('link', {
    name: 'Service status (opens in a new tab)',
  });
  expect(external).toHaveAttribute('target', '_blank');
  expect(external).toHaveAttribute('rel', 'noopener noreferrer');
  expect(
    document.querySelectorAll('.cds--switcher__item--divider')
  ).toHaveLength(1);
});

test('an action item runs onSelect, closes and returns focus', async () => {
  onShortcuts.mockClear();
  render(<Page />);
  await userEvent.click(action());
  await until(() => expect(firstItem()).toHaveFocus());
  await userEvent.keyboard('{ArrowDown}{Enter}');
  expect(onShortcuts).toHaveBeenCalledOnce();
  expect(action()).toHaveAttribute('aria-expanded', 'false');
  expect(action()).toHaveFocus();
});

test('a link item that navigates closes without moving focus back', async () => {
  render(<Page />);
  await userEvent.click(action());
  await until(() => expect(firstItem()).toHaveFocus());
  await userEvent.keyboard('{Enter}');
  expect(action()).toHaveAttribute('aria-expanded', 'false');
  expect(action()).not.toHaveFocus();
});

test('controlled: follows open and reports changes', async () => {
  const onOpenChange = vi.fn();
  function Controlled() {
    const [open, setOpen] = useState(true);
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
  expect(action()).toHaveAttribute('aria-expanded', 'true');
  firstItem().focus();
  await userEvent.keyboard('{Escape}');
  expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  expect(action()).toHaveAttribute('aria-expanded', 'false');
  cleanup();
  // A parent that ignores onOpenChange keeps the panel as it is.
  // Until the parent renders, a repeated request is not reported again.
  const ignored = vi.fn();
  render(<Page open onOpenChange={ignored} />);
  firstItem().focus();
  await userEvent.keyboard('{Escape}');
  expect(action()).toHaveAttribute('aria-expanded', 'true');
  firstItem().focus();
  await userEvent.keyboard('{Escape}');
  expect(ignored).toHaveBeenCalledExactlyOnceWith(false);
});

test('controlled: a fast double click reports one change per click', () => {
  const ignored = vi.fn();
  render(<Page open={false} onOpenChange={ignored} />);
  // Two clicks in one task: no render in between.
  action().click();
  action().click();
  expect(ignored.mock.calls).toEqual([[true], [false]]);
  cleanup();
  const opened = vi.fn();
  render(<Page open={false} onOpenChange={opened} />);
  action().click();
  action().dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
  );
  action().dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
  );
  expect(opened.mock.calls).toEqual([[true], [false]]);
});

test('focus is not obscured by the fixed header', async () => {
  render(<Page />);
  await userEvent.click(action());
  await until(() => expect(firstItem()).toHaveFocus());
  await settleAnimations();
  const box = firstItem().getBoundingClientRect();
  const hit = document.elementFromPoint(
    box.left + box.width / 2,
    box.top + box.height / 2
  );
  expect(firstItem().contains(hit)).toBe(true);
});

test('messages replace every English string', () => {
  render(
    <Page
      defaultOpen
      messages={{
        label: 'X-help',
        panelLabel: 'X-links',
        opensInNewTab: 'X-new-tab',
      }}
    />
  );
  expect(
    screen.getByLabelText('X-help', { selector: 'button' })
  ).toBeInTheDocument();
  expect(screen.getByRole('list', { name: 'X-links' })).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: 'Service status X-new-tab' })
  ).toBeInTheDocument();
});

test('content mode renders only the list and leaves Escape to its container', async () => {
  const onKeyDown = vi.fn();
  render(
    <AfframeProvider>
      <div onKeyDown={(event) => onKeyDown(event.key)}>
        <HelpMenu items={items} presentation="content" defaultOpen={false} />
      </div>
    </AfframeProvider>
  );
  expect(screen.queryByRole('button', { name: 'Help' })).toBeNull();
  expect(document.querySelector('[aria-expanded]')).toBeNull();
  expect(document.querySelector('.cds--header-panel')).toBeNull();
  const docs = screen.getByRole('link', { name: 'Documentation' });
  await userEvent.tab();
  expect(docs).toHaveFocus();
  await userEvent.keyboard('{ArrowDown}');
  const shortcuts = screen.getByRole('button', { name: /Keyboard shortcuts/ });
  expect(shortcuts).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  expect(onKeyDown).toHaveBeenLastCalledWith('Escape');
  onShortcuts.mockClear();
  await userEvent.keyboard('{Enter}');
  expect(onShortcuts).toHaveBeenCalledOnce();
  // Selecting keeps the list: closing is the container's job.
  expect(shortcuts).toBeInTheDocument();
  expect(shortcuts).toHaveFocus();
});
