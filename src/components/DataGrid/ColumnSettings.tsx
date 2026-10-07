'use client';
// Toolbar popover that shows, hides and reorders columns.
import { ArrowDown, ArrowUp, Column as ColumnIcon } from '@carbon/icons-react';
import { Checkbox, IconButton, Popover, PopoverContent } from '@carbon/react';
import type {
  Column,
  ReactTable,
  RowData,
  StockFeatures,
} from '@tanstack/react-table';
import { useEffect, useId, useRef, useState } from 'react';
import type { DataGridMessages } from './messages.js';

interface ColumnSettingsProps<TData extends RowData> {
  table: ReactTable<StockFeatures, TData>;
  text: DataGridMessages;
  label: (column: Column<StockFeatures, TData>) => string;
}

export function ColumnSettings<TData extends RowData>({
  table,
  text,
  label,
}: ColumnSettingsProps<TData>) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const popover = useRef<HTMLSpanElement>(null);
  const columns = table.getAllLeafColumns();
  const ordering = 'columnOrderingFeature' in table._features;
  // Focus follows a moved column's button; at the first or last place, where
  // that button turns disabled, it goes to the other one.
  // A new object per move, so a repeated move to the same button refocuses.
  const [focusTarget, setFocusTarget] = useState<{ id: string }>();
  useEffect(() => {
    if (focusTarget) document.getElementById(focusTarget.id)?.focus();
  }, [focusTarget]);
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  const move = (index: number, by: -1 | 1) => {
    const order = columns.map((column) => column.id);
    const [moved] = order.splice(index, 1);
    if (moved === undefined) return;
    const to = index + by;
    order.splice(to, 0, moved);
    table.setColumnOrder(order);
    const edge = to === 0 || to === order.length - 1;
    const up = edge ? by === 1 : by === -1;
    setFocusTarget({ id: `${id}-${moved}-${up ? 'up' : 'down'}` });
  };

  return (
    <Popover
      open={open}
      align="bottom-end"
      isTabTip
      ref={popover}
      // Moving a column moves its row and blurs the focused button; Carbon
      // reads that as focus leaving. Close only if focus is still outside
      // once the move has refocused the button.
      onRequestClose={() =>
        setTimeout(() => {
          if (!popover.current?.contains(document.activeElement))
            setOpen(false);
        })
      }
      // Capture: the focused icon button's tooltip stops Escape from bubbling.
      onKeyDownCapture={(event) => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          close();
        }
      }}>
      <IconButton
        ref={trigger}
        kind="ghost"
        label={text.columnSettings}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}>
        <ColumnIcon />
      </IconButton>
      <PopoverContent id={id} className="afframe-data-grid__columns">
        <fieldset>
          <legend className="cds--label">{text.columnSettingsLegend}</legend>
          {columns.map((column, index) => (
            <div key={column.id} className="afframe-data-grid__column">
              <Checkbox
                id={`${id}-${column.id}`}
                labelText={label(column)}
                checked={column.getIsVisible()}
                disabled={!column.getCanHide()}
                onChange={(_event, { checked }) =>
                  column.toggleVisibility(checked)
                }
              />
              {ordering && (
                <>
                  <IconButton
                    id={`${id}-${column.id}-up`}
                    kind="ghost"
                    size="sm"
                    label={text.moveColumnUp(label(column))}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}>
                    <ArrowUp />
                  </IconButton>
                  <IconButton
                    id={`${id}-${column.id}-down`}
                    kind="ghost"
                    size="sm"
                    label={text.moveColumnDown(label(column))}
                    disabled={index === columns.length - 1}
                    onClick={() => move(index, 1)}>
                    <ArrowDown />
                  </IconButton>
                </>
              )}
            </div>
          ))}
        </fieldset>
      </PopoverContent>
    </Popover>
  );
}
