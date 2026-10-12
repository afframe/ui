import { MenuItem, MenuItemDivider, OverflowMenuItem } from '@carbon/react';
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import {
  failOnConsoleError,
  iconButton,
  runSecondItem,
} from '../MenuParts/menuTestUtils.js';
import { AfframeProvider } from '../../provider/index.js';
import { OverflowMenu } from './OverflowMenu.js';

failOnConsoleError();

test('v11 items: iconDescription names the trigger, aria-label the menu, the keyboard runs an item', async () => {
  const onRename = vi.fn();
  render(
    <AfframeProvider>
      <OverflowMenu iconDescription="Row actions" aria-label="Row menu">
        <OverflowMenuItem itemText="Edit" />
        <OverflowMenuItem itemText="Rename" onClick={onRename} />
      </OverflowMenu>
    </AfframeProvider>
  );
  const trigger = iconButton('Row actions');
  trigger.focus();
  await userEvent.keyboard('{Enter}');
  expect(await screen.findByRole('menu', { name: 'Row menu' })).toBeVisible();
  await userEvent.keyboard('{Escape}');
  await runSecondItem(trigger, 'Rename');
  expect(onRename).toHaveBeenCalledOnce();
});

test('label={undefined} with OverflowMenuItem children stays on the v11 menu', async () => {
  const onRename = vi.fn();
  // As a JavaScript caller or a project without exactOptionalPropertyTypes passes it.
  const noLabel = { label: undefined } as object;
  render(
    <AfframeProvider>
      <OverflowMenu {...noLabel} iconDescription="Row actions">
        <OverflowMenuItem itemText="Edit" />
        <OverflowMenuItem itemText="Rename" onClick={onRename} />
      </OverflowMenu>
    </AfframeProvider>
  );
  const trigger = iconButton('Row actions');
  trigger.focus();
  await userEvent.keyboard('{Enter}');
  expect(await screen.findByRole('menu')).toHaveClass(
    'cds--overflow-menu-options'
  );
  await userEvent.keyboard('{Escape}');
  await runSecondItem(trigger, 'Rename');
  expect(onRename).toHaveBeenCalledOnce();
});

test('1.0.1 shape: label through a spread and MenuItem children name the trigger and work by keyboard', async () => {
  const onDelete = vi.fn();
  const label = { label: 'Row actions' };
  render(
    <AfframeProvider>
      <OverflowMenu {...label} menuAlignment="bottom-end">
        <MenuItem label="Edit" />
        <MenuItemDivider />
        <MenuItem label="Delete" onClick={onDelete} />
      </OverflowMenu>
    </AfframeProvider>
  );
  await runSecondItem(iconButton('Row actions'), 'Delete');
  expect(onDelete).toHaveBeenCalledOnce();
});

test('MenuItem children without a label take the newer menu too', async () => {
  const onDelete = vi.fn();
  render(
    <AfframeProvider>
      <OverflowMenu>
        <>
          <MenuItem label="Edit" />
          <MenuItem label="Delete" onClick={onDelete} />
        </>
      </OverflowMenu>
    </AfframeProvider>
  );
  await runSecondItem(iconButton('Options'), 'Delete');
  expect(onDelete).toHaveBeenCalledOnce();
});

test('menuAlignment with MenuItem children takes the newer menu', async () => {
  const onDelete = vi.fn();
  render(
    <AfframeProvider>
      <OverflowMenu menuAlignment="top-end">
        <MenuItem label="Edit" />
        <MenuItem label="Delete" onClick={onDelete} />
      </OverflowMenu>
    </AfframeProvider>
  );
  const trigger = iconButton('Options');
  await userEvent.click(trigger);
  expect(await screen.findByRole('menu')).toHaveClass('cds--menu');
  await userEvent.keyboard('{Escape}');
  await runSecondItem(trigger, 'Delete');
  expect(onDelete).toHaveBeenCalledOnce();
});

test('the newer menu keeps the v11 look: no v12 menu border', async () => {
  render(
    <AfframeProvider>
      <OverflowMenu label="Row actions">
        <MenuItem label="Edit" />
      </OverflowMenu>
    </AfframeProvider>
  );
  await userEvent.click(iconButton('Row actions'));
  const menu = await screen.findByRole('menu');
  expect(menu).not.toHaveClass('cds--menu--border');
});
