// Example data shared by stories, in the shape Carbon's list stories use.
// Upstream lists keep one disabled item and one long label; so does this one.

export const paymentTermItems: {
  id: string;
  text: string;
  disabled?: boolean;
}[] = [
  { id: 'due-on-receipt', text: 'Due on receipt' },
  { id: 'net-7', text: 'Net 7' },
  { id: 'net-14', text: 'Net 14' },
  { id: 'net-30', text: 'Net 30' },
  { id: 'net-45', text: 'Net 45', disabled: true },
  { id: 'net-60', text: 'Net 60' },
  { id: 'end-of-month', text: 'End of month' },
  {
    id: 'net-30-early-discount',
    text: 'Net 30, with a 2% discount when paid within 10 days of the invoice date',
  },
];
