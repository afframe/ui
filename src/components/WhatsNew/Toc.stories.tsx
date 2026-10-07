/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, commented-out imports and argTypes dropped, tabIndex on the scrollable TocSections, the listitem a11y rule disabled (the Labs TocList renders li elements in a nav), story styles converted from SCSS to plain CSS, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useRef } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { Toc, TocItem, TocList, TocSection, TocSections } from '../../index.js';
import mdx from './WhatsNew.mdx';
import './whats-new-story.css';

export default {
  component: Toc,
  title: 'Patterns/WhatsNew',
  tags: ['labs'],
  subcomponents: {
    TocList,
    TocItem,
    TocSections,
    TocSection,
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Toc>;

/**
 * Toc component story for WhatsNew
 */
export const TocStory: StoryFn<typeof Toc> = () => {
  /* ************************************* */
  // INTERNAL STATE
  /* ************************************* */
  // REFS
  const bodyRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<unknown>(null);
  /* ************************************* */

  /* ************************************* */
  // CONSTANTS
  const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et felis vitae dui iaculis condimentum ut at dui. Sed quis enim vulputate sem dignissim sagittis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus bibendum scelerisque semper. Curabitur nec consectetur lacus, fringilla dignissim quam. Curabitur a venenatis ante. Aliquam varius egestas dolor. Etiam interdum, massa eget viverra cursus, mi velit blandit ligula, a vestibulum arcu risus at quam. Vivamus et magna sodales, tincidunt nisl a, interdum sapien. Vivamus convallis malesuada elit. Maecenas lacinia imperdiet metus sed semper. Proin sodales viverra convallis.

Praesent nec dapibus est. Mauris venenatis nulla id felis cursus tempor. Aenean bibendum id nisi ut mollis. Aliquam erat volutpat. Nullam egestas, tellus id bibendum iaculis, sem dui tincidunt arcu, eu laoreet nibh dolor vitae dui. Maecenas sodales mollis hendrerit. Integer pharetra fermentum lacus quis sollicitudin. Fusce consequat vitae velit a bibendum. Suspendisse diam ex, pulvinar a dictum ultrices, scelerisque ac erat. Sed lectus urna, imperdiet at turpis at, placerat laoreet arcu. Sed tortor nisl, pulvinar lobortis augue in, aliquet cursus nisi.`;
  /* ************************************* */

  /* ************************************* */
  // CALL BACKS
  /* ************************************* */

  /* ************************************* */
  // EFFECTS
  /* ************************************* */

  return (
    <div ref={bodyRef} className="storyBody">
      <Toc ref={tocRef}>
        <div className="TocExampleLayout">
          <TocList>
            <TocItem>Section 1 marker</TocItem>
            <TocItem>Section 2 marker</TocItem>
            <TocItem>Section 3 marker</TocItem>
          </TocList>
          <div className="TocExampleContentColumn">
            <TocSections tabIndex={0}>
              <TocSection as="div">
                <h1>Section 1 (div element)</h1>
                <p>{longText}</p>
              </TocSection>
              <TocSection as="section">
                <h1>Section 2 (section element)</h1>
                <p>{longText}</p>
              </TocSection>
              <TocSection as="article">
                <h1>Section 3 - (article element)</h1>
                <p>{longText}</p>
              </TocSection>
            </TocSections>
          </div>
        </div>
      </Toc>
    </div>
  );
};
TocStory.storyName = 'Table of contents';
// The Labs TocList renders its TocItem li elements inside a nav, not a list.
TocStory.parameters = {
  a11y: { config: { rules: [{ id: 'listitem', enabled: false }] } },
};
