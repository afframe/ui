// Fixed sample data for the data grid stories and tests.
export interface Invoice {
  id: string;
  number: string;
  customer: string;
  status: 'Paid' | 'Open' | 'Overdue';
  amount: number;
  issued: string;
  /** Credit notes of an invoice, shown as nested rows. */
  lines?: Invoice[];
}

const customers = [
  'Alder Studio',
  'Birch Logistics',
  'Cedar Foods',
  'Dogwood Media',
  'Elm Engineering',
  'Fir Consulting',
] as const;
const statuses = ['Paid', 'Open', 'Overdue'] as const;

/** 60 invoices; values follow from the index, so every run is the same. */
export const invoices: Invoice[] = Array.from({ length: 60 }, (_, i) => ({
  id: `inv-${i + 1}`,
  number: `2026-${String(i + 1).padStart(4, '0')}`,
  customer: customers[(i * 5) % customers.length] ?? customers[0],
  status: statuses[(i * 7) % statuses.length] ?? statuses[0],
  amount: ((i * 7919) % 50000) + 1000,
  issued: `2026-${String((i % 9) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`,
}));

/** Four invoices with two credit notes each, for nested rows. */
export const nestedInvoices: Invoice[] = invoices
  .slice(0, 4)
  .map((invoice, i) => ({
    ...invoice,
    lines: invoices.slice(40 + i * 2, 42 + i * 2).map((line) => ({
      ...line,
      id: `${invoice.id}-${line.id}`,
      number: `CN-${line.number}`,
      amount: -Math.round(line.amount / 10),
    })),
  }));

/** 1,000 invoices for virtualization, from the same rule as `invoices`. */
export const manyInvoices: Invoice[] = Array.from({ length: 1000 }, (_, i) => {
  const base = invoices[i % invoices.length] ?? invoices[0];
  return {
    ...(base as Invoice),
    id: `inv-${i + 1}`,
    number: `2026-${String(i + 1).padStart(4, '0')}`,
  };
});
