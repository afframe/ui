import { Tag } from '../src/index.js';

// Where a component comes from, shown under the title of its docs page. The
// stories file carries the same name as a Storybook tag for the sidebar filter.
const sources = {
  carbon: { label: 'Carbon', type: 'blue' },
  'ibm-products': { label: 'IBM Products', type: 'purple' },
  labs: { label: 'Carbon Labs', type: 'teal' },
  extras: { label: 'Extras', type: 'cyan' },
  afframe: { label: 'Afframe', type: 'green' },
} as const;

export function SourceLabel({ name }: { name: keyof typeof sources }) {
  const { label, type } = sources[name];
  return (
    <Tag type={type} size="sm">
      Source: {label}
    </Tag>
  );
}
