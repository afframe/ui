import { render, screen, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { DescriptionList, DescriptionListItem } from './DescriptionList.js';

const items = [
  { term: 'Invoice', description: 'FV-2026-0042' },
  { term: 'Issued', description: '7 Oct 2026' },
  { term: 'Note', description: null },
];

test('renders on the server', () => {
  const html = renderToStaticMarkup(
    <DescriptionList aria-label="Invoice details" items={items} />
  );
  expect(html).toContain('role="table"');
  expect(html).toContain('aria-label="Invoice details"');
  expect(html).toContain('FV-2026-0042');
});

test('items and composition produce the same markup', () => {
  const fromItems = renderToStaticMarkup(
    <DescriptionList aria-label="Invoice details" items={items} />
  );
  const composed = renderToStaticMarkup(
    <DescriptionList aria-label="Invoice details">
      <DescriptionListItem term="Invoice">FV-2026-0042</DescriptionListItem>
      <DescriptionListItem term="Issued">7 Oct 2026</DescriptionListItem>
      <DescriptionListItem term="Note">{null}</DescriptionListItem>
    </DescriptionList>
  );
  expect(composed).toBe(fromItems);
});

test('each description has its term as the row header', () => {
  render(<DescriptionList aria-label="Invoice details" items={items} />);
  const table = screen.getByRole('table', { name: 'Invoice details' });
  const rows = within(table).getAllByRole('row');
  expect(rows).toHaveLength(items.length);
  rows.forEach((row, index) => {
    const header = within(row).getByRole('rowheader');
    expect(header).toHaveTextContent(String(items[index]?.term));
    const cells = within(row).getAllByRole('cell');
    expect(cells).toHaveLength(1);
    expect(header.nextElementSibling).toBe(cells[0]);
  });
});

test('an empty description shows a glyph and hidden text, never an empty cell', () => {
  render(
    <DescriptionList
      aria-label="Details"
      items={[
        { term: 'A', description: undefined },
        { term: 'B', description: '' },
        { term: 'C', description: 0 },
      ]}
      messages={{ emptyValue: 'Not set' }}
    />
  );
  const cells = screen.getAllByRole('cell');
  for (const cell of cells.slice(0, 2)) {
    expect(cell).toHaveTextContent('Not set');
    expect(within(cell).getByText('Not set')).toHaveClass(
      'afframe-description-list-empty-text'
    );
    const hidden = within(cell).getByText('Not set').getBoundingClientRect();
    expect(hidden.width * hidden.height).toBeLessThanOrEqual(1);
    const glyph = cell.querySelector('.afframe-description-list-empty');
    expect(glyph).toHaveAttribute('aria-hidden', 'true');
    expect(glyph).not.toBeNull();
    if (glyph) {
      expect(getComputedStyle(glyph, '::before').content).not.toBe('none');
    }
  }
  expect(cells[2]).toHaveTextContent('0');
});

test('the default empty text is "No value"', () => {
  render(<DescriptionList aria-label="Details" items={items.slice(2)} />);
  expect(screen.getByRole('cell')).toHaveTextContent('No value');
});

test('aria-labelledby names the list without a stray aria-label', () => {
  render(
    <>
      <h2 id="heading">Supplier</h2>
      <DescriptionList aria-labelledby="heading" items={items} />
    </>
  );
  expect(screen.getByRole('table', { name: 'Supplier' })).toBeVisible();
  expect(screen.getByRole('table').getAttribute('aria-label') ?? '').toBe('');
});

test('every size and orientation renders', () => {
  for (const size of ['xs', 'sm', 'md', 'lg'] as const) {
    for (const orientation of ['horizontal', 'vertical'] as const) {
      const { container, unmount } = render(
        <DescriptionList
          aria-label="Details"
          items={items}
          size={size}
          orientation={orientation}
          border
        />
      );
      const list = container.querySelector('.afframe-description-list');
      expect(list).toHaveClass(
        `afframe-description-list-${size}`,
        `afframe-description-list-${orientation}`,
        'afframe-description-list-border'
      );
      const [term, description] = container.querySelectorAll(
        '.afframe-description-list-row:first-child > *'
      );
      if (!term || !description) throw new Error('missing cells');
      const termBox = term.getBoundingClientRect();
      const descriptionBox = description.getBoundingClientRect();
      if (orientation === 'vertical') {
        expect(descriptionBox.top).toBeGreaterThanOrEqual(termBox.bottom - 1);
      } else {
        expect(descriptionBox.left).toBeGreaterThanOrEqual(termBox.right - 1);
      }
      unmount();
    }
  }
});

test('is static: nothing is focusable', () => {
  const { container } = render(
    <DescriptionList aria-label="Details" items={items} />
  );
  expect(container.querySelector('[tabindex], button, a, input')).toBeNull();
});

test('an item outside the direct children still shows the default empty text', () => {
  render(
    <DescriptionList aria-label="Details">
      <>
        <DescriptionListItem term="Note">{null}</DescriptionListItem>
      </>
    </DescriptionList>
  );
  expect(screen.getByRole('cell')).toHaveTextContent('No value');
});
