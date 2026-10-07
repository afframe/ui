'use client';
// Resize handle of a header: drag with a pointer, or focus it and use the
// arrow keys (a focusable separator, as in the WAI-ARIA window splitter).
import type {
  Header,
  ReactTable,
  RowData,
  StockFeatures,
} from '@tanstack/react-table';

const step = 16;
const minimum = 48;
const maximum = 1200;

interface ColumnResizerProps<TData extends RowData> {
  header: Header<StockFeatures, TData, unknown>;
  label: string;
}

export function ColumnResizer<TData extends RowData>({
  header,
  label,
}: ColumnResizerProps<TData>) {
  const { column } = header;
  const table = header.getContext().table as unknown as ReactTable<
    StockFeatures,
    TData
  >;
  const size = column.getSize();
  // TanStack fills in 20 and MAX_SAFE_INTEGER; keep a usable range.
  const min = Math.max(minimum, column.columnDef.minSize ?? 0);
  const max = Math.min(maximum, column.columnDef.maxSize ?? maximum);
  const setSize = (next: number) =>
    table.setColumnSizing((sizes) => ({
      ...sizes,
      [column.id]: Math.min(max, Math.max(min, next)),
    }));
  const resize = header.getResizeHandler();

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={size}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      className={[
        'afframe-data-grid__resizer',
        column.getIsResizing() && 'afframe-data-grid__resizer--active',
      ]
        .filter(Boolean)
        .join(' ')}
      onMouseDown={resize}
      onTouchStart={resize}
      onClick={(event) => event.stopPropagation()}
      onDoubleClick={() => column.resetSize()}
      onKeyDown={(event) => {
        const by = { ArrowLeft: -step, ArrowRight: step }[event.key];
        if (by !== undefined) setSize(size + by);
        else if (event.key === 'Home') setSize(min);
        else if (event.key === 'End') setSize(max);
        else return;
        event.preventDefault();
      }}
    />
  );
}
