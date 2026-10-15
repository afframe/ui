/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript checks for strict mode, components and icons from @afframe/ui (preview__AddSelect and preview__Tearsheet as AddSelect and Tearsheet), styles compiled to plain CSS. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useState, type ReactNode } from 'react';
import { Button } from '../../../../../../index.js';
import { type AddSelectItem } from '../../../../../../index.js';
import { Document } from '../../../../../../icons.js';
import { MultiAddSelectWithGlobalActions as MultiAddSelectWithGlobalActionsComponent } from '../../components/MultiAddSelectWithGlobalActions/MultiAddSelectWithGlobalActions.js';
import './MultiAddSelectWithGlobalActions.css';

// IBM's data passes a render function, which AddSelect.Row renders as
// nothing; kept so the rows match IBM's story.
const documentIcon = ((props: object) => (
  <Document size={16} {...props} />
)) as unknown as ReactNode;

// Hierarchical sample data for demo - expanded with more items for meaningful search, filter, and sort demo
const hierarchicalItems: AddSelectItem[] = [
  {
    id: '1',
    value: 'Documents',
    title: 'Documents',
    children: {
      entries: [
        {
          id: '1-1',
          value: 'annual-report.pdf',
          title: 'annual-report.pdf',
          fileType: 'pdf',
          size: '2500',
          icon: documentIcon,
        },
        {
          id: '1-2',
          value: 'budget-2024.pdf',
          title: 'budget-2024.pdf',
          fileType: 'pdf',
          size: '1800',
          icon: documentIcon,
        },
        {
          id: '1-3',
          value: 'meeting-notes.html',
          title: 'meeting-notes.html',
          fileType: 'html',
          size: '450',
          icon: documentIcon,
        },
        {
          id: '1-4',
          value: 'project-plan.xml',
          title: 'project-plan.xml',
          fileType: 'xml',
          size: '320',
          icon: documentIcon,
        },
      ],
    },
  },
  {
    id: '2',
    value: 'Source Code',
    title: 'Source Code',
    children: {
      entries: [
        {
          id: '2-1',
          value: 'app.js',
          title: 'app.js',
          fileType: 'js',
          size: '5600',
          icon: documentIcon,
        },
        {
          id: '2-2',
          value: 'config.js',
          title: 'config.js',
          fileType: 'js',
          size: '890',
          icon: documentIcon,
        },
        {
          id: '2-3',
          value: 'utils.js',
          title: 'utils.js',
          fileType: 'js',
          size: '1200',
          icon: documentIcon,
        },
        {
          id: '2-4',
          value: 'index.html',
          title: 'index.html',
          fileType: 'html',
          size: '780',
          icon: documentIcon,
        },
      ],
    },
  },
  {
    id: '3',
    value: 'Reports',
    title: 'Reports',
    children: {
      entries: [
        {
          id: '3-1',
          value: 'quarterly-summary.pdf',
          title: 'quarterly-summary.pdf',
          fileType: 'pdf',
          size: '3200',
          icon: documentIcon,
        },
        {
          id: '3-2',
          value: 'sales-data.xml',
          title: 'sales-data.xml',
          fileType: 'xml',
          size: '1500',
          icon: documentIcon,
        },
        {
          id: '3-3',
          value: 'analytics.html',
          title: 'analytics.html',
          fileType: 'html',
          size: '2100',
          icon: documentIcon,
        },
      ],
    },
  },
  {
    id: '4',
    value: 'Web Assets',
    title: 'Web Assets',
    children: {
      entries: [
        {
          id: '4-1',
          value: 'homepage.html',
          title: 'homepage.html',
          fileType: 'html',
          size: '4500',
          icon: documentIcon,
        },
        {
          id: '4-2',
          value: 'sitemap.xml',
          title: 'sitemap.xml',
          fileType: 'xml',
          size: '650',
          icon: documentIcon,
        },
        {
          id: '4-3',
          value: 'main.js',
          title: 'main.js',
          fileType: 'js',
          size: '8900',
          icon: documentIcon,
        },
        {
          id: '4-4',
          value: 'documentation.pdf',
          title: 'documentation.pdf',
          fileType: 'pdf',
          size: '6700',
          icon: documentIcon,
        },
      ],
    },
  },
];

export const MultiAddSelectWithGlobalActionsPreview = ({
  initialOpen = false,
}: {
  initialOpen?: boolean;
}) => {
  const [open, setOpen] = useState(initialOpen);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSubmit = (itemIds: string[], values: string[]) => {
    console.log('Submitted:', { itemIds, values });
  };

  return (
    <div className="example-container">
      <h3>Multi Add Select with Global Actions Pattern Example</h3>
      <p>
        Click the button below to open the multi add select dialog with
        hierarchical navigation, global search, filter, and sort capabilities.
        Features include: recursive filtering by file type (always visible),
        sorting by title/size (visible during search), and breadcrumb navigation
        through folder hierarchies.
      </p>

      <Button kind="primary" className="launch-button" onClick={handleOpen}>
        Add files
      </Button>

      <MultiAddSelectWithGlobalActionsComponent
        open={open}
        setOpen={setOpen}
        items={hierarchicalItems}
        onSubmit={handleSubmit}
        title="Add files"
        description="Select individual files from the folders below. Click the chevron to navigate into folders."
        itemsLabel="Files"
        globalSearchLabel="Search files"
        globalSearchPlaceholder="Find files"
        searchResultsTitle="Search results"
        selectionSummaryTitle="Selected files"
        noSelectionTitle="No files selected"
        noSelectionDescription="Select individual files to include them in your selection."
        noResultsTitle="No results"
        noResultsDescription="Try again"
        columnSearchPlaceholder="Find"
        primaryButtonText="Add"
        secondaryButtonText="Cancel"
        successNotificationTitle="Success"
        successNotificationSubtitle="{count} item{plural} added"
      />
    </div>
  );
};
