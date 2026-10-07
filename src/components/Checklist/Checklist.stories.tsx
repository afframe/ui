/**
 * Copyright IBM Corp. 2023, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2023, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Checklist and TruncatedText from @afframe/ui, plain CSS file, the MDX page replaces the docs page component, the theme prop from getSelectedCarbonTheme dropped, task lists cast to the unexported kind enum, color-contrast disabled on Task states. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Checklist, TruncatedText } from '../../index.js';
import mdx from './Checklist.mdx';
import './checklist-story.css';

type ChecklistArgs = ComponentProps<typeof Checklist>;
type TaskLists = ChecklistArgs['taskLists'];
type ChecklistTask = TaskLists[number]['tasks'][number];

const storyClass = 'checklist-stories';

// IBM types kind as a string enum that is not exported, so the string literals
// are cast once per list.
const taskLists = [
  {
    title: 'Section label',
    tasks: [
      {
        kind: 'checked',
        label: 'Task name',
        url: 'https://www.ibm.com/',
        onClick: (task: ChecklistTask) => {
          action('task')(task);
          // The onClick event returns all of the task's object's properties.
          // E.g. console.log(task) returns:
          // {
          //   kind: 'checked',
          //   label: 'Task name',
          //   onClick: f(),
          //   url: 'https://www.ibm.com/',
          // }
        },
      },
      {
        kind: 'indeterminate',
        label: 'Task name',
        onClick: (task: ChecklistTask) => {
          action('task')(task);
          // E.g. define your own inline code
          // window.open('https://www.ibm.com/', '_blank').focus();
        },
      },
      {
        kind: 'unchecked',
        label: 'Task name',
        guid: '6B29FC40-CA47-1067-B31D-00DD010662DA',
        onClick: (task: ChecklistTask) => {
          action('task')(task);
          // E.g. trigger your own callback
          // handleClick(task.guid);
        },
      },
    ],
  },
] as unknown as TaskLists;

export default {
  title: 'Components/Onboarding/Checklist',
  component: Checklist,
  tags: ['autodocs', 'Onboarding', 'ibm-products'],
  argTypes: {
    taskLists: {
      table: {
        type: {
          detail: `[{
            title: string,
            tasks: [{
              kind: 'unchecked' | 'indeterminate' | 'checked' | 'disabled' | 'error',
              label: string,
              onClick: func,
            }]
          }]`,
        },
      },
    },
    theme: {
      control: false,
      table: {
        defaultValue: { summary: 'light' },
        type: { summary: "'light' | 'dark'" },
      },
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
    layout: 'padded',
  },
} satisfies Meta<typeof Checklist>;

const Template: StoryFn<ChecklistArgs> = (args) => {
  return (
    <div className={`${storyClass}__viewport`}>
      <Checklist {...args} />
    </div>
  );
};

export const checklist: StoryFn<ChecklistArgs> = Template.bind({});
checklist.args = {
  onClickViewAll: () => {
    action('view all')();
  },
  onToggle: (isOpen) => {
    action(`toggle ${isOpen ? 'open' : 'closed'}`)();
  },
  chartValue: 0.15,
  chartLabel: (
    <TruncatedText
      autoAlign
      align="bottom"
      id="example-id-1"
      lines={2}
      type="tooltip"
      value="15% complete"
    />
  ),
  taskLists: taskLists,
  title: (
    <TruncatedText
      autoAlign
      align="bottom"
      id="example-id-2"
      lines={2}
      type="tooltip"
      value="A long title running over the lines to show truncation and tooltips"
    />
  ),
  viewAllLabel: `View all (10)`,
};

export const taskStates: StoryFn<ChecklistArgs> = Template.bind({});
taskStates.storyName = 'Task states';
taskStates.args = {
  taskLists: [
    {
      title: 'Unchecked state',
      tasks: [
        {
          kind: 'unchecked',
          label: 'Task name',
          onClick: action('task'),
        },
        {
          kind: 'unchecked',
          label: 'Task name',
        },
      ],
    },
    {
      title: 'Indeterminate state',
      tasks: [
        {
          kind: 'indeterminate',
          label: 'Task name',
          onClick: action('task'),
        },
        { kind: 'indeterminate', label: 'Task name' },
      ],
    },
    {
      title: 'Checked state',
      tasks: [
        {
          kind: 'checked',
          label: 'Task name',
          onClick: action('task'),
        },
        { kind: 'checked', label: 'Task name' },
      ],
    },
    {
      title: 'Disabled state',
      tasks: [
        { kind: 'disabled', label: 'Task name' },
        {
          kind: 'disabled',
          label: 'Task name',
          onClick: action('task'),
        },
      ],
    },
    {
      title: 'Error state',
      tasks: [
        { kind: 'error', label: 'Task name' },
        {
          kind: 'error',
          label: 'Task name',
          onClick: action('task'),
        },
      ],
    },
  ] as unknown as TaskLists,
};

// The disabled task label is a div with disabled text colour (1.7:1), IBM's
// upstream styling.
taskStates.parameters = {
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
};
