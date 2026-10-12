import {
  MenuItem,
  MenuItemDivider,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
} from '@carbon/react';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import {
  failOnConsoleError,
  iconButton,
  runSecondItem,
} from '../MenuParts/menuTestUtils.js';
import { AfframeProvider } from '../../provider/index.js';
import { TableToolbarMenu } from './TableToolbarMenu.js';

failOnConsoleError();

function Toolbar({ children }: { children: ReactNode }) {
  return (
    <AfframeProvider>
      <TableToolbar aria-label="Table toolbar">
        <TableToolbarContent>{children}</TableToolbarContent>
      </TableToolbar>
    </AfframeProvider>
  );
}

test('1.0.1 shape: label and MenuItem children with a divider work by keyboard', async () => {
  const onExport = vi.fn();
  const label = { label: 'Table settings' };
  render(
    <Toolbar>
      <TableToolbarMenu {...label}>
        <MenuItem label="Refresh" />
        <MenuItemDivider />
        <MenuItem label="Export" onClick={onExport} />
      </TableToolbarMenu>
    </Toolbar>
  );
  await runSecondItem(iconButton('Table settings'), 'Export');
  expect(onExport).toHaveBeenCalledOnce();
});

test('v11 shape: TableToolbarAction children work by keyboard', async () => {
  const onExport = vi.fn();
  render(
    <Toolbar>
      <TableToolbarMenu iconDescription="Table settings">
        <TableToolbarAction onClick={() => undefined}>
          Refresh
        </TableToolbarAction>
        <TableToolbarAction onClick={onExport}>Export</TableToolbarAction>
      </TableToolbarMenu>
    </Toolbar>
  );
  await runSecondItem(iconButton('Table settings'), 'Export');
  expect(onExport).toHaveBeenCalledOnce();
});

test('label with TableToolbarAction children takes the newer menu and works by keyboard', async () => {
  const onExport = vi.fn();
  render(
    <Toolbar>
      <TableToolbarMenu label="Table settings">
        <TableToolbarAction onClick={() => undefined}>
          Refresh
        </TableToolbarAction>
        <TableToolbarAction onClick={onExport}>Export</TableToolbarAction>
      </TableToolbarMenu>
    </Toolbar>
  );
  const trigger = iconButton('Table settings');
  await userEvent.click(trigger);
  expect(await screen.findByRole('menu')).toHaveClass('cds--menu');
  await userEvent.keyboard('{Escape}');
  await runSecondItem(trigger, 'Export');
  expect(onExport).toHaveBeenCalledOnce();
});
