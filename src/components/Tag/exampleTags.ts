// Tag labels for the Tag, TagSet and TagOverflow stories: statuses, tags,
// payment terms and customers from the story glossary.

export const longTagLabel = 'Disputed by the customer, credit note pending';

export const tagLabels = [
  'Paid',
  'Overdue',
  'Draft',
  'Sent',
  'Recurring',
  'Disputed',
  'Key customer',
  'Export',
  'VAT exempt',
  'Net 30',
  'Due on receipt',
  'End of month',
  'Net 7',
  'Net 14',
  'Net 60',
  'Lakeside Furniture',
  'Acme Trading',
  'Birch Studio',
  'Cedar Logistics',
  'Delta Foods',
] as const;

export const overdueInvoices = [
  'INV-2026-0038',
  'INV-2026-0039',
  'INV-2026-0040',
  'INV-2026-0041',
  'INV-2026-0042',
];

export const customers = tagLabels.slice(15);
