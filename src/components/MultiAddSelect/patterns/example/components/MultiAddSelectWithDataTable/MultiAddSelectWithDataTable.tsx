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

import {
  forwardRef,
  type ForwardedRef,
  type ReactNode,
  useState,
  useMemo,
  useEffect,
} from 'react';
import cx from 'classnames';
import { ToastNotification } from '../../../../../../index.js';
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
} from '../../../../../../index.js';
import {
  AddSelect,
  Tearsheet,
  AddSelectData,
  type AddSelectItem,
  NoDataEmptyState,
} from '../../../../../../index.js';
import './MultiAddSelectWithDataTable.css';

const blockClass = `multi-add-select-data-table-pattern`;

/**
 * MultiAddSelectWithDataTable Pattern - Uses Carbon DataTable for item selection
 */

export interface MultiAddSelectWithDataTableProps {
  /**
   * Whether the tearsheet is open
   */
  open: boolean;
  /**
   * Callback to set open state
   */
  setOpen: (open: boolean) => void;
  /**
   * Array of items to display
   */
  items: AddSelectItem[];
  /**
   * Callback when items are submitted
   */
  onSubmit?: (itemIds: string[], values: string[]) => void;
  /**
   * Title for the tearsheet
   */
  title?: string;
  /**
   * Description for the tearsheet
   */
  description?: ReactNode;
  /**
   * Label for items section
   */
  itemsLabel?: string;
  /**
   * Global search label
   */
  globalSearchLabel?: string;
  /**
   * Global search placeholder
   */
  globalSearchPlaceholder?: string;
  /**
   * Search results title
   */
  searchResultsTitle?: string;
  /**
   * No results title
   */
  noResultsTitle?: string;
  /**
   * No results description
   */
  noResultsDescription?: string;
  /**
   * Title for the selection summary panel
   */
  selectionSummaryTitle?: string;
  /**
   * Empty state title when no items selected
   */
  noSelectionTitle?: string;
  /**
   * Empty state description when no items selected
   */
  noSelectionDescription?: string;
  /**
   * Primary button text
   */
  primaryButtonText?: string;
  /**
   * Secondary button text
   */
  secondaryButtonText?: string;
  /**
   * Success notification title
   */
  successNotificationTitle?: string;
  /**
   * Success notification subtitle template (use {count} for item count)
   */
  successNotificationSubtitle?: string;
  /**
   * Optional class name
   */
  className?: string;
}

export const MultiAddSelectWithDataTable = forwardRef<
  HTMLDivElement,
  MultiAddSelectWithDataTableProps
>(
  (
    {
      open,
      setOpen,
      items,
      onSubmit,
      title = 'Add items',
      description = 'Select items from the list below',
      itemsLabel = 'Items',
      globalSearchLabel = 'Search',
      globalSearchPlaceholder = 'Search items',
      searchResultsTitle = 'Search results',
      noResultsTitle = 'No results found',
      noResultsDescription = 'Try adjusting your search',
      selectionSummaryTitle = 'Selected items',
      noSelectionTitle = 'No items selected',
      noSelectionDescription = 'Select items from the list',
      primaryButtonText = 'Add',
      secondaryButtonText = 'Cancel',
      successNotificationTitle = 'Success',
      successNotificationSubtitle = '{count} item{plural} added',
      className,
      ...rest
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    // Initialize data manager
    const dataManager = useMemo(() => new AddSelectData(), []);

    const [, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [filteredItems, setFilteredItems] = useState<AddSelectItem[]>([]);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [infoPanel, setInfoPanel] = useState<{
      item: AddSelectItem | null;
      show: boolean;
    }>({ item: null, show: false });

    // Initialize data manager with items
    useEffect(() => {
      dataManager.setItems(items);
      const rootItems = dataManager.getItems();
      setFilteredItems(rootItems);
    }, [items, dataManager]);

    // Reset state when tearsheet opens
    useEffect(() => {
      if (open) {
        setSelectedIds(new Set());
        setSearchTerm('');
        setInfoPanel({ item: null, show: false });
      }
    }, [open]);

    // Handle search
    const handleSearch = (term: string) => {
      setSearchTerm(term);

      if (term) {
        const results = dataManager.search(term, {
          caseSensitive: false,
          searchFields: ['title', 'value', 'subtitle'],
        });
        setFilteredItems(results);
      } else {
        const rootItems = dataManager.getItems();
        setFilteredItems(rootItems);
      }
    };

    // Handle removing item from selection summary
    const handleRemoveItem = (itemId: string) => {
      const newSelectedIds = new Set(selectedIds);
      newSelectedIds.delete(itemId);
      setSelectedIds(newSelectedIds);
      dataManager.setSelectedItems(itemId, false);
    };

    // Handle close
    const handleClose = () => {
      setOpen(false);
    };

    // Handle submit
    const handleSubmit = () => {
      if (selectedIds.size > 0) {
        const selectedIdsArray = Array.from(selectedIds);
        const selectedValues = selectedIdsArray.map((id) => {
          const item = dataManager.getItem(id);
          return item?.value || '';
        });

        onSubmit?.(selectedIdsArray, selectedValues);
        handleClose();

        // Show success notification
        const count = selectedIds.size;
        const message = successNotificationSubtitle
          .replace('{count}', count.toString())
          .replace('{plural}', count > 1 ? 's' : '');
        setNotificationMessage(message);
        setShowNotification(true);
      }
    };

    // Handle close info
    const handleCloseInfo = () => {
      setInfoPanel({ item: null, show: false });
    };

    // Get selected items for display
    const selectedItemsForDisplay = useMemo(() => {
      return Array.from(selectedIds)
        .map((id) => dataManager.getItem(id))
        .filter((item): item is AddSelectItem => item !== undefined);
    }, [selectedIds, dataManager]);

    // Prepare DataTable headers
    const headers = [
      { key: 'title', header: 'Name' },
      { key: 'subtitle', header: 'Description' },
      { key: 'category', header: 'Category' },
      { key: 'owner', header: 'Owner' },
      { key: 'status', header: 'Status' },
    ];

    // Prepare DataTable rows
    const rows = filteredItems.map((item) => ({
      id: item.id,
      title: item.title || '',
      subtitle: item.subtitle || '',
      category: (item.category as string) || '',
      owner: (item.owner as string) || '',
      status: (item.status as string) || '',
      disabled: item.disabled ?? false,
    }));

    return (
      <>
        <AddSelect
          onItemSelect={(itemId: string, selected: boolean) => {
            const newSelectedIds = new Set(selectedIds);
            if (selected) {
              newSelectedIds.add(itemId);
              dataManager.setSelectedItems(itemId, true);
            } else {
              newSelectedIds.delete(itemId);
              dataManager.setSelectedItems(itemId, false);
            }
            setSelectedIds(newSelectedIds);
          }}
          selectedItems={selectedIds}
          {...rest}>
          <Tearsheet
            ref={ref}
            open={open}
            onClose={handleClose}
            variant="wide"
            summaryContentWidth="22.5rem"
            className={cx(blockClass, className)}>
            <Tearsheet.Header hideCloseButton disableHeaderCollapse>
              <Tearsheet.HeaderContent title={title}>
                {description}
              </Tearsheet.HeaderContent>
            </Tearsheet.Header>

            <Tearsheet.Body>
              <Tearsheet.MainContent isFlush>
                <AddSelect.Body
                  itemsLabel={itemsLabel}
                  globalSearchLabel={globalSearchLabel}
                  globalSearchPlaceholder={globalSearchPlaceholder}
                  searchResultsTitle={searchResultsTitle}
                  itemCount={filteredItems.length}
                  onSearch={handleSearch}>
                  <div className={`${blockClass}__data-table-wrapper`}>
                    {filteredItems.length > 0 ? (
                      <DataTable
                        rows={rows}
                        headers={headers}
                        render={({
                          rows,
                          headers,
                          getHeaderProps,
                          getRowProps,
                          getSelectionProps,
                          getTableProps,
                          getTableContainerProps,
                        }) => (
                          <TableContainer
                            {...getTableContainerProps()}
                            className={`${blockClass}__table-container`}>
                            <Table
                              {...getTableProps()}
                              aria-label={itemsLabel}
                              className={`${blockClass}__table`}>
                              <TableHead>
                                <TableRow>
                                  <TableSelectAll
                                    {...getSelectionProps()}
                                    disabled={false}
                                    onSelect={(
                                      evt: React.MouseEvent<HTMLInputElement>
                                    ) => {
                                      const checked = (
                                        evt.target as HTMLInputElement
                                      ).checked;
                                      const newSelectedIds = new Set(
                                        selectedIds
                                      );

                                      filteredItems.forEach((item) => {
                                        if (!item.disabled) {
                                          if (checked) {
                                            newSelectedIds.add(item.id);
                                            dataManager.setSelectedItems(
                                              item.id,
                                              true
                                            );
                                          } else {
                                            newSelectedIds.delete(item.id);
                                            dataManager.setSelectedItems(
                                              item.id,
                                              false
                                            );
                                          }
                                        }
                                      });

                                      setSelectedIds(newSelectedIds);
                                    }}
                                    checked={
                                      filteredItems.length > 0 &&
                                      filteredItems
                                        .filter((item) => !item.disabled)
                                        .every((item) =>
                                          selectedIds.has(item.id)
                                        )
                                    }
                                  />
                                  {headers.map((header) => (
                                    <TableHeader
                                      {...getHeaderProps({ header })}
                                      isSortable={false}>
                                      {header.header}
                                    </TableHeader>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {rows.map((row) => {
                                  return (
                                    <TableRow {...getRowProps({ row })}>
                                      <TableSelectRow
                                        {...getSelectionProps({ row })}
                                        radio={false}
                                        checked={selectedIds.has(row.id)}
                                        disabled={row.disabled ?? false}
                                        onSelect={(
                                          evt: React.MouseEvent<HTMLInputElement>
                                        ) => {
                                          const checked = (
                                            evt.target as HTMLInputElement
                                          ).checked;
                                          const newSelectedIds = new Set(
                                            selectedIds
                                          );

                                          if (checked) {
                                            newSelectedIds.add(row.id);
                                            dataManager.setSelectedItems(
                                              row.id,
                                              true
                                            );
                                          } else {
                                            newSelectedIds.delete(row.id);
                                            dataManager.setSelectedItems(
                                              row.id,
                                              false
                                            );
                                          }

                                          setSelectedIds(newSelectedIds);
                                        }}
                                      />
                                      {row.cells.map((cell) => (
                                        <TableCell key={cell.id}>
                                          {cell.value}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                      />
                    ) : (
                      <div className={`${blockClass}__no-results`}>
                        <h4>{noResultsTitle}</h4>
                        <p>{noResultsDescription}</p>
                      </div>
                    )}
                  </div>
                </AddSelect.Body>
              </Tearsheet.MainContent>

              <Tearsheet.SummaryContent isFlush>
                {infoPanel.show && infoPanel.item ? (
                  <AddSelect.ItemPanel
                    title="Item details"
                    item={infoPanel.item}
                    onClose={handleCloseInfo}
                    closeIconDescription="Close details"
                  />
                ) : (
                  <AddSelect.SelectionSummary
                    title={selectionSummaryTitle}
                    selectedItemCount={selectedItemsForDisplay.length}
                    emptyState={
                      <div
                        style={{ marginBlockStart: '3rem', padding: '1rem' }}>
                        <NoDataEmptyState
                          illustrationTheme="light"
                          size="sm"
                          title={noSelectionTitle}
                          subtitle={noSelectionDescription}
                        />
                      </div>
                    }>
                    {selectedItemsForDisplay.map((item) => (
                      <AddSelect.SelectionSummaryItem
                        key={item.id}
                        item={item}
                        onRemove={handleRemoveItem}
                        useAccordion={true}
                      />
                    ))}
                  </AddSelect.SelectionSummary>
                )}
              </Tearsheet.SummaryContent>
            </Tearsheet.Body>

            <Tearsheet.Footer
              actions={[
                {
                  kind: 'secondary',
                  label: secondaryButtonText,
                  onClick: handleClose,
                },
                {
                  kind: 'primary',
                  label: primaryButtonText,
                  onClick: handleSubmit,
                  disabled: selectedIds.size === 0,
                },
              ]}
              buttonSize="2xl"
            />
          </Tearsheet>
        </AddSelect>

        {showNotification && (
          <ToastNotification
            aria-label="closes notification"
            caption={new Date().toLocaleTimeString()}
            className="notification"
            kind="success"
            lowContrast
            onClose={() => setShowNotification(false)}
            role="status"
            statusIconDescription="notification"
            subtitle={notificationMessage}
            title={successNotificationTitle}
          />
        )}
      </>
    );
  }
);

MultiAddSelectWithDataTable.displayName = 'MultiAddSelectWithDataTable';
