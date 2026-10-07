/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Toggletip parts, Button and Link from @afframe/ui, icons from @afframe/ui/icons, `story` decorators moved to `decorators`, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useRef, useEffect } from 'react';
import type { CSSProperties } from 'react';
import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { Information } from '../../icons.js';
import {
  Button,
  Link,
  ToggletipLabel,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
  ToggletipActions,
} from '../../index.js';
import type { ToggletipProps } from '../../index.js';
import mdx from './Toggletip.mdx';

type ToggletipStoryArgs = Partial<ToggletipProps<'span'>> & {
  alignDeprecated?: ToggletipProps<'span'>['align'];
  bodyText?: string;
  buttonLabel?: string;
  buttonText?: string;
  labelText?: string;
  linkText?: string;
};

const alignOptions = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end',
];

const deprecatedAlignOptions = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'left-bottom',
  'left-top',
  'right-bottom',
  'right-top',
];

const defaultArgs: ToggletipStoryArgs = {
  align: 'bottom',
  alignmentAxisOffset: 0,
  autoAlign: true,
  bodyText:
    'Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed do eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.',
  buttonLabel: 'Show information',
  buttonText: 'Button',
  defaultOpen: false,
  labelText: 'Toggletip label',
  linkText: 'Link action',
};

const argTypes: Partial<ArgTypes<ToggletipStoryArgs>> = {
  align: {
    options: alignOptions,
    control: 'select',
  },
  alignDeprecated: {
    name: 'align (deprecated)',
    options: deprecatedAlignOptions,
    control: 'select',
    table: {
      category: 'Deprecated',
    },
  },
  alignmentAxisOffset: {
    control: 'number',
    if: { arg: 'autoAlign', eq: true },
  },
  autoAlign: {
    control: 'boolean',
  },
  bodyText: {
    control: 'text',
    table: {
      category: 'ToggletipContent',
    },
  },
  buttonLabel: {
    control: 'text',
    table: {
      category: 'ToggletipButton',
    },
  },
  buttonText: {
    control: 'text',
    table: {
      category: 'ToggletipActions',
    },
  },
  defaultOpen: {
    control: 'boolean',
  },
  labelText: {
    control: 'text',
    table: {
      category: 'ToggletipLabel',
    },
  },
  linkText: {
    control: 'text',
    table: {
      category: 'ToggletipActions',
    },
  },
};

const experimentalArgTypes: Partial<ArgTypes<ToggletipStoryArgs>> = {
  ...argTypes,
  autoAlign: {
    ...argTypes.autoAlign,
    table: { readonly: true },
  },
  defaultOpen: {
    ...argTypes.defaultOpen,
    table: { readonly: true },
  },
};

const autoAlignStoryContainerStyle: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  width: '200vw',
  minWidth: '1200px',
  height: '200vh',
  minHeight: '1200px',
};

export default {
  title: 'Components/Toggletip',
  tags: ['carbon'],
  component: Toggletip,
  subcomponents: {
    ToggletipLabel,
    ToggletipButton,
    ToggletipContent,
    ToggletipActions,
  },
  parameters: {
    controls: {
      include: Object.keys(argTypes),
    },
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<ToggletipStoryArgs>;

// Note: autoAlign is used here only to make tooltips visible in StackBlitz,
// autoAlign is in preview and not part of the actual implementation.
export const Default: StoryFn<ToggletipStoryArgs> = (args) => {
  const {
    align,
    alignDeprecated,
    bodyText,
    buttonLabel,
    buttonText,
    defaultOpen,
    labelText,
    linkText,
    ...rest
  } = args;
  const resolvedAlign = alignDeprecated || align;
  return (
    <>
      <ToggletipLabel>{labelText}</ToggletipLabel>
      <Toggletip
        key={defaultOpen ? 'open' : 'closed'}
        {...(resolvedAlign ? { align: resolvedAlign } : {})}
        defaultOpen={defaultOpen ?? false}
        {...rest}>
        <ToggletipButton label={buttonLabel}>
          <Information />
        </ToggletipButton>
        <ToggletipContent>
          <p>{bodyText}</p>
          <ToggletipActions>
            <Link href="#">{linkText}</Link>
            <Button size="sm">{buttonText}</Button>
          </ToggletipActions>
        </ToggletipContent>
      </Toggletip>
    </>
  );
};

Default.args = defaultArgs;
Default.argTypes = argTypes;

// Upstream sets this on the removed `story` annotation; Storybook reads `decorators`.
Default.decorators = [
  (story) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}>
      {story()}
    </div>
  ),
];

export const ExperimentalAutoAlign: StoryFn<ToggletipStoryArgs> = (args) => {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    ref?.current?.scrollIntoView({ block: 'center', inline: 'center' });
  });

  const {
    align,
    alignDeprecated,
    bodyText,
    buttonLabel,
    buttonText,
    defaultOpen,
    labelText,
    linkText,
    ...rest
  } = args;
  const resolvedAlign = alignDeprecated || align;

  return (
    <div style={autoAlignStoryContainerStyle}>
      <div
        style={{
          inlineSize: '8rem',
        }}>
        <ToggletipLabel>{labelText}</ToggletipLabel>
        <Toggletip
          key={defaultOpen ? 'open' : 'closed'}
          {...(resolvedAlign ? { align: resolvedAlign } : {})}
          defaultOpen={defaultOpen ?? false}
          {...rest}>
          <ToggletipButton label={buttonLabel}>
            <Information ref={ref} />
          </ToggletipButton>
          <ToggletipContent>
            <p>{bodyText}</p>
            <ToggletipActions>
              <Link href="#">{linkText}</Link>
              <Button size="sm">{buttonText}</Button>
            </ToggletipActions>
          </ToggletipContent>
        </Toggletip>
      </div>
    </div>
  );
};

ExperimentalAutoAlign.args = {
  ...defaultArgs,
  autoAlign: true,
  bodyText:
    'Scroll the container up, down, left or right to observe how the Toggletip will automatically change its position in attempt to stay within the viewport. This works on initial render in addition to on scroll.',
  defaultOpen: true,
};
ExperimentalAutoAlign.argTypes = experimentalArgTypes;
