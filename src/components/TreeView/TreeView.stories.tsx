/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript (empty node props are left out instead of passed as null), components and icons from @afframe/ui, story styles as plain CSS, title casing, file renamed from Treeview.stories.js, source tag, WithLinks uses the controllable selection API that enable-treeview-controllable turns on and has a play test, inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { memo, useState } from 'react';
import type { ElementType, MouseEvent, ReactNode } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';
import { Button, TreeNode, TreeView } from '../../index.js';
import type { TreeViewProps } from '../../index.js';
import { Document, Folder } from '../../icons.js';
import mdx from './TreeView.mdx';
import './story.css';

interface Node {
  id: string;
  value: string;
  label: ReactNode;
  renderIcon: ElementType;
  href?: string;
  isExpanded?: boolean;
  disabled?: boolean;
  children?: Node[];
}

interface RenderTreeOptions {
  nodes?: Node[] | undefined;
  expanded?: boolean | undefined;
  withIcons?: boolean;
  withLinks?: boolean;
}

function renderTree({
  nodes,
  expanded,
  withIcons = false,
  withLinks = false,
}: RenderTreeOptions): ReactNode {
  if (!nodes) {
    return;
  }
  return nodes.map(
    ({ children, renderIcon, href, isExpanded, ...nodeProps }) => (
      <TreeNode
        key={nodeProps.id}
        {...(withIcons ? { renderIcon } : {})}
        {...(withLinks && href !== undefined ? { href } : {})}
        {...((expanded ?? isExpanded) !== undefined
          ? { isExpanded: expanded ?? isExpanded }
          : {})}
        {...(withLinks
          ? // This is so that we only simulate links within the storybook
            { onClick: (event: MouseEvent) => event.preventDefault() }
          : {})}
        {...nodeProps}>
        {renderTree({ nodes: children, expanded, withIcons, withLinks })}
      </TreeNode>
    )
  );
}

export default {
  title: 'Components/TreeView',
  component: TreeView,
  subcomponents: {
    TreeNode,
  },
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['label'],
    },
  },
  args: {
    onSelect: action('onSelect'),
  },
  tags: ['carbon'],
} satisfies Meta<typeof TreeView>;

export const Default: StoryFn<Partial<TreeViewProps>> = (args) => {
  const nodes: Node[] = [
    {
      id: '1',
      value: 'Application development and integration solutions',
      label: 'Application development and integration solutions',
      renderIcon: Document,
    },
    {
      id: '2',
      value: 'Blockchain',
      label: 'Blockchain',
      renderIcon: Document,
    },
    {
      id: '3',
      value: 'Business automation',
      label: 'Business automation',
      renderIcon: Folder,
      children: [
        {
          id: '3-1',
          value: 'Business process automation',
          label: 'Business process automation',
          renderIcon: Document,
        },
        {
          id: '3-2',
          value: 'Business process mapping',
          label: 'Business process mapping',
          renderIcon: Document,
        },
      ],
    },
    {
      id: '4',
      value: 'Business operations',
      label: 'Business operations',
      renderIcon: Document,
    },
    {
      id: '5',
      value: 'Cloud computing',
      label: 'Cloud computing',
      isExpanded: true,
      renderIcon: Folder,
      children: [
        {
          id: '5-1',
          value: 'Containers',
          label: 'Containers',
          renderIcon: Document,
        },
        {
          id: '5-2',
          value: 'Databases',
          label: 'Databases',
          renderIcon: Document,
        },
        {
          id: '5-3',
          value: 'DevOps',
          label: 'DevOps',
          isExpanded: true,
          renderIcon: Folder,
          children: [
            {
              id: '5-4',
              value: 'Solutions',
              label: 'Solutions',
              renderIcon: Document,
            },
            {
              id: '5-5',
              value: 'Case studies',
              label: 'Case studies',
              isExpanded: true,
              renderIcon: Folder,
              children: [
                {
                  id: '5-6',
                  value: 'Resources',
                  label: 'Resources',
                  renderIcon: Document,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '6',
      value: 'Data & Analytics',
      label: 'Data & Analytics',
      renderIcon: Folder,
      children: [
        {
          id: '6-1',
          value: 'Big data',
          label: 'Big data',
          renderIcon: Document,
        },
        {
          id: '6-2',
          value: 'Business intelligence',
          label: 'Business intelligence',
          renderIcon: Document,
        },
      ],
    },
    {
      id: '7',
      value: 'Models',
      label: 'Models',
      isExpanded: true,
      disabled: true,
      renderIcon: Folder,
      children: [
        {
          id: '7-1',
          value: 'Audit',
          label: 'Audit',
          renderIcon: Document,
        },
        {
          id: '7-2',
          value: 'Monthly data',
          label: 'Monthly data',
          renderIcon: Document,
        },
        {
          id: '8',
          value: 'Data warehouse',
          label: 'Data warehouse',
          isExpanded: true,
          renderIcon: Folder,
          children: [
            {
              id: '8-1',
              value: 'Report samples',
              label: 'Report samples',
              renderIcon: Document,
            },
            {
              id: '8-2',
              value: 'Sales performance',
              label: 'Sales performance',
              renderIcon: Document,
            },
          ],
        },
      ],
    },
  ];

  function renderTree({
    nodes,
    expanded,
    withIcons = false,
  }: RenderTreeOptions): ReactNode {
    if (!nodes) {
      return;
    }
    return nodes.map(({ children, renderIcon, isExpanded, ...nodeProps }) => (
      <TreeNode
        key={nodeProps.id}
        {...(withIcons ? { renderIcon } : {})}
        {...((expanded ?? isExpanded) !== undefined
          ? { isExpanded: expanded ?? isExpanded }
          : {})}
        {...nodeProps}>
        {renderTree({ nodes: children, expanded, withIcons })}
      </TreeNode>
    ));
  }
  return (
    <TreeView label="Tree View" {...args}>
      {renderTree({ nodes })}
    </TreeView>
  );
};

Default.args = {
  hideLabel: false,
  multiselect: false,
};

Default.argTypes = {
  active: { control: { type: 'text' } },
  size: {
    options: ['xs', 'sm'],
    control: { type: 'select' },
  },
};

export const WithIcons: StoryFn = () => {
  const nodes: Node[] = [
    {
      id: '1',
      value: 'Artificial intelligence',
      label: <span>Artificial intelligence</span>,
      renderIcon: Document,
    },
    {
      id: '2',
      value: 'Blockchain',
      label: 'Blockchain',
      renderIcon: Document,
    },
    {
      id: '3',
      value: 'Business automation',
      label: 'Business automation',
      renderIcon: Folder,
      children: [
        {
          id: '3-1',
          value: 'Business process automation',
          label: 'Business process automation',
          renderIcon: Document,
        },
        {
          id: '3-2',
          value: 'Business process mapping',
          label: 'Business process mapping',
          renderIcon: Document,
        },
      ],
    },
    {
      id: '4',
      value: 'Business operations',
      label: 'Business operations',
      renderIcon: Document,
    },
    {
      id: '5',
      value: 'Cloud computing',
      label: 'Cloud computing',
      isExpanded: true,
      renderIcon: Folder,
      children: [
        {
          id: '5-1',
          value: 'Containers',
          label: 'Containers',
          renderIcon: Document,
        },
        {
          id: '5-2',
          value: 'Databases',
          label: 'Databases',
          renderIcon: Document,
        },
        {
          id: '5-3',
          value: 'DevOps',
          label: 'DevOps',
          isExpanded: true,
          renderIcon: Folder,
          children: [
            {
              id: '5-4',
              value: 'Solutions',
              label: 'Solutions',
              renderIcon: Document,
            },
            {
              id: '5-5',
              value: 'Case studies',
              label: 'Case studies',
              isExpanded: true,
              renderIcon: Folder,
              children: [
                {
                  id: '5-6',
                  value: 'Resources',
                  label: 'Resources',
                  renderIcon: Document,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '6',
      value: 'Data & Analytics',
      label: 'Data & Analytics',
      renderIcon: Folder,
      children: [
        {
          id: '6-1',
          value: 'Big data',
          label: 'Big data',
          renderIcon: Document,
        },
        {
          id: '6-2',
          value: 'Business intelligence',
          label: 'Business intelligence',
          renderIcon: Document,
        },
      ],
    },
    {
      id: '7',
      value: 'Models',
      label: 'Models',
      isExpanded: true,
      disabled: true,
      renderIcon: Folder,
      children: [
        {
          id: '7-1',
          value: 'Audit',
          label: 'Audit',
          renderIcon: Document,
        },
        {
          id: '7-2',
          value: 'Monthly data',
          label: 'Monthly data',
          renderIcon: Document,
        },
        {
          id: '8',
          value: 'Data warehouse',
          label: 'Data warehouse',
          isExpanded: true,
          renderIcon: Folder,
          children: [
            {
              id: '8-1',
              value: 'Report samples',
              label: 'Report samples',
              renderIcon: Document,
            },
            {
              id: '8-2',
              value: 'Sales performance',
              label: 'Sales performance',
              renderIcon: Document,
            },
          ],
        },
      ],
    },
  ];

  function renderTree({
    nodes,
    expanded,
    withIcons = false,
  }: RenderTreeOptions): ReactNode {
    if (!nodes) {
      return;
    }
    return nodes.map(({ children, renderIcon, isExpanded, ...nodeProps }) => (
      <TreeNode
        key={nodeProps.id}
        {...(withIcons ? { renderIcon } : {})}
        {...((expanded ?? isExpanded) !== undefined
          ? { isExpanded: expanded ?? isExpanded }
          : {})}
        {...nodeProps}>
        {renderTree({ nodes: children, expanded, withIcons })}
      </TreeNode>
    ));
  }
  return (
    <TreeView label="Tree View">
      {renderTree({ nodes, withIcons: true })}
    </TreeView>
  );
};

const TreeViewWithLinks = memo(
  ({
    setCurrentPage,
  }: {
    setCurrentPage: (page: string | undefined) => void;
  }) => {
    const nodes: Node[] = [
      {
        id: '1',
        value: 'Artificial intelligence',
        label: <span>Artificial intelligence</span>,
        href: '/artificial-intelligence',
        renderIcon: Document,
      },
      {
        id: '2',
        value: 'Blockchain',
        label: 'Blockchain',
        href: '/blockchain',
        renderIcon: Document,
      },
      {
        id: '3',
        value: 'Business automation',
        label: 'Business automation',
        href: '/business-automation',
        renderIcon: Folder,
        children: [
          {
            id: '3-1',
            value: 'Business process automation',
            label: 'Business process automation',
            href: '/business-process-automation',
            renderIcon: Document,
          },
          {
            id: '3-2',
            value: 'Business process mapping',
            label: 'Business process mapping',
            href: '/business-process-mapping',
            renderIcon: Document,
          },
        ],
      },
      {
        id: '4',
        value: 'Business operations',
        label: 'Business operations',
        href: '/business-operations',
        renderIcon: Document,
      },
      {
        id: '5',
        value: 'Cloud computing',
        label: 'Cloud computing',
        href: '/cloud-computing',
        isExpanded: true,
        renderIcon: Folder,
        children: [
          {
            id: '5-1',
            value: 'Containers',
            label: 'Containers',
            href: '/containers',
            renderIcon: Document,
          },
          {
            id: '5-2',
            value: 'Databases',
            label: 'Databases',
            href: '/databases',
            renderIcon: Document,
          },
          {
            id: '5-3',
            value: 'DevOps',
            label: 'DevOps',
            href: '/devops',
            isExpanded: true,
            renderIcon: Folder,
            children: [
              {
                id: '5-4',
                value: 'Solutions',
                label: 'Solutions',
                href: '/solutions',
                renderIcon: Document,
              },
              {
                id: '5-5',
                value: 'Case studies',
                label: 'Case studies',
                href: '/case-studies',
                isExpanded: true,
                renderIcon: Folder,
                children: [
                  {
                    id: '5-6',
                    value: 'Resources',
                    label: 'Resources',
                    href: '/resources',
                    renderIcon: Document,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: '6',
        value: 'Data & Analytics',
        label: 'Data & Analytics',
        href: '/data-analytics',
        renderIcon: Folder,
        children: [
          {
            id: '6-1',
            value: 'Big data',
            label: 'Big data',
            href: '/big-data',
            renderIcon: Document,
          },
          {
            id: '6-2',
            value: 'Business intelligence',
            label: 'Business intelligence',
            href: '/business-intelligence',
            renderIcon: Document,
          },
        ],
      },
      {
        id: '7',
        value: 'Models',
        label: 'Models',
        href: '/models',
        isExpanded: true,
        disabled: true,
        renderIcon: Folder,
        children: [
          {
            id: '7-1',
            value: 'Audit',
            label: 'Audit',
            href: '/audit',
            renderIcon: Document,
          },
          {
            id: '7-2',
            value: 'Monthly data',
            label: 'Monthly data',
            href: '/monthly-data',
            renderIcon: Document,
          },
          {
            id: '8',
            value: 'Data warehouse',
            label: 'Data warehouse',
            href: '/data-warehouse',
            isExpanded: true,
            renderIcon: Folder,
            children: [
              {
                id: '8-1',
                value: 'Report samples',
                label: 'Report samples',
                href: '/report-samples',
                renderIcon: Document,
              },
              {
                id: '8-2',
                value: 'Sales performance',
                label: 'Sales performance',
                href: '/sales-performance',
                renderIcon: Document,
              },
            ],
          },
        ],
      },
    ];

    const [selected, setSelected] = useState<Array<string | number>>(['1']);
    const [active, setActive] = useState<string | number | undefined>('1');

    return (
      <TreeView
        label="Tree View"
        hideLabel
        active={active as string | number}
        onActivate={setActive}
        selected={selected}
        onSelect={(ids: TreeViewProps['selected']) => {
          setSelected(ids ?? []);
          setCurrentPage(findValue(nodes, ids?.[0]));
        }}>
        {renderTree({ nodes, withLinks: true })}
      </TreeView>
    );
  }
);

function findValue(
  nodes: Node[] | undefined,
  id: string | number | undefined
): string | undefined {
  for (const node of nodes ?? []) {
    if (node.id === id) {
      return node.value;
    }
    const value = findValue(node.children, id);
    if (value !== undefined) {
      return value;
    }
  }
  return undefined;
}

export const WithLinks: StoryFn = () => {
  const [currentPage, setCurrentPage] = useState<string | undefined>(
    'Artificial Intelligence'
  );

  return (
    <div id="page-body">
      <TreeViewWithLinks setCurrentPage={setCurrentPage} />
      <main>
        <h3>The current page is: {currentPage}</h3>
      </main>
    </div>
  );
};

WithLinks.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('treeitem', { name: 'Blockchain' }));
  await expect(
    canvas.getByRole('heading', { name: 'The current page is: Blockchain' })
  ).toBeInTheDocument();
  await expect(
    canvas.getByRole('treeitem', { name: 'Blockchain' })
  ).toHaveAttribute('aria-current', 'page');
};

export const WithControlledExpansion: StoryFn = () => {
  const nodes: Node[] = [
    {
      id: '1',
      value: 'Artificial intelligence',
      label: <span>Artificial intelligence</span>,
      renderIcon: Document,
    },
    {
      id: '2',
      value: 'Blockchain',
      label: 'Blockchain',
      renderIcon: Document,
    },
    {
      id: '3',
      value: 'Business automation',
      label: 'Business automation',
      renderIcon: Folder,
      children: [
        {
          id: '3-1',
          value: 'Business process automation',
          label: 'Business process automation',
          renderIcon: Document,
        },
        {
          id: '3-2',
          value: 'Business process mapping',
          label: 'Business process mapping',
          renderIcon: Document,
        },
      ],
    },
    {
      id: '4',
      value: 'Business operations',
      label: 'Business operations',
      renderIcon: Document,
    },
    {
      id: '5',
      value: 'Cloud computing',
      label: 'Cloud computing',
      isExpanded: true,
      renderIcon: Folder,
      children: [
        {
          id: '5-1',
          value: 'Containers',
          label: 'Containers',
          renderIcon: Document,
        },
        {
          id: '5-2',
          value: 'Databases',
          label: 'Databases',
          renderIcon: Document,
        },
        {
          id: '5-3',
          value: 'DevOps',
          label: 'DevOps',
          isExpanded: true,
          renderIcon: Folder,
          children: [
            {
              id: '5-4',
              value: 'Solutions',
              label: 'Solutions',
              renderIcon: Document,
            },
            {
              id: '5-5',
              value: 'Case studies',
              label: 'Case studies',
              isExpanded: true,
              renderIcon: Folder,
              children: [
                {
                  id: '5-6',
                  value: 'Resources',
                  label: 'Resources',
                  renderIcon: Document,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '6',
      value: 'Data & Analytics',
      label: 'Data & Analytics',
      renderIcon: Folder,
      children: [
        {
          id: '6-1',
          value: 'Big data',
          label: 'Big data',
          renderIcon: Document,
        },
        {
          id: '6-2',
          value: 'Business intelligence',
          label: 'Business intelligence',
          renderIcon: Document,
        },
      ],
    },
    {
      id: '7',
      value: 'Models',
      label: 'Models',
      isExpanded: true,
      disabled: true,
      renderIcon: Folder,
      children: [
        {
          id: '7-1',
          value: 'Audit',
          label: 'Audit',
          renderIcon: Document,
        },
        {
          id: '7-2',
          value: 'Monthly data',
          label: 'Monthly data',
          renderIcon: Document,
        },
        {
          id: '8',
          value: 'Data warehouse',
          label: 'Data warehouse',
          isExpanded: true,
          renderIcon: Folder,
          children: [
            {
              id: '8-1',
              value: 'Report samples',
              label: 'Report samples',
              renderIcon: Document,
            },
            {
              id: '8-2',
              value: 'Sales performance',
              label: 'Sales performance',
              renderIcon: Document,
            },
          ],
        },
      ],
    },
  ];

  const [expanded, setExpanded] = useState<boolean | undefined>(undefined);

  function renderTree({
    nodes,
    expanded,
    withIcons = false,
  }: RenderTreeOptions): ReactNode {
    if (!nodes) {
      return;
    }
    return nodes.map(({ children, renderIcon, isExpanded, ...nodeProps }) => (
      <TreeNode
        key={nodeProps.id}
        {...(withIcons ? { renderIcon } : {})}
        {...((expanded ?? isExpanded) !== undefined
          ? { isExpanded: expanded ?? isExpanded }
          : {})}
        {...nodeProps}>
        {renderTree({ nodes: children, expanded, withIcons })}
      </TreeNode>
    ));
  }

  return (
    <>
      <div style={{ marginBottom: 'var(--cds-spacing-05)' }}>
        <Button onClick={() => setExpanded(true)}>Expand all</Button>
        &nbsp;
        <Button onClick={() => setExpanded(false)}>Collapse all</Button>
      </div>
      <TreeView label="Tree View">{renderTree({ nodes, expanded })}</TreeView>
    </>
  );
};

const Nested = () => {
  return <TreeNode key={21} value="Nested" label="Nested" />;
};

export const WithComplexNesting: StoryFn<Partial<TreeViewProps>> = (args) => {
  return (
    <TreeView label="Tree View with Complex Nesting" {...args}>
      <TreeNode id="1" value="A.I." label="A.I." isExpanded>
        {/* Pattern 1: A TreeNode wrapped in a simple <div> */}
        <div>
          <TreeNode id="1-1" value="Sub 1" label="Sub 1 (in a div)" />
        </div>
        <TreeNode id="1-2" value="Sub 2" label="Sub 2 (direct child)">
          <TreeNode id="1-2-1" value="Sub 2.1" label="Sub 2.1" />
        </TreeNode>
      </TreeNode>

      <TreeNode id="2" value="Analytics" label="Analytics" isExpanded>
        {/* Pattern 2: A TreeNode rendered from an imported component */}
        <Nested />
      </TreeNode>

      <TreeNode id="3" value="Trust" label="Trust" />
    </TreeView>
  );
};

WithComplexNesting.args = {
  hideLabel: true,
  multiselect: true,
  selected: ['1-1'],
};
