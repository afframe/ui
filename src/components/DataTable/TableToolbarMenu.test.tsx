import {
  MenuItem,
  MenuItemDivider,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
} from '@carbon/react';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { expect, test, vi } from 'vitest';
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
