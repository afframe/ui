import { AnchorMdx } from '@storybook/addon-docs/blocks';
import type { ReactNode } from 'react';

// Shared parts of the chooser tables on docs pages. AnchorMdx turns `?path=`
// links into manager navigation, as links written in MDX are.

/** A component name linking to its docs page, by Storybook docs id. */
export function docsLink(name: string, id: string) {
  return (
    <AnchorMdx key={name} href={`?path=/docs/${id}--overview`}>
      <code>{name}</code>
    </AnchorMdx>
  );
}

/** A static table; a cell given as an array renders its parts in a row. */
export function ChooserTable({
  caption,
  head,
  rows,
}: {
  caption?: string;
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {head.map((cell) => (
            <th key={cell}>{cell}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
