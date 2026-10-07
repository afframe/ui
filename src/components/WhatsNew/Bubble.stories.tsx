/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, icons from @afframe/ui icons, commented-out imports dropped, the examples typed as a non-empty list and the current example read once (the index type allows undefined), story styles converted from SCSS to plain CSS, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useRef, useState, type ComponentProps } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { Add, Close, Moon, Notification, WaveDirection } from '../../icons.js';
import { Bubble, BubbleHeader, Button } from '../../index.js';
import mdx from './WhatsNew.mdx';
import './whats-new-story.css';

export default {
  title: 'Patterns/WhatsNew',
  component: Bubble,
  tags: ['labs'],
  subcomponents: {
    BubbleHeader,
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Bubble>;

/**
 * Bubble component story for WhatsNew
 */
export const BubbleStory: StoryFn<typeof Bubble> = () => {
  /* ************************************* */
  // INTERNAL STATE
  const [shouldShowBubble, setShouldShowBubble] = useState(false);
  const [currentTextExampleIndex, setCurrentTextExampleIndex] = useState(0);
  /* ************************************* */
  // REFS
  const bodyRef = useRef<HTMLDivElement>(null);
  /* ************************************* */

  /* ************************************* */
  // CONSTANTS
  type TextExample = {
    target: string;
    text: string;
    align: ComponentProps<typeof Bubble>['align'];
  };
  const textExamples: [TextExample, ...TextExample[]] = [
    {
      target: '#ExampleTarget1',
      text: 'text 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas consequat, nulla in laoreet molestie, metus lectus eleifend sem, eu malesuada ipsum arcu nec turpis.',
      align: 'bottom-start',
    },
    {
      target: '#ExampleTarget2',
      text: 'text 2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas consequat, nulla in laoreet molestie, metus lectus eleifend sem, eu malesuada ipsum arcu nec turpis.',
      align: 'bottom-end',
    },
    {
      target: '#ExampleTarget3',
      text: 'text 3 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas consequat, nulla in laoreet molestie, metus lectus eleifend sem, eu malesuada ipsum arcu nec turpis.',
      align: 'right-start',
    },
    {
      target: '#ExampleTarget4',
      text: 'text 4 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas consequat, nulla in laoreet molestie, metus lectus eleifend sem, eu malesuada ipsum arcu nec turpis.',
      align: 'top-end',
    },
  ];
  const currentExample =
    textExamples[currentTextExampleIndex] ?? textExamples[0];
  /* ************************************* */

  /* ************************************* */
  // CALL BACKS
  /* ************************************* */

  /* ************************************* */
  // EFFECTS
  /* ************************************* */

  return (
    <div ref={bodyRef} className="storyBody">
      <div className="controlHeader">
        <Button onClick={() => setShouldShowBubble((prev) => !prev)}>
          Toggle Bubble
        </Button>
        <Button
          disabled={!shouldShowBubble}
          onClick={() =>
            setCurrentTextExampleIndex((prev) =>
              prev + 1 < textExamples.length ? prev + 1 : 0
            )
          }>
          Move bubble
        </Button>
        <Button
          id="ExampleTarget1"
          renderIcon={Notification}
          iconDescription="Example icon button"
          hasIconOnly
        />
        <div className="iconBtnRight">
          <Button
            id="ExampleTarget2"
            renderIcon={Add}
            iconDescription="Example icon button 2"
            hasIconOnly
          />
        </div>
      </div>
      <Bubble
        highContrast
        align={currentExample.align}
        open={shouldShowBubble}
        target={currentExample.target}>
        <BubbleHeader>
          <Button
            kind="ghost"
            size="sm"
            renderIcon={Close}
            iconDescription="Close"
            hasIconOnly
            onClick={() => {
              setShouldShowBubble(false);
            }}
          />
        </BubbleHeader>
        <p className="BubbleExampleContent">{currentExample.text}</p>
      </Bubble>
      <div className="iconBtnBody">
        <Button
          id="ExampleTarget3"
          renderIcon={WaveDirection}
          iconDescription="Example icon button 3"
          hasIconOnly
        />
      </div>
      <div className="iconBtnRightBottom">
        <Button
          id="ExampleTarget4"
          renderIcon={Moon}
          iconDescription="Example icon button 4"
          hasIconOnly
        />
      </div>
    </div>
  );
};
BubbleStory.storyName = 'Bubble';
