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
  AddSelect,
  Tearsheet,
  AddSelectData,
  type AddSelectItem,
} from '../../../../../../index.js';

const blockClass = `single-add-select-pattern`;

/**
 * SingleAddSelect Pattern - A complete pattern with Tearsheet for single selection (first level only)
 */

export interface SingleAddSelectProps {
  /**
   * Whether the tearsheet is open
   */
  open: boolean;
  /**
   * Callback to set open state
   */
  setOpen: (open: boolean) => void;
  /**
   * Array of items to display (only first level will be shown)
   */
  items: AddSelectItem[];
  /**
   * Callback when an item is submitted
   */
  onSubmit?: (itemId: string, value: string) => void;
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
   * Success notification subtitle template
   */
  successNotificationSubtitle?: string;
  /**
   * Optional class name
   */
  className?: string;
}

export const SingleAddSelect = forwardRef<HTMLDivElement, SingleAddSelectProps>(
  (
    {
      open,
      setOpen,
      items,
      onSubmit,
      title = 'Select category',
      description = 'Choose one category from the list below',
      itemsLabel = 'Categories',
      globalSearchLabel = 'Search',
      globalSearchPlaceholder = 'Search...',
      searchResultsTitle = 'Search results',
      noResultsTitle = 'No results found',
      noResultsDescription = 'Try adjusting your search or browse categories',
      primaryButtonText = 'Select',
      secondaryButtonText = 'Cancel',
      successNotificationTitle = 'Item Selected',
      successNotificationSubtitle = 'Selected: {value}',
      className,
      ...rest
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    // Initialize data manager
    const dataManager = useMemo(() => new AddSelectData(), []);

    const [, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState<string>();
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<AddSelectItem[]>([]);
    const [currentItems, setCurrentItems] = useState<AddSelectItem[]>([]);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    // Initialize data manager with items
    useEffect(() => {
      dataManager.setItems(items);
      const rootItems = dataManager.getItems();
      setFilteredItems(rootItems);
      setCurrentItems(rootItems);
    }, [items, dataManager]);

    // Reset state when tearsheet opens
    useEffect(() => {
      if (open) {
        setSelectedId(undefined);
        setSelectedValue('');
        setSearchTerm('');
        const rootItems = dataManager.getItems();
        setFilteredItems(rootItems);
        setCurrentItems(rootItems);
      }
    }, [open, dataManager]);

    // Handle item selection
    const handleItemSelect = (
      itemId: string,
      selected: boolean,
      value: string
    ) => {
      if (selected) {
        setSelectedId(itemId);
        setSelectedValue(value);
        dataManager.setSelectedItems(itemId, true);
      } else {
        setSelectedId(undefined);
        setSelectedValue('');
        dataManager.clearSelections();
      }
    };

    // Handle search
    const handleSearch = (term: string) => {
      setSearchTerm(term);

      if (term) {
        const results = dataManager.search(term, {
          caseSensitive: false,
          searchFields: ['title', 'value'],
        });
        setFilteredItems(results);
      } else {
        setFilteredItems(currentItems);
      }
    };

    // Create selected items set
    const selectedItems = useMemo(() => {
      const set = new Set<string>();
      if (selectedId) {
        set.add(selectedId);
      }
      return set;
    }, [selectedId]);

    // Handle close
    const handleClose = () => {
      setOpen(false);
    };

    // Handle submit
    const handleSubmit = () => {
      if (selectedId) {
        onSubmit?.(selectedId, selectedValue);
        handleClose();

        // Show success notification
        const message = successNotificationSubtitle.replace(
          '{value}',
          selectedValue
        );
        setNotificationMessage(message);
        setShowNotification(true);
      }
    };

    return (
      <>
        <AddSelect
          onItemSelect={handleItemSelect}
          selectedItems={selectedItems}
          {...rest}>
          <Tearsheet
            ref={ref}
            open={open}
            onClose={handleClose}
            variant="narrow"
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
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => {
                      return (
                        <AddSelect.Row
                          key={item.id}
                          itemId={item.id}
                          title={item.title || ''}
                          subtitle={item.subtitle ?? ''}
                          value={item.value || ''}
                          icon={item.icon}
                          disabled={item.disabled ?? false}
                        />
                      );
                    })
                  ) : (
                    <div className={`${blockClass}__no-results`}>
                      <h4>{noResultsTitle}</h4>
                      <p>{noResultsDescription}</p>
                    </div>
                  )}
                </AddSelect.Body>
              </Tearsheet.MainContent>
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
                  disabled: !selectedId,
                },
              ]}
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

SingleAddSelect.displayName = 'SingleAddSelect';
