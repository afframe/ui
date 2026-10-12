'use client';
/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: declarations generated with tsc from packages/ibm-products-utilities/src/utils/add-select/add-select-data.ts at tag @carbon/ibm-products@2.100.0, class renamed, run-time value taken from @carbon/ibm-products. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

// IBM Products' declarations import AddSelectData from
// @carbon/ibm-products-utilities, a private package that is not published, so
// the export has no types. This module gives the same value IBM's own types.
import { AddSelectData as UntypedAddSelectData } from '@carbon/ibm-products';
import type { ReactNode } from 'react';

/**
 * Status types for items in the hierarchical data structure
 */
export type ItemStatus = 'checked' | 'unchecked' | 'indeterminate';
/**
 * A single labelled detail entry for display in `defaultContent()`.
 * Use this form when you want `AddSelectItemPanel` or
 * `AddSelectSelectionSummaryItem` to render key-value pairs automatically.
 */
export interface ItemDetailEntry {
  /** User-visible label shown as the row heading */
  label: string;
  /** Value displayed beneath the label */
  value: string | number;
}
/**
 * Item details metadata.
 *
 * **Preferred form** — labelled array consumed by `defaultContent()`:
 * ```ts
 * itemDetails: [
 *   { label: 'Category', value: 'Analytics' },
 *   { label: 'Owner',    value: 'Marketing Team' },
 * ]
 * ```
 *
 * **Legacy form** — arbitrary record for custom renderers that access
 * named keys directly (e.g. `item.itemDetails.description`). Not rendered
 * by `defaultContent()`.
 */
export type ItemDetails = ItemDetailEntry[] | Record<string, unknown>;
/**
 * Interface for hierarchical data items
 */
export interface AddSelectItem {
  /** Unique identifier for the item */
  id: string;
  /** Display title for the item */
  title?: string;
  /** Value associated with the item */
  value?: string;
  /** Subtitle or secondary text */
  subtitle?: string;
  /** Whether the item is currently selected */
  selected?: boolean;
  /** Selection status (checked, unchecked, or indeterminate for parent nodes) */
  status?: ItemStatus;
  /** Whether the item is disabled and cannot be selected */
  disabled?: boolean;
  /** Icon or visual element to display with the item */
  icon?: ReactNode;
  /** Nested children items */
  children?: {
    entries: AddSelectItem[];
  };
  /** Additional metadata and details about the item */
  itemDetails?: ItemDetails;
  [key: string]: unknown;
}
/**
 * Options for search functionality
 */
export interface SearchOptions {
  caseSensitive?: boolean;
  searchFields?: string[];
  maxResults?: number;
}
/**
 * AddSelectData - A lightweight, framework-agnostic utility for managing hierarchical data
 *
 * This utility provides standard APIs for common operations such as setting, selecting,
 * traversing, searching, and sorting hierarchical data structures. It encapsulates data
 * logic separate from UI, allowing both React and Web Components to reuse the same
 * data management functions.
 */
declare class AddSelectDataClass {
  private items;
  private itemMap;
  private parentMap;
  private selectedIds;
  private depthCache;
  private selectedItemsCache;
  /**
   * Initialize or replace the hierarchical data
   * @param items - Array of hierarchical items
   */
  setItems(items: AddSelectItem[]): void;
  /**
   * Get the full list of items
   * @returns Array of all items
   */
  getItems(): AddSelectItem[];
  /**
   * Retrieve a single item by its id
   * @param id - The item id
   * @returns The item or undefined if not found
   */
  getItem(id: string): AddSelectItem | undefined;
  /**
   * Update a given item with new properties
   * @param id - The item id
   * @param newProperties - Properties to update
   * @returns true if item was found and updated, false otherwise
   */
  setItem(id: string, newProperties: Partial<AddSelectItem>): boolean;
  /**
   * Returns an array of items marked as selected (memoized)
   * @returns Array of selected items
   */
  getSelectedItems(): AddSelectItem[];
  /**
   * Mark one or more items (by id) as selected
   * @param ids - Single id or array of ids to select
   * @param exclusive - If true, deselect all other items (default: false)
   */
  setSelectedItems(ids: string | string[], exclusive?: boolean): void;
  /**
   * Get direct children of a node
   * @param id - The parent item id
   * @returns Array of child items or empty array if no children
   */
  getItemChildren(id: string): AddSelectItem[];
  /**
   * Get the parent of a node
   * @param id - The child item id
   * @returns The parent item or undefined if no parent (root level)
   */
  getItemParent(id: string): AddSelectItem | undefined;
  /**
   * Get all ancestors (parents up to the root) of a node
   * @param id - The item id
   * @returns Array of ancestor items from immediate parent to root
   */
  getItemParents(id: string): AddSelectItem[];
  /**
   * Retrieve the selected state status of an item
   * @param id - The item id
   * @returns The status or undefined if item not found
   */
  getItemStatus(id: string): ItemStatus | undefined;
  /**
   * Set or update the status of an item
   * @param id - The item id
   * @param status - The new status
   * @returns true if item was found and updated, false otherwise
   */
  setItemStatus(id: string, status: ItemStatus): boolean;
  /**
   * Check whether an item is selected (O(1) lookup)
   * @param id - The item id
   * @returns true if selected, false otherwise
   */
  isSelected(id: string): boolean;
  /**
   * Search items based on a query and return matching items
   * @param query - The search query string
   * @param options - Search options
   * @returns Array of matching items
   */
  search(query: string, options?: SearchOptions): AddSelectItem[];
  /**
   * Sort items based on a comparator function
   * @param compareFn - Comparison function for sorting
   * @param recursive - If true, sort children recursively (default: false)
   */
  sort(
    compareFn: (a: AddSelectItem, b: AddSelectItem) => number,
    recursive?: boolean
  ): void;
  /**
   * Clear all selections (optimized with Set)
   */
  clearSelections(): void;
  /**
   * Get the depth/level of an item in the hierarchy (cached)
   * @param id - The item id
   * @returns The depth (0 for root level items) or -1 if not found
   */
  getItemDepth(id: string): number;
  /**
   * Check if an item has children
   * @param id - The item id
   * @returns true if item has children, false otherwise
   */
  hasChildren(id: string): boolean;
  /**
   * Get all descendant items of a node
   * @param id - The parent item id
   * @returns Array of all descendant items
   */
  getItemDescendants(id: string): AddSelectItem[];
  /**
   * Check if an item has any selected descendants (optimized)
   * @param id - The item id
   * @param selectedIds - Set of selected item IDs (defaults to internal selectedIds)
   * @returns true if any descendant is selected, false otherwise
   */
  hasSelectedDescendants(id: string, selectedIds?: Set<string>): boolean;
  /**
   * Check if all descendants of an item are selected (optimized)
   * @param id - The item id
   * @param selectedIds - Set of selected item IDs (defaults to internal selectedIds)
   * @returns true if all descendants are selected, false otherwise
   */
  allDescendantsSelected(id: string, selectedIds?: Set<string>): boolean;
  /**
   * Get all descendant IDs from an item (including the item itself)
   * @param id - The item id
   * @returns Array of all descendant IDs including the item itself
   */
  getAllDescendantIds(id: string): string[];
  /**
   * Get only top-level selected items (items without selected ancestors)
   * @param selectedIds - Set of selected item IDs (defaults to internal selectedIds)
   * @returns Array of top-level selected items
   */
  getTopLevelSelectedItems(selectedIds?: Set<string>): AddSelectItem[];
  /**
   * Invalidate all caches
   * @private
   */
  private _invalidateCaches;
  /**
   * Invalidate selection cache only
   * @private
   */
  private _invalidateSelectionCache;
  /**
   * Build internal maps for efficient lookups (optimized with depth caching)
   * @private
   */
  private _buildMaps;
  /**
   * Traverse all items and apply a callback function
   * @private
   */
  private _traverseItems;
  /**
   * Sort items recursively
   * @private
   */
  private _sortRecursive;
}

export const AddSelectData = UntypedAddSelectData as typeof AddSelectDataClass;
export type AddSelectData = AddSelectDataClass;
